import { Injectable } from '@nestjs/common';
import { user } from '@Database/Table/Admin/user';
import { RandomValue, UserIp } from '@Helper/Common.helper';
import { ChangePasswordModel, ResetPasswordModel, UserModel } from '@Model/Admin/User.model';
import { Not } from 'typeorm';
import { EmailService } from '../Email.service';
import { EncryptionService } from '../Encryption.service';
import { AuditLogService } from './AuditLog.service';
import { LogActionEnum } from '@Helper/Enum/AuditLogEnum';

@Injectable()
export class UserService {
  constructor(
    private _EmailService: EmailService,
    private _EncryptionService: EncryptionService,
    private _AuditLogService: AuditLogService
  ) {
  }

  async GetAllExpectSuperAdmin() {
    const UserData = await user.find({ where: { created_by_id: Not('0'), status: true }, relations: ['user_role'] });
    return UserData;
  }

  async GetById(UserId: string) {
    return user.findOne({ where: { id: UserId } });
  }

  async Insert(UserData: UserModel, UserId: string, UserIp: string) {
    const _UserData = new user();
    _UserData.user_role_id = UserData.user_role_id;
    _UserData.first_name = UserData.first_name;
    _UserData.last_name = UserData.last_name;
    _UserData.email = UserData.email;
    _UserData.password = UserData.password;
    _UserData.mobile = UserData.mobile;
    _UserData.created_by_id = UserId;
    _UserData.created_on = new Date();
    _UserData.password = this._EncryptionService.Encrypt(UserData.password);
    await user.insert(_UserData);
    this._AuditLogService.AuditEmitEvent({ PerformedType: user.name, ActionType: LogActionEnum.Insert, PrimaryId: [_UserData.id], UserIp: UserIp });
    return _UserData;
  }

  async Update(Id: string, UserData: UserModel, UserId: string, UserIp: string) {
    const UserUpdateData = await user.findOne({ where: { id: Id } });
    if (!UserUpdateData) {
      throw new Error('Record not found')
    }
    UserUpdateData.user_role_id = UserData.user_role_id;
    UserUpdateData.first_name = UserData.first_name;
    UserUpdateData.last_name = UserData.last_name;
    UserUpdateData.email = UserData.email;
    UserUpdateData.password = UserData.password;
    UserUpdateData.mobile = UserData.mobile;
    UserUpdateData.updated_by_id = UserId;
    UserUpdateData.updated_on = new Date();
    delete UserUpdateData.password;
    delete UserUpdateData.email;
    await user.update(Id, UserUpdateData);
    this._AuditLogService.AuditEmitEvent({ PerformedType: user.name, ActionType: LogActionEnum.Update, PrimaryId: [UserUpdateData.id], UserIp: UserIp });
    return UserUpdateData;
  }

  async SuspendOrActivate(Id: string, UserId: string, UserIp: string) {
    const UserData = await user.findOne({ where: { id: Id } });
    if (!UserData) {
      throw new Error('User not found');
    }
    UserData.updated_by_id = UserId;
    UserData.updated_on = new Date();
    UserData.status = !UserData.status;
    await UserData.save();
    if (UserData.status == true) {
      this._AuditLogService.AuditEmitEvent({ PerformedType: user.name, ActionType: LogActionEnum.Active, PrimaryId: [UserData.id], UserIp: UserIp });
    }
    else {
      this._AuditLogService.AuditEmitEvent({ PerformedType: user.name, ActionType: LogActionEnum.Suspend, PrimaryId: [UserData.id], UserIp: UserIp });
    }
    return UserData;
  }

  async ForgotPassword(EmailId: string) {
    const UserData = await user.findOne({ where: { email: EmailId } });
    if (!UserData) {
      throw new Error("User not found");
    }
    UserData.reset_otp = RandomValue(100000, 999999);
    await UserData.save();
    let EncryptedUserId = UserData.id;
    return await this._EmailService.ForgotPassword(EmailId, UserData.reset_otp, EncryptedUserId);
  }

  async ResetPassword(ResetPasswordData: ResetPasswordModel) {
    const UserData = await user.findOne({ where: { id: ResetPasswordData.user_id } });
    if (!UserData) {
      throw new Error("User not found");
    }
    if (UserData.reset_otp != ResetPasswordData.reset_otp) {
      throw new Error("Invalid Reset OTP");
    }
    UserData.password = this._EncryptionService.Encrypt(ResetPasswordData.password);
    UserData.reset_otp = null;
    UserData.updated_by_id = UserData.id;
    UserData.updated_on = new Date()
    await UserData.save();
    return true;
  }

  async ChangePassword(UserId: string, ChangePasswordData: ChangePasswordModel) {
    const UserData = await user.findOne({ where: { id: UserId } });
    if (!UserData) {
      throw new Error("User not found");
    }
    if (this._EncryptionService.Decrypt(UserData.password) != ChangePasswordData.old_password) {
      throw new Error("Old password not matched");
    }
    UserData.password = this._EncryptionService.Encrypt(ChangePasswordData.password);
    UserData.updated_by_id = UserId;
    UserData.updated_on = new Date();
    await UserData.save();
    return true;
  }

  async UserResetPassword(Id: string, UserData: UserModel, UserId: string, UserIp: string) {
    UserData.updated_by_id = UserId;
    UserData.updated_on = new Date();
    UserData.password = this._EncryptionService.Encrypt(UserData.password);
    await user.update(Id, UserData as any);
    this._AuditLogService.AuditEmitEvent({ PerformedType: user.name, ActionType: LogActionEnum.ResetPassword, PrimaryId: [UserData.id], UserIp: UserIp });
    return UserData as user;
  }

  async UserUnLock(UserId: string, UserData: any) {
    const _UserData = await user.findOne({ where: { id: UserId } });
    if (!_UserData) {
      throw new Error("User not found");
    }
    if (this._EncryptionService.Decrypt(_UserData.password) != UserData.password) {
      throw new Error("Password not matched");
    }
    return true;
  }
}
