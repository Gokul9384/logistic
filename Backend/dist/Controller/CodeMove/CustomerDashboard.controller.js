"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomerDashboardController", {
    enumerable: true,
    get: function() {
        return CustomerDashboardController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _CustomerDashboardservice = require("../../Service/CodeMove/CustomerDashboard.service");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _Commonhelper = require("../../Helper/Common.helper");
const _customer = require("../../Database/Table/CodeMove/customer");
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
let CustomerDashboardController = class CustomerDashboardController extends _JWTAuthcontroller.JWTAuthController {
    async getCustomerDashboardStats(UserId) {
        const CustomerData = await _customer.customer.findOne({
            where: {
                user_id: UserId
            }
        });
        return await this.CustomerDashboardService.getStats(CustomerData.id);
    }
    async getRecentRequirements(UserId, startDate, endDate) {
        const CustomerData = await _customer.customer.findOne({
            where: {
                user_id: UserId
            }
        });
        return await this.CustomerDashboardService.getRecentOrders(CustomerData.id, startDate, endDate);
    }
    async getDeliveryTracking(UserId, startDate) {
        const CustomerData = await _customer.customer.findOne({
            where: {
                user_id: UserId
            }
        });
        return await this.CustomerDashboardService.getDeliveryTracking(CustomerData.id, startDate);
    }
    constructor(CustomerDashboardService){
        super(), this.CustomerDashboardService = CustomerDashboardService;
    }
};
_ts_decorate([
    (0, _common.Get)('stats'),
    _ts_param(0, (0, _Commonhelper.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CustomerDashboardController.prototype, "getCustomerDashboardStats", null);
_ts_decorate([
    (0, _common.Get)('recent-requirements'),
    _ts_param(0, (0, _Commonhelper.CurrentUser)()),
    _ts_param(1, (0, _common.Query)('startDate')),
    _ts_param(2, (0, _common.Query)('endDate')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CustomerDashboardController.prototype, "getRecentRequirements", null);
_ts_decorate([
    (0, _common.Get)('delivery-tracking'),
    _ts_param(0, (0, _Commonhelper.CurrentUser)()),
    _ts_param(1, (0, _common.Query)('startDate')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CustomerDashboardController.prototype, "getDeliveryTracking", null);
CustomerDashboardController = _ts_decorate([
    (0, _swagger.ApiTags)('Customer Dashboard'),
    (0, _common.Controller)({
        path: 'CustomerDashboard',
        version: '1'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _CustomerDashboardservice.CustomerDashboardService === "undefined" ? Object : _CustomerDashboardservice.CustomerDashboardService
    ])
], CustomerDashboardController);

//# sourceMappingURL=CustomerDashboard.controller.js.map