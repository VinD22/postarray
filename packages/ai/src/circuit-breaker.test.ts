import { describe, expect, it } from 'vitest';

import { createCircuitBreaker } from './circuit-breaker.js';
import type { Clock } from './clock.js';

function movableClock(startMs: number): Clock & { advance(ms: number): void } {
  let current = startMs;
  return {
    now: () => new Date(current),
    advance(ms: number) {
      current += ms;
    },
  };
}

describe('createCircuitBreaker', () => {
  it('stays closed while calls succeed', () => {
    const breaker = createCircuitBreaker(movableClock(0));
    breaker.recordSuccess();
    expect(breaker.state()).toBe('closed');
    expect(breaker.allow()).toBe(true);
  });

  it('opens after the failure threshold and refuses calls', () => {
    const clock = movableClock(0);
    const breaker = createCircuitBreaker(clock, {
      failureThreshold: 3,
      cooldownMs: 1_000,
      successThreshold: 1,
    });

    breaker.recordFailure();
    breaker.recordFailure();
    expect(breaker.allow()).toBe(true);
    breaker.recordFailure();

    expect(breaker.state()).toBe('open');
    expect(breaker.allow()).toBe(false);
    expect(breaker.openUntil()?.getTime()).toBe(1_000);
  });

  it('half opens after the cooldown and closes on a successful probe', () => {
    const clock = movableClock(0);
    const breaker = createCircuitBreaker(clock, {
      failureThreshold: 1,
      cooldownMs: 500,
      successThreshold: 1,
    });

    breaker.recordFailure();
    expect(breaker.allow()).toBe(false);

    clock.advance(500);
    expect(breaker.state()).toBe('half_open');
    expect(breaker.allow()).toBe(true);

    breaker.recordSuccess();
    expect(breaker.state()).toBe('closed');
  });

  it('reopens immediately when the probe fails', () => {
    const clock = movableClock(0);
    const breaker = createCircuitBreaker(clock, {
      failureThreshold: 1,
      cooldownMs: 500,
      successThreshold: 2,
    });

    breaker.recordFailure();
    clock.advance(500);
    expect(breaker.state()).toBe('half_open');

    breaker.recordFailure();
    expect(breaker.state()).toBe('open');
  });

  it('resets on demand', () => {
    const breaker = createCircuitBreaker(movableClock(0), {
      failureThreshold: 1,
      cooldownMs: 1_000,
      successThreshold: 1,
    });
    breaker.recordFailure();
    breaker.reset();
    expect(breaker.state()).toBe('closed');
    expect(breaker.openUntil()).toBeNull();
  });
});
