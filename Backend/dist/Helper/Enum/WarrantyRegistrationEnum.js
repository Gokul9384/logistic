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
    get CustomerTitle () {
        return CustomerTitle;
    },
    get WarrantyRegistrationEnum () {
        return WarrantyRegistrationEnum;
    },
    get WarrantyStatusEnum () {
        return WarrantyStatusEnum;
    }
});
var WarrantyRegistrationEnum = /*#__PURE__*/ function(WarrantyRegistrationEnum) {
    WarrantyRegistrationEnum["HomeOwner"] = "Home Owner";
    WarrantyRegistrationEnum["Engineer"] = "Engineer";
    return WarrantyRegistrationEnum;
}({});
var WarrantyStatusEnum = /*#__PURE__*/ function(WarrantyStatusEnum) {
    WarrantyStatusEnum["Active"] = "Active";
    WarrantyStatusEnum["cancelled"] = "cancelled";
    WarrantyStatusEnum["Expried"] = "Expried";
    return WarrantyStatusEnum;
}({});
var CustomerTitle = /*#__PURE__*/ function(CustomerTitle) {
    CustomerTitle["Mr"] = "Mr";
    CustomerTitle["Mrs"] = "Mrs";
    CustomerTitle["Ms"] = "Ms";
    CustomerTitle["Miss"] = "Miss";
    CustomerTitle["Doctor"] = "Doctor";
    CustomerTitle["Sir"] = "Sir";
    CustomerTitle["Professor"] = "Professor";
    CustomerTitle["Other"] = "Other";
    return CustomerTitle;
}({});

//# sourceMappingURL=WarrantyRegistrationEnum.js.map