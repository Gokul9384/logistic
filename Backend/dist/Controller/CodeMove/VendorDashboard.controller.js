"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VendorDashboardController", {
    enumerable: true,
    get: function() {
        return VendorDashboardController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _vendor = require("../../Database/Table/CodeMove/vendor");
const _Commonhelper = require("../../Helper/Common.helper");
const _VendorDashboardservice = require("../../Service/CodeMove/VendorDashboard.service");
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
let VendorDashboardController = class VendorDashboardController extends _JWTAuthcontroller.JWTAuthController {
    async getVendorDashboardStats(UserId) {
        const VendorData = await _vendor.vendor.findOne({
            where: {
                user_id: UserId
            }
        });
        return await this.vendorDashboardService.getStats(VendorData.id);
    }
    async getRecentRequirements(UserId, startDate, endDate) {
        const VendorData = await _vendor.vendor.findOne({
            where: {
                user_id: UserId
            }
        });
        return await this.vendorDashboardService.getRecentRequirements(VendorData.id, startDate, endDate);
    }
    constructor(vendorDashboardService){
        super(), this.vendorDashboardService = vendorDashboardService;
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
], VendorDashboardController.prototype, "getVendorDashboardStats", null);
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
], VendorDashboardController.prototype, "getRecentRequirements", null);
VendorDashboardController = _ts_decorate([
    (0, _swagger.ApiTags)('Vendor Dashboard'),
    (0, _common.Controller)({
        path: 'VendorDashboard',
        version: '1'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _VendorDashboardservice.VendorDashboardService === "undefined" ? Object : _VendorDashboardservice.VendorDashboardService
    ])
], VendorDashboardController);

//# sourceMappingURL=VendorDashboard.controller.js.map