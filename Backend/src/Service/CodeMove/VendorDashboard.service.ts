import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class VendorDashboardService {
    constructor(private dataSource: DataSource) { }

    async getStats(vendorId: string) {
        const vendorStats = await this.dataSource.query(
            `
            SELECT 
                SUM(CASE WHEN r.requirement_status = 'Accepted' THEN 1 ELSE 0 END) AS accepted_requirements,
                SUM(CASE WHEN q.quote_status = 'Sent' THEN 1 ELSE 0 END) AS pending_quotes,
                SUM(CASE WHEN b.booking_status = 'Confirmed' THEN 1 ELSE 0 END) AS active_bookings,
                SUM(CASE WHEN d.delivery_status = 'Assigned' THEN 1 ELSE 0 END) AS pending_deliveries
            FROM requirement r
            LEFT JOIN quote q ON q.requirement_id = r.id
            LEFT JOIN bookings b ON b.quote_id = q.id
            LEFT JOIN delivery d ON d.order_id = r.order_id
            WHERE r.vendor_id = ?
            `,
            [vendorId]
        );

        return vendorStats?.[0] || {
            accepted_requirements: 0,
            pending_quotes: 0,
            active_bookings: 0,
            pending_deliveries: 0
        };
    }

    async getRecentRequirements(vendorId: string, startDate?: string, endDate?: string) {
        let query = `
            SELECT 
                r.id, 
                r.requirement_number, 
                r.requirement_status, 
                r.created_on,
                o.order_number
            FROM requirement r
            JOIN \`order\` o ON o.id = r.order_id
            WHERE r.vendor_id = ?
        `;

        const params: any[] = [vendorId];

        if (startDate && endDate) {
            query += ` AND DATE(r.created_on) BETWEEN ? AND ? `;
            params.push(startDate, endDate);
        }

        query += ` ORDER BY r.created_on DESC LIMIT 10`;

        return this.dataSource.query(query, params);
    }
}
