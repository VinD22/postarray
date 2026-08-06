import { describe, expect, it } from 'vitest';

import { withUniformTiming } from './uniform-timing';

/**
 * Response timing uniformity.
 *
 * A fake monotonic clock keeps these security assertions deterministic under
 * parallel CI load. What is being tested is the shape of the control: both the
 * fast path and the slow path leave through the same floor, and a failure is
 * padded exactly like a success. A fast rejection is itself a signal that an
 * identifier does not exist.
 */
const FLOOR_MS = 40;

function timingHarness() {
  let nowMs = 0;
  const sleeps: number[] = [];

  return {
    now: () => nowMs,
    sleep: async (ms: number) => {
      sleeps.push(ms);
      nowMs += ms;
    },
    advance: (ms: number) => {
      nowMs += ms;
    },
    elapsed: () => nowMs,
    sleeps,
  };
}

describe('withUniformTiming', () => {
  it('pads a fast path up to the floor', async () => {
    const timing = timingHarness();
    await withUniformTiming(() => Promise.resolve('found'), {
      floorMs: FLOOR_MS,
      jitterMs: 0,
      now: timing.now,
      sleep: timing.sleep,
    });

    expect(timing.elapsed()).toBe(FLOOR_MS);
    expect(timing.sleeps).toEqual([FLOOR_MS]);
  });

  it('pads a failure the same way it pads a success', async () => {
    const failureTiming = timingHarness();
    await expect(
      withUniformTiming(() => Promise.reject(new Error('no such identity')), {
        floorMs: FLOOR_MS,
        jitterMs: 0,
        now: failureTiming.now,
        sleep: failureTiming.sleep,
      }),
    ).rejects.toThrow('no such identity');

    const successTiming = timingHarness();
    await withUniformTiming(() => Promise.resolve('found'), {
      floorMs: FLOOR_MS,
      jitterMs: 0,
      now: successTiming.now,
      sleep: successTiming.sleep,
    });

    expect(failureTiming.sleeps).toEqual(successTiming.sleeps);
    expect(failureTiming.elapsed()).toBe(successTiming.elapsed());
  });

  it('still rejects with the original error after padding', async () => {
    await expect(
      withUniformTiming(() => Promise.reject(new Error('original')), {
        floorMs: 1,
        jitterMs: 0,
      }),
    ).rejects.toThrow('original');
  });

  it('returns the value the work produced', async () => {
    const result = await withUniformTiming(() => Promise.resolve({ ok: true }), {
      floorMs: 1,
      jitterMs: 0,
    });
    expect(result).toEqual({ ok: true });
  });

  it('does not shorten work that already took longer than the floor', async () => {
    const timing = timingHarness();
    await withUniformTiming(
      () => {
        timing.advance(FLOOR_MS * 2);
        return Promise.resolve('slow');
      },
      {
        floorMs: FLOOR_MS,
        jitterMs: 0,
        now: timing.now,
        sleep: timing.sleep,
      },
    );

    expect(timing.elapsed()).toBe(FLOOR_MS * 2);
    expect(timing.sleeps).toEqual([]);
  });
});
