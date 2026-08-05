import { createTemporalRuntime, workerActivities } from './temporal-runtime.js';
import { runDataDeletion } from './core/data-deletion.core.js';
import type { DataDeletionWorkflowInput, DataDeletionWorkflowOutput } from './inputs.js';

/**
 * Erasure of a workspace or an account.

 * Workflow id: `delete:{workspaceId}:{requestId}`. A `cancel` signal during the
 * grace period aborts cleanly and destroys nothing.
 */
export async function dataDeletionWorkflow(input: DataDeletionWorkflowInput): Promise<DataDeletionWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runDataDeletion(runtime, workerActivities, input);
}
