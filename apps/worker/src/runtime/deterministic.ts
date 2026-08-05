/**
 * Deterministic numbers for workflow code.
 *
 * Workflow code may never call `Math.random()` or `Date.now()`: a replay has to
 * produce the same command sequence it produced the first time. Everything in
 * this module is a pure function of its inputs, so a workflow can derive
 * jitter, shard offsets and poll delays from its own workflow id and still be
 * replayable.
 */

const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;

/** 32 bit FNV-1a. Stable across runtimes and process restarts. */
export function hashString(value: string): number {
  let hash = FNV_OFFSET_BASIS;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index) & 0xff;
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
    hash ^= value.charCodeAt(index) >>> 8;
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return hash >>> 0;
}

/** A stable value in `[0, 1)` derived from the seed. */
export function unitInterval(seed: string): number {
  return hashString(seed) / 0x1_0000_0000;
}

/** A stable integer in `[0, bound)`. `bound` must be positive. */
export function boundedInt(seed: string, bound: number): number {
  if (!Number.isFinite(bound) || bound <= 0) {
    return 0;
  }
  return Math.floor(unitInterval(seed) * bound) % Math.floor(bound);
}

export interface JitterOptions {
  /** Fraction of `baseMs` the jitter may add, for example 0.2 for +/- 20%. */
  readonly ratio: number;
  /** When true the jitter is symmetric around `baseMs` instead of additive. */
  readonly symmetric?: boolean;
}

/**
 * Spread a recurring interval so a thousand connections do not all call a
 * provider in the same second. Never applied to a publish instant the user
 * chose: only to analytics polling, token refresh and feed polling.
 */
export function jitterMs(seed: string, baseMs: number, options: JitterOptions): number {
  const ratio = Math.max(0, Math.min(1, options.ratio));
  const span = baseMs * ratio;
  const unit = unitInterval(seed);
  const offset = options.symmetric === true ? (unit - 0.5) * 2 * span : unit * span;
  return Math.max(0, Math.round(baseMs + offset));
}

export interface BackoffOptions {
  readonly initialMs: number;
  readonly factor: number;
  readonly maxMs: number;
  /** Additive jitter fraction applied deterministically per attempt. */
  readonly jitterRatio?: number;
}

/**
 * Capped exponential backoff with deterministic jitter. `attempt` is 1 based,
 * so the first retry waits `initialMs`.
 */
export function backoffMs(seed: string, attempt: number, options: BackoffOptions): number {
  const safeAttempt = Math.max(1, Math.floor(attempt));
  const raw = options.initialMs * Math.pow(options.factor, safeAttempt - 1);
  const capped = Math.min(options.maxMs, raw);
  const ratio = options.jitterRatio ?? 0;
  if (ratio <= 0) {
    return Math.round(capped);
  }
  return jitterMs(`${seed}:${String(safeAttempt)}`, capped, { ratio });
}

/**
 * The two instant conversions workflow code is allowed to perform.
 *
 * Workflow bodies never touch the `Date` global directly. They call these with
 * a value that came from `runtime.now()` or from their own input, so the result
 * is a pure function of replayed state. Centralising the conversion also means
 * a reviewer can grep for `Date` in `workflows/core` and expect no hits.
 */

export const toIsoInstant = (epochMs: number): string => new Date(epochMs).toISOString();

export const parseInstant = (iso: string): number => Date.parse(iso);

/**
 * Stable ordering key for a set of identifiers. Used where a workflow has to
 * iterate a collection in an order that survives replay even if the caller
 * hands the collection over in a different order.
 */
export function stableSort<T>(items: readonly T[], key: (item: T) => string): T[] {
  return [...items].sort((left, right) => {
    const leftKey = key(left);
    const rightKey = key(right);
    if (leftKey === rightKey) {
      return 0;
    }
    return leftKey < rightKey ? -1 : 1;
  });
}
