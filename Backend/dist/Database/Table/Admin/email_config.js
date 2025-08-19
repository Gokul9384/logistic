"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "email_config", {
    enumerable: true,
    get: function() {
        return email_config;
    }
});
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let email_config = class email_config extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], email_config.prototype, "email_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: "mediumtext"
    }),
    _ts_metadata("design:type", String)
], email_config.prototype, "password", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        default: "ECABoilers"
    }),
    _ts_metadata("design:type", String)
], email_config.prototype, "mailer_name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        default: "smtp.gmail.com"
    }),
    _ts_metadata("design:type", String)
], email_config.prototype, "host", void 0);
email_config = _ts_decorate([
    (0, _typeorm.Entity)()
], email_config);

//# sourceMappingURL=email_config.js.map