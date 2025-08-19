"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "QuoteService", {
    enumerable: true,
    get: function() {
        return QuoteService;
    }
});
const _common = require("@nestjs/common");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _quote = require("../../Database/Table/CodeMove/quote");
const _typeorm = require("typeorm");
const _Commonservice = require("../Common.service");
const _user = require("../../Database/Table/Admin/user");
const _notification = require("../../Database/Table/CodeMove/notification");
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
let QuoteService = class QuoteService {
    async GetAll() {
        const data = await _quote.quote.find({
            relations: [
                "requirement"
            ]
        });
        return data;
    }
    async QuoteDetail() {
        const data = await this._DataSource.query(`
    SELECT 
      q.id as quote_id,
      q.*,
      r.id as req_id,
      r.*,
      o.id as ord_id,
      o.*,
      v.company_name as vendor_name
    FROM
      quote q
    LEFT JOIN
      requirement r ON r.id = q.requirement_id
    LEFT JOIN 
      \`order\` o ON o.id = r.order_id
    LEFT JOIN
	  vendor v ON v.id = r.vendor_id;
  `);
        return data;
    }
    async GetById(QuoteId) {
        const QuoteData = await _quote.quote.findOne({
            where: {
                id: QuoteId
            }
        });
        if (!QuoteData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        return QuoteData;
    }
    // async Insert(QuoteData: QuoteModel, UserId: string, UserIp: string) {
    //     const AdminData = await user.findOne({ where: { first_name: 'Admin' } });
    //     let QuoteNumber = await this._DataSource.query(
    //         `SELECT q.quote_number FROM \`quote\` AS q ORDER BY CAST(REGEXP_REPLACE(q.quote_number, '[^0-9]', '') AS UNSIGNED) DESC`
    //     );
    //     if (QuoteNumber[0]?.quote_number) {
    //         QuoteNumber[0].quote_number = this._CommonService.AutoGenerateNumber(QuoteNumber[0].quote_number);
    //     } else {
    //         QuoteNumber[0] = { quote_number: "QT-00001" };
    //     }
    //     const _QuoteData = new quote();
    //     _QuoteData.requirement_id = QuoteData.requirement_id;
    //     _QuoteData.quote_number = QuoteNumber[0].quote_number;
    //     _QuoteData.quote_amount = QuoteData.quote_amount;
    //     _QuoteData.quote_status = QuoteData.quote_status;
    //     _QuoteData.created_by_id = UserId;
    //     _QuoteData.created_on = new Date();
    //     await quote.insert(_QuoteData);
    //     // 🔔 Notification
    //     const newNotification = new notification();
    //     newNotification.title = 'New Quote Created';
    //     newNotification.message = `Quote ${_QuoteData.quote_number} has been placed.`;
    //     newNotification.user_id = AdminData.id;
    //     newNotification.user_type = 'Admin';
    //     newNotification.route_id = _QuoteData.id;
    //     newNotification.route_module = "quotes";
    //     newNotification.is_read = false;
    //     newNotification.created_by_id = UserId;
    //     newNotification.created_on = new Date();
    //     await notification.insert(newNotification);
    //     // 🧾 Audit log
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: quote.name,
    //         ActionType: LogActionEnum.Insert,
    //         PrimaryId: [_QuoteData.id],
    //         UserIp: UserIp
    //     });
    //     return _QuoteData;
    // }
    // async Update(Id: string, QuoteData: QuoteModel, UserId: string, UserIp: string) {
    //     const QuoteUpdateData = await quote.findOne({ where: { id: Id } });
    //     if (!QuoteUpdateData) throw new Error(ResponseEnum.NotFound);
    //     const AdminData = await user.findOne({ where: { first_name: 'Admin' } });
    //     QuoteUpdateData.requirement_id = QuoteData.requirement_id;
    //     QuoteUpdateData.quote_amount = QuoteData.quote_amount;
    //     QuoteUpdateData.quote_status = QuoteData.quote_status;
    //     QuoteUpdateData.updated_by_id = UserId;
    //     QuoteUpdateData.updated_on = new Date();
    //     await quote.update(Id, QuoteUpdateData);
    //     // 🔔 Notification
    //     const newNotification = new notification();
    //     newNotification.title = 'Quote Updated';
    //     newNotification.message = `Quote ${QuoteUpdateData.quote_number} has been updated.`;
    //     newNotification.user_id = AdminData.id;
    //     newNotification.user_type = 'Admin';
    //     newNotification.is_read = false;
    //     newNotification.created_by_id = UserId;
    //     newNotification.created_on = new Date();
    //     await notification.insert(newNotification);
    //     // 🧾 Audit log
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: quote.name,
    //         ActionType: LogActionEnum.Update,
    //         PrimaryId: [QuoteUpdateData.id],
    //         UserIp: UserIp
    //     });
    //     return QuoteUpdateData;
    // }
    // Quote Service
    async Insert(QuoteData, UserId, UserIp) {
        const AdminData = await _user.user.findOne({
            where: {
                first_name: 'Admin'
            }
        });
        let QuoteNumber = await this._DataSource.query(`SELECT q.quote_number FROM \`quote\` AS q ORDER BY CAST(REGEXP_REPLACE(q.quote_number, '[^0-9]', '') AS UNSIGNED) DESC`);
        if (QuoteNumber[0]?.quote_number) {
            QuoteNumber[0].quote_number = this._CommonService.AutoGenerateNumber(QuoteNumber[0].quote_number);
        } else {
            QuoteNumber[0] = {
                quote_number: "QT-00001"
            };
        }
        const _QuoteData = new _quote.quote();
        _QuoteData.requirement_id = QuoteData.requirement_id;
        _QuoteData.quote_number = QuoteNumber[0].quote_number;
        _QuoteData.quote_amount = QuoteData.quote_amount;
        // Set initial status to Requested when quote is created
        _QuoteData.quote_status = _QuoteEnum.QuoteStatusEnum.Sent;
        _QuoteData.created_by_id = UserId;
        _QuoteData.created_on = new Date();
        await _quote.quote.insert(_QuoteData);
        // 🔔 Notification
        const newNotification = new _notification.notification();
        newNotification.title = 'New Quote Created';
        newNotification.message = `Quote ${_QuoteData.quote_number} has been placed.`;
        newNotification.user_id = AdminData.id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = _QuoteData.id;
        newNotification.route_module = "quotes";
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await _notification.notification.insert(newNotification);
        // 🧾 Audit log
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _quote.quote.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _QuoteData.id
            ],
            UserIp: UserIp
        });
        return _QuoteData;
    }
    async Update(Id, QuoteData, UserId, UserIp) {
        const QuoteUpdateData = await _quote.quote.findOne({
            where: {
                id: Id
            }
        });
        if (!QuoteUpdateData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        const AdminData = await _user.user.findOne({
            where: {
                first_name: 'Admin'
            }
        });
        const oldStatus = QuoteUpdateData.quote_status;
        QuoteUpdateData.requirement_id = QuoteData.requirement_id;
        QuoteUpdateData.quote_amount = QuoteData.quote_amount;
        QuoteUpdateData.quote_status = QuoteData.quote_status;
        QuoteUpdateData.updated_by_id = UserId;
        QuoteUpdateData.updated_on = new Date();
        await _quote.quote.update(Id, QuoteUpdateData);
        // // If status changed to Accepted, update order status to Confirmed
        // if (oldStatus !== QuoteStatusEnum.Accepted && QuoteData.quote_status === QuoteStatusEnum.Accepted) {
        //     // Get order_id from requirement
        //     const requirementData = await requirement.findOne({ where: { id: QuoteUpdateData.requirement_id } });
        //     if (requirementData) {
        //         await this._DataSource.query(`
        //         UPDATE \`order\` 
        //         SET order_status = ? 
        //         WHERE id = ?
        //     `, [OrderStatusEnum.Quoted, requirementData.order_id]);
        //     }
        // }
        // 🔔 Notification
        const newNotification = new _notification.notification();
        newNotification.title = 'Quote Updated';
        newNotification.message = `Quote ${QuoteUpdateData.quote_number} has been updated.`;
        newNotification.user_id = AdminData.id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = QuoteUpdateData.id;
        newNotification.route_module = "quotes";
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await _notification.notification.insert(newNotification);
        // 🧾 Audit log
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _quote.quote.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                QuoteUpdateData.id
            ],
            UserIp: UserIp
        });
        return QuoteUpdateData;
    }
    async Delete(Id, UserIp) {
        const QuoteData = await _quote.quote.findOne({
            where: {
                id: Id
            }
        });
        if (!QuoteData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        await QuoteData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _quote.quote.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                QuoteData.id
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
QuoteService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Commonservice.CommonService === "undefined" ? Object : _Commonservice.CommonService,
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], QuoteService);

//# sourceMappingURL=Quote.service.js.map