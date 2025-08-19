"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CompanyController", {
    enumerable: true,
    get: function() {
        return CompanyController;
    }
});
const _common = require("@nestjs/common");
const _Companymodel = require("../../Model/Admin/Company.model");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _Companyservice = require("../../Service/Admin/Company.service");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
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
let CompanyController = class CompanyController extends _JWTAuthcontroller.JWTAuthController {
    async Get() {
        const EmailData = await this._CompanyService.Get();
        return EmailData;
    }
    async Update(CompanyData, UserId, UserIp) {
        if (CompanyData.id > "0") {
            await this._CompanyService.Update(CompanyData.id, CompanyData, UserId, UserIp);
        } else {
            await this._CompanyService.Insert(CompanyData, UserId, UserIp);
        }
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    constructor(_CompanyService){
        super(), this._CompanyService = _CompanyService;
    }
};
_ts_decorate([
    (0, _common.Get)('Get'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CompanyController.prototype, "Get", null);
_ts_decorate([
    (0, _common.Patch)('Update'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Companymodel.CompanyModel === "undefined" ? Object : _Companymodel.CompanyModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CompanyController.prototype, "Update", null);
CompanyController = _ts_decorate([
    (0, _common.Controller)({
        path: "Company",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Company"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Companyservice.CompanyService === "undefined" ? Object : _Companyservice.CompanyService
    ])
], CompanyController);

//# sourceMappingURL=Company.controller.js.map