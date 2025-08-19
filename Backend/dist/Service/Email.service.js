"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailService", {
    enumerable: true,
    get: function() {
        return EmailService;
    }
});
const _common = require("@nestjs/common");
const _Mailerservice = require("./Mailer.service");
const _Commonservice = require("./Common.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EmailService = class EmailService {
    async ForgotPassword(EmailId, ResetOTP, EncryptedUserId) {
        const Res = await this._MailerService.SendMail({
            to: EmailId,
            subject: "Forgot password request",
            template: "ForgotPassword",
            html: true,
            attachments: [
                {
                    filename: 'logo.png',
                    content: this._CommonService.GetBase64(`dist/Assets/Logo.jpg`),
                    cid: 'logo',
                    encoding: 'base64'
                }
            ],
            context: {
                logo: "cid:logo",
                domain_name: process.env.DOMAIN_NAME + "/auth/cover-password-reset/" + EncryptedUserId,
                otp: ResetOTP
            }
        });
        return Res;
    }
    async SendWarrantyCertificate(EmailId, CertificatePath, CustomerName, ProductName, WarrantyStartDate, WarrantyEndDate) {
        const Res = await this._MailerService.SendMail({
            to: EmailId,
            subject: "Your Warranty Registration Certificate",
            template: "WarrantyRegistration",
            html: true,
            attachments: [
                {
                    filename: 'logo.png',
                    content: this._CommonService.GetBase64(`dist/Assets/Logo.jpg`),
                    cid: 'logo',
                    encoding: 'base64'
                },
                {
                    filename: `Warranty_Certificate.pdf`,
                    path: CertificatePath
                }
            ],
            context: {
                logo: "cid:logo",
                customer_name: CustomerName,
                product_name: ProductName,
                warranty_start_date: WarrantyStartDate,
                warranty_end_date: WarrantyEndDate,
                domain_name: process.env.DOMAIN_NAME
            }
        });
        return Res;
    }
    async VerificationOtp(CustomerEmailData, VerificationOTP) {
        const Res = await this._MailerService.SendMail({
            to: CustomerEmailData,
            subject: "Account Verification OTP",
            template: "VerificationOTP",
            html: true,
            attachments: [
                {
                    filename: 'logo.png',
                    content: this._CommonService.GetBase64(`dist/Assets/Logo.jpg`),
                    cid: 'logo',
                    encoding: 'base64'
                }
            ],
            context: {
                logo: "cid:logo",
                otp: VerificationOTP
            }
        });
        return Res;
    }
    async SendRegistrationOtp(CustomerVerificationData, CustomerOTP) {
        const Res = await this._MailerService.SendMail({
            to: CustomerVerificationData,
            subject: "Customer Registration OTP",
            template: "CustomerRegistrationOtp",
            html: true,
            attachments: [
                {
                    filename: 'logo.png',
                    content: this._CommonService.GetBase64(`dist/Assets/Logo.jpg`),
                    cid: 'logo',
                    encoding: 'base64'
                }
            ],
            context: {
                logo: "cid:logo",
                otp: CustomerOTP
            }
        });
        return Res;
    }
    constructor(_MailerService, _CommonService){
        this._MailerService = _MailerService;
        this._CommonService = _CommonService;
    }
};
EmailService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _Mailerservice.MailerService === "undefined" ? Object : _Mailerservice.MailerService,
        typeof _Commonservice.CommonService === "undefined" ? Object : _Commonservice.CommonService
    ])
], EmailService);

//# sourceMappingURL=Email.service.js.map