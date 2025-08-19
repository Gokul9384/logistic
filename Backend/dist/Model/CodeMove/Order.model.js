"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderModel", {
    enumerable: true,
    get: function() {
        return OrderModel;
    }
});
const _Basemodel = require("../Base.model");
const _swagger = require("@nestjs/swagger");
const _OrderStatusEnum = require("../../Helper/Enum/OrderStatusEnum");
const _PriorityEnum = require("../../Helper/Enum/PriorityEnum");
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
let OrderModel = class OrderModel extends _Basemodel.BaseModel {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], OrderModel.prototype, "customer_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], OrderModel.prototype, "order_number", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], OrderModel.prototype, "material", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], OrderModel.prototype, "source_location", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], OrderModel.prototype, "destination_location", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], OrderModel.prototype, "weight", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false,
        enum: _PriorityEnum.PriorityEnum
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", typeof _PriorityEnum.PriorityEnum === "undefined" ? Object : _PriorityEnum.PriorityEnum)
], OrderModel.prototype, "priority", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], OrderModel.prototype, "expected_date", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false,
        enum: _OrderStatusEnum.OrderStatusEnum
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", typeof _OrderStatusEnum.OrderStatusEnum === "undefined" ? Object : _OrderStatusEnum.OrderStatusEnum)
], OrderModel.prototype, "order_status", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], OrderModel.prototype, "order_date", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], OrderModel.prototype, "pickup_date", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], OrderModel.prototype, "pickup_time", void 0);

//# sourceMappingURL=Order.model.js.map