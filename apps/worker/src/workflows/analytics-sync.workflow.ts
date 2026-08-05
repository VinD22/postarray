import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runAnalyticsSync } from './core/analytics-sync.core';
import type { AnalyticsSyncWorkflowInput, AnalyticsSyncWorkflowOutput } from './inputs';

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
