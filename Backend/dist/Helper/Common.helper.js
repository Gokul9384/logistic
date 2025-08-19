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
    get CurrentUser () {
        return CurrentUser;
    },
    get DBDateTimeEnd () {
        return DBDateTimeEnd;
    },
    get DBDateTimeStart () {
        return DBDateTimeStart;
    },
    get DateComparison () {
        return DateComparison;
    },
    get DateFormatForDB () {
        return DateFormatForDB;
    },
    get DateFormatForReport () {
        return DateFormatForReport;
    },
    get EmptyUuid () {
        return EmptyUuid;
    },
    get RandomValue () {
        return RandomValue;
    },
    get SetLastDateOfMonth () {
        return SetLastDateOfMonth;
    },
    get UserIp () {
        return UserIp;
    }
});
const _common = require("@nestjs/common");
const _datefns = require("date-fns");
require("reflect-metadata");
const CurrentUser = (0, _common.createParamDecorator)((data, req)=>{
    if (req.args[0].user.user_id) {
        return req.args[0].user.user_id;
    } else {
        return 0;
    }
});
const UserIp = (0, _common.createParamDecorator)((data, ctx)=>{
    const request = ctx.switchToHttp().getRequest();
    const ip = request.headers['ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    return ip || "127.0.0.1";
});
const RandomValue = (min, max)=>{
    return Math.floor(Math.random() * (max - min) + min);
};
const DateFormatForDB = (SourceDate)=>{
    if (SourceDate) {
        SourceDate = new Date(SourceDate);
        let FormattedDate = "";
        if (SourceDate?.getDate()) {
            FormattedDate = (0, _datefns.format)(SourceDate, "yyyy-MM-dd");
        }
        return FormattedDate;
    } else {
        return null;
    }
};
const DBDateTimeStart = (SourceDate)=>{
    if (SourceDate) {
        let FormattedDate;
        if (SourceDate?.getDate()) {
            SourceDate.setHours(0);
            SourceDate.setMinutes(0);
            SourceDate.setSeconds(0);
            SourceDate.setMilliseconds(0);
            FormattedDate = (0, _datefns.format)(SourceDate, "yyyy-MM-dd HH:mm");
        }
        return FormattedDate;
    } else {
        return null;
    }
};
const DBDateTimeEnd = (SourceDate)=>{
    if (SourceDate) {
        let FormattedDate;
        if (SourceDate?.getDate()) {
            SourceDate.setHours(23);
            SourceDate.setMinutes(59);
            SourceDate.setSeconds(59);
            SourceDate.setMilliseconds(0);
            FormattedDate = (0, _datefns.format)(SourceDate, "yyyy-MM-dd HH:mm");
        }
        return FormattedDate;
    } else {
        return null;
    }
};
const DateFormatForReport = (SourceDate)=>{
    if (SourceDate) {
        let FormattedDate = "";
        if (SourceDate?.getDate()) {
            FormattedDate = (0, _datefns.format)(SourceDate, "dd-MMM-yyyy");
        }
        return FormattedDate;
    } else {
        return null;
    }
};
const DateComparison = (StartDate, EndDate)=>{
    if (StartDate && EndDate) {
        if ((0, _datefns.differenceInDays)(EndDate, StartDate) < 0) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
};
const SetLastDateOfMonth = (StartDate)=>{
    StartDate = new Date(StartDate);
    StartDate.setMonth(StartDate.getMonth() + 1);
    StartDate.setDate(StartDate.getDate() - 1);
    return DateFormatForDB(StartDate);
};
const EmptyUuid = "00000000-0000-0000-0000-00000000000";

//# sourceMappingURL=Common.helper.js.map