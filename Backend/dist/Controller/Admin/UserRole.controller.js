"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserRoleController", {
    enumerable: true,
    get: function() {
        return UserRoleController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _UserRoleservice = require("../../Service/Admin/UserRole.service");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _UserRolemodel = require("../../Model/Admin/UserRole.model");
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
let UserRoleController = class UserRoleController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const UserRoleListData = await this._UserRoleService.GetAllExpectSuperAdmin();
        return this.SendResponseData(UserRoleListData);
    }
    async ById(Id) {
        const UserRoleData = await this._UserRoleService.GetById(Id);
        return this.SendResponseData(UserRoleData);
    }
    async Insert(UserRoleData, UserId, UserIp) {
        await this._UserRoleService.Insert(UserRoleData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created);
    }
    async Update(Id, UserRoleData, UserId, UserIp) {
        await this._UserRoleService.Update(Id, UserRoleData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async Delete(Id, UserIp) {
        await this._UserRoleService.Delete(Id, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Deleted);
    }
    constructor(_UserRoleService){
        super(), this._UserRoleService = _UserRoleService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], UserRoleController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserRoleController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _UserRolemodel.UserRoleModel === "undefined" ? Object : _UserRolemodel.UserRoleModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserRoleController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _UserRolemodel.UserRoleModel === "undefined" ? Object : _UserRolemodel.UserRoleModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserRoleController.prototype, "Update", null);
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
], UserRoleController.prototype, "Delete", null);
UserRoleController = _ts_decorate([
    (0, _common.Controller)({
        path: "UserRole",
        version: '1'
    }),
    (0, _swagger.ApiTags)("User Role"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _UserRoleservice.UserRoleService === "undefined" ? Object : _UserRoleservice.UserRoleService
    ])
], UserRoleController);

//# sourceMappingURL=UserRole.controller.js.map