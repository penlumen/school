import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller.js';
import { CalendarService } from './calendar.service.js';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
