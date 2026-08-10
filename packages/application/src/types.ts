import type {
  ApprovalLevel,
  BulkImportApplyMode,
  BulkImportCounts,
  BulkImportJobView,
  BulkImportOptions,
  BulkImportReport,
  BulkImportRowState,
  BulkImportRowView,
  BulkImportState,
  CapabilitySnapshot,
  ContentKind,
  CreationSurface,
  DataExportFormat,
  DataExportScope,
  DeletionRequestScope,
  DisclosureFlags,
  GrowthExportFormat,
  GrowthPlan,
  LinkSpec,
  Locale,
  MentionRef,
  OperationRef,
  OpportunityRecord,
  Paginated,
  PostingSetInput,
  PostingSetPatch,
  PostingSetView,
  ProviderId,
  PublishState,
  QueueRuleInput,
  QueueRulePatch,
  QueueRuleView,
  QueueSlotReservationView,
  RememberedTargetsView,
  Role,
  RuleActionKind,
  RuleTriggerKind,
  ScheduleSpec,
  Scope,
  SignatureRef,
  SlotProposal,
  ThreadItem,
  ToolRecord,
  UtmParameters,
  ValidationResult,
  VariantOverrides,
  WebhookEventName,
  ErrorClass,
  ErrorCode,
} from '@relay/contracts';
import type { RelayConfig } from '@relay/config';
import type {
  ClientAuthMethod,
  CredentialAad,
  CredentialResult,
  EncryptedCredential,
  ExternalAccount,
  OAuthClientConfig,
  ProviderHttpClient,
  SecretValue,
  SocialConnector,
  SafeFetchResult,
} from '@relay/connectors';
import type { RelayPrismaClient } from '@relay/database';
import type { HealthReport, Logger } from '@relay/observability';

import type { CredentialStorePort } from './ports/credentials';
import type { OAuthPendingDiscoveryPort } from './ports/oauth-pending';
import type { OAuthAccountSelectionView } from './ports/oauth-pending';

import type {
  ActionItemCategory,
  ActionItemView,
  AgentConfirmationSummary,
  AgentConfirmationView,
  ApiKeyView,
  ApprovalRequestView,
  AuditEventView,
  AutomationRuleView,
  BrandView,
  BusinessProfileView,
  CalendarEntry,
  CanonicalPreview,
  ComparisonReport,
  ConnectionView,
  ContentItemView,
  ContentVersionView,
  CreatedApiKeyView,
  CreatedOAuthAppView,
  DataExportView,
  DeletionRequestView,
  ExperimentView,
  FeedHealthView,
  FeedPreview,
  GrowthPlanSummaryView,
  InvitationView,
  MediaAssetView,
  MembershipView,
  MentionEntityView,
  MetricObservationView,
  OAuthAppView,
  OAuthGrantView,
  PostVariantView,
  ProviderDestinationView,
  PublicationReceiptView,
  PublishJobView,
  ReceiptSummaryView,
  RssFeedView,
  RulePreview,
  RuleRunView,
  SessionView,
  ShortLinkStats,
  ShortLinkView,
  WebhookDeliveryView,
  WebhookEndpointView,
  WorkspaceView,
} from './views';

export * from './views';

/**
 * The shared application service contract.
 *
 * The web app, the REST API, the worker, the MCP server and the CLI are five
 * equal callers of exactly these methods. None of them may re-implement a
 * validation, an approval check, an idempotency rule or a tenancy filter. If a
 * behaviour is not reachable through this interface, it does not exist.
 */

export interface ActorContext {
  readonly actorType: 'user' | 'service_account' | 'oauth_app' | 'system';
  readonly actorId: string;
  readonly workspaceId: string;
  readonly scopes: readonly Scope[];
  readonly surface: CreationSurface;
  readonly correlationId: string;
  readonly approvalLevel: ApprovalLevel;
  readonly idempotencyKey?: string;
  readonly locale: string;
  /** Set by the surface when the human explicitly confirmed a level 3 action. */
  readonly humanConfirmed?: boolean;
  /** The developer application the call arrived through, when there is one. */
  readonly clientId?: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

/** An authenticated person before a workspace has been selected or created. */
export interface IdentityContext {
  readonly actorType: 'user' | 'service_account' | 'oauth_app' | 'system';
  readonly actorId: string;
  readonly userId: string | undefined;
  readonly surface: CreationSurface;
  readonly correlationId: string;
  readonly idempotencyKey?: string;
  readonly locale: string;
}

// ---------------------------------------------------------------------------
// Ports
// ---------------------------------------------------------------------------

export interface Clock {
  now(): Date;
}

export interface KeyValueSetOptions {
  readonly ttlSeconds?: number;
  /** Fail rather than overwrite. Used by the idempotency reservation. */
  readonly ifAbsent?: boolean;
}

export interface KeyValueStore {
  get(key: string): Promise<string | null>;
  /** Atomically read and remove a single-use value. */
  getAndDelete(key: string): Promise<string | null>;
  /** Returns false when `ifAbsent` was requested and the key already existed. */
  set(key: string, value: string, options?: KeyValueSetOptions): Promise<boolean>;
  delete(key: string): Promise<void>;
  increment(key: string, amount?: number, ttlSeconds?: number): Promise<number>;
  close(): Promise<void>;
}

export interface StoredObject {
  readonly key: string;
  readonly byteSize: number;
  readonly contentType: string;
  readonly checksumSha256: string;
}

export interface StorageObjectPage {
  readonly keys: readonly string[];
  /** Pass this value back to continue. `null` means the prefix is drained. */
  readonly nextCursor: string | null;
}

export interface UploadTicket {
  readonly uploadUrl: string;
  readonly method: 'PUT' | 'POST';
  readonly headers: Readonly<Record<string, string>>;
  readonly expiresAt: string;
  readonly storageKey: string;
}

export interface StoragePort {
  createUploadTicket(input: {
    readonly workspaceId: string;
    readonly key: string;
    readonly contentType: string;
    readonly byteSize: number;
    readonly checksumSha256: string;
  }): Promise<UploadTicket>;
  head(key: string): Promise<StoredObject | null>;
  read(key: string): Promise<Uint8Array>;
  write(key: string, bytes: Uint8Array, contentType: string): Promise<StoredObject>;
  remove(key: string): Promise<void>;
  list(input: {
    readonly workspaceId: string;
    readonly prefix: string;
    readonly cursor: string | null;
    readonly limit: number;
  }): Promise<StorageObjectPage>;
  createDownloadUrl(key: string, ttlSeconds: number): Promise<string>;
}

export interface MailMessage {
  readonly to: readonly string[];
  /** i18n key. The mailer renders it; no English literal ever reaches here. */
  readonly subjectKey: string;
  readonly bodyKey: string;
  readonly params: Readonly<Record<string, string | number | boolean | null>>;
  readonly locale: string;
  readonly workspaceId: string;
}

export interface MailerPort {
  send(message: MailMessage): Promise<void>;
}

/** Safe workflow context. It may be persisted in Temporal history. */
export interface WorkflowActorContext {
  readonly workspaceId: string;
  readonly correlationId: string;
  readonly actorId: string;
  readonly actorType: 'user' | 'service_account' | 'oauth_app' | 'system';
  readonly surface: CreationSurface;
  readonly approvalLevel: ApprovalLevel;
  readonly locale: string;
}

export interface PublishWorkflowTarget {
  readonly targetId: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly approvedCapabilityVersion: string;
  readonly threadItemIds: readonly string[];
  readonly threadDelaysSeconds: readonly number[];
}

export interface PublishWorkflowInput {
  readonly ctx: WorkflowActorContext;
  readonly publishJobId: string;
  readonly contentItemId: string;
  readonly contentVersionId: string;
  readonly contentVersionChecksum: string;
  readonly idempotencyKey: string;
  readonly executeAt: string;
  readonly scheduledLocalTime: string;
  readonly ianaTimeZone: string;
  readonly targets: readonly PublishWorkflowTarget[];
  readonly immediate: boolean;
}

/** Safe, PII-free input persisted in workflow history while an export builds. */
export interface DataExportWorkflowInput {
  readonly ctx: WorkflowActorContext;
  readonly exportId: string;
  readonly scope: DataExportScope;
  readonly format: DataExportFormat;
}

/** Result of building the encrypted archive, safe to persist in workflow history. */
export interface DataExportBuildResult {
  readonly state: 'ready' | 'failed';
  readonly byteSize: number | null;
  readonly checksumSha256: string | null;
}

/** PII-free scope captured before a deletion workflow starts. */
export interface DataDeletionScope {
  readonly publishJobIds: readonly string[];
  readonly connectionIds: readonly string[];
  readonly receiptIds: readonly string[];
  readonly objectPrefixes: readonly string[];
  readonly ruleIds: readonly string[];
  readonly feedIds: readonly string[];
}

/** Application-owned deletion activities used by the Temporal worker. */
export interface DataDeletionService {
  loadDeletionScope(input: {
    readonly ctx: WorkflowActorContext;
    readonly requestId: string;
  }): Promise<DataDeletionScope>;
  cancelScheduledJob(input: {
    readonly ctx: WorkflowActorContext;
    readonly publishJobId: string;
    readonly reasonKey: string;
  }): Promise<void>;
  revokeProviderConnection(input: {
    readonly ctx: WorkflowActorContext;
    readonly connectionId: string;
  }): Promise<void>;
  deleteStoredObjects(input: {
    readonly ctx: WorkflowActorContext;
    readonly requestId: string;
    readonly prefix: string;
    readonly cursor: string | null;
  }): Promise<{ readonly deletedCount: number; readonly nextCursor: string | null }>;
  tombstoneAnalytics(input: {
    readonly ctx: WorkflowActorContext;
    readonly requestId: string;
    readonly receiptIds: readonly string[];
  }): Promise<void>;
  finalizeDeletion(input: {
    readonly ctx: WorkflowActorContext;
    readonly requestId: string;
    readonly completedAt: string;
    readonly deletedObjectCount: number;
    readonly canceledJobCount: number;
    readonly revokedConnectionCount: number;
    readonly ruleIds: readonly string[];
    readonly feedIds: readonly string[];
  }): Promise<void>;
  markDeletionFailed(input: {
    readonly ctx: WorkflowActorContext;
    readonly requestId: string;
    readonly reasonKey: string;
  }): Promise<void>;
}

export interface DataLifecycleService {
  request(
    ctx: ActorContext,
    input: {
      readonly scope?: DeletionRequestScope;
      readonly confirmation: string;
      readonly reason?: string;
    },
  ): Promise<DeletionRequestView>;
  current(ctx: ActorContext): Promise<DeletionRequestView | null>;
  get(ctx: ActorContext, requestId: string): Promise<DeletionRequestView>;
  cancel(ctx: ActorContext, requestId: string): Promise<DeletionRequestView>;
}

/**
 * Safe workflow input for a bulk import.
 *
 * Identifiers and a mode, nothing else. The manifest itself never enters
 * workflow history: it is a customer file that may contain anything, and
 * Temporal history is not the place for it.
 */
export interface BulkImportWorkflowInput {
  readonly ctx: WorkflowActorContext;
  readonly importJobId: string;
  /** `null` runs the dry run only. Applying is always a separate decision. */
  readonly applyMode: BulkImportApplyMode | null;
}

export interface BulkImportWorkflowOutput {
  readonly importJobId: string;
  readonly state: BulkImportState;
  readonly counts: BulkImportCounts;
}

/** Safe workflow input persisted in Temporal history while a deletion waits. */
export interface DataDeletionWorkflowInput {
  readonly ctx: WorkflowActorContext;
  readonly requestId: string;
  readonly graceMs: number;
}

/** Infrastructure seam for encrypting an export before it reaches object storage. */
export interface DataExportEncryptionPort {
  encrypt(input: {
    readonly workspaceId: string;
    readonly exportId: string;
    readonly plaintext: Uint8Array;
  }): Promise<{ readonly bytes: Uint8Array; readonly keyVersion: string }>;
  decrypt(input: {
    readonly workspaceId: string;
    readonly exportId: string;
    readonly bytes: Uint8Array;
  }): Promise<Uint8Array>;
}

export interface DataExportContent {
  readonly bytes: Uint8Array;
  readonly contentType: 'application/json';
  readonly filename: string;
  readonly expiresAt: string;
}

export interface SchedulerPort {
  schedulePublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly executeAt: Date;
    readonly idempotencyKey: string;
    readonly workflowInput: PublishWorkflowInput;
  }): Promise<{ readonly workflowId: string; readonly runId: string }>;
  cancelPublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly reason: string;
  }): Promise<void>;
  reschedulePublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly executeAt: Date;
    readonly ianaTimeZone: string;
  }): Promise<void>;
  signalPublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly signal: string;
    readonly payload?: Record<string, unknown>;
  }): Promise<void>;
  /**
   * Hold and release, optional in the same way `scheduleBulkImport` is.
   *
   * The publish workflow has always understood `pause` and `resume` signals, so
   * a scheduler that does not implement these named methods still delivers the
   * intent correctly through `signalPublish`. Naming them buys one thing that
   * matters: a resume carrying a new instant is a reschedule followed by a
   * resume, and putting that ordering in one place stops each caller from
   * inventing its own.
   */
  pausePublish?(input: { readonly jobId: string; readonly workspaceId: string }): Promise<void>;
  resumePublish?(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly executeAt?: Date;
    readonly ianaTimeZone?: string;
  }): Promise<void>;
  scheduleAnalyticsSync(input: {
    readonly ctx: WorkflowActorContext;
    readonly workspaceId: string;
    readonly connectionId: string;
    readonly provider: ProviderId;
    readonly receiptId?: string;
    readonly publishedAt?: string;
    readonly at: Date;
  }): Promise<void>;
  startRuleRun(input: {
    readonly ctx: WorkflowActorContext;
    readonly ruleId: string;
    readonly workspaceId: string;
    readonly runId: string;
    readonly sourceKey: string;
    readonly event: Record<string, unknown>;
    readonly dryRun?: boolean;
  }): Promise<{ readonly workflowId: string }>;
  scheduleDataExport(input: {
    readonly exportId: string;
    readonly workspaceId: string;
    readonly executeAt: Date;
    readonly workflowInput: DataExportWorkflowInput;
  }): Promise<{ readonly workflowId: string; readonly runId: string }>;
  scheduleDataDeletion(input: {
    readonly requestId: string;
    readonly workspaceId: string;
    readonly executeAt: Date;
    readonly workflowInput: DataDeletionWorkflowInput;
  }): Promise<{ readonly workflowId: string; readonly runId: string }>;
  cancelDataDeletion(input: {
    readonly requestId: string;
    readonly workspaceId: string;
    readonly reason: string;
  }): Promise<void>;
  /**
   * Optional while only the worker's own scheduler implements it, in the same
   * way `ConnectorRegistry.beginOAuth` is optional. A deployment without it
   * still validates and applies inline through the application service; it
   * simply does not get durable retries for a very large manifest.
   */
  scheduleBulkImport?(input: {
    readonly importJobId: string;
    readonly workspaceId: string;
    readonly executeAt: Date;
    readonly workflowInput: BulkImportWorkflowInput;
  }): Promise<{ readonly workflowId: string; readonly runId: string }>;
  describe(input: {
    readonly jobId: string;
    readonly workspaceId: string;
  }): Promise<{ readonly status: string; readonly historyLength: number } | null>;
}

/**
 * The connector registry and the AI, billing gateways are owned by other
 * packages. The application depends on the narrow surface it actually calls, so
 * a change in a connector adapter cannot ripple into a use case.
 */
export interface ConnectorRegistry {
  has(provider: ProviderId): boolean;
  /**
   * Build a provider-owned authorization URL. The application owns state and
   * the exact callback URI; the adapter owns the official provider endpoint
   * and requested scopes. It is optional while no connector has passed the
   * production definition-of-done gate.
   */
  beginOAuth?(input: {
    readonly provider: ProviderId;
    readonly state: string;
    readonly codeChallenge: string;
    readonly codeChallengeMethod: 'S256';
    readonly redirectUri: string;
  }): Promise<{
    readonly authorizationUrl: string;
    readonly requestedScopes: readonly string[];
  }>;
  /**
   * Exchange one application-owned callback transaction and discover accounts
   * without writing credentials. The application persists the returned secret
   * values only after account selection and an AAD-bound vault transaction.
   */
  completeOAuth?(input: {
    readonly provider: ProviderId;
    readonly workspaceId: string;
    readonly code: string;
    readonly codeVerifier: SecretValue;
    readonly expectedCodeChallenge: string;
    readonly redirectUri: string;
  }): Promise<OAuthDiscoveryResult>;
  capabilitiesFor(input: {
    readonly provider: ProviderId;
    readonly connectionId: string;
    readonly accountType: string;
  }): Promise<CapabilitySnapshot>;
}

/** The connector result kept in process between OAuth exchange and selection. */
export interface OAuthDiscoveryResult {
  readonly credential: CredentialResult;
  readonly accounts: readonly ExternalAccount[];
}

/** Runtime binding used by the application-owned OAuth gateway factory. */
export interface OAuthProviderBinding {
  readonly connector: SocialConnector;
  readonly http: ProviderHttpClient;
  readonly client: OAuthClientConfig;
  readonly clientAuthMethod?: ClientAuthMethod;
}

export interface OAuthProviderResolver {
  resolve(provider: ProviderId): OAuthProviderBinding | null;
}

export interface AiGateway {
  isAvailable(): boolean;
}

export interface EntitlementCheck {
  readonly allowed: boolean;
  /** i18n key naming the entitlement that blocked the action. */
  readonly reasonKey: string | null;
  readonly limit: number | null;
  readonly used: number | null;
}

export interface MoneyView {
  readonly amountMinor: number;
  readonly currency: string;
}

export interface EntitlementStateView {
  readonly status:
    'none' | 'incomplete' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  readonly interval: 'monthly' | 'annual' | null;
  readonly trialEndsAt: string | null;
  readonly firstChargeAt: string | null;
  readonly firstChargeAmount: MoneyView | null;
  readonly renewalAmount: MoneyView | null;
  readonly portalUrl: string | null;
  readonly activeChannelCount: number;
  readonly channelLimit: number;
  readonly activeMemberCount: number;
  readonly memberLimit: number;
}

export interface UsageSummaryView {
  readonly periodStart: string;
  readonly total: MoneyView;
  readonly lines: readonly {
    readonly provider: ProviderId | null;
    readonly operation: string;
    readonly count: number;
    readonly unitAmount: MoneyView;
    readonly amount: MoneyView;
  }[];
}

export interface CheckoutSessionView {
  readonly checkoutId: string;
  readonly checkoutUrl: string;
  /** A return redirect never grants access. Only a verified webhook can. */
  readonly grantsEntitlement: false;
}

export interface PortalLinkView {
  readonly portalUrl: string;
}

/** Infrastructure gateway. Customer authorization stays in the service below. */
export interface BillingGateway {
  checkEntitlement(input: {
    readonly workspaceId: string;
    readonly key: string;
    readonly requested?: number;
  }): Promise<EntitlementCheck>;
  recordUsage(input: {
    readonly workspaceId: string;
    readonly key: string;
    readonly quantity: number;
    readonly idempotencyKey: string;
  }): Promise<void>;
  getEntitlements(workspaceId: string): Promise<EntitlementStateView>;
  getUsage(
    workspaceId: string,
    range?: { readonly from: string; readonly to: string; readonly ianaTimeZone: string },
  ): Promise<UsageSummaryView>;
  createCheckout(input: {
    readonly workspaceId: string;
    readonly actorType: ActorContext['actorType'];
    readonly actorId: string;
    readonly surface: CreationSurface;
    readonly correlationId: string;
    readonly locale: string;
    readonly idempotencyKey: string;
    readonly interval: 'monthly' | 'annual';
    readonly successUrl: string;
  }): Promise<CheckoutSessionView>;
  createPortalLink(input: {
    readonly workspaceId: string;
    readonly returnUrl: string;
  }): Promise<PortalLinkView>;
  handleProviderWebhook(input: {
    readonly eventId: string;
    readonly eventType: string;
    readonly bodyHash: string;
    readonly payload: Readonly<Record<string, unknown>>;
  }): Promise<{ readonly processed: boolean; readonly duplicate: boolean }>;
}

export interface ServiceDeps {
  readonly prisma: RelayPrismaClient;
  readonly kv: KeyValueStore;
  readonly connectors: ConnectorRegistry;
  /**
   * Envelope encryption is injected at the composition root. Keeping it out
   * of the application package prevents a callback from ever persisting a
   * plaintext provider token or silently falling back to an unsafe key.
   */
  readonly credentialVault?: CredentialVaultPort;
  /** Workspace-scoped and transaction-bound in production composition. */
  readonly credentialStore?: CredentialStorePort;
  readonly oauthPending?: OAuthPendingDiscoveryPort;
  readonly ai: AiGateway;
  readonly billing: BillingGateway;
  readonly scheduler: SchedulerPort;
  readonly storage: StoragePort;
  /** Safe user-supplied URL fetcher. Tests inject a network-free adapter. */
  readonly remoteMediaFetch?: (
    url: string,
    options: { readonly maxBytes: number },
  ) => Promise<
    Pick<
      SafeFetchResult,
      'finalUrl' | 'status' | 'body' | 'contentType' | 'redirectChain' | 'resolvedAddresses'
    >
  >;
  readonly exportEncryption?: DataExportEncryptionPort;
  readonly mailer: MailerPort;
  readonly logger: Logger;
  readonly clock: Clock;
  readonly config: RelayConfig;
  /** Optional provider duplicate probe. Persistence is always checked first. */
  readonly workerPublishingProbe?: WorkerPublishingProbe;
  /** Credential-isolated provider operations executed by the worker/runtime. */
  readonly connectorExecutionGateway?: ConnectorExecutionPort;
}

export interface ConnectorExecutionPort {
  revoke(input: { readonly workspaceId: string; readonly connectionId: string }): Promise<void>;
  listDestinations(input: {
    readonly workspaceId: string;
    readonly connectionId: string;
    readonly kind?: string;
    readonly query?: string;
    readonly limit: number;
  }): Promise<
    readonly {
      readonly externalId: string;
      readonly kind: string;
      readonly displayLabel: string;
      readonly canPost: boolean;
      readonly refreshedAt: string;
      readonly expiresAt: string;
    }[]
  >;
  searchMentions(input: {
    readonly workspaceId: string;
    readonly connectionId: string;
    readonly query: string;
    readonly limit: number;
  }): Promise<
    readonly {
      readonly externalId: string;
      readonly kind: string;
      readonly displayLabel: string;
      readonly handle: string | null;
      readonly avatarUrl: string | null;
      readonly resolvedAt: string;
    }[]
  >;
}

export type WorkerActivityContext = Omit<ActorContext, 'scopes'>;

export interface WorkerExternalPublication {
  readonly externalPostId: string;
  readonly permalink: string | null;
  readonly publishedAt: string;
  readonly externalAccountId: string;
}

export interface WorkerReceiptItem {
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

export interface WorkerPublishingProbe {
  ensureNotAlreadyPublished(input: {
    readonly ctx: WorkerActivityContext;
    readonly publishJobId: string;
    readonly targetId: string;
    readonly connectionId: string;
    readonly attemptId: string;
    readonly providerIdempotencyToken: string;
    readonly since: string;
  }): Promise<{
    readonly verdict: 'not_published' | 'published' | 'indeterminate';
    readonly publication: WorkerExternalPublication | null;
  }>;
}

/** Durable half of the worker activity surface. Kept structural to avoid a package cycle. */
export interface WorkerPublishingService {
  preflightCampaign(input: {
    readonly ctx: WorkerActivityContext;
    readonly publishJobId: string;
    readonly contentItemId: string;
    readonly contentVersionId: string;
    readonly contentVersionChecksum: string;
    readonly targetIds: readonly string[];
    readonly scheduledInstant: string;
  }): Promise<{
    readonly verdict: 'proceed' | 'action_required' | 'needs_reapproval' | 'blocked';
    readonly messageKey: string | null;
    readonly errorCode: ErrorCode | null;
    readonly blockedTargetIds: readonly string[];
  }>;
  beginPublishAttempt(input: {
    readonly ctx: WorkerActivityContext;
    readonly publishJobId: string;
    readonly targetId: string;
    readonly connectionId: string;
    readonly attemptNumber: number;
    readonly idempotencyKey: string;
  }): Promise<{
    readonly attemptId: string;
    readonly attemptNumber: number;
    readonly providerIdempotencyToken: string;
    readonly alreadyPublished: WorkerExternalPublication | null;
  }>;
  ensureNotAlreadyPublished(
    input: Parameters<WorkerPublishingProbe['ensureNotAlreadyPublished']>[0],
  ): ReturnType<WorkerPublishingProbe['ensureNotAlreadyPublished']>;
  finalizeAttempt(input: {
    readonly ctx: WorkerActivityContext;
    readonly publishJobId: string;
    readonly targetId: string;
    readonly attemptId: string;
    readonly resultState: PublishState;
    readonly errorClass: ErrorClass | null;
    readonly errorCode: ErrorCode | null;
    readonly retryable: boolean;
    readonly nextRetryAt: string | null;
  }): Promise<void>;
  setTargetState(input: {
    readonly ctx: WorkerActivityContext;
    readonly publishJobId: string;
    readonly targetId: string;
    readonly state: PublishState;
    readonly errorCode: ErrorCode | null;
    readonly messageKey: string | null;
  }): Promise<void>;
  setJobState(input: {
    readonly ctx: WorkerActivityContext;
    readonly publishJobId: string;
    readonly state: PublishState;
    readonly errorCode: ErrorCode | null;
  }): Promise<void>;
  writeReceipt(input: {
    readonly ctx: WorkerActivityContext;
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
    readonly publication: WorkerExternalPublication;
    readonly items: readonly WorkerReceiptItem[];
  }): Promise<{ readonly receiptId: string; readonly created: boolean }>;
  emitEvent(input: {
    readonly ctx: WorkerActivityContext;
    readonly event: WebhookEventName;
    readonly resourceId: string;
    readonly payload: Readonly<Record<string, unknown>>;
    readonly dedupeKey: string;
  }): Promise<void>;
  notify(input: {
    readonly ctx: WorkerActivityContext;
    readonly messageKey: string;
    readonly resourceId: string;
    readonly params: Readonly<Record<string, string>>;
  }): Promise<void>;
  prepareTargetMedia(input: {
    readonly ctx: WorkerActivityContext;
    readonly publishJobId: string;
    readonly targetId: string;
    readonly connectionId: string;
    readonly contentVersionId: string;
  }): Promise<{
    readonly preparedMediaIds: readonly string[];
    readonly derivativeCount: number;
    readonly totalBytes: number;
  }>;
  scheduleAnalyticsFetches(input: {
    readonly ctx: WorkerActivityContext;
    readonly connectionId: string;
    readonly receiptId: string;
    readonly provider: ProviderId;
    readonly publishedAt: string;
  }): Promise<{ readonly offsetsMs: readonly number[] }>;
}

export interface WorkerWebhookService {
  loadWebhookDelivery(input: {
    readonly ctx: WorkerActivityContext;
    readonly deliveryId: string;
  }): Promise<{
    readonly deliveryId: string;
    readonly endpointId: string;
    readonly eventName: WebhookEventName;
    readonly attempt: number;
    readonly endpointEnabled: boolean;
    readonly consecutiveFailures: number;
    readonly alreadyDelivered: boolean;
  }>;
  deliverWebhook(input: {
    readonly ctx: WorkerActivityContext;
    readonly deliveryId: string;
    readonly endpointId: string;
    readonly attempt: number;
    readonly isRedelivery: boolean;
  }): Promise<{
    readonly status: 'succeeded' | 'failed';
    readonly responseStatus: number | null;
    readonly retryable: boolean;
    readonly errorCode: ErrorCode | null;
  }>;
  recordWebhookAttempt(input: {
    readonly ctx: WorkerActivityContext;
    readonly deliveryId: string;
    readonly endpointId: string;
    readonly attempt: number;
    readonly status: 'succeeded' | 'failed' | 'exhausted' | 'disabled';
    readonly responseStatus: number | null;
    readonly nextAttemptAt: string | null;
  }): Promise<void>;
  disableWebhookEndpoint(input: {
    readonly ctx: WorkerActivityContext;
    readonly endpointId: string;
    readonly deliveryId: string;
    readonly reasonKey: string;
  }): Promise<void>;
  deadLetterWebhookDelivery(input: {
    readonly ctx: WorkerActivityContext;
    readonly endpointId: string;
    readonly deliveryId: string;
    readonly reasonKey: string;
  }): Promise<void>;
}

export interface CredentialVaultPort {
  encrypt(input: {
    readonly secret: SecretValue | string;
    readonly aad: CredentialAad;
    readonly purpose?: string;
  }): Promise<EncryptedCredential>;
  decryptForRequest?(input: {
    readonly record: EncryptedCredential;
    readonly aad: CredentialAad;
    readonly purpose: string;
  }): Promise<{ use<T>(callback: (value: string) => T | Promise<T>): Promise<T>; release(): void }>;
  decrypt?(input: {
    readonly record: EncryptedCredential;
    readonly aad: CredentialAad;
    readonly purpose?: string;
  }): Promise<string>;
}

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------

export interface PageQuery {
  readonly cursor?: string;
  readonly limit?: number;
}

export interface TargetSpec {
  readonly connectionId: string;
  readonly destinationId?: string | null;
  readonly privacyValue?: string | null;
  readonly disclosure?: DisclosureFlags | null;
  readonly mentions?: readonly MentionRef[];
}

export interface CreateDraftInput {
  readonly brandId: string;
  readonly campaignId?: string | null;
  readonly title?: string | null;
  readonly body: string;
  readonly contentKind?: ContentKind;
  readonly locale?: Locale;
  readonly mediaIds?: readonly string[];
  readonly links?: readonly LinkSpec[];
  readonly signature?: SignatureRef | null;
  readonly threadItems?: readonly ThreadItem[];
  readonly schedule?: ScheduleSpec | null;
  readonly disclosure?: DisclosureFlags;
  readonly targets?: readonly TargetSpec[];
  readonly approvalPolicy?: string;
}

export interface MasterDraftPatch {
  readonly title?: string | null;
  readonly body?: string;
  readonly contentKind?: ContentKind;
  readonly locale?: Locale;
  readonly mediaIds?: readonly string[];
  readonly links?: readonly LinkSpec[];
  readonly signature?: SignatureRef | null;
  readonly threadItems?: readonly ThreadItem[];
  readonly schedule?: ScheduleSpec | null;
  readonly disclosure?: DisclosureFlags;
  readonly campaignId?: string | null;
  /**
   * Fields a target has overridden are preserved by default. Set this to move a
   * named field back onto the master for every target, which is an explicit,
   * audited act rather than a silent overwrite.
   */
  readonly releaseOverridesFor?: readonly string[];
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export interface WorkspaceService {
  list(ctx: ActorContext, query?: PageQuery): Promise<Paginated<WorkspaceView>>;
  get(ctx: ActorContext, workspaceId?: string): Promise<WorkspaceView>;
  create(
    ctx: IdentityContext,
    input: {
      readonly name: string;
      readonly ianaTimeZone: string;
      readonly defaultLocale: Locale;
    },
  ): Promise<WorkspaceView>;
  update(
    ctx: ActorContext,
    workspaceIdOrPatch:
      | string
      | {
          readonly name?: string;
          readonly defaultLocale?: string;
          readonly defaultTimeZone?: string;
          readonly ianaTimeZone?: string;
          readonly contentLocales?: readonly string[];
          readonly markets?: readonly string[];
          readonly weekStart?: 0 | 1 | 6;
          readonly hourCycle?: 'h12' | 'h23';
        },
    patch?: {
      readonly name?: string;
      readonly defaultLocale?: string;
      readonly defaultTimeZone?: string;
      readonly ianaTimeZone?: string;
      readonly contentLocales?: readonly string[];
      readonly markets?: readonly string[];
      readonly weekStart?: 0 | 1 | 6;
      readonly hourCycle?: 'h12' | 'h23';
    },
  ): Promise<WorkspaceView>;
  listForUser(userId: string): Promise<readonly WorkspaceView[]>;
  engageKillSwitch(ctx: ActorContext, reasonKey: string): Promise<WorkspaceView>;
  releaseKillSwitch(ctx: ActorContext): Promise<WorkspaceView>;
}

export interface MembershipService {
  list(ctx: ActorContext, query?: PageQuery): Promise<Paginated<MembershipView>>;
  get(ctx: ActorContext, membershipId: string): Promise<MembershipView>;
  invite(
    ctx: ActorContext,
    input: { readonly email: string; readonly role: Role; readonly note?: string },
  ): Promise<InvitationView>;
  listInvitations(ctx: ActorContext, query?: PageQuery): Promise<Paginated<InvitationView>>;
  revokeInvitation(ctx: ActorContext, invitationId: string): Promise<void>;
  acceptInvitation(ctx: IdentityContext, token: string): Promise<MembershipView>;
  changeRole(ctx: ActorContext, membershipId: string, role: Role): Promise<MembershipView>;
  updateRole(ctx: ActorContext, membershipId: string, role: Role): Promise<MembershipView>;
  remove(ctx: ActorContext, membershipId: string): Promise<void>;
}

export interface BrandService {
  list(ctx: ActorContext, query?: PageQuery): Promise<Paginated<BrandView>>;
  get(ctx: ActorContext, brandId: string): Promise<BrandView>;
  create(
    ctx: ActorContext,
    input: { readonly name: string; readonly defaultTimeZone?: string },
  ): Promise<BrandView>;
  update(ctx: ActorContext, brandId: string, patch: Partial<BrandView>): Promise<BrandView>;
  archive(ctx: ActorContext, brandId: string): Promise<BrandView>;
  delete(ctx: ActorContext, brandId: string): Promise<void>;
}

export interface ConnectionService {
  listAvailableProviders(ctx: ActorContext): Promise<readonly ProviderId[]>;
  list(
    ctx: ActorContext,
    query?: PageQuery & { readonly brandId?: string; readonly provider?: ProviderId },
  ): Promise<Paginated<ConnectionView>>;
  get(ctx: ActorContext, connectionId: string): Promise<ConnectionView>;
  getCapabilities(ctx: ActorContext, connectionId: string): Promise<CapabilitySnapshot>;
  beginOAuth(
    ctx: ActorContext,
    input: {
      readonly provider: ProviderId;
      readonly brandId?: string | null;
      readonly redirectTo: string;
    },
  ): Promise<{ readonly authorizationUrl: string; readonly transactionId: string }>;
  handleOAuthCallback(
    ctx: ActorContext,
    input: {
      readonly transactionId: string;
      readonly code: string;
      readonly state: string;
    },
  ): Promise<void>;
  getOAuthAccountSelection(
    ctx: ActorContext,
    transactionId: string,
  ): Promise<OAuthAccountSelectionView>;
  completeOAuth(
    ctx: ActorContext,
    input: {
      readonly transactionId: string;
      readonly selectedExternalAccountIds: readonly string[];
    },
  ): Promise<readonly ConnectionView[]>;
  reconnect(
    ctx: ActorContext,
    connectionId: string,
  ): Promise<{ readonly authorizationUrl: string; readonly transactionId: string }>;
  pause(ctx: ActorContext, connectionId: string): Promise<ConnectionView>;
  resume(ctx: ActorContext, connectionId: string): Promise<ConnectionView>;
  disconnect(ctx: ActorContext, connectionId: string): Promise<ConnectionView>;
  listDestinations(
    ctx: ActorContext,
    connectionId: string,
    input: { readonly kind: string; readonly query?: string },
  ): Promise<readonly ProviderDestinationView[]>;
  searchMentions(
    ctx: ActorContext,
    connectionId: string,
    input: { readonly query: string },
  ): Promise<readonly MentionEntityView[]>;
}

export interface ContentService {
  createDraft(ctx: ActorContext, input: CreateDraftInput): Promise<ContentItemView>;
  get(ctx: ActorContext, contentItemId: string): Promise<ContentItemView>;
  list(
    ctx: ActorContext,
    query?: PageQuery & {
      readonly state?: PublishState;
      readonly brandId?: string;
      readonly campaignId?: string;
    },
  ): Promise<Paginated<ContentItemView>>;
  updateMaster(
    ctx: ActorContext,
    contentItemId: string,
    patch: MasterDraftPatch,
  ): Promise<ContentItemView>;
  overrideVariant(
    ctx: ActorContext,
    input: {
      readonly contentItemId: string;
      readonly targetId: string;
      readonly patch: VariantOverrides;
    },
  ): Promise<PostVariantView>;
  resetVariantToMaster(
    ctx: ActorContext,
    input: {
      readonly contentItemId: string;
      readonly targetId: string;
      readonly fields?: readonly string[];
    },
  ): Promise<PostVariantView>;
  setTargets(
    ctx: ActorContext,
    contentItemId: string,
    targets: readonly TargetSpec[],
  ): Promise<ContentItemView>;
  applySet(ctx: ActorContext, contentItemId: string, setId: string): Promise<ContentItemView>;
  applySignature(
    ctx: ActorContext,
    contentItemId: string,
    signatureId: string,
  ): Promise<ContentItemView>;
  freezeVersion(ctx: ActorContext, contentItemId: string): Promise<ContentVersionView>;
  preview(
    ctx: ActorContext,
    input: { readonly contentItemId: string; readonly targetId: string },
  ): Promise<CanonicalPreview>;
  delete(ctx: ActorContext, contentItemId: string): Promise<void>;
}

export interface ValidationService {
  validate(ctx: ActorContext, input: { readonly contentItemId: string }): Promise<ValidationResult>;
}

export interface ApprovalService {
  get(ctx: ActorContext, approvalId: string): Promise<ApprovalRequestView>;
  request(
    ctx: ActorContext,
    input: {
      readonly contentItemId: string;
      readonly approverIds?: readonly string[];
      readonly note?: string;
    },
  ): Promise<ApprovalRequestView>;
  decide(
    ctx: ActorContext,
    input: {
      readonly approvalId: string;
      readonly decision: 'approve' | 'request_changes' | 'reject';
      readonly note?: string;
    },
  ): Promise<ApprovalRequestView>;
  listPending(ctx: ActorContext, query?: PageQuery): Promise<Paginated<ApprovalRequestView>>;
}

export interface SchedulingService {
  schedule(
    ctx: ActorContext,
    input: { readonly contentItemId: string; readonly scheduleSpec: ScheduleSpec },
  ): Promise<PublishJobView>;
  reschedule(
    ctx: ActorContext,
    input: {
      readonly jobId: string;
      readonly scheduleSpec: ScheduleSpec;
      readonly confirmDst?: boolean;
    },
  ): Promise<PublishJobView>;
  cancel(
    ctx: ActorContext,
    input: { readonly jobId: string; readonly reason: string },
  ): Promise<PublishJobView>;
  /**
   * Hold a scheduled job where it is.
   *
   * Refused for anything already published or mid-dispatch, and refused for a
   * job the billing path is already holding, because those two holds are
   * cleared by different things. Implemented in `services/scheduling-pause.ts`.
   */
  pause(
    ctx: ActorContext,
    input: { readonly jobId: string; readonly note?: string },
  ): Promise<PublishJobView>;
  /**
   * Let a held job continue.
   *
   * `scheduleSpec` is required once the original instant has passed: resuming
   * onto a time that is already behind us would publish immediately, which is
   * the outcome the pause existed to prevent. When it is supplied it goes
   * through the same daylight saving confirmation as a reschedule.
   */
  resume(
    ctx: ActorContext,
    input: {
      readonly jobId: string;
      readonly scheduleSpec?: ScheduleSpec;
      readonly confirmDst?: boolean;
    },
  ): Promise<PublishJobView>;
  getCalendar(
    ctx: ActorContext,
    input: PageQuery & {
      readonly from: string;
      readonly to: string;
      readonly filters?: {
        readonly brandId?: string;
        readonly campaignId?: string;
        readonly connectionId?: string;
        readonly state?: PublishState;
      };
    },
  ): Promise<Paginated<CalendarEntry>>;
  /**
   * The next slot the queue model is willing to offer, with the ICU reason keys
   * that produced it. A project with no rules still gets one, labelled as such.
   */
  nextAvailableSlot(
    ctx: ActorContext,
    input: { readonly brandId: string; readonly after?: string },
  ): Promise<SlotProposal>;
}

/**
 * Queue rules and slot reservations.
 *
 * `previewSlot` reads. `proposeSlot` reserves an instant and freezes the rule
 * that chose it, then returns the local time with its reasons for a person to
 * accept. Neither one schedules anything: `acceptSlot` records the human
 * decision, and scheduling links the publish job onto the reservation.
 */
export interface QueueRuleService {
  list(
    ctx: ActorContext,
    query?: PageQuery & { readonly brandId?: string },
  ): Promise<Paginated<QueueRuleView>>;
  get(ctx: ActorContext, ruleId: string): Promise<QueueRuleView>;
  create(ctx: ActorContext, input: QueueRuleInput): Promise<QueueRuleView>;
  update(ctx: ActorContext, ruleId: string, patch: QueueRulePatch): Promise<QueueRuleView>;
  archive(ctx: ActorContext, ruleId: string): Promise<QueueRuleView>;
  previewSlot(
    ctx: ActorContext,
    input: { readonly brandId: string; readonly after?: string },
  ): Promise<SlotProposal>;
  proposeSlot(
    ctx: ActorContext,
    input: {
      readonly brandId: string;
      readonly after?: string;
      readonly contentItemId?: string;
    },
  ): Promise<QueueSlotReservationView>;
  acceptSlot(
    ctx: ActorContext,
    input: { readonly reservationId: string; readonly contentItemId: string },
  ): Promise<QueueSlotReservationView>;
  releaseSlot(
    ctx: ActorContext,
    input: { readonly reservationId: string; readonly reason?: string },
  ): Promise<QueueSlotReservationView>;
  listReservations(
    ctx: ActorContext,
    query: PageQuery & { readonly brandId: string },
  ): Promise<Paginated<QueueSlotReservationView>>;
}

/**
 * Posting Set management.
 *
 * A Set is read once, at apply time, by `ContentService.applySet`. Nothing on
 * this interface reaches a content item, a variant or a publish job: editing a
 * Set changes what the next apply produces and never rewrites work that was
 * already created, reviewed or approved from it.
 */
export interface PostingSetService {
  list(
    ctx: ActorContext,
    query?: PageQuery & { readonly brandId?: string; readonly includeArchived?: boolean },
  ): Promise<Paginated<PostingSetView>>;
  get(ctx: ActorContext, setId: string): Promise<PostingSetView>;
  create(ctx: ActorContext, input: PostingSetInput): Promise<PostingSetView>;
  update(ctx: ActorContext, setId: string, patch: PostingSetPatch): Promise<PostingSetView>;
  /** Retires the Set from the picker and frees its name. Content is untouched. */
  archive(ctx: ActorContext, setId: string): Promise<PostingSetView>;
}

/**
 * The composer's "remember these accounts for next time".
 *
 * Per person, per project, opt in, off by default, channel identifiers only.
 * `read` filters what it returns against live channel health and the acting
 * person's own authorization, so a revoked or paused account is never silently
 * reselected.
 */
export interface RememberedTargetService {
  read(ctx: ActorContext, input: { readonly brandId: string }): Promise<RememberedTargetsView>;
  remember(
    ctx: ActorContext,
    input: { readonly brandId: string; readonly connectionIds: readonly string[] },
  ): Promise<RememberedTargetsView>;
  forget(ctx: ActorContext, input: { readonly brandId: string }): Promise<void>;
  /** The project opt in. Turning it off deletes what was stored, project wide. */
  setEnabled(
    ctx: ActorContext,
    input: { readonly brandId: string; readonly enabled: boolean },
  ): Promise<{ readonly brandId: string; readonly enabled: boolean }>;
}

export interface PublishingService {
  publishNow(
    ctx: ActorContext,
    input: {
      readonly contentItemId: string;
      readonly confirmation: PublishConfirmationEvidence;
    },
  ): Promise<PublishJobView>;
  getJob(ctx: ActorContext, jobId: string): Promise<PublishJobView>;
  retryTarget(
    ctx: ActorContext,
    input: { readonly jobId: string; readonly targetId: string },
  ): Promise<PublishJobView>;
}

export interface AgentConfirmationService {
  request(
    ctx: ActorContext,
    input: { readonly contentItemId: string },
  ): Promise<AgentConfirmationView>;
  get(ctx: ActorContext, confirmationId: string): Promise<AgentConfirmationView>;
  approve(ctx: ActorContext, confirmationId: string): Promise<AgentConfirmationView>;
  consume(
    ctx: ActorContext,
    input: { readonly confirmationId: string; readonly contentItemId: string },
  ): Promise<{
    readonly confirmationId: string;
    readonly confirmedBy: string;
    readonly confirmedAt: string;
    readonly summary: AgentConfirmationSummary;
  }>;
}

/**
 * Evidence that a person reviewed the exact version and publication blast
 * radius. This is deliberately richer than a boolean so a caller cannot reuse
 * a stale confirmation after content or targets change.
 */
export interface PublishConfirmationEvidence {
  readonly acknowledgedTargetCount: number;
  readonly acknowledgedVersionChecksum: string;
  readonly acknowledgedEscalations: readonly string[];
}

export interface ReceiptService {
  get(ctx: ActorContext, receiptId: string): Promise<PublicationReceiptView>;
  listForJob(ctx: ActorContext, jobId: string): Promise<readonly PublicationReceiptView[]>;
  listRecent(ctx: ActorContext, query?: PageQuery): Promise<Paginated<ReceiptSummaryView>>;
}

export interface ActionCenterService {
  list(
    ctx: ActorContext,
    query?: PageQuery & {
      readonly category?: ActionItemCategory;
      readonly includeSnoozed?: boolean;
    },
  ): Promise<Paginated<ActionItemView>>;
  snooze(ctx: ActorContext, itemId: string, until: string): Promise<ActionItemView>;
  unsnooze(ctx: ActorContext, itemId: string): Promise<void>;
}

export interface MediaEditOperation {
  readonly kind: 'crop' | 'resize' | 'rotate' | 'compress' | 'convert';
  readonly params: Readonly<Record<string, number | string>>;
}

export interface MediaService {
  createUploadUrl(
    ctx: ActorContext,
    input: {
      readonly filename: string;
      readonly mimeType: string;
      readonly byteSize: number;
      readonly sha256: string;
      readonly brandId?: string | null;
    },
  ): Promise<{
    readonly uploadUrl: string;
    readonly mediaId: string;
    readonly method: 'PUT' | 'POST';
    readonly headers: Readonly<Record<string, string>>;
    readonly expiresAt: string;
    readonly retentionExpiresAt: string;
  }>;
  finalizeUpload(ctx: ActorContext, mediaId: string): Promise<MediaAssetView>;
  importFromUrl(
    ctx: ActorContext,
    input: { readonly url: string; readonly brandId?: string | null },
  ): Promise<OperationRef>;
  list(
    ctx: ActorContext,
    query?: PageQuery & { readonly brandId?: string; readonly kind?: string },
  ): Promise<Paginated<MediaAssetView>>;
  get(ctx: ActorContext, mediaId: string): Promise<MediaAssetView>;
  delete(ctx: ActorContext, mediaId: string): Promise<void>;
  edit(
    ctx: ActorContext,
    input: { readonly mediaId: string; readonly ops: readonly MediaEditOperation[] },
  ): Promise<MediaAssetView>;
  setAltText(
    ctx: ActorContext,
    input: {
      readonly mediaId: string;
      readonly altText: string | null;
      readonly waived?: boolean;
      readonly waivedReason?: string | null;
    },
  ): Promise<MediaAssetView>;
  declareRights(
    ctx: ActorContext,
    input: {
      readonly mediaId: string;
      readonly owner: 'workspace' | 'licensed' | 'ugc';
      readonly licenseReference: string | null;
      readonly peopleAppear: boolean;
      readonly peopleConsented: boolean;
      readonly containsMusic: boolean;
      readonly confirmed: true;
    },
  ): Promise<MediaAssetView>;
  /** Worker-only retention sweep. Object deletion is idempotent and retryable. */
  purgeExpired(ctx: ActorContext, limit?: number): Promise<{ readonly purged: number }>;
}

export interface AnalyticsService {
  getPostMetrics(
    ctx: ActorContext,
    input: { readonly receiptId: string },
  ): Promise<readonly MetricObservationView[]>;
  getAccountMetrics(
    ctx: ActorContext,
    input: {
      readonly connectionId: string;
      readonly range: { readonly from: string; readonly to: string };
    },
  ): Promise<readonly MetricObservationView[]>;
  compare(
    ctx: ActorContext,
    input: {
      readonly receiptIds?: readonly string[];
      readonly period?: { readonly from: string; readonly to: string };
      readonly baseline: 'trailing_median' | 'previous_period';
      readonly connectionId?: string;
    },
  ): Promise<ComparisonReport>;
  listExperiments(ctx: ActorContext, query?: PageQuery): Promise<Paginated<ExperimentView>>;
  createExperiment(
    ctx: ActorContext,
    input: {
      readonly name: string;
      readonly hypothesis: string;
      readonly successMetric: string;
      readonly windowStart: string;
      readonly windowEnd: string;
      readonly campaignId?: string | null;
    },
  ): Promise<ExperimentView>;
}

export interface ShortLinkService {
  create(
    ctx: ActorContext,
    input: {
      readonly destinationUrl: string;
      readonly campaignId?: string | null;
      readonly domainId?: string | null;
      readonly brandId?: string | null;
      readonly utm?: UtmParameters;
      readonly expiresAt?: string | null;
      readonly slug?: string | null;
    },
  ): Promise<ShortLinkView>;
  list(ctx: ActorContext, query?: PageQuery): Promise<Paginated<ShortLinkView>>;
  get(ctx: ActorContext, linkId: string): Promise<ShortLinkView>;
  /** No ActorContext: the redirect service is unauthenticated by design. */
  resolve(
    slug: string,
    domain?: string | null,
  ): Promise<{ readonly destinationUrl: string; readonly linkId: string } | null>;
  /** No ActorContext, for the same reason. Fire and forget from the edge. */
  recordClick(input: {
    readonly linkId: string;
    readonly occurredAt: string;
    readonly dedupeKey: string;
    readonly countryCode?: string | null;
    readonly deviceClass?: string | null;
    readonly referrerClass?: string | null;
    readonly botClass?: 'human' | 'suspected_bot' | 'known_bot' | 'unknown';
  }): Promise<void>;
  getStats(
    ctx: ActorContext,
    input: {
      readonly linkId: string;
      readonly range: { readonly from: string; readonly to: string };
    },
  ): Promise<ShortLinkStats>;
  updateDestination(
    ctx: ActorContext,
    linkId: string,
    input: { readonly destinationUrl: string; readonly reason: string },
  ): Promise<ShortLinkView>;
  setEnabled(
    ctx: ActorContext,
    linkId: string,
    input: { readonly enabled: boolean; readonly reason: string },
  ): Promise<ShortLinkView>;
}

export interface AutomationRuleInput {
  readonly brandId: string;
  readonly name: string;
  readonly trigger: { readonly kind: RuleTriggerKind; readonly config?: Record<string, unknown> };
  readonly conditions?: readonly {
    readonly kind: string;
    readonly config?: Record<string, unknown>;
  }[];
  readonly actions: readonly {
    readonly kind: RuleActionKind;
    readonly config?: Record<string, unknown>;
  }[];
  readonly delaySeconds?: number;
  readonly endCondition?:
    { readonly kind: 'manual' } | { readonly kind: 'count'; readonly runs: number };
  readonly requiresApproval?: boolean;
  readonly preauthorizedConnectionIds?: readonly string[];
  readonly maxExecutionsPerSource?: number | null;
  readonly cooldownSeconds?: number | null;
  readonly measurementWindowSeconds?: number | null;
}

export interface AutomationRuleService {
  list(ctx: ActorContext, query?: PageQuery): Promise<Paginated<AutomationRuleView>>;
  get(ctx: ActorContext, ruleId: string): Promise<AutomationRuleView>;
  create(ctx: ActorContext, input: AutomationRuleInput): Promise<AutomationRuleView>;
  update(
    ctx: ActorContext,
    ruleId: string,
    input: Partial<AutomationRuleInput>,
  ): Promise<AutomationRuleView>;
  enable(ctx: ActorContext, ruleId: string): Promise<AutomationRuleView>;
  disable(ctx: ActorContext, ruleId: string, reasonKey?: string): Promise<AutomationRuleView>;
  delete(ctx: ActorContext, ruleId: string): Promise<void>;
  preview(ctx: ActorContext, ruleId: string): Promise<RulePreview>;
  testRun(
    ctx: ActorContext,
    input: { readonly ruleId: string; readonly sampleEvent: Record<string, unknown> },
  ): Promise<RuleRunView>;
  listRuns(
    ctx: ActorContext,
    input: PageQuery & { readonly ruleId: string },
  ): Promise<Paginated<RuleRunView>>;
  triggerFromInbound(
    ctx: ActorContext,
    input: { readonly ruleName: string; readonly event: Record<string, unknown> },
  ): Promise<OperationRef>;
}

export interface RssService {
  validateFeed(ctx: ActorContext, input: { readonly url: string }): Promise<FeedPreview>;
  create(
    ctx: ActorContext,
    input: {
      readonly brandId: string;
      readonly title: string;
      readonly feedUrl: string;
      readonly connectionIds?: readonly string[];
      readonly publishPolicy?: 'draft' | 'approval';
      readonly pollIntervalSeconds?: number;
    },
  ): Promise<RssFeedView>;
  update(
    ctx: ActorContext,
    feedId: string,
    patch: {
      readonly title?: string;
      readonly connectionIds?: readonly string[];
      readonly publishPolicy?: 'draft' | 'approval';
      readonly pollIntervalSeconds?: number;
      readonly paused?: boolean;
    },
  ): Promise<RssFeedView>;
  list(ctx: ActorContext, query?: PageQuery): Promise<Paginated<RssFeedView>>;
  delete(ctx: ActorContext, feedId: string): Promise<void>;
  getHealth(ctx: ActorContext, feedId: string): Promise<FeedHealthView>;
}

export interface GrowthService {
  getBusinessProfile(ctx: ActorContext): Promise<BusinessProfileView | null>;
  upsertBusinessProfile(
    ctx: ActorContext,
    input: {
      readonly profileId?: string;
      readonly brandId: string;
      readonly productName: string;
      readonly siteUrl: string;
      readonly description: string;
      readonly category: string;
      readonly markets?: readonly string[];
      readonly contentLocales?: readonly string[];
      readonly idealCustomer?: string;
      readonly objective: string;
      readonly conversionEvent?: string;
      readonly existingChannels?: readonly string[];
      readonly proofAssets?: readonly string[];
      readonly competitors?: readonly string[];
      readonly weeklyCapacityHours?: number;
      readonly prohibitedClaims?: readonly string[];
      readonly prohibitedTopics?: readonly string[];
    },
  ): Promise<BusinessProfileView>;
  confirmBusinessProfile(
    ctx: ActorContext,
    input: {
      readonly profileId: string;
      readonly confirmedAssumptionIds?: readonly string[];
      readonly corrections?: Readonly<Record<string, string>>;
    },
  ): Promise<BusinessProfileView>;
  generatePlan(ctx: ActorContext, input: { readonly profileId: string }): Promise<OperationRef>;
  getCurrentPlan(ctx: ActorContext): Promise<GrowthPlan | null>;
  getPlanSummary(ctx: ActorContext): Promise<GrowthPlanSummaryView>;
  getPlan(ctx: ActorContext, planId: string): Promise<GrowthPlan>;
  exportPlan(
    ctx: ActorContext,
    input: { readonly planId: string; readonly format: GrowthExportFormat },
  ): Promise<{ readonly contentType: string; readonly body: string }>;
  createDraftFromItem(
    ctx: ActorContext,
    input: { readonly planId: string; readonly itemId: string },
  ): Promise<ContentItemView>;
  proposeSlotFromItem(
    ctx: ActorContext,
    input: { readonly planId: string; readonly itemId: string },
  ): Promise<CalendarEntry>;
  listOpportunities(
    ctx: ActorContext,
    input?: {
      readonly category?: string;
      readonly region?: string;
      readonly verifiedAfter?: string;
    },
  ): Promise<readonly OpportunityRecord[]>;
  listTools(
    ctx: ActorContext,
    input?: { readonly workflow?: string; readonly verifiedAfter?: string },
  ): Promise<readonly ToolRecord[]>;
}

export interface WebhookService {
  list(ctx: ActorContext, query?: PageQuery): Promise<Paginated<WebhookEndpointView>>;
  create(
    ctx: ActorContext,
    input: {
      readonly name: string;
      readonly url: string;
      readonly events: readonly WebhookEventName[];
      readonly connectionScope?: readonly string[];
    },
  ): Promise<{ readonly endpoint: WebhookEndpointView; readonly signingSecret: string }>;
  update(
    ctx: ActorContext,
    endpointId: string,
    patch: {
      readonly url?: string;
      readonly events?: readonly WebhookEventName[];
      readonly connectionScope?: readonly string[];
      readonly paused?: boolean;
    },
  ): Promise<WebhookEndpointView>;
  delete(ctx: ActorContext, endpointId: string): Promise<void>;
  testDelivery(ctx: ActorContext, endpointId: string): Promise<WebhookDeliveryView>;
  listDeliveries(
    ctx: ActorContext,
    input: PageQuery & { readonly endpointId: string },
  ): Promise<Paginated<WebhookDeliveryView>>;
  redeliver(ctx: ActorContext, deliveryId: string): Promise<WebhookDeliveryView>;
  rotateSecret(
    ctx: ActorContext,
    endpointId: string,
  ): Promise<{ readonly endpoint: WebhookEndpointView; readonly signingSecret: string }>;
  /** Internal, called by the worker. Fans an event out to matching endpoints. */
  emit(
    event: WebhookEventName,
    payload: Record<string, unknown>,
    options: {
      readonly workspaceId: string;
      readonly connectionId?: string | null;
      readonly correlationId?: string | null;
      readonly isTest?: boolean;
    },
  ): Promise<readonly WebhookDeliveryView[]>;
}

export interface CredentialVaultService {
  /** Never returns plaintext. Reports whether a usable credential exists. */
  status(
    ctx: ActorContext,
    connectionId: string,
  ): Promise<{
    readonly present: boolean;
    readonly accessTokenExpiresAt: string | null;
    readonly refreshTokenExpiresAt: string | null;
    readonly lastRefreshedAt: string | null;
    readonly needsAction: boolean;
  }>;
  describe(
    ctx: ActorContext,
    connectionId: string,
  ): Promise<{
    readonly present: boolean;
    readonly accessTokenExpiresAt: string | null;
    readonly refreshTokenExpiresAt: string | null;
    readonly lastRefreshedAt: string | null;
    readonly needsAction: boolean;
  }>;
  revoke(ctx: ActorContext, connectionId: string): Promise<void>;
}

export interface ApiKeyService {
  list(ctx: ActorContext, query?: PageQuery): Promise<Paginated<ApiKeyView>>;
  create(
    ctx: ActorContext,
    input: {
      readonly name: string;
      readonly scopes: readonly Scope[];
      readonly expiresAt: string;
      readonly serviceAccountId?: string | null;
    },
  ): Promise<CreatedApiKeyView>;
  revoke(ctx: ActorContext, apiKeyId: string): Promise<ApiKeyView>;
}

export interface OAuthAppService {
  list(ctx: ActorContext, query?: PageQuery): Promise<Paginated<OAuthAppView>>;
  get(ctx: ActorContext, appId: string): Promise<OAuthAppView>;
  create(
    ctx: ActorContext,
    input: {
      readonly name: string;
      readonly clientType: 'public' | 'confidential';
      readonly redirectUris: readonly string[];
      readonly allowedScopes: readonly Scope[];
      readonly homepageUrl: string;
      readonly privacyPolicyUrl: string;
      readonly termsUrl: string;
      readonly logoUrl?: string | null;
      readonly supportEmail: string;
    },
  ): Promise<CreatedOAuthAppView>;
  update(
    ctx: ActorContext,
    appId: string,
    patch: {
      readonly name?: string;
      readonly redirectUris?: readonly string[];
      readonly allowedScopes?: readonly Scope[];
      readonly homepageUrl?: string;
      readonly privacyPolicyUrl?: string;
      readonly termsUrl?: string;
      readonly logoUrl?: string | null;
      readonly supportEmail?: string;
      readonly status?: 'active' | 'sandbox' | 'disabled';
    },
  ): Promise<OAuthAppView>;
  rotateSecret(ctx: ActorContext, appId: string): Promise<CreatedOAuthAppView>;
  delete(ctx: ActorContext, appId: string): Promise<void>;
  listGrants(ctx: ActorContext, query?: PageQuery): Promise<Paginated<OAuthGrantView>>;
  revokeGrant(ctx: ActorContext, grantId: string): Promise<OAuthGrantView>;
}

export interface AuditService {
  list(
    ctx: ActorContext,
    input?: PageQuery & {
      readonly action?: string;
      readonly targetType?: string;
      readonly targetId?: string;
      readonly actorId?: string;
      readonly from?: string;
      readonly to?: string;
    },
  ): Promise<Paginated<AuditEventView>>;
}

export interface DataExportService {
  request(
    ctx: ActorContext,
    input: { readonly scope?: DataExportScope; readonly format?: DataExportFormat },
  ): Promise<DataExportView>;
  list(ctx: ActorContext, query?: PageQuery): Promise<Paginated<DataExportView>>;
  get(ctx: ActorContext, exportId: string): Promise<DataExportView>;
  build(input: {
    readonly ctx: WorkflowActorContext;
    readonly exportId: string;
    readonly scope: DataExportScope;
    readonly format: DataExportFormat;
  }): Promise<DataExportBuildResult>;
  download(
    ctx: ActorContext,
    exportId: string,
  ): Promise<{ readonly downloadUrl: string; readonly expiresAt: string }>;
  content(ctx: ActorContext, exportId: string): Promise<DataExportContent>;
}

export interface HealthService {
  report(): Promise<HealthReport>;
}

export interface UserSecurityProfile {
  readonly userId: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly locale: string;
  readonly approvalLevel: ApprovalLevel;
  readonly workspaceIds: readonly string[];
  readonly scopesByWorkspace: Readonly<Record<string, readonly Scope[]>>;
  readonly mfaEnrolled: boolean;
}

export interface IdentityService {
  resolveLoginIdentifier(identifier: string): Promise<{ userId: string; email: string } | null>;
  getSecurityProfile(identitySubjectOrUserId: string): Promise<UserSecurityProfile | null>;
  getSessionView(userId: string, preferredWorkspaceId?: string): Promise<SessionView | null>;
  recordSignupConsent(input: {
    readonly identitySubjectId: string;
    readonly email: string;
    readonly displayName: string;
    readonly locale: string;
    readonly timeZone: string;
    readonly termsVersionHash: string;
    readonly privacyVersionHash: string;
    readonly countryCode: string | null;
  }): Promise<void>;
  setUsernameAlias(ctx: IdentityContext, alias: string): Promise<{ alias: string }>;
  /**
   * Bind a Neon Auth subject to a durable Relay user on sign-in.
   * Returns the Relay user id, or null when no row can be linked safely.
   */
  linkProviderIdentity(input: {
    readonly identitySubjectId: string;
    readonly email: string;
    readonly emailVerified: boolean;
  }): Promise<string | null>;
}

export interface CustomerBillingService {
  getEntitlements(ctx: ActorContext): Promise<EntitlementStateView>;
  getUsage(
    ctx: ActorContext,
    input: {
      readonly range?: {
        readonly from: string;
        readonly to: string;
        readonly ianaTimeZone: string;
      };
    },
  ): Promise<UsageSummaryView>;
  createCheckout(
    ctx: ActorContext,
    input: { readonly interval: 'monthly' | 'annual'; readonly successUrl: string },
  ): Promise<CheckoutSessionView>;
  createPortalLink(
    ctx: ActorContext,
    input: { readonly returnUrl: string },
  ): Promise<PortalLinkView>;
  /** The transport verifies the signature over raw bytes before calling this. */
  handleProviderWebhook(input: {
    readonly eventId: string;
    readonly eventType: string;
    readonly bodyHash: string;
    readonly payload: Readonly<Record<string, unknown>>;
  }): Promise<{ readonly processed: boolean; readonly duplicate: boolean }>;
  hasEntitlement(ctx: ActorContext, entitlement: string): Promise<boolean>;
}

/**
 * Bulk CSV import.
 *
 * `upload` parses and reports. It creates nothing. `apply` is the second,
 * explicit call, and its mode defaults to drafts. Nothing on this interface can
 * publish, and nothing on it takes a path or a URL the server would fetch
 * outside the media service's own guarded import.
 */
export interface BulkImportService {
  upload(
    ctx: ActorContext,
    input: {
      readonly projectId: string;
      readonly filename: string;
      /** The manifest bytes. CSV only; a spreadsheet binary is refused. */
      readonly content: string;
      readonly options?: Partial<BulkImportOptions>;
    },
  ): Promise<BulkImportReport>;
  get(ctx: ActorContext, importJobId: string): Promise<BulkImportReport>;
  list(
    ctx: ActorContext,
    query?: PageQuery & { readonly projectId?: string },
  ): Promise<Paginated<BulkImportJobView>>;
  listRows(
    ctx: ActorContext,
    importJobId: string,
    query?: PageQuery & { readonly state?: BulkImportRowState },
  ): Promise<Paginated<BulkImportRowView>>;
  /**
   * Turn the valid rows into drafts, or into scheduled posts when a person
   * deliberately chose that. Rows are applied independently and a failure is
   * recorded on the row that caused it.
   */
  apply(
    ctx: ActorContext,
    input: { readonly importJobId: string; readonly mode?: BulkImportApplyMode },
  ): Promise<BulkImportReport>;
  /** The failed rows as a CSV a person can fix and upload again. */
  errorReport(
    ctx: ActorContext,
    importJobId: string,
  ): Promise<{ readonly filename: string; readonly csv: string }>;
}

/** The worker-facing half: the same two steps, addressed by job id. */
export interface WorkerBulkImportService {
  validate(
    ctx: WorkflowActorContext,
    input: { readonly importJobId: string },
  ): Promise<BulkImportWorkflowOutput>;
  applyRows(
    ctx: WorkflowActorContext,
    input: { readonly importJobId: string; readonly mode: BulkImportApplyMode },
  ): Promise<BulkImportWorkflowOutput>;
}

export interface Services {
  readonly workspaces: WorkspaceService;
  readonly members: MembershipService;
  readonly brands: BrandService;
  readonly connections: ConnectionService;
  readonly content: ContentService;
  readonly validation: ValidationService;
  readonly approvals: ApprovalService;
  readonly scheduling: SchedulingService;
  readonly queueRules: QueueRuleService;
  readonly postingSets: PostingSetService;
  readonly rememberedTargets: RememberedTargetService;
  readonly publishing: PublishingService;
  readonly agentConfirmations: AgentConfirmationService;
  readonly receipts: ReceiptService;
  readonly actionCenter: ActionCenterService;
  readonly media: MediaService;
  readonly analytics: AnalyticsService;
  readonly shortLinks: ShortLinkService;
  readonly automationRules: AutomationRuleService;
  readonly rss: RssService;
  readonly growth: GrowthService;
  readonly webhooks: WebhookService;
  readonly credentials: CredentialVaultService;
  readonly apiKeys: ApiKeyService;
  readonly oauthApps: OAuthAppService;
  readonly billing: CustomerBillingService;
  readonly identity: IdentityService;
  readonly audit: AuditService;
  readonly dataExports: DataExportService;
  readonly dataLifecycle: DataLifecycleService;
  readonly dataDeletion: DataDeletionService;
  readonly bulkImports: BulkImportService;
  readonly workerPublishing: WorkerPublishingService;
  readonly workerWebhooks: WorkerWebhookService;
  readonly workerBulkImports: WorkerBulkImportService;
  readonly health: HealthService;
}
