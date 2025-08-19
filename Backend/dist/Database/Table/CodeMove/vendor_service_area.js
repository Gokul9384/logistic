"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "vendor_service_area", {
    enumerable: true,
    get: function() {
        return vendor_service_area;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _vendor = require("./vendor");
const _service_area = require("./service_area");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let vendor_service_area = class vendor_service_area extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_vendor.vendor, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "vendor_id"
    }),
    _ts_metadata("design:type", typeof _vendor.vendor === "undefined" ? Object : _vendor.vendor)
], vendor_service_area.prototype, "vendor", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], vendor_service_area.prototype, "vendor_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_service_area.service_area, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "service_area_id"
    }),
    _ts_metadata("design:type", typeof _service_area.service_area === "undefined" ? Object : _service_area.service_area)
], vendor_service_area.prototype, "service_area", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], vendor_service_area.prototype, "service_area_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)("decimal", {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], vendor_service_area.prototype, "min_km", void 0);
_ts_decorate([
    (0, _typeorm.Column)("decimal", {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], vendor_service_area.prototype, "max_km", void 0);
vendor_service_area = _ts_decorate([
    (0, _typeorm.Entity)()
], vendor_service_area);

//# sourceMappingURL=vendor_service_area.js.map