import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly client: Redis;
  private warned = false;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      // Don't let a missing/unreachable Redis crash the whole API in dev;
      // read/write helpers below just fall through to the DB on failure.
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      // Fail commands at once while disconnected instead of queueing them,
      // so a down Redis never makes a request wait.
      enableOfflineQueue: false,
      // "localhost" can resolve to ::1 first, which some Redis builds (e.g.
      // on Windows) accept and then reset; IPv4 works everywhere.
      family: 4,
      // Keep trying in the background, at most every 30 seconds.
      retryStrategy: (times) => Math.min(times * 1000, 30000),
    });
    this.client.on('error', (err) => {
      // One warning per outage, not one per retry.
      if (!this.warned) this.logger.warn(`Redis error: ${err.message}`);
      this.warned = true;
    });
    this.client.on('ready', () => {
      if (this.warned) this.logger.log('Redis connected');
      this.warned = false;
    });
    this.client
      .connect()
      .catch((err) => this.logger.warn(`Redis unavailable: ${err.message}`));
  }

  /** While Redis is down, caching is skipped and everything reads the DB. */
  private get ready() {
    return this.client.status === 'ready';
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.ready) return null;
    try {
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
    if (!this.ready) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err: any) {
      this.logger.warn(`Cache set failed for ${key}: ${err.message}`);
    }
  }

  async del(...keys: string[]): Promise<void> {
    if (keys.length === 0 || !this.ready) return;
    try {
      await this.client.del(...keys);
    } catch (err: any) {
      this.logger.warn(
        `Cache invalidation failed for ${keys.join(', ')}: ${err.message}`,
      );
    }
  }

  /** Deletes every key matching a prefix, e.g. "grades:index:" */
  async delByPrefix(prefix: string): Promise<void> {
    if (!this.ready) return;
    try {
      const stream = this.client.scanStream({
        match: `${prefix}*`,
        count: 100,
      });
      for await (const keys of stream) {
        if (keys.length) await this.client.del(...keys);
      }
    } catch (err: any) {
      this.logger.warn(
        `Cache prefix invalidation failed for ${prefix}: ${err.message}`,
      );
    }
  }

  /** Cache-aside helper: return the cached value, or compute + cache it. */
  async remember<T>(
    key: string,
    ttlSeconds: number,
    fn: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const fresh = await fn();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }

  async onModuleDestroy() {
    await this.client.quit().catch(() => undefined);
  }
}
