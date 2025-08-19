"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomerModel", {
    enumerable: true,
    get: function() {
        return CustomerModel;
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
let CustomerModel = class CustomerModel extends _Basemodel.BaseModel {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], CustomerModel.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], CustomerModel.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], CustomerModel.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], CustomerModel.prototype, "mobile", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], CustomerModel.prototype, "gst_number", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false,
        description: "Latitude of customer location"
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], CustomerModel.prototype, "latitude", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false,
        description: "Longitude of customer location"
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], CustomerModel.prototype, "longitude", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false,
        description: "Formatted address from Google Maps"
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], CustomerModel.prototype, "formatted_address", void 0);

//# sourceMappingURL=Customer.model.js.map