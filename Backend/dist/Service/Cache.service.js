"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CacheService", {
    enumerable: true,
    get: function() {
        return CacheService;
    }
});
const _common = require("@nestjs/common");
const _ioredis = require("ioredis");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let CacheService = class CacheService {
    async Get(Key) {
        if (process.env.REDIS_ENABLE == "false") {
            return [];
        }
        const Keys = await this.redisClient.keys(this.ProjectName + Key);
        if (Keys.length > 0) {
            const ResultData = await this.redisClient.mget(...Keys);
            return ResultData.map((data)=>JSON.parse(data));
        } else {
            return [];
        }
    }
    async Store(Key, DataList) {
        if (process.env.REDIS_ENABLE == "false") {
            return;
        }
        for (const Data of DataList){
            if (Data.Type == "E") {
                return;
            }
            await this.redisClient.set(`${this.ProjectName + Key}:${Data.id}`, JSON.stringify(Data));
        }
    }
    async SetExpiration(Key, ttl) {
        if (process.env.REDIS_ENABLE == "false") {
            return;
        }
        // Set expiration for the given key
        await this.redisClient.expire(`${this.ProjectName + Key}`, ttl);
    }
    async Remove(Key, DataList) {
        if (process.env.REDIS_ENABLE == "false") {
            return;
        }
        if (DataList.Type == "E") {
            return;
        }
        await this.redisClient.del(`${this.ProjectName + Key}`);
    }
    async Flush() {
        const Keys = await this.redisClient.keys(this.ProjectName + '*');
        console.log(Keys);
        await this.redisClient.del(Keys);
    }
    constructor(redisClient){
        this.redisClient = redisClient;
        this.ProjectName = "eca_boilers:";
    }
};
CacheService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)("REDIS_CLIENT")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ioredis.Redis === "undefined" ? Object : _ioredis.Redis
    ])
], CacheService);

//# sourceMappingURL=Cache.service.js.map