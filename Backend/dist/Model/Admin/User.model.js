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
    get ChangePasswordModel () {
        return ChangePasswordModel;
    },
    get ForgotPasswordModel () {
        return ForgotPasswordModel;
    },
    get ResetPasswordModel () {
        return ResetPasswordModel;
    },
    get UserModel () {
        return UserModel;
    }
});
const _swagger = require("@nestjs/swagger");
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _Basemodel = require("../Base.model");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserModel = class UserModel extends _Basemodel.BaseModel {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'User role required'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserModel.prototype, "user_role_id", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'First name required'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserModel.prototype, "first_name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserModel.prototype, "last_name", void 0);
_ts_decorate([
    (0, _classvalidator.IsEmail)({}, {
        message: 'Invaild Email format'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Email required'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserModel.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((o)=>!(o.id > "0")),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Password required'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserModel.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserModel.prototype, "mobile", void 0);
let ForgotPasswordModel = class ForgotPasswordModel {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'Email required'
    }),
    (0, _classvalidator.IsEmail)({}, {
        message: 'Invaild Email format'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], ForgotPasswordModel.prototype, "email", void 0);
let ResetPasswordModel = class ResetPasswordModel {
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
], ResetPasswordModel.prototype, "user_id", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'Reset OTP required'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], ResetPasswordModel.prototype, "reset_otp", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'Password required'
    }),
    (0, _classvalidator.MinLength)(6, {
        message: 'Password length mininum 6 characters'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], ResetPasswordModel.prototype, "password", void 0);
let ChangePasswordModel = class ChangePasswordModel {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'Password required'
    }),
    (0, _classvalidator.MinLength)(6, {
        message: 'Password length mininum 6 characters'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], ChangePasswordModel.prototype, "old_password", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'Password required'
    }),
    (0, _classvalidator.MinLength)(6, {
        message: 'Password length mininum 6 characters'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], ChangePasswordModel.prototype, "password", void 0);

//# sourceMappingURL=User.model.js.map