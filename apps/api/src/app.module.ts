import 'dotenv/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CacheModule } from './cache/cache.module.js';
import { StorageModule } from './storage/storage.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { BranchesModule } from './branches/branches.module.js';
import { GradesModule } from './grades/grades.module.js';
import { ClassesModule } from './classes/classes.module.js';
import { SubjectsModule } from './subjects/subjects.module.js';
import { StudentsModule } from './students/students.module.js';
import { ResultsModule } from './results/results.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { CalendarModule } from './calendar/calendar.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { EventsModule } from './events/events.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { SchoolModule } from './school/school.module.js';
import { BillingModule } from './billing/billing.module.js';
import { PresenceModule } from './presence/presence.module.js';
import { ParentModule } from './parent/parent.module.js';
import { AccountModule } from './account/account.module.js';
import { AffectiveModule } from './affective/affective.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { MailModule } from './mail/mail.module.js';
import { StudentPortalModule } from './student-portal/student-portal.module.js';

@Module({
  imports: [
    PrismaModule,
    CacheModule,
    StorageModule,
    MailModule,
    NotificationsModule,
    AuthModule,
    UsersModule,
    BranchesModule,
    GradesModule,
    ClassesModule,
    SubjectsModule,
    StudentsModule,
    ResultsModule,
    DashboardModule,
    CalendarModule,
    AttendanceModule,
    EventsModule,
    SchoolModule,
    BillingModule,
    PresenceModule,
    ParentModule,
    AccountModule,
    AffectiveModule,
    PaymentsModule,
    StudentPortalModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
