"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BookingController", {
    enumerable: true,
    get: function() {
        return BookingController;
    }
});
const _common = require("@nestjs/common");
const _Bookingservice = require("../../Service/CodeMove/Booking.service");
const _swagger = require("@nestjs/swagger");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _Bookingmodel = require("../../Model/CodeMove/Booking.model");
const _Commonhelper = require("../../Helper/Common.helper");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
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
let BookingController = class BookingController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const data = await this._BookingService.GetAll();
        return this.SendResponseData(data);
    }
    async ById(Id) {
        const data = await this._BookingService.GetById(Id);
        return this.SendResponseData(data);
    }
    async Insert(BookingData, UserId, UserIp) {
        await this._BookingService.Insert(BookingData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, BookingData, UserId, UserIp) {
        await this._BookingService.Update(Id, BookingData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._BookingService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_BookingService){
        super(), this._BookingService = _BookingService;
    }
};
_ts_decorate([
    (0, _common.Get)("List"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], BookingController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)("ById/:Id"),
    _ts_param(0, (0, _common.Param)("Id")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], BookingController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)("Insert"),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Bookingmodel.BookingModel === "undefined" ? Object : _Bookingmodel.BookingModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], BookingController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)("Update/:Id"),
    _ts_param(0, (0, _common.Param)("Id")),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _Bookingmodel.BookingModel === "undefined" ? Object : _Bookingmodel.BookingModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], BookingController.prototype, "Update", null);
_ts_decorate([
    (0, _common.Delete)("Delete/:Id"),
    _ts_param(0, (0, _common.Param)("Id")),
    _ts_param(1, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], BookingController.prototype, "Delete", null);
BookingController = _ts_decorate([
    (0, _swagger.ApiTags)("Booking"),
    (0, _common.Controller)({
        path: "Booking",
        version: "1"
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Bookingservice.BookingService === "undefined" ? Object : _Bookingservice.BookingService
    ])
], BookingController);

//# sourceMappingURL=Booking.controller.js.map