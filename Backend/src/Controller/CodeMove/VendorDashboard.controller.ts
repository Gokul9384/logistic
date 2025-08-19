import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { vehicle_type } from '@Root/Database/Table/CodeMove/vehicle_type';
import { vendor } from '@Root/Database/Table/CodeMove/vendor';
import { CurrentUser } from '@Root/Helper/Common.helper';
import { VendorDashboardService } from '@Root/Service/CodeMove/VendorDashboard.service';
import { get } from 'lodash';
import { JWTAuthController } from '../JWTAuth.controller';

@ApiTags('Vendor Dashboard')
@Controller({ path: 'VendorDashboard', version: '1' })
export class VendorDashboardController extends JWTAuthController {
    constructor(private readonly vendorDashboardService: VendorDashboardService) {
        super();
    }

    @Get('stats')
    async getVendorDashboardStats(@CurrentUser() UserId: string,) {
        const VendorData = await vendor.findOne({ where: { user_id: UserId } })
        return await this.vendorDashboardService.getStats(VendorData.id);
    }

    @Get('recent-requirements')
    async getRecentRequirements(@CurrentUser() UserId: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        const VendorData = await vendor.findOne({ where: { user_id: UserId } })

        return await this.vendorDashboardService.getRecentRequirements(VendorData.id, startDate, endDate);
    }
}

