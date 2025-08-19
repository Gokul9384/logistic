import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { OrderService } from '@Root/Service/CodeMove/Order.service';
import { OrderModel } from '@Model/CodeMove/Order.model';


@Controller({ path: "Order", version: '1' })
@ApiTags("Order")
export class OrderController extends JWTAuthController {

    constructor(private _OrderService: OrderService) {
        super();
    }

    @Get('List')
    async List() {
        const data = await this._OrderService.GetAll();
        return this.SendResponseData(data);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const data = await this._OrderService.GetById(Id);
        return this.SendResponseData(data);
    }

    @Post('Insert')
    async Insert(@Body() OrderData: OrderModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._OrderService.Insert(OrderData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() OrderData: OrderModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._OrderService.Update(Id, OrderData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
        await this._OrderService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
