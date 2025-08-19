"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserRoleModel", {
    enumerable: true,
    get: function() {
        return UserRoleModel;
    }
});
const _swagger = require("@nestjs/swagger");
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _Basemodel = require("../Base.model");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserRoleModel = class UserRoleModel extends _Basemodel.BaseModel {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'User role name required'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserRoleModel.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)({
        message: 'User role code required'
    }),
    (0, _swagger.ApiProperty)({
        required: true
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserRoleModel.prototype, "code", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>String),
    _ts_metadata("design:type", String)
], UserRoleModel.prototype, "landing_page", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    (0, _classtransformer.Type)(()=>Object),
    _ts_metadata("design:type", Object)
], UserRoleModel.prototype, "permissions", void 0);

//# sourceMappingURL=UserRole.model.js.map