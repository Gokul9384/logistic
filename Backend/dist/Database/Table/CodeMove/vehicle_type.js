"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "vehicle_type", {
    enumerable: true,
    get: function() {
        return vehicle_type;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let vehicle_type = class vehicle_type extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)({
        unique: true
    }),
    _ts_metadata("design:type", String)
], vehicle_type.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], vehicle_type.prototype, "description", void 0);
vehicle_type = _ts_decorate([
    (0, _typeorm.Entity)()
], vehicle_type);

//# sourceMappingURL=vehicle_type.js.map