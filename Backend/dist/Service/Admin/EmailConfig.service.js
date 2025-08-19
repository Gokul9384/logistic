"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailConfigService", {
    enumerable: true,
    get: function() {
        return EmailConfigService;
    }
});
const _common = require("@nestjs/common");
const _email_config = require("../../Database/Table/Admin/email_config");
const _Encryptionservice = require("../Encryption.service");
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
let EmailConfigService = class EmailConfigService {
    // #region GetWithoutPasswordById
    async GetWithoutPasswordById() {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.EmailConfig}:*`);
        if (ResultData.length > 0) {
            return ResultData[0];
        } else {
            const EmailConfigData = await _email_config.email_config.find();
            if (EmailConfigData.length == 1) {
                delete EmailConfigData[0].password;
            }
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.EmailConfig}`, EmailConfigData);
            return EmailConfigData[0];
        }
    }
    async Update(Id, EmailConfigData, UserId) {
        const EmailConfigUpdateData = await _email_config.email_config.findOne({
            where: {
                id: Id
            }
        });
        if (!EmailConfigUpdateData) {
            throw new Error('Record not found');
        }
        EmailConfigUpdateData.email_id = EmailConfigData.email_id;
        EmailConfigUpdateData.password = EmailConfigData.password;
        EmailConfigUpdateData.mailer_name = EmailConfigData.mailer_name;
        EmailConfigUpdateData.host = EmailConfigData.host;
        EmailConfigUpdateData.password = this._EncryptionService.Encrypt(EmailConfigData.password);
        EmailConfigUpdateData.updated_by_id = UserId;
        EmailConfigUpdateData.updated_on = new Date();
        await _email_config.email_config.update(Id, EmailConfigUpdateData);
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.EmailConfig}`, [
            {
                ...EmailConfigUpdateData,
                id: Id
            }
        ]);
        return EmailConfigUpdateData;
    }
    async Insert(EmailConfigData, UserId) {
        const _EmailConfigData = new _email_config.email_config();
        _EmailConfigData.email_id = EmailConfigData.email_id;
        _EmailConfigData.password = EmailConfigData.password;
        _EmailConfigData.mailer_name = EmailConfigData.mailer_name;
        _EmailConfigData.host = EmailConfigData.host;
        _EmailConfigData.password = this._EncryptionService.Encrypt(EmailConfigData.password);
        _EmailConfigData.created_by_id = UserId;
        _EmailConfigData.created_on = new Date();
        await _email_config.email_config.insert(_EmailConfigData);
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.EmailConfig}`, [
            _EmailConfigData
        ]);
        return _EmailConfigData;
    }
    constructor(_EncryptionService, _CacheService){
        this._EncryptionService = _EncryptionService;
        this._CacheService = _CacheService;
    }
};
EmailConfigService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Encryptionservice.EncryptionService === "undefined" ? Object : _Encryptionservice.EncryptionService,
        typeof _Cacheservice.CacheService === "undefined" ? Object : _Cacheservice.CacheService
    ])
], EmailConfigService);

//# sourceMappingURL=EmailConfig.service.js.map