import { Injectable } from "@nestjs/common";
import { vendor } from "@Root/Database/Table/CodeMove/vendor";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { AuditLogService } from "../Admin/AuditLog.service";
import { VendorModel } from "@Model/CodeMove/Vendor.model";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { user } from "@Root/Database/Table/Admin/user";
import { user_role } from "@Root/Database/Table/Admin/user_role";
import { EncryptionService } from "../Encryption.service";
import { vendor_vehicle } from "@Root/Database/Table/CodeMove/vendor_vehicle";
import { DataSource } from "typeorm";
import { vendor_service_area } from "@Root/Database/Table/CodeMove/vendor_service_area";

@Injectable()
export class VendorService {
    constructor(private _AuditLogService: AuditLogService, private _EncryptionService: EncryptionService, private _Datasource: DataSource) { }

    async GetAll() {
        const query = await this._Datasource.query(`
        SELECT 
            v.id,
            v.company_name,
            v.address,
            v.email,
            v.gst_number,
            v.pan_number,
            v.mobile,
            v.user_id,
            vv.vehicle_type_id,
            vv.min_capacity,
            vv.max_capacity,
            vs.service_area_id,
            vs.min_km,
            vs.max_km
        FROM
            vendor v 
        LEFT JOIN vendor_vehicle vv ON v.id = vv.vendor_id
        LEFT JOIN vendor_service_area vs ON v.id = vs.vendor_id
    `);

        const vendorMap = new Map();

        for (const row of query) {
            if (!vendorMap.has(row.id)) {
                vendorMap.set(row.id, {
                    id: row.id,
                    status: true,
                    company_name: row.company_name,
                    address: row.address,
                    email: row.email,
                    gst_number: row.gst_number,
                    pan_number: row.pan_number,
                    mobile: row.mobile,
                    user_id: row.user_id,
                    vendor_vehicle_list: [],
                    vendor_service_area_list: [],
                });
            }

            const vendor = vendorMap.get(row.id);

            // Deduplicate vehicle list
            const vehicleKey = `${row.vehicle_type_id}-${row.min_capacity}-${row.max_capacity}`;
            if (
                row.vehicle_type_id &&
                !vendor.vendor_vehicle_list.some(
                    (v: any) =>
                        v.vehicle_type_id === row.vehicle_type_id &&
                        v.min_capacity === row.min_capacity &&
                        v.max_capacity === row.max_capacity
                )
            ) {
                vendor.vendor_vehicle_list.push({
                    vehicle_type_id: row.vehicle_type_id,
                    min_capacity: row.min_capacity,
                    max_capacity: row.max_capacity,
                });
            }

            // Deduplicate service area list
            if (
                row.service_area_id &&
                !vendor.vendor_service_area_list.some(
                    (s: any) =>
                        s.service_area_id === row.service_area_id &&
                        s.min_km === row.min_km &&
                        s.max_km === row.max_km
                )
            ) {
                vendor.vendor_service_area_list.push({
                    service_area_id: row.service_area_id,
                    min_km: row.min_km,
                    max_km: row.max_km,
                });
            }
        }

        return Array.from(vendorMap.values());
    }


    async GetById(id: string) {
        const query = await this._Datasource.query(`
    SELECT 
      v.id,
      v.company_name,
      v.address,
      v.email,
      v.gst_number,
      v.pan_number,
      v.mobile,
      v.user_id,
      vv.vehicle_type_id,
      vv.min_capacity,
      vv.max_capacity,
      vs.service_area_id,
      vs.min_km,
      vs.max_km
    FROM
      vendor v 
    LEFT JOIN vendor_vehicle vv ON v.id = vv.vendor_id
    LEFT JOIN vendor_service_area vs ON v.id = vs.vendor_id
    WHERE v.id = ?
  `, [id]);

        if (!query.length) {
            return null;
        }

        const result = {
            id: query[0].id,
            status: true,
            company_name: query[0].company_name,
            address: query[0].address,
            email: query[0].email,
            gst_number: query[0].gst_number,
            pan_number: query[0].pan_number,
            service_area: query[0].service_area,
            mobile: query[0].mobile,
            user_id: query[0].user_id,
            vendor_vehicle_list: [],
            vendor_service_area_list: [],
        };

        const vehicleSet = new Set();
        const serviceAreaSet = new Set();

        for (const row of query) {
            // Deduplicate vendor vehicles
            if (row.vehicle_type_id) {
                const vehicleKey = `${row.vehicle_type_id}-${row.min_capacity}-${row.max_capacity}`;
                if (!vehicleSet.has(vehicleKey)) {
                    result.vendor_vehicle_list.push({
                        vehicle_type_id: row.vehicle_type_id,
                        min_capacity: row.min_capacity,
                        max_capacity: row.max_capacity,
                    });
                    vehicleSet.add(vehicleKey);
                }
            }

            // Deduplicate vendor service areas
            if (row.service_area_id) {
                const serviceKey = `${row.service_area_id}-${row.min_km}-${row.max_km}`;
                if (!serviceAreaSet.has(serviceKey)) {
                    result.vendor_service_area_list.push({
                        service_area_id: row.service_area_id,
                        min_km: row.min_km,
                        max_km: row.max_km,
                    });
                    serviceAreaSet.add(serviceKey);
                }
            }
        }

        return result;
    }


    async Insert(VendorData: VendorModel, UserId: string, UserIp: string) {
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
        _userData.created_by_id = UserId;
        _userData.created_on = new Date();
        await user.insert(_userData);

        const _VendorData = new vendor();
        _VendorData.user_id = _userData.id;
        _VendorData.company_name = VendorData.company_name;
        _VendorData.address = VendorData.address;
        _VendorData.email = VendorData.email;
        _VendorData.mobile = VendorData.mobile;
        _VendorData.gst_number = VendorData.gst_number;
        _VendorData.pan_number = VendorData.pan_number;
        _VendorData.created_by_id = UserId;
        _VendorData.created_on = new Date();
        await vendor.insert(_VendorData);


        if (VendorData.vendor_vehicle_list?.length > 0) {
            const vehicleEntities = VendorData.vendor_vehicle_list.map(v => {
                const _vendor_vehicle = new vendor_vehicle();
                _vendor_vehicle.vendor_id = _VendorData.id;
                _vendor_vehicle.vehicle_type_id = v.vehicle_type_id;
                _vendor_vehicle.min_capacity = v.min_capacity;
                _vendor_vehicle.max_capacity = v.max_capacity;
                _vendor_vehicle.created_by_id = UserId;
                _vendor_vehicle.created_on = new Date();
                return _vendor_vehicle;
            });

            await vendor_vehicle.save(vehicleEntities);
        }

        if (VendorData.vendor_service_area_list?.length > 0) {
            const serviceAreaEntities = VendorData.vendor_service_area_list.map(area => {
                const _vendor_service_area = new vendor_service_area();
                _vendor_service_area.vendor_id = _VendorData.id;
                _vendor_service_area.service_area_id = area.service_area_id;
                _vendor_service_area.min_km = area.min_km;
                _vendor_service_area.max_km = area.max_km;
                _vendor_service_area.created_by_id = UserId;
                _vendor_service_area.created_on = new Date();
                return _vendor_service_area;
            });

            await vendor_service_area.save(serviceAreaEntities);
        }


        this._AuditLogService.AuditEmitEvent({
            PerformedType: vendor.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_VendorData.id],
            UserIp: UserIp
        });
        return _VendorData;
    }

    async Update(Id: string, VendorData: VendorModel, UserId: string, UserIp: string) {
        const VendorUpdateData = await vendor.findOne({ where: { id: Id } });
        if (!VendorUpdateData) {
            throw new Error(ResponseEnum.NotFound);
        }

        VendorUpdateData.company_name = VendorData.company_name;
        VendorUpdateData.address = VendorData.address;
        VendorUpdateData.email = VendorData.email;
        VendorUpdateData.mobile = VendorData.mobile;
        VendorUpdateData.gst_number = VendorData.gst_number;
        VendorUpdateData.pan_number = VendorData.pan_number;
        VendorUpdateData.updated_by_id = UserId;
        VendorUpdateData.updated_on = new Date();
        await vendor.update(Id, VendorUpdateData);
        await user.update({ id: VendorUpdateData.user_id }, { is_profile_updated: true });

        await vendor_vehicle.delete({ vendor_id: VendorUpdateData.id });

        // Insert updated vendor vehicles
        if (VendorData.vendor_vehicle_list?.length > 0) {
            const vehicleEntities = VendorData.vendor_vehicle_list.map(v => {
                const _vendor_vehicle = new vendor_vehicle();
                _vendor_vehicle.vendor_id = VendorUpdateData.id;
                _vendor_vehicle.vehicle_type_id = v.vehicle_type_id;
                _vendor_vehicle.min_capacity = v.min_capacity;
                _vendor_vehicle.max_capacity = v.max_capacity;
                _vendor_vehicle.created_by_id = UserId;
                _vendor_vehicle.created_on = new Date();
                return _vendor_vehicle;
            });

            await vendor_vehicle.save(vehicleEntities);
        }

        await vendor_service_area.delete({ vendor_id: VendorUpdateData.id });

        if (VendorData.vendor_service_area_list?.length > 0) {
            const serviceAreaEntities = VendorData.vendor_service_area_list.map(area => {
                const _vendor_service_area = new vendor_service_area();
                _vendor_service_area.vendor_id = VendorUpdateData.id;
                _vendor_service_area.service_area_id = area.service_area_id;
                _vendor_service_area.min_km = area.min_km;
                _vendor_service_area.max_km = area.max_km;
                _vendor_service_area.created_by_id = UserId;
                _vendor_service_area.created_on = new Date();
                return _vendor_service_area;
            });

            await vendor_service_area.save(serviceAreaEntities);
        }


        this._AuditLogService.AuditEmitEvent({
            PerformedType: vendor.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [VendorUpdateData.id],
            UserIp: UserIp
        });
        return VendorUpdateData;
    }

    async Delete(Id: string, UserIp: string) {
        const VendorData = await vendor.findOne({ where: { id: Id } });
        if (!VendorData) {
            throw new Error(ResponseEnum.NotFound);
        }

        await VendorData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: vendor.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [VendorData.id],
            UserIp: UserIp
        });
        return true;
    }
}
