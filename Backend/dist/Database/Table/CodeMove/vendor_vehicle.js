"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "vendor_vehicle", {
    enumerable: true,
    get: function() {
        return vendor_vehicle;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _vehicle_type = require("./vehicle_type");
const _vendor = require("./vendor");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let vendor_vehicle = class vendor_vehicle extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_vendor.vendor, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "vendor_id"
    }),
    _ts_metadata("design:type", typeof _vendor.vendor === "undefined" ? Object : _vendor.vendor)
], vendor_vehicle.prototype, "vendor", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], vendor_vehicle.prototype, "vendor_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_vehicle_type.vehicle_type, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "vehicle_type_id"
    }),
    _ts_metadata("design:type", typeof _vehicle_type.vehicle_type === "undefined" ? Object : _vehicle_type.vehicle_type)
], vendor_vehicle.prototype, "vehicle_type", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], vendor_vehicle.prototype, "vehicle_type_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)("decimal", {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], vendor_vehicle.prototype, "min_capacity", void 0);
_ts_decorate([
    (0, _typeorm.Column)("decimal", {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], vendor_vehicle.prototype, "max_capacity", void 0);
vendor_vehicle = _ts_decorate([
    (0, _typeorm.Entity)()
], vendor_vehicle);

//# sourceMappingURL=vendor_vehicle.js.map