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
    get GetPermissionRights () {
        return GetPermissionRights;
    },
    get PermissionActionEnum () {
        return PermissionActionEnum;
    },
    get PermissionModuleEnum () {
        return PermissionModuleEnum;
    },
    get PermissionPageEnum () {
        return PermissionPageEnum;
    }
});
var PermissionModuleEnum = /*#__PURE__*/ function(PermissionModuleEnum) {
    return PermissionModuleEnum;
}({});
var PermissionActionEnum = /*#__PURE__*/ function(PermissionActionEnum) {
    PermissionActionEnum["View"] = "View";
    PermissionActionEnum["New"] = "New";
    PermissionActionEnum["Edit"] = "Edit";
    PermissionActionEnum["Delete"] = "Delete";
    PermissionActionEnum["Suspend"] = "Suspend";
    PermissionActionEnum["Active"] = "Active";
    return PermissionActionEnum;
}({});
var PermissionPageEnum = /*#__PURE__*/ function(PermissionPageEnum) {
    PermissionPageEnum["AdminDashboard"] = "AdminDashboard";
    PermissionPageEnum["UserList"] = "UserList";
    PermissionPageEnum["UserRoleList"] = "UserRoleList";
    return PermissionPageEnum;
}({});
const GetPermissionRights = [];

//# sourceMappingURL=PermissionEnum.js.map