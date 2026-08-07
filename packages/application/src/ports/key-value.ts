import type { Clock, KeyValueSetOptions, KeyValueStore } from '../types';

import { systemClock } from './clock';

/**
 * The default key value store: in process, with real TTL semantics.
 *
 * It exists so the whole product runs with no external services. It is correct
 * for a single process (development, tests, the CLI) and deliberately not
 * shared, so a multi-instance deployment must configure the Redis-backed store
 * below rather than silently getting per-instance idempotency.
 */
export class MemoryKeyValueStore implements KeyValueStore {
  readonly #entries = new Map<string, { value: string; expiresAtMs: number | null }>();
  readonly #clock: Clock;

  constructor(clock: Clock = systemClock) {
    this.#clock = clock;
  }

  #live(key: string): { value: string; expiresAtMs: number | null } | null {
    const entry = this.#entries.get(key);
    if (entry === undefined) {
      return null;
    }
    if (entry.expiresAtMs !== null && entry.expiresAtMs <= this.#clock.now().getTime()) {
      this.#entries.delete(key);
      return null;
    }
    return entry;
  }

  async get(key: string): Promise<string | null> {
    return this.#live(key)?.value ?? null;
  }

  async getAndDelete(key: string): Promise<string | null> {
    const value = this.#live(key)?.value ?? null;
    this.#entries.delete(key);
    return value;
  }

  async set(key: string, value: string, options: KeyValueSetOptions = {}): Promise<boolean> {
    if (options.ifAbsent === true && this.#live(key) !== null) {
      return false;
    }
    const expiresAtMs =
      options.ttlSeconds === undefined
        ? null
        : this.#clock.now().getTime() + options.ttlSeconds * 1000;
    this.#entries.set(key, { value, expiresAtMs });
    return true;
  }

  async delete(key: string): Promise<void> {
    this.#entries.delete(key);
  }

  async increment(key: string, amount = 1, ttlSeconds?: number): Promise<number> {
    const current = this.#live(key);
    const next = Number.parseInt(current?.value ?? '0', 10) + amount;
    const expiresAtMs =
      current?.expiresAtMs ??
      (ttlSeconds === undefined ? null : this.#clock.now().getTime() + ttlSeconds * 1000);
    this.#entries.set(key, { value: String(next), expiresAtMs });
    return next;
  }

  async close(): Promise<void> {
    this.#entries.clear();
  }

  /** Test affordance. Never called on a product path. */
  size(): number {
    return this.#entries.size;
  }
}

/**
 * The subset of a Redis client this package uses. Declaring it structurally
 * keeps `ioredis` out of the dependency graph of the domain layer: the process
 * that owns the connection passes its client in.
 */
export interface RedisLikeClient {
  get(key: string): Promise<string | null>;
  getdel(key: string): Promise<string | null>;
  set(key: string, value: string, ...args: readonly (string | number)[]): Promise<string | null>;
  del(key: string): Promise<number>;
  incrby(key: string, amount: number): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  quit(): Promise<unknown>;
}

/** Redis-backed store for deployments that run more than one process. */
export class RedisKeyValueStore implements KeyValueStore {
  readonly #client: RedisLikeClient;
  readonly #prefix: string;

  constructor(client: RedisLikeClient, prefix = 'relay:') {
    this.#client = client;
    this.#prefix = prefix;
  }

  #key(key: string): string {
    return `${this.#prefix}${key}`;
  }

  async get(key: string): Promise<string | null> {
    return this.#client.get(this.#key(key));
  }

  async getAndDelete(key: string): Promise<string | null> {
    return this.#client.getdel(this.#key(key));
  }

  async set(key: string, value: string, options: KeyValueSetOptions = {}): Promise<boolean> {
    const args: (string | number)[] = [];
    if (options.ttlSeconds !== undefined) {
      args.push('EX', Math.max(1, Math.ceil(options.ttlSeconds)));
    }
    if (options.ifAbsent === true) {
      args.push('NX');
    }
    const result = await this.#client.set(this.#key(key), value, ...args);
    return result !== null;
  }

  async delete(key: string): Promise<void> {
    await this.#client.del(this.#key(key));
  }

  async increment(key: string, amount = 1, ttlSeconds?: number): Promise<number> {
    const next = await this.#client.incrby(this.#key(key), amount);
    if (ttlSeconds !== undefined && next === amount) {
      await this.#client.expire(this.#key(key), Math.max(1, Math.ceil(ttlSeconds)));
    }
    return next;
  }

  async close(): Promise<void> {
    await this.#client.quit();
  }
}
