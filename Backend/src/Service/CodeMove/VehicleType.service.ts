import { Injectable } from "@nestjs/common";
import { AuditLogService } from "../Admin/AuditLog.service";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { vehicle_type } from "@Root/Database/Table/CodeMove/vehicle_type";
import { VehicleTypeModel } from "@Model/CodeMove/VehicleType.model";

@Injectable()
export class VehicleTypeService {
    constructor(private _AuditLogService: AuditLogService) { }

    // Get all vehicle types
    async GetAll() {
        return await vehicle_type.find();
    }

    // Get vehicle type by ID
    async GetById(Id: string) {
        const data = await vehicle_type.findOne({ where: { id: Id } });
        if (!data) {
            throw new Error(ResponseEnum.NotFound);
        }
        return data;
    }

    // Insert a new vehicle type
    async Insert(data: VehicleTypeModel, UserId: string, UserIp: string) {
        const _vehicleType = new vehicle_type();
        _vehicleType.name = data.name;
        _vehicleType.description = data.description;
        _vehicleType.created_by_id = UserId;
        _vehicleType.created_on = new Date();

        await vehicle_type.insert(_vehicleType);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: vehicle_type.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_vehicleType.id],
            UserIp: UserIp
        });

        return _vehicleType;
    }

    // Update existing vehicle type
    async Update(Id: string, data: VehicleTypeModel, UserId: string, UserIp: string) {
        const existing = await vehicle_type.findOne({ where: { id: Id } });
        if (!existing) {
            throw new Error(ResponseEnum.NotFound);
        }

        existing.name = data.name;
        existing.description = data.description;
        existing.updated_by_id = UserId;
        existing.updated_on = new Date();

        await vehicle_type.update(Id, existing);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: vehicle_type.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [existing.id],
            UserIp: UserIp
        });

        return existing;
    }

    // Delete vehicle type
    async Delete(Id: string, UserIp: string) {
        const existing = await vehicle_type.findOne({ where: { id: Id } });
        if (!existing) {
            throw new Error(ResponseEnum.NotFound);
        }

        await existing.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: vehicle_type.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [existing.id],
            UserIp: UserIp
        });

        return true;
    }
}
