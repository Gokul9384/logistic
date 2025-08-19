import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { DeliveryService } from '@Root/Service/CodeMove/Delivery.service';
import { DeliveryModel } from '@Model/CodeMove/Delivery.model';


@Controller({ path: "Delivery", version: '1' })
@ApiTags("Delivery")
export class DeliveryController extends JWTAuthController {

    constructor(private _DeliveryService: DeliveryService) {
        super();
    }

    @Get('List')
    async List() {
        const data = await this._DeliveryService.GetAll();
        return this.SendResponseData(data);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const data = await this._DeliveryService.GetById(Id);
        return this.SendResponseData(data);
    }

    @Post('Insert')
    async Insert(@Body() DeliveryData: DeliveryModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._DeliveryService.Insert(DeliveryData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() DeliveryData: DeliveryModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._DeliveryService.Update(Id, DeliveryData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
        await this._DeliveryService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
