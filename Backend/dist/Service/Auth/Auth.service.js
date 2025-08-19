"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _company = require("../../Database/Table/Admin/company");
const _user = require("../../Database/Table/Admin/user");
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
let AuthService = class AuthService {
    async ValidateUser(username, password) {
        const UserData = await _user.user.findOne({
            where: {
                email: username
            },
            relations: [
                'user_role'
            ]
        });
        const CompanyData = await _company.company.find({
            relations: [
                "currency"
            ]
        });
        if (!UserData) {
            throw new Error('Invalid email id');
        }
        if (UserData.status == false) {
            throw new Error('User suspended, contanct administration');
        }
        if (this._EncryptionService.Decrypt(UserData.password) != password) {
            throw new Error('Invalid password');
        }
        const payload = {
            email: UserData.email,
            user_id: UserData.id,
            user_role_id: UserData.user_role_id,
            user_role_name: UserData.user_role.name,
            user_role_code: UserData.user_role.code,
            user_role_landing_page: UserData.user_role.landing_page,
            user_role_permissions: UserData.user_role.permissions,
            is_profile_updated: UserData.is_profile_updated,
            company: CompanyData[0]
        };
        const api_token = this._JwtService.sign(payload);
        return {
            api_token
        };
    }
    constructor(_JwtService, _EncryptionService){
        this._JwtService = _JwtService;
        this._EncryptionService = _EncryptionService;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _Encryptionservice.EncryptionService === "undefined" ? Object : _Encryptionservice.EncryptionService
    ])
], AuthService);

//# sourceMappingURL=Auth.service.js.map