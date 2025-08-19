"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CountryService", {
    enumerable: true,
    get: function() {
        return CountryService;
    }
});
const _common = require("@nestjs/common");
const _country = require("../../Database/Table/Admin/country");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
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
let CountryService = class CountryService {
    async GetAll() {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.Country}:*`);
        if (ResultData.length > 0) {
            return ResultData;
        } else {
            const CountryList = await _country.country.find({
                relations: [
                    "currency"
                ]
            });
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.Country}`, CountryList);
            return CountryList;
        }
    }
    async GetById(CountryId) {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.UserRole}:${CountryId}`);
        if (ResultData.length > 0) {
            return ResultData[0];
        } else {
            const CountryData = await _country.country.findOne({
                relations: [
                    "currency"
                ],
                where: {
                    id: CountryId
                }
            });
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.Country}:${CountryId}`, [
                CountryData
            ]);
            return CountryData;
        }
    }
    async Insert(CountryData, UserId, UserIp) {
        const _CountryData = new _country.country();
        _CountryData.name = CountryData.name;
        _CountryData.code = CountryData.code;
        _CountryData.currency_id = CountryData.currency_id;
        _CountryData.created_by_id = UserId;
        _CountryData.created_on = new Date();
        await _country.country.insert(_CountryData);
        this._AuditLogService.AuditEmitEvent({
            UserIp: UserIp,
            PerformedType: _country.country.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _CountryData.id
            ]
        });
        const CacheCountryData = await _country.country.find({
            relations: [
                "currency"
            ]
        });
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.Country}`, [
            CacheCountryData
        ]);
        return _CountryData;
    }
    async Update(Id, CountryData, UserId, UserIp) {
        const CompanyUpdateData = await _country.country.findOne({
            where: {
                id: Id
            }
        });
        if (!CompanyUpdateData) {
            throw new Error('Record not found');
        }
        CompanyUpdateData.name = CountryData.name;
        CompanyUpdateData.code = CountryData.code;
        CompanyUpdateData.currency_id = CountryData.currency_id;
        CompanyUpdateData.updated_by_id = UserId;
        CompanyUpdateData.updated_on = new Date();
        await _country.country.update(Id, CompanyUpdateData);
        this._AuditLogService.AuditEmitEvent({
            UserIp: UserIp,
            PerformedType: _country.country.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                CompanyUpdateData.id
            ]
        });
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.Country}`, [
            {
                ...CompanyUpdateData,
                id: Id
            }
        ]);
        return CompanyUpdateData;
    }
    async Delete(Id, UserIp) {
        const CountryData = await _country.country.findOne({
            where: {
                id: Id
            }
        });
        if (!CountryData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        await CountryData.remove();
        this._AuditLogService.AuditEmitEvent({
            UserIp: UserIp,
            PerformedType: _country.country.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                Id
            ]
        });
        await this._CacheService.Remove(`${_CacheEnum.CacheEnum.Country}:${Id}`, CountryData);
        return true;
    }
    constructor(_AuditLogService, _CacheService){
        this._AuditLogService = _AuditLogService;
        this._CacheService = _CacheService;
    }
};
CountryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Cacheservice.CacheService === "undefined" ? Object : _Cacheservice.CacheService
    ])
], CountryService);

//# sourceMappingURL=Country.service.js.map