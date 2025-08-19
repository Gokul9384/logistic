"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CityService", {
    enumerable: true,
    get: function() {
        return CityService;
    }
});
const _common = require("@nestjs/common");
const _AuditLogservice = require("./AuditLog.service");
const _city = require("../../Database/Table/Admin/city");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CityService = class CityService {
    async GetAll() {
        return await _city.city.find({
            relations: [
                "state",
                "country"
            ]
        });
    }
    async GetById(CityId) {
        const CityData = await _city.city.findOne({
            relations: [
                "state"
            ],
            where: {
                id: CityId
            }
        });
        if (!CityData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        return CityData;
    }
    async Insert(CityData, UserId, UserIp) {
        const _CityData = new _city.city();
        _CityData.name = CityData.name;
        _CityData.code = CityData.code;
        _CityData.state_id = CityData.state_id;
        _CityData.country_id = CityData.country_id;
        _CityData.created_by_id = UserId;
        _CityData.created_on = new Date();
        await _city.city.insert(_CityData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _city.city.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _CityData.id
            ],
            UserIp: UserIp
        });
        return _CityData;
    }
    async Update(Id, CityData, UserId, UserIp) {
        const CityUpdateData = await _city.city.findOne({
            where: {
                id: Id
            }
        });
        if (!CityUpdateData) {
            throw new Error('Record not found');
        }
        CityUpdateData.name = CityData.name;
        CityUpdateData.code = CityData.code;
        CityUpdateData.state_id = CityData.state_id;
        CityUpdateData.country_id = CityData.country_id;
        CityUpdateData.updated_by_id = UserId;
        CityUpdateData.updated_on = new Date();
        await _city.city.update(Id, CityUpdateData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _city.city.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                CityUpdateData.id
            ],
            UserIp: UserIp
        });
        return CityUpdateData;
    }
    async Delete(Id, UserIp) {
        const CityData = await _city.city.findOne({
            where: {
                id: Id
            }
        });
        if (!CityData) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        await CityData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _city.city.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                CityData.id
            ],
            UserIp: UserIp
        });
        return true;
    }
    constructor(_AuditLogService){
        this._AuditLogService = _AuditLogService;
    }
};
CityService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService
    ])
], CityService);

//# sourceMappingURL=City.service.js.map