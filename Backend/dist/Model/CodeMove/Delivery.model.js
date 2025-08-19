// Delivery Model
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeliveryModel", {
    enumerable: true,
    get: function() {
        return DeliveryModel;
    }
});
const _Basemodel = require("../Base.model");
const _swagger = require("@nestjs/swagger");
const _DeliveryStatusEnum = require("../../Helper/Enum/DeliveryStatusEnum");
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
let DeliveryModel = class DeliveryModel extends _Basemodel.BaseModel {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], DeliveryModel.prototype, "order_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], DeliveryModel.prototype, "driver_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], DeliveryModel.prototype, "booking_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: true,
        enum: _DeliveryStatusEnum.DeliveryStatusEnum
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", typeof _DeliveryStatusEnum.DeliveryStatusEnum === "undefined" ? Object : _DeliveryStatusEnum.DeliveryStatusEnum)
], DeliveryModel.prototype, "delivery_status", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], DeliveryModel.prototype, "assigned_time", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], DeliveryModel.prototype, "in_transit_time", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], DeliveryModel.prototype, "start_time", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], DeliveryModel.prototype, "end_time", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], DeliveryModel.prototype, "proof_image", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], DeliveryModel.prototype, "signature", void 0);

//# sourceMappingURL=Delivery.model.js.map