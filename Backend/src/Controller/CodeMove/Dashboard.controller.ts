import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from '@Root/Service/CodeMove/Dashboard.service';
import { JWTAuthController } from '../JWTAuth.controller';

@ApiTags('Dashboard')
@Controller({ path: 'Dashboard', version: '1' })
export class DashboardController extends JWTAuthController {
    constructor(private readonly dashboardService: DashboardService) {
        super();

    }

    @Get('stats')
    async getAdminDashboardSummary() {
        return await this.dashboardService.DashboardStats();
    }



    @Get('orders')
    async getDashboardOrderList(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return await this.dashboardService.DashboardOrderList(startDate, endDate);
    }

}
