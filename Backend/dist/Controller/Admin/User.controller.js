"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserController", {
    enumerable: true,
    get: function() {
        return UserController;
    }
});
const _common = require("@nestjs/common");
const _Commonhelper = require("../../Helper/Common.helper");
const _swagger = require("@nestjs/swagger");
const _Userservice = require("../../Service/Admin/User.service");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _Usermodel = require("../../Model/Admin/User.model");
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
let UserController = class UserController extends _JWTAuthcontroller.JWTAuthController {
    async List() {
        const UserListData = await this._UserService.GetAllExpectSuperAdmin();
        return this.SendResponseData(UserListData);
    }
    async ById(Id) {
        const UserData = await this._UserService.GetById(Id);
        return this.SendResponseData(UserData);
    }
    async Insert(UserData, UserId, UserIp) {
        const ResultData = await this._UserService.Insert(UserData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Created, ResultData.id);
    }
    async Update(Id, UserData, UserId, UserIp) {
        await this._UserService.Update(Id, UserData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Updated);
    }
    async SuspendOrActivate(id, UserId, UserIp) {
        const UserData = await this._UserService.SuspendOrActivate(id, UserId, UserIp);
        if (UserData.status == true) {
            return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Activated);
        } else {
            return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Suspended);
        }
    }
    async ChangePassword(ChangePasswordData, UserId) {
        await this._UserService.ChangePassword(UserId, ChangePasswordData);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, "Password changed successfully");
    }
    async ResetPassword(Id, UserData, UserId, UserIp) {
        await this._UserService.UserResetPassword(Id, UserData, UserId, UserIp);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, _ResponseEnum.ResponseEnum.Reset);
    }
    async UnLockPassword(UserId, UserData) {
        await this._UserService.UserUnLock(UserId, UserData);
        return this.SendResponse(_ResponseEnum.ResponseEnum.Success, "UnLocked successfully");
    }
    constructor(_UserService){
        super(), this._UserService = _UserService;
    }
};
_ts_decorate([
    (0, _common.Get)('List'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "List", null);
_ts_decorate([
    (0, _common.Get)('ById/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "ById", null);
_ts_decorate([
    (0, _common.Post)('Insert'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Usermodel.UserModel === "undefined" ? Object : _Usermodel.UserModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "Insert", null);
_ts_decorate([
    (0, _common.Put)('Update/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _Usermodel.UserModel === "undefined" ? Object : _Usermodel.UserModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "Update", null);
_ts_decorate([
    (0, _common.Patch)('SuspendOrActivate/:Id'),
    _ts_param(0, (0, _common.Param)('Id')),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_param(2, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "SuspendOrActivate", null);
_ts_decorate([
    (0, _common.Post)('ChangePassword'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _Commonhelper.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Usermodel.ChangePasswordModel === "undefined" ? Object : _Usermodel.ChangePasswordModel,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "ChangePassword", null);
_ts_decorate([
    (0, _common.Put)('ResetPassword/:Id'),
    _ts_param(0, (0, _common.Param)('UserId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _Commonhelper.CurrentUser)()),
    _ts_param(3, (0, _Commonhelper.UserIp)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _Usermodel.UserModel === "undefined" ? Object : _Usermodel.UserModel,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "ResetPassword", null);
_ts_decorate([
    (0, _common.Post)('UnLockPassword'),
    _ts_param(0, (0, _Commonhelper.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "UnLockPassword", null);
UserController = _ts_decorate([
    (0, _common.Controller)({
        path: "User",
        version: '1'
    }),
    (0, _swagger.ApiTags)("User"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Userservice.UserService === "undefined" ? Object : _Userservice.UserService
    ])
], UserController);

//# sourceMappingURL=User.controller.js.map