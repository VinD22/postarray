import type { RelayConfig } from '@relay/config';
import type { Logger } from '@relay/observability';
import Redis from 'ioredis';

import type { KeyValueSetOptions, KeyValueStore } from '../application/port';
import { systemClock } from '../common/instant';

/** A store the composition root can shut down cleanly. */
export interface DisconnectableKeyValueStore extends KeyValueStore {
  disconnect(): Promise<void>;
}

/**
 * The key value store, Redis-backed with an in-memory fallback.
 *
 * Everything the edge keeps here is short-lived and reconstructible:
 * verification records for live credentials, rate-limit counters, idempotency
 * responses and pending OAuth transactions. Losing the store signs everyone out
 * and clears the rate limiters; it does not lose a draft, a schedule or a
 * receipt, all of which live in PostgreSQL.
 *
 * The in-memory fallback exists so a developer can run the API with nothing but
 * a database, and so the test suite never opens a socket. It is process-local
 * and therefore wrong across replicas, which is exactly why it refuses to be
 * used in production rather than degrading silently: a rate limiter that only
 * counts one replica's traffic is worse than none, because it reads as working.
 */

interface Entry {
  readonly value: string;
  /** Epoch milliseconds, or null when the entry does not expire. */
  readonly expiresAt: number | null;
}

/** Process-local store for development and tests. */
export class MemoryKeyValueStore implements DisconnectableKeyValueStore {
  private readonly entries = new Map<string, Entry>();

  constructor(private readonly now: () => number = () => systemClock.now().getTime()) {}

  /** Nothing to close. Present so both implementations shut down the same way. */
  disconnect(): Promise<void> {
    this.entries.clear();
    return Promise.resolve();
  }

  private live(key: string): Entry | undefined {
    const entry = this.entries.get(key);
    if (entry === undefined) {
      return undefined;
    }
    if (entry.expiresAt !== null && entry.expiresAt <= this.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry;
  }

  private expiryFor(options: KeyValueSetOptions | undefined): number | null {
    return options?.ttlSeconds === undefined ? null : this.now() + options.ttlSeconds * 1000;
  }

  get(key: string): Promise<string | null> {
    return Promise.resolve(this.live(key)?.value ?? null);
  }

  getAndDelete(key: string): Promise<string | null> {
    const entry = this.live(key);
    if (entry === undefined) {
      return Promise.resolve(null);
    }
    this.entries.delete(key);
    return Promise.resolve(entry.value);
  }

  set(key: string, value: string, options?: KeyValueSetOptions): Promise<void> {
    this.entries.set(key, { value, expiresAt: this.expiryFor(options) });
    return Promise.resolve();
  }

  delete(key: string): Promise<void> {
    this.entries.delete(key);
    return Promise.resolve();
  }

  setIfAbsent(key: string, value: string, options?: KeyValueSetOptions): Promise<boolean> {
    if (this.live(key) !== undefined) {
      return Promise.resolve(false);
    }
    this.entries.set(key, { value, expiresAt: this.expiryFor(options) });
    return Promise.resolve(true);
  }

  increment(key: string, options?: KeyValueSetOptions): Promise<number> {
    return this.incrementBy(key, 1, options);
  }

  incrementBy(key: string, amount: number, options?: KeyValueSetOptions): Promise<number> {
    const existing = this.live(key);
    const next = Number.parseInt(existing?.value ?? '0', 10) + amount;
    this.entries.set(key, {
      value: String(next),
      // The TTL is applied only when the counter is created, so a busy window
      // cannot keep pushing its own expiry out and never reset.
      expiresAt: existing?.expiresAt ?? this.expiryFor(options),
    });
    return Promise.resolve(next);
  }

  ttl(key: string): Promise<number | null> {
    const entry = this.live(key);
    if (entry === undefined || entry.expiresAt === null) {
      return Promise.resolve(null);
    }
    return Promise.resolve(Math.max(0, Math.ceil((entry.expiresAt - this.now()) / 1000)));
  }

  /** Test helper. Never called in shipped code paths. */
  clear(): void {
    this.entries.clear();
  }
}

export class RedisKeyValueStore implements DisconnectableKeyValueStore {
  private constructor(private readonly client: Redis) {}

  /**
   * Connect, or fall back to memory in development.
   *
   * In production a missing `REDIS_URL` is a hard failure. Idempotency replay
   * and rate limiting have to be shared across replicas to mean anything, and a
   * per-replica approximation of "this key was already used" is how a retry
   * publishes twice.
   */
  static async connect(config: RelayConfig, logger: Logger): Promise<DisconnectableKeyValueStore> {
    const url = config.redis.url;
    if (url === undefined) {
      if (config.core.isProduction) {
        throw new Error(
          'REDIS_URL is required in production: idempotency and rate limiting must be shared across replicas.',
        );
      }
      logger.warn({}, 'kv_memory_fallback');
      return new MemoryKeyValueStore();
    }
    const client = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });
    await client.connect();
    logger.info({}, 'kv_redis_connected');
    return new RedisKeyValueStore(client);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async getAndDelete(key: string): Promise<string | null> {
    return this.client.getdel(key);
  }

  async set(key: string, value: string, options?: KeyValueSetOptions): Promise<void> {
    if (options?.ttlSeconds === undefined) {
      await this.client.set(key, value);
      return;
    }
    await this.client.set(key, value, 'EX', options.ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async setIfAbsent(key: string, value: string, options?: KeyValueSetOptions): Promise<boolean> {
    const result =
      options?.ttlSeconds === undefined
        ? await this.client.set(key, value, 'NX')
        : await this.client.set(key, value, 'EX', options.ttlSeconds, 'NX');
    return result === 'OK';
  }

  increment(key: string, options?: KeyValueSetOptions): Promise<number> {
    return this.incrementBy(key, 1, options);
  }

  /**
   * One round trip whatever the amount. The rate limiter charges a cost per
   * request, and adding that cost one unit at a time meant an expensive
   * endpoint made several Redis calls just to account for itself.
   */
  async incrementBy(key: string, amount: number, options?: KeyValueSetOptions): Promise<number> {
    const next = await this.client.incrby(key, amount);
    // Only the creating call sets the expiry, so a window cannot extend itself.
    if (next === amount && options?.ttlSeconds !== undefined) {
      await this.client.expire(key, options.ttlSeconds);
    }
    return next;
  }

  async ttl(key: string): Promise<number | null> {
    const seconds = await this.client.ttl(key);
    return seconds < 0 ? null : seconds;
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
