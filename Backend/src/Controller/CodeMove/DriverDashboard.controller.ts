import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DriverDashboardService } from '@Root/Service/CodeMove/DriverDashboard.service';
import { JWTAuthController } from '../JWTAuth.controller';
import { CurrentUser } from '@Root/Helper/Common.helper';
import { driver } from '@Root/Database/Table/CodeMove/driver';

@ApiTags('Driver Dashboard')
@Controller({ path: 'DriverDashboard', version: '1' })
export class DriverDashboardController extends JWTAuthController {
    constructor(private readonly DriverDashboardService: DriverDashboardService) {
        super();
    }

    @Get('getDriverStats')
    async getDriverStats(@CurrentUser() UserId: string) {
        const DriverData = await driver.findOne({ where: { user_id: UserId } })
        return await this.DriverDashboardService.getDriverStats(DriverData.id);
    }

    @Get('getDriverOrders')
    async getDriverOrders(@CurrentUser() UserId: string, @Query('date') date?: string) {
        const DriverData = await driver.findOne({ where: { user_id: UserId } })
        return await this.DriverDashboardService.getDriverOrders(DriverData.id, date);
    }

    @Get('GetAllDeliverys')
    async GetAllDeliverys(@CurrentUser() UserId: string) {
        const DriverData = await driver.findOne({ where: { user_id: UserId } })
        return await this.DriverDashboardService.GetAllDeliverys(DriverData.id);
    }
}
