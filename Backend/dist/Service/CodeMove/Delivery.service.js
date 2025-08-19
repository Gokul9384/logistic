"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeliveryService", {
    enumerable: true,
    get: function() {
        return DeliveryService;
    }
});
const _common = require("@nestjs/common");
const _ResponseEnum = require("../../Helper/Enum/ResponseEnum");
const _AuditLogEnum = require("../../Helper/Enum/AuditLogEnum");
const _AuditLogservice = require("../Admin/AuditLog.service");
const _delivery = require("../../Database/Table/CodeMove/delivery");
const _DeliveryStatusEnum = require("../../Helper/Enum/DeliveryStatusEnum");
const _OrderStatusEnum = require("../../Helper/Enum/OrderStatusEnum");
const _typeorm = require("typeorm");
const _BookingStatusEnum = require("../../Helper/Enum/BookingStatusEnum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DeliveryService = class DeliveryService {
    async GetAll() {
        return await _delivery.delivery.find();
    }
    async GetById(DeliveryId) {
        const DeliveryData = await _delivery.delivery.findOne({
            where: {
                id: DeliveryId
            }
        });
        if (!DeliveryData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        return DeliveryData;
    }
    async Insert(DeliveryData, UserId, UserIp) {
        const _DeliveryData = new _delivery.delivery();
        _DeliveryData.order_id = DeliveryData.order_id;
        _DeliveryData.driver_id = DeliveryData.driver_id;
        _DeliveryData.booking_id = DeliveryData.booking_id; // Added missing booking_id
        _DeliveryData.delivery_status = DeliveryData.delivery_status;
        _DeliveryData.assigned_time = DeliveryData.assigned_time;
        // Set timestamps based on status
        if (DeliveryData.delivery_status === _DeliveryStatusEnum.DeliveryStatusEnum.Started) {
            _DeliveryData.start_time = new Date();
        } else if (DeliveryData.delivery_status === _DeliveryStatusEnum.DeliveryStatusEnum.Delivered) {
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
        await _delivery.delivery.insert(_DeliveryData);
        // If delivery status is Delivered, update order and booking status
        if (DeliveryData.delivery_status === _DeliveryStatusEnum.DeliveryStatusEnum.Delivered) {
            await this._DataSource.query(`
                UPDATE \`order\` 
                SET order_status = ? 
                WHERE id = ?
            `, [
                _OrderStatusEnum.OrderStatusEnum.Delivered,
                DeliveryData.order_id
            ]);
            await this._DataSource.query(`
                UPDATE bookings
                SET booking_status = ? 
                WHERE id = ?
            `, [
                _BookingStatusEnum.BookingStatusEnum.Completed,
                DeliveryData.booking_id
            ]);
        }
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _delivery.delivery.name,
            ActionType: _AuditLogEnum.LogActionEnum.Insert,
            PrimaryId: [
                _DeliveryData.id
            ],
            UserIp: UserIp
        });
        return _DeliveryData;
    }
    async Update(Id, DeliveryData, UserId, UserIp) {
        const DeliveryUpdateData = await _delivery.delivery.findOne({
            where: {
                id: Id
            }
        });
        if (!DeliveryUpdateData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        const oldStatus = DeliveryUpdateData.delivery_status;
        DeliveryUpdateData.order_id = DeliveryData.order_id;
        DeliveryUpdateData.driver_id = DeliveryData.driver_id;
        DeliveryUpdateData.booking_id = DeliveryData.booking_id; // Added missing booking_id
        DeliveryUpdateData.delivery_status = DeliveryData.delivery_status;
        DeliveryUpdateData.assigned_time = DeliveryData.assigned_time;
        // Update timestamps based on status change
        if (oldStatus !== DeliveryData.delivery_status) {
            if (DeliveryData.delivery_status === _DeliveryStatusEnum.DeliveryStatusEnum.Started && !DeliveryUpdateData.start_time) {
                DeliveryUpdateData.start_time = new Date();
            } else if (DeliveryData.delivery_status === _DeliveryStatusEnum.DeliveryStatusEnum.InTransit) {
                DeliveryUpdateData.in_transit_time = new Date();
            } else if (DeliveryData.delivery_status === _DeliveryStatusEnum.DeliveryStatusEnum.Delivered) {
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
        await _delivery.delivery.update(Id, DeliveryUpdateData);
        // If status changed to Delivered, update order and booking status
        if (oldStatus !== _DeliveryStatusEnum.DeliveryStatusEnum.Delivered && DeliveryData.delivery_status === _DeliveryStatusEnum.DeliveryStatusEnum.Delivered) {
            await this._DataSource.query(`
                UPDATE \`order\` 
                SET order_status = ? 
                WHERE id = ?
            `, [
                _OrderStatusEnum.OrderStatusEnum.Delivered,
                DeliveryUpdateData.order_id
            ]);
            await this._DataSource.query(`
                UPDATE bookings
                SET booking_status = ? 
                WHERE id = ?
            `, [
                _BookingStatusEnum.BookingStatusEnum.Completed,
                DeliveryUpdateData.booking_id
            ]);
        }
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _delivery.delivery.name,
            ActionType: _AuditLogEnum.LogActionEnum.Update,
            PrimaryId: [
                DeliveryUpdateData.id
            ],
            UserIp: UserIp
        });
        return DeliveryUpdateData;
    }
    async Delete(Id, UserIp) {
        const DeliveryData = await _delivery.delivery.findOne({
            where: {
                id: Id
            }
        });
        if (!DeliveryData) throw new Error(_ResponseEnum.ResponseEnum.NotFound);
        await DeliveryData.remove();
        this._AuditLogService.AuditEmitEvent({
            PerformedType: _delivery.delivery.name,
            ActionType: _AuditLogEnum.LogActionEnum.Delete,
            PrimaryId: [
                DeliveryData.id
            ],
            UserIp: UserIp
        });
        return true;
    }
    constructor(_AuditLogService, _DataSource){
        this._AuditLogService = _AuditLogService;
        this._DataSource = _DataSource;
    }
};
DeliveryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _AuditLogservice.AuditLogService === "undefined" ? Object : _AuditLogservice.AuditLogService,
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], DeliveryService);

//# sourceMappingURL=Delivery.service.js.map