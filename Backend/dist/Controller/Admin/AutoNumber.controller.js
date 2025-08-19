"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AutoNumberController", {
    enumerable: true,
    get: function() {
        return AutoNumberController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _Commonservice = require("../../Service/Common.service");
const _ModuleTypeEnum = require("../../Helper/Enum/ModuleTypeEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AutoNumberController = class AutoNumberController extends _JWTAuthcontroller.JWTAuthController {
    async Generate(Type) {
        const ResultData = await this._CommonService.TransactionRunningNumber(Type);
        return this.SendResponseData({
            number: ResultData
        });
    }
    constructor(_CommonService){
        super(), this._CommonService = _CommonService;
    }
};
_ts_decorate([
    (0, _common.Get)('Generate/:Type'),
    _ts_param(0, (0, _common.Param)('Type')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ModuleTypeEnum.ModuleTypeEnum === "undefined" ? Object : _ModuleTypeEnum.ModuleTypeEnum
    ]),
    _ts_metadata("design:returntype", Promise)
], AutoNumberController.prototype, "Generate", null);
AutoNumberController = _ts_decorate([
    (0, _common.Controller)({
        path: "AutoNumber",
        version: '1'
    }),
    (0, _swagger.ApiTags)("AutoNumber"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Commonservice.CommonService === "undefined" ? Object : _Commonservice.CommonService
    ])
], AutoNumberController);

//# sourceMappingURL=AutoNumber.controller.js.map