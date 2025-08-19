import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from '@Root/Service/CodeMove/Notification.service';
import { NotificationModel } from '@Model/CodeMove/Notification.model';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';

@Controller({ path: 'Notification', version: '1' })
@ApiTags('Notification')
export class NotificationController extends JWTAuthController {
    constructor(private _NotificationService: NotificationService) {
        super();
    }

    // Get all notifications by user
    @Get('List')
    async List(@CurrentUser() UserId: string) {
        const data = await this._NotificationService.GetAllByUserId(UserId);
        return this.SendResponseData(data);
    }

    // Insert a new notification
    @Post('Insert')
    async Insert(
        @Body() body: NotificationModel,
        @CurrentUser() UserId: string,
        @UserIp() ip: string
    ) {
        await this._NotificationService.Insert(body, UserId, ip);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    // Optional: Mark notification as read
    @Put('MarkAsRead/:Id')
    async MarkAsRead(@Param('Id') Id: string, @CurrentUser() UserId: string) {
        const data = await this._NotificationService.MarkAsRead(Id, UserId);
        return this.SendResponseData(data);
    }

    // Optional: Delete a notification
    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @CurrentUser() UserId: string, @UserIp() ip: string) {
        await this._NotificationService.Delete(Id, UserId, ip);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }

}