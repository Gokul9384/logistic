// src/services/DashboardService.ts
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardService", {
    enumerable: true,
    get: function() {
        return DashboardService;
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
let DashboardService = class DashboardService {
    async DashboardStats() {
        const order_count = await this._DataSource.query(`SELECT COUNT(id) AS order_count FROM \`order\` o;`);
        const quote_count = await this._DataSource.query(`SELECT COUNT(id) AS quote_count FROM quote q where q.quote_status = 'Sent'`);
        const active_booking = await this._DataSource.query(`SELECT COUNT(id) AS active_booking 
             FROM bookings b 
             WHERE b.booking_status = 'Confirmed';`);
        const pending_delivery = await this._DataSource.query(`SELECT COUNT(id) AS pending_delivery 
             FROM delivery d 
             WHERE d.delivery_status != 'Delivered';`);
        return {
            order_count: order_count[0]?.order_count || 0,
            quote_count: quote_count[0]?.quote_count || 0,
            active_booking: active_booking[0]?.active_booking || 0,
            pending_delivery: pending_delivery[0]?.pending_delivery || 0
        };
    }
    async DashboardOrderList(startDate, endDate) {
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
        const params = [];
        if (startDate && endDate) {
            query += ` WHERE o.order_date BETWEEN ? AND ? `;
            params.push(startDate, endDate);
        }
        query += ` ORDER BY o.order_date DESC;`;
        return await this._DataSource.query(query, params);
    }
    constructor(_DataSource){
        this._DataSource = _DataSource;
    }
};
DashboardService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], DashboardService);

//# sourceMappingURL=Dashboard.service.js.map