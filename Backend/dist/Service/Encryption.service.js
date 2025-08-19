"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EncryptionService", {
    enumerable: true,
    get: function() {
        return EncryptionService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _cryptojs = /*#__PURE__*/ _interop_require_default(require("crypto-js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EncryptionService = class EncryptionService {
    Decrypt(text) {
        const DuplicateKey = _cryptojs.default.enc.Hex.parse(text);
        const OriginalKey = DuplicateKey.toString(_cryptojs.default.enc.Base64);
        return _cryptojs.default.AES.decrypt(OriginalKey, String(this._ConfigService.get("Encryption.SecertKey"))).toString(_cryptojs.default.enc.Utf8);
    }
    Encrypt(text) {
        const OriginalKey = _cryptojs.default.AES.encrypt(text, String(this._ConfigService.get("Encryption.SecertKey"))).toString();
        const DuplicateKey = _cryptojs.default.enc.Base64.parse(OriginalKey);
        return DuplicateKey.toString(_cryptojs.default.enc.Hex);
    }
    constructor(_ConfigService){
        this._ConfigService = _ConfigService;
    }
};
EncryptionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], EncryptionService);

//# sourceMappingURL=Encryption.service.js.map