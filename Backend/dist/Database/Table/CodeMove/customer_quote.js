"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "customer_quote", {
    enumerable: true,
    get: function() {
        return customer_quote;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
const _QuoteEnum = require("../../../Helper/Enum/QuoteEnum");
const _quote = require("./quote");
const _order = require("./order");
const _customer = require("./customer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let customer_quote = class customer_quote extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_quote.quote, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "quote_id"
    }),
    _ts_metadata("design:type", typeof _quote.quote === "undefined" ? Object : _quote.quote)
], customer_quote.prototype, "quote", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], customer_quote.prototype, "quote_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_order.order, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "order_id"
    }),
    _ts_metadata("design:type", typeof _order.order === "undefined" ? Object : _order.order)
], customer_quote.prototype, "order", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], customer_quote.prototype, "order_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_customer.customer, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "customer_id"
    }),
    _ts_metadata("design:type", typeof _customer.customer === "undefined" ? Object : _customer.customer)
], customer_quote.prototype, "customer", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], customer_quote.prototype, "customer_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], customer_quote.prototype, "customer_quote_number", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)('decimal', {
        precision: 12,
        scale: 2
    }),
    _ts_metadata("design:type", Number)
], customer_quote.prototype, "customer_quote_amount", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: "enum",
        enum: _QuoteEnum.QuoteStatusEnum,
        default: _QuoteEnum.QuoteStatusEnum.Sent
    }),
    _ts_metadata("design:type", typeof _QuoteEnum.QuoteStatusEnum === "undefined" ? Object : _QuoteEnum.QuoteStatusEnum)
], customer_quote.prototype, "customer_quote_status", void 0);
customer_quote = _ts_decorate([
    (0, _typeorm.Entity)()
], customer_quote);

//# sourceMappingURL=customer_quote.js.map