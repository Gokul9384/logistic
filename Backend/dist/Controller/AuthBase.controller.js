"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthBaseController", {
    enumerable: true,
    get: function() {
        return AuthBaseController;
    }
});
let AuthBaseController = class AuthBaseController {
    SendResponse(Type, Message, AddtionalReponse = null) {
        if (AddtionalReponse) {
            return {
                Type,
                Message,
                AddtionalData: AddtionalReponse
            };
        } else {
            return {
                Type,
                Message
            };
        }
    }
    SendResponseData(ResponseData) {
        return ResponseData;
    }
    SendErrorResponse(e) {
        throw new Error(e.message);
    }
};

//# sourceMappingURL=AuthBase.controller.js.map