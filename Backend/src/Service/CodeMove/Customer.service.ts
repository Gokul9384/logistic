import { Injectable } from "@nestjs/common";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { AuditLogService } from "../Admin/AuditLog.service";
import { customer } from "@Root/Database/Table/CodeMove/customer";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { CustomerModel } from "@Model/CodeMove/Customer.model";
import { use } from "passport";
import { user } from "@Root/Database/Table/Admin/user";
import { user_role } from "@Root/Database/Table/Admin/user_role";
import _ from "lodash";
import { EncryptionService } from "../Encryption.service";

@Injectable()
export class CustomerService {
    constructor(private _AuditLogService: AuditLogService, private _EncryptionService: EncryptionService) { }

    async GetAll() {
        return await customer.find();
    }

    async GetById(CustomerId: string) {
        const CustomerData = await customer.findOne({ where: { id: CustomerId } });
        if (!CustomerData) throw new Error(ResponseEnum.NotFound);
        return CustomerData;
    }

    async Insert(CustomerData: CustomerModel, UserId: string, UserIp: string) {
        const UserRoleData = await user_role.findOne({ where: { name: "Customer" } });
        if (!UserRoleData) {
            throw new Error(ResponseEnum.NotFound);
        }
        const _userData = new user();
        _userData.first_name = CustomerData.name;
        _userData.user_role_id = UserRoleData.id;
        _userData.email = CustomerData.email;
        _userData.password = this._EncryptionService.Encrypt(CustomerData.password);
        _userData.mobile = CustomerData.mobile;
        _userData.created_by_id = UserId;
        _userData.created_on = new Date();
        await user.insert(_userData);


        const _CustomerData = new customer();
        _CustomerData.user_id = _userData.id;
        _CustomerData.name = CustomerData.name;
        _CustomerData.email = CustomerData.email;
        _CustomerData.mobile = CustomerData.mobile;
        _CustomerData.gst_number = CustomerData.gst_number;
        _CustomerData.latitude = CustomerData.latitude;
        _CustomerData.longitude = CustomerData.longitude;
        _CustomerData.formatted_address = CustomerData.formatted_address;
        _CustomerData.created_by_id = UserId;
        _CustomerData.created_on = new Date();

        await customer.insert(_CustomerData);
        await user.update({ id: _CustomerData.user_id }, { is_profile_updated: true });
        this._AuditLogService.AuditEmitEvent({
            PerformedType: customer.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_CustomerData.id],
            UserIp: UserIp
        });

        return _CustomerData;
    }

    async Update(Id: string, CustomerData: CustomerModel, UserId: string, UserIp: string) {
        const CustomerUpdateData = await customer.findOne({ where: { id: Id } });
        if (!CustomerUpdateData) throw new Error(ResponseEnum.NotFound);

        CustomerUpdateData.name = CustomerData.name;
        CustomerUpdateData.email = CustomerData.email;
        CustomerUpdateData.mobile = CustomerData.mobile;
        CustomerUpdateData.gst_number = CustomerData.gst_number;
        CustomerUpdateData.latitude = CustomerData.latitude;
        CustomerUpdateData.longitude = CustomerData.longitude;
        CustomerUpdateData.formatted_address = CustomerData.formatted_address;
        CustomerUpdateData.updated_by_id = UserId;
        CustomerUpdateData.updated_on = new Date();

        await customer.update(Id, CustomerUpdateData);
        await user.update({ id: CustomerUpdateData.user_id }, { is_profile_updated: true });
        this._AuditLogService.AuditEmitEvent({
            PerformedType: customer.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [CustomerUpdateData.id],
            UserIp: UserIp
        });

        return CustomerUpdateData;
    }

    async Delete(Id: string, UserIp: string) {
        const CustomerData = await customer.findOne({ where: { id: Id } });
        if (!CustomerData) throw new Error(ResponseEnum.NotFound);

        await CustomerData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: customer.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [CustomerData.id],
            UserIp: UserIp
        });

        return true;
    }
}
