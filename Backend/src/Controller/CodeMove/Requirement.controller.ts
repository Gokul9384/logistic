// src/Controller/CodeMove/Requirement.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { RequirementService } from '@Root/Service/CodeMove/Requirement.service';
import { RequirementModel } from '@Model/CodeMove/Requirement.model';

@Controller({ path: "Requirement", version: '1' })
@ApiTags("Requirement")
export class RequirementController extends JWTAuthController {

    constructor(private _RequirementService: RequirementService) {
        super();
    }

    @Get('List')
    async List() {
        const data = await this._RequirementService.GetAll();
        return this.SendResponseData(data);
    }

    @Get('RequirementDetail')
    async RequirementDetail() {
        const data = await this._RequirementService.RequirementDetail();
        return this.SendResponseData(data);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const data = await this._RequirementService.GetById(Id);
        return this.SendResponseData(data);
    }

    @Post('Insert')
    async Insert(@Body() RequirementData: RequirementModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._RequirementService.Insert(RequirementData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() RequirementData: RequirementModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._RequirementService.Update(Id, RequirementData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
        await this._RequirementService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
