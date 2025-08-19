"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CurrencyController", {
    enumerable: true,
    get: function() {
        return CurrencyController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _Currencyservice = require("../../Service/Admin/Currency.service");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _Currencymodel = require("../../Model/Admin/Currency.model");
const _JWTAuthcontroller = require("../JWTAuth.controller");
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
let CurrencyController = class CurrencyController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const CurrencyListData = await this._CurrencyService.GetAll();
        return this.SendResponseData(CurrencyListData);
    }
    async ById(Id) {
        const CurrencyData = await this._CurrencyService.GetById(Id);
        return this.SendResponseData(CurrencyData);
    }
    async Insert(CurrencyData, UserId, UserIp) {
        await this._CurrencyService.Insert(CurrencyData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, CurrencyData, UserId, UserIp) {
        await this._CurrencyService.Update(Id, CurrencyData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._CurrencyService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_CurrencyService){
        super(), this._CurrencyService = _CurrencyService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CurrencyController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CurrencyController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Currencymodel.CurrencyModel === "undefined" ? Object : _Currencymodel.CurrencyModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CurrencyController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _Currencymodel.CurrencyModel === "undefined" ? Object : _Currencymodel.CurrencyModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CurrencyController.prototype, "Update", null);
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
], CurrencyController.prototype, "Delete", null);
CurrencyController = _ts_decorate([
    (0, _common.Controller)({
        path: "Currency",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Currency"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Currencyservice.CurrencyService === "undefined" ? Object : _Currencyservice.CurrencyService
    ])
], CurrencyController);

//# sourceMappingURL=Currency.controller.js.map