import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { QuoteService } from '@Root/Service/CodeMove/Quote.service';
import { QuoteModel } from '@Model/CodeMove/Quote.model';


@Controller({ path: "Quote", version: '1' })
@ApiTags("Quote")
export class QuoteController extends JWTAuthController {

    constructor(private _QuoteService: QuoteService) {
        super();
    }

    @Get('List')
    async List() {
        const data = await this._QuoteService.GetAll();
        return this.SendResponseData(data);
    }

    @Get('QuoteDetail')
    async QuoteDetail() {
        const data = await this._QuoteService.QuoteDetail();
        return this.SendResponseData(data);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const data = await this._QuoteService.GetById(Id);
        return this.SendResponseData(data);
    }

    @Post('Insert')
    async Insert(@Body() QuoteData: QuoteModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._QuoteService.Insert(QuoteData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() QuoteData: QuoteModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._QuoteService.Update(Id, QuoteData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
        await this._QuoteService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
