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
    get BaseModel () {
        return BaseModel;
    },
    get PaginationModel () {
        return PaginationModel;
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
let BaseModel = class BaseModel {
};
_ts_decorate([
    (0, _classvalidator.Allow)(),
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], BaseModel.prototype, "id", void 0);
_ts_decorate([
    (0, _classvalidator.Allow)(),
    (0, _swagger.ApiProperty)({
        default: true,
        required: false
    }),
    (0, _classtransformer.Type)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], BaseModel.prototype, "status", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], BaseModel.prototype, "created_by_id", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], BaseModel.prototype, "updated_by_id", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BaseModel.prototype, "created_on", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BaseModel.prototype, "updated_on", void 0);
let PaginationModel = class PaginationModel {
    constructor(){
        this.take = 10;
        this.skip = 0;
        this.keyword = "";
    }
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], PaginationModel.prototype, "take", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], PaginationModel.prototype, "skip", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], PaginationModel.prototype, "keyword", void 0);

//# sourceMappingURL=Base.model.js.map