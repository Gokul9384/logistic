import { Injectable } from "@nestjs/common";
import { AuditLogService } from "./AuditLog.service";
import { city } from "@Root/Database/Table/Admin/city";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { CityModel } from "@Model/Admin/City.model";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";


@Injectable()
export class CityService {
  constructor(private _AuditLogService: AuditLogService) { }

  async GetAll() {
    return await city.find({ relations: ["state", "country"] });
  }

  async GetById(CityId: string) {
    const CityData = await city.findOne({ relations: ["state"], where: { id: CityId } });
    if (!CityData) {
      throw new Error(ResponseEnum.NotFound);
    }
    return CityData;
  }

  async Insert(CityData: CityModel, UserId: string, UserIp: string) {
    const _CityData = new city();
    _CityData.name = CityData.name;
    _CityData.code = CityData.code;
    _CityData.state_id = CityData.state_id;
    _CityData.country_id = CityData.country_id;
    _CityData.created_by_id = UserId;
    _CityData.created_on = new Date();
    await city.insert(_CityData);
    this._AuditLogService.AuditEmitEvent({ PerformedType: city.name, ActionType: LogActionEnum.Insert, PrimaryId: [_CityData.id], UserIp: UserIp });
    return _CityData;
  }

  async Update(Id: string, CityData: CityModel, UserId: string, UserIp: string) {
    const CityUpdateData = await city.findOne({ where: { id: Id } });
    if (!CityUpdateData) {
      throw new Error('Record not found')
    }
    CityUpdateData.name = CityData.name;
    CityUpdateData.code = CityData.code;
    CityUpdateData.state_id = CityData.state_id;
    CityUpdateData.country_id = CityData.country_id;
    CityUpdateData.updated_by_id = UserId;
    CityUpdateData.updated_on = new Date();
    await city.update(Id, CityUpdateData);
    this._AuditLogService.AuditEmitEvent({ PerformedType: city.name, ActionType: LogActionEnum.Update, PrimaryId: [CityUpdateData.id], UserIp: UserIp });
    return CityUpdateData;
  }

  async Delete(Id: string, UserIp: string) {
    const CityData = await city.findOne({ where: { id: Id } });
    if (!CityData) {
      throw new Error(ResponseEnum.NotFound);
    }
    await CityData.remove();
    this._AuditLogService.AuditEmitEvent({ PerformedType: city.name, ActionType: LogActionEnum.Delete, PrimaryId: [CityData.id], UserIp: UserIp });
    return true;
  }
}
