import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { BookingService } from "@Root/Service/CodeMove/Booking.service";
import { ApiTags } from "@nestjs/swagger";
import { JWTAuthController } from "@Controller/JWTAuth.controller";
import { BookingModel } from "@Model/CodeMove/Booking.model";
import { CurrentUser, UserIp } from "@Helper/Common.helper";
import { ResponseEnum } from "@Helper/Enum/ResponseEnum";

@ApiTags("Booking")
@Controller({ path: "Booking", version: "1" })
export class BookingController extends JWTAuthController {
    constructor(private _BookingService: BookingService) {
        super();
    }

    @Get("List")
    async List() {
        const data = await this._BookingService.GetAll();
        return this.SendResponseData(data);
    }

    @Get("ById/:Id")
    async ById(@Param("Id") Id: string) {
        const data = await this._BookingService.GetById(Id);
        return this.SendResponseData(data);
    }

    @Post("Insert")
    async Insert(@Body() BookingData: BookingModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._BookingService.Insert(BookingData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }

    @Put("Update/:Id")
    async Update(@Param("Id") Id: string, @Body() BookingData: BookingModel, @CurrentUser() UserId: string, @UserIp() UserIp: string) {
        await this._BookingService.Update(Id, BookingData, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete("Delete/:Id")
    async Delete(@Param("Id") Id: string, @UserIp() UserIp: string) {
        await this._BookingService.Delete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}