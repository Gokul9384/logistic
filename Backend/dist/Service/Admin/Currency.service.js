"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CurrencyService", {
    enumerable: true,
    get: function() {
        return CurrencyService;
    }
});
const _common = require("@nestjs/common");
const _currency = require("../../Database/Table/Admin/currency");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
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
let CurrencyService = class CurrencyService {
    async GetAll() {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.Currency}:*`);
        if (ResultData.length > 0) {
            return ResultData;
        } else {
            const CurrencyList = await _currency.currency.find();
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.Currency}`, CurrencyList);
            return CurrencyList;
        }
    }
    async GetById(CurrencyId) {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.Currency}:${CurrencyId}`);
        if (ResultData.length > 0) {
            return ResultData[0];
        } else {
            const CurrencyData = await _currency.currency.findOne({
                where: {
                    id: CurrencyId
                }
            });
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.Currency}:${CurrencyId}`, [
                CurrencyData
            ]);
            return CurrencyData;
        }
    }
    async Insert(CurrencyData, UserId, UserIp) {
        const _CurrencyData = new _currency.currency();
        _CurrencyData.name = CurrencyData.name;
        _CurrencyData.code = CurrencyData.code;
        _CurrencyData.symbol = CurrencyData.symbol;
        _CurrencyData.created_by_id = UserId;
        _CurrencyData.created_on = new Date();
        await _currency.currency.insert(_CurrencyData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _currency.currency.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _CurrencyData.id
            ],
            UserIp: UserIp
        });
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.Currency}`, [
            _CurrencyData
        ]);
        return _CurrencyData;
    }
    async Update(Id, CurrencyData, UserId, UserIp) {
        const CurrencyUpdateData = await _currency.currency.findOne({
            where: {
                id: Id
            }
        });
        if (!CurrencyUpdateData) {
            throw new Error('Record not found');
        }
        CurrencyUpdateData.name = CurrencyData.name;
        CurrencyUpdateData.code = CurrencyData.code;
        CurrencyUpdateData.symbol = CurrencyData.symbol;
        CurrencyUpdateData.updated_by_id = UserId;
        CurrencyUpdateData.updated_on = new Date();
        await _currency.currency.update(Id, CurrencyUpdateData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _currency.currency.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                CurrencyUpdateData.id
            ],
            UserIp: UserIp
        });
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.Currency}`, [
            {
                ...CurrencyUpdateData,
                id: Id
            }
        ]);
        return CurrencyUpdateData;
    }
    async Delete(Id, UserIp) {
        const CurrencyData = await _currency.currency.findOne({
            where: {
                id: Id
            }
        });
        if (!CurrencyData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        await CurrencyData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _currency.currency.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                CurrencyData.id
            ],
            UserIp: UserIp
        });
        await this._CacheService.Remove(`${_CacheEnum.CacheEnum.Currency}:${Id}`, CurrencyData);
        return true;
    }
    constructor(_AuditLogService, _CacheService){
        this._AuditLogService = _AuditLogService;
        this._CacheService = _CacheService;
    }
};
CurrencyService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Cacheservice.CacheService === "undefined" ? Object : _Cacheservice.CacheService
    ])
], CurrencyService);

//# sourceMappingURL=Currency.service.js.map