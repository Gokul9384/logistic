import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerDashboardService } from '@Root/Service/CodeMove/CustomerDashboard.service';
import { JWTAuthController } from '../JWTAuth.controller';
import { CurrentUser } from '@Root/Helper/Common.helper';
import { customer } from '@Root/Database/Table/CodeMove/customer';

@ApiTags('Customer Dashboard')
@Controller({ path: 'CustomerDashboard', version: '1' })
export class CustomerDashboardController extends JWTAuthController {
    constructor(private readonly CustomerDashboardService: CustomerDashboardService) {
        super();
    }

    @Get('stats')
    async getCustomerDashboardStats(@CurrentUser() UserId: string) {
        const CustomerData = await customer.findOne({ where: { user_id: UserId } })
        return await this.CustomerDashboardService.getStats(CustomerData.id);
    }

    @Get('recent-requirements')
    async getRecentRequirements(@CurrentUser() UserId: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        const CustomerData = await customer.findOne({ where: { user_id: UserId } })
        return await this.CustomerDashboardService.getRecentOrders(CustomerData.id, startDate, endDate);
    }

    @Get('delivery-tracking')
    async getDeliveryTracking(@CurrentUser() UserId: string, @Query('startDate') startDate?: string) {
        const CustomerData = await customer.findOne({ where: { user_id: UserId } })
        return await this.CustomerDashboardService.getDeliveryTracking(CustomerData.id, startDate);
    }
}
