"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServiceAreaService", {
    enumerable: true,
    get: function() {
        return ServiceAreaService;
    }
});
const _common = require("@nestjs/common");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _service_area = require("../../Database/Table/CodeMove/service_area");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ServiceAreaService = class ServiceAreaService {
    // Get all vehicle types
    async GetAll() {
        return await _service_area.service_area.find();
    }
    // Get vehicle type by ID
    async GetById(Id) {
        const data = await _service_area.service_area.findOne({
            where: {
                id: Id
            }
        });
        if (!data) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        return data;
    }
    // Insert a new vehicle type
    async Insert(data, UserId, UserIp) {
        const _ServiceArea = new _service_area.service_area();
        _ServiceArea.name = data.name;
        _ServiceArea.description = data.description;
        _ServiceArea.created_by_id = UserId;
        _ServiceArea.created_on = new Date();
        await _service_area.service_area.insert(_ServiceArea);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _service_area.service_area.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _ServiceArea.id
            ],
            UserIp: UserIp
        });
        return _ServiceArea;
    }
    // Update existing vehicle type
    async Update(Id, data, UserId, UserIp) {
        const existing = await _service_area.service_area.findOne({
            where: {
                id: Id
            }
        });
        if (!existing) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        existing.name = data.name;
        existing.description = data.description;
        existing.updated_by_id = UserId;
        existing.updated_on = new Date();
        await _service_area.service_area.update(Id, existing);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _service_area.service_area.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                existing.id
            ],
            UserIp: UserIp
        });
        return existing;
    }
    // Delete vehicle type
    async Delete(Id, UserIp) {
        const existing = await _service_area.service_area.findOne({
            where: {
                id: Id
            }
        });
        if (!existing) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        await existing.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _service_area.service_area.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                existing.id
            ],
            UserIp: UserIp
        });
        return true;
    }
    constructor(_AuditLogService){
        this._AuditLogService = _AuditLogService;
    }
};
ServiceAreaService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService
    ])
], ServiceAreaService);

//# sourceMappingURL=ServiceArea.service.js.map