"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ErrorLogController", {
    enumerable: true,
    get: function() {
        return ErrorLogController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _ErrorLogservice = require("../../Service/Admin/ErrorLog.service");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _ErrorLogmodel = require("../../Model/Admin/ErrorLog.model");
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
let ErrorLogController = class ErrorLogController extends _JWTAuthcontroller.JWTAuthController {
    async LazyLoadList(ErrorLogLazyLoadData) {
        const ErrorLogListData = await this._ErrorLogService.LazyLoadList(ErrorLogLazyLoadData);
        return this.SendResponseData({
            data: ErrorLogListData,
            total: ErrorLogListData[0]?.total_count ?? 0
        });
    }
    async DeleteByAsOfDate(ErrorLogDeleteData) {
        await this._ErrorLogService.DeleteByAsOfDate(ErrorLogDeleteData);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_ErrorLogService){
        super(), this._ErrorLogService = _ErrorLogService;
    }
};
_ts_decorate([
    (0, _common.Post)('LazyLoadList'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ErrorLogmodel.ErrorLogLazyLoadModel === "undefined" ? Object : _ErrorLogmodel.ErrorLogLazyLoadModel
    ]),
    _ts_metadata("design:returntype", Promise)
], ErrorLogController.prototype, "LazyLoadList", null);
_ts_decorate([
    (0, _common.Post)('DeleteByAsOfDate'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ErrorLogmodel.ErrorLogDeleteModel === "undefined" ? Object : _ErrorLogmodel.ErrorLogDeleteModel
    ]),
    _ts_metadata("design:returntype", Promise)
], ErrorLogController.prototype, "DeleteByAsOfDate", null);
ErrorLogController = _ts_decorate([
    (0, _common.Controller)({
        path: "ErrorLog",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Error Log"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ErrorLogservice.ErrorLogService === "undefined" ? Object : _ErrorLogservice.ErrorLogService
    ])
], ErrorLogController);

//# sourceMappingURL=ErrorLog.controller.js.map