"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DriverService", {
    enumerable: true,
    get: function() {
        return DriverService;
    }
});
const _common = require("@nestjs/common");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _driver = require("../../Database/Table/CodeMove/driver");
const _user = require("../../Database/Table/Admin/user");
const _user_role = require("../../Database/Table/Admin/user_role");
const _Encryptionservice = require("../Encryption.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DriverService = class DriverService {
    async GetAll() {
        return await _driver.driver.find({
            relations: [
                'vendor'
            ]
        });
    }
    async GetById(DriverId) {
        const DriverData = await _driver.driver.findOne({
            where: {
                id: DriverId
            }
        });
        if (!DriverData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        return DriverData;
    }
    // async Insert(DriverData: DriverModel, UserId: string, UserIp: string) {
    //     const UserRoleData = await user_role.findOne({ where: { name: "Driver" } });
    //     if (!UserRoleData) {
    //         throw new Error(ResponseEnum.NotFound);
    //     }
    //     const _userData = new user();
    //     _userData.user_role_id = UserRoleData.id;
    //     _userData.first_name = DriverData.name;
    //     _userData.email = DriverData.email;
    //     _userData.password = this._EncryptionService.Encrypt(DriverData.password);
    //     _userData.mobile = DriverData.mobile;
    //     _userData.created_by_id = UserId;
    //     _userData.created_on = new Date();
    //     await user.insert(_userData);
    //     const _DriverData = new driver();
    //     _DriverData.user_id = _userData.id;
    //     _DriverData.vendor_id = DriverData.vendor_id;
    //     _DriverData.email = DriverData.email;
    //     _DriverData.name = DriverData.name;
    //     _DriverData.mobile = DriverData.mobile;
    //     _DriverData.license_number = DriverData.license_number;
    //     _DriverData.vehicle_number = DriverData.vehicle_number;
    //     _DriverData.created_by_id = UserId;
    //     _DriverData.created_on = new Date();
    //     await driver.insert(_DriverData);
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: driver.name,
    //         ActionType: LogActionEnum.Insert,
    //         PrimaryId: [_DriverData.id],
    //         UserIp: UserIp
    //     });
    //     return _DriverData;
    // }
    // async Update(Id: string, DriverData: DriverModel, UserId: string, UserIp: string) {
    //     const DriverUpdateData = await driver.findOne({ where: { id: Id } });
    //     if (!DriverUpdateData) throw new Error(ResponseEnum.NotFound);
    //     DriverUpdateData.vendor_id = DriverData.vendor_id;
    //     DriverUpdateData.name = DriverData.name;
    //     DriverUpdateData.email = DriverData.email;
    //     DriverUpdateData.mobile = DriverData.mobile;
    //     DriverUpdateData.license_number = DriverData.license_number;
    //     DriverUpdateData.vehicle_number = DriverData.vehicle_number;
    //     DriverUpdateData.updated_by_id = UserId;
    //     DriverUpdateData.updated_on = new Date();
    //     await driver.update(Id, DriverUpdateData);
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: driver.name,
    //         ActionType: LogActionEnum.Update,
    //         PrimaryId: [DriverUpdateData.id],
    //         UserIp: UserIp
    //     });
    //     return DriverUpdateData;
    // }
    // Driver Service (no status changes needed)
    async Insert(DriverData, UserId, UserIp) {
        const UserRoleData = await _user_role.user_role.findOne({
            where: {
                name: "Driver"
            }
        });
        if (!UserRoleData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        const _userData = new _user.user();
        _userData.user_role_id = UserRoleData.id;
        _userData.first_name = DriverData.name;
        _userData.email = DriverData.email;
        _userData.password = this._EncryptionService.Encrypt(DriverData.password);
        _userData.mobile = DriverData.mobile;
        _userData.created_by_id = UserId;
        _userData.created_on = new Date();
        await _user.user.insert(_userData);
        const _DriverData = new _driver.driver();
        _DriverData.user_id = _userData.id;
        _DriverData.vendor_id = DriverData.vendor_id;
        _DriverData.email = DriverData.email;
        _DriverData.name = DriverData.name;
        _DriverData.mobile = DriverData.mobile;
        _DriverData.license_number = DriverData.license_number;
        _DriverData.vehicle_number = DriverData.vehicle_number;
        _DriverData.created_by_id = UserId;
        _DriverData.created_on = new Date();
        await _driver.driver.insert(_DriverData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _driver.driver.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _DriverData.id
            ],
            UserIp: UserIp
        });
        return _DriverData;
    }
    async Update(Id, DriverData, UserId, UserIp) {
        const DriverUpdateData = await _driver.driver.findOne({
            where: {
                id: Id
            }
        });
        if (!DriverUpdateData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        DriverUpdateData.vendor_id = DriverData.vendor_id;
        DriverUpdateData.name = DriverData.name;
        DriverUpdateData.email = DriverData.email;
        DriverUpdateData.mobile = DriverData.mobile;
        DriverUpdateData.license_number = DriverData.license_number;
        DriverUpdateData.vehicle_number = DriverData.vehicle_number;
        DriverUpdateData.updated_by_id = UserId;
        DriverUpdateData.updated_on = new Date();
        await _driver.driver.update(Id, DriverUpdateData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _driver.driver.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                DriverUpdateData.id
            ],
            UserIp: UserIp
        });
        return DriverUpdateData;
    }
    async Delete(Id, UserIp) {
        const DriverData = await _driver.driver.findOne({
            where: {
                id: Id
            }
        });
        if (!DriverData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        await DriverData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _driver.driver.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                DriverData.id
            ],
            UserIp: UserIp
        });
        return true;
    }
    constructor(_AuditLogService, _EncryptionService){
        this._AuditLogService = _AuditLogService;
        this._EncryptionService = _EncryptionService;
    }
};
DriverService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Encryptionservice.EncryptionService === "undefined" ? Object : _Encryptionservice.EncryptionService
    ])
], DriverService);

//# sourceMappingURL=Driver.service.js.map