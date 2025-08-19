/**
 * @author VarunAnand
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "error_log", {
    enumerable: true,
    get: function() {
        return error_log;
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
let error_log = class error_log extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], error_log.prototype, "url", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], error_log.prototype, "ipaddress", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: "mediumtext"
    }),
    _ts_metadata("design:type", String)
], error_log.prototype, "message", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], error_log.prototype, "created_by_name", void 0);
error_log = _ts_decorate([
    (0, _typeorm.Entity)()
], error_log);

//# sourceMappingURL=error_log.js.map