import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runBulkImport } from './core/bulk-import.core';
import type { BulkImportWorkflowInput, BulkImportWorkflowOutput } from './inputs';

export async function bulkImportWorkflow(
  input: BulkImportWorkflowInput,
): Promise<BulkImportWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runBulkImport(runtime, workerActivities, input);
}
