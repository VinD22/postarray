import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runRssPoll } from './core/rss-poll.core';
import type { RssPollWorkflowInput, RssPollWorkflowOutput } from './inputs';

/**
 * Feed polling with SSRF-safe fetches and three-layer deduplication.

 * Workflow id: `rss:{workspaceId}:{feedId}`.
 */
export async function rssPollWorkflow(input: RssPollWorkflowInput): Promise<RssPollWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runRssPoll(runtime, workerActivities, input);
}
