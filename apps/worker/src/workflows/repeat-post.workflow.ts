import { createTemporalRuntime, workerActivities } from './temporal-runtime.js';
import { runRepeatPost } from './core/repeat-post.core.js';
import type { RepeatPostWorkflowInput, RepeatPostWorkflowOutput } from './inputs.js';

/**
 * A repeating series.

 * Workflow id: `repeat:{workspaceId}:{seriesId}`. Rolls its history over with
 * `continueAsNew` after every occurrence.
 */
export async function repeatPostWorkflow(input: RepeatPostWorkflowInput): Promise<RepeatPostWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runRepeatPost(runtime, workerActivities, input);
}
