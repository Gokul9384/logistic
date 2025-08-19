"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExceptionHelper", {
    enumerable: true,
    get: function() {
        return ExceptionHelper;
    }
});
const _common = require("@nestjs/common");
const _error_log = require("../Database/Table/Admin/error_log");
const _ResponseEnum = require("./Enum/ResponseEnum");
const _Commonhelper = require("./Common.helper");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ExceptionHelper = class ExceptionHelper {
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let MessageText = "";
        if (exception.code == "ER_DUP_ENTRY") {
            MessageText = "Duplicate record";
        } else if (exception.message?.includes("ER_DUP_ENTRY")) {
            MessageText = "Duplicate record";
        } else if (exception.code == "ER_ROW_IS_REFERENCED") {
            MessageText = "Cannot delete or update used record";
        } else if (exception.message?.includes("ER_ROW_IS_REFERENCED")) {
            MessageText = "Cannot delete or update used record";
        } else if (exception.code == "ER_NO_REFERENCED_ROW_2") {
            var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
            MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
        } else if (exception.message?.includes("ER_NO_REFERENCED_ROW_2")) {
            var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
            MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
        } else {
            if (Array.isArray(exception.response?.message)) {
                MessageText = exception.response.message.join('\n');
            } else if (exception.response?.message) {
                MessageText = exception.response.message;
            } else if (exception.message) {
                MessageText = exception.message;
            } else {
                MessageText = exception.response;
            }
        }
        await _error_log.error_log.insert({
            url: response.req.url,
            ipaddress: response.req.ip ?? "null",
            message: MessageText,
            created_by_id: response.req?.user?.["user_id"] ?? _Commonhelper.EmptyUuid,
            created_by_name: response.req?.user?.["email"] ?? "No User",
            created_on: new Date()
        });
        response.json({
            Type: _ResponseEnum.ResponseEnum.Error,
            Message: MessageText
        }).status(500);
    }
};
ExceptionHelper = _ts_decorate([
    (0, _common.Catch)()
], ExceptionHelper);

//# sourceMappingURL=Exception.helper.js.map