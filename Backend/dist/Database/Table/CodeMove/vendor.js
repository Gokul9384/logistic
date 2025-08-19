"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "vendor", {
    enumerable: true,
    get: function() {
        return vendor;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
const _user = require("../Admin/user");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let vendor = class vendor extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_user.user, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "user_id"
    }),
    _ts_metadata("design:type", typeof _user.user === "undefined" ? Object : _user.user)
], vendor.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], vendor.prototype, "user_id", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], vendor.prototype, "company_name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], vendor.prototype, "address", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], vendor.prototype, "mobile", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        unique: true
    }),
    _ts_metadata("design:type", String)
], vendor.prototype, "email", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], vendor.prototype, "gst_number", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], vendor.prototype, "pan_number", void 0);
vendor = _ts_decorate([
    (0, _typeorm.Entity)()
], vendor);

//# sourceMappingURL=vendor.js.map