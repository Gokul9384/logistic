"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VendorService", {
    enumerable: true,
    get: function() {
        return VendorService;
    }
});
const _common = require("@nestjs/common");
const _vendor = require("../../Database/Table/CodeMove/vendor");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _user = require("../../Database/Table/Admin/user");
const _user_role = require("../../Database/Table/Admin/user_role");
const _Encryptionservice = require("../Encryption.service");
const _vendor_vehicle = require("../../Database/Table/CodeMove/vendor_vehicle");
const _typeorm = require("typeorm");
const _vendor_service_area = require("../../Database/Table/CodeMove/vendor_service_area");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let VendorService = class VendorService {
    async GetAll() {
        const query = await this._Datasource.query(`
        SELECT 
            v.id,
            v.company_name,
            v.address,
            v.email,
            v.gst_number,
            v.pan_number,
            v.mobile,
            v.user_id,
            vv.vehicle_type_id,
            vv.min_capacity,
            vv.max_capacity,
            vs.service_area_id,
            vs.min_km,
            vs.max_km
        FROM
            vendor v 
        LEFT JOIN vendor_vehicle vv ON v.id = vv.vendor_id
        LEFT JOIN vendor_service_area vs ON v.id = vs.vendor_id
    `);
        const vendorMap = new Map();
        for (const row of query){
            if (!vendorMap.has(row.id)) {
                vendorMap.set(row.id, {
                    id: row.id,
                    status: true,
                    company_name: row.company_name,
                    address: row.address,
                    email: row.email,
                    gst_number: row.gst_number,
                    pan_number: row.pan_number,
                    mobile: row.mobile,
                    user_id: row.user_id,
                    vendor_vehicle_list: [],
                    vendor_service_area_list: []
                });
            }
            const vendor = vendorMap.get(row.id);
            // Deduplicate vehicle list
            const vehicleKey = `${row.vehicle_type_id}-${row.min_capacity}-${row.max_capacity}`;
            if (row.vehicle_type_id && !vendor.vendor_vehicle_list.some((v)=>v.vehicle_type_id === row.vehicle_type_id && v.min_capacity === row.min_capacity && v.max_capacity === row.max_capacity)) {
                vendor.vendor_vehicle_list.push({
                    vehicle_type_id: row.vehicle_type_id,
                    min_capacity: row.min_capacity,
                    max_capacity: row.max_capacity
                });
            }
            // Deduplicate service area list
            if (row.service_area_id && !vendor.vendor_service_area_list.some((s)=>s.service_area_id === row.service_area_id && s.min_km === row.min_km && s.max_km === row.max_km)) {
                vendor.vendor_service_area_list.push({
                    service_area_id: row.service_area_id,
                    min_km: row.min_km,
                    max_km: row.max_km
                });
            }
        }
        return Array.from(vendorMap.values());
    }
    async GetById(id) {
        const query = await this._Datasource.query(`
    SELECT 
      v.id,
      v.company_name,
      v.address,
      v.email,
      v.gst_number,
      v.pan_number,
      v.mobile,
      v.user_id,
      vv.vehicle_type_id,
      vv.min_capacity,
      vv.max_capacity,
      vs.service_area_id,
      vs.min_km,
      vs.max_km
    FROM
      vendor v 
    LEFT JOIN vendor_vehicle vv ON v.id = vv.vendor_id
    LEFT JOIN vendor_service_area vs ON v.id = vs.vendor_id
    WHERE v.id = ?
  `, [
            id
        ]);
        if (!query.length) {
            return null;
        }
        const result = {
            id: query[0].id,
            status: true,
            company_name: query[0].company_name,
            address: query[0].address,
            email: query[0].email,
            gst_number: query[0].gst_number,
            pan_number: query[0].pan_number,
            service_area: query[0].service_area,
            mobile: query[0].mobile,
            user_id: query[0].user_id,
            vendor_vehicle_list: [],
            vendor_service_area_list: []
        };
        const vehicleSet = new Set();
        const serviceAreaSet = new Set();
        for (const row of query){
            // Deduplicate vendor vehicles
            if (row.vehicle_type_id) {
                const vehicleKey = `${row.vehicle_type_id}-${row.min_capacity}-${row.max_capacity}`;
                if (!vehicleSet.has(vehicleKey)) {
                    result.vendor_vehicle_list.push({
                        vehicle_type_id: row.vehicle_type_id,
                        min_capacity: row.min_capacity,
                        max_capacity: row.max_capacity
                    });
                    vehicleSet.add(vehicleKey);
                }
            }
            // Deduplicate vendor service areas
            if (row.service_area_id) {
                const serviceKey = `${row.service_area_id}-${row.min_km}-${row.max_km}`;
                if (!serviceAreaSet.has(serviceKey)) {
                    result.vendor_service_area_list.push({
                        service_area_id: row.service_area_id,
                        min_km: row.min_km,
                        max_km: row.max_km
                    });
                    serviceAreaSet.add(serviceKey);
                }
            }
        }
        return result;
    }
    async Insert(VendorData, UserId, UserIp) {
        const UserRoleData = await _user_role.user_role.findOne({
            where: {
                name: "Vendor"
            }
        });
        if (!UserRoleData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        const _userData = new _user.user();
        _userData.first_name = VendorData.company_name;
        _userData.user_role_id = UserRoleData.id;
        _userData.email = VendorData.email;
        _userData.password = this._EncryptionService.Encrypt(VendorData.password);
        _userData.mobile = VendorData.mobile;
        _userData.created_by_id = UserId;
        _userData.created_on = new Date();
        await _user.user.insert(_userData);
        const _VendorData = new _vendor.vendor();
        _VendorData.user_id = _userData.id;
        _VendorData.company_name = VendorData.company_name;
        _VendorData.address = VendorData.address;
        _VendorData.email = VendorData.email;
        _VendorData.mobile = VendorData.mobile;
        _VendorData.gst_number = VendorData.gst_number;
        _VendorData.pan_number = VendorData.pan_number;
        _VendorData.created_by_id = UserId;
        _VendorData.created_on = new Date();
        await _vendor.vendor.insert(_VendorData);
        if (VendorData.vendor_vehicle_list?.length > 0) {
            const vehicleEntities = VendorData.vendor_vehicle_list.map((v)=>{
                const _vendor_vehicle1 = new _vendor_vehicle.vendor_vehicle();
                _vendor_vehicle1.vendor_id = _VendorData.id;
                _vendor_vehicle1.vehicle_type_id = v.vehicle_type_id;
                _vendor_vehicle1.min_capacity = v.min_capacity;
                _vendor_vehicle1.max_capacity = v.max_capacity;
                _vendor_vehicle1.created_by_id = UserId;
                _vendor_vehicle1.created_on = new Date();
                return _vendor_vehicle1;
            });
            await _vendor_vehicle.vendor_vehicle.save(vehicleEntities);
        }
        if (VendorData.vendor_service_area_list?.length > 0) {
            const serviceAreaEntities = VendorData.vendor_service_area_list.map((area)=>{
                const _vendor_service_area1 = new _vendor_service_area.vendor_service_area();
                _vendor_service_area1.vendor_id = _VendorData.id;
                _vendor_service_area1.service_area_id = area.service_area_id;
                _vendor_service_area1.min_km = area.min_km;
                _vendor_service_area1.max_km = area.max_km;
                _vendor_service_area1.created_by_id = UserId;
                _vendor_service_area1.created_on = new Date();
                return _vendor_service_area1;
            });
            await _vendor_service_area.vendor_service_area.save(serviceAreaEntities);
        }
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _vendor.vendor.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _VendorData.id
            ],
            UserIp: UserIp
        });
        return _VendorData;
    }
    async Update(Id, VendorData, UserId, UserIp) {
        const VendorUpdateData = await _vendor.vendor.findOne({
            where: {
                id: Id
            }
        });
        if (!VendorUpdateData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        VendorUpdateData.company_name = VendorData.company_name;
        VendorUpdateData.address = VendorData.address;
        VendorUpdateData.email = VendorData.email;
        VendorUpdateData.mobile = VendorData.mobile;
        VendorUpdateData.gst_number = VendorData.gst_number;
        VendorUpdateData.pan_number = VendorData.pan_number;
        VendorUpdateData.updated_by_id = UserId;
        VendorUpdateData.updated_on = new Date();
        await _vendor.vendor.update(Id, VendorUpdateData);
        await _user.user.update({
            id: VendorUpdateData.user_id
        }, {
            is_profile_updated: true
        });
        await _vendor_vehicle.vendor_vehicle.delete({
            vendor_id: VendorUpdateData.id
        });
        // Insert updated vendor vehicles
        if (VendorData.vendor_vehicle_list?.length > 0) {
            const vehicleEntities = VendorData.vendor_vehicle_list.map((v)=>{
                const _vendor_vehicle1 = new _vendor_vehicle.vendor_vehicle();
                _vendor_vehicle1.vendor_id = VendorUpdateData.id;
                _vendor_vehicle1.vehicle_type_id = v.vehicle_type_id;
                _vendor_vehicle1.min_capacity = v.min_capacity;
                _vendor_vehicle1.max_capacity = v.max_capacity;
                _vendor_vehicle1.created_by_id = UserId;
                _vendor_vehicle1.created_on = new Date();
                return _vendor_vehicle1;
            });
            await _vendor_vehicle.vendor_vehicle.save(vehicleEntities);
        }
        await _vendor_service_area.vendor_service_area.delete({
            vendor_id: VendorUpdateData.id
        });
        if (VendorData.vendor_service_area_list?.length > 0) {
            const serviceAreaEntities = VendorData.vendor_service_area_list.map((area)=>{
                const _vendor_service_area1 = new _vendor_service_area.vendor_service_area();
                _vendor_service_area1.vendor_id = VendorUpdateData.id;
                _vendor_service_area1.service_area_id = area.service_area_id;
                _vendor_service_area1.min_km = area.min_km;
                _vendor_service_area1.max_km = area.max_km;
                _vendor_service_area1.created_by_id = UserId;
                _vendor_service_area1.created_on = new Date();
                return _vendor_service_area1;
            });
            await _vendor_service_area.vendor_service_area.save(serviceAreaEntities);
        }
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _vendor.vendor.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                VendorUpdateData.id
            ],
            UserIp: UserIp
        });
        return VendorUpdateData;
    }
    async Delete(Id, UserIp) {
        const VendorData = await _vendor.vendor.findOne({
            where: {
                id: Id
            }
        });
        if (!VendorData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        await VendorData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _vendor.vendor.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                VendorData.id
            ],
            UserIp: UserIp
        });
        return true;
    }
    constructor(_AuditLogService, _EncryptionService, _Datasource){
        this._AuditLogService = _AuditLogService;
        this._EncryptionService = _EncryptionService;
        this._Datasource = _Datasource;
    }
};
VendorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Encryptionservice.EncryptionService === "undefined" ? Object : _Encryptionservice.EncryptionService,
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], VendorService);

//# sourceMappingURL=Vendor.service.js.map