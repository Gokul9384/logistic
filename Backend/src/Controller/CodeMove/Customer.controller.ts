import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { CustomerService } from '@Root/Service/CodeMove/Customer.service';
import { CustomerModel } from '@Model/CodeMove/Customer.model';


@Controller({ path: "Customer", version: '1' })
@ApiTags("Customer")
export class CustomerController extends JWTAuthController {

    constructor(private _CustomerService: CustomerService) {
        super();
    }

    @Get('List')
    async List() {
        const data = await this._CustomerService.GetAll();
        return this.SendResponseData(data);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const data = await this._CustomerService.GetById(Id);
        return this.SendResponseData(data);
    }

    @Post('Insert')
    async Insert(@Body() CustomerData: CustomerModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._CustomerService.Insert(CustomerData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() CustomerData: CustomerModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._CustomerService.Update(Id, CustomerData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
        await this._CustomerService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
