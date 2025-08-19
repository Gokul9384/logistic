"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "QuoteController", {
    enumerable: true,
    get: function() {
        return QuoteController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _Quoteservice = require("../../Service/CodeMove/Quote.service");
const _Quotemodel = require("../../Model/CodeMove/Quote.model");
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
let QuoteController = class QuoteController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const data = await this._QuoteService.GetAll();
        return this.SendResponseData(data);
    }
    async QuoteDetail() {
        const data = await this._QuoteService.QuoteDetail();
        return this.SendResponseData(data);
    }
    async ById(Id) {
        const data = await this._QuoteService.GetById(Id);
        return this.SendResponseData(data);
    }
    async Insert(QuoteData, UserId, UserIp) {
        await this._QuoteService.Insert(QuoteData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, QuoteData, UserId, UserIp) {
        await this._QuoteService.Update(Id, QuoteData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._QuoteService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_QuoteService){
        super(), this._QuoteService = _QuoteService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], QuoteController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('QuoteDetail'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], QuoteController.prototype, "QuoteDetail", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], QuoteController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Quotemodel.QuoteModel === "undefined" ? Object : _Quotemodel.QuoteModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], QuoteController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _Quotemodel.QuoteModel === "undefined" ? Object : _Quotemodel.QuoteModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], QuoteController.prototype, "Update", null);
_ts_decorate([
    (0, _common.Delete)('Delete/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], QuoteController.prototype, "Delete", null);
QuoteController = _ts_decorate([
    (0, _common.Controller)({
        path: "Quote",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Quote"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Quoteservice.QuoteService === "undefined" ? Object : _Quoteservice.QuoteService
    ])
], QuoteController);

//# sourceMappingURL=Quote.controller.js.map