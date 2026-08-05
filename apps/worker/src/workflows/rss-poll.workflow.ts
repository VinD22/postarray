import { createTemporalRuntime, workerActivities } from './temporal-runtime.js';
import { runRssPoll } from './core/rss-poll.core.js';
import type { RssPollWorkflowInput, RssPollWorkflowOutput } from './inputs.js';

/**
 * Feed polling with SSRF-safe fetches and three-layer deduplication.

 * Workflow id: `rss:{workspaceId}:{feedId}`.
 */
export async function rssPollWorkflow(input: RssPollWorkflowInput): Promise<RssPollWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runRssPoll(runtime, workerActivities, input);
}
