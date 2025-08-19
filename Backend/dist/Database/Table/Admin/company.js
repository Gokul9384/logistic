"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "company", {
    enumerable: true,
    get: function() {
        return company;
    }
});
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _country = require("./country");
const _currency = require("./currency");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let company = class company extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], company.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], company.prototype, "address", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_country.country, {
        onDelete: "RESTRICT"
    }),
    (0, _typeorm.JoinColumn)({
        name: "country_id"
    }),
    _ts_metadata("design:type", typeof _country.country === "undefined" ? Object : _country.country)
], company.prototype, "country", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], company.prototype, "country_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)((type)=>_currency.currency, {
        onDelete: "RESTRICT"
    }),
    (0, _typeorm.JoinColumn)({
        name: "currency_id"
    }),
    _ts_metadata("design:type", typeof _currency.currency === "undefined" ? Object : _currency.currency)
], company.prototype, "currency", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], company.prototype, "currency_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], company.prototype, "postal_code", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], company.prototype, "email", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], company.prototype, "website", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], company.prototype, "uen_no", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], company.prototype, "bank_name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], company.prototype, "bank_acct_no", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], company.prototype, "telephone_no", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], company.prototype, "fax_no", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], company.prototype, "invoice_footer", void 0);
company = _ts_decorate([
    (0, _typeorm.Entity)()
], company);

//# sourceMappingURL=company.js.map