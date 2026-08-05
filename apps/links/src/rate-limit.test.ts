import { describe, expect, it } from 'vitest';

import { fixedClock } from './clock.js';
import { createEnumerationGuard, createRateLimiter } from './rate-limit.js';

describe('createRateLimiter', () => {
  it('allows up to the limit and then refuses', () => {
    const clock = fixedClock(0);
    const limiter = createRateLimiter(clock, { limit: 3, windowSeconds: 60 });
    expect(limiter.consume('a').allowed).toBe(true);
    expect(limiter.consume('a').allowed).toBe(true);
    expect(limiter.consume('a').allowed).toBe(true);
    const refused = limiter.consume('a');
    expect(refused.allowed).toBe(false);
    expect(refused.remaining).toBe(0);
    expect(refused.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('keeps sources independent', () => {
    const clock = fixedClock(0);
    const limiter = createRateLimiter(clock, { limit: 1, windowSeconds: 60 });
    expect(limiter.consume('a').allowed).toBe(true);
    expect(limiter.consume('b').allowed).toBe(true);
    expect(limiter.consume('a').allowed).toBe(false);
  });

  it('resets at the window boundary', () => {
    const clock = fixedClock(0);
    const limiter = createRateLimiter(clock, { limit: 1, windowSeconds: 60 });
    expect(limiter.consume('a').allowed).toBe(true);
    expect(limiter.consume('a').allowed).toBe(false);
    clock.advance(60_000);
    expect(limiter.consume('a').allowed).toBe(true);
  });

  it('bounds how many sources it tracks', () => {
    const clock = fixedClock(0);
    const limiter = createRateLimiter(clock, {
      limit: 10,
      windowSeconds: 60,
      maxTrackedSources: 4,
    });
    for (let index = 0; index < 50; index += 1) {
      limiter.consume(`source-${index}`);
    }
    expect(limiter.trackedSources).toBeLessThanOrEqual(4);
  });
});

describe('createEnumerationGuard', () => {
  it('cuts a source off after too many unknown slugs', () => {
    const clock = fixedClock(0);
    const guard = createEnumerationGuard(clock, { missLimit: 3, requestLimit: 1000 });
    for (let index = 0; index < 3; index += 1) {
      expect(guard.checkRequest('1.2.3').allowed).toBe(true);
      guard.recordMiss('1.2.3');
    }
    expect(guard.checkRequest('1.2.3').allowed).toBe(false);
  });

  it('does not punish a source whose lookups keep hitting', () => {
    const clock = fixedClock(0);
    const guard = createEnumerationGuard(clock, { missLimit: 2, requestLimit: 1000 });
    for (let index = 0; index < 100; index += 1) {
      expect(guard.checkRequest('1.2.3').allowed).toBe(true);
    }
  });

  it('still caps overall volume', () => {
    const clock = fixedClock(0);
    const guard = createEnumerationGuard(clock, { requestLimit: 2, missLimit: 100 });
    expect(guard.checkRequest('1.2.3').allowed).toBe(true);
    expect(guard.checkRequest('1.2.3').allowed).toBe(true);
    expect(guard.checkRequest('1.2.3').allowed).toBe(false);
  });

  it('recovers in the next window', () => {
    const clock = fixedClock(0);
    const guard = createEnumerationGuard(clock, { missLimit: 1, missWindowSeconds: 30 });
    guard.recordMiss('1.2.3');
    expect(guard.checkRequest('1.2.3').allowed).toBe(false);
    clock.advance(30_000);
    expect(guard.checkRequest('1.2.3').allowed).toBe(true);
  });
});
