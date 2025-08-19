import { Injectable } from "@nestjs/common";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { AuditLogService } from "../Admin/AuditLog.service";
import { order } from "@Root/Database/Table/CodeMove/order";
import { OrderModel } from "@Model/CodeMove/Order.model";
import { CommonService } from "../Common.service";
import { DataSource } from "typeorm";
import { notification } from "@Root/Database/Table/CodeMove/notification";
import { user } from "@Root/Database/Table/Admin/user";
import { OrderStatusEnum } from "@Root/Helper/Enum/OrderStatusEnum";

@Injectable()
export class OrderService {
    constructor(
        private _AuditLogService: AuditLogService,
        private _CommonService: CommonService,
        private _DataSource: DataSource
    ) { }

    async GetAll() {
        return await order.find({ relations: ["customer"] });
    }

    async GetById(OrderId: string) {
        const OrderData = await order.findOne({ where: { id: OrderId } });
        if (!OrderData) throw new Error(ResponseEnum.NotFound);
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
    async Insert(OrderData: OrderModel, UserId: string, UserIp: string) {
        const AdminData = await user.findOne({ where: { first_name: 'Admin' } });
        let OrderNumber = await this._DataSource.query(`SELECT o.order_number FROM \`order\` AS o ORDER BY CAST(REGEXP_REPLACE(o.order_number, '[^0-9]', '') AS UNSIGNED) DESC`);
        if (OrderNumber[0]?.order_number) {
            OrderNumber[0].order_number = this._CommonService.AutoGenerateNumber(OrderNumber[0].order_number);
        }
        else {
            OrderNumber[0] = {};
            OrderNumber[0]['order_number'] = "OR-00001";
        }
        const _OrderData = new order();
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
        _OrderData.order_status = OrderStatusEnum.New;
        _OrderData.created_by_id = UserId;
        _OrderData.created_on = new Date();
        await order.insert(_OrderData);

        const newNotification = new notification();
        newNotification.title = 'New Order Created';
        newNotification.message = `Order ${_OrderData.order_number} has been placed.`;
        newNotification.user_id = AdminData.id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = _OrderData.id;
        newNotification.route_module = "orders";
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await notification.insert(newNotification);

        this._AuditLogService.AuditEmitEvent({
            PerformedType: order.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_OrderData.id],
            UserIp: UserIp
        });
        return _OrderData;
    }

    async Update(Id: string, OrderData: OrderModel, UserId: string, UserIp: string) {
        const OrderUpdateData = await order.findOne({ where: { id: Id } });
        if (!OrderUpdateData) throw new Error(ResponseEnum.NotFound);
        const AdminData = await user.findOne({ where: { first_name: 'Admin' } });

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
        await order.update(Id, OrderUpdateData);

        //Notification for Update
        const newNotification = new notification();
        newNotification.title = 'Order Updated';
        newNotification.message = `Order ${OrderUpdateData.order_number} has been updated.`;
        newNotification.user_id = AdminData.id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = OrderUpdateData.id;
        newNotification.route_module = "orders";
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await notification.insert(newNotification);

        this._AuditLogService.AuditEmitEvent({
            PerformedType: order.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [OrderUpdateData.id],
            UserIp: UserIp
        });
        return OrderUpdateData;
    }


    async Delete(Id: string, UserIp: string) {
        const OrderData = await order.findOne({ where: { id: Id } });
        if (!OrderData) throw new Error(ResponseEnum.NotFound);

        await OrderData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: order.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [OrderData.id],
            UserIp: UserIp
        });

        return true;
    }
}
