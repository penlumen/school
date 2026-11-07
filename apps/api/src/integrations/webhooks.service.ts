import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { decryptSecret } from '../common/secrets.js';

/** Events an app can subscribe to; payloads are documented in docs/integrations.md. */
export const WEBHOOK_EVENTS = [
  'student.created',
  'student.updated',
  'student.deleted',
  'class.created',
  'class.updated',
  'result.published',
  'staff.created',
] as const;
export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number] | 'ping';

/** Seconds to wait before each retry after the first attempt. */
const RETRY_DELAYS = [30, 300];

/** Signature header: t=<unix seconds>,v1=<hex HMAC-SHA256 of "t.body">. */
export function signWebhook(secret: string, body: string, timestamp: number) {
  const digest = createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('hex');
  return `t=${timestamp},v1=${digest}`;
}

/**
 * Tells connected apps when school data changes. emit() never throws and
 * never waits for delivery, so the change that triggered it isn't slowed
 * down or failed by an app being offline.
 */
@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly prisma: PrismaService) {}

  emit(
    schoolUuid: string,
    branchUuid: string | null,
    event: WebhookEvent,
    data: Record<string, unknown>,
  ) {
    void (async () => {
      const apps = await this.prisma.integrationApp.findMany({
        where: {
          school_uuid: schoolUuid,
          enabled: true,
          webhook_url: { not: null },
          webhook_events: { has: event },
          ...(branchUuid && {
            NOT: { disabled_branch_uuids: { has: branchUuid } },
          }),
        },
        select: { uuid: true },
      });
      for (const app of apps) {
        const delivery = await this.prisma.webhookDelivery.create({
          data: {
            app_uuid: app.uuid,
            event,
            payload: {
              school_uuid: schoolUuid,
              branch_uuid: branchUuid,
              data,
            } as Prisma.InputJsonValue,
          },
        });
        await this.deliver(delivery.uuid);
      }
    })().catch((error) =>
      this.logger.warn(`Webhook ${event} failed: ${error?.message}`),
    );
  }

  /** One attempt; schedules the next retry when it fails. */
  async deliver(deliveryUuid: string): Promise<boolean> {
    const delivery = await this.prisma.webhookDelivery.findUnique({
      where: { uuid: deliveryUuid },
      include: {
        app: { select: { webhook_url: true, webhook_secret: true } },
      },
    });
    const secret = decryptSecret(delivery?.app.webhook_secret);
    if (!delivery || !delivery.app.webhook_url || !secret) return false;

    const payload = delivery.payload as Record<string, unknown>;
    const body = JSON.stringify({
      id: delivery.uuid,
      event: delivery.event,
      created_at: delivery.created_at.toISOString(),
      ...payload,
    });
    const timestamp = Math.floor(Date.now() / 1000);
    let responseStatus: number | null = null;
    let error: string | null = null;
    try {
      const response = await fetch(delivery.app.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Penlumen-Webhooks/1',
          'X-Penlumen-Event': delivery.event,
          'X-Penlumen-Delivery': delivery.uuid,
          'X-Penlumen-Signature': signWebhook(secret, body, timestamp),
        },
        body,
        redirect: 'manual',
        signal: AbortSignal.timeout(10000),
      });
      responseStatus = response.status;
      if (!response.ok) error = `HTTP ${response.status}`;
    } catch (e: any) {
      error = String(e?.cause?.code || e?.message || e).slice(0, 300);
    }

    const attempts = delivery.attempts + 1;
    await this.prisma.webhookDelivery.update({
      where: { uuid: delivery.uuid },
      data: {
        attempts,
        response_status: responseStatus,
        error,
        status: error
          ? attempts > RETRY_DELAYS.length
            ? 'FAILED'
            : 'PENDING'
          : 'SUCCESS',
        delivered_at: error ? null : new Date(),
      },
    });

    if (error && attempts <= RETRY_DELAYS.length) {
      // In-process retries keep this simple; a restart drops pending ones,
      // which staff can redeliver from the delivery log.
      setTimeout(
        () => void this.deliver(delivery.uuid).catch(() => undefined),
        RETRY_DELAYS[attempts - 1] * 1000,
      ).unref();
    }
    return !error;
  }
}
