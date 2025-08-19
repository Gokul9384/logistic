import { Injectable } from "@nestjs/common";
import { BookingModel } from "@Model/CodeMove/Booking.model";
import { bookings } from "@Root/Database/Table/CodeMove/bookings";
import { AuditLogService } from "../Admin/AuditLog.service";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { delivery } from "@Root/Database/Table/CodeMove/delivery";
import { DeliveryStatusEnum } from "@Root/Helper/Enum/DeliveryStatusEnum";
import { CommonService } from "../Common.service";
import { DataSource } from "typeorm";
import { notification } from "@Root/Database/Table/CodeMove/notification";
import { BookingStatusEnum } from "@Root/Helper/Enum/BookingStatusEnum";
import { OrderStatusEnum } from "@Root/Helper/Enum/OrderStatusEnum";

@Injectable()
export class BookingService {
    constructor(
        private _AuditLogService: AuditLogService,
        private _CommonService: CommonService,
        private _DataSource: DataSource
    ) { }

    async GetAll() {
        return await bookings.find({ relations: ["order", "vendor", "quote", "driver", "customer"] });
    }

    async GetById(Id: string) {
        const data = await bookings.findOne({ where: { id: Id }, relations: ["order", "vendor", "quote"] });
        if (!data) throw new Error(ResponseEnum.NotFound);
        return data;
    }

    // async Insert(BookingData: BookingModel, UserId: string, UserIp: string) {
    //     let BookingNumber = await this._DataSource.query(`SELECT b.booking_number FROM \`bookings\` AS b ORDER BY CAST(REGEXP_REPLACE(b.booking_number, '[^0-9]', '') AS UNSIGNED) DESC`);
    //     if (BookingNumber[0]?.booking_number) {
    //         BookingNumber[0].booking_number = this._CommonService.AutoGenerateNumber(BookingNumber[0].booking_number);
    //     }
    //     else {
    //         BookingNumber[0] = {};
    //         BookingNumber[0]['booking_number'] = "BK-00001";
    //     }
    //     const _BookingData = new bookings();
    //     _BookingData.booking_number = BookingNumber[0].booking_number;
    //     _BookingData.order_id = BookingData.order_id;
    //     _BookingData.vendor_id = BookingData.vendor_id;
    //     _BookingData.customer_id = BookingData.customer_id;
    //     _BookingData.quote_id = BookingData.quote_id;
    //     _BookingData.amount = BookingData.amount;
    //     _BookingData.booking_status = BookingData.booking_status;
    //     _BookingData.driver_id = BookingData.driver_id;
    //     _BookingData.vehicle_number = BookingData.vehicle_number;
    //     _BookingData.created_by_id = UserId;
    //     _BookingData.created_on = new Date();

    //     await bookings.insert(_BookingData);
    //     const newVendorNotification = new notification();
    //     newVendorNotification.title = 'New Booking Created';
    //     newVendorNotification.message = `Booking ${_BookingData.booking_number} has been placed.`;
    //     newVendorNotification.user_id = _BookingData.vendor_id;
    //     newVendorNotification.user_type = 'Vendor';
    //     newVendorNotification.route_module = 'bookings';
    //     newVendorNotification.route_id = _BookingData.id;
    //     newVendorNotification.is_read = false;
    //     newVendorNotification.created_by_id = UserId;
    //     newVendorNotification.created_on = new Date();

    //     await notification.insert(newVendorNotification);

    //     const newCustomerNotification = new notification();
    //     newCustomerNotification.title = 'New Booking Created';
    //     newCustomerNotification.message = `Booking ${_BookingData.booking_number} has been placed.`;
    //     newCustomerNotification.user_id = _BookingData.customer_id;
    //     newCustomerNotification.user_type = 'Customer';
    //     newCustomerNotification.route_module = 'bookings';
    //     newCustomerNotification.route_id = _BookingData.id;
    //     newCustomerNotification.is_read = false;
    //     newCustomerNotification.created_by_id = UserId;
    //     newCustomerNotification.created_on = new Date();
    //     await notification.insert(newCustomerNotification);


    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: bookings.name,
    //         ActionType: LogActionEnum.Insert,
    //         PrimaryId: [_BookingData.id],
    //         UserIp: UserIp
    //     });

    //     // In BookingService, after vendor accepts and assigns driver
    //     await delivery.insert({
    //         order_id: _BookingData.order_id,
    //         booking_id: _BookingData.id,
    //         driver_id: _BookingData.driver_id,
    //         delivery_status: DeliveryStatusEnum.Assigned,
    //         start_time: new Date(),
    //         created_by_id: UserId,
    //         created_on: new Date()
    //     });


    //     return _BookingData;
    // }

    // async Update(Id: string, BookingData: BookingModel, UserId: string, UserIp: string) {
    //     const UpdateData = await bookings.findOne({ where: { id: Id } });
    //     if (!UpdateData) throw new Error(ResponseEnum.NotFound);

    //     UpdateData.order_id = BookingData.order_id;
    //     UpdateData.vendor_id = BookingData.vendor_id;
    //     UpdateData.customer_id = BookingData.customer_id;
    //     UpdateData.quote_id = BookingData.quote_id;
    //     UpdateData.amount = BookingData.amount;
    //     UpdateData.booking_status = BookingData.booking_status;
    //     UpdateData.driver_id = BookingData.driver_id;
    //     UpdateData.vehicle_number = BookingData.vehicle_number;
    //     UpdateData.updated_by_id = UserId;
    //     UpdateData.updated_on = new Date();

    //     await bookings.update(Id, UpdateData);

    //     const newVendorNotification = new notification();
    //     newVendorNotification.title = 'Booking Updated';
    //     newVendorNotification.message = `Booking ${UpdateData.booking_number} has been updated.`;
    //     newVendorNotification.user_id = UpdateData.vendor_id;
    //     newVendorNotification.user_type = 'Vendor';
    //     newVendorNotification.is_read = false;
    //     newVendorNotification.created_by_id = UserId;
    //     newVendorNotification.created_on = new Date();

    //     await notification.insert(newVendorNotification);

    //     const newCustomerNotification = new notification();
    //     newCustomerNotification.title = 'Booking Updated';
    //     newCustomerNotification.message = `Booking ${UpdateData.booking_number} has been updated.`;
    //     newCustomerNotification.user_id = UpdateData.customer_id;
    //     newCustomerNotification.user_type = 'Customer';
    //     newCustomerNotification.is_read = false;
    //     newCustomerNotification.created_by_id = UserId;
    //     newCustomerNotification.created_on = new Date();

    //     await notification.insert(newCustomerNotification);


    //     this._AuditLogService.AuditEmitEvent({
    //         PerformedType: bookings.name,
    //         ActionType: LogActionEnum.Update,
    //         PrimaryId: [UpdateData.id],
    //         UserIp: UserIp
    //     });

    //     return UpdateData;
    // }

    // Booking Service

    async Insert(BookingData: BookingModel, UserId: string, UserIp: string) {
        let BookingNumber = await this._DataSource.query(`
        SELECT b.booking_number 
        FROM \`bookings\` AS b 
        ORDER BY CAST(REGEXP_REPLACE(b.booking_number, '[^0-9]', '') AS UNSIGNED) DESC
    `);

        if (BookingNumber[0]?.booking_number) {
            BookingNumber[0].booking_number = this._CommonService.AutoGenerateNumber(BookingNumber[0].booking_number);
        } else {
            BookingNumber[0] = { booking_number: "BK-00001" };
        }

        const _BookingData = new bookings();
        _BookingData.booking_number = BookingNumber[0].booking_number;
        _BookingData.order_id = BookingData.order_id;
        _BookingData.vendor_id = BookingData.vendor_id;
        _BookingData.customer_id = BookingData.customer_id;
        _BookingData.quote_id = BookingData.quote_id;
        _BookingData.amount = BookingData.amount;
        _BookingData.booking_status = BookingStatusEnum.CREATED;
        _BookingData.driver_id = BookingData.driver_id;
        _BookingData.vehicle_number = BookingData.vehicle_number;
        _BookingData.created_by_id = UserId;
        _BookingData.created_on = new Date();
        await bookings.insert(_BookingData);


        // Vendor Notification
        const newVendorNotification = new notification();
        newVendorNotification.title = 'New Booking Created';
        newVendorNotification.message = `Booking ${_BookingData.booking_number} has been successfully created and assigned to your account.`;
        newVendorNotification.user_id = _BookingData.vendor_id;
        newVendorNotification.user_type = 'Vendor';
        newVendorNotification.route_module = 'bookings';
        newVendorNotification.route_id = _BookingData.id;
        newVendorNotification.is_read = false;
        newVendorNotification.created_by_id = UserId;
        newVendorNotification.created_on = new Date();
        await notification.insert(newVendorNotification);

        // Customer Notification
        const newCustomerNotification = new notification();
        newCustomerNotification.title = 'New Booking Created';
        newCustomerNotification.message = `Your booking ${_BookingData.booking_number} has been successfully created.`;
        newCustomerNotification.user_id = _BookingData.customer_id;
        newCustomerNotification.user_type = 'Customer';
        newCustomerNotification.route_module = 'bookings';
        newCustomerNotification.route_id = _BookingData.id;
        newCustomerNotification.is_read = false;
        newCustomerNotification.created_by_id = UserId;
        newCustomerNotification.created_on = new Date();
        await notification.insert(newCustomerNotification);

        // Audit log
        this._AuditLogService.AuditEmitEvent({
            PerformedType: bookings.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [_BookingData.id],
            UserIp: UserIp
        });

        return _BookingData;
    }

    // Booking Service Update Method
    async Update(Id: string, BookingData: BookingModel, UserId: string, UserIp: string) {
        const UpdateData = await bookings.findOne({ where: { id: Id } });
        if (!UpdateData) throw new Error(ResponseEnum.NotFound);

        const oldStatus = UpdateData.booking_status;
        const oldDriverId = UpdateData.driver_id;

        UpdateData.order_id = BookingData.order_id;
        UpdateData.vendor_id = BookingData.vendor_id;
        UpdateData.customer_id = BookingData.customer_id;
        UpdateData.quote_id = BookingData.quote_id;
        UpdateData.amount = BookingData.amount;
        UpdateData.booking_status = BookingData.booking_status;
        UpdateData.driver_id = BookingData.driver_id;
        UpdateData.vehicle_number = BookingData.vehicle_number;
        UpdateData.updated_by_id = UserId;
        UpdateData.updated_on = new Date();

        await bookings.update(Id, UpdateData);

        // If status changed to Confirmed and driver is assigned
        if (oldStatus !== BookingStatusEnum.CONFIRMED &&
            BookingData.booking_status === BookingStatusEnum.CONFIRMED &&
            BookingData.driver_id) {

            // Update order status
            await this._DataSource.query(`
            UPDATE \`order\` 
            SET order_status = ? 
            WHERE id = ?
        `, [OrderStatusEnum.Assigned, UpdateData.order_id]);

            // Create or update delivery entry
            const existingDelivery = await delivery.findOne({
                where: { booking_id: UpdateData.id }
            });

            if (existingDelivery) {
                // Update existing delivery
                await delivery.update(existingDelivery.id, {
                    driver_id: BookingData.driver_id,
                    delivery_status: DeliveryStatusEnum.Assigned,
                    updated_by_id: UserId,
                    updated_on: new Date()
                });
            } else {
                // Create new delivery entry
                await delivery.insert({
                    order_id: BookingData.order_id,
                    booking_id: BookingData.id,
                    driver_id: BookingData.driver_id,
                    assigned_time: new Date(),
                    delivery_status: DeliveryStatusEnum.Assigned,
                    created_by_id: UserId,
                    created_on: new Date()
                });
            }

            // Notify driver
            const newDriverNotification = new notification();
            newDriverNotification.title = 'New Booking Assignment';
            newDriverNotification.message = `You have been assigned to booking ${BookingData.booking_number}. Please check the details.`;
            newDriverNotification.user_id = BookingData.driver_id;
            newDriverNotification.user_type = 'Driver';
            newDriverNotification.route_module = 'bookings';
            newDriverNotification.route_id = BookingData.id;
            newDriverNotification.is_read = false;
            newDriverNotification.created_by_id = UserId;
            newDriverNotification.created_on = new Date();
            await notification.insert(newDriverNotification);
        }

        // If driver changed, update delivery and notify new driver
        if (oldDriverId !== BookingData.driver_id && BookingData.driver_id) {
            // Update delivery with new driver
            await this._DataSource.getRepository(delivery).update(
                { booking_id: UpdateData.id },
                {
                    driver_id: BookingData.driver_id,
                    updated_by_id: UserId,
                    updated_on: new Date()
                }
            );

            // Notify new driver
            const newDriverNotification = new notification();
            newDriverNotification.title = 'Booking Assignment Updated';
            newDriverNotification.message = `You have been assigned to booking ${BookingData.booking_number}. Please check the details.`;
            newDriverNotification.user_id = BookingData.driver_id;
            newDriverNotification.user_type = 'Driver';
            newDriverNotification.route_module = 'bookings';
            newDriverNotification.route_id = BookingData.id;
            newDriverNotification.is_read = false;
            newDriverNotification.created_by_id = UserId;
            newDriverNotification.created_on = new Date();
            await notification.insert(newDriverNotification);
        }

        // Vendor Notification
        const newVendorNotification = new notification();
        newVendorNotification.title = 'Booking Details Updated';
        newVendorNotification.message = `Booking ${UpdateData.booking_number} details have been updated.`;
        newVendorNotification.user_id = UpdateData.vendor_id;
        newVendorNotification.user_type = 'Vendor';
        newVendorNotification.route_module = 'bookings';
        newVendorNotification.route_id = UpdateData.id;
        newVendorNotification.is_read = false;
        newVendorNotification.created_by_id = UserId;
        newVendorNotification.created_on = new Date();
        await notification.insert(newVendorNotification);

        // Customer Notification
        const newCustomerNotification = new notification();
        newCustomerNotification.title = 'Booking Details Updated';
        newCustomerNotification.message = `Your booking ${UpdateData.booking_number} details have been updated.`;
        newCustomerNotification.user_id = UpdateData.customer_id;
        newCustomerNotification.user_type = 'Customer';
        newCustomerNotification.route_module = 'bookings';
        newCustomerNotification.route_id = UpdateData.id;
        newCustomerNotification.is_read = false;
        newCustomerNotification.created_by_id = UserId;
        newCustomerNotification.created_on = new Date();
        await notification.insert(newCustomerNotification);

        // Audit log
        this._AuditLogService.AuditEmitEvent({
            PerformedType: bookings.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [UpdateData.id],
            UserIp: UserIp
        });

        return UpdateData;
    }


    async Delete(Id: string, UserIp: string) {
        const Data = await bookings.findOne({ where: { id: Id } });
        if (!Data) throw new Error(ResponseEnum.NotFound);

        await Data.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: bookings.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [Data.id],
            UserIp: UserIp
        });

        return true;
    }
}
