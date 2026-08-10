import { ERROR_CODES, RelayError, canonicalJson, type ErrorCode } from '@relay/contracts';

import type { CommandRecorder } from './fake-runtime';

import type {
  ActivityName,
  BeginPublishAttemptInput,
  BeginPublishAttemptResult,
  ApplyBulkImportInput,
  BuildDataExportInput,
  BuildDataExportResult,
  BulkImportActivityInput,
  BulkImportActivityResult,
  CancelScheduledJobInput,
  ConnectionIncidentInput,
  CreateOccurrenceJobInput,
  CreateOccurrenceJobResult,
  DeleteObjectsInput,
  DeleteObjectsResult,
  DeletionScope,
  DeletionScopeInput,
  DeliverWebhookInput,
  DeliverWebhookResult,
  DescribeCredentialInput,
  DescribeCredentialResult,
  EmitEventInput,
  EnsureNotAlreadyPublishedInput,
  EnsureNotAlreadyPublishedResult,
  EvaluateRuleInput,
  EvaluateRuleResult,
  ExecuteRuleActionInput,
  ExecuteRuleActionResult,
  ExternalPublication,
  FetchFeedInput,
  FetchFeedResult,
  FetchMetricsInput,
  FetchMetricsResult,
  FilterNewFeedItemsInput,
  FilterNewFeedItemsResult,
  FinalizeAttemptInput,
  FinalizeDeletionInput,
  LoadRuleInput,
  LoadWebhookDeliveryInput,
  MarkDeletionFailedInput,
  NotifyInput,
  PlanRepeatOccurrenceInput,
  PlanRepeatOccurrenceResult,
  PollPublishStatusInput,
  PrepareTargetMediaInput,
  PrepareTargetMediaResult,
  ProduceMediaDerivativeInput,
  ProduceMediaDerivativeResult,
  PreflightCampaignInput,
  PreflightCampaignResult,
  ProcessFeedItemsInput,
  ProcessFeedItemsResult,
  PublishSequenceItemInput,
  PublishTargetInput,
  PublishTargetResult,
  RecordAnalyticsRunInput,
  RecordFeedPollInput,
  RecordRuleRunInput,
  RecordWebhookAttemptInput,
  RefreshCredentialInput,
  RefreshCredentialResult,
  ReserveRuleExecutionInput,
  ReserveRuleExecutionResult,
  RevalidateTargetInput,
  RevalidateTargetResult,
  RevokeConnectionInput,
  RuleDefinitionView,
  ScheduleAnalyticsInput,
  ScheduleAnalyticsResult,
  SequenceItemResult,
  SetJobStateInput,
  SetTargetStateInput,
  TombstoneAnalyticsInput,
  WebhookDeliveryView,
  WebhookEndpointOpInput,
  WorkerActivities,
  WriteReceiptInput,
  WriteReceiptResult,
} from '../activities/types';
import { toIsoInstant, parseInstant } from '../runtime/deterministic';

/**
 * A deterministic stand-in for every activity, plus a model of the provider.
 *
 * The provider model is the point. It counts real creates, it honours an
 * idempotency token the way a provider that supports one does, and it can be
 * scripted to accept a request and then lose the connection. That is what makes
 * "exactly one external create" an assertion rather than an aspiration.
 */

export interface RecordedCall {
  readonly name: ActivityName;
  readonly digest: string;
}

/** How the provider should behave on the next create call. */
export type ProviderScriptStep =
  | { readonly kind: 'publish' }
  | { readonly kind: 'processing' }
  | { readonly kind: 'transient' }
  | { readonly kind: 'permanent' }
  | { readonly kind: 'action_required' }
  | { readonly kind: 'unknown' }
  /** The provider created the post, then the worker died before it heard back. */
  | { readonly kind: 'accept_then_crash' }
  /** The provider created the post, then the call timed out. */
  | { readonly kind: 'accept_then_timeout' };

export interface SimulatorOptions {
  readonly supportsProviderIdempotency?: boolean;
  readonly recreateOnUnknown?: boolean;
  readonly confirmsByWebhook?: boolean;
  readonly revalidation?: Partial<RevalidateTargetResult>;
  readonly preflight?: Partial<PreflightCampaignResult>;
  readonly providerScript?: readonly ProviderScriptStep[];
  readonly pollScript?: readonly ProviderScriptStep[];
  readonly sequenceScript?: readonly ProviderScriptStep[];
  readonly probeScript?: readonly EnsureNotAlreadyPublishedResult['verdict'][];
  readonly rule?: Partial<RuleDefinitionView>;
  readonly ruleReservation?: ReserveRuleExecutionResult['verdict'];
  readonly ruleActionStatus?: ExecuteRuleActionResult['status'];
  readonly webhookScript?: readonly DeliverWebhookResult['status'][];
  readonly webhookEndpointEnabled?: boolean;
  readonly webhookConsecutiveFailures?: number;
  readonly webhookAlreadyDelivered?: boolean;
  readonly feedScript?: readonly FetchFeedResult[];
  readonly credential?: Partial<DescribeCredentialResult>;
  readonly refreshThrows?: boolean;
  readonly deletionScope?: Partial<DeletionScope>;
  readonly deletionFailure?: 'delete_objects';
  readonly dataExport?: Partial<BuildDataExportResult>;
  readonly bulkImport?: Partial<BulkImportActivityResult>;
  readonly mediaDerivative?: Partial<ProduceMediaDerivativeResult>;
  readonly repeatPlan?: Partial<PlanRepeatOccurrenceResult>;
  readonly occurrenceTargets?: CreateOccurrenceJobResult['targets'];
  readonly metrics?: Partial<FetchMetricsResult>;
  readonly now?: () => number;
  /** When present, every call is also appended to the shared command log. */
  readonly recorder?: CommandRecorder;
}

export class ActivityTimeoutError extends Error {
  readonly code: ErrorCode = ERROR_CODES.PROVIDER_TRANSIENT;

  constructor() {
    super('ACTIVITY_TIMEOUT');
    this.name = 'ActivityTimeoutError';
  }
}

export class WorkerCrashError extends Error {
  readonly code: ErrorCode = ERROR_CODES.UNKNOWN;

  constructor() {
    super('WORKER_CRASHED');
    this.name = 'WorkerCrashError';
  }
}

function digest(value: unknown): string {
  return canonicalJson(value);
}

/** The external world. One entry per post that genuinely exists at a provider. */
export class ProviderModel {
  private sequence = 0;
  readonly posts = new Map<string, ExternalPublication>();
  /** Number of times the create endpoint produced a new post. */
  createCount = 0;
  /** Number of times the create endpoint was called at all. */
  callCount = 0;

  create(token: string | null, publishedAt: string, accountId: string): ExternalPublication {
    this.callCount += 1;
    if (token !== null) {
      const existing = this.posts.get(token);
      if (existing !== undefined) {
        return existing;
      }
    }
    this.sequence += 1;
    const publication: ExternalPublication = {
      externalPostId: `ext_${String(this.sequence)}`,
      permalink: `https://example.invalid/p/${String(this.sequence)}`,
      publishedAt,
      externalAccountId: accountId,
    };
    this.createCount += 1;
    this.posts.set(token ?? `untokened:${String(this.sequence)}`, publication);
    return publication;
  }

  find(token: string): ExternalPublication | null {
    return this.posts.get(token) ?? null;
  }
}

export class ActivitySimulator implements WorkerActivities {
  readonly calls: RecordedCall[] = [];
  readonly provider = new ProviderModel();
  readonly emittedEvents: EmitEventInput[] = [];
  readonly notifications: NotifyInput[] = [];
  readonly targetStates: SetTargetStateInput[] = [];
  readonly jobStates: SetJobStateInput[] = [];
  readonly receipts = new Map<string, string>();
  readonly canceledJobIds: string[] = [];
  readonly revokedConnectionIds: string[] = [];
  readonly incidents: ConnectionIncidentInput[] = [];
  readonly webhookAttempts: RecordWebhookAttemptInput[] = [];
  readonly deadLettered: WebhookEndpointOpInput[] = [];
  readonly disabledEndpoints: WebhookEndpointOpInput[] = [];
  readonly ruleRuns: RecordRuleRunInput[] = [];
  /** Publications recorded in flight, keyed by attempt token. */
  private readonly inFlight = new Map<string, ExternalPublication>();
  private attemptSequence = 0;
  private providerStep = 0;
  private pollStep = 0;
  private sequenceStep = 0;
  private probeStep = 0;
  private webhookStep = 0;
  private feedStep = 0;
  private receiptSequence = 0;
  private ruleExecutionCount = 0;

  constructor(private readonly options: SimulatorOptions = {}) {}

  private nowIso(): string {
    const now = this.options.now === undefined ? 0 : this.options.now();
    return toIsoInstant(now);
  }

  private record(name: ActivityName, input: unknown): void {
    const call: RecordedCall = { name, digest: digest(input) };
    this.calls.push(call);
    this.options.recorder?.record({ kind: 'activity', name, digest: call.digest });
  }

  callsNamed(name: ActivityName): RecordedCall[] {
    return this.calls.filter((call) => call.name === name);
  }

  countOf(name: ActivityName): number {
    return this.callsNamed(name).length;
  }

  private nextProviderStep(): ProviderScriptStep {
    const script = this.options.providerScript ?? [{ kind: 'publish' }];
    const step = script[Math.min(this.providerStep, script.length - 1)];
    this.providerStep += 1;
    return step ?? { kind: 'publish' };
  }

  // -------------------------------------------------------------------------
  // Preflight and revalidation
  // -------------------------------------------------------------------------

  preflightCampaign(input: PreflightCampaignInput): Promise<PreflightCampaignResult> {
    this.record('preflightCampaign', input);
    return Promise.resolve({
      verdict: 'proceed',
      messageKey: null,
      errorCode: null,
      blockedTargetIds: [],
      ...this.options.preflight,
    });
  }

  revalidateTarget(input: RevalidateTargetInput): Promise<RevalidateTargetResult> {
    this.record('revalidateTarget', input);
    return Promise.resolve({
      verdict: 'proceed',
      capabilityVersion: input.approvedCapabilityVersion,
      capabilityDrifted: false,
      messageKey: null,
      errorCode: null,
      supportsProviderIdempotency: this.options.supportsProviderIdempotency ?? true,
      recreateOnUnknown: this.options.recreateOnUnknown ?? false,
      confirmsByWebhook: this.options.confirmsByWebhook ?? false,
      ...this.options.revalidation,
    });
  }

  prepareTargetMedia(input: PrepareTargetMediaInput): Promise<PrepareTargetMediaResult> {
    this.record('prepareTargetMedia', input);
    return Promise.resolve({
      preparedMediaIds: [`prepared:${input.targetId}`],
      derivativeCount: 1,
      totalBytes: 1_024,
    });
  }

  // -------------------------------------------------------------------------
  // Publishing
  // -------------------------------------------------------------------------

  beginPublishAttempt(input: BeginPublishAttemptInput): Promise<BeginPublishAttemptResult> {
    this.record('beginPublishAttempt', input);
    this.attemptSequence += 1;
    const token = `${input.idempotencyKey}:${input.targetId}`;
    const adopted = this.inFlight.get(token) ?? this.provider.find(token);
    return Promise.resolve({
      attemptId: `att_${String(this.attemptSequence)}`,
      attemptNumber: input.attemptNumber,
      providerIdempotencyToken: token,
      alreadyPublished: adopted,
    });
  }

  ensureNotAlreadyPublished(
    input: EnsureNotAlreadyPublishedInput,
  ): Promise<EnsureNotAlreadyPublishedResult> {
    this.record('ensureNotAlreadyPublished', input);
    const scripted = this.options.probeScript?.[this.probeStep];
    this.probeStep += 1;
    const found =
      this.inFlight.get(input.providerIdempotencyToken) ??
      this.provider.find(input.providerIdempotencyToken);
    if (scripted === 'indeterminate') {
      return Promise.resolve({ verdict: 'indeterminate', publication: null });
    }
    if (scripted === 'not_published') {
      return Promise.resolve({ verdict: 'not_published', publication: null });
    }
    if (found !== null) {
      return Promise.resolve({ verdict: 'published', publication: found });
    }
    return Promise.resolve({ verdict: 'not_published', publication: null });
  }

  publishTarget(input: PublishTargetInput): Promise<PublishTargetResult> {
    this.record('publishTarget', input);
    const step = this.nextProviderStep();
    const token = input.providerIdempotencyToken ?? `${input.publishJobId}:${input.targetId}`;

    if (step.kind === 'publish') {
      const publication = this.provider.create(token, this.nowIso(), input.connectionId);
      return Promise.resolve({
        outcome: 'published',
        publication,
        providerOperationId: null,
        errorClass: null,
        errorCode: null,
        messageKey: null,
        retryAfterMs: null,
      });
    }
    if (step.kind === 'processing') {
      return Promise.resolve({
        outcome: 'processing',
        publication: null,
        providerOperationId: `op_${input.attemptId}`,
        errorClass: null,
        errorCode: null,
        messageKey: null,
        retryAfterMs: null,
      });
    }
    if (step.kind === 'accept_then_crash' || step.kind === 'accept_then_timeout') {
      // The provider really did create the post. We simply never heard back.
      const publication = this.provider.create(token, this.nowIso(), input.connectionId);
      this.inFlight.set(token, publication);
      return Promise.reject(
        step.kind === 'accept_then_crash' ? new WorkerCrashError() : new ActivityTimeoutError(),
      );
    }
    if (step.kind === 'permanent') {
      return Promise.resolve({
        outcome: 'permanent',
        publication: null,
        providerOperationId: null,
        errorClass: 'permanent_provider',
        errorCode: ERROR_CODES.PROVIDER_PERMANENT,
        messageKey: null,
        retryAfterMs: null,
      });
    }
    if (step.kind === 'action_required') {
      return Promise.resolve({
        outcome: 'action_required',
        publication: null,
        providerOperationId: null,
        errorClass: 'user_action_required',
        errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
        messageKey: null,
        retryAfterMs: null,
      });
    }
    if (step.kind === 'unknown') {
      return Promise.resolve({
        outcome: 'unknown',
        publication: null,
        providerOperationId: null,
        errorClass: 'unknown',
        errorCode: ERROR_CODES.UNKNOWN,
        messageKey: null,
        retryAfterMs: null,
      });
    }
    return Promise.resolve({
      outcome: 'transient',
      publication: null,
      providerOperationId: null,
      errorClass: 'transient_provider',
      errorCode: ERROR_CODES.PROVIDER_TRANSIENT,
      messageKey: null,
      retryAfterMs: 1_000,
    });
  }

  pollPublishStatus(input: PollPublishStatusInput): Promise<PublishTargetResult> {
    this.record('pollPublishStatus', input);
    const script = this.options.pollScript ?? [{ kind: 'publish' }];
    const step = script[Math.min(this.pollStep, script.length - 1)] ?? { kind: 'publish' };
    this.pollStep += 1;

    if (step.kind === 'publish') {
      const publication = this.provider.create(
        input.providerIdempotencyToken,
        this.nowIso(),
        input.connectionId,
      );
      return Promise.resolve({
        outcome: 'published',
        publication,
        providerOperationId: input.providerOperationId,
        errorClass: null,
        errorCode: null,
        messageKey: null,
        retryAfterMs: null,
      });
    }
    if (step.kind === 'permanent') {
      return Promise.resolve({
        outcome: 'permanent',
        publication: null,
        providerOperationId: input.providerOperationId,
        errorClass: 'permanent_provider',
        errorCode: ERROR_CODES.PROVIDER_PERMANENT,
        messageKey: null,
        retryAfterMs: null,
      });
    }
    if (step.kind === 'action_required') {
      return Promise.resolve({
        outcome: 'action_required',
        publication: null,
        providerOperationId: input.providerOperationId,
        errorClass: 'user_action_required',
        errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
        messageKey: null,
        retryAfterMs: null,
      });
    }
    return Promise.resolve({
      outcome: 'processing',
      publication: null,
      providerOperationId: input.providerOperationId,
      errorClass: null,
      errorCode: null,
      messageKey: null,
      retryAfterMs: null,
    });
  }

  finalizeAttempt(input: FinalizeAttemptInput): Promise<void> {
    this.record('finalizeAttempt', input);
    return Promise.resolve();
  }

  publishSequenceItem(input: PublishSequenceItemInput): Promise<SequenceItemResult> {
    this.record('publishSequenceItem', input);
    const script = this.options.sequenceScript ?? [{ kind: 'publish' }];
    const step = script[Math.min(this.sequenceStep, script.length - 1)] ?? { kind: 'publish' };
    this.sequenceStep += 1;

    if (step.kind === 'publish') {
      const publication = this.provider.create(
        `${input.attemptId}:${input.threadItemId}`,
        this.nowIso(),
        input.connectionId,
      );
      return Promise.resolve({
        outcome: 'published',
        publication,
        errorCode: null,
        messageKey: null,
      });
    }
    if (step.kind === 'permanent') {
      return Promise.resolve({
        outcome: 'permanent',
        publication: null,
        errorCode: ERROR_CODES.PROVIDER_PERMANENT,
        messageKey: null,
      });
    }
    if (step.kind === 'action_required') {
      return Promise.resolve({
        outcome: 'action_required',
        publication: null,
        errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
        messageKey: null,
      });
    }
    // The provider may or may not have created the item. Without this branch the
    // script fell through to `transient`, which retries, so the test asserting
    // that an unknown outcome is never recreated could not actually fail.
    if (
      step.kind === 'unknown' ||
      step.kind === 'accept_then_crash' ||
      step.kind === 'accept_then_timeout'
    ) {
      return Promise.resolve({
        outcome: 'unknown',
        publication: null,
        errorCode: ERROR_CODES.UNKNOWN,
        messageKey: null,
      });
    }
    return Promise.resolve({
      outcome: 'transient',
      publication: null,
      errorCode: ERROR_CODES.PROVIDER_TRANSIENT,
      messageKey: null,
    });
  }

  // -------------------------------------------------------------------------
  // State, receipts, events
  // -------------------------------------------------------------------------

  setTargetState(input: SetTargetStateInput): Promise<void> {
    this.record('setTargetState', input);
    this.targetStates.push(input);
    return Promise.resolve();
  }

  setJobState(input: SetJobStateInput): Promise<void> {
    this.record('setJobState', input);
    this.jobStates.push(input);
    return Promise.resolve();
  }

  writeReceipt(input: WriteReceiptInput): Promise<WriteReceiptResult> {
    this.record('writeReceipt', input);
    const key = `${input.publishJobId}:${input.targetId}`;
    const existing = this.receipts.get(key);
    if (existing !== undefined) {
      return Promise.resolve({ receiptId: existing, created: false });
    }
    this.receiptSequence += 1;
    const receiptId = `receipt_${String(this.receiptSequence)}`;
    this.receipts.set(key, receiptId);
    return Promise.resolve({ receiptId, created: true });
  }

  emitEvent(input: EmitEventInput): Promise<void> {
    this.record('emitEvent', input);
    this.emittedEvents.push(input);
    return Promise.resolve();
  }

  notify(input: NotifyInput): Promise<void> {
    this.record('notify', input);
    this.notifications.push(input);
    return Promise.resolve();
  }

  scheduleAnalyticsFetches(input: ScheduleAnalyticsInput): Promise<ScheduleAnalyticsResult> {
    this.record('scheduleAnalyticsFetches', input);
    return Promise.resolve({ offsetsMs: [900_000, 3_600_000, 86_400_000] });
  }

  // -------------------------------------------------------------------------
  // Repeat
  // -------------------------------------------------------------------------

  planRepeatOccurrence(input: PlanRepeatOccurrenceInput): Promise<PlanRepeatOccurrenceResult> {
    this.record('planRepeatOccurrence', input);
    const first = parseInstant(input.firstInstant);
    const instant = toIsoInstant(
      first + input.occurrenceIndex * input.cadenceDays * 24 * 60 * 60_000,
    );
    return Promise.resolve({
      shouldRun: true,
      instant,
      localDateTime: instant.slice(0, 16),
      reasonKey: null,
      ...this.options.repeatPlan,
    });
  }

  createOccurrenceJob(input: CreateOccurrenceJobInput): Promise<CreateOccurrenceJobResult> {
    this.record('createOccurrenceJob', input);
    return Promise.resolve({
      publishJobId: `job_${input.seriesId}_${String(input.occurrenceIndex)}`,
      contentVersionId: `cver_${input.contentItemId}`,
      contentVersionChecksum: 'a'.repeat(64),
      created: true,
      targets: this.options.occurrenceTargets ?? [],
    });
  }

  // -------------------------------------------------------------------------
  // Analytics
  // -------------------------------------------------------------------------

  fetchPostMetrics(input: FetchMetricsInput): Promise<FetchMetricsResult> {
    this.record('fetchPostMetrics', input);
    return Promise.resolve({
      observedCount: 3,
      unavailableCount: 1,
      nextCursor: null,
      providerCostMinor: null,
      ...this.options.metrics,
    });
  }

  fetchAccountMetrics(input: FetchMetricsInput): Promise<FetchMetricsResult> {
    this.record('fetchAccountMetrics', input);
    return Promise.resolve({
      observedCount: 2,
      unavailableCount: 0,
      nextCursor: null,
      providerCostMinor: null,
      ...this.options.metrics,
    });
  }

  recordAnalyticsRun(input: RecordAnalyticsRunInput): Promise<void> {
    this.record('recordAnalyticsRun', input);
    return Promise.resolve();
  }

  // -------------------------------------------------------------------------
  // Credentials
  // -------------------------------------------------------------------------

  describeCredential(input: DescribeCredentialInput): Promise<DescribeCredentialResult> {
    this.record('describeCredential', input);
    const now = this.options.now === undefined ? 0 : this.options.now();
    return Promise.resolve({
      expiresAt: toIsoInstant(now + 60 * 24 * 60 * 60_000),
      refreshable: true,
      revoked: false,
      lifetimeSeconds: 60 * 24 * 60 * 60,
      ...this.options.credential,
    });
  }

  refreshCredential(input: RefreshCredentialInput): Promise<RefreshCredentialResult> {
    this.record('refreshCredential', input);
    if (this.options.refreshThrows === true) {
      return Promise.reject(new ActivityTimeoutError());
    }
    const now = this.options.now === undefined ? 0 : this.options.now();
    return Promise.resolve({
      rotated: true,
      expiresAt: toIsoInstant(now + 60 * 24 * 60 * 60_000),
      lifetimeSeconds: 60 * 24 * 60 * 60,
    });
  }

  raiseConnectionIncident(input: ConnectionIncidentInput): Promise<void> {
    this.record('raiseConnectionIncident', input);
    this.incidents.push(input);
    return Promise.resolve();
  }

  // -------------------------------------------------------------------------
  // RSS
  // -------------------------------------------------------------------------

  fetchFeed(input: FetchFeedInput): Promise<FetchFeedResult> {
    this.record('fetchFeed', input);
    const script = this.options.feedScript;
    if (script !== undefined) {
      const step = script[Math.min(this.feedStep, script.length - 1)];
      this.feedStep += 1;
      if (step !== undefined) {
        return Promise.resolve(step);
      }
    }
    this.feedStep += 1;
    return Promise.resolve({
      changed: false,
      etag: input.etag,
      lastModified: input.lastModified,
      items: [],
      errorCode: null,
    });
  }

  filterNewFeedItems(input: FilterNewFeedItemsInput): Promise<FilterNewFeedItemsResult> {
    this.record('filterNewFeedItems', input);
    const seen = new Set<string>();
    const newItems = input.items.filter((item) => {
      const key = `${item.guid}|${item.link ?? ''}|${item.contentFingerprint}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
    return Promise.resolve({
      newItems,
      duplicateCount: input.items.length - newItems.length,
    });
  }

  processFeedItems(input: ProcessFeedItemsInput): Promise<ProcessFeedItemsResult> {
    this.record('processFeedItems', input);
    return Promise.resolve({
      createdContentItemIds: input.items.map((item) => `content_${item.guid}`),
      skippedCount: 0,
    });
  }

  recordFeedPoll(input: RecordFeedPollInput): Promise<void> {
    this.record('recordFeedPoll', input);
    return Promise.resolve();
  }

  // -------------------------------------------------------------------------
  // Rules
  // -------------------------------------------------------------------------

  loadRuleDefinition(input: LoadRuleInput): Promise<RuleDefinitionView> {
    this.record('loadRuleDefinition', input);
    return Promise.resolve({
      ruleId: input.ruleId,
      enabled: true,
      cooldownSeconds: 3_600,
      expiresAt: null,
      maxExecutions: null,
      maxExecutionsPerSource: 1,
      executionCount: 0,
      oncePerSourcePost: true,
      requiresApproval: false,
      actions: [
        {
          actionId: 'action_1',
          kind: 'create_draft',
          order: 1,
          delaySeconds: 0,
          consequential: false,
        },
        {
          actionId: 'action_2',
          kind: 'schedule_post',
          order: 2,
          delaySeconds: 0,
          consequential: true,
        },
      ],
      ...this.options.rule,
    });
  }

  evaluateRuleConditions(input: EvaluateRuleInput): Promise<EvaluateRuleResult> {
    this.record('evaluateRuleConditions', input);
    return Promise.resolve({ matched: true, unmatchedConditionKeys: [] });
  }

  reserveRuleExecution(input: ReserveRuleExecutionInput): Promise<ReserveRuleExecutionResult> {
    this.record('reserveRuleExecution', input);
    const configured = this.options.ruleReservation;
    if (configured !== undefined) {
      return Promise.resolve({ verdict: configured, nextEligibleAt: null });
    }
    // Default: once per source key, exactly as production does.
    const key = `${input.ruleId}:${input.sourceKey}`;
    if (this.reservations.has(key)) {
      return Promise.resolve({ verdict: 'duplicate_source', nextEligibleAt: null });
    }
    this.reservations.add(key);
    this.ruleExecutionCount += 1;
    return Promise.resolve({ verdict: 'allowed', nextEligibleAt: null });
  }

  private readonly reservations = new Set<string>();

  get reservedExecutionCount(): number {
    return this.ruleExecutionCount;
  }

  executeRuleAction(input: ExecuteRuleActionInput): Promise<ExecuteRuleActionResult> {
    this.record('executeRuleAction', input);
    return Promise.resolve({
      status: this.options.ruleActionStatus ?? 'succeeded',
      resourceId: `res_${input.actionId}`,
      errorCode: null,
      messageKey: null,
    });
  }

  recordRuleRun(input: RecordRuleRunInput): Promise<void> {
    this.record('recordRuleRun', input);
    this.ruleRuns.push(input);
    return Promise.resolve();
  }

  // -------------------------------------------------------------------------
  // Webhooks
  // -------------------------------------------------------------------------

  loadWebhookDelivery(input: LoadWebhookDeliveryInput): Promise<WebhookDeliveryView> {
    this.record('loadWebhookDelivery', input);
    return Promise.resolve({
      deliveryId: input.deliveryId,
      endpointId: 'whep_1',
      eventName: 'post.published',
      attempt: 0,
      endpointEnabled: this.options.webhookEndpointEnabled ?? true,
      consecutiveFailures: this.options.webhookConsecutiveFailures ?? 0,
      alreadyDelivered: this.options.webhookAlreadyDelivered ?? false,
    });
  }

  deliverWebhook(input: DeliverWebhookInput): Promise<DeliverWebhookResult> {
    this.record('deliverWebhook', input);
    const script = this.options.webhookScript ?? ['succeeded'];
    const status = script[Math.min(this.webhookStep, script.length - 1)] ?? 'succeeded';
    this.webhookStep += 1;
    return Promise.resolve({
      status,
      responseStatus: status === 'succeeded' ? 200 : 503,
      retryable: status !== 'succeeded',
      errorCode: status === 'succeeded' ? null : ERROR_CODES.PROVIDER_UNAVAILABLE,
    });
  }

  recordWebhookAttempt(input: RecordWebhookAttemptInput): Promise<void> {
    this.record('recordWebhookAttempt', input);
    this.webhookAttempts.push(input);
    return Promise.resolve();
  }

  disableWebhookEndpoint(input: WebhookEndpointOpInput): Promise<void> {
    this.record('disableWebhookEndpoint', input);
    this.disabledEndpoints.push(input);
    return Promise.resolve();
  }

  deadLetterWebhookDelivery(input: WebhookEndpointOpInput): Promise<void> {
    this.record('deadLetterWebhookDelivery', input);
    this.deadLettered.push(input);
    return Promise.resolve();
  }

  // -------------------------------------------------------------------------
  // Deletion
  // -------------------------------------------------------------------------

  loadDeletionScope(input: DeletionScopeInput): Promise<DeletionScope> {
    this.record('loadDeletionScope', input);
    return Promise.resolve({
      publishJobIds: ['job_2', 'job_1'],
      connectionIds: ['conn_1'],
      receiptIds: ['receipt_1'],
      objectPrefixes: ['media/ws_1/'],
      ruleIds: [],
      feedIds: [],
      ...this.options.deletionScope,
    });
  }

  cancelScheduledJob(input: CancelScheduledJobInput): Promise<void> {
    this.record('cancelScheduledJob', input);
    this.canceledJobIds.push(input.publishJobId);
    return Promise.resolve();
  }

  revokeProviderConnection(input: RevokeConnectionInput): Promise<void> {
    this.record('revokeProviderConnection', input);
    this.revokedConnectionIds.push(input.connectionId);
    return Promise.resolve();
  }

  deleteStoredObjects(input: DeleteObjectsInput): Promise<DeleteObjectsResult> {
    this.record('deleteStoredObjects', input);
    if (this.options.deletionFailure === 'delete_objects') {
      return Promise.reject(
        new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
          messageKey: 'errors.provider_unavailable',
          details: { operation: 'delete_stored_objects', reason: 'simulated_failure' },
        }),
      );
    }
    if (input.cursor === null) {
      return Promise.resolve({ deletedCount: 2, nextCursor: 'page2' });
    }
    return Promise.resolve({ deletedCount: 1, nextCursor: null });
  }

  tombstoneAnalytics(input: TombstoneAnalyticsInput): Promise<void> {
    this.record('tombstoneAnalytics', input);
    return Promise.resolve();
  }

  finalizeDeletion(input: FinalizeDeletionInput): Promise<void> {
    this.record('finalizeDeletion', input);
    return Promise.resolve();
  }

  markDeletionFailed(input: MarkDeletionFailedInput): Promise<void> {
    this.record('markDeletionFailed', input);
    return Promise.resolve();
  }

  buildDataExport(input: BuildDataExportInput): Promise<BuildDataExportResult> {
    this.record('buildDataExport', input);
    return Promise.resolve({
      state: 'ready',
      byteSize: 128,
      checksumSha256: 'a'.repeat(64),
      ...this.options.dataExport,
    });
  }

  readBulkImportVerdict(input: BulkImportActivityInput): Promise<BulkImportActivityResult> {
    this.record('readBulkImportVerdict', input);
    return Promise.resolve({
      importJobId: input.importJobId,
      state: 'validated',
      counts: { total: 2, valid: 2, invalid: 0, applied: 0, failed: 0, skipped: 0 },
      ...this.options.bulkImport,
    });
  }

  /**
   * A derivative that already exists is returned unchanged, which is what the
   * real activity does. The simulator therefore has no branch for "produce
   * again", because the pipeline it stands in for does not have one either.
   */
  produceMediaDerivative(
    input: ProduceMediaDerivativeInput,
  ): Promise<ProduceMediaDerivativeResult> {
    this.record('produceMediaDerivative', input);
    return Promise.resolve({
      derivativeId: `mder_${input.presetKey.slice(0, 8)}`,
      mediaAssetId: input.mediaAssetId,
      presetKey: input.presetKey,
      mimeType: 'image/webp',
      byteSize: 4_096,
      checksumSha256: 'c'.repeat(64),
      width: 400,
      height: 300,
      ...this.options.mediaDerivative,
    });
  }

  applyBulkImportRows(input: ApplyBulkImportInput): Promise<BulkImportActivityResult> {
    this.record('applyBulkImportRows', input);
    return Promise.resolve({
      importJobId: input.importJobId,
      state: 'applied',
      counts: { total: 2, valid: 0, invalid: 0, applied: 2, failed: 0, skipped: 0 },
      ...this.options.bulkImport,
    });
  }
}
