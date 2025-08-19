import { Injectable } from "@nestjs/common";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { AuditLogService } from "../Admin/AuditLog.service";
import { delivery } from "@Root/Database/Table/CodeMove/delivery";
import { DeliveryModel } from "@Model/CodeMove/Delivery.model";
import { DeliveryStatusEnum } from "@Root/Helper/Enum/DeliveryStatusEnum";
import { OrderStatusEnum } from "@Root/Helper/Enum/OrderStatusEnum";
import { DataSource } from "typeorm";
import { bookings } from "@Root/Database/Table/CodeMove/bookings";
import { BookingStatusEnum } from "@Root/Helper/Enum/BookingStatusEnum";

@Injectable()
export class DeliveryService {
    constructor(private _AuditLogService: AuditLogService, private _DataSource: DataSource) { }

    async GetAll() {
        return await delivery.find();
    }

    async GetById(DeliveryId: string) {
        const DeliveryData = await delivery.findOne({ where: { id: DeliveryId } });
        if (!DeliveryData) throw new Error(ResponseEnum.NotFound);
        return DeliveryData;
    }

    async Insert(DeliveryData: DeliveryModel, UserId: string, UserIp: string) {
        const _DeliveryData = new delivery();
        _DeliveryData.order_id = DeliveryData.order_id;
        _DeliveryData.driver_id = DeliveryData.driver_id;
        _DeliveryData.booking_id = DeliveryData.booking_id; // Added missing booking_id
        _DeliveryData.delivery_status = DeliveryData.delivery_status;
        _DeliveryData.assigned_time = DeliveryData.assigned_time;
        // Set timestamps based on status
        if (DeliveryData.delivery_status === DeliveryStatusEnum.Started) {
            _DeliveryData.start_time = new Date();
        } else if (DeliveryData.delivery_status === DeliveryStatusEnum.Delivered) {
            _DeliveryData.start_time = DeliveryData.start_time || new Date();
            _DeliveryData.end_time = new Date();
        } else {
            _DeliveryData.start_time = DeliveryData.start_time;
            _DeliveryData.end_time = DeliveryData.end_time;
        }

        _DeliveryData.proof_image = DeliveryData.proof_image;
        _DeliveryData.signature = DeliveryData.signature;
        _DeliveryData.created_by_id = UserId;
        _DeliveryData.created_on = new Date();

        await delivery.insert(_DeliveryData);

        // If delivery status is Delivered, update order and booking status
        if (DeliveryData.delivery_status === DeliveryStatusEnum.Delivered) {
            await this._DataSource.query(`
                UPDATE \`order\` 
                SET order_status = ? 
                WHERE id = ?
            `, [OrderStatusEnum.Delivered, DeliveryData.order_id]);

            await this._DataSource.query(`
                UPDATE bookings
                SET booking_status = ? 
                WHERE id = ?
            `, [BookingStatusEnum.Completed, DeliveryData.booking_id]);
        }

        this._AuditLogService.AuditEmitEvent({
            PerformedType: delivery.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_DeliveryData.id],
            UserIp: UserIp
        });

        return _DeliveryData;
    }

    async Update(Id: string, DeliveryData: DeliveryModel, UserId: string, UserIp: string) {
        const DeliveryUpdateData = await delivery.findOne({ where: { id: Id } });
        if (!DeliveryUpdateData) throw new Error(ResponseEnum.NotFound);

        const oldStatus = DeliveryUpdateData.delivery_status;
        DeliveryUpdateData.order_id = DeliveryData.order_id;
        DeliveryUpdateData.driver_id = DeliveryData.driver_id;
        DeliveryUpdateData.booking_id = DeliveryData.booking_id; // Added missing booking_id
        DeliveryUpdateData.delivery_status = DeliveryData.delivery_status;
        DeliveryUpdateData.assigned_time = DeliveryData.assigned_time;


        // Update timestamps based on status change
        if (oldStatus !== DeliveryData.delivery_status) {
            if (DeliveryData.delivery_status === DeliveryStatusEnum.Started && !DeliveryUpdateData.start_time) {
                DeliveryUpdateData.start_time = new Date();
            } else if (DeliveryData.delivery_status === DeliveryStatusEnum.InTransit) {
                DeliveryUpdateData.in_transit_time = new Date();
            } else if (DeliveryData.delivery_status === DeliveryStatusEnum.Delivered) {
                DeliveryUpdateData.end_time = new Date();
            }
        } else {
            // If status didn't change, use provided values
            DeliveryUpdateData.start_time = DeliveryData.start_time;
            DeliveryUpdateData.end_time = DeliveryData.end_time;
        }

        DeliveryUpdateData.proof_image = DeliveryData.proof_image;
        DeliveryUpdateData.signature = DeliveryData.signature;
        DeliveryUpdateData.updated_by_id = UserId;
        DeliveryUpdateData.updated_on = new Date();

        await delivery.update(Id, DeliveryUpdateData);

        // If status changed to Delivered, update order and booking status
        if (oldStatus !== DeliveryStatusEnum.Delivered && DeliveryData.delivery_status === DeliveryStatusEnum.Delivered) {
            await this._DataSource.query(`
                UPDATE \`order\` 
                SET order_status = ? 
                WHERE id = ?
            `, [OrderStatusEnum.Delivered, DeliveryUpdateData.order_id]);

            await this._DataSource.query(`
                UPDATE bookings
                SET booking_status = ? 
                WHERE id = ?
            `, [BookingStatusEnum.Completed, DeliveryUpdateData.booking_id]);
        }

        this._AuditLogService.AuditEmitEvent({
            PerformedType: delivery.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [DeliveryUpdateData.id],
            UserIp: UserIp
        });

        return DeliveryUpdateData;
    }

    async Delete(Id: string, UserIp: string) {
        const DeliveryData = await delivery.findOne({ where: { id: Id } });
        if (!DeliveryData) throw new Error(ResponseEnum.NotFound);

        await DeliveryData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: delivery.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [DeliveryData.id],
            UserIp: UserIp
        });

        return true;
    }
}
