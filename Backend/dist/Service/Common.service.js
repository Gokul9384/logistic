"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommonService", {
    enumerable: true,
    get: function() {
        return CommonService;
    }
});
const _common = require("@nestjs/common");
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _Cacheservice = require("./Cache.service");
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
let CommonService = class CommonService {
    async TransactionRunningNumber(ModuleType) {
        let ModuleNumberData = {};
        let LastNumber = "1";
    // if (ModuleType == ModuleTypeEnum.Quotation) {
    //   ModuleNumberData = await getManager().query(`SELECT qo_number AS module_number FROM quotation ORDER BY DATE(created_on) DESC, id DESC, CAST(REGEXP_REPLACE(qo_number,'[^0-9]','0') as unsigned) DESC LIMIT 1`);
    //   if (ModuleNumberData.length > 0) {
    //     return this.AutoGenerateNumber(ModuleNumberData[0].module_number)
    //   }
    //   else {
    //     return "1";
    //   }
    // }
    }
    async ClearAllCache() {
        await this._CacheService.Flush();
    }
    RoundDecimal(value, scale = 2) {
        return Number(value.toFixed(scale));
    }
    GetBase64(FilePath) {
        var bitmap = _fs.default.readFileSync(_path.default.resolve(FilePath), 'base64');
        return bitmap;
    }
    AutoGenerateNumber(value) {
        let last_charater = value.charAt(value.length - 1);
        let parsedvalue = parseInt(last_charater);
        if (parsedvalue == null || parsedvalue == undefined || isNaN(parsedvalue)) {
            value = value + "0";
        }
        return this.InvoiceAutoGenerateNext(value);
    }
    InvoiceAutoGenerateNext(invoiceNumber) {
        const array = invoiceNumber.split(/[_/:\/\W/;\\]+/);
        const lastSegment = array.pop() || '';
        const priorSegment = invoiceNumber.substring(0, invoiceNumber.lastIndexOf(lastSegment));
        const nextNumber = this.alphaNumericIncrementer(lastSegment);
        return priorSegment + nextNumber;
    }
    alphaNumericIncrementer(str) {
        if (str && str.length > 0) {
            let invNum = str.replace(/([^a-z0-9]+)/gi, '');
            invNum = invNum.toUpperCase();
            let index = invNum.length - 1;
            while(index >= 0){
                if (invNum.substring(index, index + 1) === '9') {
                    if (Number(invNum.substring(0, index)) > 0 || invNum.substring(0, index) == '') {
                        invNum = (invNum.substring(0, index) ? invNum.substring(0, index) : '1') + '0' + invNum.substring(index + 1);
                    } else {
                        invNum = (invNum.substring(0, index) ? invNum.substring(0, index) + (!(Number(invNum.substring(index - 1, index)) >= 0) ? '1' : '') : '1') + '0' + invNum.substring(index + 1);
                    }
                } else if (invNum.substring(index, index + 1) === 'Z') {
                    invNum = invNum.substring(0, index) + 'A' + invNum.substring(index + 1);
                } else {
                    const char = String.fromCharCode(invNum.charCodeAt(index) + 1);
                    if (Number(char) >= 0) {
                        invNum = invNum.substring(0, index) + char + invNum.substring(index + 1);
                    }
                    index = 0;
                }
                index--;
            }
            return invNum;
        } else {
            throw new Error('str cannot be empty');
        }
    }
    constructor(_CacheService){
        this._CacheService = _CacheService;
    }
};
CommonService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Cacheservice.CacheService === "undefined" ? Object : _Cacheservice.CacheService
    ])
], CommonService);

//# sourceMappingURL=Common.service.js.map