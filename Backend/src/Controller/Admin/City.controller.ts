import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { CityService } from '@Root/Service/Admin/City.service';
import { CityModel } from '@Model/Admin/City.model';


@Controller({ path: "City", version: '1' })
@ApiTags("City")
export class CityController extends JWTAuthController {

  constructor(private _CityService: CityService) {
    super()
  }

  @Get('List')
  async List() {
    const CityListData = await this._CityService.GetAll();
    return this.SendResponseData(CityListData);
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    const CityData = await this._CityService.GetById(Id);
    return this.SendResponseData(CityData);
  }

  @Post('Insert')
  async Insert(@Body() CityData: CityModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
    await this._CityService.Insert(CityData, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  @Put('Update/:Id')
  async Update(@Param('Id') Id: string, @Body() CityData: CityModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
    await this._CityService.Update(Id, CityData, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
    await this._CityService.Delete(Id, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }
}
