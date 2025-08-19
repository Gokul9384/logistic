import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class CustomerDashboardService {
    constructor(private dataSource: DataSource) { }

    async getStats(customerId: string) {
        const customerStats = await this.dataSource.query(
            `   
            SELECT 
    SUM(CASE WHEN r.requirement_status = 'Accepted' THEN 1 ELSE 0 END) AS accepted_requirements,
    SUM(CASE WHEN q.quote_status = 'Sent' THEN 1 ELSE 0 END) AS pending_quotes,
    SUM(CASE WHEN b.booking_status = 'Confirmed' THEN 1 ELSE 0 END) AS active_bookings,
    SUM(CASE WHEN d.delivery_status = 'Assigned' THEN 1 ELSE 0 END) AS pending_deliveries
FROM customer c
LEFT JOIN \`order\` o ON o.customer_id = c.id
LEFT JOIN requirement r ON r.order_id = o.id
LEFT JOIN quote q ON q.requirement_id = r.id
LEFT JOIN bookings b ON b.quote_id = q.id
LEFT JOIN delivery d ON d.order_id = o.id
            WHERE c.id = ?
            `,
            [customerId]
        );

        return customerStats?.[0] || {
            accepted_requirements: 0,
            pending_quotes: 0,
            active_bookings: 0,
            pending_deliveries: 0
        };
    }

    async getRecentOrders(customerId: string, startDate?: string, endDate?: string) {
        let query = `
            SELECT 
                o.id, 
                o.order_number, 
                o.material, 
                o.source_location, 
                o.destination_location, 
                o.expected_date, 
                o.order_status, 
                o.created_on
            FROM \`order\` o
            WHERE o.customer_id = ?
        `;

        const params: any[] = [customerId];

        if (startDate && endDate) {
            query += ` AND DATE(o.created_on) BETWEEN ? AND ? `;
            params.push(startDate, endDate);
        }

        query += ` ORDER BY o.created_on DESC LIMIT 10`;

        return this.dataSource.query(query, params);
    }


    async getDeliveryTracking(customerId: string, startDate?: string) {
        let query = `
        SELECT 
            o.order_number,
            o.order_date,
            o.source_location,
            o.destination_location,
            b.booking_number,
            d.delivery_status,
            d.start_time,
            d.end_time,
            d.assigned_time,
            d.in_transit_time,
            drv.name AS driver_name,
            drv.mobile AS driver_contact
        FROM \`order\` o
        LEFT JOIN delivery d ON d.order_id = o.id
        LEFT JOIN bookings b ON b.id = d.booking_id
        LEFT JOIN driver drv ON drv.id = b.driver_id
        WHERE o.customer_id = ? 
          AND d.delivery_status IN ('Assigned', 'Started', 'In Transit', 'Delivered')
    `;

        const params: any[] = [customerId];

        if (startDate) {
            query += ` AND DATE(o.order_date) = ?`;
            params.push(startDate);
        }

        query += ` ORDER BY o.order_date DESC`;

        return this.dataSource.query(query, params);
    }



}
