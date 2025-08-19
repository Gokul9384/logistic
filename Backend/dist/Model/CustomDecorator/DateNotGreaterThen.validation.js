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
    get DateNotGreaterThenValidation () {
        return DateNotGreaterThenValidation;
    },
    get IsDateNotGreaterThen () {
        return IsDateNotGreaterThen;
    }
});
const _classvalidator = require("class-validator");
const _Commonhelper = require("../../Helper/Common.helper");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function IsDateNotGreaterThen(Field, validationOptions) {
    return function(object, propertyName) {
        (0, _classvalidator.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [
                {
                    Field: Field
                }
            ],
            validator: DateNotGreaterThenValidation
        });
    };
}
let DateNotGreaterThenValidation = class DateNotGreaterThenValidation {
    async validate(start_date, args) {
        if (args.object[args.constraints[0].Field]) {
            return (0, _Commonhelper.DateComparison)(new Date(start_date), new Date(args.object[args.constraints[0].Field]));
        } else {
            return true;
        }
    }
};
DateNotGreaterThenValidation = _ts_decorate([
    (0, _classvalidator.ValidatorConstraint)({
        async: true
    })
], DateNotGreaterThenValidation);

//# sourceMappingURL=DateNotGreaterThen.validation.js.map