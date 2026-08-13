import type { Clock } from './clock';
import type { AiCounterStore } from './types';

/**
 * Per-workspace budgets, enforced BEFORE a provider call is made.
 *
 * These exist for abuse and cost control, not to create a lower feature tier:
 * every subscriber gets the same limits. The spend caps are checked against the
 * worst case cost of the call being attempted, so a single expensive request
 * cannot step over the ceiling and apologise afterwards.
 */

export interface AiBudgetLimits {
  readonly callsPerMinute: number;
  readonly callsPerDay: number;
  /** Notify the workspace owner past this daily spend. */
  readonly softDailyCostMicros: number;
  /** Refuse past this daily spend. */
  readonly hardDailyCostMicros: number;
}

const USD_CENT_IN_MICROS = 10_000;
const USD_IN_MICROS = 1_000_000;

export const DEFAULT_BUDGET_LIMITS: AiBudgetLimits = Object.freeze({
  callsPerMinute: 60,
  callsPerDay: 1500,
  softDailyCostMicros: 8 * USD_IN_MICROS,
  hardDailyCostMicros: 20 * USD_IN_MICROS,
});

/**
 * Token prices in micros of USD per token.
 *
 * Provider pricing is volatile. This is configuration with a documented
 * verification date, never a hard fact, and the billing model treats it as an
 * assumption. Re-verify before any financial commitment.
 */
export interface TokenPricing {
  readonly inputMicrosPerToken: number;
  readonly outputMicrosPerToken: number;
  readonly source: string;
  readonly verifiedAt: string;
}

export const ASSUMED_PRICING: TokenPricing = Object.freeze({
  inputMicrosPerToken: 0.3,
  outputMicrosPerToken: 1.2,
  source: 'configuration default, unverified',
  verifiedAt: '2026-08-04',
});

/**
 * Anthropic's published list price for `claude-sonnet-5`: 3 USD per million
 * input tokens and 15 USD per million output tokens, which is 3 and 15 micros
 * per token. Recorded from the provider adapter's specification rather than
 * read from a live price list, so it carries the same "assumption" status as
 * every other entry here.
 */
export const ANTHROPIC_SONNET_PRICING: TokenPricing = Object.freeze({
  inputMicrosPerToken: 3,
  outputMicrosPerToken: 15,
  source: 'anthropic list price for claude-sonnet-5, recorded from configuration, unverified',
  verifiedAt: '2026-08-12',
});

/**
 * Per-model rates.
 *
 * Keyed by model rather than by provider because the price is a property of the
 * model, and a deployment that pins a different model must not silently inherit
 * another one's rate. An unknown model falls back to `ASSUMED_PRICING`, which
 * is the conservative default the budget guard was written against.
 */
export const PRICING_BY_MODEL: Readonly<Record<string, TokenPricing>> = Object.freeze({
  'deepseek-v4-flash': ASSUMED_PRICING,
  'claude-sonnet-5': ANTHROPIC_SONNET_PRICING,
});

export function pricingForModel(model: string): TokenPricing {
  return PRICING_BY_MODEL[model] ?? ASSUMED_PRICING;
}

/** Rough token estimate used only for pre-call budgeting, never for billing. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function estimateCostMicros(
  pricing: TokenPricing,
  inputTokens: number,
  outputTokens: number,
): number {
  return Math.ceil(
    inputTokens * pricing.inputMicrosPerToken + outputTokens * pricing.outputMicrosPerToken,
  );
}

export function centsToMicros(cents: number): number {
  return cents * USD_CENT_IN_MICROS;
}

export const BUDGET_LIMIT_NAMES = [
  'calls_per_minute',
  'calls_per_day',
  'daily_spend',
  'per_invocation',
] as const;
export type BudgetLimitName = (typeof BUDGET_LIMIT_NAMES)[number];

export interface BudgetDecision {
  readonly allowed: boolean;
  readonly limit: BudgetLimitName | null;
  /** True once the soft daily threshold is crossed. The call still proceeds. */
  readonly softAlert: boolean;
  readonly spentMicrosToday: number;
  readonly callsToday: number;
}

export interface BudgetCheckInput {
  readonly workspaceId: string;
  /** Worst case cost of the call about to be made. */
  readonly worstCaseCostMicros: number;
  /** Hard per-invocation ceiling from the prompt module. */
  readonly invocationBudgetMicros: number;
}

export interface AiBudgetGuard {
  check(input: BudgetCheckInput): Promise<BudgetDecision>;
  /** Record the real cost once the provider has answered. */
  record(workspaceId: string, actualCostMicros: number): Promise<void>;
  spentToday(workspaceId: string): Promise<number>;
}

const MINUTE_SECONDS = 60;
const DAY_SECONDS = 86_400;

function minuteKey(workspaceId: string, now: Date): string {
  return `ai:calls:min:${workspaceId}:${Math.floor(now.getTime() / 60_000)}`;
}

function dayKey(workspaceId: string, now: Date, suffix: string): string {
  return `ai:${suffix}:day:${workspaceId}:${now.toISOString().slice(0, 10)}`;
}

/**
 * Counter-backed guard. Redis in production, in-memory counters in tests. The
 * call counters are incremented during `check` so a burst of concurrent
 * requests cannot all observe the same pre-increment total.
 */
export function createBudgetGuard(deps: {
  readonly store: AiCounterStore;
  readonly clock: Clock;
  readonly limits?: AiBudgetLimits;
}): AiBudgetGuard {
  const limits = deps.limits ?? DEFAULT_BUDGET_LIMITS;

  return {
    async check(input) {
      const now = deps.clock.now();
      const spent = await deps.store.read(dayKey(input.workspaceId, now, 'cost'));

      if (input.worstCaseCostMicros > input.invocationBudgetMicros) {
        return {
          allowed: false,
          limit: 'per_invocation',
          softAlert: false,
          spentMicrosToday: spent,
          callsToday: await deps.store.read(dayKey(input.workspaceId, now, 'calls')),
        };
      }

      if (spent + input.worstCaseCostMicros > limits.hardDailyCostMicros) {
        return {
          allowed: false,
          limit: 'daily_spend',
          softAlert: true,
          spentMicrosToday: spent,
          callsToday: await deps.store.read(dayKey(input.workspaceId, now, 'calls')),
        };
      }

      const perMinute = await deps.store.increment(
        minuteKey(input.workspaceId, now),
        1,
        MINUTE_SECONDS * 2,
      );
      const perDay = await deps.store.increment(
        dayKey(input.workspaceId, now, 'calls'),
        1,
        DAY_SECONDS,
      );

      if (perMinute > limits.callsPerMinute) {
        return {
          allowed: false,
          limit: 'calls_per_minute',
          softAlert: false,
          spentMicrosToday: spent,
          callsToday: perDay,
        };
      }
      if (perDay > limits.callsPerDay) {
        return {
          allowed: false,
          limit: 'calls_per_day',
          softAlert: false,
          spentMicrosToday: spent,
          callsToday: perDay,
        };
      }

      return {
        allowed: true,
        limit: null,
        softAlert: spent + input.worstCaseCostMicros > limits.softDailyCostMicros,
        spentMicrosToday: spent,
        callsToday: perDay,
      };
    },

    async record(workspaceId, actualCostMicros) {
      if (actualCostMicros <= 0) {
        return;
      }
      await deps.store.increment(
        dayKey(workspaceId, deps.clock.now(), 'cost'),
        actualCostMicros,
        DAY_SECONDS,
      );
    },

    async spentToday(workspaceId) {
      return deps.store.read(dayKey(workspaceId, deps.clock.now(), 'cost'));
    },
  };
}
