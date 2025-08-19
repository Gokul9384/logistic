import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { VehicleTypeService } from '@Root/Service/CodeMove/VehicleType.service';
import { VehicleTypeModel } from '@Model/CodeMove/VehicleType.model';



@Controller({ path: "VehicleType", version: '1' })
@ApiTags("VehicleType")
export class VehicleTypeController extends JWTAuthController {

    constructor(private _VehicleTypeService: VehicleTypeService) {
        super()
    }

    @Get('List')
    async List() {
        const VehicleTypeListData = await this._VehicleTypeService.GetAll();
        return this.SendResponseData(VehicleTypeListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const VehicleTypeData = await this._VehicleTypeService.GetById(Id);
        return this.SendResponseData(VehicleTypeData);
    }

    @Post('Insert')
    async Insert(@Body() VehicleTypeData: VehicleTypeModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._VehicleTypeService.Insert(VehicleTypeData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() VehicleTypeData: VehicleTypeModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._VehicleTypeService.Update(Id, VehicleTypeData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
        await this._VehicleTypeService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
