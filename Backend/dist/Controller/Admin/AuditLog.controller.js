"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditLogController", {
    enumerable: true,
    get: function() {
        return AuditLogController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _AuditLogservice = require("../../Service/Admin/AuditLog.service");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _AuditLogmodel = require("../../Model/Admin/AuditLog.model");
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
let AuditLogController = class AuditLogController extends _JWTAuthcontroller.JWTAuthController {
    async LazyLoadList(AuditLogLazyLoadData) {
        const AuditLogListData = await this._AuditLogService.LazyLoadList(AuditLogLazyLoadData);
        return this.SendResponseData({
            data: AuditLogListData.data,
            total: AuditLogListData.total_record
        });
    }
    async UserList(AuditLogFilterDate) {
        const UserListData = await this._AuditLogService.AuditLogList(AuditLogFilterDate);
        return this.SendResponseData(UserListData);
    }
    async DetailList(EventLog) {
        const AuditLogListData = await this._AuditLogService.DetailList(EventLog);
        return this.SendResponseData(AuditLogListData);
    }
    constructor(_AuditLogService){
        super(), this._AuditLogService = _AuditLogService;
    }
};
_ts_decorate([
    (0, _common.Get)('LazyLoadList'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogmodel.AuditLogLazyLoadModel === "undefined" ? Object : _AuditLogmodel.AuditLogLazyLoadModel
    ]),
    _ts_metadata("design:returntype", Promise)
], AuditLogController.prototype, "LazyLoadList", null);
_ts_decorate([
    (0, _common.Post)('AuditLogList'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogmodel.AuditLogFilterModel === "undefined" ? Object : _AuditLogmodel.AuditLogFilterModel
    ]),
    _ts_metadata("design:returntype", Promise)
], AuditLogController.prototype, "UserList", null);
_ts_decorate([
    (0, _common.Post)('DetailList'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuditLogController.prototype, "DetailList", null);
AuditLogController = _ts_decorate([
    (0, _common.Controller)({
        path: "AuditLog",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Audit Log"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService
    ])
], AuditLogController);

//# sourceMappingURL=AuditLog.controller.js.map