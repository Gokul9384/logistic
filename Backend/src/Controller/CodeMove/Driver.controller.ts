import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { DriverService } from '@Root/Service/CodeMove/Driver.service';
import { DriverModel } from '@Model/CodeMove/Driver.model';

@Controller({ path: "Driver", version: '1' })
@ApiTags("Driver")
export class DriverController extends JWTAuthController {

    constructor(private _DriverService: DriverService) {
        super();
    }

    @Get('List')
    async List() {
        const data = await this._DriverService.GetAll();
        return this.SendResponseData(data);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const data = await this._DriverService.GetById(Id);
        return this.SendResponseData(data);
    }

    @Post('Insert')
    async Insert(@Body() DriverData: DriverModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._DriverService.Insert(DriverData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() DriverData: DriverModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._DriverService.Update(Id, DriverData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
        await this._DriverService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
