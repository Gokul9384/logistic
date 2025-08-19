import { Injectable } from "@nestjs/common";
import { notification } from "@Root/Database/Table/CodeMove/notification";
import { NotificationModel } from "@Model/CodeMove/Notification.model";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { AuditLogService } from "../Admin/AuditLog.service";
import { vendor } from "@Root/Database/Table/CodeMove/vendor";
import { customer } from "@Root/Database/Table/CodeMove/customer";
import { driver } from "@Root/Database/Table/CodeMove/driver";

@Injectable()
export class NotificationService {
    constructor(private _AuditLogService: AuditLogService) { }

    // List notifications by user_id
    async GetAllByUserId(user_id: string) {

        let Notification_id = user_id;

        const VendorData = await vendor.findOne({ where: { user_id } });
        if (VendorData) {
            Notification_id = VendorData.id;
        }

        const CustomerData = await customer.findOne({ where: { user_id } });
        if (CustomerData) {
            Notification_id = CustomerData.id;
        }

        const DriverData = await driver.findOne({ where: { user_id } });
        if (DriverData) {
            Notification_id = DriverData.id;
        }

        return await notification.find({
            where: { user_id: Notification_id },
            order: { created_on: "DESC" }
        });
    }

    // Insert new notification
    async Insert(data: NotificationModel, createdById: string, userIp: string) {
        const _notification = new notification();
        _notification.title = data.title;
        _notification.message = data.message;
        _notification.user_id = data.user_id;
        _notification.user_type = data.user_type;
        _notification.is_read = data.is_read ?? false;
        _notification.created_by_id = createdById;
        _notification.created_on = new Date();

        await notification.insert(_notification);

        this._AuditLogService.AuditEmitEvent({
            PerformedType: notification.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_notification.id],
            UserIp: userIp
        });

        return _notification;
    }

    // Optional: mark as read
    async MarkAsRead(notificationId: string, userId: string) {
        const note = await notification.findOne({ where: { id: notificationId, user_id: userId } });
        if (!note) throw new Error(ResponseEnum.NotFound);

        note.is_read = true;
        await note.save();
        return note;
    }

    // Optional: delete
    async Delete(notificationId: string, userId: string, userIp: string) {
        const note = await notification.findOne({ where: { id: notificationId, user_id: userId } });
        if (!note) throw new Error(ResponseEnum.NotFound);

        await note.remove();

        this._AuditLogService.AuditEmitEvent({
            PerformedType: notification.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [note.id],
            UserIp: userIp
        });

        return true;
    }
}
