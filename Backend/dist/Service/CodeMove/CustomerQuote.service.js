"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomerQuoteService", {
    enumerable: true,
    get: function() {
        return CustomerQuoteService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _customer_quote = require("../../Database/Table/CodeMove/customer_quote");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _notification = require("../../Database/Table/CodeMove/notification");
const _Commonservice = require("../Common.service");
const _QuoteEnum = require("../../Helper/Enum/QuoteEnum");
const _OrderStatusEnum = require("../../Helper/Enum/OrderStatusEnum");
const _user = require("../../Database/Table/Admin/user");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CustomerQuoteService = class CustomerQuoteService {
    async GetAll() {
        return await _customer_quote.customer_quote.find({
            relations: [
                "quote",
                "order",
                "customer"
            ]
        });
    }
    async GetById(CustomerQuoteId) {
        const CustomerQuoteData = await _customer_quote.customer_quote.findOne({
            where: {
                id: CustomerQuoteId
            },
            relations: [
                "quote",
                "order",
                "customer"
            ]
        });
        if (!CustomerQuoteData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        return CustomerQuoteData;
    }
    // async Insert(CustomerQuoteData: CustomerQuoteModel, UserId: string, UserIp: string) {
    //     let CustomerQuoteNumber = await this._DataSource.query(
    //         `SELECT cq.customer_quote_number 
    //          FROM customer_quote AS cq 
    //          ORDER BY CAST(REGEXP_REPLACE(cq.customer_quote_number, '[^0-9]', '') AS UNSIGNED) DESC 
    //          LIMIT 1`
    //     );
    //     if (CustomerQuoteNumber[0]?.customer_quote_number) {
    //         CustomerQuoteNumber[0].customer_quote_number =
    //             this._CommonService.AutoGenerateNumber(CustomerQuoteNumber[0].customer_quote_number);
    //     } else {
    //         CustomerQuoteNumber[0] = { customer_quote_number: "CQT-00001" };
    //     }
    //     const _CustomerQuoteData = new customer_quote();
    //     _CustomerQuoteData.quote_id = CustomerQuoteData.quote_id;
    //     _CustomerQuoteData.order_id = CustomerQuoteData.order_id;
    //     _CustomerQuoteData.customer_id = CustomerQuoteData.customer_id;
    //     _CustomerQuoteData.customer_quote_number = CustomerQuoteNumber[0].customer_quote_number;
    //     _CustomerQuoteData.customer_quote_amount = CustomerQuoteData.customer_quote_amount;
    //     _CustomerQuoteData.customer_quote_status = CustomerQuoteData.customer_quote_status;
    //     _CustomerQuoteData.created_by_id = UserId;
    //     _CustomerQuoteData.created_on = new Date();
    //     await customer_quote.insert(_CustomerQuoteData);
    //     const newNotification = new notification();
    //     newNotification.title = 'New Customer Quote Created';
    //     newNotification.message = `Customer Quote ${_CustomerQuoteData.customer_quote_number} has been created.`;
    //     newNotification.user_id = _CustomerQuoteData.customer_id;
    //     newNotification.user_type = 'Admin';
    //     newNotification.route_id = _CustomerQuoteData.id;
    //     newNotification.route_module = 'customer-quotes';
    //     newNotification.is_read = false;
    //     newNotification.created_by_id = UserId;
    //     newNotification.created_on = new Date();
    //     await notification.insert(newNotification);
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: customer_quote.name,
    //         ActionType: LogActionEnum.Insert,
    //         PrimaryId: [_CustomerQuoteData.id],
    //         UserIp: UserIp
    //     });
    //     return _CustomerQuoteData;
    // }
    // async Update(Id: string, CustomerQuoteData: CustomerQuoteModel, UserId: string, UserIp: string) {
    //     const CustomerQuoteUpdateData = await customer_quote.findOne({ where: { id: Id } });
    //     if (!CustomerQuoteUpdateData) throw new Error(ResponseEnum.NotFound);
    //     CustomerQuoteUpdateData.quote_id = CustomerQuoteData.quote_id;
    //     CustomerQuoteUpdateData.order_id = CustomerQuoteData.order_id;
    //     CustomerQuoteUpdateData.customer_id = CustomerQuoteData.customer_id;
    //     CustomerQuoteUpdateData.customer_quote_amount = CustomerQuoteData.customer_quote_amount;
    //     CustomerQuoteUpdateData.customer_quote_status = CustomerQuoteData.customer_quote_status;
    //     CustomerQuoteUpdateData.updated_by_id = UserId;
    //     CustomerQuoteUpdateData.updated_on = new Date();
    //     await customer_quote.update(Id, CustomerQuoteUpdateData);
    //     const newNotification = new notification();
    //     newNotification.title = 'Customer Quote Updated';
    //     newNotification.message = `Customer Quote ${CustomerQuoteUpdateData.customer_quote_number} has been updated.`;
    //     newNotification.user_id = CustomerQuoteUpdateData.customer_id;
    //     newNotification.user_type = 'Admin';
    //     newNotification.is_read = false;
    //     newNotification.created_by_id = UserId;
    //     newNotification.created_on = new Date();
    //     await notification.insert(newNotification);
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: customer_quote.name,
    //         ActionType: LogActionEnum.Update,
    //         PrimaryId: [CustomerQuoteUpdateData.id],
    //         UserIp: UserIp
    //     });
    //     return CustomerQuoteUpdateData;
    // }
    // Customer Quote Service
    async Insert(CustomerQuoteData, UserId, UserIp) {
        let CustomerQuoteNumber = await this._DataSource.query(`SELECT cq.customer_quote_number 
         FROM customer_quote AS cq 
         ORDER BY CAST(REGEXP_REPLACE(cq.customer_quote_number, '[^0-9]', '') AS UNSIGNED) DESC 
         LIMIT 1`);
        if (CustomerQuoteNumber[0]?.customer_quote_number) {
            CustomerQuoteNumber[0].customer_quote_number = this._CommonService.AutoGenerateNumber(CustomerQuoteNumber[0].customer_quote_number);
        } else {
            CustomerQuoteNumber[0] = {
                customer_quote_number: "CQT-00001"
            };
        }
        const _CustomerQuoteData = new _customer_quote.customer_quote();
        const oldStatus = CustomerQuoteData.customer_quote_status;
        _CustomerQuoteData.quote_id = CustomerQuoteData.quote_id;
        _CustomerQuoteData.order_id = CustomerQuoteData.order_id;
        _CustomerQuoteData.customer_id = CustomerQuoteData.customer_id;
        _CustomerQuoteData.customer_quote_number = CustomerQuoteNumber[0].customer_quote_number;
        _CustomerQuoteData.customer_quote_amount = CustomerQuoteData.customer_quote_amount;
        // Set initial status to Requested when customer quote is created
        _CustomerQuoteData.customer_quote_status = _QuoteEnum.QuoteStatusEnum.Sent;
        _CustomerQuoteData.created_by_id = UserId;
        _CustomerQuoteData.created_on = new Date();
        await _customer_quote.customer_quote.insert(_CustomerQuoteData);
        // If status changed to Accepted, update order status to Confirmed
        if (CustomerQuoteData.customer_quote_status === _QuoteEnum.QuoteStatusEnum.Sent) {
            await this._DataSource.query(`
            UPDATE \`order\` 
            SET order_status = ? 
            WHERE id = ?
        `, [
                _OrderStatusEnum.OrderStatusEnum.Quoted,
                CustomerQuoteData.order_id
            ]);
        }
        const newNotification = new _notification.notification();
        newNotification.title = 'New Customer Quote Created';
        newNotification.message = `Customer Quote ${_CustomerQuoteData.customer_quote_number} has been created.`;
        newNotification.user_id = _CustomerQuoteData.customer_id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = _CustomerQuoteData.id;
        newNotification.route_module = 'customer-quotes';
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await _notification.notification.insert(newNotification);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _customer_quote.customer_quote.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _CustomerQuoteData.id
            ],
            UserIp: UserIp
        });
        return _CustomerQuoteData;
    }
    async Update(Id, CustomerQuoteData, UserId, UserIp) {
        const AdminData = await _user.user.findOne({
            where: {
                first_name: 'Admin'
            }
        });
        const CustomerQuoteUpdateData = await _customer_quote.customer_quote.findOne({
            where: {
                id: Id
            }
        });
        if (!CustomerQuoteUpdateData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        const oldStatus = CustomerQuoteUpdateData.customer_quote_status;
        CustomerQuoteUpdateData.quote_id = CustomerQuoteData.quote_id;
        CustomerQuoteUpdateData.order_id = CustomerQuoteData.order_id;
        CustomerQuoteUpdateData.customer_id = CustomerQuoteData.customer_id;
        CustomerQuoteUpdateData.customer_quote_amount = CustomerQuoteData.customer_quote_amount;
        CustomerQuoteUpdateData.customer_quote_status = CustomerQuoteData.customer_quote_status;
        CustomerQuoteUpdateData.updated_by_id = UserId;
        CustomerQuoteUpdateData.updated_on = new Date();
        await _customer_quote.customer_quote.update(Id, CustomerQuoteUpdateData);
        // If status changed to Accepted, update order status to Confirmed
        if (oldStatus !== _QuoteEnum.QuoteStatusEnum.Accepted && CustomerQuoteData.customer_quote_status === _QuoteEnum.QuoteStatusEnum.Accepted) {
            await this._DataSource.query(`
            UPDATE \`order\` 
            SET order_status = ? 
            WHERE id = ?
        `, [
                _OrderStatusEnum.OrderStatusEnum.Quoted,
                CustomerQuoteUpdateData.order_id
            ]);
        }
        const newNotification = new _notification.notification();
        newNotification.title = 'Customer Quote Updated';
        newNotification.message = `Customer Quote ${CustomerQuoteUpdateData.customer_quote_number} has been updated.`;
        newNotification.user_id = AdminData.id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = CustomerQuoteUpdateData.id;
        newNotification.route_module = 'customer-quotes';
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await _notification.notification.insert(newNotification);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _customer_quote.customer_quote.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                CustomerQuoteUpdateData.id
            ],
            UserIp: UserIp
        });
        return CustomerQuoteUpdateData;
    }
    async Delete(Id, UserIp) {
        const CustomerQuoteData = await _customer_quote.customer_quote.findOne({
            where: {
                id: Id
            }
        });
        if (!CustomerQuoteData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        await CustomerQuoteData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _customer_quote.customer_quote.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                CustomerQuoteData.id
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
CustomerQuoteService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Commonservice.CommonService === "undefined" ? Object : _Commonservice.CommonService,
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], CustomerQuoteService);

//# sourceMappingURL=CustomerQuote.service.js.map