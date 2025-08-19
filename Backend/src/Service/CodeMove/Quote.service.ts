import { Injectable } from "@nestjs/common";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { AuditLogService } from "../Admin/AuditLog.service";
import { quote } from "@Root/Database/Table/CodeMove/quote";
import { QuoteModel } from "@Model/CodeMove/Quote.model";
import { DataSource } from "typeorm";
import { CommonService } from "../Common.service";
import { user } from "@Root/Database/Table/Admin/user";
import { notification } from "@Root/Database/Table/CodeMove/notification";
import { QuoteStatusEnum } from "@Root/Helper/Enum/QuoteEnum";
import { requirement } from "@Root/Database/Table/CodeMove/requirement";
import { OrderStatusEnum } from "@Root/Helper/Enum/OrderStatusEnum";

@Injectable()
export class QuoteService {
    constructor(
        private _AuditLogService: AuditLogService,
        private _CommonService: CommonService,
        private _DataSource: DataSource
    ) { }

    async GetAll() {
        const data = await quote.find({ relations: ["requirement"] })
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


    async GetById(QuoteId: string) {
        const QuoteData = await quote.findOne({
            where: { id: QuoteId }
        });
        if (!QuoteData) throw new Error(ResponseEnum.NotFound);
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
    async Insert(QuoteData: QuoteModel, UserId: string, UserIp: string) {
        const AdminData = await user.findOne({ where: { first_name: 'Admin' } });
        let QuoteNumber = await this._DataSource.query(
            `SELECT q.quote_number FROM \`quote\` AS q ORDER BY CAST(REGEXP_REPLACE(q.quote_number, '[^0-9]', '') AS UNSIGNED) DESC`
        );
        if (QuoteNumber[0]?.quote_number) {
            QuoteNumber[0].quote_number = this._CommonService.AutoGenerateNumber(QuoteNumber[0].quote_number);
        } else {
            QuoteNumber[0] = { quote_number: "QT-00001" };
        }
        const _QuoteData = new quote();
        _QuoteData.requirement_id = QuoteData.requirement_id;
        _QuoteData.quote_number = QuoteNumber[0].quote_number;
        _QuoteData.quote_amount = QuoteData.quote_amount;
        // Set initial status to Requested when quote is created
        _QuoteData.quote_status = QuoteStatusEnum.Sent;
        _QuoteData.created_by_id = UserId;
        _QuoteData.created_on = new Date();
        await quote.insert(_QuoteData);

        // 🔔 Notification
        const newNotification = new notification();
        newNotification.title = 'New Quote Created';
        newNotification.message = `Quote ${_QuoteData.quote_number} has been placed.`;
        newNotification.user_id = AdminData.id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = _QuoteData.id;
        newNotification.route_module = "quotes";
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await notification.insert(newNotification);

        // 🧾 Audit log
        this._AuditLogService.AuditEmitEvent({
            PerformedType: quote.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_QuoteData.id],
            UserIp: UserIp
        });
        return _QuoteData;
    }

    async Update(Id: string, QuoteData: QuoteModel, UserId: string, UserIp: string) {
        const QuoteUpdateData = await quote.findOne({ where: { id: Id } });
        if (!QuoteUpdateData) throw new Error(ResponseEnum.NotFound);
        const AdminData = await user.findOne({ where: { first_name: 'Admin' } });

        const oldStatus = QuoteUpdateData.quote_status;
        QuoteUpdateData.requirement_id = QuoteData.requirement_id;
        QuoteUpdateData.quote_amount = QuoteData.quote_amount;
        QuoteUpdateData.quote_status = QuoteData.quote_status;
        QuoteUpdateData.updated_by_id = UserId;
        QuoteUpdateData.updated_on = new Date();
        await quote.update(Id, QuoteUpdateData);

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
        const newNotification = new notification();
        newNotification.title = 'Quote Updated';
        newNotification.message = `Quote ${QuoteUpdateData.quote_number} has been updated.`;
        newNotification.user_id = AdminData.id;
        newNotification.user_type = 'Admin';
        newNotification.route_id = QuoteUpdateData.id;
        newNotification.route_module = "quotes";
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await notification.insert(newNotification);

        // 🧾 Audit log
        this._AuditLogService.AuditEmitEvent({
            PerformedType: quote.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [QuoteUpdateData.id],
            UserIp: UserIp
        });
        return QuoteUpdateData;
    }

    async Delete(Id: string, UserIp: string) {
        const QuoteData = await quote.findOne({ where: { id: Id } });
        if (!QuoteData) throw new Error(ResponseEnum.NotFound);

        await QuoteData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: quote.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [QuoteData.id],
            UserIp: UserIp
        });

        return true;
    }
}
