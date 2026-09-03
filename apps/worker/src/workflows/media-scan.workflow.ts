import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runMediaScan } from './core/media-scan.core';
import type { MediaScanWorkflowInput, MediaScanWorkflowOutput } from './inputs';

/**
 * Decide whether one uploaded asset may be published.
 *
 * Workflow id: `scan:{workspaceId}:{mediaAssetId}`.
 */
export async function mediaScanWorkflow(
  input: MediaScanWorkflowInput,
): Promise<MediaScanWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runMediaScan(runtime, workerActivities, input);
}
