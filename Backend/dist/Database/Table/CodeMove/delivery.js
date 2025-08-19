// Delivery Entity
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "delivery", {
    enumerable: true,
    get: function() {
        return delivery;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _order = require("./order");
const _driver = require("./driver");
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
const _DeliveryStatusEnum = require("../../../Helper/Enum/DeliveryStatusEnum");
const _bookings = require("./bookings");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let delivery = class delivery extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_order.order, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "order_id"
    }),
    _ts_metadata("design:type", typeof _order.order === "undefined" ? Object : _order.order)
], delivery.prototype, "order", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], delivery.prototype, "order_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_driver.driver, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "driver_id"
    }),
    _ts_metadata("design:type", typeof _driver.driver === "undefined" ? Object : _driver.driver)
], delivery.prototype, "driver", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], delivery.prototype, "driver_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_bookings.bookings, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "booking_id"
    }),
    _ts_metadata("design:type", typeof _bookings.bookings === "undefined" ? Object : _bookings.bookings)
], delivery.prototype, "bookings", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], delivery.prototype, "booking_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: "enum",
        enum: _DeliveryStatusEnum.DeliveryStatusEnum,
        default: _DeliveryStatusEnum.DeliveryStatusEnum.Assigned
    }),
    _ts_metadata("design:type", typeof _DeliveryStatusEnum.DeliveryStatusEnum === "undefined" ? Object : _DeliveryStatusEnum.DeliveryStatusEnum)
], delivery.prototype, "delivery_status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], delivery.prototype, "start_time", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], delivery.prototype, "assigned_time", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], delivery.prototype, "in_transit_time", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], delivery.prototype, "end_time", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], delivery.prototype, "proof_image", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], delivery.prototype, "signature", void 0);
delivery = _ts_decorate([
    (0, _typeorm.Entity)()
], delivery);

//# sourceMappingURL=delivery.js.map