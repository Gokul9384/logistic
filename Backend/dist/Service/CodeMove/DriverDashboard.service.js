"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DriverDashboardService", {
    enumerable: true,
    get: function() {
        return DriverDashboardService;
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
let DriverDashboardService = class DriverDashboardService {
    async getDriverStats(driverId) {
        const stats = await this.dataSource.query(`
    SELECT
      (SELECT COUNT(id) FROM bookings WHERE driver_id = ? AND booking_status = 'Confirmed') AS assigned_booking,
      (SELECT COUNT(id) FROM delivery WHERE driver_id = ? AND delivery_status != 'Delivered') AS pending_delivery,
      (SELECT COUNT(id) FROM delivery WHERE driver_id = ? AND delivery_status = 'In Transit') AS in_transit,
      (SELECT COUNT(id) FROM delivery WHERE driver_id = ? AND delivery_status = 'Delivered') AS complete
    `, [
            driverId,
            driverId,
            driverId,
            driverId
        ]);
        return stats?.[0] || {
            assigned_booking: 0,
            pending_delivery: 0,
            in_transit: 0,
            complete: 0
        };
    }
    async getDriverOrders(driverId, startDate) {
        const orders = await this.dataSource.query(`
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
        `, [
            driverId,
            startDate
        ]);
        console.log(orders, "query");
        return orders;
    }
    async GetAllDeliverys(driverId) {
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
               b.driver_id = ?`, [
            driverId
        ]);
        return query;
    }
    constructor(dataSource){
        this.dataSource = dataSource;
    }
};
DriverDashboardService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], DriverDashboardService);

//# sourceMappingURL=DriverDashboard.service.js.map