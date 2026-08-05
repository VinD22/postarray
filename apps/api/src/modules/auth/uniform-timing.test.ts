import { describe, expect, it } from 'vitest';

import { withUniformTiming } from './uniform-timing';

/**
 * Response timing uniformity.
 *
 * The floor here is deliberately tiny so the suite stays fast. What is being
 * tested is the shape of the control, not the production constant: that both
 * the fast path and the slow path leave through the same floor, and that a
 * failure is padded exactly like a success. A fast rejection is itself a signal
 * that an identifier does not exist.
 */
const FLOOR_MS = 40;

async function elapsed(work: () => Promise<unknown>): Promise<number> {
  const startedAt = performance.now();
  try {
    await work();
  } catch {
    // Measured either way: the padding must apply to failures too.
  }
  return performance.now() - startedAt;
}

describe('withUniformTiming', () => {
  it('pads a fast path up to the floor', async () => {
    const duration = await elapsed(() =>
      withUniformTiming(() => Promise.resolve('found'), { floorMs: FLOOR_MS, jitterMs: 0 }),
    );
    expect(duration).toBeGreaterThanOrEqual(FLOOR_MS - 5);
  });

  it('pads a failure the same way it pads a success', async () => {
    const failure = await elapsed(() =>
      withUniformTiming(() => Promise.reject(new Error('no such identity')), {
        floorMs: FLOOR_MS,
        jitterMs: 0,
      }),
    );
    const success = await elapsed(() =>
      withUniformTiming(() => Promise.resolve('found'), { floorMs: FLOOR_MS, jitterMs: 0 }),
    );

    expect(failure).toBeGreaterThanOrEqual(FLOOR_MS - 5);
    expect(Math.abs(failure - success)).toBeLessThan(FLOOR_MS);
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
    const sleep = (ms: number): Promise<void> =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    const duration = await elapsed(() =>
      withUniformTiming(
        async () => {
          await sleep(FLOOR_MS * 2);
          return 'slow';
        },
        { floorMs: FLOOR_MS, jitterMs: 0 },
      ),
    );
    expect(duration).toBeGreaterThanOrEqual(FLOOR_MS * 2 - 5);
  });
});
