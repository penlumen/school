import { Module } from '@nestjs/common';
import { StudentAttendanceController } from './student-attendance.controller.js';
import { StudentAttendanceService } from './student-attendance.service.js';
import { StaffAttendanceController } from './staff-attendance.controller.js';
import { StaffAttendanceService } from './staff-attendance.service.js';

@Module({
  controllers: [StudentAttendanceController, StaffAttendanceController],
  providers: [StudentAttendanceService, StaffAttendanceService],
})
export class AttendanceModule {}
