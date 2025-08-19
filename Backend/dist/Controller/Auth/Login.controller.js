"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoginController", {
    enumerable: true,
    get: function() {
        return LoginController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _Usermodel = require("../../Model/Admin/User.model");
const _UserLoginmodel = require("../../Model/Admin/UserLogin.model");
const _Userservice = require("../../Service/Admin/User.service");
const _Authservice = require("../../Service/Auth/Auth.service");
const _AuthBasecontroller = require("../AuthBase.controller");
const _SignUpServiceservice = require("../../Service/Auth/SignUpService.service");
const _Customermodel = require("../../Model/CodeMove/Customer.model");
const _Commonhelper = require("../../Helper/Common.helper");
const _Vendormodel = require("../../Model/CodeMove/Vendor.model");
const _Cacheservice = require("../../Service/Cache.service");
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
let LoginController = class LoginController extends _AuthBasecontroller.AuthBaseController {
    async UserLogin(UserLogin) {
        const result = await this._AuthService.ValidateUser(UserLogin.email, UserLogin.password);
        return {
            Type: _ResponseEnum.ResponseEnum.Success,
            Message: 'Login Successfully',
            result
        };
    }
    async ForgotPassword(ForgotPasswordData) {
        const Result = await this._UserService.ForgotPassword(ForgotPasswordData.email);
        if (Result.status) {
            return this.SendResponse(_ResponseEnum.ResponseEnum.Success, "Forgot password request accepted, please check mail");
        } else {
            return this.SendResponse(_ResponseEnum.ResponseEnum.Error, Result.message);
        }
    }
    async ResetPassword(ResetPasswordData) {
        await this._UserService.ResetPassword(ResetPasswordData);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, "Password reseted successfully");
    }
    async CustomerSignUp(CustomerData, UserIp) {
        await this._SignUpService.CustomerSignUp(CustomerData, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async VendorSignUp(VendorData, UserIp) {
        await this._SignUpService.VendorSignUp(VendorData, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async ClearCache() {
        await this._CacheService.Flush();
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, "Cache cleared successfully");
    }
    constructor(_AuthService, _UserService, _SignUpService, _CacheService){
        super(), this._AuthService = _AuthService, this._UserService = _UserService, this._SignUpService = _SignUpService, this._CacheService = _CacheService;
    }
};
_ts_decorate([
    (0, _common.Post)('Login'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _UserLoginmodel.UserLoginModel === "undefined" ? Object : _UserLoginmodel.UserLoginModel
    ]),
    _ts_metadata("design:returntype", Promise)
], LoginController.prototype, "UserLogin", null);
_ts_decorate([
    (0, _common.Post)('ForgotPassword'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Usermodel.ForgotPasswordModel === "undefined" ? Object : _Usermodel.ForgotPasswordModel
    ]),
    _ts_metadata("design:returntype", Promise)
], LoginController.prototype, "ForgotPassword", null);
_ts_decorate([
    (0, _common.Post)('ResetPassword'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Usermodel.ResetPasswordModel === "undefined" ? Object : _Usermodel.ResetPasswordModel
    ]),
    _ts_metadata("design:returntype", Promise)
], LoginController.prototype, "ResetPassword", null);
_ts_decorate([
    (0, _common.Post)('CustomerSignUp'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Customermodel.CustomerModel === "undefined" ? Object : _Customermodel.CustomerModel,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LoginController.prototype, "CustomerSignUp", null);
_ts_decorate([
    (0, _common.Post)('VendorSignUp'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Vendormodel.VendorModel === "undefined" ? Object : _Vendormodel.VendorModel,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LoginController.prototype, "VendorSignUp", null);
_ts_decorate([
    (0, _common.Delete)('ClearCache'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], LoginController.prototype, "ClearCache", null);
LoginController = _ts_decorate([
    (0, _common.Controller)({
        path: "Auth",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Auth"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Authservice.AuthService === "undefined" ? Object : _Authservice.AuthService,
        typeof _Userservice.UserService === "undefined" ? Object : _Userservice.UserService,
        typeof _SignUpServiceservice.SignUpService === "undefined" ? Object : _SignUpServiceservice.SignUpService,
        typeof _Cacheservice.CacheService === "undefined" ? Object : _Cacheservice.CacheService
    ])
], LoginController);

//# sourceMappingURL=Login.controller.js.map