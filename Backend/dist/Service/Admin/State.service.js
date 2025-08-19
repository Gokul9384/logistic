"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StateService", {
    enumerable: true,
    get: function() {
        return StateService;
    }
});
const _common = require("@nestjs/common");
const _AuditLogservice = require("./AuditLog.service");
const _Cacheservice = require("../Cache.service");
const _CacheEnum = require("../../Helper/Enum/CacheEnum");
const _state = require("../../Database/Table/Admin/state");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let StateService = class StateService {
    async GetAll() {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.State}:*`);
        if (ResultData.length > 0) {
            return ResultData;
        } else {
            const StateList = await _state.state.find({
                relations: [
                    "country"
                ]
            });
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.Currency}`, StateList);
            return StateList;
        }
    }
    async GetById(StateId) {
        const ResultData = await this._CacheService.Get(`${_CacheEnum.CacheEnum.State}:${StateId}`);
        if (ResultData.length > 0) {
            return ResultData[0];
        } else {
            const StateData = await _state.state.findOne({
                relations: [
                    "country"
                ],
                where: {
                    id: StateId
                }
            });
            await this._CacheService.Store(`${_CacheEnum.CacheEnum.Currency}:${StateId}`, [
                StateData
            ]);
            return StateData;
        }
    }
    async Insert(StateData, UserId, UserIp) {
        const _StateData = new _state.state();
        _StateData.name = StateData.name;
        _StateData.code = StateData.code;
        _StateData.country_id = StateData.country_id;
        _StateData.created_by_id = UserId;
        _StateData.created_on = new Date();
        await _state.state.insert(_StateData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _state.state.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _StateData.id
            ],
            UserIp: UserIp
        });
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.Currency}`, [
            _StateData
        ]);
        return _StateData;
    }
    async Update(Id, StateData, UserId, UserIp) {
        const StateUpdateData = await _state.state.findOne({
            where: {
                id: Id
            }
        });
        if (!StateUpdateData) {
            throw new Error('Record not found');
        }
        StateUpdateData.name = StateData.name;
        StateUpdateData.code = StateData.code;
        StateUpdateData.country_id = StateData.country_id;
        StateUpdateData.updated_by_id = UserId;
        StateUpdateData.updated_on = new Date();
        await _state.state.update(Id, StateUpdateData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _state.state.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                StateUpdateData.id
            ],
            UserIp: UserIp
        });
        await this._CacheService.Store(`${_CacheEnum.CacheEnum.State}`, [
            {
                ...StateUpdateData,
                id: Id
            }
        ]);
        return StateUpdateData;
    }
    async Delete(Id, UserIp) {
        const StateData = await _state.state.findOne({
            where: {
                id: Id
            }
        });
        if (!StateData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        await StateData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _state.state.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                StateData.id
            ],
            UserIp: UserIp
        });
        await this._CacheService.Remove(`${_CacheEnum.CacheEnum.State}:${Id}`, StateData);
        return true;
    }
    constructor(_AuditLogService, _CacheService){
        this._AuditLogService = _AuditLogService;
        this._CacheService = _CacheService;
    }
};
StateService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _Cacheservice.CacheService === "undefined" ? Object : _Cacheservice.CacheService
    ])
], StateService);

//# sourceMappingURL=State.service.js.map