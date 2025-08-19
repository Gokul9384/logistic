// src/Controller/CodeMove/Requirement.controller.ts
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RequirementController", {
    enumerable: true,
    get: function() {
        return RequirementController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _JWTAuthcontroller = require("../JWTAuth.controller");
const _Requirementservice = require("../../Service/CodeMove/Requirement.service");
const _Requirementmodel = require("../../Model/CodeMove/Requirement.model");
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
let RequirementController = class RequirementController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const data = await this._RequirementService.GetAll();
        return this.SendResponseData(data);
    }
    async RequirementDetail() {
        const data = await this._RequirementService.RequirementDetail();
        return this.SendResponseData(data);
    }
    async ById(Id) {
        const data = await this._RequirementService.GetById(Id);
        return this.SendResponseData(data);
    }
    async Insert(RequirementData, UserId, UserIp) {
        await this._RequirementService.Insert(RequirementData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, RequirementData, UserId, UserIp) {
        await this._RequirementService.Update(Id, RequirementData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._RequirementService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_RequirementService){
        super(), this._RequirementService = _RequirementService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], RequirementController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('RequirementDetail'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], RequirementController.prototype, "RequirementDetail", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], RequirementController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Requirementmodel.RequirementModel === "undefined" ? Object : _Requirementmodel.RequirementModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], RequirementController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _Requirementmodel.RequirementModel === "undefined" ? Object : _Requirementmodel.RequirementModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], RequirementController.prototype, "Update", null);
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
], RequirementController.prototype, "Delete", null);
RequirementController = _ts_decorate([
    (0, _common.Controller)({
        path: "Requirement",
        version: '1'
    }),
    (0, _swagger.ApiTags)("Requirement"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Requirementservice.RequirementService === "undefined" ? Object : _Requirementservice.RequirementService
    ])
], RequirementController);

//# sourceMappingURL=Requirement.controller.js.map