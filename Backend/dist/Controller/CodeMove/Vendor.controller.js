"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VendorController", {
    enumerable: true,
    get: function() {
        return VendorController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _Vendorservice = require("../../Service/CodeMove/Vendor.service");
const _Vendormodel = require("../../Model/CodeMove/Vendor.model");
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
let VendorController = class VendorController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const VendorListData = await this._VendorService.GetAll();
        return this.SendResponseData(VendorListData);
    }
    async ById(Id) {
        const VendorData = await this._VendorService.GetById(Id);
        return this.SendResponseData(VendorData);
    }
    async Insert(VendorData, UserId, UserIp) {
        await this._VendorService.Insert(VendorData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, VendorData, UserId, UserIp) {
        await this._VendorService.Update(Id, VendorData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._VendorService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_VendorService){
        super(), this._VendorService = _VendorService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], VendorController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], VendorController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Vendormodel.VendorModel === "undefined" ? Object : _Vendormodel.VendorModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], VendorController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _Vendormodel.VendorModel === "undefined" ? Object : _Vendormodel.VendorModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], VendorController.prototype, "Update", null);
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
], VendorController.prototype, "Delete", null);
VendorController = _ts_decorate([
    (0, _common.Controller)({
        path: "Vendor",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Vendor"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Vendorservice.VendorService === "undefined" ? Object : _Vendorservice.VendorService
    ])
], VendorController);

//# sourceMappingURL=Vendor.controller.js.map