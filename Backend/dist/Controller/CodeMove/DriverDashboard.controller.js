"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DriverDashboardController", {
    enumerable: true,
    get: function() {
        return DriverDashboardController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _DriverDashboardservice = require("../../Service/CodeMove/DriverDashboard.service");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _Commonhelper = require("../../Helper/Common.helper");
const _driver = require("../../Database/Table/CodeMove/driver");
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
let DriverDashboardController = class DriverDashboardController extends _JWTAuthcontroller.JWTAuthController {
    async getDriverStats(UserId) {
        const DriverData = await _driver.driver.findOne({
            where: {
                user_id: UserId
            }
        });
        return await this.DriverDashboardService.getDriverStats(DriverData.id);
    }
    async getDriverOrders(UserId, date) {
        const DriverData = await _driver.driver.findOne({
            where: {
                user_id: UserId
            }
        });
        return await this.DriverDashboardService.getDriverOrders(DriverData.id, date);
    }
    async GetAllDeliverys(UserId) {
        const DriverData = await _driver.driver.findOne({
            where: {
                user_id: UserId
            }
        });
        return await this.DriverDashboardService.GetAllDeliverys(DriverData.id);
    }
    constructor(DriverDashboardService){
        super(), this.DriverDashboardService = DriverDashboardService;
    }
};
_ts_decorate([
    (0, _common.Get)('getDriverStats'),
    _ts_param(0, (0, _Commonhelper.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DriverDashboardController.prototype, "getDriverStats", null);
_ts_decorate([
    (0, _common.Get)('getDriverOrders'),
    _ts_param(0, (0, _Commonhelper.CurrentUser)()),
    _ts_param(1, (0, _common.Query)('date')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DriverDashboardController.prototype, "getDriverOrders", null);
_ts_decorate([
    (0, _common.Get)('GetAllDeliverys'),
    _ts_param(0, (0, _Commonhelper.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DriverDashboardController.prototype, "GetAllDeliverys", null);
DriverDashboardController = _ts_decorate([
    (0, _swagger.ApiTags)('Driver Dashboard'),
    (0, _common.Controller)({
        path: 'DriverDashboard',
        version: '1'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _DriverDashboardservice.DriverDashboardService === "undefined" ? Object : _DriverDashboardservice.DriverDashboardService
    ])
], DriverDashboardController);

//# sourceMappingURL=DriverDashboard.controller.js.map