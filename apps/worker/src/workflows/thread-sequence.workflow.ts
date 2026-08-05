import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runThreadSequence } from './core/thread-sequence.core';
import type { ThreadSequenceWorkflowInput, ThreadSequenceWorkflowOutput } from './inputs';

/**
 * Ordered comments and thread parts under a post that is already live.

 * Workflow id: `thread:{workspaceId}:{publishJobId}:{targetId}`.
 */
export async function threadSequenceWorkflow(
  input: ThreadSequenceWorkflowInput,
): Promise<ThreadSequenceWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runThreadSequence(runtime, workerActivities, input);
}
