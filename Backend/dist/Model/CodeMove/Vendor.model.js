"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VendorModel", {
    enumerable: true,
    get: function() {
        return VendorModel;
    }
});
const _Basemodel = require("../Base.model");
const _swagger = require("@nestjs/swagger");
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
let VendorVehicleModel = class VendorVehicleModel {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], VendorVehicleModel.prototype, "vehicle_type_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], VendorVehicleModel.prototype, "min_capacity", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], VendorVehicleModel.prototype, "max_capacity", void 0);
let VendorServiceAreaModel = class VendorServiceAreaModel {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], VendorServiceAreaModel.prototype, "service_area_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], VendorServiceAreaModel.prototype, "min_km", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], VendorServiceAreaModel.prototype, "max_km", void 0);
let VendorModel = class VendorModel extends _Basemodel.BaseModel {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], VendorModel.prototype, "company_name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], VendorModel.prototype, "address", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], VendorModel.prototype, "service_area", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], VendorModel.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], VendorModel.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], VendorModel.prototype, "mobile", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], VendorModel.prototype, "gst_number", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], VendorModel.prototype, "pan_number", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: [
            VendorVehicleModel
        ],
        required: false
    }),
    (0, _classtransformer.Type)(()=>VendorVehicleModel),
    _ts_metadata("design:type", Array)
], VendorModel.prototype, "vendor_vehicle_list", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: [
            VendorServiceAreaModel
        ],
        required: false
    }),
    (0, _classtransformer.Type)(()=>VendorServiceAreaModel),
    _ts_metadata("design:type", Array)
], VendorModel.prototype, "vendor_service_area_list", void 0);

//# sourceMappingURL=Vendor.model.js.map