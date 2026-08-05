import { describe, expect, it } from 'vitest';

import {
  ASSUMED_PRICING,
  centsToMicros,
  createBudgetGuard,
  estimateCostMicros,
  estimateTokens,
} from './budget.js';
import { fixedClock } from './clock.js';
import { createMemoryCounterStore } from './types.js';

function guard(limits?: Parameters<typeof createBudgetGuard>[0]['limits']) {
  const clock = fixedClock('2026-08-04T10:00:00Z');
  const store = createMemoryCounterStore(() => clock.now().getTime());
  return {
    clock,
    store,
    budget: createBudgetGuard({
      store,
      clock,
      ...(limits === undefined ? {} : { limits }),
    }),
  };
}

describe('cost estimation', () => {
  it('counts tokens roughly and prices them from configuration', () => {
    expect(estimateTokens('abcd')).toBe(1);
    expect(estimateCostMicros(ASSUMED_PRICING, 1000, 1000)).toBe(1500);
  });

  it('converts cents to micros', () => {
    expect(centsToMicros(3)).toBe(30_000);
  });
});

describe('createBudgetGuard', () => {
  it('refuses a call whose worst case exceeds the per invocation ceiling', async () => {
    const { budget } = guard();

    const decision = await budget.check({
      workspaceId: 'ws_1',
      worstCaseCostMicros: 40_000,
      invocationBudgetMicros: centsToMicros(3),
    });

    expect(decision.allowed).toBe(false);
    expect(decision.limit).toBe('per_invocation');
  });

  it('refuses before the call once the daily hard cap would be crossed', async () => {
    const { budget } = guard({
      callsPerMinute: 100,
      callsPerDay: 100,
      softDailyCostMicros: 1_000,
      hardDailyCostMicros: 5_000,
    });

    await budget.record('ws_1', 4_500);
    const decision = await budget.check({
      workspaceId: 'ws_1',
      worstCaseCostMicros: 1_000,
      invocationBudgetMicros: 100_000,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.limit).toBe('daily_spend');
    expect(await budget.spentToday('ws_1')).toBe(4_500);
  });

  it('reports a soft alert without blocking the call', async () => {
    const { budget } = guard({
      callsPerMinute: 100,
      callsPerDay: 100,
      softDailyCostMicros: 1_000,
      hardDailyCostMicros: 50_000,
    });

    const decision = await budget.check({
      workspaceId: 'ws_1',
      worstCaseCostMicros: 2_000,
      invocationBudgetMicros: 100_000,
    });

    expect(decision.allowed).toBe(true);
    expect(decision.softAlert).toBe(true);
  });

  it('enforces the per minute call ceiling', async () => {
    const { budget } = guard({
      callsPerMinute: 2,
      callsPerDay: 100,
      softDailyCostMicros: 1_000_000,
      hardDailyCostMicros: 2_000_000,
    });
    const input = {
      workspaceId: 'ws_1',
      worstCaseCostMicros: 1,
      invocationBudgetMicros: 100_000,
    };

    expect((await budget.check(input)).allowed).toBe(true);
    expect((await budget.check(input)).allowed).toBe(true);
    const third = await budget.check(input);

    expect(third.allowed).toBe(false);
    expect(third.limit).toBe('calls_per_minute');
  });

  it('keeps workspaces separate', async () => {
    const { budget } = guard({
      callsPerMinute: 1,
      callsPerDay: 10,
      softDailyCostMicros: 1_000_000,
      hardDailyCostMicros: 2_000_000,
    });
    const input = (workspaceId: string) => ({
      workspaceId,
      worstCaseCostMicros: 1,
      invocationBudgetMicros: 100_000,
    });

    expect((await budget.check(input('ws_1'))).allowed).toBe(true);
    expect((await budget.check(input('ws_2'))).allowed).toBe(true);
    expect((await budget.check(input('ws_1'))).allowed).toBe(false);
  });
});
