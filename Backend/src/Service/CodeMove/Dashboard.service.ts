// src/services/DashboardService.ts
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class DashboardService {
    constructor(
        private readonly _DataSource: DataSource
    ) { }

    async DashboardStats() {
        const order_count = await this._DataSource.query(
            `SELECT COUNT(id) AS order_count FROM \`order\` o;`
        );

        const quote_count = await this._DataSource.query(
            `SELECT COUNT(id) AS quote_count FROM quote q where q.quote_status = 'Sent'`
        );

        const active_booking = await this._DataSource.query(
            `SELECT COUNT(id) AS active_booking 
             FROM bookings b 
             WHERE b.booking_status = 'Confirmed';`
        );

        const pending_delivery = await this._DataSource.query(
            `SELECT COUNT(id) AS pending_delivery 
             FROM delivery d 
             WHERE d.delivery_status != 'Delivered';`
        );

        return {
            order_count: order_count[0]?.order_count || 0,
            quote_count: quote_count[0]?.quote_count || 0,
            active_booking: active_booking[0]?.active_booking || 0,
            pending_delivery: pending_delivery[0]?.pending_delivery || 0
        };
    }

    async DashboardOrderList(startDate?: string, endDate?: string) {
        let query = `
        SELECT 
            o.id AS order_id,
            o.order_number,
            o.order_date,
            o.source_location,
            o.destination_location,
            o.order_status
        FROM \`order\` o
    `;
        const params: any[] = [];

        if (startDate && endDate) {
            query += ` WHERE o.order_date BETWEEN ? AND ? `;
            params.push(startDate, endDate);
        }

        query += ` ORDER BY o.order_date DESC;`;

        return await this._DataSource.query(query, params);
    }

}
