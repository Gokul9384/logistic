// src/Service/CodeMove/Requirement.service.ts
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RequirementService", {
    enumerable: true,
    get: function() {
        return RequirementService;
    }
});
const _common = require("@nestjs/common");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _requirement = require("../../Database/Table/CodeMove/requirement");
const _typeorm = require("typeorm");
const _Commonservice = require("../Common.service");
const _notification = require("../../Database/Table/CodeMove/notification");
const _OrderStatusEnum = require("../../Helper/Enum/OrderStatusEnum");
const _QuoteEnum = require("../../Helper/Enum/QuoteEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RequirementService = class RequirementService {
    async GetAll() {
        return await _requirement.requirement.find({
            relations: [
                "order",
                "vendor"
            ]
        });
    }
    async RequirementDetail() {
        const RequirementData = await this._DataSource.query(`
    SELECT 
    r.id,
	r.order_id,
	r.vendor_id,
    v.company_name as vendor_name,
	r.requirement_number,
    r.requirement_status,
    o.order_number,
    o.source_location,
    o.destination_location,
    o.material,
    o.expected_date,
    o.order_status,
    o.priority,
    o.weight,
    o.pickup_date,
    o.pickup_time,
    o.order_date
    FROM 
      requirement r
    LEFT JOIN 
      \`order\` o ON o.id = r.order_id
    LEFT JOIN 	
	   vendor v ON v.id = r.vendor_id

  `);
        return RequirementData;
    }
    async GetById(Id) {
        const RequirementData = await _requirement.requirement.findOne({
            where: {
                id: Id
            },
            relations: [
                "order",
                "vendor"
            ]
        });
        if (!RequirementData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        return RequirementData;
    }
    //     let RequirementNumber = await this._DataSource.query(`
    //     SELECT r.requirement_number 
    //     FROM \`requirement\` AS r 
    //     ORDER BY CAST(REGEXP_REPLACE(r.requirement_number, '[^0-9]', '') AS UNSIGNED) DESC
    // `);
    //     if (RequirementNumber[0]?.requirement_number) {
    //         RequirementNumber[0].requirement_number = this._CommonService.AutoGenerateNumber(RequirementNumber[0].requirement_number);
    //     } else {
    //         RequirementNumber[0] = { requirement_number: "RQ-00001" };
    //     }
    //     const _RequirementData = new requirement();
    //     _RequirementData.requirement_number = RequirementNumber[0].requirement_number;
    //     _RequirementData.order_id = RequirementData.order_id;
    //     _RequirementData.vendor_id = RequirementData.vendor_id;
    //     _RequirementData.requirement_status = RequirementData.requirement_status;
    //     _RequirementData.created_by_id = UserId;
    //     _RequirementData.created_on = new Date();
    //     await requirement.insert(_RequirementData);
    //     const _order = new order();
    //     _order.order_status = OrderStatusEnum.Assigned;
    //     await order.update(_RequirementData.order_id, _order);
    //     // 🔔 Notification
    //     const newNotification = new notification();
    //     newNotification.title = 'New Requirement Created';
    //     newNotification.message = `Requirement ${_RequirementData.requirement_number} has been added.`;
    //     newNotification.user_id = _RequirementData.vendor_id;
    //     newNotification.user_type = 'Vendor';
    //     newNotification.route_id = _RequirementData.id;
    //     newNotification.route_module = 'requirements';
    //     newNotification.is_read = false;
    //     newNotification.created_by_id = UserId;
    //     newNotification.created_on = new Date();
    //     await notification.insert(newNotification);
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: requirement.name,
    //         ActionType: LogActionEnum.Insert,
    //         PrimaryId: [_RequirementData.id],
    //         UserIp: UserIp
    //     });
    //     return _RequirementData;
    // }
    // async Update(Id: string, RequirementData: RequirementModel, UserId: string, UserIp: string) {
    //     const RequirementUpdateData = await requirement.findOne({ where: { id: Id } });
    //     if (!RequirementUpdateData) throw new Error(ResponseEnum.NotFound);
    //     RequirementUpdateData.order_id = RequirementData.order_id;
    //     RequirementUpdateData.vendor_id = RequirementData.vendor_id;
    //     RequirementUpdateData.requirement_status = RequirementData.requirement_status;
    //     RequirementUpdateData.updated_by_id = UserId;
    //     RequirementUpdateData.updated_on = new Date();
    //     await requirement.update(Id, RequirementUpdateData);
    //     // 🔔 Notification
    //     const newNotification = new notification();
    //     newNotification.title = 'Requirement Updated';
    //     newNotification.message = `Requirement ${RequirementUpdateData.requirement_number} has been updated.`;
    //     newNotification.user_id = RequirementUpdateData?.vendor_id;
    //     newNotification.user_type = 'Vendor';
    //     newNotification.is_read = false;
    //     newNotification.created_by_id = UserId;
    //     newNotification.created_on = new Date();
    //     await notification.insert(newNotification);
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: requirement.name,
    //         ActionType: LogActionEnum.Update,
    //         PrimaryId: [RequirementUpdateData.id],
    //         UserIp: UserIp
    //     });
    //     return RequirementUpdateData;
    // }
    // Requirement Service
    async Insert(RequirementData, UserId, UserIp) {
        let RequirementNumber = await this._DataSource.query(`
            SELECT r.requirement_number 
            FROM \`requirement\` AS r 
            ORDER BY CAST(REGEXP_REPLACE(r.requirement_number, '[^0-9]', '') AS UNSIGNED) DESC
          `);
        if (RequirementNumber[0]?.requirement_number) {
            RequirementNumber[0].requirement_number = this._CommonService.AutoGenerateNumber(RequirementNumber[0].requirement_number);
        } else {
            RequirementNumber[0] = {
                requirement_number: "RQ-00001"
            };
        }
        const _RequirementData = new _requirement.requirement();
        _RequirementData.requirement_number = RequirementNumber[0].requirement_number;
        _RequirementData.order_id = RequirementData.order_id;
        _RequirementData.vendor_id = RequirementData.vendor_id;
        // Set initial status to Pending when requirement is created
        _RequirementData.requirement_status = _QuoteEnum.RequirementEnum.Sent;
        _RequirementData.created_by_id = UserId;
        _RequirementData.created_on = new Date();
        await _requirement.requirement.insert(_RequirementData);
        // 🔔 Notification
        const newNotification = new _notification.notification();
        newNotification.title = 'New Requirement Created';
        newNotification.message = `Requirement ${_RequirementData.requirement_number} has been added.`;
        newNotification.user_id = _RequirementData.vendor_id;
        newNotification.user_type = 'Vendor';
        newNotification.route_id = _RequirementData.id;
        newNotification.route_module = 'requirements';
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await _notification.notification.insert(newNotification);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _requirement.requirement.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _RequirementData.id
            ],
            UserIp: UserIp
        });
        return _RequirementData;
    }
    async Update(Id, RequirementData, UserId, UserIp) {
        const RequirementUpdateData = await _requirement.requirement.findOne({
            where: {
                id: Id
            }
        });
        if (!RequirementUpdateData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        const oldStatus = RequirementUpdateData.requirement_status;
        RequirementUpdateData.order_id = RequirementData.order_id;
        RequirementUpdateData.vendor_id = RequirementData.vendor_id;
        RequirementUpdateData.requirement_status = RequirementData.requirement_status;
        RequirementUpdateData.updated_by_id = UserId;
        RequirementUpdateData.updated_on = new Date();
        await _requirement.requirement.update(Id, RequirementUpdateData);
        // If status changed to Sent, update order status to Quoted
        if (oldStatus !== _QuoteEnum.RequirementEnum.Accepted && RequirementData.requirement_status === _QuoteEnum.RequirementEnum.Accepted) {
            await this._DataSource.query(`
            UPDATE \`order\` 
            SET order_status = ? 
            WHERE id = ?
        `, [
                _OrderStatusEnum.OrderStatusEnum.Requested,
                RequirementUpdateData.order_id
            ]);
        }
        // 🔔 Notification
        const newNotification = new _notification.notification();
        newNotification.title = 'Requirement Updated';
        newNotification.message = `Requirement ${RequirementUpdateData.requirement_number} has been updated.`;
        newNotification.user_id = RequirementUpdateData?.vendor_id;
        newNotification.user_type = 'Vendor';
        newNotification.route_id = RequirementUpdateData.id;
        newNotification.route_module = 'requirements';
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await _notification.notification.insert(newNotification);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _requirement.requirement.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                RequirementUpdateData.id
            ],
            UserIp: UserIp
        });
        return RequirementUpdateData;
    }
    async Delete(Id, UserIp) {
        const RequirementData = await _requirement.requirement.findOne({
            where: {
                id: Id
            }
        });
        if (!RequirementData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        await RequirementData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _requirement.requirement.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                RequirementData.id
            ],
            UserIp: UserIp
        });
        return true;
    }
    constructor(_AuditLogService, _CommonService, _DataSource){
        this._AuditLogService = _AuditLogService;
        this._CommonService = _CommonService;
        this._DataSource = _DataSource;
    }
};
RequirementService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Commonservice.CommonService === "undefined" ? Object : _Commonservice.CommonService,
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], RequirementService);

//# sourceMappingURL=Requirement.service.js.map