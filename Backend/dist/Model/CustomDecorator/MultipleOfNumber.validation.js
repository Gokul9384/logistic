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
    get IsMultipleOfNumber () {
        return IsMultipleOfNumber;
    },
    get MultipleOfNumberThenValidation () {
        return MultipleOfNumberThenValidation;
    }
});
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function IsMultipleOfNumber(Field, validationOptions) {
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
            validator: MultipleOfNumberThenValidation
        });
    };
}
let MultipleOfNumberThenValidation = class MultipleOfNumberThenValidation {
    async validate(numb, args) {
        if (Number(args.constraints[0].Field)) {
            if (Number(numb)) {
                return Number(numb) % Number(args.constraints[0].Field) == 0;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
};
MultipleOfNumberThenValidation = _ts_decorate([
    (0, _classvalidator.ValidatorConstraint)({
        async: true
    })
], MultipleOfNumberThenValidation);

//# sourceMappingURL=MultipleOfNumber.validation.js.map