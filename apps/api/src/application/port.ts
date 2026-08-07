/**
 * The application service contract, as consumed by the REST API.
 *
 * TODO(api): depends on `@relay/application`. That package owns the canonical
 * declaration in `packages/application/src/types.ts`. This file restates the
 * exact same structural shape so `apps/api` compiles, is testable and can be
 * reviewed today, while the application package is being written in parallel.
 * TypeScript is structural, so when `@relay/application` lands the only change
 * here is to replace each declaration with a re-export. Do not let this file
 * drift: if you need a new method, add it to the shared contract first.
 *
 * Nothing in this file contains business logic. It is a set of types.
 */

import type {
  CapabilitySnapshot,
  ContentVersion,
  CreationSurface,
  ApprovalLevel,
  GrowthExportFormat,
  GrowthPlan,
  IanaTimeZone,
  IsoInstant,
  OperationRef,
  OpportunityRecord,
  Paginated,
  ProviderId,
  PublishState,
  Scope,
  ToolRecord,
  ValidationResult,
  WebhookEventName,
} from '@relay/contracts';
import type { HealthReport, Logger } from '@relay/observability';
import type { RelayConfig } from '@relay/config';

export type { Paginated } from '@relay/contracts';
import type {
  ActionItemView as ApplicationActionItemView,
  ApiKeyView as ApplicationApiKeyView,
  ApprovalRequestView as ApplicationApprovalRequestView,
  AuditEventView as ApplicationAuditEventView,
  AutomationRuleView as ApplicationAutomationRuleView,
  BrandView as ApplicationBrandView,
  BusinessProfileView as ApplicationBusinessProfileView,
  CalendarEntry as ApplicationCalendarEntry,
  CanonicalPreview as ApplicationCanonicalPreview,
  CheckoutSessionView as ApplicationCheckoutSessionView,
  ComparisonReport as ApplicationComparisonReport,
  ConnectionView as ApplicationConnectionView,
  ContentItemView as ApplicationContentItemView,
  ContentVersionView as ApplicationContentVersionView,
  CreatedApiKeyView as ApplicationCreatedApiKeyView,
  CreatedOAuthAppView as ApplicationCreatedOAuthAppView,
  EntitlementStateView as ApplicationEntitlementStateView,
  ExperimentView as ApplicationExperimentView,
  FeedHealthView as ApplicationFeedHealthView,
  FeedPreview as ApplicationFeedPreview,
  GrowthPlanSummaryView as ApplicationGrowthPlanSummaryView,
  InvitationView as ApplicationInvitationView,
  MediaAssetView as ApplicationMediaAssetView,
  MediaEditOperation as ApplicationMediaEditOperation,
  MembershipView as ApplicationMembershipView,
  MentionEntityView as ApplicationMentionEntityView,
  MetricObservationView as ApplicationMetricObservationView,
  OAuthAppView as ApplicationOAuthAppView,
  OAuthGrantView as ApplicationOAuthGrantView,
  PortalLinkView as ApplicationPortalLinkView,
  PostVariantView as ApplicationPostVariantView,
  ProviderDestinationView as ApplicationProviderDestinationView,
  PublicationReceiptView as ApplicationPublicationReceiptView,
  PublishJobView as ApplicationPublishJobView,
  ReceiptSummaryView as ApplicationReceiptSummaryView,
  RssFeedView as ApplicationRssFeedView,
  RulePreview as ApplicationRulePreview,
  RuleRunView as ApplicationRuleRunView,
  SessionView as ApplicationSessionView,
  Services as ApplicationServices,
  ShortLinkStats as ApplicationShortLinkStats,
  ShortLinkView as ApplicationShortLinkView,
  UsageSummaryView as ApplicationUsageSummaryView,
  WebhookDeliveryView as ApplicationWebhookDeliveryView,
  WebhookEndpointView as ApplicationWebhookEndpointView,
  WorkspaceView as ApplicationWorkspaceView,
} from '@relay/application';

/* -------------------------------------------------------------------------- */
/* Actor context                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Who is acting, in which workspace, with which powers. Built exactly once per
 * request, at the edge, by `ActorContextFactory`. There is no second
 * construction site in this application.
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
}

/**
 * An actor that is not yet inside any workspace.
 *
 * Two operations genuinely have no tenant: creating the first workspace, and
 * accepting an invitation into one that the caller is not a member of yet.
 * Handing those an `ActorContext` would mean inventing a `workspaceId`, and an
 * invented tenant identifier is exactly the thing tenancy rules exist to
 * prevent. They take this narrower shape instead.
 */
export interface IdentityContext {
  readonly actorType: 'user' | 'service_account' | 'oauth_app' | 'system';
  readonly actorId: string;
  readonly userId: string | undefined;
  readonly surface: CreationSurface;
  readonly correlationId: string;
  readonly idempotencyKey?: string;
  readonly locale: string;
}

/* -------------------------------------------------------------------------- */
/* Ports the application layer is constructed with                            */
/* -------------------------------------------------------------------------- */

export interface KeyValueSetOptions {
  readonly ttlSeconds?: number;
}

/** Redis-backed in deployment, in-memory in tests. Values are opaque strings. */
export interface KeyValueStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: KeyValueSetOptions): Promise<void>;
  delete(key: string): Promise<void>;
  /** Atomic set-if-absent. Returns true when this caller won the race. */
  setIfAbsent(key: string, value: string, options?: KeyValueSetOptions): Promise<boolean>;
  /** Atomic counter. The TTL is applied only when the counter is created. */
  increment(key: string, options?: KeyValueSetOptions): Promise<number>;
  /** Remaining time to live in seconds, or null when the key has none. */
  ttl(key: string): Promise<number | null>;
}

/** Injected so tests can fake time. Never call the `Date` global directly. */
export interface Clock {
  now(): Date;
}

export interface SchedulerPort {
  schedulePublish(input: {
    jobId: string;
    workspaceId: string;
    executeAt: IsoInstant;
    idempotencyKey: string;
  }): Promise<{ workflowId: string; runId: string }>;
  cancelPublish(input: { jobId: string; reason: string }): Promise<void>;
  reschedulePublish(input: { jobId: string; executeAt: IsoInstant }): Promise<void>;
  signalPublish(input: { jobId: string; signal: string; payload?: unknown }): Promise<void>;
  scheduleAnalyticsSync(input: {
    connectionId: string;
    receiptId?: string;
    at: IsoInstant;
  }): Promise<void>;
  startRuleRun(input: {
    ruleId: string;
    workspaceId: string;
    event: unknown;
  }): Promise<{ workflowId: string }>;
  describe(jobId: string): Promise<{ status: string; historyLength: number } | null>;
}

/* -------------------------------------------------------------------------- */
/* View models                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A normalized, already-serializable view model produced by an application
 * service. The API forwards these unchanged; it never reshapes domain data,
 * because a second shape is a second source of truth. Where
 * `@relay/contracts` publishes a schema for a concept, the concrete contract
 * type is used below instead of this alias.
 */
export type ViewModel = Readonly<Record<string, unknown>>;

export type WorkspaceView = ApplicationWorkspaceView;
export type MembershipView = ApplicationMembershipView;
export type InvitationView = ApplicationInvitationView;
export type BrandView = ApplicationBrandView;
export type ConnectionView = ApplicationConnectionView;
export type ProviderDestination = ApplicationProviderDestinationView;
export type MentionEntity = ApplicationMentionEntityView;
export type ContentItemView = ApplicationContentItemView;
export type ContentVersionView = ApplicationContentVersionView;
export type PostVariantView = ApplicationPostVariantView;
export type CanonicalPreview = ApplicationCanonicalPreview;
export type ApprovalRequestView = ApplicationApprovalRequestView;
export type CalendarEntry = ApplicationCalendarEntry;
export type MediaAssetView = ApplicationMediaAssetView;
export type MediaEditOperation = ApplicationMediaEditOperation;
export type ComparisonReport = ApplicationComparisonReport;
export type ExperimentView = ApplicationExperimentView;
export type ShortLinkView = ApplicationShortLinkView;
export type ShortLinkStats = ApplicationShortLinkStats;
export type AutomationRuleView = ApplicationAutomationRuleView;
export type RulePreview = ApplicationRulePreview;
export type RuleRunView = ApplicationRuleRunView;
export type FeedView = ApplicationRssFeedView;
export type FeedPreview = ApplicationFeedPreview;
export type FeedHealth = ApplicationFeedHealthView;
export type BusinessProfileView = ApplicationBusinessProfileView;
export type GrowthPlanSummaryView = ApplicationGrowthPlanSummaryView;
export type WebhookEndpointView = ApplicationWebhookEndpointView;
export type WebhookDeliveryView = ApplicationWebhookDeliveryView;
export type ApiKeyView = ApplicationApiKeyView;
export type CreatedApiKeyView = ApplicationCreatedApiKeyView;
export type OAuthAppView = ApplicationOAuthAppView;
export type CreatedOAuthAppView = ApplicationCreatedOAuthAppView;
export type OAuthGrantView = ApplicationOAuthGrantView;
export type AuditEventView = ApplicationAuditEventView;
export type PublishJobView = ApplicationPublishJobView;
export type PublicationReceiptView = ApplicationPublicationReceiptView;
export type ReceiptSummaryView = ApplicationReceiptSummaryView;
export type MetricObservationView = ApplicationMetricObservationView;
export type EntitlementStateView = ApplicationEntitlementStateView;
export type UsageSummaryView = ApplicationUsageSummaryView;
export type CheckoutSessionView = ApplicationCheckoutSessionView;
export type PortalLinkView = ApplicationPortalLinkView;
export type SessionView = ApplicationSessionView;
export type ActionItemView = ApplicationActionItemView;

/* -------------------------------------------------------------------------- */
/* Common input shapes                                                        */
/* -------------------------------------------------------------------------- */

export interface CursorQuery {
  readonly cursor?: string;
  readonly limit?: number;
}

export interface TimeRange {
  readonly from: IsoInstant;
  readonly to: IsoInstant;
  readonly ianaTimeZone: IanaTimeZone;
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export interface WorkspaceService {
  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<WorkspaceView>>;
  get(ctx: ActorContext, workspaceId: string): Promise<WorkspaceView>;
  /** No tenant exists yet, so this takes an identity rather than an actor. */
  create(ctx: IdentityContext, input: ViewModel): Promise<WorkspaceView>;
  update(ctx: ActorContext, workspaceId: string, patch: ViewModel): Promise<WorkspaceView>;
  listForUser(userId: string): Promise<readonly WorkspaceView[]>;
}

export interface MembershipService {
  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<MembershipView>>;
  updateRole(ctx: ActorContext, membershipId: string, role: string): Promise<MembershipView>;
  remove(ctx: ActorContext, membershipId: string): Promise<void>;
  invite(ctx: ActorContext, input: ViewModel): Promise<InvitationView>;
  listInvitations(ctx: ActorContext, query: CursorQuery): Promise<Paginated<InvitationView>>;
  revokeInvitation(ctx: ActorContext, invitationId: string): Promise<void>;
  /** The caller is not a member yet, so this takes an identity. */
  acceptInvitation(ctx: IdentityContext, token: string): Promise<MembershipView>;
}

export interface BrandService {
  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<BrandView>>;
  get(ctx: ActorContext, brandId: string): Promise<BrandView>;
  create(ctx: ActorContext, input: ViewModel): Promise<BrandView>;
  update(ctx: ActorContext, brandId: string, patch: ViewModel): Promise<BrandView>;
  delete(ctx: ActorContext, brandId: string): Promise<void>;
}

export interface ConnectionService {
  listAvailableProviders(ctx: ActorContext): Promise<readonly ProviderId[]>;
  list(
    ctx: ActorContext,
    query: CursorQuery & { brandId?: string; provider?: string },
  ): Promise<Paginated<ConnectionView>>;
  get(ctx: ActorContext, connectionId: string): Promise<ConnectionView>;
  getCapabilities(ctx: ActorContext, connectionId: string): Promise<CapabilitySnapshot>;
  beginOAuth(
    ctx: ActorContext,
    input: { provider: string; brandId: string; redirectTo?: string },
  ): Promise<{ authorizationUrl: string; transactionId: string }>;
  completeOAuth(
    ctx: ActorContext,
    input: { transactionId: string; code: string; state: string },
  ): Promise<readonly ConnectionView[]>;
  reconnect(ctx: ActorContext, connectionId: string): Promise<ConnectionView>;
  pause(ctx: ActorContext, connectionId: string): Promise<ConnectionView>;
  resume(ctx: ActorContext, connectionId: string): Promise<ConnectionView>;
  disconnect(ctx: ActorContext, connectionId: string): Promise<ConnectionView>;
  listDestinations(
    ctx: ActorContext,
    connectionId: string,
    input: { kind: string; query?: string },
  ): Promise<readonly ProviderDestination[]>;
  searchMentions(
    ctx: ActorContext,
    connectionId: string,
    input: { query: string },
  ): Promise<readonly MentionEntity[]>;
}

export interface ContentService {
  createDraft(ctx: ActorContext, input: ViewModel): Promise<ContentItemView>;
  get(ctx: ActorContext, contentItemId: string): Promise<ContentItemView>;
  list(
    ctx: ActorContext,
    query: CursorQuery & { state?: PublishState; brandId?: string; campaignId?: string },
  ): Promise<Paginated<ContentItemView>>;
  updateMaster(
    ctx: ActorContext,
    contentItemId: string,
    patch: ViewModel,
  ): Promise<ContentItemView>;
  overrideVariant(
    ctx: ActorContext,
    input: { contentItemId: string; targetId: string; patch: ViewModel },
  ): Promise<PostVariantView>;
  resetVariantToMaster(
    ctx: ActorContext,
    input: { contentItemId: string; targetId: string },
  ): Promise<PostVariantView>;
  setTargets(
    ctx: ActorContext,
    contentItemId: string,
    targets: readonly ViewModel[],
  ): Promise<ContentItemView>;
  applySet(
    ctx: ActorContext,
    input: { contentItemId: string; setId: string },
  ): Promise<ContentItemView>;
  applySignature(
    ctx: ActorContext,
    input: { contentItemId: string; signatureId: string; targetId?: string },
  ): Promise<ContentItemView>;
  freezeVersion(ctx: ActorContext, contentItemId: string): Promise<ContentVersion>;
  preview(
    ctx: ActorContext,
    input: { contentItemId: string; targetId: string },
  ): Promise<CanonicalPreview>;
  delete(ctx: ActorContext, contentItemId: string): Promise<void>;
}

export interface ValidationService {
  validate(ctx: ActorContext, input: { contentItemId: string }): Promise<ValidationResult>;
}

export interface ApprovalService {
  request(
    ctx: ActorContext,
    input: { contentItemId: string; approverIds?: readonly string[]; note?: string },
  ): Promise<ApprovalRequestView>;
  decide(
    ctx: ActorContext,
    input: { approvalId: string; decision: 'approved' | 'rejected'; note?: string },
  ): Promise<ApprovalRequestView>;
  listPending(ctx: ActorContext, query: CursorQuery): Promise<Paginated<ApprovalRequestView>>;
}

export interface SchedulingService {
  schedule(
    ctx: ActorContext,
    input: { contentItemId: string; scheduleSpec: ViewModel },
  ): Promise<PublishJobView>;
  reschedule(
    ctx: ActorContext,
    input: { jobId: string; scheduleSpec: ViewModel; confirmDst?: boolean },
  ): Promise<PublishJobView>;
  cancel(ctx: ActorContext, input: { jobId: string; reason: string }): Promise<PublishJobView>;
  getCalendar(
    ctx: ActorContext,
    input: CursorQuery & { from: IsoInstant; to: IsoInstant; filters: ViewModel },
  ): Promise<Paginated<CalendarEntry>>;
  nextAvailableSlot(
    ctx: ActorContext,
    input: { brandId: string; after?: IsoInstant },
  ): Promise<{ instant: IsoInstant; ianaTimeZone: IanaTimeZone }>;
}

export interface PublishingService {
  publishNow(
    ctx: ActorContext,
    input: { contentItemId: string; confirmation: ViewModel },
  ): Promise<PublishJobView>;
  getJob(ctx: ActorContext, jobId: string): Promise<PublishJobView>;
  retryTarget(
    ctx: ActorContext,
    input: { jobId: string; targetId: string },
  ): Promise<PublishJobView>;
}

export interface ReceiptService {
  get(ctx: ActorContext, receiptId: string): Promise<PublicationReceiptView>;
  listForJob(ctx: ActorContext, jobId: string): Promise<readonly PublicationReceiptView[]>;
  listRecent(ctx: ActorContext, query?: CursorQuery): Promise<Paginated<ReceiptSummaryView>>;
}

export interface MediaService {
  createUploadUrl(
    ctx: ActorContext,
    input: { filename: string; mimeType: string; byteSize: number; sha256: string },
  ): Promise<{
    uploadUrl: string;
    mediaId: string;
    method: 'PUT' | 'POST';
    headers: Readonly<Record<string, string>>;
    expiresAt: string;
    retentionExpiresAt: string;
  }>;
  finalizeUpload(ctx: ActorContext, mediaId: string): Promise<MediaAssetView>;
  importFromUrl(
    ctx: ActorContext,
    input: { url: string; brandId?: string | null },
  ): Promise<OperationRef>;
  list(
    ctx: ActorContext,
    query: CursorQuery & { brandId?: string; kind?: string },
  ): Promise<Paginated<MediaAssetView>>;
  get(ctx: ActorContext, mediaId: string): Promise<MediaAssetView>;
  delete(ctx: ActorContext, mediaId: string): Promise<void>;
  edit(
    ctx: ActorContext,
    input: { mediaId: string; ops: readonly MediaEditOperation[] },
  ): Promise<MediaAssetView>;
  setAltText(
    ctx: ActorContext,
    input: {
      mediaId: string;
      altText: string | null;
      waived?: boolean;
      waivedReason?: string | null;
    },
  ): Promise<MediaAssetView>;
  declareRights(
    ctx: ActorContext,
    input: {
      mediaId: string;
      owner: 'workspace' | 'licensed' | 'ugc';
      licenseReference: string | null;
      peopleAppear: boolean;
      peopleConsented: boolean;
      containsMusic: boolean;
      confirmed: true;
    },
  ): Promise<MediaAssetView>;
}

export interface AnalyticsService {
  getPostMetrics(
    ctx: ActorContext,
    input: { receiptId: string },
  ): Promise<readonly MetricObservationView[]>;
  getAccountMetrics(
    ctx: ActorContext,
    input: { connectionId: string; range: TimeRange },
  ): Promise<readonly MetricObservationView[]>;
  compare(
    ctx: ActorContext,
    input: { receiptIds?: readonly string[]; period?: TimeRange; baseline: string },
  ): Promise<ComparisonReport>;
  listExperiments(ctx: ActorContext, query: CursorQuery): Promise<Paginated<ExperimentView>>;
  createExperiment(ctx: ActorContext, input: ViewModel): Promise<ExperimentView>;
}

export interface ShortLinkService {
  create(ctx: ActorContext, input: ViewModel): Promise<ShortLinkView>;
  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<ShortLinkView>>;
  get(ctx: ActorContext, linkId: string): Promise<ShortLinkView>;
  /** No actor context: this is called by the isolated redirect service. */
  resolve(slug: string): Promise<{ destinationUrl: string; linkId: string } | null>;
  /** No actor context: click ingestion is unauthenticated by design. */
  recordClick(input: ViewModel): Promise<void>;
  getStats(ctx: ActorContext, input: { linkId: string; range: TimeRange }): Promise<ShortLinkStats>;
  updateDestination(ctx: ActorContext, linkId: string, input: ViewModel): Promise<ShortLinkView>;
  setEnabled(ctx: ActorContext, linkId: string, input: ViewModel): Promise<ShortLinkView>;
}

export interface AutomationRuleService {
  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<AutomationRuleView>>;
  get(ctx: ActorContext, ruleId: string): Promise<AutomationRuleView>;
  create(ctx: ActorContext, input: ViewModel): Promise<AutomationRuleView>;
  update(ctx: ActorContext, ruleId: string, patch: ViewModel): Promise<AutomationRuleView>;
  enable(ctx: ActorContext, ruleId: string): Promise<AutomationRuleView>;
  disable(ctx: ActorContext, ruleId: string): Promise<AutomationRuleView>;
  delete(ctx: ActorContext, ruleId: string): Promise<void>;
  preview(ctx: ActorContext, ruleId: string): Promise<RulePreview>;
  testRun(
    ctx: ActorContext,
    input: { ruleId: string; sampleEvent: ViewModel },
  ): Promise<RuleRunView>;
  listRuns(
    ctx: ActorContext,
    input: CursorQuery & { ruleId: string },
  ): Promise<Paginated<RuleRunView>>;
  /** Starts a named rule from an authenticated inbound integration payload. */
  triggerFromInbound(
    ctx: ActorContext,
    input: { ruleName: string; event: ViewModel },
  ): Promise<OperationRef>;
}

export interface RssService {
  validateFeed(ctx: ActorContext, input: { url: string }): Promise<FeedPreview>;
  create(ctx: ActorContext, input: ViewModel): Promise<FeedView>;
  update(ctx: ActorContext, feedId: string, patch: ViewModel): Promise<FeedView>;
  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<FeedView>>;
  delete(ctx: ActorContext, feedId: string): Promise<void>;
  getHealth(ctx: ActorContext, feedId: string): Promise<FeedHealth>;
}

export interface GrowthService {
  getBusinessProfile(ctx: ActorContext): Promise<BusinessProfileView | null>;
  upsertBusinessProfile(ctx: ActorContext, input: ViewModel): Promise<BusinessProfileView>;
  confirmBusinessProfile(
    ctx: ActorContext,
    input: {
      profileId: string;
      confirmedAssumptionIds?: readonly string[];
      corrections?: Readonly<Record<string, string>>;
    },
  ): Promise<BusinessProfileView>;
  generatePlan(ctx: ActorContext, input: { profileId: string }): Promise<OperationRef>;
  getCurrentPlan(ctx: ActorContext): Promise<GrowthPlan | null>;
  getPlanSummary(ctx: ActorContext): Promise<GrowthPlanSummaryView>;
  getPlan(ctx: ActorContext, planId: string): Promise<GrowthPlan>;
  exportPlan(
    ctx: ActorContext,
    input: { planId: string; format: GrowthExportFormat },
  ): Promise<{ contentType: string; body: string }>;
  createDraftFromItem(
    ctx: ActorContext,
    input: { planId: string; itemId: string },
  ): Promise<ContentItemView>;
  proposeSlotFromItem(
    ctx: ActorContext,
    input: { planId: string; itemId: string },
  ): Promise<CalendarEntry>;
  listOpportunities(
    ctx: ActorContext,
    query: { category?: string; region?: string; verifiedAfter?: IsoInstant },
  ): Promise<readonly OpportunityRecord[]>;
  listTools(
    ctx: ActorContext,
    query: { workflow?: string; verifiedAfter?: IsoInstant },
  ): Promise<readonly ToolRecord[]>;
}

export interface WebhookService {
  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<WebhookEndpointView>>;
  create(
    ctx: ActorContext,
    input: ViewModel,
  ): Promise<{ endpoint: WebhookEndpointView; signingSecret: string }>;
  update(ctx: ActorContext, endpointId: string, patch: ViewModel): Promise<WebhookEndpointView>;
  delete(ctx: ActorContext, endpointId: string): Promise<void>;
  testDelivery(ctx: ActorContext, endpointId: string): Promise<WebhookDeliveryView>;
  listDeliveries(
    ctx: ActorContext,
    input: CursorQuery & { endpointId: string },
  ): Promise<Paginated<WebhookDeliveryView>>;
  redeliver(ctx: ActorContext, deliveryId: string): Promise<WebhookDeliveryView>;
  emit(
    event: WebhookEventName,
    payload: ViewModel,
    meta: { workspaceId: string; correlationId?: string },
  ): Promise<void>;
}

export interface CredentialVaultService {
  /** Health only. The vault never returns plaintext to a transport layer. */
  describe(ctx: ActorContext, connectionId: string): Promise<ViewModel>;
}

export interface ApiKeyService {
  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<ApiKeyView>>;
  create(ctx: ActorContext, input: ViewModel): Promise<CreatedApiKeyView>;
  /**
   * Returns the revoked key's public prefix so the edge can drop its
   * verification record in the same request. Without it the edge would have to
   * scan, and a revocation that needs a scan is a revocation that can be slow
   * exactly when it must not be.
   */
  revoke(ctx: ActorContext, apiKeyId: string): Promise<ApiKeyView>;
}

export interface OAuthAppService {
  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<OAuthAppView>>;
  get(ctx: ActorContext, appId: string): Promise<OAuthAppView>;
  create(ctx: ActorContext, input: ViewModel): Promise<CreatedOAuthAppView>;
  update(ctx: ActorContext, appId: string, patch: ViewModel): Promise<OAuthAppView>;
  rotateSecret(ctx: ActorContext, appId: string): Promise<CreatedOAuthAppView>;
  delete(ctx: ActorContext, appId: string): Promise<void>;
  listGrants(ctx: ActorContext, query: CursorQuery): Promise<Paginated<OAuthGrantView>>;
  revokeGrant(ctx: ActorContext, grantId: string): Promise<void>;
}

export interface BillingService {
  getEntitlements(ctx: ActorContext): Promise<EntitlementStateView>;
  getUsage(ctx: ActorContext, input: { range?: TimeRange }): Promise<UsageSummaryView>;
  createCheckout(
    ctx: ActorContext,
    input: { interval: 'monthly' | 'annual'; successUrl: string },
  ): Promise<CheckoutSessionView>;
  createPortalLink(ctx: ActorContext, input: { returnUrl: string }): Promise<PortalLinkView>;
  /** Signature is verified by the caller over the raw bytes, before parsing. */
  handleProviderWebhook(input: {
    eventId: string;
    eventType: string;
    bodyHash: string;
    payload: ViewModel;
  }): Promise<{ processed: boolean; duplicate: boolean }>;
  /** True when the workspace may perform the named metered action. */
  hasEntitlement(ctx: ActorContext, entitlement: string): Promise<boolean>;
}

/**
 * The live security facts about one identity.
 *
 * Read per request (with at most a 30 second cache) rather than baked into a
 * credential, so a demotion narrows every existing session, API key and OAuth
 * grant on the next call without any of them being reissued.
 */
export interface UserSecurityProfile {
  readonly userId: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly locale: string;
  readonly approvalLevel: ApprovalLevel;
  readonly workspaceIds: readonly string[];
  /** Effective scopes per workspace, derived from the membership role. */
  readonly scopesByWorkspace: Readonly<Record<string, readonly Scope[]>>;
  readonly mfaEnrolled: boolean;
}

/**
 * Identity lookups the edge cannot perform for itself.
 *
 * TODO(api): this interface extends the five-consumer service contract. The
 * REST API needs it because a session cannot be built without the live
 * membership snapshot, and because username alias normalization is specified to
 * live in one place, `packages/application/src/identity/normalize-alias.ts`, so
 * that creation and lookup can never disagree. Adding a second normalizer at
 * the edge is exactly the bug that specification exists to prevent.
 */
export interface IdentityService {
  /**
   * Resolve an email or a username alias to an identity.
   *
   * Returns null for unknown, retired and policy-rejected values alike. The
   * caller must not branch on which: the login handler produces one response
   * shape and one timing band whether or not the identity exists.
   */
  resolveLoginIdentifier(identifier: string): Promise<{ userId: string; email: string } | null>;
  getSecurityProfile(userId: string): Promise<UserSecurityProfile | null>;
  getSessionView(userId: string, preferredWorkspaceId?: string): Promise<SessionView | null>;
  /** Append-only consent evidence: policy version hashes, instant, country. */
  recordSignupConsent(input: {
    identitySubjectId: string;
    email: string;
    displayName: string;
    locale: string;
    timeZone: string;
    termsVersionHash: string;
    privacyVersionHash: string;
    countryCode: string | null;
  }): Promise<void>;
  /** Claim or change the alias. One active alias per identity; never reissued. */
  setUsernameAlias(ctx: IdentityContext, alias: string): Promise<{ alias: string }>;
}

export interface AuditService {
  list(
    ctx: ActorContext,
    query: CursorQuery & { filters?: ViewModel },
  ): Promise<Paginated<AuditEventView>>;
}

export interface HealthService {
  report(): Promise<HealthReport>;
}

export type Services = ApplicationServices;

/** The dependencies `createServices` is constructed with. */
export interface ServiceDepsShape {
  readonly kv: KeyValueStore;
  readonly scheduler: SchedulerPort;
  readonly logger: Logger;
  readonly clock: Clock;
  readonly config: RelayConfig;
}
