"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "QuoteModel", {
    enumerable: true,
    get: function() {
        return QuoteModel;
    }
});
const _Basemodel = require("../Base.model");
const _swagger = require("@nestjs/swagger");
const _QuoteEnum = require("../../Helper/Enum/QuoteEnum");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let QuoteModel = class QuoteModel extends _Basemodel.BaseModel {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], QuoteModel.prototype, "requirement_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], QuoteModel.prototype, "quote_number", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], QuoteModel.prototype, "quote_amount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false,
        enum: _QuoteEnum.QuoteStatusEnum
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", typeof _QuoteEnum.QuoteStatusEnum === "undefined" ? Object : _QuoteEnum.QuoteStatusEnum)
], QuoteModel.prototype, "quote_status", void 0);

//# sourceMappingURL=Quote.model.js.map