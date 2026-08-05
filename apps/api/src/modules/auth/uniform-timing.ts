import { randomInt } from 'node:crypto';

/**
 * Response timing uniformity for the identity endpoints.
 *
 * Sign-in, password reset, magic link and signup all return the same body, the
 * same status and the same header set whether or not the identity exists. That
 * is only half the defence: if the "no such user" path returns in 40ms and the
 * "wrong password" path returns in 290ms, the timing tells an attacker which
 * usernames are real, and they can enumerate a customer list at leisure.
 *
 * So every one of those handlers is padded to a fixed floor plus uniform
 * jitter. The floor is measured in staging and kept above the p99 of the slow
 * path; the jitter stops the floor itself from becoming a signal.
 *
 * There is a test for this. It samples both paths and asserts the two
 * distributions are statistically indistinguishable.
 */

/** Measured against the slow path in staging. See section 3.6 of the plan. */
export const UNIFORM_RESPONSE_FLOOR_MS = 250;
export const UNIFORM_RESPONSE_JITTER_MS = 50;

export interface TimingOptions {
  readonly floorMs?: number;
  readonly jitterMs?: number;
  /** Injected so a test can run the suite without waiting in real time. */
  readonly sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Run `work`, then wait until at least the floor has elapsed since it started.
 *
 * The elapsed time is measured with a monotonic clock rather than the injected
 * `Clock`, because this is a real-time property of the response and a faked
 * clock would defeat the control it implements.
 */
export async function withUniformTiming<T>(
  work: () => Promise<T>,
  options: TimingOptions = {},
): Promise<T> {
  const floor = options.floorMs ?? UNIFORM_RESPONSE_FLOOR_MS;
  const jitterCeiling = options.jitterMs ?? UNIFORM_RESPONSE_JITTER_MS;
  const sleep = options.sleep ?? defaultSleep;
  const startedAt = performance.now();

  let result: T;
  let failure: unknown;
  try {
    result = await work();
  } catch (error) {
    failure = error;
    result = undefined as T;
  }

  const jitter = jitterCeiling > 0 ? randomInt(0, jitterCeiling) : 0;
  const remaining = floor + jitter - (performance.now() - startedAt);
  if (remaining > 0) {
    await sleep(remaining);
  }

  if (failure !== undefined) {
    // Padding applies to failures too. A fast rejection is itself a signal.
    throw failure;
  }
  return result;
}
