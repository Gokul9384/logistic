"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotificationService", {
    enumerable: true,
    get: function() {
        return NotificationService;
    }
});
const _common = require("@nestjs/common");
const _notification = require("../../Database/Table/CodeMove/notification");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _vendor = require("../../Database/Table/CodeMove/vendor");
const _customer = require("../../Database/Table/CodeMove/customer");
const _driver = require("../../Database/Table/CodeMove/driver");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let NotificationService = class NotificationService {
    // List notifications by user_id
    async GetAllByUserId(user_id) {
        let Notification_id = user_id;
        const VendorData = await _vendor.vendor.findOne({
            where: {
                user_id
            }
        });
        if (VendorData) {
            Notification_id = VendorData.id;
        }
        const CustomerData = await _customer.customer.findOne({
            where: {
                user_id
            }
        });
        if (CustomerData) {
            Notification_id = CustomerData.id;
        }
        const DriverData = await _driver.driver.findOne({
            where: {
                user_id
            }
        });
        if (DriverData) {
            Notification_id = DriverData.id;
        }
        return await _notification.notification.find({
            where: {
                user_id: Notification_id
            },
            order: {
                created_on: "DESC"
            }
        });
    }
    // Insert new notification
    async Insert(data, createdById, userIp) {
        const _notification1 = new _notification.notification();
        _notification1.title = data.title;
        _notification1.message = data.message;
        _notification1.user_id = data.user_id;
        _notification1.user_type = data.user_type;
        _notification1.is_read = data.is_read ?? false;
        _notification1.created_by_id = createdById;
        _notification1.created_on = new Date();
        await _notification.notification.insert(_notification1);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _notification.notification.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _notification1.id
            ],
            UserIp: userIp
        });
        return _notification1;
    }
    // Optional: mark as read
    async MarkAsRead(notificationId, userId) {
        const note = await _notification.notification.findOne({
            where: {
                id: notificationId,
                user_id: userId
            }
        });
        if (!note) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        note.is_read = true;
        await note.save();
        return note;
    }
    // Optional: delete
    async Delete(notificationId, userId, userIp) {
        const note = await _notification.notification.findOne({
            where: {
                id: notificationId,
                user_id: userId
            }
        });
        if (!note) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        await note.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _notification.notification.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                note.id
            ],
            UserIp: userIp
        });
        return true;
    }
    constructor(_AuditLogService){
        this._AuditLogService = _AuditLogService;
    }
};
NotificationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService
    ])
], NotificationService);

//# sourceMappingURL=Notification.service.js.map