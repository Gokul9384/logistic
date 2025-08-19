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
    get AuditLogChangeTableReference () {
        return AuditLogChangeTableReference;
    },
    get AuditLogChangeTableReferenceName () {
        return AuditLogChangeTableReferenceName;
    },
    get AuditLogIdentity () {
        return AuditLogIdentity;
    },
    get AuditLogIdentityName () {
        return AuditLogIdentityName;
    },
    get AuditLogRemoveColumn () {
        return AuditLogRemoveColumn;
    },
    get AuditLogRemoveColumnsName () {
        return AuditLogRemoveColumnsName;
    },
    get AuditLogRemoveColumnsNameByTable () {
        return AuditLogRemoveColumnsNameByTable;
    },
    get AuditLogSameTableReference () {
        return AuditLogSameTableReference;
    },
    get AuditLogSameTableReferenceName () {
        return AuditLogSameTableReferenceName;
    },
    get AuditLogTableRemoveColumns () {
        return AuditLogTableRemoveColumns;
    }
});
const AuditLogRemoveColumnsName = [];
const AuditLogRemoveColumnsNameByTable = {};
const AuditLogSameTableReferenceName = {};
const AuditLogChangeTableReferenceName = {};
const AuditLogIdentityName = {};
const AuditLogRemoveColumn = ()=>{
    return function(target, propertyKey) {
        AuditLogRemoveColumnsName.push(propertyKey);
    };
};
const AuditLogTableRemoveColumns = ()=>{
    return function(target, propertyKey) {
        if (!AuditLogRemoveColumnsNameByTable[target.constructor.name]) {
            AuditLogRemoveColumnsNameByTable[target.constructor.name] = [];
        }
        AuditLogRemoveColumnsNameByTable[target.constructor.name].push(propertyKey);
    };
};
function AuditLogSameTableReference(ReferenceTableName) {
    return function(target, propertyKey) {
        if (!AuditLogSameTableReferenceName[target.constructor.name]) {
            AuditLogSameTableReferenceName[target.constructor.name] = [
                {
                    table: ReferenceTableName
                }
            ];
            AuditLogSameTableReferenceName[target.constructor.name][1] = [];
        }
        AuditLogSameTableReferenceName[target.constructor.name][1].push(propertyKey);
    };
}
function AuditLogIdentity(ReferenceTableName = "main.", ISPorperty = true) {
    return function(target, propertyKey) {
        if (!AuditLogIdentityName[target.constructor.name]) {
            AuditLogIdentityName[target.constructor.name] = "";
        }
        AuditLogIdentityName[target.constructor.name] = ReferenceTableName + (ISPorperty ? propertyKey : '');
    };
}
function AuditLogChangeTableReference(ReferenceTableName) {
    return function(target, propertyKey) {
        if (!AuditLogChangeTableReferenceName[target.constructor.name]) {
            AuditLogChangeTableReferenceName[target.constructor.name] = [
                {
                    table: ReferenceTableName
                }
            ];
            AuditLogChangeTableReferenceName[target.constructor.name][1] = [];
        }
        AuditLogChangeTableReferenceName[target.constructor.name][1].push(propertyKey);
    };
}

//# sourceMappingURL=AuditLog.decorators.js.map