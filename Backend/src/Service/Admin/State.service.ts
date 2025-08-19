import { Injectable } from "@nestjs/common";
import { AuditLogService } from "./AuditLog.service";
import { CacheService } from "../Cache.service";
import { CacheEnum } from "@Root/Helper/Enum/CacheEnum";
import { state } from "@Root/Database/Table/Admin/state";
import { StateModel } from "@Model/Admin/State.model";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";


@Injectable()
export class StateService {
    constructor(private _AuditLogService: AuditLogService,
        private _CacheService: CacheService) {
    }

    async GetAll() {
        const ResultData = await this._CacheService.Get(`${CacheEnum.State}:*`);
        if (ResultData.length > 0) {
            return ResultData;
        }
        else {
            const StateList = await state.find({ relations: ["country"] });
            await this._CacheService.Store(`${CacheEnum.Currency}`, StateList);
            return StateList;
        }
    }

    async GetById(StateId: string) {
        const ResultData = await this._CacheService.Get(`${CacheEnum.State}:${StateId}`);
        if (ResultData.length > 0) {
            return ResultData[0];
        }
        else {
            const StateData = await state.findOne({ relations: ["country"], where: { id: StateId } });
            await this._CacheService.Store(`${CacheEnum.Currency}:${StateId}`, [StateData]);
            return StateData;
        }
    }

    async Insert(StateData: StateModel, UserId: string, UserIp: string) {
        const _StateData = new state();
        _StateData.name = StateData.name;
        _StateData.code = StateData.code;
        _StateData.country_id = StateData.country_id;
        _StateData.created_by_id = UserId;
        _StateData.created_on = new Date();
        await state.insert(_StateData);
        this._AuditLogService.AuditEmitEvent({ PerformedType: state.name, ActionType: LogActionEnum.Insert, PrimaryId: [_StateData.id], UserIp: UserIp });
        await this._CacheService.Store(`${CacheEnum.Currency}`, [_StateData]);
        return _StateData
    }

    async Update(Id: string, StateData: StateModel, UserId: string, UserIp: string) {
        const StateUpdateData = await state.findOne({ where: { id: Id } });
        if (!StateUpdateData) {
            throw new Error('Record not found')
        }
        StateUpdateData.name = StateData.name;
        StateUpdateData.code = StateData.code;
        StateUpdateData.country_id = StateData.country_id;
        StateUpdateData.updated_by_id = UserId;
        StateUpdateData.updated_on = new Date();
        await state.update(Id, StateUpdateData);
        this._AuditLogService.AuditEmitEvent({ PerformedType: state.name, ActionType: LogActionEnum.Update, PrimaryId: [StateUpdateData.id], UserIp: UserIp });
        await this._CacheService.Store(`${CacheEnum.State}`, [{ ...StateUpdateData, id: Id }]);
        return StateUpdateData;
    }

    async Delete(Id: string, UserIp: string) {
        const StateData = await state.findOne({ where: { id: Id } });
        if (!StateData) {
            throw new Error(ResponseEnum.NotFound);
        }
        await StateData.remove();
        this._AuditLogService.AuditEmitEvent({ PerformedType: state.name, ActionType: LogActionEnum.Delete, PrimaryId: [StateData.id], UserIp: UserIp });
        await this._CacheService.Remove(`${CacheEnum.State}:${Id}`, StateData);
        return true;
    }

}
