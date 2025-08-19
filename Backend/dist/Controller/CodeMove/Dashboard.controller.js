"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardController", {
    enumerable: true,
    get: function() {
        return DashboardController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _Dashboardservice = require("../../Service/CodeMove/Dashboard.service");
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
let DashboardController = class DashboardController extends _JWTAuthcontroller.JWTAuthController {
    async getAdminDashboardSummary() {
        return await this.dashboardService.DashboardStats();
    }
    async getDashboardOrderList(startDate, endDate) {
        return await this.dashboardService.DashboardOrderList(startDate, endDate);
    }
    constructor(dashboardService){
        super(), this.dashboardService = dashboardService;
    }
};
_ts_decorate([
    (0, _common.Get)('stats'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminDashboardSummary", null);
_ts_decorate([
    (0, _common.Get)('orders'),
    _ts_param(0, (0, _common.Query)('startDate')),
    _ts_param(1, (0, _common.Query)('endDate')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardOrderList", null);
DashboardController = _ts_decorate([
    (0, _swagger.ApiTags)('Dashboard'),
    (0, _common.Controller)({
        path: 'Dashboard',
        version: '1'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Dashboardservice.DashboardService === "undefined" ? Object : _Dashboardservice.DashboardService
    ])
], DashboardController);

//# sourceMappingURL=Dashboard.controller.js.map