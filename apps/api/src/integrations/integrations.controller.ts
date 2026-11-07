import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { StudentRoute } from '../common/decorators/student-route.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { DataApiService } from './data-api.service.js';
import { IntegrationsService } from './integrations.service.js';
import { OidcService } from './oidc.service.js';

/** School Settings › Integrations (school administrators). */
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get('index')
  index(@CurrentUser() user: DecodedUser) {
    return this.integrations.index(user);
  }

  @Put(':key')
  save(
    @Param('key') key: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.integrations.save(key, user, body);
  }

  @Post(':key/client-secret')
  @HttpCode(200)
  clientSecret(@Param('key') key: string, @CurrentUser() user: DecodedUser) {
    return this.integrations.rotateClientSecret(key, user);
  }

  @Post(':key/webhook-secret')
  @HttpCode(200)
  webhookSecret(@Param('key') key: string, @CurrentUser() user: DecodedUser) {
    return this.integrations.rotateWebhookSecret(key, user);
  }

  @Post(':key/webhook-test')
  @HttpCode(200)
  webhookTest(@Param('key') key: string, @CurrentUser() user: DecodedUser) {
    return this.integrations.testWebhook(key, user);
  }

  @Get(':key/deliveries')
  deliveries(@Param('key') key: string, @CurrentUser() user: DecodedUser) {
    return this.integrations.deliveries(key, user);
  }

  @Post('deliveries/:uuid/redeliver')
  @HttpCode(200)
  redeliver(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.integrations.redeliver(uuid, user);
  }
}

/** OpenID Connect provider. Responses follow the OAuth/OIDC specs, not the app's envelope. */
@Controller('oidc')
export class OidcController {
  constructor(private readonly oidc: OidcService) {}

  @Public()
  @Get('.well-known/openid-configuration')
  discovery() {
    return this.oidc.discovery();
  }

  @Public()
  @Get('jwks')
  jwks() {
    return this.oidc.jwks();
  }

  @Public()
  @Get('authorize')
  async authorize(@Query() query: Record<string, any>, @Res() res: Response) {
    res.redirect(302, await this.oidc.authorizeRedirect(query));
  }

  /** Called by the web app's /oauth/authorize page for the signed-in person. */
  @StudentRoute()
  @Post('authorize/approve')
  @HttpCode(200)
  approve(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.oidc.approve(user, body);
  }

  @Public()
  @Post('token')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  token(@Headers('authorization') authorization: string, @Body() body: any) {
    return this.oidc.token(authorization, body ?? {});
  }

  @Public()
  @Get('userinfo')
  userinfo(@Headers('authorization') authorization: string) {
    return this.oidc.userinfo(authorization);
  }
}

/** Data API for connected apps (client credentials token, scope school.read). */
@Controller('integrations/v1')
export class DataApiController {
  constructor(private readonly data: DataApiService) {}

  @Public()
  @Get('school')
  school(@Headers('authorization') authorization: string) {
    return this.data.school(authorization);
  }

  @Public()
  @Get('students')
  students(
    @Headers('authorization') authorization: string,
    @Query() query: Record<string, any>,
  ) {
    return this.data.students(authorization, query);
  }

  @Public()
  @Get('classes')
  classes(
    @Headers('authorization') authorization: string,
    @Query() query: Record<string, any>,
  ) {
    return this.data.classes(authorization, query);
  }

  @Public()
  @Get('staff')
  staff(
    @Headers('authorization') authorization: string,
    @Query() query: Record<string, any>,
  ) {
    return this.data.staff(authorization, query);
  }
}
