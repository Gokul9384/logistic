/**
 * @author VarunAnand
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BaseTable", {
    enumerable: true,
    get: function() {
        return BaseTable;
    }
});
const _AuditLogdecorators = require("../../Helper/AuditLog.decorators");
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
let BaseTable = class BaseTable extends _typeorm.BaseEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)(),
    (0, _typeorm.Index)(),
    (0, _typeorm.Generated)('uuid'),
    _ts_metadata("design:type", String)
], BaseTable.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: 1
    }),
    _ts_metadata("design:type", Boolean)
], BaseTable.prototype, "status", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogRemoveColumn)(),
    (0, _typeorm.Column)({
        select: true
    }),
    _ts_metadata("design:type", String)
], BaseTable.prototype, "created_by_id", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogRemoveColumn)(),
    (0, _typeorm.Column)({
        type: 'datetime',
        select: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BaseTable.prototype, "created_on", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogRemoveColumn)(),
    (0, _typeorm.Column)({
        nullable: true,
        select: false
    }),
    _ts_metadata("design:type", String)
], BaseTable.prototype, "updated_by_id", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogRemoveColumn)(),
    (0, _typeorm.Column)({
        type: 'datetime',
        nullable: true,
        select: false
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BaseTable.prototype, "updated_on", void 0);

//# sourceMappingURL=BaseTable.js.map