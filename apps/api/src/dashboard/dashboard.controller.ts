import { Controller, Get, Headers, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('cards')
  cards(@Headers('x-branch-session') branchUuid: string) {
    return this.dashboardService.cards(branchUuid);
  }

  @Get('attendance')
  attendance(@Headers('x-branch-session') branchUuid: string, @Query('year') year: string) {
    return this.dashboardService.attendancePerformance(branchUuid, year);
  }
}
