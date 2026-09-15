import { Global, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { FirebaseService } from './firebase.service.js';

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, FirebaseService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
