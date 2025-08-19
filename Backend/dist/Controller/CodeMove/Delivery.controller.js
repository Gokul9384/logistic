"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeliveryController", {
    enumerable: true,
    get: function() {
        return DeliveryController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _Deliveryservice = require("../../Service/CodeMove/Delivery.service");
const _Deliverymodel = require("../../Model/CodeMove/Delivery.model");
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
let DeliveryController = class DeliveryController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const data = await this._DeliveryService.GetAll();
        return this.SendResponseData(data);
    }
    async ById(Id) {
        const data = await this._DeliveryService.GetById(Id);
        return this.SendResponseData(data);
    }
    async Insert(DeliveryData, UserId, UserIp) {
        await this._DeliveryService.Insert(DeliveryData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, DeliveryData, UserId, UserIp) {
        await this._DeliveryService.Update(Id, DeliveryData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._DeliveryService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_DeliveryService){
        super(), this._DeliveryService = _DeliveryService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Deliverymodel.DeliveryModel === "undefined" ? Object : _Deliverymodel.DeliveryModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _Deliverymodel.DeliveryModel === "undefined" ? Object : _Deliverymodel.DeliveryModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DeliveryController.prototype, "Update", null);
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
], DeliveryController.prototype, "Delete", null);
DeliveryController = _ts_decorate([
    (0, _common.Controller)({
        path: "Delivery",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Delivery"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Deliveryservice.DeliveryService === "undefined" ? Object : _Deliveryservice.DeliveryService
    ])
], DeliveryController);

//# sourceMappingURL=Delivery.controller.js.map