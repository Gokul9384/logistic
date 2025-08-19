"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotificationController", {
    enumerable: true,
    get: function() {
        return NotificationController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _Notificationservice = require("../../Service/CodeMove/Notification.service");
const _Notificationmodel = require("../../Model/CodeMove/Notification.model");
const _Commonhelper = require("../../Helper/Common.helper");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let NotificationController = class NotificationController extends _JWTAuthcontroller.JWTAuthController {
    // Get all notifications by user
    async List(UserId) {
        const data = await this._NotificationService.GetAllByUserId(UserId);
        return this.SendResponseData(data);
    }
    // Insert a new notification
    async Insert(body, UserId, ip) {
        await this._NotificationService.Insert(body, UserId, ip);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    // Optional: Mark notification as read
    async MarkAsRead(Id, UserId) {
        const data = await this._NotificationService.MarkAsRead(Id, UserId);
        return this.SendResponseData(data);
    }
    // Optional: Delete a notification
    async Delete(Id, UserId, ip) {
        await this._NotificationService.Delete(Id, UserId, ip);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_NotificationService){
        super(), this._NotificationService = _NotificationService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_param(0, (0, _Commonhelper.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationController.prototype, "List", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Notificationmodel.NotificationModel === "undefined" ? Object : _Notificationmodel.NotificationModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('MarkAsRead/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationController.prototype, "MarkAsRead", null);
_ts_decorate([
    (0, _common.Delete)('Delete/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationController.prototype, "Delete", null);
NotificationController = _ts_decorate([
    (0, _common.Controller)({
        path: 'Notification',
        version: '1'
    }),
    (0, _swagger.ApiTags)('Notification'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Notificationservice.NotificationService === "undefined" ? Object : _Notificationservice.NotificationService
    ])
], NotificationController);

//# sourceMappingURL=Notification.controller.js.map