// src/Service/CodeMove/Requirement.service.ts
import { Injectable } from "@nestjs/common";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { AuditLogService } from "../Admin/AuditLog.service";
import { requirement } from "@Root/Database/Table/CodeMove/requirement";
import { RequirementModel } from "@Model/CodeMove/Requirement.model";
import { DataSource } from "typeorm";
import { CommonService } from "../Common.service";
import { notification } from "@Root/Database/Table/CodeMove/notification";
import { order } from "@Root/Database/Table/CodeMove/order";
import { OrderStatusEnum } from "@Root/Helper/Enum/OrderStatusEnum";
import { RequirementEnum } from "@Root/Helper/Enum/QuoteEnum";

@Injectable()
export class RequirementService {
    constructor(
        private _AuditLogService: AuditLogService,
        private _CommonService: CommonService,
        private _DataSource: DataSource

    ) { }

    async GetAll() {
        return await requirement.find({ relations: ["order", "vendor"] });
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

    async GetById(Id: string) {
        const RequirementData = await requirement.findOne({
            where: { id: Id },
            relations: ["order", "vendor"]
        });
        if (!RequirementData) throw new Error(ResponseEnum.NotFound);
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

    async Insert(RequirementData: RequirementModel, UserId: string, UserIp: string) {
        let RequirementNumber = await this._DataSource.query(`
            SELECT r.requirement_number 
            FROM \`requirement\` AS r 
            ORDER BY CAST(REGEXP_REPLACE(r.requirement_number, '[^0-9]', '') AS UNSIGNED) DESC
          `);
        if (RequirementNumber[0]?.requirement_number) {
            RequirementNumber[0].requirement_number = this._CommonService.AutoGenerateNumber(RequirementNumber[0].requirement_number);
        } else {
            RequirementNumber[0] = { requirement_number: "RQ-00001" };
        }
        const _RequirementData = new requirement();
        _RequirementData.requirement_number = RequirementNumber[0].requirement_number;
        _RequirementData.order_id = RequirementData.order_id;
        _RequirementData.vendor_id = RequirementData.vendor_id;
        // Set initial status to Pending when requirement is created
        _RequirementData.requirement_status = RequirementEnum.Sent;
        _RequirementData.created_by_id = UserId;
        _RequirementData.created_on = new Date();
        await requirement.insert(_RequirementData);

        // 🔔 Notification
        const newNotification = new notification();
        newNotification.title = 'New Requirement Created';
        newNotification.message = `Requirement ${_RequirementData.requirement_number} has been added.`;
        newNotification.user_id = _RequirementData.vendor_id;
        newNotification.user_type = 'Vendor';
        newNotification.route_id = _RequirementData.id;
        newNotification.route_module = 'requirements';
        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await notification.insert(newNotification);

        this._AuditLogService.AuditEmitEvent({
            PerformedType: requirement.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_RequirementData.id],
            UserIp: UserIp
        });
        return _RequirementData;
    }

    async Update(Id: string, RequirementData: RequirementModel, UserId: string, UserIp: string) {
        const RequirementUpdateData = await requirement.findOne({ where: { id: Id } });
        if (!RequirementUpdateData) throw new Error(ResponseEnum.NotFound);

        const oldStatus = RequirementUpdateData.requirement_status;
        RequirementUpdateData.order_id = RequirementData.order_id;
        RequirementUpdateData.vendor_id = RequirementData.vendor_id;
        RequirementUpdateData.requirement_status = RequirementData.requirement_status;
        RequirementUpdateData.updated_by_id = UserId;
        RequirementUpdateData.updated_on = new Date();
        await requirement.update(Id, RequirementUpdateData);

        // If status changed to Sent, update order status to Quoted
        if (oldStatus !== RequirementEnum.Accepted && RequirementData.requirement_status === RequirementEnum.Accepted) {
            await this._DataSource.query(`
            UPDATE \`order\` 
            SET order_status = ? 
            WHERE id = ?
        `, [OrderStatusEnum.Requested, RequirementUpdateData.order_id]);
        }

        // 🔔 Notification
        const newNotification = new notification();
        newNotification.title = 'Requirement Updated';
        newNotification.message = `Requirement ${RequirementUpdateData.requirement_number} has been updated.`;
        newNotification.user_id = RequirementUpdateData?.vendor_id;
        newNotification.user_type = 'Vendor';
        newNotification.route_id = RequirementUpdateData.id;
        newNotification.route_module = 'requirements';

        newNotification.is_read = false;
        newNotification.created_by_id = UserId;
        newNotification.created_on = new Date();
        await notification.insert(newNotification);

        this._AuditLogService.AuditEmitEvent({
            PerformedType: requirement.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [RequirementUpdateData.id],
            UserIp: UserIp
        });
        return RequirementUpdateData;
    }


    async Delete(Id: string, UserIp: string) {
        const RequirementData = await requirement.findOne({ where: { id: Id } });
        if (!RequirementData) throw new Error(ResponseEnum.NotFound);

        await RequirementData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: requirement.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [RequirementData.id],
            UserIp: UserIp
        });

        return true;
    }
}
