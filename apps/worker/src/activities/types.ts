import type {
  ApprovalLevel,
  CreationSurface,
  ErrorClass,
  ErrorCode,
  ProviderId,
  PublishState,
  RuleActionKind,
  WebhookEventName,
} from '@relay/contracts';

/**
 * The activity surface.
 *
 * Every one of these runs in the Node worker, not in the workflow sandbox, and
 * every one of them is the only place IO is allowed. Two rules hold without
 * exception:
 *
 * 1. **No credential ever crosses this boundary.** Inputs carry a
 *    `connectionId`; the activity fetches the token from the vault at the
 *    moment of use and discards it. Workflow history therefore never contains a
 *    token, a post body or personal data.
 * 2. **Every result is sanitized.** Provider payloads are parsed with zod inside
 *    the implementation and only normalized fields come back out.
 */

export interface ActivityContext {
  readonly workspaceId: string;
  readonly correlationId: string;
  readonly actorId: string;
  readonly actorType: 'user' | 'service_account' | 'oauth_app' | 'system';
  readonly surface: CreationSurface;
  readonly approvalLevel: ApprovalLevel;
  readonly locale: string;
}

// ---------------------------------------------------------------------------
// Preflight and revalidation
// ---------------------------------------------------------------------------

export type PreflightVerdict = 'proceed' | 'action_required' | 'needs_reapproval' | 'blocked';

export interface PreflightCampaignInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly contentItemId: string;
  readonly contentVersionId: string;
  readonly contentVersionChecksum: string;
  readonly targetIds: readonly string[];
  readonly scheduledInstant: string;
}

export interface PreflightCampaignResult {
  readonly verdict: PreflightVerdict;
  /** i18n key naming the next step. Never an English sentence. */
  readonly messageKey: string | null;
  readonly errorCode: ErrorCode | null;
  /** Targets that must not be attempted at all, for example an expired grant. */
  readonly blockedTargetIds: readonly string[];
}

export interface RevalidateTargetInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly connectionId: string;
  readonly contentVersionId: string;
  readonly contentVersionChecksum: string;
  /** The capability version captured when the post was approved. */
  readonly approvedCapabilityVersion: string;
}

export interface RevalidateTargetResult {
  readonly verdict: PreflightVerdict;
  readonly capabilityVersion: string;
  /** True when live capabilities moved away from the approved snapshot. */
  readonly capabilityDrifted: boolean;
  readonly messageKey: string | null;
  readonly errorCode: ErrorCode | null;
  /**
   * Whether the provider offers a create-time idempotency token. When false the
   * workflow must probe before every create.
   */
  readonly supportsProviderIdempotency: boolean;
  /**
   * Whether an unknown create outcome may be retried. `false` means a possible
   * duplicate is worse than a manual retry, so the target goes to
   * `action_required` instead.
   */
  readonly recreateOnUnknown: boolean;
  /** Whether the provider confirms publication out of band. */
  readonly confirmsByWebhook: boolean;
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export interface PrepareTargetMediaInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly connectionId: string;
  readonly contentVersionId: string;
}

export interface PrepareTargetMediaResult {
  /** Opaque provider handles for the uploaded assets. Never a URL with a token. */
  readonly preparedMediaIds: readonly string[];
  readonly derivativeCount: number;
  readonly totalBytes: number;
}

// ---------------------------------------------------------------------------
// Publishing
// ---------------------------------------------------------------------------

export interface BeginPublishAttemptInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly connectionId: string;
  readonly attemptNumber: number;
  readonly idempotencyKey: string;
}

export interface BeginPublishAttemptResult {
  readonly attemptId: string;
  readonly attemptNumber: number;
  /** Deterministic token handed to the provider where the provider accepts one. */
  readonly providerIdempotencyToken: string;
  /**
   * Set when a previous attempt already produced an external post. The workflow
   * adopts it and never calls create again. This is the crash-after-accept
   * guard: the in-flight row is written before the network call, so a worker
   * that dies mid-create finds its own footprint on the way back.
   */
  readonly alreadyPublished: ExternalPublication | null;
}

export interface ExternalPublication {
  readonly externalPostId: string;
  readonly permalink: string | null;
  readonly publishedAt: string;
  readonly externalAccountId: string;
}

export interface EnsureNotAlreadyPublishedInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly connectionId: string;
  readonly attemptId: string;
  readonly providerIdempotencyToken: string;
  /** Only publications at or after this instant may be adopted. */
  readonly since: string;
}

export type ProbeVerdict = 'not_published' | 'published' | 'indeterminate';

export interface EnsureNotAlreadyPublishedResult {
  readonly verdict: ProbeVerdict;
  readonly publication: ExternalPublication | null;
}

export interface PublishTargetInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly connectionId: string;
  readonly contentVersionId: string;
  readonly attemptId: string;
  readonly providerIdempotencyToken: string | null;
  readonly preparedMediaIds: readonly string[];
}

export type PublishOutcomeKind =
  | 'published'
  | 'processing'
  | 'transient'
  | 'action_required'
  | 'permanent'
  | 'unknown';

export interface PublishTargetResult {
  readonly outcome: PublishOutcomeKind;
  readonly publication: ExternalPublication | null;
  /** Opaque provider handle used to poll a container that is still processing. */
  readonly providerOperationId: string | null;
  readonly errorClass: ErrorClass | null;
  readonly errorCode: ErrorCode | null;
  readonly messageKey: string | null;
  readonly retryAfterMs: number | null;
}

export interface PollPublishStatusInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly connectionId: string;
  readonly attemptId: string;
  readonly providerOperationId: string | null;
  readonly providerIdempotencyToken: string;
}

export interface FinalizeAttemptInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly attemptId: string;
  readonly resultState: PublishState;
  readonly errorClass: ErrorClass | null;
  readonly errorCode: ErrorCode | null;
  readonly retryable: boolean;
  readonly nextRetryAt: string | null;
}

// ---------------------------------------------------------------------------
// Sequences: first comments and threads
// ---------------------------------------------------------------------------

export interface PublishSequenceItemInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly connectionId: string;
  readonly contentVersionId: string;
  readonly threadItemId: string;
  readonly order: number;
  readonly rootExternalPostId: string;
  /** External id of the previous item, so a thread chains correctly. */
  readonly parentExternalPostId: string;
  readonly attemptId: string;
  readonly providerIdempotencyToken: string | null;
}

export interface SequenceItemResult {
  readonly outcome: PublishOutcomeKind;
  readonly publication: ExternalPublication | null;
  readonly errorCode: ErrorCode | null;
  readonly messageKey: string | null;
}

// ---------------------------------------------------------------------------
// State, receipts and events
// ---------------------------------------------------------------------------

export interface SetTargetStateInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly state: PublishState;
  readonly errorCode: ErrorCode | null;
  readonly messageKey: string | null;
}

export interface SetJobStateInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly state: PublishState;
  readonly errorCode: ErrorCode | null;
}

export interface WriteReceiptInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly attemptId: string;
  readonly contentVersionId: string;
  readonly contentVersionChecksum: string;
  readonly capabilityVersion: string;
  readonly scheduledInstant: string;
  readonly scheduledLocalTime: string;
  readonly ianaTimeZone: string;
  readonly dispatchedAt: string;
  readonly publication: ExternalPublication;
  readonly items: readonly ReceiptItemInput[];
}

export interface ReceiptItemInput {
  readonly threadItemId: string | null;
  readonly kind: 'root' | 'comment' | 'thread';
  readonly order: number;
  readonly state: PublishState;
  readonly externalPostId: string | null;
  readonly permalink: string | null;
  readonly delaySeconds: number;
  readonly publishedAt: string | null;
  readonly errorCode: ErrorCode | null;
}

export interface WriteReceiptResult {
  readonly receiptId: string;
  /** False when a receipt for this job and target already existed. */
  readonly created: boolean;
}

export interface EmitEventInput {
  readonly ctx: ActivityContext;
  readonly event: WebhookEventName;
  readonly resourceId: string;
  readonly payload: Readonly<Record<string, unknown>>;
  /** Stable across retries, so a receiver deduplicating on it sees one event. */
  readonly dedupeKey: string;
}

export interface NotifyInput {
  readonly ctx: ActivityContext;
  readonly messageKey: string;
  readonly resourceId: string;
  readonly params: Readonly<Record<string, string>>;
}

export interface ScheduleAnalyticsInput {
  readonly ctx: ActivityContext;
  readonly connectionId: string;
  readonly receiptId: string;
  readonly provider: ProviderId;
  readonly publishedAt: string;
}

export interface ScheduleAnalyticsResult {
  /** Offsets after publication, in milliseconds, appropriate to the provider. */
  readonly offsetsMs: readonly number[];
}

// ---------------------------------------------------------------------------
// Repeat series
// ---------------------------------------------------------------------------

export interface PlanRepeatOccurrenceInput {
  readonly ctx: ActivityContext;
  readonly seriesId: string;
  readonly contentItemId: string;
  readonly occurrenceIndex: number;
  readonly cadenceDays: number;
  readonly firstInstant: string;
  readonly ianaTimeZone: string;
  readonly endDate: string | null;
  readonly count: number | null;
}

export interface PlanRepeatOccurrenceResult {
  readonly shouldRun: boolean;
  /** UTC instant computed in the series time zone, so DST is respected. */
  readonly instant: string;
  readonly localDateTime: string;
  readonly reasonKey: string | null;
}

export interface CreateOccurrenceJobInput {
  readonly ctx: ActivityContext;
  readonly seriesId: string;
  readonly contentItemId: string;
  readonly occurrenceIndex: number;
  readonly instant: string;
  readonly localDateTime: string;
  readonly ianaTimeZone: string;
  readonly idempotencyKey: string;
}

export interface CreateOccurrenceJobResult {
  readonly publishJobId: string;
  readonly contentVersionId: string;
  readonly contentVersionChecksum: string;
  readonly created: boolean;
  readonly targets: readonly PublishTargetDescriptor[];
}

export interface PublishTargetDescriptor {
  readonly targetId: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly approvedCapabilityVersion: string;
  readonly threadItemIds: readonly string[];
}

// ---------------------------------------------------------------------------
// Analytics sync
// ---------------------------------------------------------------------------

export interface FetchMetricsInput {
  readonly ctx: ActivityContext;
  readonly connectionId: string;
  readonly receiptId: string | null;
  readonly cursor: string | null;
  readonly windowStart: string;
  readonly windowEnd: string;
}

export interface FetchMetricsResult {
  readonly observedCount: number;
  readonly unavailableCount: number;
  readonly nextCursor: string | null;
  readonly providerCostMinor: number | null;
}

export interface RecordAnalyticsRunInput {
  readonly ctx: ActivityContext;
  readonly connectionId: string;
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly observedCount: number;
  readonly unavailableCount: number;
  readonly errorCode: ErrorCode | null;
}

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

export interface DescribeCredentialInput {
  readonly ctx: ActivityContext;
  readonly connectionId: string;
}

export interface DescribeCredentialResult {
  readonly expiresAt: string | null;
  readonly refreshable: boolean;
  readonly revoked: boolean;
  /** Seconds of credential life. Null when the provider issues no expiry. */
  readonly lifetimeSeconds: number | null;
}

export interface RefreshCredentialInput {
  readonly ctx: ActivityContext;
  readonly connectionId: string;
}

export interface RefreshCredentialResult {
  readonly rotated: boolean;
  readonly expiresAt: string | null;
  readonly lifetimeSeconds: number | null;
}

export interface ConnectionIncidentInput {
  readonly ctx: ActivityContext;
  readonly connectionId: string;
  readonly messageKey: string;
  readonly errorCode: ErrorCode;
}

// ---------------------------------------------------------------------------
// RSS
// ---------------------------------------------------------------------------

export interface FetchFeedInput {
  readonly ctx: ActivityContext;
  readonly feedId: string;
  /** Conditional request headers so an unchanged feed costs nothing. */
  readonly etag: string | null;
  readonly lastModified: string | null;
}

export interface FeedItemDigest {
  /** GUID when the feed supplies one, otherwise the canonical link. */
  readonly guid: string;
  readonly link: string | null;
  /** SHA-256 over the normalized title and body, for GUID-less feeds. */
  readonly contentFingerprint: string;
  readonly publishedAt: string | null;
}

export interface FetchFeedResult {
  readonly changed: boolean;
  readonly etag: string | null;
  readonly lastModified: string | null;
  readonly items: readonly FeedItemDigest[];
  readonly errorCode: ErrorCode | null;
}

export interface FilterNewFeedItemsInput {
  readonly ctx: ActivityContext;
  readonly feedId: string;
  readonly items: readonly FeedItemDigest[];
}

export interface FilterNewFeedItemsResult {
  readonly newItems: readonly FeedItemDigest[];
  readonly duplicateCount: number;
}

export interface ProcessFeedItemsInput {
  readonly ctx: ActivityContext;
  readonly feedId: string;
  readonly items: readonly FeedItemDigest[];
}

export interface ProcessFeedItemsResult {
  readonly createdContentItemIds: readonly string[];
  readonly skippedCount: number;
}

export interface RecordFeedPollInput {
  readonly ctx: ActivityContext;
  readonly feedId: string;
  readonly polledAt: string;
  readonly itemCount: number;
  readonly newItemCount: number;
  readonly errorCode: ErrorCode | null;
}

// ---------------------------------------------------------------------------
// Automation rules
// ---------------------------------------------------------------------------

export interface LoadRuleInput {
  readonly ctx: ActivityContext;
  readonly ruleId: string;
}

export interface RuleActionDescriptor {
  readonly actionId: string;
  readonly kind: RuleActionKind;
  readonly order: number;
  readonly delaySeconds: number;
  readonly consequential: boolean;
}

export interface RuleDefinitionView {
  readonly ruleId: string;
  readonly enabled: boolean;
  readonly cooldownSeconds: number;
  readonly expiresAt: string | null;
  readonly maxExecutions: number | null;
  readonly executionCount: number;
  /** Default true: a source post triggers a rule at most once, ever. */
  readonly oncePerSourcePost: boolean;
  readonly requiresApproval: boolean;
  readonly actions: readonly RuleActionDescriptor[];
}

export interface EvaluateRuleInput {
  readonly ctx: ActivityContext;
  readonly ruleId: string;
  readonly runId: string;
  readonly sourceKey: string;
  readonly event: Readonly<Record<string, unknown>>;
}

export interface EvaluateRuleResult {
  readonly matched: boolean;
  readonly unmatchedConditionKeys: readonly string[];
}

export interface ReserveRuleExecutionInput {
  readonly ctx: ActivityContext;
  readonly ruleId: string;
  readonly runId: string;
  readonly sourceKey: string;
  readonly now: string;
}

export type RuleReservationVerdict =
  | 'allowed'
  | 'cooldown'
  | 'expired'
  | 'max_executions'
  | 'duplicate_source'
  | 'disabled';

export interface ReserveRuleExecutionResult {
  readonly verdict: RuleReservationVerdict;
  readonly nextEligibleAt: string | null;
}

export interface ExecuteRuleActionInput {
  readonly ctx: ActivityContext;
  readonly ruleId: string;
  readonly runId: string;
  readonly actionId: string;
  readonly kind: RuleActionKind;
  readonly event: Readonly<Record<string, unknown>>;
  readonly dryRun: boolean;
}

export interface ExecuteRuleActionResult {
  readonly status: 'succeeded' | 'skipped' | 'failed' | 'approval_required';
  readonly resourceId: string | null;
  readonly errorCode: ErrorCode | null;
  readonly messageKey: string | null;
}

export interface RecordRuleRunInput {
  readonly ctx: ActivityContext;
  readonly ruleId: string;
  readonly runId: string;
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly status: 'succeeded' | 'skipped' | 'failed';
  readonly actionResults: readonly {
    readonly actionId: string;
    readonly status: ExecuteRuleActionResult['status'];
  }[];
  readonly reasonKey: string | null;
}

// ---------------------------------------------------------------------------
// Webhook delivery
// ---------------------------------------------------------------------------

export interface LoadWebhookDeliveryInput {
  readonly ctx: ActivityContext;
  readonly deliveryId: string;
}

export interface WebhookDeliveryView {
  readonly deliveryId: string;
  readonly endpointId: string;
  readonly eventName: WebhookEventName;
  readonly attempt: number;
  readonly endpointEnabled: boolean;
  readonly consecutiveFailures: number;
  readonly alreadyDelivered: boolean;
}

export interface DeliverWebhookInput {
  readonly ctx: ActivityContext;
  readonly deliveryId: string;
  readonly endpointId: string;
  readonly attempt: number;
  readonly isRedelivery: boolean;
}

export interface DeliverWebhookResult {
  readonly status: 'succeeded' | 'failed';
  readonly responseStatus: number | null;
  readonly retryable: boolean;
  readonly errorCode: ErrorCode | null;
}

export interface RecordWebhookAttemptInput {
  readonly ctx: ActivityContext;
  readonly deliveryId: string;
  readonly endpointId: string;
  readonly attempt: number;
  readonly status: 'succeeded' | 'failed' | 'exhausted' | 'disabled';
  readonly responseStatus: number | null;
  readonly nextAttemptAt: string | null;
}

export interface WebhookEndpointOpInput {
  readonly ctx: ActivityContext;
  readonly endpointId: string;
  readonly deliveryId: string;
  readonly reasonKey: string;
}

// ---------------------------------------------------------------------------
// Data deletion
// ---------------------------------------------------------------------------

export interface DeletionScopeInput {
  readonly ctx: ActivityContext;
  readonly requestId: string;
}

export interface DeletionScope {
  readonly publishJobIds: readonly string[];
  readonly connectionIds: readonly string[];
  readonly receiptIds: readonly string[];
  readonly objectPrefixes: readonly string[];
  readonly ruleIds: readonly string[];
  readonly feedIds: readonly string[];
}

export interface CancelScheduledJobInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly reasonKey: string;
}

export interface RevokeConnectionInput {
  readonly ctx: ActivityContext;
  readonly connectionId: string;
}

export interface DeleteObjectsInput {
  readonly ctx: ActivityContext;
  readonly requestId: string;
  readonly prefix: string;
  readonly cursor: string | null;
}

export interface DeleteObjectsResult {
  readonly deletedCount: number;
  readonly nextCursor: string | null;
}

export interface TombstoneAnalyticsInput {
  readonly ctx: ActivityContext;
  readonly requestId: string;
  readonly receiptIds: readonly string[];
}

export interface FinalizeDeletionInput {
  readonly ctx: ActivityContext;
  readonly requestId: string;
  readonly completedAt: string;
  readonly deletedObjectCount: number;
  readonly canceledJobCount: number;
  readonly revokedConnectionCount: number;
}

// ---------------------------------------------------------------------------
// The complete activity surface
// ---------------------------------------------------------------------------

export interface WorkerActivities {
  preflightCampaign(input: PreflightCampaignInput): Promise<PreflightCampaignResult>;
  revalidateTarget(input: RevalidateTargetInput): Promise<RevalidateTargetResult>;
  prepareTargetMedia(input: PrepareTargetMediaInput): Promise<PrepareTargetMediaResult>;
  beginPublishAttempt(input: BeginPublishAttemptInput): Promise<BeginPublishAttemptResult>;
  ensureNotAlreadyPublished(
    input: EnsureNotAlreadyPublishedInput,
  ): Promise<EnsureNotAlreadyPublishedResult>;
  publishTarget(input: PublishTargetInput): Promise<PublishTargetResult>;
  pollPublishStatus(input: PollPublishStatusInput): Promise<PublishTargetResult>;
  finalizeAttempt(input: FinalizeAttemptInput): Promise<void>;
  publishSequenceItem(input: PublishSequenceItemInput): Promise<SequenceItemResult>;
  setTargetState(input: SetTargetStateInput): Promise<void>;
  setJobState(input: SetJobStateInput): Promise<void>;
  writeReceipt(input: WriteReceiptInput): Promise<WriteReceiptResult>;
  emitEvent(input: EmitEventInput): Promise<void>;
  notify(input: NotifyInput): Promise<void>;
  scheduleAnalyticsFetches(input: ScheduleAnalyticsInput): Promise<ScheduleAnalyticsResult>;
  planRepeatOccurrence(input: PlanRepeatOccurrenceInput): Promise<PlanRepeatOccurrenceResult>;
  createOccurrenceJob(input: CreateOccurrenceJobInput): Promise<CreateOccurrenceJobResult>;
  fetchPostMetrics(input: FetchMetricsInput): Promise<FetchMetricsResult>;
  fetchAccountMetrics(input: FetchMetricsInput): Promise<FetchMetricsResult>;
  recordAnalyticsRun(input: RecordAnalyticsRunInput): Promise<void>;
  describeCredential(input: DescribeCredentialInput): Promise<DescribeCredentialResult>;
  refreshCredential(input: RefreshCredentialInput): Promise<RefreshCredentialResult>;
  raiseConnectionIncident(input: ConnectionIncidentInput): Promise<void>;
  fetchFeed(input: FetchFeedInput): Promise<FetchFeedResult>;
  filterNewFeedItems(input: FilterNewFeedItemsInput): Promise<FilterNewFeedItemsResult>;
  processFeedItems(input: ProcessFeedItemsInput): Promise<ProcessFeedItemsResult>;
  recordFeedPoll(input: RecordFeedPollInput): Promise<void>;
  loadRuleDefinition(input: LoadRuleInput): Promise<RuleDefinitionView>;
  evaluateRuleConditions(input: EvaluateRuleInput): Promise<EvaluateRuleResult>;
  reserveRuleExecution(input: ReserveRuleExecutionInput): Promise<ReserveRuleExecutionResult>;
  executeRuleAction(input: ExecuteRuleActionInput): Promise<ExecuteRuleActionResult>;
  recordRuleRun(input: RecordRuleRunInput): Promise<void>;
  loadWebhookDelivery(input: LoadWebhookDeliveryInput): Promise<WebhookDeliveryView>;
  deliverWebhook(input: DeliverWebhookInput): Promise<DeliverWebhookResult>;
  recordWebhookAttempt(input: RecordWebhookAttemptInput): Promise<void>;
  disableWebhookEndpoint(input: WebhookEndpointOpInput): Promise<void>;
  deadLetterWebhookDelivery(input: WebhookEndpointOpInput): Promise<void>;
  loadDeletionScope(input: DeletionScopeInput): Promise<DeletionScope>;
  cancelScheduledJob(input: CancelScheduledJobInput): Promise<void>;
  revokeProviderConnection(input: RevokeConnectionInput): Promise<void>;
  deleteStoredObjects(input: DeleteObjectsInput): Promise<DeleteObjectsResult>;
  tombstoneAnalytics(input: TombstoneAnalyticsInput): Promise<void>;
  finalizeDeletion(input: FinalizeDeletionInput): Promise<void>;
}

export type ActivityName = keyof WorkerActivities;

/** Every activity name, used by the worker bundle and the replay harness. */
export const ACTIVITY_NAMES: readonly ActivityName[] = [
  'preflightCampaign',
  'revalidateTarget',
  'prepareTargetMedia',
  'beginPublishAttempt',
  'ensureNotAlreadyPublished',
  'publishTarget',
  'pollPublishStatus',
  'finalizeAttempt',
  'publishSequenceItem',
  'setTargetState',
  'setJobState',
  'writeReceipt',
  'emitEvent',
  'notify',
  'scheduleAnalyticsFetches',
  'planRepeatOccurrence',
  'createOccurrenceJob',
  'fetchPostMetrics',
  'fetchAccountMetrics',
  'recordAnalyticsRun',
  'describeCredential',
  'refreshCredential',
  'raiseConnectionIncident',
  'fetchFeed',
  'filterNewFeedItems',
  'processFeedItems',
  'recordFeedPoll',
  'loadRuleDefinition',
  'evaluateRuleConditions',
  'reserveRuleExecution',
  'executeRuleAction',
  'recordRuleRun',
  'loadWebhookDelivery',
  'deliverWebhook',
  'recordWebhookAttempt',
  'disableWebhookEndpoint',
  'deadLetterWebhookDelivery',
  'loadDeletionScope',
  'cancelScheduledJob',
  'revokeProviderConnection',
  'deleteStoredObjects',
  'tombstoneAnalytics',
  'finalizeDeletion',
];
