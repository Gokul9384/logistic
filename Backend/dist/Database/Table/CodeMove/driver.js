"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "driver", {
    enumerable: true,
    get: function() {
        return driver;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
const _user = require("../Admin/user");
const _vendor = require("./vendor");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let driver = class driver extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_user.user, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "user_id"
    }),
    _ts_metadata("design:type", typeof _user.user === "undefined" ? Object : _user.user)
], driver.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], driver.prototype, "user_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_vendor.vendor, {
        onDelete: "CASCADE"
    }),
    (0, _typeorm.JoinColumn)({
        name: "vendor_id"
    }),
    _ts_metadata("design:type", typeof _vendor.vendor === "undefined" ? Object : _vendor.vendor)
], driver.prototype, "vendor", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], driver.prototype, "vendor_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], driver.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        unique: true
    }),
    _ts_metadata("design:type", String)
], driver.prototype, "email", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], driver.prototype, "mobile", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], driver.prototype, "license_number", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], driver.prototype, "vehicle_number", void 0);
driver = _ts_decorate([
    (0, _typeorm.Entity)()
], driver);

//# sourceMappingURL=driver.js.map