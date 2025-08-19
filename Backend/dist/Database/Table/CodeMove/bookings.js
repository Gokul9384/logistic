"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "bookings", {
    enumerable: true,
    get: function() {
        return bookings;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
const _order = require("./order");
const _vendor = require("./vendor");
const _quote = require("./quote");
const _BookingStatusEnum = require("../../../Helper/Enum/BookingStatusEnum");
const _driver = require("./driver");
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
let bookings = class bookings extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.Column)({
        unique: true
    }),
    _ts_metadata("design:type", String)
], bookings.prototype, "booking_number", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_order.order, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "order_id"
    }),
    _ts_metadata("design:type", typeof _order.order === "undefined" ? Object : _order.order)
], bookings.prototype, "order", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], bookings.prototype, "order_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_vendor.vendor, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "vendor_id"
    }),
    _ts_metadata("design:type", typeof _vendor.vendor === "undefined" ? Object : _vendor.vendor)
], bookings.prototype, "vendor", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], bookings.prototype, "vendor_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_customer.customer, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "customer_id"
    }),
    _ts_metadata("design:type", typeof _customer.customer === "undefined" ? Object : _customer.customer)
], bookings.prototype, "customer", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], bookings.prototype, "customer_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_quote.quote, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "quote_id"
    }),
    _ts_metadata("design:type", typeof _quote.quote === "undefined" ? Object : _quote.quote)
], bookings.prototype, "quote", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], bookings.prototype, "quote_id", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", Number)
], bookings.prototype, "amount", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: "enum",
        enum: _BookingStatusEnum.BookingStatusEnum,
        default: _BookingStatusEnum.BookingStatusEnum.CREATED
    }),
    _ts_metadata("design:type", typeof _BookingStatusEnum.BookingStatusEnum === "undefined" ? Object : _BookingStatusEnum.BookingStatusEnum)
], bookings.prototype, "booking_status", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_driver.driver, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "driver_id"
    }),
    _ts_metadata("design:type", typeof _driver.driver === "undefined" ? Object : _driver.driver)
], bookings.prototype, "driver", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], bookings.prototype, "driver_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], bookings.prototype, "vehicle_number", void 0);
bookings = _ts_decorate([
    (0, _typeorm.Entity)()
], bookings);

//# sourceMappingURL=bookings.js.map