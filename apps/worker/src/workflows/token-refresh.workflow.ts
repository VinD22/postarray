import { createTemporalRuntime, workerActivities } from './temporal-runtime.js';
import { runTokenRefresh } from './core/token-refresh.core.js';
import type { TokenRefreshWorkflowInput, TokenRefreshWorkflowOutput } from './inputs.js';

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
