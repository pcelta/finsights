import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryUid') categoryUid?: string,
  ) {
    return this.dashboardService.getSummary(
      startDate,
      endDate,
      categoryUid,
    );
  }

  @Get('categories')
  async getCategoryBreakdown(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryUid') categoryUid?: string,
  ) {
    return this.dashboardService.getCategoryBreakdown(
      startDate,
      endDate,
      categoryUid,
    );
  }

  @Get('transactions')
  async getTransactions(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryUid') categoryUid?: string,
  ) {
    return this.dashboardService.getTransactions(
      startDate,
      endDate,
      categoryUid,
    );
  }
}
