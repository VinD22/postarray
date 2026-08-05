import type { Clock } from './clock.js';
import type { KillSwitch, ShortLinkRecord } from './types.js';

/**
 * A bounded in-process TTL cache.
 *
 * The architecture puts Redis in front of the database for this lookup. This
 * cache sits in front of Redis: it is the layer that keeps a hot slug from
 * costing a network round trip at all, and it is what makes the redirect path
 * survive a Redis blip. Misses are cached too, with a much shorter TTL, because
 * enumeration traffic is all misses.
 */

interface Entry<T> {
  readonly value: T;
  readonly expiresAtMs: number;
}

export interface TtlCacheOptions {
  readonly maxEntries?: number;
}

export class TtlCache<T> {
  readonly #entries = new Map<string, Entry<T>>();
  readonly #maxEntries: number;
  readonly #clock: Clock;

  constructor(clock: Clock, options: TtlCacheOptions = {}) {
    this.#clock = clock;
    this.#maxEntries = options.maxEntries ?? 10_000;
  }

  get(key: string): T | undefined {
    const entry = this.#entries.get(key);
    if (entry === undefined) {
      return undefined;
    }
    if (entry.expiresAtMs <= this.#clock.now()) {
      this.#entries.delete(key);
      return undefined;
    }
    // Refresh recency for the bounded eviction below.
    this.#entries.delete(key);
    this.#entries.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, ttlSeconds: number): void {
    if (this.#entries.size >= this.#maxEntries) {
      const oldest = this.#entries.keys().next();
      if (!oldest.done) {
        this.#entries.delete(oldest.value);
      }
    }
    this.#entries.set(key, { value, expiresAtMs: this.#clock.now() + ttlSeconds * 1000 });
  }

  delete(key: string): void {
    this.#entries.delete(key);
  }

  clear(): void {
    this.#entries.clear();
  }

  get size(): number {
    return this.#entries.size;
  }
}

/** `null` is a cached miss, which is a real answer and worth remembering. */
export type CachedLookup = ShortLinkRecord | null;

export interface KillSwitchState {
  readonly global: boolean;
  readonly workspaceIds: readonly string[];
  readonly linkIds: readonly string[];
}

export const EMPTY_KILL_SWITCH_STATE: KillSwitchState = {
  global: false,
  workspaceIds: [],
  linkIds: [],
};

export interface MutableKillSwitch extends KillSwitch {
  /**
   * Replace the whole state. The operator flips a flag, a poller reads it and
   * calls this. There is no partial update, so there is no drift.
   */
  apply(state: KillSwitchState): void;
  snapshot(): KillSwitchState;
}

/**
 * An in-memory kill switch. The deployment polls Redis every few seconds and
 * calls `apply`, which is what makes "effective within one request" true in
 * practice: the flag is read from local memory on the hot path, never fetched.
 */
export function createKillSwitch(initial: KillSwitchState = EMPTY_KILL_SWITCH_STATE): MutableKillSwitch {
  let global = initial.global;
  let workspaces = new Set(initial.workspaceIds);
  let links = new Set(initial.linkIds);

  return {
    isGloballyDisabled: () => global,
    isWorkspaceDisabled: (workspaceId: string) => workspaces.has(workspaceId),
    isLinkDisabled: (linkId: string) => links.has(linkId),
    apply(state: KillSwitchState): void {
      global = state.global;
      workspaces = new Set(state.workspaceIds);
      links = new Set(state.linkIds);
    },
    snapshot: () => ({
      global,
      workspaceIds: [...workspaces],
      linkIds: [...links],
    }),
  };
}
