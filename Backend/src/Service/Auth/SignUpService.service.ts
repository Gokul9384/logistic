import { Injectable } from "@nestjs/common";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { AuditLogService } from "../Admin/AuditLog.service";
import { customer } from "@Root/Database/Table/CodeMove/customer";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { CustomerModel } from "@Model/CodeMove/Customer.model";
import { user } from "@Root/Database/Table/Admin/user";
import { user_role } from "@Root/Database/Table/Admin/user_role";
import _ from "lodash";
import { VendorModel } from "@Model/CodeMove/Vendor.model";
import { vendor } from "@Root/Database/Table/CodeMove/vendor";
import { EncryptionService } from "../Encryption.service";

@Injectable()
export class SignUpService {
    constructor(private _AuditLogService: AuditLogService, private _EncryptionService: EncryptionService) { }



    async CustomerSignUp(CustomerData: CustomerModel, UserIp: string) {
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
        _userData.created_by_id = "1";
        _userData.created_on = new Date();
        await user.insert(_userData);


        const _CustomerData = new customer();
        _CustomerData.user_id = _userData.id;
        _CustomerData.name = CustomerData.name;
        _CustomerData.email = CustomerData.email;
        _CustomerData.mobile = CustomerData.mobile;
        _CustomerData.gst_number = CustomerData.gst_number;
        _CustomerData.created_by_id = _userData.id;
        _CustomerData.created_on = new Date();

        await customer.insert(_CustomerData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: customer.name,
            ActionType: LogActionEnum.SignUp,
            PrimaryId: [_CustomerData.id],
            UserIp: UserIp
        });

        return _CustomerData;
    }

    async VendorSignUp(VendorData: VendorModel, UserIp: string) {
        const UserRoleData = await user_role.findOne({ where: { name: "Vendor" } });
        if (!UserRoleData) {
            throw new Error(ResponseEnum.NotFound);
        }
        const _userData = new user();
        _userData.first_name = VendorData.company_name;
        _userData.user_role_id = UserRoleData.id;
        _userData.email = VendorData.email;
        _userData.password = this._EncryptionService.Encrypt(VendorData.password);
        _userData.mobile = VendorData.mobile;
        _userData.created_by_id = '1';
        _userData.created_on = new Date();
        await user.insert(_userData);

        const _VendorData = new vendor();
        _VendorData.user_id = _userData.id;
        _VendorData.company_name = VendorData.company_name;
        _VendorData.address = VendorData.address;
        _VendorData.email = VendorData.email;
        _VendorData.mobile = VendorData.mobile;
        _VendorData.created_by_id = _userData.id;
        _VendorData.created_on = new Date();

        await vendor.insert(_VendorData);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: vendor.name,
            ActionType: LogActionEnum.SignUp,
            PrimaryId: [_VendorData.id],
            UserIp: UserIp
        });
        return _VendorData;
    }

}
