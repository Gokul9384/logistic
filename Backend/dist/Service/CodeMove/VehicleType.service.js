"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VehicleTypeService", {
    enumerable: true,
    get: function() {
        return VehicleTypeService;
    }
});
const _common = require("@nestjs/common");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _vehicle_type = require("../../Database/Table/CodeMove/vehicle_type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let VehicleTypeService = class VehicleTypeService {
    // Get all vehicle types
    async GetAll() {
        return await _vehicle_type.vehicle_type.find();
    }
    // Get vehicle type by ID
    async GetById(Id) {
        const data = await _vehicle_type.vehicle_type.findOne({
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
        const _vehicleType = new _vehicle_type.vehicle_type();
        _vehicleType.name = data.name;
        _vehicleType.description = data.description;
        _vehicleType.created_by_id = UserId;
        _vehicleType.created_on = new Date();
        await _vehicle_type.vehicle_type.insert(_vehicleType);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _vehicle_type.vehicle_type.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _vehicleType.id
            ],
            UserIp: UserIp
        });
        return _vehicleType;
    }
    // Update existing vehicle type
    async Update(Id, data, UserId, UserIp) {
        const existing = await _vehicle_type.vehicle_type.findOne({
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
        await _vehicle_type.vehicle_type.update(Id, existing);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _vehicle_type.vehicle_type.name,
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
        const existing = await _vehicle_type.vehicle_type.findOne({
            where: {
                id: Id
            }
        });
        if (!existing) {
            throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        }
        await existing.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _vehicle_type.vehicle_type.name,
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
VehicleTypeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService
    ])
], VehicleTypeService);

//# sourceMappingURL=VehicleType.service.js.map