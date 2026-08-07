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

export { publishPostWorkflow } from './publish-post.workflow';
export { publishTargetWorkflow } from './publish-target.workflow';
export { threadSequenceWorkflow } from './thread-sequence.workflow';
export { repeatPostWorkflow } from './repeat-post.workflow';
export { analyticsSyncWorkflow } from './analytics-sync.workflow';
export { tokenRefreshWorkflow } from './token-refresh.workflow';
export { rssPollWorkflow } from './rss-poll.workflow';
export { automationRuleWorkflow } from './automation-rule.workflow';
export { webhookDeliveryWorkflow } from './webhook-delivery.workflow';
export { dataDeletionWorkflow } from './data-deletion.workflow';
export { dataExportWorkflow } from './data-export.workflow';

export {
  cancelSignal,
  killSwitchSignal,
  pauseSignal,
  providerConfirmationSignal,
  rescheduleSignal,
  resumeSignal,
  statusQuery,
} from './temporal-runtime';
