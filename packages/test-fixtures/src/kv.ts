import type { Clock } from './clock';
import { FakeClock } from './clock';

/**
 * A controllable key value store.
 *
 * It matches the Redis-backed port the application layer injects, but every
 * moving part is under the test's control: expiry is driven by an injected
 * clock rather than by real time, and failures are injected on demand so an
 * idempotency test can assert what happens when the store is briefly
 * unavailable rather than hoping it never is.
 */

export interface KeyValueStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: { ttlSeconds?: number }): Promise<void>;
  /** Atomic. Returns false when the key already exists: the idempotency latch. */
  setIfAbsent<T>(key: string, value: T, options?: { ttlSeconds?: number }): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  increment(key: string, by?: number): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<boolean>;
  ttlSeconds(key: string): Promise<number | null>;
  keys(prefix?: string): Promise<readonly string[]>;
  clear(): Promise<void>;
}

export const KV_OPERATIONS = [
  'get',
  'set',
  'setIfAbsent',
  'delete',
  'increment',
  'expire',
  'ttlSeconds',
  'keys',
] as const;
export type KvOperation = (typeof KV_OPERATIONS)[number];

interface Entry {
  readonly value: unknown;
  /** Epoch milliseconds, or null when the entry never expires. */
  readonly expiresAtMs: number | null;
}

export interface ControllableKeyValueStoreOptions {
  readonly clock?: Clock;
}

export class ControllableKeyValueStore implements KeyValueStore {
  private readonly entries = new Map<string, Entry>();
  private readonly failures = new Map<KvOperation, { remaining: number; error: Error }>();
  private readonly clock: Clock;

  /** Every operation performed, in order. Assert on this, not on internals. */
  readonly calls: Array<{ operation: KvOperation; key: string }> = [];

  constructor(options: ControllableKeyValueStoreOptions = {}) {
    this.clock = options.clock ?? new FakeClock();
  }

  /** Make the next `times` calls to `operation` reject. */
  failNext(operation: KvOperation, times = 1, error = new Error('KV_UNAVAILABLE')): void {
    this.failures.set(operation, { remaining: times, error });
  }

  private guard(operation: KvOperation, key: string): void {
    this.calls.push({ operation, key });
    const failure = this.failures.get(operation);
    if (failure === undefined || failure.remaining <= 0) {
      return;
    }
    failure.remaining -= 1;
    if (failure.remaining <= 0) {
      this.failures.delete(operation);
    }
    throw failure.error;
  }

  private live(key: string): Entry | null {
    const entry = this.entries.get(key);
    if (entry === undefined) {
      return null;
    }
    if (entry.expiresAtMs !== null && entry.expiresAtMs <= this.clock.now().getTime()) {
      this.entries.delete(key);
      return null;
    }
    return entry;
  }

  private expiryFor(ttlSeconds: number | undefined): number | null {
    return ttlSeconds === undefined ? null : this.clock.now().getTime() + ttlSeconds * 1_000;
  }

  async get<T>(key: string): Promise<T | null> {
    this.guard('get', key);
    const entry = this.live(key);
    return entry === null ? null : (structuredClone(entry.value) as T);
  }

  async set<T>(key: string, value: T, options: { ttlSeconds?: number } = {}): Promise<void> {
    this.guard('set', key);
    this.entries.set(key, {
      value: structuredClone(value),
      expiresAtMs: this.expiryFor(options.ttlSeconds),
    });
  }

  async setIfAbsent<T>(
    key: string,
    value: T,
    options: { ttlSeconds?: number } = {},
  ): Promise<boolean> {
    this.guard('setIfAbsent', key);
    if (this.live(key) !== null) {
      return false;
    }
    this.entries.set(key, {
      value: structuredClone(value),
      expiresAtMs: this.expiryFor(options.ttlSeconds),
    });
    return true;
  }

  async delete(key: string): Promise<boolean> {
    this.guard('delete', key);
    const existed = this.live(key) !== null;
    this.entries.delete(key);
    return existed;
  }

  async increment(key: string, by = 1): Promise<number> {
    this.guard('increment', key);
    const entry = this.live(key);
    const current = typeof entry?.value === 'number' ? entry.value : 0;
    const next = current + by;
    this.entries.set(key, { value: next, expiresAtMs: entry?.expiresAtMs ?? null });
    return next;
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    this.guard('expire', key);
    const entry = this.live(key);
    if (entry === null) {
      return false;
    }
    this.entries.set(key, { value: entry.value, expiresAtMs: this.expiryFor(ttlSeconds) });
    return true;
  }

  async ttlSeconds(key: string): Promise<number | null> {
    this.guard('ttlSeconds', key);
    const entry = this.live(key);
    if (entry === null || entry.expiresAtMs === null) {
      return null;
    }
    return Math.ceil((entry.expiresAtMs - this.clock.now().getTime()) / 1_000);
  }

  async keys(prefix = ''): Promise<readonly string[]> {
    this.guard('keys', prefix);
    const out: string[] = [];
    for (const key of [...this.entries.keys()]) {
      if (key.startsWith(prefix) && this.live(key) !== null) {
        out.push(key);
      }
    }
    return out.sort();
  }

  async clear(): Promise<void> {
    this.entries.clear();
    this.calls.length = 0;
    this.failures.clear();
  }

  /** How many keys are live right now. Expired keys are not counted. */
  size(): number {
    let count = 0;
    for (const key of [...this.entries.keys()]) {
      if (this.live(key) !== null) {
        count += 1;
      }
    }
    return count;
  }
}
