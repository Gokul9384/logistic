"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VendorDashboardService", {
    enumerable: true,
    get: function() {
        return VendorDashboardService;
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
let VendorDashboardService = class VendorDashboardService {
    async getStats(vendorId) {
        const vendorStats = await this.dataSource.query(`
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
            `, [
            vendorId
        ]);
        return vendorStats?.[0] || {
            accepted_requirements: 0,
            pending_quotes: 0,
            active_bookings: 0,
            pending_deliveries: 0
        };
    }
    async getRecentRequirements(vendorId, startDate, endDate) {
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
        const params = [
            vendorId
        ];
        if (startDate && endDate) {
            query += ` AND DATE(r.created_on) BETWEEN ? AND ? `;
            params.push(startDate, endDate);
        }
        query += ` ORDER BY r.created_on DESC LIMIT 10`;
        return this.dataSource.query(query, params);
    }
    constructor(dataSource){
        this.dataSource = dataSource;
    }
};
VendorDashboardService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], VendorDashboardService);

//# sourceMappingURL=VendorDashboard.service.js.map