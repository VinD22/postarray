/**
 * The wall clock.
 *
 * Workflow code must never read this: it uses `runtime.now()`, which Temporal
 * replays. Everything else in the worker, activities, the bootstrap and the
 * inline fallback, legitimately needs the real time, and reads it here so the
 * two are never confused and so a test can find every wall-clock read with one
 * grep.
 */

/** Epoch milliseconds, right now. */
// eslint-disable-next-line no-restricted-globals -- the sanctioned wall-clock read
export const nowMs = (): number => Date.now();

/** The current instant as an ISO 8601 string with an offset. */
// eslint-disable-next-line no-restricted-globals -- the sanctioned wall-clock read
export const nowIso = (): string => new Date().toISOString();
