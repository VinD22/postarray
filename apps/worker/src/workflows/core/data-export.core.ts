import type { WorkerActivities } from '../../activities/types';
import { toIsoInstant } from '../../runtime/deterministic';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types';
import type { DataExportWorkflowInput, DataExportWorkflowOutput } from '../inputs';

/**
 * Build one sanitized JSON archive. The activity owns database reads and
 * storage writes; the workflow only coordinates durable status and retries.
 */
export async function runDataExport(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: DataExportWorkflowInput,
): Promise<DataExportWorkflowOutput> {
  runtime.publishStatus({
    workflowId: runtime.workflowId,
    state: 'running',
    phase: 'building',
    paused: false,
    cancelRequested: false,
    scheduledInstant: null,
    attempts: 0,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [],
  });

  const built = await activities.buildDataExport({
    ctx: input.ctx,
    exportId: input.exportId,
    scope: input.scope,
    format: input.format,
  });

  runtime.publishStatus({
    workflowId: runtime.workflowId,
    state: built.state === 'ready' ? 'completed' : 'failed',
    phase: built.state,
    paused: false,
    cancelRequested: false,
    scheduledInstant: null,
    attempts: 1,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [],
  });

  return {
    exportId: input.exportId,
    state: built.state,
    byteSize: built.byteSize,
    checksumSha256: built.checksumSha256,
  };
}

export const dataExportDescriptor: ChildWorkflowDescriptor<
  DataExportWorkflowInput,
  DataExportWorkflowOutput
> = {
  name: 'dataExportWorkflow',
  run: runDataExport,
};
