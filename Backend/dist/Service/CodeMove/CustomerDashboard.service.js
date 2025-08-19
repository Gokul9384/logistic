"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomerDashboardService", {
    enumerable: true,
    get: function() {
        return CustomerDashboardService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CustomerDashboardService = class CustomerDashboardService {
    async getStats(customerId) {
        const customerStats = await this.dataSource.query(`   
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
            `, [
            customerId
        ]);
        return customerStats?.[0] || {
            accepted_requirements: 0,
            pending_quotes: 0,
            active_bookings: 0,
            pending_deliveries: 0
        };
    }
    async getRecentOrders(customerId, startDate, endDate) {
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
        const params = [
            customerId
        ];
        if (startDate && endDate) {
            query += ` AND DATE(o.created_on) BETWEEN ? AND ? `;
            params.push(startDate, endDate);
        }
        query += ` ORDER BY o.created_on DESC LIMIT 10`;
        return this.dataSource.query(query, params);
    }
    async getDeliveryTracking(customerId, startDate) {
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
        const params = [
            customerId
        ];
        if (startDate) {
            query += ` AND DATE(o.order_date) = ?`;
            params.push(startDate);
        }
        query += ` ORDER BY o.order_date DESC`;
        return this.dataSource.query(query, params);
    }
    constructor(dataSource){
        this.dataSource = dataSource;
    }
};
CustomerDashboardService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], CustomerDashboardService);

//# sourceMappingURL=CustomerDashboard.service.js.map