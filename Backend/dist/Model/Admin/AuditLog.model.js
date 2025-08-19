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
    get AuditLogFilterModel () {
        return AuditLogFilterModel;
    },
    get AuditLogLazyLoadModel () {
        return AuditLogLazyLoadModel;
    },
    get AuditLogModel () {
        return AuditLogModel;
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
let AuditLogModel = class AuditLogModel {
};
let AuditLogLazyLoadModel = class AuditLogLazyLoadModel extends _Basemodel.PaginationModel {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], AuditLogLazyLoadModel.prototype, "action", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], AuditLogLazyLoadModel.prototype, "user_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], AuditLogLazyLoadModel.prototype, "module", void 0);
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
], AuditLogLazyLoadModel.prototype, "start_date", void 0);
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
], AuditLogLazyLoadModel.prototype, "end_date", void 0);
let AuditLogFilterModel = class AuditLogFilterModel {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AuditLogFilterModel.prototype, "Start_date", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AuditLogFilterModel.prototype, "end_date", void 0);

//# sourceMappingURL=AuditLog.model.js.map