import type { WorkerActivities } from '../../activities/types.js';
import { MESSAGE_KEYS } from '../../messages.js';
import { jitterMs, toIsoInstant } from '../../runtime/deterministic.js';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types.js';
import type { RssPollWorkflowInput, RssPollWorkflowOutput } from '../inputs.js';

/**
 * Feed polling.
 *
 * The fetch itself is an activity with an SSRF guard: the URL is resolved and
 * the resolved address is checked against private, loopback, link local and
 * metadata ranges before a byte is read, and redirects are re-checked rather
 * than followed blindly.
 *
 * Deduplication happens in three layers, in this order: the item GUID, the
 * canonical link, and a fingerprint over the normalized title and body. A feed
 * that recycles GUIDs or rewrites links therefore still cannot produce a second
 * draft for the same story.
 */

/** Failures in a row before the feed is disabled and the owner is told. */
export const MAX_CONSECUTIVE_FAILURES = 8;

/** Polls per run before the history is rolled over. */
export const POLLS_PER_RUN = 24;

/** Jitter fraction so a thousand feeds do not fire on the same second. */
export const FEED_JITTER_RATIO = 0.25;

export function failureBackoffMs(intervalMs: number, consecutiveFailures: number): number {
  const factor = Math.min(8, Math.pow(2, Math.max(0, consecutiveFailures - 1)));
  return intervalMs * factor;
}

export async function runRssPoll(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: RssPollWorkflowInput,
): Promise<RssPollWorkflowOutput> {
  const { ctx } = input;
  let etag = input.etag;
  let lastModified = input.lastModified;
  let consecutiveFailures = input.consecutiveFailures;
  let totalPolls = input.totalPolls;
  let newItemCount = 0;

  const finish = (reasonKey: string): RssPollWorkflowOutput => ({
    feedId: input.feedId,
    totalPolls,
    newItemCount,
    stoppedReasonKey: reasonKey,
  });

  for (let poll = input.pollsThisRun; poll < POLLS_PER_RUN; poll += 1) {
    if (runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown) {
      return finish(MESSAGE_KEYS.rss.pollStopped);
    }
    if (runtime.signals.paused) {
      await runtime.awaitCondition(
        () => !runtime.signals.paused || runtime.signals.cancelled !== null,
      );
      continue;
    }

    const baseWaitMs =
      consecutiveFailures > 0
        ? failureBackoffMs(input.intervalMs, consecutiveFailures)
        : input.intervalMs;
    const waitMs = jitterMs(`${input.feedId}:${String(totalPolls)}`, baseWaitMs, {
      ratio: FEED_JITTER_RATIO,
    });
    await runtime.awaitCondition(
      () =>
        runtime.signals.cancelled !== null ||
        runtime.signals.killSwitchThrown ||
        runtime.signals.paused,
      waitMs,
    );
    if (runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown) {
      return finish(MESSAGE_KEYS.rss.pollStopped);
    }

    const polledAt = toIsoInstant(runtime.now());
    const fetched = await activities.fetchFeed({ ctx, feedId: input.feedId, etag, lastModified });
    totalPolls += 1;

    if (fetched.errorCode !== null) {
      consecutiveFailures += 1;
      await activities.recordFeedPoll({
        ctx,
        feedId: input.feedId,
        polledAt,
        itemCount: 0,
        newItemCount: 0,
        errorCode: fetched.errorCode,
      });
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        await activities.notify({
          ctx,
          messageKey: MESSAGE_KEYS.rss.feedDisabled,
          resourceId: input.feedId,
          params: { feedId: input.feedId },
        });
        return finish(MESSAGE_KEYS.rss.feedDisabled);
      }
      continue;
    }

    consecutiveFailures = 0;
    etag = fetched.etag;
    lastModified = fetched.lastModified;

    if (!fetched.changed || fetched.items.length === 0) {
      await activities.recordFeedPoll({
        ctx,
        feedId: input.feedId,
        polledAt,
        itemCount: fetched.items.length,
        newItemCount: 0,
        errorCode: null,
      });
      continue;
    }

    const filtered = await activities.filterNewFeedItems({
      ctx,
      feedId: input.feedId,
      items: fetched.items,
    });

    if (filtered.newItems.length > 0) {
      const processed = await activities.processFeedItems({
        ctx,
        feedId: input.feedId,
        items: filtered.newItems,
      });
      newItemCount += filtered.newItems.length;
      await activities.emitEvent({
        ctx,
        event: 'rss.item_processed',
        resourceId: input.feedId,
        payload: {
          feedId: input.feedId,
          newItemCount: filtered.newItems.length,
          duplicateCount: filtered.duplicateCount,
          createdContentItemIds: processed.createdContentItemIds,
        },
        dedupeKey: `rss:${input.feedId}:${String(totalPolls)}`,
      });
    }

    await activities.recordFeedPoll({
      ctx,
      feedId: input.feedId,
      polledAt,
      itemCount: fetched.items.length,
      newItemCount: filtered.newItems.length,
      errorCode: null,
    });

    runtime.publishStatus({
      workflowId: runtime.workflowId,
      state: 'running',
      phase: `polled:${String(totalPolls)}`,
      paused: runtime.signals.paused,
      cancelRequested: runtime.signals.cancelled !== null,
      scheduledInstant: null,
      attempts: totalPolls,
      updatedAt: toIsoInstant(runtime.now()),
      targets: [],
    });
  }

  return runtime.continueAsNew({
    ...input,
    etag,
    lastModified,
    consecutiveFailures,
    pollsThisRun: 0,
    totalPolls,
  } satisfies RssPollWorkflowInput);
}

export const rssPollDescriptor: ChildWorkflowDescriptor<
  RssPollWorkflowInput,
  RssPollWorkflowOutput
> = {
  name: 'rssPollWorkflow',
  run: runRssPoll,
};
