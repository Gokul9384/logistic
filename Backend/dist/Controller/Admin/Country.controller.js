"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CountryController", {
    enumerable: true,
    get: function() {
        return CountryController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _Countryservice = require("../../Service/Admin/Country.service");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _Countrymodel = require("../../Model/Admin/Country.model");
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
let CountryController = class CountryController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const CountryListData = await this._CountryService.GetAll();
        return this.SendResponseData(CountryListData);
    }
    async ById(Id) {
        const CountryData = await this._CountryService.GetById(Id);
        return this.SendResponseData(CountryData);
    }
    async Insert(CountryData, UserId, UserIp) {
        await this._CountryService.Insert(CountryData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, CountryData, UserId, UserIp) {
        await this._CountryService.Update(Id, CountryData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._CountryService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_CountryService){
        super(), this._CountryService = _CountryService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CountryController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CountryController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Countrymodel.CountryModel === "undefined" ? Object : _Countrymodel.CountryModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CountryController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _Countrymodel.CountryModel === "undefined" ? Object : _Countrymodel.CountryModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CountryController.prototype, "Update", null);
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
], CountryController.prototype, "Delete", null);
CountryController = _ts_decorate([
    (0, _common.Controller)({
        path: "Country",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Country"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Countryservice.CountryService === "undefined" ? Object : _Countryservice.CountryService
    ])
], CountryController);

//# sourceMappingURL=Country.controller.js.map