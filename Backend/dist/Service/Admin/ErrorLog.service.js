"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ErrorLogService", {
    enumerable: true,
    get: function() {
        return ErrorLogService;
    }
});
const _common = require("@nestjs/common");
const _error_log = require("../../Database/Table/Admin/error_log");
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ErrorLogService = class ErrorLogService {
    async LazyLoadList(ErrorLogLazyLoadData) {
        const queryBuilder = this._DataSource.manager.createQueryBuilder(_error_log.error_log, 'el');
        queryBuilder.select([
            'el.*',
            'SUM(1) OVER() AS total_count'
        ]).where('el.created_on BETWEEN :start_date AND :end_date', {
            start_date: ErrorLogLazyLoadData.start_date,
            end_date: ErrorLogLazyLoadData.end_date
        });
        queryBuilder.andWhere('el.created_by_id = :user_id', {
            user_id: ErrorLogLazyLoadData.user_id
        });
        queryBuilder.orderBy('el.created_on', 'DESC');
        queryBuilder.limit(ErrorLogLazyLoadData.take).offset(ErrorLogLazyLoadData.skip);
        return await queryBuilder.getRawMany();
    }
    async DeleteByAsOfDate(ErrorLogDeleteData) {
        if (ErrorLogDeleteData.password == "Login@321!!") {
            await _error_log.error_log.delete({
                created_on: (0, _typeorm.LessThanOrEqual)(ErrorLogDeleteData.as_of_date)
            });
        } else {
            throw new Error("Password incorrect");
        }
    }
    constructor(_DataSource){
        this._DataSource = _DataSource;
    }
};
ErrorLogService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm.DataSource === "undefined" ? Object : _typeorm.DataSource
    ])
], ErrorLogService);

//# sourceMappingURL=ErrorLog.service.js.map