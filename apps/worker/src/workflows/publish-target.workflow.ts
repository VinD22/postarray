import { createTemporalRuntime, workerActivities } from './temporal-runtime.js';
import { runPublishTarget } from './core/publish-target.core.js';
import type { PublishTargetWorkflowInput, PublishTargetOutcome } from './inputs.js';

/**
 * One target of a campaign.

 * Workflow id: `publish:{workspaceId}:{publishJobId}:{targetId}`. Started as a
 * child so a failure here can never roll back a sibling that already published.
 */
export async function publishTargetWorkflow(
  input: PublishTargetWorkflowInput,
): Promise<PublishTargetOutcome> {
  const runtime = createTemporalRuntime();
  return runPublishTarget(runtime, workerActivities, input);
}
