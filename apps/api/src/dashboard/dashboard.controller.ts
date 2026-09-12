import { Controller, Get, Headers } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('cards')
  cards(@Headers('x-branch-session') branchUuid: string) {
    return this.dashboardService.cards(branchUuid);
  }
}
