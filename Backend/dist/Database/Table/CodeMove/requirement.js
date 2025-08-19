"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "requirement", {
    enumerable: true,
    get: function() {
        return requirement;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _order = require("./order");
const _vendor = require("./vendor");
const _QuoteEnum = require("../../../Helper/Enum/QuoteEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let requirement = class requirement extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_order.order, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "order_id"
    }),
    _ts_metadata("design:type", typeof _order.order === "undefined" ? Object : _order.order)
], requirement.prototype, "order", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], requirement.prototype, "order_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_vendor.vendor, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "vendor_id"
    }),
    _ts_metadata("design:type", typeof _vendor.vendor === "undefined" ? Object : _vendor.vendor)
], requirement.prototype, "vendor", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], requirement.prototype, "vendor_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], requirement.prototype, "requirement_number", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: "enum",
        enum: _QuoteEnum.RequirementEnum,
        default: _QuoteEnum.RequirementEnum.Sent
    }),
    _ts_metadata("design:type", typeof _QuoteEnum.RequirementEnum === "undefined" ? Object : _QuoteEnum.RequirementEnum)
], requirement.prototype, "requirement_status", void 0);
requirement = _ts_decorate([
    (0, _typeorm.Entity)()
], requirement);

//# sourceMappingURL=requirement.js.map