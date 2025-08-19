"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoggingInterceptor", {
    enumerable: true,
    get: function() {
        return LoggingInterceptor;
    }
});
const _common = require("@nestjs/common");
const _operators = require("rxjs/operators");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LoggingInterceptor = class LoggingInterceptor {
    intercept(context, next) {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        this.logger.log(request.url + " - Called");
        return next.handle().pipe((0, _operators.tap)((data)=>{
            this.logger.log(request.url + " - finished - " + `${Date.now() - now}ms`);
        }));
    }
    constructor(){
        this.logger = new _common.Logger(LoggingInterceptor.name);
    }
};
LoggingInterceptor = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], LoggingInterceptor);

//# sourceMappingURL=Logging.interceptor.js.map