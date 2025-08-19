"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "order", {
    enumerable: true,
    get: function() {
        return order;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _customer = require("./customer");
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
const _PriorityEnum = require("../../../Helper/Enum/PriorityEnum");
const _OrderStatusEnum = require("../../../Helper/Enum/OrderStatusEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let order = class order extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_customer.customer, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "customer_id"
    }),
    _ts_metadata("design:type", typeof _customer.customer === "undefined" ? Object : _customer.customer)
], order.prototype, "customer", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], order.prototype, "customer_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], order.prototype, "order_number", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], order.prototype, "material", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], order.prototype, "source_location", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], order.prototype, "destination_location", void 0);
_ts_decorate([
    (0, _typeorm.Column)("decimal", {
        precision: 10,
        scale: 2
    }),
    _ts_metadata("design:type", Number)
], order.prototype, "weight", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: "enum",
        enum: _PriorityEnum.PriorityEnum,
        default: _PriorityEnum.PriorityEnum.Medium
    }),
    _ts_metadata("design:type", typeof _PriorityEnum.PriorityEnum === "undefined" ? Object : _PriorityEnum.PriorityEnum)
], order.prototype, "priority", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], order.prototype, "expected_date", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: "enum",
        enum: _OrderStatusEnum.OrderStatusEnum,
        default: _OrderStatusEnum.OrderStatusEnum.New
    }),
    _ts_metadata("design:type", typeof _OrderStatusEnum.OrderStatusEnum === "undefined" ? Object : _OrderStatusEnum.OrderStatusEnum)
], order.prototype, "order_status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'datetime',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], order.prototype, "order_date", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], order.prototype, "pickup_date", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'time',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], order.prototype, "pickup_time", void 0);
order = _ts_decorate([
    (0, _typeorm.Entity)()
], order);

//# sourceMappingURL=order.js.map