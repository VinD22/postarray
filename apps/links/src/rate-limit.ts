import type { Clock } from './clock.js';

/**
 * Enumeration control.
 *
 * Two limiters, because they defend against different things. The request
 * limiter caps how much traffic one source can send at all. The miss limiter
 * caps how many *unknown* slugs one source may probe, which is the actual shape
 * of an enumeration attack: high volume, almost all misses. Slugs are not
 * sequential, and a miss and a disabled link return the identical response, so
 * the attacker learns nothing per attempt either.
 */

export interface RateLimitDecision {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly retryAfterSeconds: number;
}

export interface FixedWindowOptions {
  readonly limit: number;
  readonly windowSeconds: number;
  readonly maxTrackedSources?: number;
}

interface Bucket {
  count: number;
  windowStartMs: number;
}

export interface RateLimiter {
  consume(source: string, cost?: number): RateLimitDecision;
  reset(): void;
  readonly trackedSources: number;
}

/**
 * A fixed window counter. Deliberately not a token bucket: the redirect path
 * must not allocate, and an approximate limit that costs one map lookup is
 * worth more here than an exact one that costs more.
 */
export function createRateLimiter(clock: Clock, options: FixedWindowOptions): RateLimiter {
  const buckets = new Map<string, Bucket>();
  const maxTracked = options.maxTrackedSources ?? 50_000;
  const windowMs = options.windowSeconds * 1000;

  const evictIfNeeded = (): void => {
    if (buckets.size < maxTracked) {
      return;
    }
    const oldest = buckets.keys().next();
    if (!oldest.done) {
      buckets.delete(oldest.value);
    }
  };

  return {
    consume(source: string, cost = 1): RateLimitDecision {
      const now = clock.now();
      const start = Math.floor(now / windowMs) * windowMs;
      const existing = buckets.get(source);
      const bucket: Bucket =
        existing === undefined || existing.windowStartMs !== start
          ? { count: 0, windowStartMs: start }
          : existing;

      if (existing === undefined) {
        evictIfNeeded();
      }
      bucket.count += cost;
      buckets.set(source, bucket);

      const remaining = Math.max(0, options.limit - bucket.count);
      const retryAfterSeconds = Math.max(1, Math.ceil((start + windowMs - now) / 1000));
      return {
        allowed: bucket.count <= options.limit,
        remaining,
        retryAfterSeconds,
      };
    },
    reset(): void {
      buckets.clear();
    },
    get trackedSources(): number {
      return buckets.size;
    },
  };
}

export interface EnumerationGuardOptions {
  /** Total redirect requests one source may make per window. */
  readonly requestLimit?: number;
  readonly requestWindowSeconds?: number;
  /** Unknown-slug lookups one source may make per window. */
  readonly missLimit?: number;
  readonly missWindowSeconds?: number;
  readonly maxTrackedSources?: number;
}

export interface EnumerationGuard {
  /** Called for every request before any lookup happens. */
  checkRequest(source: string): RateLimitDecision;
  /** Called only after a lookup produced nothing. */
  recordMiss(source: string): RateLimitDecision;
  reset(): void;
}

export const DEFAULT_REQUEST_LIMIT = 600;
export const DEFAULT_REQUEST_WINDOW_SECONDS = 60;
export const DEFAULT_MISS_LIMIT = 20;
export const DEFAULT_MISS_WINDOW_SECONDS = 60;

export function createEnumerationGuard(
  clock: Clock,
  options: EnumerationGuardOptions = {},
): EnumerationGuard {
  const requests = createRateLimiter(clock, {
    limit: options.requestLimit ?? DEFAULT_REQUEST_LIMIT,
    windowSeconds: options.requestWindowSeconds ?? DEFAULT_REQUEST_WINDOW_SECONDS,
    maxTrackedSources: options.maxTrackedSources,
  });
  const misses = createRateLimiter(clock, {
    limit: options.missLimit ?? DEFAULT_MISS_LIMIT,
    windowSeconds: options.missWindowSeconds ?? DEFAULT_MISS_WINDOW_SECONDS,
    maxTrackedSources: options.maxTrackedSources,
  });

  return {
    checkRequest(source: string): RateLimitDecision {
      const overall = requests.consume(source, 0);
      if (!overall.allowed) {
        return overall;
      }
      const missState = misses.consume(source, 0);
      if (!missState.allowed) {
        return missState;
      }
      return requests.consume(source);
    },
    recordMiss(source: string): RateLimitDecision {
      return misses.consume(source);
    },
    reset(): void {
      requests.reset();
      misses.reset();
    },
  };
}
