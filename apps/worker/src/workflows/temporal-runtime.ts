import { InternalError } from '@relay/contracts';
import * as wf from '@temporalio/workflow';

import type { WorkerActivities } from '../activities/types.js';
import { ACTIVITY_OPTIONS, toTemporalActivityOptions } from '../runtime/retry-policies.js';
import {
  SignalInbox,
  WORKFLOW_QUERIES,
  WORKFLOW_SIGNALS,
  type CancelRequest,
  type ChildWorkflowDescriptor,
  type ChildWorkflowHandle,
  type ChildWorkflowOptions,
  type ProviderConfirmation,
  type RescheduleRequest,
  type WorkflowLog,
  type WorkflowRuntime,
  type WorkflowStatusView,
} from '../runtime/types.js';

/**
 * The Temporal adapter.
 *
 * This is the only file in the workflow bundle that talks to
 * `@temporalio/workflow`. Everything else is written against `WorkflowRuntime`,
 * which means the deterministic logic is exercised by the test harness and this
 * adapter stays small enough to read in one sitting.
 */

// ---------------------------------------------------------------------------
// Signals and queries
// ---------------------------------------------------------------------------

export const cancelSignal = wf.defineSignal<[CancelRequest]>(WORKFLOW_SIGNALS.cancel);
export const pauseSignal = wf.defineSignal<[]>(WORKFLOW_SIGNALS.pause);
export const resumeSignal = wf.defineSignal<[]>(WORKFLOW_SIGNALS.resume);
export const rescheduleSignal = wf.defineSignal<[RescheduleRequest]>(
  WORKFLOW_SIGNALS.reschedule,
);
export const killSwitchSignal = wf.defineSignal<[]>(WORKFLOW_SIGNALS.killSwitch);
export const providerConfirmationSignal = wf.defineSignal<[ProviderConfirmation]>(
  WORKFLOW_SIGNALS.providerConfirmation,
);
export const statusQuery = wf.defineQuery<WorkflowStatusView | null>(WORKFLOW_QUERIES.status);

// ---------------------------------------------------------------------------
// Activity proxies, one per retry class
// ---------------------------------------------------------------------------

type Group<K extends keyof WorkerActivities> = Pick<WorkerActivities, K>;

const persistence = wf.proxyActivities<
  Group<
    | 'setTargetState'
    | 'setJobState'
    | 'writeReceipt'
    | 'emitEvent'
    | 'notify'
    | 'finalizeAttempt'
    | 'beginPublishAttempt'
    | 'recordAnalyticsRun'
    | 'recordFeedPoll'
    | 'recordRuleRun'
    | 'recordWebhookAttempt'
    | 'planRepeatOccurrence'
    | 'createOccurrenceJob'
    | 'scheduleAnalyticsFetches'
    | 'loadRuleDefinition'
    | 'evaluateRuleConditions'
    | 'reserveRuleExecution'
    | 'loadWebhookDelivery'
    | 'disableWebhookEndpoint'
    | 'deadLetterWebhookDelivery'
    | 'loadDeletionScope'
    | 'cancelScheduledJob'
    | 'tombstoneAnalytics'
    | 'finalizeDeletion'
    | 'filterNewFeedItems'
    | 'processFeedItems'
    | 'preflightCampaign'
    | 'revalidateTarget'
    | 'raiseConnectionIncident'
    | 'describeCredential'
    | 'executeRuleAction'
    | 'deleteStoredObjects'
  >
>(toTemporalActivityOptions(ACTIVITY_OPTIONS.persistence));

const mediaProxy = wf.proxyActivities<Group<'prepareTargetMedia'>>(
  toTemporalActivityOptions(ACTIVITY_OPTIONS.prepareMedia),
);

const publishProxy = wf.proxyActivities<Group<'publishTarget' | 'publishSequenceItem'>>(
  toTemporalActivityOptions(ACTIVITY_OPTIONS.publish),
);

const probeProxy = wf.proxyActivities<Group<'ensureNotAlreadyPublished'>>(
  toTemporalActivityOptions(ACTIVITY_OPTIONS.probe),
);

const pollProxy = wf.proxyActivities<Group<'pollPublishStatus'>>(
  toTemporalActivityOptions(ACTIVITY_OPTIONS.pollStatus),
);

const metricsProxy = wf.proxyActivities<Group<'fetchPostMetrics' | 'fetchAccountMetrics'>>(
  toTemporalActivityOptions(ACTIVITY_OPTIONS.fetchMetrics),
);

const credentialProxy = wf.proxyActivities<
  Group<'refreshCredential' | 'revokeProviderConnection'>
>(toTemporalActivityOptions(ACTIVITY_OPTIONS.credential));

const externalProxy = wf.proxyActivities<Group<'fetchFeed'>>(
  toTemporalActivityOptions(ACTIVITY_OPTIONS.fetchExternal),
);

const webhookProxy = wf.proxyActivities<Group<'deliverWebhook'>>(
  toTemporalActivityOptions(ACTIVITY_OPTIONS.webhook),
);

/**
 * The activity surface as the workflows see it, with every call routed to the
 * proxy carrying the right retry policy. Written out longhand rather than
 * spread, because an activity proxy is a `Proxy` and spreading one would lose
 * the trap that turns a property access into a scheduled activity.
 */
export const workerActivities: WorkerActivities = {
  preflightCampaign: (input) => persistence.preflightCampaign(input),
  revalidateTarget: (input) => persistence.revalidateTarget(input),
  prepareTargetMedia: (input) => mediaProxy.prepareTargetMedia(input),
  beginPublishAttempt: (input) => persistence.beginPublishAttempt(input),
  ensureNotAlreadyPublished: (input) => probeProxy.ensureNotAlreadyPublished(input),
  publishTarget: (input) => publishProxy.publishTarget(input),
  pollPublishStatus: (input) => pollProxy.pollPublishStatus(input),
  finalizeAttempt: (input) => persistence.finalizeAttempt(input),
  publishSequenceItem: (input) => publishProxy.publishSequenceItem(input),
  setTargetState: (input) => persistence.setTargetState(input),
  setJobState: (input) => persistence.setJobState(input),
  writeReceipt: (input) => persistence.writeReceipt(input),
  emitEvent: (input) => persistence.emitEvent(input),
  notify: (input) => persistence.notify(input),
  scheduleAnalyticsFetches: (input) => persistence.scheduleAnalyticsFetches(input),
  planRepeatOccurrence: (input) => persistence.planRepeatOccurrence(input),
  createOccurrenceJob: (input) => persistence.createOccurrenceJob(input),
  fetchPostMetrics: (input) => metricsProxy.fetchPostMetrics(input),
  fetchAccountMetrics: (input) => metricsProxy.fetchAccountMetrics(input),
  recordAnalyticsRun: (input) => persistence.recordAnalyticsRun(input),
  describeCredential: (input) => persistence.describeCredential(input),
  refreshCredential: (input) => credentialProxy.refreshCredential(input),
  raiseConnectionIncident: (input) => persistence.raiseConnectionIncident(input),
  fetchFeed: (input) => externalProxy.fetchFeed(input),
  filterNewFeedItems: (input) => persistence.filterNewFeedItems(input),
  processFeedItems: (input) => persistence.processFeedItems(input),
  recordFeedPoll: (input) => persistence.recordFeedPoll(input),
  loadRuleDefinition: (input) => persistence.loadRuleDefinition(input),
  evaluateRuleConditions: (input) => persistence.evaluateRuleConditions(input),
  reserveRuleExecution: (input) => persistence.reserveRuleExecution(input),
  executeRuleAction: (input) => persistence.executeRuleAction(input),
  recordRuleRun: (input) => persistence.recordRuleRun(input),
  loadWebhookDelivery: (input) => persistence.loadWebhookDelivery(input),
  deliverWebhook: (input) => webhookProxy.deliverWebhook(input),
  recordWebhookAttempt: (input) => persistence.recordWebhookAttempt(input),
  disableWebhookEndpoint: (input) => persistence.disableWebhookEndpoint(input),
  deadLetterWebhookDelivery: (input) => persistence.deadLetterWebhookDelivery(input),
  loadDeletionScope: (input) => persistence.loadDeletionScope(input),
  cancelScheduledJob: (input) => persistence.cancelScheduledJob(input),
  revokeProviderConnection: (input) => credentialProxy.revokeProviderConnection(input),
  deleteStoredObjects: (input) => persistence.deleteStoredObjects(input),
  tombstoneAnalytics: (input) => persistence.tombstoneAnalytics(input),
  finalizeDeletion: (input) => persistence.finalizeDeletion(input),
};

// ---------------------------------------------------------------------------
// The runtime
// ---------------------------------------------------------------------------

const workflowLog: WorkflowLog = {
  debug(message, fields) {
    wf.log.debug(message, fields);
  },
  info(message, fields) {
    wf.log.info(message, fields);
  },
  warn(message, fields) {
    wf.log.warn(message, fields);
  },
  error(message, fields) {
    wf.log.error(message, fields);
  },
};

class TemporalWorkflowRuntime implements WorkflowRuntime {
  readonly workflowId: string;
  readonly runId: string;
  readonly signals = new SignalInbox();
  readonly log = workflowLog;

  private status: WorkflowStatusView | null = null;

  constructor() {
    const info = wf.workflowInfo();
    this.workflowId = info.workflowId;
    this.runId = info.runId;
  }

  now(): number {
    return wf.now();
  }

  async sleep(ms: number): Promise<void> {
    await wf.sleep(Math.max(0, Math.round(ms)));
  }

  async awaitCondition(predicate: () => boolean, timeoutMs?: number): Promise<boolean> {
    if (timeoutMs === undefined) {
      await wf.condition(predicate);
      return true;
    }
    if (timeoutMs <= 0) {
      return predicate();
    }
    return wf.condition(predicate, Math.round(timeoutMs));
  }

  isCancelled(): boolean {
    return this.signals.cancelled !== null || wf.CancellationScope.current().consideredCancelled;
  }

  async startChild<TInput, TOutput>(
    descriptor: ChildWorkflowDescriptor<TInput, TOutput>,
    options: ChildWorkflowOptions<TInput>,
  ): Promise<ChildWorkflowHandle<TOutput>> {
    const parse = descriptor.parseResult;
    if (parse === undefined) {
      throw new InternalError({
        details: { workflow: descriptor.name },
        messageKey: 'errors.internal',
      });
    }
    const handle = await wf.startChild(descriptor.name, {
      workflowId: options.workflowId,
      args: [options.input],
      taskQueue: wf.workflowInfo().taskQueue,
      // A target that is mid-dispatch must never be terminated because the
      // parent finished. It owns an external side effect and finishes itself.
      parentClosePolicy: wf.ParentClosePolicy.ABANDON,
      ...(options.executionTimeoutMs === undefined
        ? {}
        : { workflowExecutionTimeout: options.executionTimeoutMs }),
      ...(options.searchAttributes === undefined
        ? {}
        : { memo: { ...options.searchAttributes } }),
    });
    return {
      workflowId: options.workflowId,
      async result(): Promise<TOutput> {
        // Serialization boundary: a child may have been started by a previous
        // release, so the value is parsed rather than trusted.
        const raw: unknown = await handle.result();
        return parse(raw);
      },
      async signal(name: string, payload?: unknown): Promise<void> {
        await handle.signal(name, payload);
      },
    };
  }

  continueAsNew(input: unknown): Promise<never> {
    return wf.continueAsNew(input);
  }

  publishStatus(view: WorkflowStatusView): void {
    this.status = view;
  }

  currentStatus(): WorkflowStatusView | null {
    return this.status;
  }
}

/**
 * Build the runtime and install every signal and query handler. Call this once,
 * as the first statement of a workflow body.
 */
export function createTemporalRuntime(): TemporalWorkflowRuntime {
  const runtime = new TemporalWorkflowRuntime();

  wf.setHandler(cancelSignal, (request: CancelRequest) => {
    runtime.signals.onCancel(request);
  });
  wf.setHandler(pauseSignal, () => {
    runtime.signals.onPause();
  });
  wf.setHandler(resumeSignal, () => {
    runtime.signals.onResume();
  });
  wf.setHandler(rescheduleSignal, (request: RescheduleRequest) => {
    runtime.signals.onReschedule(request);
  });
  wf.setHandler(killSwitchSignal, () => {
    runtime.signals.onKillSwitch();
  });
  wf.setHandler(providerConfirmationSignal, (confirmation: ProviderConfirmation) => {
    runtime.signals.onProviderConfirmation(confirmation);
  });
  wf.setHandler(statusQuery, () => runtime.currentStatus());

  return runtime;
}
