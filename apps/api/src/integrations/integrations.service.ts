import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { DecodedUser } from '../common/types/auth.js';
import { encryptSecret } from '../common/secrets.js';
import { APP_CATALOG, type AppKey } from './app-catalog.js';
import { issuer, sha256 } from './oidc.service.js';
import { WEBHOOK_EVENTS, WebhooksService } from './webhooks.service.js';

type App = Prisma.IntegrationAppGetPayload<object>;

/** http is only allowed for local development addresses. */
function validUrl(value: string) {
  try {
    const url = new URL(value);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    return url.protocol === 'https:' || (url.protocol === 'http:' && local);
  } catch {
    return false;
  }
}

/** School Settings › Integrations (school administrators). */
@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webhooks: WebhooksService,
  ) {}

  private assertAdmin(decoded: DecodedUser) {
    if (!['ROOT', 'ADMIN'].includes(decoded.role)) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Only school administrators can manage integrations',
      });
    }
  }

  private invalid(message: string): never {
    throw new UnprocessableEntityException({
      status: 422,
      success: false,
      message,
    });
  }

  private catalogEntry(key: string) {
    const entry = APP_CATALOG.find((a) => a.key === key);
    if (!entry) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Unknown app',
      });
    }
    return entry;
  }

  private view(entry: (typeof APP_CATALOG)[number], app: App | undefined) {
    return {
      ...entry,
      connected: !!app?.client_secret_hash,
      enabled: app?.enabled ?? false,
      app_url: app?.app_url ?? null,
      redirect_uris: app?.redirect_uris ?? [],
      client_id: app?.client_id ?? null,
      client_secret_hint: app?.client_secret_hint ?? null,
      webhook_url: app?.webhook_url ?? null,
      has_webhook_secret: !!app?.webhook_secret,
      webhook_events: app?.webhook_events ?? [],
      disabled_branch_uuids: app?.disabled_branch_uuids ?? [],
    };
  }

  /** Creates the app's row (and client id) the first time it's touched. */
  private async ensure(schoolUuid: string, key: AppKey) {
    return this.prisma.integrationApp.upsert({
      where: { school_uuid_key: { school_uuid: schoolUuid, key } },
      update: {},
      create: {
        school_uuid: schoolUuid,
        key,
        client_id: `pl_${key}_${randomBytes(9).toString('base64url')}`,
      },
    });
  }

  async index(decoded: DecodedUser) {
    this.assertAdmin(decoded);
    const [apps, branches] = await Promise.all([
      this.prisma.integrationApp.findMany({
        where: { school_uuid: decoded.school_uuid },
      }),
      this.prisma.branch.findMany({
        where: { school_uuid: decoded.school_uuid },
        select: { uuid: true, name: true },
        orderBy: { created_at: 'asc' },
      }),
    ]);
    return {
      status: 200,
      success: true,
      message: 'Integrations',
      data: {
        apps: APP_CATALOG.map((entry) =>
          this.view(
            entry,
            apps.find((a) => a.key === entry.key),
          ),
        ),
        branches,
        events: WEBHOOK_EVENTS,
        issuer: issuer(),
        discovery_url: `${issuer()}/.well-known/openid-configuration`,
      },
    };
  }

  async save(key: string, decoded: DecodedUser, body: any) {
    this.assertAdmin(decoded);
    const entry = this.catalogEntry(key);
    const current = await this.ensure(decoded.school_uuid, entry.key);
    const data: Prisma.IntegrationAppUpdateInput = {};

    if ('app_url' in body) {
      const url = typeof body.app_url === 'string' ? body.app_url.trim() : '';
      if (url && !validUrl(url))
        this.invalid('The app address must start with https://');
      data.app_url = url || null;
    }
    if ('redirect_uris' in body) {
      const uris: string[] = Array.isArray(body.redirect_uris)
        ? body.redirect_uris
            .map((u: unknown) => String(u).trim())
            .filter(Boolean)
        : [];
      if (uris.length > 10) this.invalid('Add at most 10 redirect URIs');
      const bad = uris.find((u) => !validUrl(u) || u.includes('#'));
      if (bad)
        this.invalid(`Redirect URI ${bad} must be a full https:// address`);
      data.redirect_uris = [...new Set(uris)];
    }
    if ('webhook_url' in body) {
      const url =
        typeof body.webhook_url === 'string' ? body.webhook_url.trim() : '';
      if (url && !validUrl(url))
        this.invalid('The webhook URL must start with https://');
      data.webhook_url = url || null;
    }
    if ('webhook_events' in body) {
      const events = Array.isArray(body.webhook_events)
        ? body.webhook_events
        : [];
      data.webhook_events = WEBHOOK_EVENTS.filter((e) => events.includes(e));
    }
    if ('disabled_branch_uuids' in body) {
      const branches = await this.prisma.branch.findMany({
        where: { school_uuid: decoded.school_uuid },
        select: { uuid: true },
      });
      const requested = Array.isArray(body.disabled_branch_uuids)
        ? body.disabled_branch_uuids
        : [];
      data.disabled_branch_uuids = branches
        .map((b) => b.uuid)
        .filter((b) => requested.includes(b));
    }
    if ('enabled' in body) {
      const enabled = body.enabled === true;
      const appUrl = 'app_url' in data ? data.app_url : current.app_url;
      if (enabled && (!current.client_secret_hash || !appUrl)) {
        this.invalid(
          'Add the app address and create a client secret before turning it on',
        );
      }
      data.enabled = enabled;
    }

    const app = await this.prisma.integrationApp.update({
      where: { uuid: current.uuid },
      data,
    });
    return {
      status: 200,
      success: true,
      message: `${entry.full_name} saved`,
      data: { app: this.view(entry, app) },
    };
  }

  /** New client secret, shown once. The old one stops working immediately. */
  async rotateClientSecret(key: string, decoded: DecodedUser) {
    this.assertAdmin(decoded);
    const entry = this.catalogEntry(key);
    const current = await this.ensure(decoded.school_uuid, entry.key);
    const secret = `pls_${randomBytes(32).toString('base64url')}`;
    const app = await this.prisma.integrationApp.update({
      where: { uuid: current.uuid },
      data: {
        client_secret_hash: sha256(secret),
        client_secret_hint: `••••${secret.slice(-4)}`,
      },
    });
    // Tokens issued with the old secret go too.
    await this.prisma.oidcToken.deleteMany({ where: { app_uuid: app.uuid } });
    return {
      status: 200,
      success: true,
      message:
        'New client secret created. Copy it now; it will not be shown again.',
      data: { app: this.view(entry, app), client_secret: secret },
    };
  }

  /** New webhook signing secret, shown once. */
  async rotateWebhookSecret(key: string, decoded: DecodedUser) {
    this.assertAdmin(decoded);
    const entry = this.catalogEntry(key);
    const current = await this.ensure(decoded.school_uuid, entry.key);
    const secret = `whsec_${randomBytes(24).toString('base64url')}`;
    const app = await this.prisma.integrationApp.update({
      where: { uuid: current.uuid },
      data: { webhook_secret: encryptSecret(secret) },
    });
    return {
      status: 200,
      success: true,
      message:
        'New signing secret created. Copy it now; it will not be shown again.',
      data: { app: this.view(entry, app), webhook_secret: secret },
    };
  }

  private async findApp(key: string, decoded: DecodedUser) {
    this.assertAdmin(decoded);
    const app = await this.prisma.integrationApp.findUnique({
      where: { school_uuid_key: { school_uuid: decoded.school_uuid, key } },
    });
    if (!app) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Set the app up first',
      });
    }
    return app;
  }

  async deliveries(key: string, decoded: DecodedUser) {
    const app = await this.findApp(key, decoded);
    const deliveries = await this.prisma.webhookDelivery.findMany({
      where: { app_uuid: app.uuid },
      orderBy: { created_at: 'desc' },
      take: 50,
      select: {
        uuid: true,
        event: true,
        status: true,
        attempts: true,
        response_status: true,
        error: true,
        created_at: true,
        delivered_at: true,
      },
    });
    return {
      status: 200,
      success: true,
      message: 'Deliveries',
      data: { deliveries },
    };
  }

  /** Sends a ping straight away and reports how the app answered. */
  async testWebhook(key: string, decoded: DecodedUser) {
    const app = await this.findApp(key, decoded);
    if (!app.webhook_url || !app.webhook_secret)
      this.invalid('Add a webhook URL and create a signing secret first');
    const delivery = await this.prisma.webhookDelivery.create({
      data: {
        app_uuid: app.uuid,
        event: 'ping',
        payload: {
          school_uuid: app.school_uuid,
          branch_uuid: null,
          data: { message: 'Hello from Penlumen' },
        },
        // A ping is a one-off; don't retry it.
        attempts: 2,
      },
    });
    const ok = await this.webhooks.deliver(delivery.uuid);
    const result = await this.prisma.webhookDelivery.findUnique({
      where: { uuid: delivery.uuid },
    });
    if (!ok)
      this.invalid(
        `The app didn't accept the ping: ${result?.error ?? 'no response'}`,
      );
    return {
      status: 200,
      success: true,
      message: `Ping delivered (HTTP ${result?.response_status})`,
    };
  }

  async redeliver(uuid: string, decoded: DecodedUser) {
    this.assertAdmin(decoded);
    const delivery = await this.prisma.webhookDelivery.findFirst({
      where: { uuid, app: { school_uuid: decoded.school_uuid } },
    });
    if (!delivery) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Delivery not found',
      });
    }
    // Start the retry count over, as one manual attempt with no retries.
    await this.prisma.webhookDelivery.update({
      where: { uuid },
      data: { attempts: 2, status: 'PENDING' },
    });
    const ok = await this.webhooks.deliver(uuid);
    return {
      status: 200,
      success: ok,
      message: ok ? 'Delivered' : 'Still failing; see the error in the log',
    };
  }

  /** Apps for a student's dashboard: open ones link to the app, the rest are "coming soon". */
  async appsFor(schoolUuid: string, branchUuid: string) {
    const apps = await this.prisma.integrationApp.findMany({
      where: { school_uuid: schoolUuid, enabled: true },
    });
    return APP_CATALOG.map((entry) => {
      const app = apps.find((a) => a.key === entry.key);
      const open =
        !!app?.app_url && !app.disabled_branch_uuids.includes(branchUuid);
      return {
        ...entry,
        status: open ? ('available' as const) : ('coming_soon' as const),
        launch_url: open ? app!.app_url : null,
      };
    });
  }
}
