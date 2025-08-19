"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomerService", {
    enumerable: true,
    get: function() {
        return CustomerService;
    }
});
const _common = require("@nestjs/common");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _customer = require("../../Database/Table/CodeMove/customer");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
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
let CustomerService = class CustomerService {
    async GetAll() {
        return await _customer.customer.find();
    }
    async GetById(CustomerId) {
        const CustomerData = await _customer.customer.findOne({
            where: {
                id: CustomerId
            }
        });
        if (!CustomerData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        return CustomerData;
    }
    async Insert(CustomerData, UserId, UserIp) {
        const UserRoleData = await _user_role.user_role.findOne({
            where: {
                name: "Customer"
            }
        });
        if (!UserRoleData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        const _userData = new _user.user();
        _userData.first_name = CustomerData.name;
        _userData.user_role_id = UserRoleData.id;
        _userData.email = CustomerData.email;
        _userData.password = this._EncryptionService.Encrypt(CustomerData.password);
        _userData.mobile = CustomerData.mobile;
        _userData.created_by_id = UserId;
        _userData.created_on = new Date();
        await _user.user.insert(_userData);
        const _CustomerData = new _customer.customer();
        _CustomerData.user_id = _userData.id;
        _CustomerData.name = CustomerData.name;
        _CustomerData.email = CustomerData.email;
        _CustomerData.mobile = CustomerData.mobile;
        _CustomerData.gst_number = CustomerData.gst_number;
        _CustomerData.latitude = CustomerData.latitude;
        _CustomerData.longitude = CustomerData.longitude;
        _CustomerData.formatted_address = CustomerData.formatted_address;
        _CustomerData.created_by_id = UserId;
        _CustomerData.created_on = new Date();
        await _customer.customer.insert(_CustomerData);
        await _user.user.update({
            id: _CustomerData.user_id
        }, {
            is_profile_updated: true
        });
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _customer.customer.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _CustomerData.id
            ],
            UserIp: UserIp
        });
        return _CustomerData;
    }
    async Update(Id, CustomerData, UserId, UserIp) {
        const CustomerUpdateData = await _customer.customer.findOne({
            where: {
                id: Id
            }
        });
        if (!CustomerUpdateData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        CustomerUpdateData.name = CustomerData.name;
        CustomerUpdateData.email = CustomerData.email;
        CustomerUpdateData.mobile = CustomerData.mobile;
        CustomerUpdateData.gst_number = CustomerData.gst_number;
        CustomerUpdateData.latitude = CustomerData.latitude;
        CustomerUpdateData.longitude = CustomerData.longitude;
        CustomerUpdateData.formatted_address = CustomerData.formatted_address;
        CustomerUpdateData.updated_by_id = UserId;
        CustomerUpdateData.updated_on = new Date();
        await _customer.customer.update(Id, CustomerUpdateData);
        await _user.user.update({
            id: CustomerUpdateData.user_id
        }, {
            is_profile_updated: true
        });
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _customer.customer.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                CustomerUpdateData.id
            ],
            UserIp: UserIp
        });
        return CustomerUpdateData;
    }
    async Delete(Id, UserIp) {
        const CustomerData = await _customer.customer.findOne({
            where: {
                id: Id
            }
        });
        if (!CustomerData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        await CustomerData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _customer.customer.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                CustomerData.id
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
CustomerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Encryptionservice.EncryptionService === "undefined" ? Object : _Encryptionservice.EncryptionService
    ])
], CustomerService);

//# sourceMappingURL=Customer.service.js.map