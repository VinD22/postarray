import { createTemporalRuntime, workerActivities } from './temporal-runtime.js';
import { runPublishPost } from './core/publish-post.core.js';
import type { PublishPostWorkflowInput, PublishPostWorkflowOutput } from './inputs.js';

/**
 * The campaign entry point.

 * Workflow id: `publish:{workspaceId}:{publishJobId}`. Because the id is
 * derived from the job, a duplicate start is a Temporal no-op rather than a
 * second post. The body is the deterministic core; this file only wires the
 * signal handlers and the status query.
 */
export async function publishPostWorkflow(
  input: PublishPostWorkflowInput,
): Promise<PublishPostWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runPublishPost(runtime, workerActivities, input);
}
