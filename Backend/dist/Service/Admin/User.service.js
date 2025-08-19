"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserService", {
    enumerable: true,
    get: function() {
        return UserService;
    }
});
const _common = require("@nestjs/common");
const _user = require("../../Database/Table/Admin/user");
const _Commonhelper = require("../../Helper/Common.helper");
const _typeorm = require("typeorm");
const _Emailservice = require("../Email.service");
const _Encryptionservice = require("../Encryption.service");
const _AuditLogservice = require("./AuditLog.service");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserService = class UserService {
    async GetAllExpectSuperAdmin() {
        const UserData = await _user.user.find({
            where: {
                created_by_id: (0, _typeorm.Not)('0'),
                status: true
            },
            relations: [
                'user_role'
            ]
        });
        return UserData;
    }
    async GetById(UserId) {
        return _user.user.findOne({
            where: {
                id: UserId
            }
        });
    }
    async Insert(UserData, UserId, UserIp) {
        const _UserData = new _user.user();
        _UserData.user_role_id = UserData.user_role_id;
        _UserData.first_name = UserData.first_name;
        _UserData.last_name = UserData.last_name;
        _UserData.email = UserData.email;
        _UserData.password = UserData.password;
        _UserData.mobile = UserData.mobile;
        _UserData.created_by_id = UserId;
        _UserData.created_on = new Date();
        _UserData.password = this._EncryptionService.Encrypt(UserData.password);
        await _user.user.insert(_UserData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _user.user.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _UserData.id
            ],
            UserIp: UserIp
        });
        return _UserData;
    }
    async Update(Id, UserData, UserId, UserIp) {
        const UserUpdateData = await _user.user.findOne({
            where: {
                id: Id
            }
        });
        if (!UserUpdateData) {
            throw new Error('Record not found');
        }
        UserUpdateData.user_role_id = UserData.user_role_id;
        UserUpdateData.first_name = UserData.first_name;
        UserUpdateData.last_name = UserData.last_name;
        UserUpdateData.email = UserData.email;
        UserUpdateData.password = UserData.password;
        UserUpdateData.mobile = UserData.mobile;
        UserUpdateData.updated_by_id = UserId;
        UserUpdateData.updated_on = new Date();
        delete UserUpdateData.password;
        delete UserUpdateData.email;
        await _user.user.update(Id, UserUpdateData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _user.user.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                UserUpdateData.id
            ],
            UserIp: UserIp
        });
        return UserUpdateData;
    }
    async SuspendOrActivate(Id, UserId, UserIp) {
        const UserData = await _user.user.findOne({
            where: {
                id: Id
            }
        });
        if (!UserData) {
            throw new Error('User not found');
        }
        UserData.updated_by_id = UserId;
        UserData.updated_on = new Date();
        UserData.status = !UserData.status;
        await UserData.save();
        if (UserData.status == true) {
            this._AuditLogService.AuditEmitEvent({
                PerformedType: _user.user.name,
                ActionType: _AuditLogEnum.LogActionEnum.Active,
                PrimaryId: [
                    UserData.id
                ],
                UserIp: UserIp
            });
        } else {
            this._AuditLogService.AuditEmitEvent({
                PerformedType: _user.user.name,
                ActionType: _AuditLogEnum.LogActionEnum.Suspend,
                PrimaryId: [
                    UserData.id
                ],
                UserIp: UserIp
            });
        }
        return UserData;
    }
    async ForgotPassword(EmailId) {
        const UserData = await _user.user.findOne({
            where: {
                email: EmailId
            }
        });
        if (!UserData) {
            throw new Error("User not found");
        }
        UserData.reset_otp = (0, _Commonhelper.RandomValue)(100000, 999999);
        await UserData.save();
        let EncryptedUserId = UserData.id;
        return await this._EmailService.ForgotPassword(EmailId, UserData.reset_otp, EncryptedUserId);
    }
    async ResetPassword(ResetPasswordData) {
        const UserData = await _user.user.findOne({
            where: {
                id: ResetPasswordData.user_id
            }
        });
        if (!UserData) {
            throw new Error("User not found");
        }
        if (UserData.reset_otp != ResetPasswordData.reset_otp) {
            throw new Error("Invalid Reset OTP");
        }
        UserData.password = this._EncryptionService.Encrypt(ResetPasswordData.password);
        UserData.reset_otp = null;
        UserData.updated_by_id = UserData.id;
        UserData.updated_on = new Date();
        await UserData.save();
        return true;
    }
    async ChangePassword(UserId, ChangePasswordData) {
        const UserData = await _user.user.findOne({
            where: {
                id: UserId
            }
        });
        if (!UserData) {
            throw new Error("User not found");
        }
        if (this._EncryptionService.Decrypt(UserData.password) != ChangePasswordData.old_password) {
            throw new Error("Old password not matched");
        }
        UserData.password = this._EncryptionService.Encrypt(ChangePasswordData.password);
        UserData.updated_by_id = UserId;
        UserData.updated_on = new Date();
        await UserData.save();
        return true;
    }
    async UserResetPassword(Id, UserData, UserId, UserIp) {
        UserData.updated_by_id = UserId;
        UserData.updated_on = new Date();
        UserData.password = this._EncryptionService.Encrypt(UserData.password);
        await _user.user.update(Id, UserData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _user.user.name,
            ActionType: _AuditLogEnum.LogActionEnum.ResetPassword,
            PrimaryId: [
                UserData.id
            ],
            UserIp: UserIp
        });
        return UserData;
    }
    async UserUnLock(UserId, UserData) {
        const _UserData = await _user.user.findOne({
            where: {
                id: UserId
            }
        });
        if (!_UserData) {
            throw new Error("User not found");
        }
        if (this._EncryptionService.Decrypt(_UserData.password) != UserData.password) {
            throw new Error("Password not matched");
        }
        return true;
    }
    constructor(_EmailService, _EncryptionService, _AuditLogService){
        this._EmailService = _EmailService;
        this._EncryptionService = _EncryptionService;
        this._AuditLogService = _AuditLogService;
    }
};
UserService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Emailservice.EmailService === "undefined" ? Object : _Emailservice.EmailService,
        typeof _Encryptionservice.EncryptionService === "undefined" ? Object : _Encryptionservice.EncryptionService,
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService
    ])
], UserService);

//# sourceMappingURL=User.service.js.map