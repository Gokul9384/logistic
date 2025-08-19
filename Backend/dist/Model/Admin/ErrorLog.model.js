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
    get ErrorLogDeleteModel () {
        return ErrorLogDeleteModel;
    },
    get ErrorLogLazyLoadModel () {
        return ErrorLogLazyLoadModel;
    }
});
const _swagger = require("@nestjs/swagger");
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _Commonhelper = require("../../Helper/Common.helper");
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
let ErrorLogLazyLoadModel = class ErrorLogLazyLoadModel extends _Basemodel.PaginationModel {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: "User id required"
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], ErrorLogLazyLoadModel.prototype, "user_id", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: "Start date required"
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Transform)(({ value })=>(0, _Commonhelper.DBDateTimeStart)(value), {
        toClassOnly: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ErrorLogLazyLoadModel.prototype, "start_date", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: "End date required"
    }),
    (0, _classtransformer.Transform)(({ value })=>(0, _Commonhelper.DBDateTimeEnd)(value), {
        toClassOnly: false
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ErrorLogLazyLoadModel.prototype, "end_date", void 0);
let ErrorLogDeleteModel = class ErrorLogDeleteModel {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: "Password required"
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], ErrorLogDeleteModel.prototype, "password", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: "Start date required"
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Transform)(({ value })=>(0, _Commonhelper.DBDateTimeEnd)(value), {
        toClassOnly: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ErrorLogDeleteModel.prototype, "as_of_date", void 0);

//# sourceMappingURL=ErrorLog.model.js.map