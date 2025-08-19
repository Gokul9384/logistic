"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MailerService", {
    enumerable: true,
    get: function() {
        return MailerService;
    }
});
const _common = require("@nestjs/common");
const _email_config = require("../Database/Table/Admin/email_config");
const _nodemailer = /*#__PURE__*/ _interop_require_default(require("nodemailer"));
const _Encryptionservice = require("./Encryption.service");
const _handlebars = /*#__PURE__*/ _interop_require_default(require("handlebars"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _util = /*#__PURE__*/ _interop_require_default(require("util"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const readFile = _util.default.promisify(_fs.default.readFile);
let MailerService = class MailerService {
    async Configuration() {
        const Email = await _email_config.email_config.find();
        if (Email.length == 0) {
            this.logger.error("Email config don't have data");
            return null;
        }
        var smtpTransport = _nodemailer.default.createTransport({
            host: Email[0].host,
            auth: {
                user: Email[0].email_id,
                pass: this._EncryptionService.Decrypt(Email[0].password)
            }
        });
        this.logger.error("Email configurated successfully");
        return {
            smtpTransport,
            Email
        };
    }
    async SendMail(_SendMailData) {
        try {
            const SmtpTransport = await this.Configuration();
            if (!SmtpTransport.smtpTransport) {
                this.logger.error("Email not configured yet.");
                return {
                    status: false,
                    message: "Email not configured yet."
                };
            }
            const mail = {
                from: {
                    name: SmtpTransport.Email[0].mailer_name,
                    address: SmtpTransport.Email[0].email_id
                },
                to: _SendMailData.to,
                subject: _SendMailData.subject,
                text: _SendMailData.template,
                bcc: _SendMailData.bcc,
                attachments: _SendMailData.attachments
            };
            if (_SendMailData.template && _SendMailData.html) {
                const MailTemplatePath = _path.default.resolve(`dist/Assets/MailTemplate/${_SendMailData.template}.hbs`);
                const ContentResult = await readFile(MailTemplatePath, 'utf8');
                const Template = _handlebars.default.compile(ContentResult, {
                    strict: true
                });
                mail["html"] = Template(_SendMailData.context);
            } else {
                mail["text"] = _SendMailData.template;
            }
            let SendMailPromise = new Promise((resolve, _reject)=>{
                SmtpTransport.smtpTransport.sendMail(mail, async (error, _response)=>{
                    if (error) {
                        this.logger.error(error);
                        SmtpTransport.smtpTransport.close();
                        resolve({
                            status: false,
                            message: JSON.stringify(error)
                        });
                    } else {
                        SmtpTransport.smtpTransport.close();
                        resolve({
                            status: true,
                            message: 'Message has been sent'
                        });
                    }
                });
            });
            return await SendMailPromise;
        } catch (e) {
            return {
                status: false,
                message: e.message
            };
        }
    }
    constructor(_EncryptionService){
        this._EncryptionService = _EncryptionService;
        this.logger = new _common.Logger(MailerService.name);
    }
};
MailerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Encryptionservice.EncryptionService === "undefined" ? Object : _Encryptionservice.EncryptionService
    ])
], MailerService);

//# sourceMappingURL=Mailer.service.js.map