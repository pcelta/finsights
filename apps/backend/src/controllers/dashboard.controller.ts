import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { UserAccount } from '../entities/user-account.entity';

@Controller('api/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary(
    @User() user: UserAccount,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryUid') categoryUid?: string,
  ) {
    return this.dashboardService.getSummary(
      user,
      startDate,
      endDate,
      categoryUid,
    );
  }

  @Get('categories')
  async getCategoryBreakdown(
    @User() user: UserAccount,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryUid') categoryUid?: string,
  ) {
    return this.dashboardService.getCategoryBreakdown(
      user,
      startDate,
      endDate,
      categoryUid,
    );
  }

  @Get('transactions')
  async getTransactions(
    @User() user: UserAccount,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryUid') categoryUid?: string,
  ) {
    return this.dashboardService.getTransactions(
      user,
      startDate,
      endDate,
      categoryUid,
    );
  }
}
