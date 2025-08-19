import { Injectable } from '@nestjs/common';
import { MailerService } from './Mailer.service';
import { CommonService } from './Common.service';
import { Any } from 'typeorm';

@Injectable()
export class EmailService {
  constructor(
    private readonly _MailerService: MailerService,
    private readonly _CommonService: CommonService,
  ) {
  }


  async ForgotPassword(EmailId: string, ResetOTP: number, EncryptedUserId: string) {
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
        }],
      context: {
        logo: "cid:logo",
        domain_name: process.env.DOMAIN_NAME + "/auth/cover-password-reset/" + EncryptedUserId,
        otp: ResetOTP
      },
    });
    return Res;
  }

  async SendWarrantyCertificate(EmailId: string, CertificatePath: string, CustomerName: string, ProductName: string, WarrantyStartDate: string, WarrantyEndDate: string) {
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
      },
    });

    return Res;
  }

  async VerificationOtp(CustomerEmailData: string, VerificationOTP: number) {
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
        }],
      context: {
        logo: "cid:logo",
        otp: VerificationOTP
      },
    });
    return Res;
  }

  async SendRegistrationOtp(CustomerVerificationData: string, CustomerOTP: number) {
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
        }],
      context: {
        logo: "cid:logo",
        otp: CustomerOTP
      },
    });
    return Res;
  }

}
