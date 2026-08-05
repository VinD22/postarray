import type { ProviderId } from '@relay/contracts';

import type { WorkerActivities } from '../../activities/types.js';
import { MESSAGE_KEYS } from '../../messages.js';
import { jitterMs, parseInstant, toIsoInstant } from '../../runtime/deterministic.js';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types.js';
import type {
  AnalyticsSyncWorkflowInput,
  AnalyticsSyncWorkflowOutput,
} from '../inputs.js';

/**
 * Analytics polling on provider appropriate intervals.
 *
 * This is the only workflow allowed to apply jitter, and it applies it only to
 * its own polling cadence. A user's chosen publish time is never moved.
 *
 * Post level polling follows a decaying schedule after publication: dense while
 * a post is young, sparse once the numbers settle. Account level polling runs
 * on a steady interval. Both roll the history over with `continueAsNew`.
 */

/** Post-publication fetch offsets, densest first. */
export const POST_METRIC_OFFSETS_MS: Readonly<Record<string, readonly number[]>> = Object.freeze({
  default: [15 * 60_000, 60 * 60_000, 6 * 60 * 60_000, 24 * 60 * 60_000, 7 * 24 * 60 * 60_000],
  youtube: [60 * 60_000, 6 * 60 * 60_000, 24 * 60 * 60_000, 7 * 24 * 60 * 60_000],
  tiktok: [60 * 60_000, 6 * 60 * 60_000, 24 * 60 * 60_000, 7 * 24 * 60 * 60_000],
  linkedin: [60 * 60_000, 24 * 60 * 60_000, 7 * 24 * 60 * 60_000],
});

/** Iterations before the workflow rolls its history over. */
export const ITERATIONS_PER_RUN = 12;

/** Jitter fraction applied to every analytics wait. */
export const ANALYTICS_JITTER_RATIO = 0.2;

export function offsetsForProvider(provider: ProviderId): readonly number[] {
  return POST_METRIC_OFFSETS_MS[provider] ?? POST_METRIC_OFFSETS_MS.default ?? [];
}

export async function runAnalyticsSync(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: AnalyticsSyncWorkflowInput,
): Promise<AnalyticsSyncWorkflowOutput> {
  const { ctx } = input;
  let pending = [...input.pendingOffsetsMs];
  let iterations = input.iterationsThisRun;
  let total = input.totalIterations;
  let observed = 0;
  let unavailable = 0;

  const finish = (reasonKey: string): AnalyticsSyncWorkflowOutput => ({
    connectionId: input.connectionId,
    totalIterations: total,
    observedCount: observed,
    unavailableCount: unavailable,
    stoppedReasonKey: reasonKey,
  });

  while (iterations < ITERATIONS_PER_RUN) {
    if (runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown) {
      return finish(MESSAGE_KEYS.analytics.syncStopped);
    }

    const nextOffset = pending[0];
    const baseWaitMs =
      nextOffset === undefined
        ? input.steadyIntervalMs
        : Math.max(
            0,
            (input.publishedAt === null ? runtime.now() : parseInstant(input.publishedAt)) +
              nextOffset -
              runtime.now(),
          );
    const waitMs = jitterMs(
      `${input.connectionId}:${String(total)}`,
      baseWaitMs,
      { ratio: ANALYTICS_JITTER_RATIO },
    );
    if (waitMs > 0) {
      await runtime.awaitCondition(
        () => runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown,
        waitMs,
      );
    }
    if (runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown) {
      return finish(MESSAGE_KEYS.analytics.syncStopped);
    }

    const startedAt = toIsoInstant(runtime.now());
    const windowStart = input.publishedAt ?? startedAt;
    // Called through the object, never lifted into a local: an activity proxy
    // resolves the call on property access.
    const request = {
      ctx,
      connectionId: input.connectionId,
      receiptId: input.receiptId,
      cursor: null,
      windowStart,
      windowEnd: toIsoInstant(runtime.now()),
    };
    const result =
      input.receiptId === null
        ? await activities.fetchAccountMetrics(request)
        : await activities.fetchPostMetrics(request);
    observed += result.observedCount;
    unavailable += result.unavailableCount;

    await activities.recordAnalyticsRun({
      ctx,
      connectionId: input.connectionId,
      startedAt,
      finishedAt: toIsoInstant(runtime.now()),
      observedCount: result.observedCount,
      unavailableCount: result.unavailableCount,
      errorCode: null,
    });

    if (result.observedCount > 0) {
      await activities.emitEvent({
        ctx,
        event: 'analytics.updated',
        resourceId: input.receiptId ?? input.connectionId,
        payload: {
          connectionId: input.connectionId,
          receiptId: input.receiptId,
          observedCount: result.observedCount,
          unavailableCount: result.unavailableCount,
        },
        dedupeKey: `analytics:${input.connectionId}:${String(total)}`,
      });
    }

    pending = pending.slice(1);
    iterations += 1;
    total += 1;

    runtime.publishStatus({
      workflowId: runtime.workflowId,
      state: 'running',
      phase: `sync:${String(total)}`,
      paused: false,
      cancelRequested: runtime.signals.cancelled !== null,
      scheduledInstant: null,
      attempts: total,
      updatedAt: toIsoInstant(runtime.now()),
      targets: [],
    });

    // A post level sync stops once its offsets are exhausted; an account level
    // sync runs until it is cancelled.
    if (input.receiptId !== null && pending.length === 0) {
      return finish(MESSAGE_KEYS.analytics.windowExhausted);
    }
  }

  return runtime.continueAsNew({
    ...input,
    pendingOffsetsMs: pending,
    iterationsThisRun: 0,
    totalIterations: total,
  } satisfies AnalyticsSyncWorkflowInput);
}

/** Build the first input for a freshly published post. */
export function initialAnalyticsInput(
  ctx: AnalyticsSyncWorkflowInput['ctx'],
  connectionId: string,
  provider: ProviderId,
  receiptId: string,
  publishedAt: string,
): AnalyticsSyncWorkflowInput {
  return {
    ctx,
    connectionId,
    provider,
    receiptId,
    publishedAt,
    pendingOffsetsMs: offsetsForProvider(provider),
    steadyIntervalMs: 24 * 60 * 60_000,
    iterationsThisRun: 0,
    totalIterations: 0,
  };
}

export const analyticsSyncDescriptor: ChildWorkflowDescriptor<
  AnalyticsSyncWorkflowInput,
  AnalyticsSyncWorkflowOutput
> = {
  name: 'analyticsSyncWorkflow',
  run: runAnalyticsSync,
};
