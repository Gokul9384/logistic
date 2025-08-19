import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { StateService } from '@Root/Service/Admin/State.service';
import { StateModel } from '@Model/Admin/State.model';


@Controller({ path: "State", version: '1' })
@ApiTags("State")
export class StateController extends JWTAuthController {

  constructor(private _StateService: StateService) {
    super()
  }

  @Get('List')
  async List() {
    const StateListData = await this._StateService.GetAll();
    return this.SendResponseData(StateListData);
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    const StateData = await this._StateService.GetById(Id);
    return this.SendResponseData(StateData);
  }

  @Post('Insert')
  async Insert(@Body() StateData: StateModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
    await this._StateService.Insert(StateData, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  @Put('Update/:Id')
  async Update(@Param('Id') Id: string, @Body() StateData: StateModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
    await this._StateService.Update(Id, StateData, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
    await this._StateService.Delete(Id, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }
}
