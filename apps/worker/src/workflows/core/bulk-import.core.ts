import type { WorkerActivities } from '../../activities/types';
import { toIsoInstant } from '../../runtime/deterministic';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types';
import type { BulkImportWorkflowInput, BulkImportWorkflowOutput } from '../inputs';

/**
 * Bulk CSV import.
 *
 * The workflow is deliberately two steps and no branches beyond one. It reads
 * back the verdict the parser already recorded, and then, only when a person
 * chose a mode, it applies the rows. A run started by an upload carries
 * `applyMode: null` and therefore ends after the first activity, having created
 * nothing.
 *
 * Both activities are idempotent by the identifiers in this input: the job is
 * stable because the manifest checksum pins it, and each row is stable because
 * its key is unique inside the job. So a worker crash between the two, a
 * duplicated start or a replay all converge on the same drafts rather than on a
 * second set of them.
 *
 * Nothing here reads a clock, iterates an unordered collection or races two
 * promises, which is what makes the replay test in `testing/replay.test.ts` a
 * statement about this file rather than a formality.
 */
export async function runBulkImport(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: BulkImportWorkflowInput,
): Promise<BulkImportWorkflowOutput> {
  runtime.publishStatus({
    workflowId: runtime.workflowId,
    state: 'running',
    phase: 'validating',
    paused: false,
    cancelRequested: false,
    scheduledInstant: null,
    attempts: 0,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [],
  });

  const validated = await activities.readBulkImportVerdict({
    ctx: input.ctx,
    importJobId: input.importJobId,
  });

  if (input.applyMode === null) {
    runtime.publishStatus({
      workflowId: runtime.workflowId,
      state: 'completed',
      phase: validated.state,
      paused: false,
      cancelRequested: false,
      scheduledInstant: null,
      attempts: 1,
      updatedAt: toIsoInstant(runtime.now()),
      targets: [],
    });
    return validated;
  }

  const applied = await activities.applyBulkImportRows({
    ctx: input.ctx,
    importJobId: input.importJobId,
    mode: input.applyMode,
  });

  runtime.publishStatus({
    workflowId: runtime.workflowId,
    state: applied.state === 'failed' ? 'failed' : 'completed',
    phase: applied.state,
    paused: false,
    cancelRequested: false,
    scheduledInstant: null,
    attempts: 2,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [],
  });

  return applied;
}

export const bulkImportDescriptor: ChildWorkflowDescriptor<
  BulkImportWorkflowInput,
  BulkImportWorkflowOutput
> = {
  name: 'bulkImportWorkflow',
  run: runBulkImport,
};
