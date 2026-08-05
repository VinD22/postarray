/**
 * The workflow bundle entry point.
 *
 * `Worker.create({ workflowsPath })` points at this file. Every exported
 * function here is a registered workflow type; the exported name is the type
 * name a client must use to start it, and it is also the `name` on the matching
 * descriptor in `./core`.
 *
 * Nothing in this module may import Node built-ins, the database, a connector
 * or anything else that performs IO: the bundle is compiled into the
 * deterministic workflow sandbox.
 */

export { publishPostWorkflow } from './publish-post.workflow.js';
export { publishTargetWorkflow } from './publish-target.workflow.js';
export { threadSequenceWorkflow } from './thread-sequence.workflow.js';
export { repeatPostWorkflow } from './repeat-post.workflow.js';
export { analyticsSyncWorkflow } from './analytics-sync.workflow.js';
export { tokenRefreshWorkflow } from './token-refresh.workflow.js';
export { rssPollWorkflow } from './rss-poll.workflow.js';
export { automationRuleWorkflow } from './automation-rule.workflow.js';
export { webhookDeliveryWorkflow } from './webhook-delivery.workflow.js';
export { dataDeletionWorkflow } from './data-deletion.workflow.js';

export {
  cancelSignal,
  killSwitchSignal,
  pauseSignal,
  providerConfirmationSignal,
  rescheduleSignal,
  resumeSignal,
  statusQuery,
} from './temporal-runtime.js';
