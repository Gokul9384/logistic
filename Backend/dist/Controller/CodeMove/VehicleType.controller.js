"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VehicleTypeController", {
    enumerable: true,
    get: function() {
        return VehicleTypeController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _VehicleTypeservice = require("../../Service/CodeMove/VehicleType.service");
const _VehicleTypemodel = require("../../Model/CodeMove/VehicleType.model");
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
let VehicleTypeController = class VehicleTypeController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const VehicleTypeListData = await this._VehicleTypeService.GetAll();
        return this.SendResponseData(VehicleTypeListData);
    }
    async ById(Id) {
        const VehicleTypeData = await this._VehicleTypeService.GetById(Id);
        return this.SendResponseData(VehicleTypeData);
    }
    async Insert(VehicleTypeData, UserId, UserIp) {
        await this._VehicleTypeService.Insert(VehicleTypeData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, VehicleTypeData, UserId, UserIp) {
        await this._VehicleTypeService.Update(Id, VehicleTypeData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._VehicleTypeService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_VehicleTypeService){
        super(), this._VehicleTypeService = _VehicleTypeService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], VehicleTypeController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], VehicleTypeController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _VehicleTypemodel.VehicleTypeModel === "undefined" ? Object : _VehicleTypemodel.VehicleTypeModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], VehicleTypeController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _VehicleTypemodel.VehicleTypeModel === "undefined" ? Object : _VehicleTypemodel.VehicleTypeModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], VehicleTypeController.prototype, "Update", null);
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
], VehicleTypeController.prototype, "Delete", null);
VehicleTypeController = _ts_decorate([
    (0, _common.Controller)({
        path: "VehicleType",
        version: '1'
    }),
    (0, _swagger.ApiTags)("VehicleType"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _VehicleTypeservice.VehicleTypeService === "undefined" ? Object : _VehicleTypeservice.VehicleTypeService
    ])
], VehicleTypeController);

//# sourceMappingURL=VehicleType.controller.js.map