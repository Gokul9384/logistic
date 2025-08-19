import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { customer_quote } from "@Root/Database/Table/CodeMove/customer_quote";
import { CustomerQuoteModel } from "@Model/CodeMove/CustomerQuote.model";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { AuditLogService } from "../Admin/AuditLog.service";
import { notification } from "@Root/Database/Table/CodeMove/notification";
import { CommonService } from "../Common.service";
import { QuoteStatusEnum } from "@Root/Helper/Enum/QuoteEnum";
import { OrderStatusEnum } from "@Root/Helper/Enum/OrderStatusEnum";
import { user } from "@Root/Database/Table/Admin/user";

@Injectable()
export class CustomerQuoteService {
    constructor(
        private _AuditLogService: AuditLogService,
        private _CommonService: CommonService,
        private _DataSource: DataSource
    ) { }

    async GetAll() {
        return await customer_quote.find({ relations: ["quote", "order", "customer"] });
    }

    async GetById(CustomerQuoteId: string) {
        const CustomerQuoteData = await customer_quote.findOne({
            where: { id: CustomerQuoteId },
            relations: ["quote", "order", "customer"]
        });
        if (!CustomerQuoteData) throw new Error(ResponseEnum.NotFound);
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


    async Insert(CustomerQuoteData: CustomerQuoteModel, UserId: string, UserIp: string) {
        let CustomerQuoteNumber = await this._DataSource.query(
            `SELECT cq.customer_quote_number 
         FROM customer_quote AS cq 
         ORDER BY CAST(REGEXP_REPLACE(cq.customer_quote_number, '[^0-9]', '') AS UNSIGNED) DESC 
         LIMIT 1`
        );
        if (CustomerQuoteNumber[0]?.customer_quote_number) {
            CustomerQuoteNumber[0].customer_quote_number =
                this._CommonService.AutoGenerateNumber(CustomerQuoteNumber[0].customer_quote_number);
        } else {
            CustomerQuoteNumber[0] = { customer_quote_number: "CQT-00001" };
        }
        const _CustomerQuoteData = new customer_quote();
        const oldStatus = CustomerQuoteData.customer_quote_status;

        _CustomerQuoteData.quote_id = CustomerQuoteData.quote_id;
        _CustomerQuoteData.order_id = CustomerQuoteData.order_id;
        _CustomerQuoteData.customer_id = CustomerQuoteData.customer_id;
        _CustomerQuoteData.customer_quote_number = CustomerQuoteNumber[0].customer_quote_number;
        _CustomerQuoteData.customer_quote_amount = CustomerQuoteData.customer_quote_amount;
        // Set initial status to Requested when customer quote is created
        _CustomerQuoteData.customer_quote_status = QuoteStatusEnum.Sent;
        _CustomerQuoteData.created_by_id = UserId;
        _CustomerQuoteData.created_on = new Date();
        await customer_quote.insert(_CustomerQuoteData);
        // If status changed to Accepted, update order status to Confirmed
        if (CustomerQuoteData.customer_quote_status === QuoteStatusEnum.Sent) {
            await this._DataSource.query(`
            UPDATE \`order\` 
            SET order_status = ? 
            WHERE id = ?
        `, [OrderStatusEnum.Quoted, CustomerQuoteData.order_id]);
        }


        const newNotification = new notification();
        newNotification.title = 'New Customer Quote Created';
        newNotification.message = `Customer Quote ${_CustomerQuoteData.customer_quote_number} has been created.`;
        newNotification.user_id = _CustomerQuoteData.customer_id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = _CustomerQuoteData.id;
        newNotification.route_module = 'customer-quotes';
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await notification.insert(newNotification);

        this._AuditLogService.AuditEmitEvent({
            PerformedType: customer_quote.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_CustomerQuoteData.id],
            UserIp: UserIp
        });
        return _CustomerQuoteData;
    }

    async Update(Id: string, CustomerQuoteData: CustomerQuoteModel, UserId: string, UserIp: string) {
        const AdminData = await user.findOne({ where: { first_name: 'Admin' } });

        const CustomerQuoteUpdateData = await customer_quote.findOne({ where: { id: Id } });
        if (!CustomerQuoteUpdateData) throw new Error(ResponseEnum.NotFound);

        const oldStatus = CustomerQuoteUpdateData.customer_quote_status;
        CustomerQuoteUpdateData.quote_id = CustomerQuoteData.quote_id;
        CustomerQuoteUpdateData.order_id = CustomerQuoteData.order_id;
        CustomerQuoteUpdateData.customer_id = CustomerQuoteData.customer_id;
        CustomerQuoteUpdateData.customer_quote_amount = CustomerQuoteData.customer_quote_amount;
        CustomerQuoteUpdateData.customer_quote_status = CustomerQuoteData.customer_quote_status;
        CustomerQuoteUpdateData.updated_by_id = UserId;
        CustomerQuoteUpdateData.updated_on = new Date();
        await customer_quote.update(Id, CustomerQuoteUpdateData);

        // If status changed to Accepted, update order status to Confirmed
        if (oldStatus !== QuoteStatusEnum.Accepted && CustomerQuoteData.customer_quote_status === QuoteStatusEnum.Accepted) {
            await this._DataSource.query(`
            UPDATE \`order\` 
            SET order_status = ? 
            WHERE id = ?
        `, [OrderStatusEnum.Quoted, CustomerQuoteUpdateData.order_id]);
        }

        const newNotification = new notification();
        newNotification.title = 'Customer Quote Updated';
        newNotification.message = `Customer Quote ${CustomerQuoteUpdateData.customer_quote_number} has been updated.`;
        newNotification.user_id = AdminData.id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = CustomerQuoteUpdateData.id;
        newNotification.route_module = 'customer-quotes';
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await notification.insert(newNotification);

        this._AuditLogService.AuditEmitEvent({
            PerformedType: customer_quote.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [CustomerQuoteUpdateData.id],
            UserIp: UserIp
        });
        return CustomerQuoteUpdateData;
    }

    async Delete(Id: string, UserIp: string) {
        const CustomerQuoteData = await customer_quote.findOne({ where: { id: Id } });
        if (!CustomerQuoteData) throw new Error(ResponseEnum.NotFound);

        await CustomerQuoteData.remove();

        this._AuditLogService.AuditEmitEvent({
            PerformedType: customer_quote.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [CustomerQuoteData.id],
            UserIp: UserIp
        });

        return true;
    }
}
