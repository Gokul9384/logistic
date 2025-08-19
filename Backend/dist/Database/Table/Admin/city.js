"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "city", {
    enumerable: true,
    get: function() {
        return city;
    }
});
const _typeorm = require("typeorm");
const _BaseTable = require("../BaseTable");
const _state = require("./state");
const _AuditLogdecorators = require("../../../Helper/AuditLog.decorators");
const _country = require("./country");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let city = class city extends _BaseTable.BaseTable {
};
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_state.state, {
        onDelete: "RESTRICT"
    }),
    (0, _typeorm.JoinColumn)({
        name: "state_id"
    }),
    _ts_metadata("design:type", typeof _state.state === "undefined" ? Object : _state.state)
], city.prototype, "state", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], city.prototype, "state_id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_country.country, {
        onDelete: "RESTRICT"
    }),
    (0, _typeorm.JoinColumn)({
        name: "country_id"
    }),
    _ts_metadata("design:type", typeof _country.country === "undefined" ? Object : _country.country)
], city.prototype, "country", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Index)(),
    _ts_metadata("design:type", String)
], city.prototype, "country_id", void 0);
_ts_decorate([
    (0, _AuditLogdecorators.AuditLogIdentity)(),
    (0, _typeorm.Column)({
        unique: true
    }),
    _ts_metadata("design:type", String)
], city.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        unique: true
    }),
    _ts_metadata("design:type", String)
], city.prototype, "code", void 0);
city = _ts_decorate([
    (0, _typeorm.Entity)()
], city);

//# sourceMappingURL=city.js.map