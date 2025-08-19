import { Injectable } from "@nestjs/common";
import { AuditLogService } from "../Admin/AuditLog.service";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { service_area } from "@Root/Database/Table/CodeMove/service_area";
import { ServiceAreaModel } from "@Model/CodeMove/ServiceArea.model";

@Injectable()
export class ServiceAreaService {
    constructor(private _AuditLogService: AuditLogService) { }

    // Get all vehicle types
    async GetAll() {
        return await service_area.find();
    }

    // Get vehicle type by ID
    async GetById(Id: string) {
        const data = await service_area.findOne({ where: { id: Id } });
        if (!data) {
            throw new Error(ResponseEnum.NotFound);
        }
        return data;
    }

    // Insert a new vehicle type
    async Insert(data: ServiceAreaModel, UserId: string, UserIp: string) {
        const _ServiceArea = new service_area();
        _ServiceArea.name = data.name;
        _ServiceArea.description = data.description;
        _ServiceArea.created_by_id = UserId;
        _ServiceArea.created_on = new Date();

        await service_area.insert(_ServiceArea);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: service_area.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_ServiceArea.id],
            UserIp: UserIp
        });

        return _ServiceArea;
    }

    // Update existing vehicle type
    async Update(Id: string, data: ServiceAreaModel, UserId: string, UserIp: string) {
        const existing = await service_area.findOne({ where: { id: Id } });
        if (!existing) {
            throw new Error(ResponseEnum.NotFound);
        }

        existing.name = data.name;
        existing.description = data.description;
        existing.updated_by_id = UserId;
        existing.updated_on = new Date();

        await service_area.update(Id, existing);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: service_area.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [existing.id],
            UserIp: UserIp
        });

        return existing;
    }

    // Delete vehicle type
    async Delete(Id: string, UserIp: string) {
        const existing = await service_area.findOne({ where: { id: Id } });
        if (!existing) {
            throw new Error(ResponseEnum.NotFound);
        }

        await existing.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: service_area.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [existing.id],
            UserIp: UserIp
        });

        return true;
    }
}
