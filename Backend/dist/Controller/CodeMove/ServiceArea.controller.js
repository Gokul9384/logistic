"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServiceAreaController", {
    enumerable: true,
    get: function() {
        return ServiceAreaController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _ServiceAreaservice = require("../../Service/CodeMove/ServiceArea.service");
const _ServiceAreamodel = require("../../Model/CodeMove/ServiceArea.model");
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
let ServiceAreaController = class ServiceAreaController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const ServiceAreaListData = await this._ServiceAreaService.GetAll();
        return this.SendResponseData(ServiceAreaListData);
    }
    async ById(Id) {
        const ServiceAreaData = await this._ServiceAreaService.GetById(Id);
        return this.SendResponseData(ServiceAreaData);
    }
    async Insert(ServiceAreaData, UserId, UserIp) {
        await this._ServiceAreaService.Insert(ServiceAreaData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, ServiceAreaData, UserId, UserIp) {
        await this._ServiceAreaService.Update(Id, ServiceAreaData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._ServiceAreaService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_ServiceAreaService){
        super(), this._ServiceAreaService = _ServiceAreaService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ServiceAreaController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ServiceAreaController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ServiceAreamodel.ServiceAreaModel === "undefined" ? Object : _ServiceAreamodel.ServiceAreaModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ServiceAreaController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _ServiceAreamodel.ServiceAreaModel === "undefined" ? Object : _ServiceAreamodel.ServiceAreaModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ServiceAreaController.prototype, "Update", null);
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
], ServiceAreaController.prototype, "Delete", null);
ServiceAreaController = _ts_decorate([
    (0, _common.Controller)({
        path: "ServiceArea",
        version: '1'
    }),
    (0, _swagger.ApiTags)("ServiceArea"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ServiceAreaservice.ServiceAreaService === "undefined" ? Object : _ServiceAreaservice.ServiceAreaService
    ])
], ServiceAreaController);

//# sourceMappingURL=ServiceArea.controller.js.map