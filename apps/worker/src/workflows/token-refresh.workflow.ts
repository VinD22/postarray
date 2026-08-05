import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runTokenRefresh } from './core/token-refresh.core';
import type { TokenRefreshWorkflowInput, TokenRefreshWorkflowOutput } from './inputs';

/**
 * Proactive credential refresh.

 * Workflow id: `token:{workspaceId}:{connectionId}`.
 */
export async function tokenRefreshWorkflow(
  input: TokenRefreshWorkflowInput,
): Promise<TokenRefreshWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runTokenRefresh(runtime, workerActivities, input);
}
