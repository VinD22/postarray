import type { WorkerActivities } from '../../activities/types.js';
import { MESSAGE_KEYS } from '../../messages.js';
import { stableSort, toIsoInstant } from '../../runtime/deterministic.js';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types.js';
import type {
  DataDeletionWorkflowInput,
  DataDeletionWorkflowOutput,
} from '../inputs.js';

/**
 * Erasure, in the only order that is safe.
 *
 * 1. Wait out the grace period, during which a `cancel` signal aborts cleanly.
 * 2. Cancel every scheduled publish job, so nothing publishes into a workspace
 *    that is being erased.
 * 3. Revoke every provider grant, so our access ends at the provider too.
 * 4. Delete stored objects, page by page, resumable through a cursor.
 * 5. Tombstone analytics. Rows are replaced with a tombstone rather than
 *    dropped, so aggregate history stays honest and a deleted post is reported
 *    as `unavailable`, never as zero.
 *
 * The whole workflow is resumable: every step is idempotent, so a crash halfway
 * through resumes rather than restarting.
 */

/** Object pages deleted per storage call before the cursor advances. */
export const MAX_DELETE_PAGES = 10_000;

export async function runDataDeletion(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: DataDeletionWorkflowInput,
): Promise<DataDeletionWorkflowOutput> {
  const { ctx } = input;

  runtime.publishStatus({
    workflowId: runtime.workflowId,
    state: 'running',
    phase: 'grace_period',
    paused: false,
    cancelRequested: false,
    scheduledInstant: toIsoInstant(runtime.now() + input.graceMs),
    attempts: 0,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [],
  });

  if (input.graceMs > 0) {
    await runtime.awaitCondition(() => runtime.signals.cancelled !== null, input.graceMs);
  }
  if (runtime.signals.cancelled !== null) {
    await activities.notify({
      ctx,
      messageKey: MESSAGE_KEYS.deletion.aborted,
      resourceId: input.requestId,
      params: { requestId: input.requestId },
    });
    return {
      requestId: input.requestId,
      canceledJobCount: 0,
      revokedConnectionCount: 0,
      deletedObjectCount: 0,
      tombstonedReceiptCount: 0,
      status: 'aborted',
    };
  }

  const scope = await activities.loadDeletionScope({ ctx, requestId: input.requestId });

  let canceledJobCount = 0;
  for (const publishJobId of stableSort(scope.publishJobIds, (id) => id)) {
    await activities.cancelScheduledJob({
      ctx,
      publishJobId,
      reasonKey: MESSAGE_KEYS.deletion.started,
    });
    canceledJobCount += 1;
  }

  let revokedConnectionCount = 0;
  for (const connectionId of stableSort(scope.connectionIds, (id) => id)) {
    await activities.revokeProviderConnection({ ctx, connectionId });
    revokedConnectionCount += 1;
  }

  let deletedObjectCount = 0;
  for (const prefix of stableSort(scope.objectPrefixes, (value) => value)) {
    let cursor: string | null = null;
    for (let page = 0; page < MAX_DELETE_PAGES; page += 1) {
      const result = await activities.deleteStoredObjects({
        ctx,
        requestId: input.requestId,
        prefix,
        cursor,
      });
      deletedObjectCount += result.deletedCount;
      cursor = result.nextCursor;
      if (cursor === null) {
        break;
      }
    }
  }

  if (scope.receiptIds.length > 0) {
    await activities.tombstoneAnalytics({
      ctx,
      requestId: input.requestId,
      receiptIds: stableSort(scope.receiptIds, (id) => id),
    });
  }

  await activities.finalizeDeletion({
    ctx,
    requestId: input.requestId,
    completedAt: toIsoInstant(runtime.now()),
    deletedObjectCount,
    canceledJobCount,
    revokedConnectionCount,
  });
  await activities.notify({
    ctx,
    messageKey: MESSAGE_KEYS.deletion.completed,
    resourceId: input.requestId,
    params: { requestId: input.requestId },
  });

  runtime.publishStatus({
    workflowId: runtime.workflowId,
    state: 'completed',
    phase: 'completed',
    paused: false,
    cancelRequested: false,
    scheduledInstant: null,
    attempts: 1,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [],
  });

  return {
    requestId: input.requestId,
    canceledJobCount,
    revokedConnectionCount,
    deletedObjectCount,
    tombstonedReceiptCount: scope.receiptIds.length,
    status: 'completed',
  };
}

export const dataDeletionDescriptor: ChildWorkflowDescriptor<
  DataDeletionWorkflowInput,
  DataDeletionWorkflowOutput
> = {
  name: 'dataDeletionWorkflow',
  run: runDataDeletion,
};
