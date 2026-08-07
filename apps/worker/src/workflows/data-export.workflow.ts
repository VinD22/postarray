import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runDataExport } from './core/data-export.core';
import type { DataExportWorkflowInput, DataExportWorkflowOutput } from './inputs';

export async function dataExportWorkflow(
  input: DataExportWorkflowInput,
): Promise<DataExportWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runDataExport(runtime, workerActivities, input);
}
