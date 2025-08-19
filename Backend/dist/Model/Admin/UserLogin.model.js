"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get UserLoginModel () {
        return UserLoginModel;
    },
    get UserLoginValidationModel () {
        return UserLoginValidationModel;
    }
});
const _swagger = require("@nestjs/swagger");
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserLoginModel = class UserLoginModel {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'Email required'
    }),
    (0, _classvalidator.IsEmail)({}, {
        message: 'Invaild email format'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserLoginModel.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'Password required'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserLoginModel.prototype, "password", void 0);
let UserLoginValidationModel = class UserLoginValidationModel {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'User id required'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserLoginValidationModel.prototype, "user_id", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'OTP required'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserLoginValidationModel.prototype, "otp", void 0);

//# sourceMappingURL=UserLogin.model.js.map