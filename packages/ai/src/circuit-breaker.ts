import type { Clock } from './clock.js';

/**
 * A small circuit breaker in front of the provider.
 *
 * When the provider is failing, continuing to call it turns one outage into a
 * queue of slow requests. The breaker opens after a run of failures, stays open
 * for a cool-off window, then lets a single probe through.
 */

export const CIRCUIT_STATES = ['closed', 'open', 'half_open'] as const;
export type CircuitState = (typeof CIRCUIT_STATES)[number];

export interface CircuitBreakerOptions {
  readonly failureThreshold: number;
  readonly cooldownMs: number;
  /** Consecutive successes in half-open before the breaker closes again. */
  readonly successThreshold: number;
}

export const DEFAULT_CIRCUIT_OPTIONS: CircuitBreakerOptions = Object.freeze({
  failureThreshold: 5,
  cooldownMs: 30_000,
  successThreshold: 2,
});

export interface CircuitBreaker {
  state(): CircuitState;
  /** Null when closed or half-open. */
  openUntil(): Date | null;
  /** False when the call must not be attempted right now. */
  allow(): boolean;
  recordSuccess(): void;
  recordFailure(): void;
  reset(): void;
}

export function createCircuitBreaker(
  clock: Clock,
  options: CircuitBreakerOptions = DEFAULT_CIRCUIT_OPTIONS,
): CircuitBreaker {
  let state: CircuitState = 'closed';
  let consecutiveFailures = 0;
  let consecutiveSuccesses = 0;
  let openedUntilMs = 0;

  function transitionIfCooledOff(): void {
    if (state === 'open' && clock.now().getTime() >= openedUntilMs) {
      state = 'half_open';
      consecutiveSuccesses = 0;
    }
  }

  return {
    state() {
      transitionIfCooledOff();
      return state;
    },
    openUntil() {
      transitionIfCooledOff();
      return state === 'open' ? new Date(openedUntilMs) : null;
    },
    allow() {
      transitionIfCooledOff();
      return state !== 'open';
    },
    recordSuccess() {
      transitionIfCooledOff();
      consecutiveFailures = 0;
      if (state === 'half_open') {
        consecutiveSuccesses += 1;
        if (consecutiveSuccesses >= options.successThreshold) {
          state = 'closed';
          consecutiveSuccesses = 0;
        }
        return;
      }
      state = 'closed';
    },
    recordFailure() {
      transitionIfCooledOff();
      consecutiveSuccesses = 0;
      consecutiveFailures += 1;
      if (state === 'half_open' || consecutiveFailures >= options.failureThreshold) {
        state = 'open';
        openedUntilMs = clock.now().getTime() + options.cooldownMs;
      }
    },
    reset() {
      state = 'closed';
      consecutiveFailures = 0;
      consecutiveSuccesses = 0;
      openedUntilMs = 0;
    },
  };
}
