"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JWTAuthController", {
    enumerable: true,
    get: function() {
        return JWTAuthController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _Logginginterceptor = require("../Helper/Logging.interceptor");
const _JwtAuthGuardservice = require("../Service/Auth/JwtAuthGuard.service");
const _AuthBasecontroller = require("./AuthBase.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let JWTAuthController = class JWTAuthController extends _AuthBasecontroller.AuthBaseController {
};
JWTAuthController = _ts_decorate([
    (0, _common.UseGuards)(_JwtAuthGuardservice.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseInterceptors)(_Logginginterceptor.LoggingInterceptor)
], JWTAuthController);

//# sourceMappingURL=JWTAuth.controller.js.map