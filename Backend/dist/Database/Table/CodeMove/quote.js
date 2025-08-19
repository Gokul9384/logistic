"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "quote", {
    enumerable: true,
    get: function() {
        return quote;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
const _QuoteEnum = require("../../../Helper/Enum/QuoteEnum");
const _requirement = require("./requirement");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let quote = class quote extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_requirement.requirement, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "requirement_id"
    }),
    _ts_metadata("design:type", typeof _requirement.requirement === "undefined" ? Object : _requirement.requirement)
], quote.prototype, "requirement", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], quote.prototype, "requirement_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], quote.prototype, "quote_number", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)('decimal', {
        precision: 12,
        scale: 2
    }),
    _ts_metadata("design:type", Number)
], quote.prototype, "quote_amount", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: "enum",
        enum: _QuoteEnum.QuoteStatusEnum,
        default: _QuoteEnum.QuoteStatusEnum.Sent
    }),
    _ts_metadata("design:type", typeof _QuoteEnum.QuoteStatusEnum === "undefined" ? Object : _QuoteEnum.QuoteStatusEnum)
], quote.prototype, "quote_status", void 0);
quote = _ts_decorate([
    (0, _typeorm.Entity)()
], quote);

//# sourceMappingURL=quote.js.map