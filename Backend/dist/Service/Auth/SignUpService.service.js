"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SignUpService", {
    enumerable: true,
    get: function() {
        return SignUpService;
    }
});
const _common = require("@nestjs/common");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _customer = require("../../Database/Table/CodeMove/customer");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _user = require("../../Database/Table/Admin/user");
const _user_role = require("../../Database/Table/Admin/user_role");
const _vendor = require("../../Database/Table/CodeMove/vendor");
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
let SignUpService = class SignUpService {
    async CustomerSignUp(CustomerData, UserIp) {
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
        _userData.created_by_id = "1";
        _userData.created_on = new Date();
        await _user.user.insert(_userData);
        const _CustomerData = new _customer.customer();
        _CustomerData.user_id = _userData.id;
        _CustomerData.name = CustomerData.name;
        _CustomerData.email = CustomerData.email;
        _CustomerData.mobile = CustomerData.mobile;
        _CustomerData.gst_number = CustomerData.gst_number;
        _CustomerData.created_by_id = _userData.id;
        _CustomerData.created_on = new Date();
        await _customer.customer.insert(_CustomerData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _customer.customer.name,
            ActionType: _AuditLogEnum.LogActionEnum.SignUp,
            PrimaryId: [
                _CustomerData.id
            ],
            UserIp: UserIp
        });
        return _CustomerData;
    }
    async VendorSignUp(VendorData, UserIp) {
        const UserRoleData = await _user_role.user_role.findOne({
            where: {
                name: "Vendor"
            }
        });
        if (!UserRoleData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        const _userData = new _user.user();
        _userData.first_name = VendorData.company_name;
        _userData.user_role_id = UserRoleData.id;
        _userData.email = VendorData.email;
        _userData.password = this._EncryptionService.Encrypt(VendorData.password);
        _userData.mobile = VendorData.mobile;
        _userData.created_by_id = '1';
        _userData.created_on = new Date();
        await _user.user.insert(_userData);
        const _VendorData = new _vendor.vendor();
        _VendorData.user_id = _userData.id;
        _VendorData.company_name = VendorData.company_name;
        _VendorData.address = VendorData.address;
        _VendorData.email = VendorData.email;
        _VendorData.mobile = VendorData.mobile;
        _VendorData.created_by_id = _userData.id;
        _VendorData.created_on = new Date();
        await _vendor.vendor.insert(_VendorData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _vendor.vendor.name,
            ActionType: _AuditLogEnum.LogActionEnum.SignUp,
            PrimaryId: [
                _VendorData.id
            ],
            UserIp: UserIp
        });
        return _VendorData;
    }
    constructor(_AuditLogService, _EncryptionService){
        this._AuditLogService = _AuditLogService;
        this._EncryptionService = _EncryptionService;
    }
};
SignUpService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Encryptionservice.EncryptionService === "undefined" ? Object : _Encryptionservice.EncryptionService
    ])
], SignUpService);

//# sourceMappingURL=SignUpService.service.js.map