import { createTemporalRuntime, workerActivities } from './temporal-runtime.js';
import { runThreadSequence } from './core/thread-sequence.core.js';
import type { ThreadSequenceWorkflowInput, ThreadSequenceWorkflowOutput } from './inputs.js';

/**
 * Ordered comments and thread parts under a post that is already live.

 * Workflow id: `thread:{workspaceId}:{publishJobId}:{targetId}`.
 */
export async function threadSequenceWorkflow(input: ThreadSequenceWorkflowInput): Promise<ThreadSequenceWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runThreadSequence(runtime, workerActivities, input);
}
