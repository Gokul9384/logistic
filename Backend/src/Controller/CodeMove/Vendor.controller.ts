import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { VendorService } from '@Root/Service/CodeMove/Vendor.service';
import { VendorModel } from '@Model/CodeMove/Vendor.model';


@Controller({ path: "Vendor", version: '1' })
@ApiTags("Vendor")
export class VendorController extends JWTAuthController {

    constructor(private _VendorService: VendorService) {
        super();
    }

    @Get('List')
    async List() {
        const VendorListData = await this._VendorService.GetAll();
        return this.SendResponseData(VendorListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const VendorData = await this._VendorService.GetById(Id);
        return this.SendResponseData(VendorData);
    }

    @Post('Insert')
    async Insert(@Body() VendorData: VendorModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._VendorService.Insert(VendorData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() VendorData: VendorModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._VendorService.Update(Id, VendorData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
        await this._VendorService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
