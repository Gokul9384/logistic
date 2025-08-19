"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get EventNameEnum () {
        return EventNameEnum;
    },
    get LogActionEnum () {
        return LogActionEnum;
    }
});
var LogActionEnum = /*#__PURE__*/ function(LogActionEnum) {
    LogActionEnum["Insert"] = "Insert";
    LogActionEnum["SignUp"] = "SignUp";
    LogActionEnum["Update"] = "Update";
    LogActionEnum["Delete"] = "Delete";
    LogActionEnum["Default"] = "Default";
    LogActionEnum["Active"] = "Active";
    LogActionEnum["Suspend"] = "Suspend";
    LogActionEnum["Void"] = "Void";
    LogActionEnum["Duplicate"] = "Duplicate";
    LogActionEnum["Approve"] = "Approve";
    LogActionEnum["UnApprove"] = "UnApprove";
    LogActionEnum["ResetPassword"] = "ResetPassword";
    return LogActionEnum;
}({});
var EventNameEnum = /*#__PURE__*/ function(EventNameEnum) {
    EventNameEnum["AuditLog"] = "AuditLog";
    return EventNameEnum;
}({});

//# sourceMappingURL=AuditLogEnum.js.map