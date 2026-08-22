import { ERROR_CODES, RelayError } from '@relay/contracts';

import type { ActorContext, AiCallMeta, ServiceDeps } from '../types';
import type { Db } from './runtime';

/**
 * The monthly spend ceiling, and where AI usage is recorded.
 *
 * `@relay/ai` already enforces per-call, per-minute and per-day limits inside
 * the gateway. It cannot enforce the monthly one, because a daily counter in
 * Redis is not a durable record of what a workspace spent this month. That
 * record is `private.usage_events`, which is where the publish path already
 * writes its meters, so this reads and writes the same table through the same
 * `BillingGateway.recordUsage` port rather than inventing a second ledger.
 *
 * The check runs BEFORE the model call, against the spend already recorded. A
 * workspace over the ceiling gets `QUOTA_EXCEEDED` with a user-safe key, never
 * a silent empty answer and never an unbounded bill.
 */

/** The meter the assistant's dollar spend accumulates under, in micros of USD. */
export const AI_COST_METER_KEY = 'ai.cost_micros';
export const AI_INPUT_TOKEN_METER_KEY = 'ai_text_input_tokens';
export const AI_OUTPUT_TOKEN_METER_KEY = 'ai_text_output_tokens';

const MICROS_PER_USD = 1_000_000;

function startOfUtcMonth(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/** What this workspace has spent on assistance so far this calendar month. */
export async function monthlyAiSpendMicros(db: Db, now: Date): Promise<number> {
  const aggregate = await db.usageEvent.aggregate({
    where: { meterKey: AI_COST_METER_KEY, occurredAt: { gte: startOfUtcMonth(now) } },
    _sum: { quantity: true },
  });
  return Number(aggregate._sum.quantity ?? 0);
}

export interface AiSpendVerdict {
  readonly allowed: boolean;
  readonly spentMicros: number;
  readonly ceilingMicros: number;
}

export function ceilingMicrosFor(deps: ServiceDeps): number {
  return Math.round(deps.config.ai.maxMonthlyUsdPerWorkspace * MICROS_PER_USD);
}

/**
 * Refuse the call when the workspace is already at or over its monthly ceiling.
 *
 * Deliberately checked against spend already recorded rather than against spend
 * plus a forecast: the gateway's own per-invocation ceiling bounds how far a
 * single call can carry us past the line, and a forecast that refused a cheap
 * call would be a worse lie than a small overshoot.
 */
export async function assertMonthlyAiBudget(
  deps: ServiceDeps,
  ctx: ActorContext,
  db: Db,
): Promise<AiSpendVerdict> {
  const ceilingMicros = ceilingMicrosFor(deps);
  const spentMicros = await monthlyAiSpendMicros(db, deps.clock.now());
  if (ceilingMicros <= 0 || spentMicros >= ceilingMicros) {
    deps.logger.warn(
      {
        workspaceId: ctx.workspaceId,
        correlationId: ctx.correlationId,
        spentMicros,
        ceilingMicros,
      },
      'assistant.budget.blocked',
    );
    throw new RelayError(ERROR_CODES.QUOTA_EXCEEDED, {
      messageKey: 'error.ai_budget_exceeded.message',
      retryable: false,
      correlationId: ctx.correlationId,
      details: { limit: 'monthly_workspace_spend' },
    });
  }
  return { allowed: true, spentMicros, ceilingMicros };
}

/**
 * Record what the call actually cost.
 *
 * Three rows, all idempotent on the same correlation id plus meter, so a retry
 * of the same turn cannot double-charge: the dollar meter the ceiling reads,
 * and the two token meters the price book already knows about.
 */
export async function recordAiUsage(
  deps: ServiceDeps,
  ctx: ActorContext,
  meta: AiCallMeta,
): Promise<void> {
  const reference = `${ctx.correlationId}:${meta.promptId}:${meta.promptVersion}`;
  await Promise.all([
    deps.billing.recordUsage({
      workspaceId: ctx.workspaceId,
      key: AI_COST_METER_KEY,
      quantity: meta.costMicros,
      idempotencyKey: `${AI_COST_METER_KEY}:${reference}`,
    }),
    deps.billing.recordUsage({
      workspaceId: ctx.workspaceId,
      key: AI_INPUT_TOKEN_METER_KEY,
      quantity: meta.inputTokens,
      idempotencyKey: `${AI_INPUT_TOKEN_METER_KEY}:${reference}`,
    }),
    deps.billing.recordUsage({
      workspaceId: ctx.workspaceId,
      key: AI_OUTPUT_TOKEN_METER_KEY,
      quantity: meta.outputTokens,
      idempotencyKey: `${AI_OUTPUT_TOKEN_METER_KEY}:${reference}`,
    }),
  ]);
}
