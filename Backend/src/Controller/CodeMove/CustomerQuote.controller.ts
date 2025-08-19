import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { CustomerQuoteService } from '@Root/Service/CodeMove/CustomerQuote.service';
import { CustomerQuoteModel } from '@Model/CodeMove/CustomerQuote.model';

@Controller({ path: "CustomerQuote", version: '1' })
@ApiTags("CustomerQuote")
export class CustomerQuoteController extends JWTAuthController {
    constructor(private _CustomerQuoteService: CustomerQuoteService) {
        super();
    }

    @Get('List')
    async List() {
        const data = await this._CustomerQuoteService.GetAll();
        return this.SendResponseData(data);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const data = await this._CustomerQuoteService.GetById(Id);
        return this.SendResponseData(data);
    }

    @Post('Insert')
    async Insert(@Body() QuoteData: CustomerQuoteModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._CustomerQuoteService.Insert(QuoteData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() QuoteData: CustomerQuoteModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._CustomerQuoteService.Update(Id, QuoteData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string, @UserIp() UserIp: string) {
        await this._CustomerQuoteService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
