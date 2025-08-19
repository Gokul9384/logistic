"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "user_role", {
    enumerable: true,
    get: function() {
        return user_role;
    }
});
const _BaseTable = require("../BaseTable");
const _typeorm = require("typeorm");
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
let user_role = class user_role extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)({
        unique: true
    }),
    _ts_metadata("design:type", String)
], user_role.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        unique: true
    }),
    _ts_metadata("design:type", String)
], user_role.prototype, "code", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], user_role.prototype, "landing_page", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: "json",
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], user_role.prototype, "permissions", void 0);
user_role = _ts_decorate([
    (0, _typeorm.Entity)()
], user_role);

//# sourceMappingURL=user_role.js.map