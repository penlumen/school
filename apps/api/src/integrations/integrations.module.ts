import { Global, Module } from '@nestjs/common';
import {
  DataApiController,
  IntegrationsController,
  OidcController,
} from './integrations.controller.js';
import { DataApiService } from './data-api.service.js';
import { IntegrationsService } from './integrations.service.js';
import { OidcService } from './oidc.service.js';
import { WebhooksService } from './webhooks.service.js';

@Global()
@Module({
  // DataApiController before IntegrationsController so /integrations/v1/*
  // isn't read as an app key.
  controllers: [DataApiController, IntegrationsController, OidcController],
  providers: [
    IntegrationsService,
    OidcService,
    DataApiService,
    WebhooksService,
  ],
  exports: [IntegrationsService, WebhooksService],
})
export class IntegrationsModule {}
