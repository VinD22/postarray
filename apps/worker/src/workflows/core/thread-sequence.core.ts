import { type PublishState } from '@relay/contracts';

import type { WorkerActivities } from '../../activities/types.js';
import { MESSAGE_KEYS } from '../../messages.js';
import { stableSort, toIsoInstant } from '../../runtime/deterministic.js';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types.js';
import type {
  ThreadSequenceItemOutcome,
  ThreadSequenceWorkflowInput,
  ThreadSequenceWorkflowOutput,
} from '../inputs.js';
import { parseThreadSequenceOutput } from '../outputs.schema.js';

/**
 * Ordered comments and thread parts, each with its own delay.
 *
 * The root post is already live before this workflow starts. Nothing in here
 * may change that fact: a failed comment produces a `partially_published`
 * campaign and a per item failure, never a failed root post and never a retry
 * that could double-post an item that already landed.
 *
 * Each item chains onto the previous published item, so a gap in the middle of
 * a thread reparents the remainder onto the last item that actually exists
 * rather than orphaning it.
 */

/** Attempts per sequence item. One retry only: an item is cheap to redo by hand. */
export const MAX_SEQUENCE_ITEM_ATTEMPTS = 2;

export async function runThreadSequence(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: ThreadSequenceWorkflowInput,
): Promise<ThreadSequenceWorkflowOutput> {
  const { ctx } = input;
  const ordered = stableSort(input.items, (item) =>
    String(item.order).padStart(6, '0') + item.threadItemId,
  );

  const outcomes: ThreadSequenceItemOutcome[] = [];
  let parentExternalPostId = input.rootExternalPostId;
  let failedCount = 0;
  let externalCreateCount = 0;

  for (const item of ordered) {
    if (runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown) {
      outcomes.push({
        threadItemId: item.threadItemId,
        order: item.order,
        kind: item.kind,
        state: 'canceled',
        externalPostId: null,
        permalink: null,
        publishedAt: null,
        errorCode: null,
        delaySeconds: item.delaySeconds,
      });
      failedCount += 1;
      continue;
    }

    if (item.delaySeconds > 0) {
      await runtime.sleep(item.delaySeconds * 1_000);
    }

    let attempt = 0;
    let state: PublishState = 'failed_permanently';
    let externalPostId: string | null = null;
    let permalink: string | null = null;
    let publishedAt: string | null = null;
    let errorCode: ThreadSequenceItemOutcome['errorCode'] = null;

    while (attempt < MAX_SEQUENCE_ITEM_ATTEMPTS) {
      attempt += 1;
      externalCreateCount += 1;
      const result = await activities.publishSequenceItem({
        ctx,
        publishJobId: input.publishJobId,
        targetId: input.targetId,
        connectionId: input.connectionId,
        contentVersionId: input.contentVersionId,
        threadItemId: item.threadItemId,
        order: item.order,
        rootExternalPostId: input.rootExternalPostId,
        parentExternalPostId,
        attemptId: input.attemptId,
        providerIdempotencyToken: null,
      });

      if (result.outcome === 'published' && result.publication !== null) {
        state = 'published';
        externalPostId = result.publication.externalPostId;
        permalink = result.publication.permalink;
        publishedAt = result.publication.publishedAt;
        errorCode = null;
        break;
      }

      errorCode = result.errorCode;
      if (result.outcome === 'action_required') {
        state = 'action_required';
        break;
      }
      if (result.outcome === 'permanent' || result.outcome === 'unknown') {
        // `unknown` on a sequence item is never recreated. A duplicate comment
        // under a live post is more damaging than a missing one.
        state = result.outcome === 'unknown' ? 'action_required' : 'failed_permanently';
        break;
      }
      // Transient or still processing: one more try, then give up on this item.
      state = 'failed_permanently';
    }

    if (state === 'published' && externalPostId !== null) {
      parentExternalPostId = externalPostId;
      await activities.emitEvent({
        ctx,
        event: 'comment.published',
        resourceId: item.threadItemId,
        payload: {
          publishJobId: input.publishJobId,
          targetId: input.targetId,
          threadItemId: item.threadItemId,
          order: item.order,
          externalPostId,
        },
        dedupeKey: `${input.publishJobId}:${input.targetId}:${item.threadItemId}:published`,
      });
    } else {
      failedCount += 1;
      await activities.emitEvent({
        ctx,
        event: 'comment.failed',
        resourceId: item.threadItemId,
        payload: {
          publishJobId: input.publishJobId,
          targetId: input.targetId,
          threadItemId: item.threadItemId,
          order: item.order,
          errorCode,
          rootExternalPostId: input.rootExternalPostId,
        },
        dedupeKey: `${input.publishJobId}:${input.targetId}:${item.threadItemId}:failed`,
      });
      await activities.notify({
        ctx,
        messageKey: MESSAGE_KEYS.sequence.itemFailed,
        resourceId: item.threadItemId,
        params: { order: String(item.order), targetId: input.targetId },
      });
    }

    outcomes.push({
      threadItemId: item.threadItemId,
      order: item.order,
      kind: item.kind,
      state,
      externalPostId,
      permalink,
      publishedAt,
      errorCode,
      delaySeconds: item.delaySeconds,
    });

    runtime.publishStatus({
      workflowId: runtime.workflowId,
      state: 'running',
      phase: `sequence:${String(item.order)}`,
      paused: runtime.signals.paused,
      cancelRequested: runtime.signals.cancelled !== null,
      scheduledInstant: null,
      attempts: attempt,
      updatedAt: toIsoInstant(runtime.now()),
      targets: [],
    });
  }

  return {
    rootExternalPostId: input.rootExternalPostId,
    items: outcomes,
    failedCount,
    externalCreateCount,
  };
}

export const threadSequenceDescriptor: ChildWorkflowDescriptor<
  ThreadSequenceWorkflowInput,
  ThreadSequenceWorkflowOutput
> = {
  name: 'threadSequenceWorkflow',
  run: runThreadSequence,
  parseResult: parseThreadSequenceOutput,
};
