"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditLogService", {
    enumerable: true,
    get: function() {
        return AuditLogService;
    }
});
const _common = require("@nestjs/common");
const _eventemitter = require("@nestjs/event-emitter");
const _typeorm = require("typeorm");
const _jsondiff = /*#__PURE__*/ _interop_require_wildcard(require("json-diff"));
const _influxdbclient = require("@influxdata/influxdb-client");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogmodel = require("../../Model/Admin/AuditLog.model");
const _AuditLogdecorators = require("../../Helper/AuditLog.decorators");
const _audit_log = require("../../Database/Table/Admin/audit_log");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuditLogService = class AuditLogService {
    AuditEmitEvent(AuditLogData) {
        if (process.env.AUDIT_LOG === 'true') {
            this._EventEmitter.emit(_AuditLogEnum.EventNameEnum.AuditLog, AuditLogData);
        }
    }
    async getCoordinates(UserIp) {
        try {
            if (UserIp === "127.0.0.1" || UserIp === "::1") {
                return JSON.stringify({
                    message: "Local or private IP, no geolocation data available"
                });
            }
            const response = await fetch(`https://ipapi.co/${UserIp}/json/`);
            if (!response.ok) {
                throw new Error("Failed to fetch geolocation data");
            }
            const data = await response.json();
            return JSON.stringify({
                ip: UserIp,
                latitude: data.latitude,
                longitude: data.longitude,
                country: data.country_name,
                region: data.region,
                city: data.city,
                timezone: data.timezone
            });
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            return JSON.stringify({
                error: "Unable to fetch coordinates"
            });
        }
    }
    async GenerateQuery(table, action_type, ids, UserIp) {
        // Ensure the environment variable is defined
        const databaseName = process.env.DB_NAME;
        // Retrieve the user's IP address
        // const userIpAddress =
        //   req.headers['x-forwarded-for']?.split(',').shift()?.trim() || // Handle cases where the IP is forwarded
        //   req.socket?.remoteAddress ||
        //   req.ip;
        // if (!userIpAddress) {
        //   throw new Error("Unable to retrieve the user's IP address.");
        // }
        // Retrieve table columns
        let TableColumns = await this._DataSource.manager.query(`
      SELECT COLUMN_NAME AS columns
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = '${databaseName}'
      AND TABLE_NAME = '${table}';
    `);
        // Handle the case where no columns are found
        if (!TableColumns || TableColumns.length === 0) {
            throw new Error(`No columns found for table '${table}' in schema '${databaseName}'.`);
        }
        // Validate `RemoveColumnsName` and `RemoveColumnsByTable`
        const RemoveColumnsName = Array.isArray(this.RemoveColumnsName) ? this.RemoveColumnsName : [];
        const RemoveColumnsByTable = Array.isArray(this.RemoveColumnsNameByTable?.[table]) ? this.RemoveColumnsNameByTable[table] : [];
        // Filter out invalid table columns
        TableColumns = TableColumns.filter((o)=>o.columns !== undefined);
        // Filter columns for JSON object
        const JsonObjectFilter = TableColumns.filter((o)=>!RemoveColumnsName.includes(o.columns) && !RemoveColumnsByTable.includes(o.columns));
        // Handle empty JsonObjectFilter case
        if (JsonObjectFilter.length === 0) {
            throw new Error(`No valid columns found for JSON object generation for table '${table}'.`);
        }
        // Create JSON object data for all columns
        const json_object = JsonObjectFilter.map((o)=>`'${o.columns}', COALESCE(main.${o.columns}, '')`);
        const json_object_query = `json_object(${json_object.join(', ')})`;
        const tableIdentifier = this.LogTableIdentifierName?.[table];
        if (!tableIdentifier) {
            throw new Error(`LogTableIdentifierName for table '${table}' is not defined.`);
        }
        const isNestedColumn = tableIdentifier.includes('.');
        const columnName = isNestedColumn ? tableIdentifier.split('.')[1] : tableIdentifier;
        const coordinates = await this.getCoordinates(UserIp);
        // Generate dynamic query
        const DynamicQuery = `
    SELECT
        main.id AS performed_module_id,
        '${table}' AS performed_type,
        '${action_type}' AS performed_action,
        ${tableIdentifier} AS performed_module_name,
        '${columnName}' AS performed_module_header_name,
        ${json_object_query} AS performed_parameter,
        COALESCE(main.updated_by_id, main.created_by_id) AS performed_by_id,
        COALESCE(main.updated_on, main.created_on) AS performed_on,
        CASE
            WHEN CONCAT(usr.first_name, ' ', IFNULL(usr.last_name, '')) IS NOT NULL THEN CONCAT(usr.first_name, ' ', IFNULL(usr.last_name, ''))
            ELSE usr.email
        END AS performed_by,
        '${UserIp}' AS performed_ipaddress,
    '${coordinates.replace(/'/g, "\\'")}' AS performed_coordinates
    FROM
        ${table} AS main
    LEFT OUTER JOIN
        user AS usr
    ON usr.id = COALESCE(main.updated_by_id, main.created_by_id)
    WHERE
        main.id IN (${ids.map((id)=>`'${id}'`).join(',')});
    `;
        return DynamicQuery;
    }
    async GetLastAddedLog(PerformedType, PrimaryId) {
        try {
            const GetLastEventLog = new Promise((resolve, reject)=>{
                const result = [];
                const observerdata = {
                    next (row, tableMeta) {
                        const o = tableMeta.toObject(row);
                        result.push({
                            performed_action: o.performed_action,
                            performed_by: o.performed_by,
                            performed_by_id: o.performed_by_id,
                            performed_module_name: o.performed_module_name,
                            performed_module_header_name: o.performed_module_header_name,
                            performed_module_id: o.performed_module_id,
                            performed_on: o.performed_on,
                            performed_type: o.performed_type,
                            performed_ipaddress: o.performed_ipaddress,
                            performed_coordinates: o.performed_coordinates,
                            performed_parameter: JSON.parse(o._value)
                        });
                    },
                    error (error) {
                        reject(error);
                    },
                    complete () {
                        resolve(result[0] || null);
                    }
                };
                const startdate = new Date();
                startdate.setFullYear(startdate.getFullYear() - 100);
                const query = `
          from(bucket: "${process.env.INFLUX_BUCKET}")
          |> range(start: ${startdate.toISOString()}, stop: ${new Date().toISOString()})
          |> filter(fn: (r) => r["_measurement"] == "${process.env.INFLUX_DB}")
          |> filter(fn: (r) => r["performed_type"] == "${PerformedType}")
          |> filter(fn: (r) => r["performed_module_id"] == "${PrimaryId}")
          |> group()
          |> sort(columns: ["performed_on"], desc: true)
          |> limit(n: 1)
        `;
                this.queryApi.queryRows(query, observerdata);
            });
            return await GetLastEventLog;
        } catch (e) {
            throw new Error(e);
        }
    }
    async Insert(AuditLogData, req) {
        try {
            if (AuditLogData.ActionType === _AuditLogEnum.LogActionEnum.Delete) {
                for (const DeletedRecordId of AuditLogData.PrimaryId){
                    const LastUpdatedOrInserted = await this.GetLastAddedLog(AuditLogData.PerformedType, DeletedRecordId);
                    if (LastUpdatedOrInserted) {
                        for (const key of Object.keys(LastUpdatedOrInserted['performed_parameter'])){
                            if (typeof LastUpdatedOrInserted['performed_parameter'][key] === 'object') {
                                LastUpdatedOrInserted['performed_parameter'][key] = LastUpdatedOrInserted['performed_parameter'][key]?.__new;
                            }
                        }
                        const dataPoint = new _influxdbclient.Point(process.env.INFLUX_DB).tag('performed_by', LastUpdatedOrInserted.performed_by).tag('performed_by_id', LastUpdatedOrInserted.performed_by_id).tag('performed_on', new Date().toISOString()).tag('performed_module_name', LastUpdatedOrInserted.performed_module_name).tag('performed_module_header_name', LastUpdatedOrInserted.performed_module_header_name).tag('performed_module_id', LastUpdatedOrInserted.performed_module_id).tag('performed_type', LastUpdatedOrInserted.performed_type).tag('performed_action', _AuditLogEnum.LogActionEnum.Delete).stringField('performed_parameter', JSON.stringify(LastUpdatedOrInserted.performed_parameter)).tag('performed_ipaddress', LastUpdatedOrInserted.performed_ipaddress).tag('performed_coordinates', LastUpdatedOrInserted.performed_coordinates);
                        // Write the point to InfluxDB and flush
                        this.writeApi.writePoint(dataPoint);
                        await this.writeApi.flush();
                        //Insert to mysql
                        const LogData = {
                            performed_by: LastUpdatedOrInserted.performed_by,
                            performed_by_id: LastUpdatedOrInserted.performed_by_id,
                            performed_on: new Date().toISOString(),
                            performed_module_name: LastUpdatedOrInserted.performed_module_name,
                            performed_module_header_name: LastUpdatedOrInserted.performed_module_header_name,
                            performed_module_id: LastUpdatedOrInserted.performed_module_id,
                            performed_type: LastUpdatedOrInserted.performed_type,
                            performed_action: _AuditLogEnum.LogActionEnum.Delete,
                            performed_parameter: JSON.stringify(LastUpdatedOrInserted.performed_parameter),
                            performed_ipaddress: LastUpdatedOrInserted.performed_ipaddress,
                            performed_coordinates: LastUpdatedOrInserted.performed_coordinates,
                            created_by_id: LastUpdatedOrInserted.performed_by_id,
                            created_on: new Date(LastUpdatedOrInserted.performed_on).toISOString()
                        };
                        // Save to MySQL
                        try {
                            await _audit_log.audit_log.save(LogData);
                            console.log('Audit log saved to MySQL successfully.');
                        } catch (error) {
                            console.error('Error saving audit log to MySQL:', error.message);
                        }
                    } else {
                        console.log("Step break: No log found for Deleted Record ID:", DeletedRecordId);
                        break;
                    }
                }
            } else if (AuditLogData.ActionType === _AuditLogEnum.LogActionEnum.Update) {
                const ResultData = await this._DataSource.manager.query(`${await this.GenerateQuery(AuditLogData.PerformedType, AuditLogData.ActionType, AuditLogData.PrimaryId, AuditLogData.UserIp)}`);
                for (const Result of ResultData){
                    if (typeof Result.performed_parameter === 'object') {
                        Result.performed_parameter = JSON.stringify(Result.performed_parameter);
                    }
                    if (typeof Result.performed_parameter !== 'string') {
                        console.error('performed_parameter is not a valid JSON string:', Result.performed_parameter);
                        throw new Error('Invalid performed_parameter format');
                    }
                    let parsedParameter;
                    try {
                        parsedParameter = JSON.parse(Result.performed_parameter);
                    } catch (error) {
                        console.error('Error parsing performed_parameter:', error, Result.performed_parameter);
                        throw new SyntaxError('Invalid JSON in performed_parameter');
                    }
                    const LastUpdatedOrInserted = await this.GetLastAddedLog(Result.performed_type, Result.performed_module_id);
                    if (LastUpdatedOrInserted) {
                        for (const key of Object.keys(LastUpdatedOrInserted['performed_parameter'])){
                            if (typeof LastUpdatedOrInserted['performed_parameter'][key] === 'object') {
                                LastUpdatedOrInserted['performed_parameter'][key] = LastUpdatedOrInserted['performed_parameter'][key]?.__new;
                            }
                        }
                        const diffRecord = _jsondiff.diff(LastUpdatedOrInserted.performed_parameter, parsedParameter, {
                            full: true
                        });
                        if (diffRecord) {
                            for (const key of Object.keys(diffRecord)){
                                if (typeof diffRecord[key] === 'object') {
                                    if (diffRecord[key] === null) {
                                        diffRecord[key] = "";
                                    } else if (!diffRecord[key]["__old"]) {
                                        diffRecord[key]["__old"] = "";
                                    }
                                }
                            }
                            Result.performed_parameter = JSON.stringify(diffRecord);
                        } else {
                            break;
                        }
                    }
                    // Create InfluxDB data point for Update
                    const dataPoint = new _influxdbclient.Point(process.env.INFLUX_DB).tag('performed_by', Result.performed_by).tag('performed_by_id', Result.performed_by_id).tag('performed_on', new Date(Result.performed_on).toISOString()).tag('performed_module_name', Result.performed_module_name).tag('performed_module_header_name', Result.performed_module_header_name).tag('performed_module_id', Result.performed_module_id).tag('performed_type', Result.performed_type).tag('performed_action', Result.performed_action).stringField('performed_parameter', Result.performed_parameter).tag('performed_ipaddress', Result.performed_ipaddress).tag('performed_coordinates', Result.performed_coordinates);
                    // Write the point to InfluxDB and flush
                    this.writeApi.writePoint(dataPoint);
                    await this.writeApi.flush();
                    // Insert to MySQL DB
                    const LogData = {
                        performed_by: Result.performed_by,
                        performed_by_id: Result.performed_by_id,
                        performed_on: new Date(Result.performed_on).toISOString(),
                        performed_module_name: Result.performed_module_name,
                        performed_module_header_name: Result.performed_module_header_name,
                        performed_module_id: Result.performed_module_id,
                        performed_type: Result.performed_type,
                        performed_action: Result.performed_action,
                        performed_parameter: Result.performed_parameter,
                        performed_ipaddress: Result.performed_ipaddress,
                        performed_coordinates: Result.performed_coordinates,
                        created_by_id: Result.performed_by_id,
                        created_on: new Date(Result.performed_on).toISOString()
                    };
                    try {
                        await _audit_log.audit_log.save(LogData);
                        console.log('Audit log saved to MySQL successfully.');
                    } catch (error) {
                        console.error('Error saving audit log to MySQL:', error.message);
                    }
                }
            } else if (AuditLogData.ActionType === _AuditLogEnum.LogActionEnum.Insert) {
                const ResultData = await this._DataSource.manager.query(`${await this.GenerateQuery(AuditLogData.PerformedType, AuditLogData.ActionType, AuditLogData.PrimaryId, AuditLogData.UserIp)}`);
                for (const Result of ResultData){
                    const dataPoint = new _influxdbclient.Point(process.env.INFLUX_DB).tag('performed_by', Result.performed_by).tag('performed_by_id', Result.performed_by_id).tag('performed_on', new Date(Result.performed_on).toISOString()).tag('performed_module_name', Result.performed_module_name).tag('performed_module_header_name', Result.performed_module_header_name).tag('performed_module_id', Result.performed_module_id).tag('performed_type', Result.performed_type).tag('performed_action', Result.performed_action).stringField('performed_parameter', JSON.stringify(Result.performed_parameter)).tag('performed_ipaddress', Result.performed_ipaddress).tag('performed_coordinates', Result.performed_coordinates);
                    // Write the point to InfluxDB and flush
                    this.writeApi.writePoint(dataPoint);
                    await this.writeApi.flush();
                    // Insert to MySQL DB
                    const LogData = {
                        performed_by: Result.performed_by,
                        performed_by_id: Result.performed_by_id,
                        performed_on: new Date(Result.performed_on).toISOString(),
                        performed_module_name: Result.performed_module_name,
                        performed_module_header_name: Result.performed_module_header_name,
                        performed_module_id: Result.performed_module_id,
                        performed_type: Result.performed_type,
                        performed_action: Result.performed_action,
                        performed_parameter: Result.performed_parameter,
                        performed_ipaddress: Result.performed_ipaddress,
                        performed_coordinates: Result.performed_coordinates,
                        created_by_id: Result.performed_by_id,
                        created_on: new Date(Result.performed_on).toISOString()
                    };
                    try {
                        await _audit_log.audit_log.save(LogData);
                        console.log('Audit log saved to MySQL successfully.');
                    } catch (error) {
                        console.error('Error saving audit log to MySQL:', error.message);
                    }
                }
            }
        } catch (e) {
            console.error('Error in Insert method:', e);
        }
    }
    async LazyLoadList(AuditLogLazyLoadData) {
        let WhereCondition = [];
        let searchKey = AuditLogLazyLoadData.keyword?.length || 0 > 0 ? AuditLogLazyLoadData.keyword : "";
        WhereCondition["performed_on"] = {
            $gte: AuditLogLazyLoadData.start_date,
            $lt: AuditLogLazyLoadData.end_date
        };
        if (AuditLogLazyLoadData.user_id > "0") {
            WhereCondition.push(`|> filter(fn: (r) => r["performed_by_id"] == "${AuditLogLazyLoadData.user_id}")`);
        }
        if (AuditLogLazyLoadData.action?.length > 0) {
            WhereCondition.push(`|> filter(fn: (r) => r["performed_action"] == "${AuditLogLazyLoadData.action}")`);
        }
        if (AuditLogLazyLoadData.module?.length > 0) {
            WhereCondition.push(`|> filter(fn: (r) => r["performed_type"] == "${AuditLogLazyLoadData.module}")`);
        }
        if (searchKey) {
            WhereCondition.push(`|> filter(fn: (r) => strings.containsStr(v : strings.toLower(v : r["performed_module_name_string"]), substr: strings.toLower(v : "${searchKey}")))`);
        }
        const GetEventLogList = await new Promise((resolve, reject)=>{
            const result = [];
            const observerdata = {
                next (row, tableMeta) {
                    const o = tableMeta.toObject(row);
                    result.push({
                        performed_action: o.performed_action,
                        performed_by: o.performed_by,
                        performed_by_id: o.performed_by_id,
                        performed_module_name: o.performed_module_name,
                        performed_module_header_name: o.performed_module_header_name,
                        performed_module_id: o.performed_module_id,
                        performed_on: new Date(o.performed_on).toLocaleString(),
                        performed_type: o.performed_type,
                        performed_ipaddress: o.performed_ipaddress,
                        performed_coordinates: o.performed_coordinates,
                        performed_parameter: JSON.parse(o._value)
                    });
                },
                error (error) {
                    reject(error);
                },
                complete () {
                    resolve(result);
                }
            };
            const query = `
  import "strings"
  from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: ${new Date(AuditLogLazyLoadData.start_date).toISOString()}, stop: ${new Date(AuditLogLazyLoadData.end_date).toISOString()})
      |> filter(fn: (r) => r["_measurement"] == "${process.env.INFLUX_DB}")
      |> filter(fn: (r) => r["_field"] == "performed_parameter")
      |> fill(column: "performed_module_name", value: "")
      |> map(fn: (r) => ({ r with performed_module_name_string: string(v: r.performed_module_name) }))
      ${WhereCondition.join('\n')}
      |> group()
      |> sort(columns: ["performed_on"], desc: true)
      |> limit(n: ${AuditLogLazyLoadData.take}, offset: ${AuditLogLazyLoadData.skip})
`;
            this.queryApi.queryRows(query, observerdata);
        });
        const GetEventLogCount = await new Promise((resolve, reject)=>{
            let total_count = 0;
            const observercount = {
                next (row, tableMeta) {
                    const o = tableMeta.toObject(row);
                    total_count = o._value;
                },
                error (error) {
                    reject(error);
                },
                complete () {
                    resolve(total_count);
                }
            };
            const countquery = `
  import "strings"
  from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: ${new Date(AuditLogLazyLoadData.start_date).toISOString()}, stop: ${new Date(AuditLogLazyLoadData.end_date).toISOString()})
      |> filter(fn: (r) => r["_measurement"] == "${process.env.INFLUX_DB}")
      |> fill(column: "performed_module_name", value: "")
      |> map(fn: (r) => ({ r with performed_module_name_string: string(v: r.performed_module_name) }))
      ${WhereCondition.join('\n')}
      |> group()
      |> count(column: "_value")
`;
            this.queryApi.queryRows(countquery, observercount);
        });
        const Result = {};
        Result['data'] = GetEventLogList;
        Result['total_record'] = GetEventLogCount;
        return Result;
    }
    async AuditLogList(AuditLogFilterDate) {
        try {
            let GetAllAuditLogs = new Promise((resolve, reject)=>{
                const result = [];
                const observerdata = {
                    next (row, tableMeta) {
                        const o = tableMeta.toObject(row);
                        let parsedValue = o._value;
                        result.push({
                            performed_action: o.performed_action,
                            performed_by: o.performed_by,
                            performed_by_id: o.performed_by_id,
                            performed_module_name: o.performed_module_name,
                            performed_module_header_name: o.performed_module_header_name,
                            performed_module_id: o.performed_module_id,
                            performed_on: o.performed_on,
                            performed_type: o.performed_type,
                            performed_ipaddress: o.performed_ipaddress,
                            performed_coordinates: o.performed_coordinates,
                            performed_parameter: parsedValue
                        });
                    },
                    error (error) {
                        reject(error);
                    },
                    complete () {
                        resolve(result);
                    }
                };
                let query;
                if (AuditLogFilterDate.Start_date && AuditLogFilterDate.end_date) {
                    const startdate = new Date(AuditLogFilterDate.Start_date);
                    const Enddate = new Date(AuditLogFilterDate.end_date);
                    // Validate the date range
                    if (isNaN(startdate.getTime()) || isNaN(Enddate.getTime())) {
                        throw new Error("Invalid date format in Start_date or end_date.");
                    }
                    if (startdate >= Enddate) {
                        throw new Error("Start_date must be earlier than end_date.");
                    }
                    query = `
          from(bucket: "${process.env.INFLUX_BUCKET}")
          |> range(start: ${startdate.toISOString()}, stop: ${Enddate.toISOString()})
          |> filter(fn: (r) => r["_measurement"] == "${process.env.INFLUX_DB}")
          |> group()
          |> sort(columns: ["performed_on"], desc: true)
        `;
                } else {
                    const startdate = new Date();
                    startdate.setFullYear(startdate.getFullYear() - 100);
                    query = `
          from(bucket: "${process.env.INFLUX_BUCKET}")
          |> range(start: ${startdate.toISOString()}, stop: ${new Date().toISOString()})
          |> filter(fn: (r) => r["_measurement"] == "${process.env.INFLUX_DB}")
          |> group()
          |> sort(columns: ["performed_on"], desc: true)
        `;
                }
                this.queryApi.queryRows(query, observerdata);
            });
            let ResultData = [];
            ResultData = await GetAllAuditLogs;
            ResultData = ResultData?.map((o, i)=>({
                    ...o,
                    id: i + 1
                }));
            return await ResultData;
        } catch (e) {
            console.error("Error fetching audit logs:", e.message);
            throw new Error(`Error fetching audit logs: ${e.message}`);
        }
    }
    async DetailList(EventLog) {
        const BooleanColumns = [
            'is_',
            'status'
        ];
        EventLog["audit_log_events"] = [];
        for (const AuditLogEvents of Object.keys(EventLog.performed_parameter).filter((o)=>!_AuditLogdecorators.AuditLogRemoveColumnsName.includes(o))){
            if (EventLog.performed_action == _AuditLogEnum.LogActionEnum.Insert || EventLog.performed_action == _AuditLogEnum.LogActionEnum.Delete) {
                if (typeof EventLog.performed_parameter[AuditLogEvents] == 'object') {
                    if (AuditLogEvents == EventLog.performed_module_header_name) {
                        EventLog["audit_log_events"].push(`User <b>${EventLog.performed_by}</b> ${EventLog.performed_action.toUpperCase()} a  <b>${EventLog.performed_type.split('_').join(' ')}</b> ${AuditLogEvents.split('_').join(' ')} to <b>${BooleanColumns.some((o)=>AuditLogEvents.includes(o)) ? EventLog.performed_parameter[AuditLogEvents]?.__old == 1 ? 'Yes' : 'No' : EventLog.performed_parameter[AuditLogEvents]?.__old} </b>`);
                    } else {
                        EventLog["audit_log_events"].push(`User <b>${EventLog.performed_by}</b> ${EventLog.performed_action.toUpperCase()} a  <b>${EventLog.performed_type.split('_').join(' ')}</b> ${AuditLogEvents.split('_').join(' ')} of <b>${BooleanColumns.some((o)=>AuditLogEvents.includes(o)) ? EventLog.performed_parameter[AuditLogEvents]?.__old == 1 ? 'Yes' : 'No' : EventLog.performed_parameter[AuditLogEvents]?.__old} </b>`);
                    }
                } else {
                    if (AuditLogEvents == EventLog.performed_module_header_name) {
                        EventLog["audit_log_events"].push(`User <b>${EventLog.performed_by}</b> ${EventLog.performed_action.toUpperCase()} a  <b>${EventLog.performed_type.split('_').join(' ')}</b> ${AuditLogEvents.split('_').join(' ')} to <b>${BooleanColumns.some((o)=>AuditLogEvents.includes(o)) ? EventLog.performed_parameter[AuditLogEvents] == 1 ? 'Yes' : 'No' : EventLog.performed_parameter[AuditLogEvents]}</b>`);
                    } else {
                        EventLog["audit_log_events"].push(`User <b>${EventLog.performed_by}</b> ${EventLog.performed_action.toUpperCase()} a  <b>${EventLog.performed_type.split('_').join(' ')}</b> ${AuditLogEvents.split('_').join(' ')} of <b>${BooleanColumns.some((o)=>AuditLogEvents.includes(o)) ? EventLog.performed_parameter[AuditLogEvents] == 1 ? 'Yes' : 'No' : EventLog.performed_parameter[AuditLogEvents]}</b>`);
                    }
                }
            } else {
                if (typeof EventLog.performed_parameter[AuditLogEvents] == 'object') {
                    if (AuditLogEvents == EventLog.performed_module_header_name) {
                        EventLog["audit_log_events"].push(`User <b>${EventLog.performed_by}</b> ${EventLog.performed_action.toUpperCase()} a  <b>${EventLog.performed_type.split('_').join(' ')}</b> ${AuditLogEvents.split('_').join(' ')} to <b>${BooleanColumns.some((o)=>AuditLogEvents.includes(o)) ? EventLog.performed_parameter[AuditLogEvents]?.__old == 1 ? 'Yes' : 'No' : EventLog.performed_parameter[AuditLogEvents]?.__old}</b> to <b>${BooleanColumns.some((o)=>AuditLogEvents.includes(o)) ? EventLog.performed_parameter[AuditLogEvents]?.__new == 1 ? 'Yes' : 'No' : EventLog.performed_parameter[AuditLogEvents]?.__new}</b>`);
                    } else {
                        EventLog["audit_log_events"].push(`User <b>${EventLog.performed_by}</b> ${EventLog.performed_action.toUpperCase()} a  <b>${EventLog.performed_type.split('_').join(' ')}</b> ${AuditLogEvents.split('_').join(' ')} of <b>${BooleanColumns.some((o)=>AuditLogEvents.includes(o)) ? EventLog.performed_parameter[AuditLogEvents]?.__old == 1 ? 'Yes' : 'No' : EventLog.performed_parameter[AuditLogEvents]?.__old}</b> to <b>${BooleanColumns.some((o)=>AuditLogEvents.includes(o)) ? EventLog.performed_parameter[AuditLogEvents]?.__new == 1 ? 'Yes' : 'No' : EventLog.performed_parameter[AuditLogEvents]?.__new}</b>`);
                    }
                } else {
                    if (AuditLogEvents == EventLog.performed_module_header_name) {
                        EventLog["audit_log_events"].push(`User <b>${EventLog.performed_by}</b> ${EventLog.performed_action.toUpperCase()} a  <b>${EventLog.performed_type.split('_').join(' ')}</b> ${AuditLogEvents.split('_').join(' ')} to <b>${BooleanColumns.some((o)=>AuditLogEvents.includes(o)) ? EventLog.performed_parameter[AuditLogEvents] == 1 ? 'Yes' : 'No' : EventLog.performed_parameter[AuditLogEvents]}</b>`);
                    } else {
                        EventLog["audit_log_events"].push(`User <b>${EventLog.performed_by}</b> ${EventLog.performed_action.toUpperCase()} a  <b>${EventLog.performed_type.split('_').join(' ')}</b> ${AuditLogEvents.split('_').join(' ')} of <b>${BooleanColumns.some((o)=>AuditLogEvents.includes(o)) ? EventLog.performed_parameter[AuditLogEvents] == 1 ? 'Yes' : 'No' : EventLog.performed_parameter[AuditLogEvents]}</b>`);
                    }
                }
            }
        }
        return EventLog;
    }
    GetColumneName(table, columns) {
        let tablename = "";
        if (!this.ChangeTableReferenceName[table]) {
            tablename = columns.replace('_id', '');
        } else if (this.ChangeTableReferenceName[table][1]?.find((f)=>f.includes(columns))) {
            tablename = this.ChangeTableReferenceName[table][0].table;
        } else {
            tablename = columns.replace('_id', '');
        }
        return this.LogTableIdentifierName[tablename]?.replace("main.", "");
    }
    GetTableName(table, columns) {
        let tablename = "";
        if (!this.ChangeTableReferenceName[table]) {
            tablename = columns.replace('_id', '');
        } else if (this.ChangeTableReferenceName[table][1]?.find((f)=>f.includes(columns))) {
            tablename = this.ChangeTableReferenceName[table][0].table;
        } else {
            tablename = columns.replace('_id', '');
        }
        return tablename;
    }
    constructor(_EventEmitter, _DataSource){
        this._EventEmitter = _EventEmitter;
        this._DataSource = _DataSource;
        this.RemoveColumnsName = _AuditLogdecorators.AuditLogRemoveColumnsName;
        this.RemoveColumnsNameByTable = _AuditLogdecorators.AuditLogRemoveColumnsNameByTable;
        this.SameReferenceColumn = _AuditLogdecorators.AuditLogSameTableReferenceName;
        this.LogTableIdentifierName = _AuditLogdecorators.AuditLogIdentityName;
        this.ChangeTableReferenceName = _AuditLogdecorators.AuditLogChangeTableReferenceName;
        this.DB = new _influxdbclient.InfluxDB({
            url: process.env.INFLUX_URL,
            token: process.env.INFLUX_TOKEN
        });
        this.writeApi = this.DB.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET);
        this.queryApi = this.DB.getQueryApi(process.env.INFLUX_ORG);
    }
};
_ts_decorate([
    (0, _eventemitter.OnEvent)(_AuditLogEnum.EventNameEnum.AuditLog, {
        async: true
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogmodel.AuditLogModel === "undefined" ? Object : _AuditLogmodel.AuditLogModel,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuditLogService.prototype, "Insert", null);
AuditLogService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _eventemitter.EventEmitter2 === "undefined" ? Object : _eventemitter.EventEmitter2,
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], AuditLogService);

//# sourceMappingURL=AuditLog.service.js.map