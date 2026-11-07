import { Global, Module } from '@nestjs/common';
import { HashingService } from '../common/hashing.service.js';
import { EmailController, PasswordController } from './mail.controller.js';
import { EmailSettingsService } from './email-settings.service.js';
import { MailService } from './mail.service.js';
import { PasswordService } from './password.service.js';

@Global()
@Module({
  controllers: [EmailController, PasswordController],
  providers: [
    MailService,
    EmailSettingsService,
    PasswordService,
    HashingService,
  ],
  exports: [MailService, PasswordService],
})
export class MailModule {}
