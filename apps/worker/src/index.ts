/**
 * `@relay/worker`
 *
 * The Temporal workers and activities. Everything with an external side effect
 * that must survive a process restart runs here.
 *
 * The public surface is deliberately small: the activity contract the
 * application layer implements, the workflow descriptors and their inputs, the
 * retry policies, and the bootstrap. Workflow bodies themselves are internal.
 */

export {
  ACTIVITY_NAMES,
  createActivities,
  type ActivityContext,
  type ActivityDependencies,
  type ActivityName,
  type WorkerActivities,
  type WorkerGateway,
} from './activities/index';

export {
  MAX_PUBLISH_ATTEMPTS,
  PROVIDER_PROCESSING_BUDGET_MS,
  publishTargetDescriptor,
  runPublishTarget,
} from './workflows/core/publish-target.core';
export { publishPostDescriptor, runPublishPost } from './workflows/core/publish-post.core';
export {
  MAX_SEQUENCE_ITEM_ATTEMPTS,
  runThreadSequence,
  threadSequenceDescriptor,
} from './workflows/core/thread-sequence.core';
export { repeatPostDescriptor, runRepeatPost } from './workflows/core/repeat-post.core';
export {
  ITERATIONS_PER_RUN,
  POST_METRIC_OFFSETS_MS,
  analyticsSyncDescriptor,
  initialAnalyticsInput,
  offsetsForProvider,
  runAnalyticsSync,
} from './workflows/core/analytics-sync.core';
export {
  REFRESH_AT_FRACTION,
  refreshWaitMs,
  runTokenRefresh,
  tokenRefreshDescriptor,
} from './workflows/core/token-refresh.core';
export {
  MAX_CONSECUTIVE_FAILURES,
  failureBackoffMs,
  rssPollDescriptor,
  runRssPoll,
} from './workflows/core/rss-poll.core';
export { automationRuleDescriptor, runAutomationRule } from './workflows/core/automation-rule.core';
export {
  DEFAULT_MAX_ATTEMPTS,
  ENDPOINT_FAILURE_THRESHOLD,
  runWebhookDelivery,
  webhookDeliveryDescriptor,
} from './workflows/core/webhook-delivery.core';
export { dataDeletionDescriptor, runDataDeletion } from './workflows/core/data-deletion.core';

export type {
  AnalyticsSyncWorkflowInput,
  AnalyticsSyncWorkflowOutput,
  AutomationRuleWorkflowInput,
  AutomationRuleWorkflowOutput,
  DataDeletionWorkflowInput,
  DataDeletionWorkflowOutput,
  PublishPostWorkflowInput,
  PublishPostWorkflowOutput,
  PublishTargetOutcome,
  PublishTargetPlan,
  PublishTargetWorkflowInput,
  RepeatPostWorkflowInput,
  RepeatPostWorkflowOutput,
  RssPollWorkflowInput,
  RssPollWorkflowOutput,
  ThreadSequenceItem,
  ThreadSequenceWorkflowInput,
  ThreadSequenceWorkflowOutput,
  TokenRefreshWorkflowInput,
  TokenRefreshWorkflowOutput,
  WebhookDeliveryWorkflowInput,
  WebhookDeliveryWorkflowOutput,
} from './workflows/inputs';

export {
  ACTIVITY_OPTIONS,
  isNonRetryable,
  toTemporalActivityOptions,
  type ActivityClass,
  type ActivityExecutionOptions,
  type WorkerRetryPolicy,
} from './runtime/retry-policies';

export {
  SignalInbox,
  WORKFLOW_QUERIES,
  WORKFLOW_SIGNALS,
  type CancelRequest,
  type ChildWorkflowDescriptor,
  type ChildWorkflowHandle,
  type ProviderConfirmation,
  type RescheduleRequest,
  type TargetStatusView,
  type WorkflowRuntime,
  type WorkflowStatusView,
} from './runtime/types';

export { backoffMs, hashString, jitterMs, stableSort, unitInterval } from './runtime/deterministic';

export { MESSAGE_KEYS } from './messages';

export {
  InlineScheduler,
  InlineSchedulerNotPermittedError,
  type InlineRun,
  type InlineSchedulerOptions,
} from './fallback/inline-scheduler';

export {
  SHUTDOWN_GRACE_MS,
  WORKER_SERVICE_NAME,
  installShutdownHandlers,
  startWorker,
  type RunningWorker,
  type WorkerMode,
  type WorkerStartOptions,
} from './worker';

export { createWorkerGateway } from './prelaunch-gateway';
export {
  MEDIA_RETENTION_ASSET_BATCH,
  MEDIA_RETENTION_SWEEP_INTERVAL_MS,
  MEDIA_RETENTION_WORKSPACE_BATCH,
  drainMediaRetention,
  runMediaRetentionSweep,
  startMediaRetentionSweep,
  type MediaRetentionSweepResult,
  type RunMediaRetentionSweepOptions,
  type RunningMediaRetentionSweep,
} from './media-retention';
