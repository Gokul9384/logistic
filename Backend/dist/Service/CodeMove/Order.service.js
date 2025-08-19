"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderService", {
    enumerable: true,
    get: function() {
        return OrderService;
    }
});
const _common = require("@nestjs/common");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _order = require("../../Database/Table/CodeMove/order");
const _Commonservice = require("../Common.service");
const _typeorm = require("typeorm");
const _notification = require("../../Database/Table/CodeMove/notification");
const _user = require("../../Database/Table/Admin/user");
const _OrderStatusEnum = require("../../Helper/Enum/OrderStatusEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OrderService = class OrderService {
    async GetAll() {
        return await _order.order.find({
            relations: [
                "customer"
            ]
        });
    }
    async GetById(OrderId) {
        const OrderData = await _order.order.findOne({
            where: {
                id: OrderId
            }
        });
        if (!OrderData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        return OrderData;
    }
    // async Insert(OrderData: OrderModel, UserId: string, UserIp: string) {
    //     const AdminData = await user.findOne({ where: { first_name: 'Admin' } });
    //     let OrderNumber = await this._DataSource.query(`SELECT o.order_number FROM \`order\` AS o ORDER BY CAST(REGEXP_REPLACE(o.order_number, '[^0-9]', '') AS UNSIGNED) DESC`);
    //     if (OrderNumber[0]?.order_number) {
    //         OrderNumber[0].order_number = this._CommonService.AutoGenerateNumber(OrderNumber[0].order_number);
    //     }
    //     else {
    //         OrderNumber[0] = {};
    //         OrderNumber[0]['order_number'] = "OR-00001";
    //     }
    //     const _OrderData = new order();
    //     _OrderData.order_number = OrderNumber[0].order_number;
    //     _OrderData.customer_id = OrderData.customer_id;
    //     _OrderData.material = OrderData.material;
    //     _OrderData.source_location = OrderData.source_location;
    //     _OrderData.destination_location = OrderData.destination_location;
    //     _OrderData.weight = OrderData.weight;
    //     _OrderData.priority = OrderData.priority;
    //     _OrderData.expected_date = OrderData.expected_date;
    //     _OrderData.order_status = OrderData.order_status;
    //     _OrderData.created_by_id = UserId;
    //     _OrderData.created_on = new Date();
    //     await order.insert(_OrderData);
    //     const newNotification = new notification();
    //     newNotification.title = 'New Order Created';
    //     newNotification.message = `Order ${_OrderData.order_number} has been placed.`;
    //     newNotification.user_id = AdminData.id;
    //     newNotification.user_type = 'Admin';
    //     newNotification.route_id = _OrderData.id;
    //     newNotification.route_module = "orders";
    //     newNotification.is_read = false;
    //     newNotification.created_by_id = UserId;
    //     newNotification.created_on = new Date();
    //     await notification.insert(newNotification);
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: order.name,
    //         ActionType: LogActionEnum.Insert,
    //         PrimaryId: [_OrderData.id],
    //         UserIp: UserIp
    //     });
    //     return _OrderData;
    // }
    // async Update(Id: string, OrderData: OrderModel, UserId: string, UserIp: string) {
    //     const OrderUpdateData = await order.findOne({ where: { id: Id } });
    //     if (!OrderUpdateData) throw new Error(ResponseEnum.NotFound);
    //     const AdminData = await user.findOne({ where: { first_name: 'Admin' } });
    //     OrderUpdateData.customer_id = OrderData.customer_id;
    //     OrderUpdateData.material = OrderData.material;
    //     OrderUpdateData.source_location = OrderData.source_location;
    //     OrderUpdateData.destination_location = OrderData.destination_location;
    //     OrderUpdateData.weight = OrderData.weight;
    //     OrderUpdateData.priority = OrderData.priority;
    //     OrderUpdateData.expected_date = OrderData.expected_date;
    //     OrderUpdateData.order_status = OrderData.order_status;
    //     OrderUpdateData.updated_by_id = UserId;
    //     OrderUpdateData.updated_on = new Date();
    //     await order.update(Id, OrderUpdateData);
    //     //Notification for Update
    //     const newNotification = new notification();
    //     newNotification.title = 'Order Updated';
    //     newNotification.message = `Order ${OrderUpdateData.order_number} has been updated.`;
    //     newNotification.user_id = AdminData.id;
    //     newNotification.user_type = 'Admin';
    //     newNotification.is_read = false;
    //     newNotification.created_by_id = UserId;
    //     newNotification.created_on = new Date();
    //     await notification.insert(newNotification);
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: order.name,
    //         ActionType: LogActionEnum.Update,
    //         PrimaryId: [OrderUpdateData.id],
    //         UserIp: UserIp
    //     });
    //     return OrderUpdateData;
    // }
    // Order Service
    async Insert(OrderData, UserId, UserIp) {
        const AdminData = await _user.user.findOne({
            where: {
                first_name: 'Admin'
            }
        });
        let OrderNumber = await this._DataSource.query(`SELECT o.order_number FROM \`order\` AS o ORDER BY CAST(REGEXP_REPLACE(o.order_number, '[^0-9]', '') AS UNSIGNED) DESC`);
        if (OrderNumber[0]?.order_number) {
            OrderNumber[0].order_number = this._CommonService.AutoGenerateNumber(OrderNumber[0].order_number);
        } else {
            OrderNumber[0] = {};
            OrderNumber[0]['order_number'] = "OR-00001";
        }
        const _OrderData = new _order.order();
        _OrderData.order_number = OrderNumber[0].order_number;
        _OrderData.customer_id = OrderData.customer_id;
        _OrderData.material = OrderData.material;
        _OrderData.source_location = OrderData.source_location;
        _OrderData.destination_location = OrderData.destination_location;
        _OrderData.weight = OrderData.weight;
        _OrderData.priority = OrderData.priority;
        _OrderData.expected_date = OrderData.expected_date;
        _OrderData.order_date = OrderData.order_date;
        _OrderData.pickup_date = OrderData.pickup_date;
        _OrderData.pickup_time = OrderData.pickup_time;
        // Set initial status to Pending when order is created
        _OrderData.order_status = _OrderStatusEnum.OrderStatusEnum.New;
        _OrderData.created_by_id = UserId;
        _OrderData.created_on = new Date();
        await _order.order.insert(_OrderData);
        const newNotification = new _notification.notification();
        newNotification.title = 'New Order Created';
        newNotification.message = `Order ${_OrderData.order_number} has been placed.`;
        newNotification.user_id = AdminData.id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = _OrderData.id;
        newNotification.route_module = "orders";
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await _notification.notification.insert(newNotification);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _order.order.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _OrderData.id
            ],
            UserIp: UserIp
        });
        return _OrderData;
    }
    async Update(Id, OrderData, UserId, UserIp) {
        const OrderUpdateData = await _order.order.findOne({
            where: {
                id: Id
            }
        });
        if (!OrderUpdateData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        const AdminData = await _user.user.findOne({
            where: {
                first_name: 'Admin'
            }
        });
        const oldStatus = OrderUpdateData.order_status;
        OrderUpdateData.customer_id = OrderData.customer_id;
        OrderUpdateData.material = OrderData.material;
        OrderUpdateData.source_location = OrderData.source_location;
        OrderUpdateData.destination_location = OrderData.destination_location;
        OrderUpdateData.weight = OrderData.weight;
        OrderUpdateData.priority = OrderData.priority;
        OrderUpdateData.expected_date = OrderData.expected_date;
        OrderUpdateData.order_status = OrderData.order_status;
        OrderUpdateData.order_date = OrderData.order_date;
        OrderUpdateData.pickup_date = OrderData.pickup_date;
        OrderUpdateData.pickup_time = OrderData.pickup_time;
        OrderUpdateData.updated_by_id = UserId;
        OrderUpdateData.updated_on = new Date();
        await _order.order.update(Id, OrderUpdateData);
        //Notification for Update
        const newNotification = new _notification.notification();
        newNotification.title = 'Order Updated';
        newNotification.message = `Order ${OrderUpdateData.order_number} has been updated.`;
        newNotification.user_id = AdminData.id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = OrderUpdateData.id;
        newNotification.route_module = "orders";
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await _notification.notification.insert(newNotification);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _order.order.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                OrderUpdateData.id
            ],
            UserIp: UserIp
        });
        return OrderUpdateData;
    }
    async Delete(Id, UserIp) {
        const OrderData = await _order.order.findOne({
            where: {
                id: Id
            }
        });
        if (!OrderData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        await OrderData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _order.order.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                OrderData.id
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
OrderService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Commonservice.CommonService === "undefined" ? Object : _Commonservice.CommonService,
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], OrderService);

//# sourceMappingURL=Order.service.js.map