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
    get QuoteStatusEnum () {
        return QuoteStatusEnum;
    },
    get RequirementEnum () {
        return RequirementEnum;
    }
});
var QuoteStatusEnum = /*#__PURE__*/ function(QuoteStatusEnum) {
    QuoteStatusEnum["Sent"] = "Sent";
    QuoteStatusEnum["Accepted"] = "Accepted";
    QuoteStatusEnum["Rejected"] = "Rejected";
    return QuoteStatusEnum;
}({});
var RequirementEnum = /*#__PURE__*/ function(RequirementEnum) {
    RequirementEnum["Sent"] = "Sent";
    RequirementEnum["Accepted"] = "Accepted";
    RequirementEnum["Rejected"] = "Rejected";
    return RequirementEnum;
}({});

//# sourceMappingURL=QuoteEnum.js.map