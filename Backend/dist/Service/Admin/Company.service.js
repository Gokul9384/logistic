"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CompanyService", {
    enumerable: true,
    get: function() {
        return CompanyService;
    }
});
const _common = require("@nestjs/common");
const _company = require("../../Database/Table/Admin/company");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _typeorm = require("typeorm");
const _AuditLogservice = require("./AuditLog.service");
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
let CompanyService = class CompanyService {
    async Get() {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.Company}:*`);
        if (ResultData.length > 0) {
            return ResultData[0];
        } else {
            const CompanyData = await _company.company.find();
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.Company}`, CompanyData);
            return CompanyData[0];
        }
    }
    async Update(Id, CompanyData, UserId, UserIp) {
        const CompanyUpdateData = await _company.company.findOne({
            where: {
                id: Id
            }
        });
        if (!CompanyUpdateData) {
            throw new Error('Record not found');
        }
        CompanyUpdateData.name = CompanyData.name;
        CompanyUpdateData.address = CompanyData.address;
        CompanyUpdateData.country_id = CompanyData.country_id;
        CompanyUpdateData.currency_id = CompanyData.currency_id;
        CompanyUpdateData.postal_code = CompanyData.postal_code;
        CompanyUpdateData.email = CompanyData.email;
        CompanyUpdateData.website = CompanyData.website;
        CompanyUpdateData.uen_no = CompanyData.uen_no;
        CompanyUpdateData.bank_name = CompanyData.bank_name;
        CompanyUpdateData.bank_acct_no = CompanyData.bank_acct_no;
        CompanyUpdateData.telephone_no = CompanyData.telephone_no;
        CompanyUpdateData.fax_no = CompanyData.fax_no;
        CompanyUpdateData.invoice_footer = CompanyData.invoice_footer;
        CompanyUpdateData.updated_by_id = UserId;
        CompanyUpdateData.updated_on = new Date();
        await _company.company.update(Id, CompanyUpdateData);
        this._AuditLogService.AuditEmitEvent({
            UserIp: UserIp,
            PerformedType: _company.company.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                CompanyUpdateData.id
            ]
        });
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.Company}`, [
            {
                ...CompanyUpdateData,
                id: Id
            }
        ]);
        return CompanyUpdateData;
    }
    async Insert(CompanyData, UserId, UserIp) {
        const _CompanyData = new _company.company();
        _CompanyData.name = CompanyData.name;
        _CompanyData.address = CompanyData.address;
        _CompanyData.country_id = CompanyData.country_id;
        _CompanyData.currency_id = CompanyData.currency_id;
        _CompanyData.postal_code = CompanyData.postal_code;
        _CompanyData.email = CompanyData.email;
        _CompanyData.website = CompanyData.website;
        _CompanyData.uen_no = CompanyData.uen_no;
        _CompanyData.bank_name = CompanyData.bank_name;
        _CompanyData.bank_acct_no = CompanyData.bank_acct_no;
        _CompanyData.telephone_no = CompanyData.telephone_no;
        _CompanyData.fax_no = CompanyData.fax_no;
        _CompanyData.invoice_footer = CompanyData.invoice_footer;
        _CompanyData.created_by_id = UserId;
        _CompanyData.created_on = new Date();
        await _company.company.insert(_CompanyData);
        this._AuditLogService.AuditEmitEvent({
            UserIp: UserIp,
            PerformedType: _company.company.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _CompanyData.id
            ]
        });
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.Company}`, [
            _CompanyData
        ]);
        return _CompanyData;
    }
    constructor(_AuditLogService, _DataSource, _CacheService){
        this._AuditLogService = _AuditLogService;
        this._DataSource = _DataSource;
        this._CacheService = _CacheService;
    }
};
CompanyService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource,
        typeof _Cacheservice.CacheService === "undefined" ? Object : _Cacheservice.CacheService
    ])
], CompanyService);

//# sourceMappingURL=Company.service.js.map