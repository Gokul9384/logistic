"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "audit_log", {
    enumerable: true,
    get: function() {
        return audit_log;
    }
});
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
let audit_log = class audit_log extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], audit_log.prototype, "performed_action", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], audit_log.prototype, "performed_by", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], audit_log.prototype, "performed_by_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], audit_log.prototype, "performed_module_name", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], audit_log.prototype, "performed_module_header_name", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], audit_log.prototype, "performed_module_id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], audit_log.prototype, "performed_on", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], audit_log.prototype, "performed_type", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], audit_log.prototype, "performed_ipaddress", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'json'
    }),
    _ts_metadata("design:type", Object)
], audit_log.prototype, "performed_parameter", void 0);
audit_log = _ts_decorate([
    (0, _typeorm.Entity)()
], audit_log);

//# sourceMappingURL=audit_log.js.map