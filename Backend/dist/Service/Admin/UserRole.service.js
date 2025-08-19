"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserRoleService", {
    enumerable: true,
    get: function() {
        return UserRoleService;
    }
});
const _common = require("@nestjs/common");
const _user_role = require("../../Database/Table/Admin/user_role");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _typeorm = require("typeorm");
const _AuditLogservice = require("./AuditLog.service");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _Cacheservice = require("../Cache.service");
const _CacheEnum = require("../../Helper/Enum/CacheEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserRoleService = class UserRoleService {
    async GetAll() {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.UserRole}:*`);
        if (ResultData.length > 0) {
            return ResultData;
        } else {
            const UserRoleList = await _user_role.user_role.find({
                where: {
                    created_by_id: (0, _typeorm.Not)('0')
                }
            });
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.UserRole}`, UserRoleList);
            return UserRoleList;
        }
    }
    async GetAllExpectSuperAdmin() {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.UserRole}:*`);
        if (ResultData.length > 0) {
            return ResultData;
        } else {
            const UserRoleList = await _user_role.user_role.find({
                where: {
                    created_by_id: (0, _typeorm.Not)('0')
                }
            });
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.UserRole}`, UserRoleList);
            return UserRoleList;
        }
    }
    async GetById(UserRoleId) {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.UserRole}:${UserRoleId}`);
        if (ResultData.length > 0) {
            return ResultData[0];
        } else {
            const UserRoleData = await _user_role.user_role.findOne({
                where: {
                    id: UserRoleId
                }
            });
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.UserRole}:${UserRoleId}`, [
                UserRoleData
            ]);
            return UserRoleData;
        }
    }
    async Insert(UserRoleData, UserId, UserIp) {
        const _UserRoleData = new _user_role.user_role();
        _UserRoleData.name = UserRoleData.name;
        _UserRoleData.code = UserRoleData.code;
        _UserRoleData.landing_page = UserRoleData.landing_page;
        _UserRoleData.permissions = UserRoleData.permissions;
        _UserRoleData.created_by_id = UserId;
        _UserRoleData.created_on = new Date();
        await _user_role.user_role.insert(_UserRoleData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _user_role.user_role.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _UserRoleData.id
            ],
            UserIp: UserIp
        });
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.UserRole}`, [
            _UserRoleData
        ]);
        return _UserRoleData;
    }
    async Update(Id, UserRoleData, UserId, UserIp) {
        const UserRoleUpdateData = await _user_role.user_role.findOne({
            where: {
                id: Id
            }
        });
        if (!UserRoleUpdateData) {
            throw new Error('Record not found');
        }
        UserRoleUpdateData.name = UserRoleData.name;
        UserRoleUpdateData.code = UserRoleData.code;
        UserRoleUpdateData.landing_page = UserRoleData.landing_page;
        UserRoleUpdateData.permissions = UserRoleData.permissions;
        UserRoleUpdateData.updated_by_id = UserId;
        UserRoleUpdateData.updated_on = new Date();
        await _user_role.user_role.update(Id, UserRoleUpdateData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _user_role.user_role.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                UserRoleUpdateData.id
            ],
            UserIp: UserIp
        });
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.UserRole}`, [
            {
                ...UserRoleUpdateData,
                id: Id
            }
        ]);
        return UserRoleUpdateData;
    }
    async Delete(Id, UserIp) {
        const UserRoleData = await _user_role.user_role.findOne({
            where: {
                id: Id
            }
        });
        if (!UserRoleData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _user_role.user_role.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                UserRoleData.id
            ],
            UserIp: UserIp
        });
        await UserRoleData.remove();
        await this._CacheService.Remove(`${_CacheEnum.CacheEnum.UserRole}:${Id}`, UserRoleData);
        return true;
    }
    constructor(_AuditLogService, _CacheService){
        this._AuditLogService = _AuditLogService;
        this._CacheService = _CacheService;
    }
};
UserRoleService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Cacheservice.CacheService === "undefined" ? Object : _Cacheservice.CacheService
    ])
], UserRoleService);

//# sourceMappingURL=UserRole.service.js.map