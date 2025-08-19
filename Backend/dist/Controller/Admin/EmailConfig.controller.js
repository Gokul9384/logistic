"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailConfigController", {
    enumerable: true,
    get: function() {
        return EmailConfigController;
    }
});
const _common = require("@nestjs/common");
const _EmailConfigmodel = require("../../Model/Admin/EmailConfig.model");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _EmailConfigservice = require("../../Service/Admin/EmailConfig.service");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _JWTAuthcontroller = require("../JWTAuth.controller");
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
let EmailConfigController = class EmailConfigController extends _JWTAuthcontroller.JWTAuthController {
    async EmailConfig() {
        const EmailData = await this._EmailConfigService.GetWithoutPasswordById();
        return EmailData;
    }
    async Update(EmailConfigData, UserId) {
        if (EmailConfigData.id) {
            await this._EmailConfigService.Update(EmailConfigData.id, EmailConfigData, UserId);
        } else {
            await this._EmailConfigService.Insert(EmailConfigData, UserId);
        }
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    constructor(_EmailConfigService){
        super(), this._EmailConfigService = _EmailConfigService;
    }
};
_ts_decorate([
    (0, _common.Get)(''),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], EmailConfigController.prototype, "EmailConfig", null);
_ts_decorate([
    (0, _common.Patch)('Update'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _EmailConfigmodel.EmailConfigModel === "undefined" ? Object : _EmailConfigmodel.EmailConfigModel,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], EmailConfigController.prototype, "Update", null);
EmailConfigController = _ts_decorate([
    (0, _common.Controller)({
        path: "EmailConfig",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Email Config"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _EmailConfigservice.EmailConfigService === "undefined" ? Object : _EmailConfigservice.EmailConfigService
    ])
], EmailConfigController);

//# sourceMappingURL=EmailConfig.controller.js.map