import { createTemporalRuntime, workerActivities } from './temporal-runtime.js';
import { runAnalyticsSync } from './core/analytics-sync.core.js';
import type { AnalyticsSyncWorkflowInput, AnalyticsSyncWorkflowOutput } from './inputs.js';

/**
 * Analytics polling.

 * Workflow id: `analytics:{workspaceId}:{connectionId}` for an account sync,
 * `analytics:{workspaceId}:{connectionId}:{receiptId}` for a post sync.
 */
export async function analyticsSyncWorkflow(
  input: AnalyticsSyncWorkflowInput,
): Promise<AnalyticsSyncWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runAnalyticsSync(runtime, workerActivities, input);
}
