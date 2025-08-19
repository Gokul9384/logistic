import { Injectable } from "@nestjs/common";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { AuditLogService } from "../Admin/AuditLog.service";
import { driver } from "@Root/Database/Table/CodeMove/driver";
import { DriverModel } from "@Model/CodeMove/Driver.model";
import { user } from "@Root/Database/Table/Admin/user";
import { user_role } from "@Root/Database/Table/Admin/user_role";
import { EncryptionService } from "../Encryption.service";

@Injectable()
export class DriverService {
    constructor(private _AuditLogService: AuditLogService, private _EncryptionService: EncryptionService) { }

    async GetAll() {
        return await driver.find({ relations: ['vendor'] });
    }

    async GetById(DriverId: string) {
        const DriverData = await driver.findOne({ where: { id: DriverId } });
        if (!DriverData) throw new Error(ResponseEnum.NotFound);
        return DriverData;
    }

    // async Insert(DriverData: DriverModel, UserId: string, UserIp: string) {

    //     const UserRoleData = await user_role.findOne({ where: { name: "Driver" } });
    //     if (!UserRoleData) {
    //         throw new Error(ResponseEnum.NotFound);
    //     }
    //     const _userData = new user();
    //     _userData.user_role_id = UserRoleData.id;
    //     _userData.first_name = DriverData.name;
    //     _userData.email = DriverData.email;
    //     _userData.password = this._EncryptionService.Encrypt(DriverData.password);
    //     _userData.mobile = DriverData.mobile;
    //     _userData.created_by_id = UserId;
    //     _userData.created_on = new Date();
    //     await user.insert(_userData);

    //     const _DriverData = new driver();
    //     _DriverData.user_id = _userData.id;
    //     _DriverData.vendor_id = DriverData.vendor_id;
    //     _DriverData.email = DriverData.email;
    //     _DriverData.name = DriverData.name;
    //     _DriverData.mobile = DriverData.mobile;
    //     _DriverData.license_number = DriverData.license_number;
    //     _DriverData.vehicle_number = DriverData.vehicle_number;
    //     _DriverData.created_by_id = UserId;
    //     _DriverData.created_on = new Date();

    //     await driver.insert(_DriverData);
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: driver.name,
    //         ActionType: LogActionEnum.Insert,
    //         PrimaryId: [_DriverData.id],
    //         UserIp: UserIp
    //     });

    //     return _DriverData;
    // }

    // async Update(Id: string, DriverData: DriverModel, UserId: string, UserIp: string) {
    //     const DriverUpdateData = await driver.findOne({ where: { id: Id } });
    //     if (!DriverUpdateData) throw new Error(ResponseEnum.NotFound);

    //     DriverUpdateData.vendor_id = DriverData.vendor_id;
    //     DriverUpdateData.name = DriverData.name;
    //     DriverUpdateData.email = DriverData.email;
    //     DriverUpdateData.mobile = DriverData.mobile;
    //     DriverUpdateData.license_number = DriverData.license_number;
    //     DriverUpdateData.vehicle_number = DriverData.vehicle_number;
    //     DriverUpdateData.updated_by_id = UserId;
    //     DriverUpdateData.updated_on = new Date();

    //     await driver.update(Id, DriverUpdateData);
    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: driver.name,
    //         ActionType: LogActionEnum.Update,
    //         PrimaryId: [DriverUpdateData.id],
    //         UserIp: UserIp
    //     });

    //     return DriverUpdateData;
    // }

    // Driver Service (no status changes needed)
    async Insert(DriverData: DriverModel, UserId: string, UserIp: string) {
        const UserRoleData = await user_role.findOne({ where: { name: "Driver" } });
        if (!UserRoleData) {
            throw new Error(ResponseEnum.NotFound);
        }
        const _userData = new user();
        _userData.user_role_id = UserRoleData.id;
        _userData.first_name = DriverData.name;
        _userData.email = DriverData.email;
        _userData.password = this._EncryptionService.Encrypt(DriverData.password);
        _userData.mobile = DriverData.mobile;
        _userData.created_by_id = UserId;
        _userData.created_on = new Date();
        await user.insert(_userData);
        const _DriverData = new driver();
        _DriverData.user_id = _userData.id;
        _DriverData.vendor_id = DriverData.vendor_id;
        _DriverData.email = DriverData.email;
        _DriverData.name = DriverData.name;
        _DriverData.mobile = DriverData.mobile;
        _DriverData.license_number = DriverData.license_number;
        _DriverData.vehicle_number = DriverData.vehicle_number;
        _DriverData.created_by_id = UserId;
        _DriverData.created_on = new Date();
        await driver.insert(_DriverData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: driver.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_DriverData.id],
            UserIp: UserIp
        });
        return _DriverData;
    }

    async Update(Id: string, DriverData: DriverModel, UserId: string, UserIp: string) {
        const DriverUpdateData = await driver.findOne({ where: { id: Id } });
        if (!DriverUpdateData) throw new Error(ResponseEnum.NotFound);
        DriverUpdateData.vendor_id = DriverData.vendor_id;
        DriverUpdateData.name = DriverData.name;
        DriverUpdateData.email = DriverData.email;
        DriverUpdateData.mobile = DriverData.mobile;
        DriverUpdateData.license_number = DriverData.license_number;
        DriverUpdateData.vehicle_number = DriverData.vehicle_number;
        DriverUpdateData.updated_by_id = UserId;
        DriverUpdateData.updated_on = new Date();
        await driver.update(Id, DriverUpdateData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: driver.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [DriverUpdateData.id],
            UserIp: UserIp
        });
        return DriverUpdateData;
    }

    async Delete(Id: string, UserIp: string) {
        const DriverData = await driver.findOne({ where: { id: Id } });
        if (!DriverData) throw new Error(ResponseEnum.NotFound);

        await DriverData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: driver.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [DriverData.id],
            UserIp: UserIp
        });

        return true;
    }
}
