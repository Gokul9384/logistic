"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DriverController", {
    enumerable: true,
    get: function() {
        return DriverController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _Driverservice = require("../../Service/CodeMove/Driver.service");
const _Drivermodel = require("../../Model/CodeMove/Driver.model");
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
let DriverController = class DriverController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const data = await this._DriverService.GetAll();
        return this.SendResponseData(data);
    }
    async ById(Id) {
        const data = await this._DriverService.GetById(Id);
        return this.SendResponseData(data);
    }
    async Insert(DriverData, UserId, UserIp) {
        await this._DriverService.Insert(DriverData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, DriverData, UserId, UserIp) {
        await this._DriverService.Update(Id, DriverData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._DriverService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_DriverService){
        super(), this._DriverService = _DriverService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], DriverController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DriverController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Drivermodel.DriverModel === "undefined" ? Object : _Drivermodel.DriverModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DriverController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _Drivermodel.DriverModel === "undefined" ? Object : _Drivermodel.DriverModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DriverController.prototype, "Update", null);
_ts_decorate([
    (0, _common.Delete)('Delete/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DriverController.prototype, "Delete", null);
DriverController = _ts_decorate([
    (0, _common.Controller)({
        path: "Driver",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Driver"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Driverservice.DriverService === "undefined" ? Object : _Driverservice.DriverService
    ])
], DriverController);

//# sourceMappingURL=Driver.controller.js.map