import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { ServiceAreaService } from '@Root/Service/CodeMove/ServiceArea.service';
import { ServiceAreaModel } from '@Model/CodeMove/ServiceArea.model';



@Controller({ path: "ServiceArea", version: '1' })
@ApiTags("ServiceArea")
export class ServiceAreaController extends JWTAuthController {

    constructor(private _ServiceAreaService: ServiceAreaService) {
        super()
    }

    @Get('List')
    async List() {
        const ServiceAreaListData = await this._ServiceAreaService.GetAll();
        return this.SendResponseData(ServiceAreaListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const ServiceAreaData = await this._ServiceAreaService.GetById(Id);
        return this.SendResponseData(ServiceAreaData);
    }

    @Post('Insert')
    async Insert(@Body() ServiceAreaData: ServiceAreaModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._ServiceAreaService.Insert(ServiceAreaData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() ServiceAreaData: ServiceAreaModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._ServiceAreaService.Update(Id, ServiceAreaData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
        await this._ServiceAreaService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
