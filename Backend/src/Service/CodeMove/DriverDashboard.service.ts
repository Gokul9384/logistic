import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class DriverDashboardService {
    constructor(private dataSource: DataSource) { }

    async getDriverStats(driverId: string) {
        const stats = await this.dataSource.query(
            `
    SELECT
      (SELECT COUNT(id) FROM bookings WHERE driver_id = ? AND booking_status = 'Confirmed') AS assigned_booking,
      (SELECT COUNT(id) FROM delivery WHERE driver_id = ? AND delivery_status != 'Delivered') AS pending_delivery,
      (SELECT COUNT(id) FROM delivery WHERE driver_id = ? AND delivery_status = 'In Transit') AS in_transit,
      (SELECT COUNT(id) FROM delivery WHERE driver_id = ? AND delivery_status = 'Delivered') AS complete
    `,
            [driverId, driverId, driverId, driverId]
        );

        return stats?.[0] || {
            assigned_booking: 0,
            pending_delivery: 0,
            in_transit: 0,
            complete: 0,
        };
    }


    async getDriverOrders(driverId: string, startDate: string) {
        const orders = await this.dataSource.query(
            `
        SELECT 
            o.id AS order_id,
            o.order_number,
            o.order_date,
            o.pickup_date,
            o.pickup_time,
            o.source_location,
            o.destination_location,
            b.booking_number,
            b.booking_status,
            b.driver_id AS driver_id,
            d.id AS delivery_id,
            d.delivery_status,
            d.start_time,
            d.end_time,
            d.created_on
        FROM
            \`order\` o 
        LEFT JOIN	
            bookings b ON b.order_id = o.id
        LEFT JOIN 
            delivery d ON d.booking_id = b.id
        WHERE 
            b.driver_id = ?
            AND DATE(d.created_on) = ?
        `,
            [driverId, startDate]
        );

        console.log(orders, "query");
        return orders;
    }



    async GetAllDeliverys(driverId: string) {
        const query = await this.dataSource.query(`
            SELECT 
                o.id as order_id,
                o.order_number,
                o.order_date,
                o.pickup_date,
                o.pickup_time,
                o.source_location,
                o.destination_location,
                b.booking_number,
                b.booking_status,
                b.driver_id as driver_id,
                d.id as delivery_id,
                d.delivery_status,
                d.start_time,
                d.end_time,
                d.assigned_time  
            FROM
            \`order\` o 
            LEFT JOIN
                bookings b ON b.order_id = o.id
            left join 
                delivery d on d.booking_id = b.id
            WHERE
               b.driver_id = ?`,
            [driverId]

        );
        return query;

    }



}

