import { Controller, Get, Ip } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator.js';
import { PrismaService } from './prisma/prisma.service.js';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  async health(@Ip() ipAddress: string) {
    try {
      await this.prisma.$connect();
      return {
        status: 200,
        success: true,
        message: 'Database connected',
        data: { ipAddress },
      };
    } catch (error: any) {
      return {
        status: 500,
        success: false,
        message: 'Database connection failed: ' + error.message,
        data: { ipAddress },
      };
    }
  }
}
