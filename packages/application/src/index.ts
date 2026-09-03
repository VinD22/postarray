/**
 * `@relay/application`: the use cases every surface shares.
 *
 * The web app, the REST API, the worker, the remote MCP server and the CLI all
 * call the same objects built by `createServices`. Publishing logic never lives
 * in a route handler or a controller; if it is not reachable through the
 * `Services` interface, it does not exist.
 */

export { createServices } from './services/index';
export {
  createDomainEventService,
  type DomainEventServiceDeps,
} from './services/domain-events';
export { oauthCompletionReady, socialOAuthCallbackUrl } from './services/connections';
export {
  createOAuthGateway,
  selectOAuthAccounts,
  type OAuthGateway,
} from './services/oauth-gateway';
export {
  fromSocialCredentialStorageRow,
  toSocialCredentialStorageWrite,
  type SocialCredentialStorageRow,
  type SocialCredentialStorageWrite,
} from './internal/credential-mappers';
export {
  agentConfirmationSummarySchema,
  fingerprintAgentConfirmationSummary,
} from './services/agent-confirmations';

export type {
  ActionItemCategory,
  ActionItemKind,
  ActionItemUrgency,
  ActionItemView,
  ActorContext,
  AgentConfirmationService,
  AiGateway,
  AnalyticsService,
  ApiKeyService,
  ServiceAccountService,
  CreateServiceAccountInput,
  IssuedServiceAccountCredentialView,
  ServiceAccountDryRunView,
  ServiceAccountView,
  ApprovalService,
  AuditService,
  AutomationRuleInput,
  AutomationRuleService,
  BillingGateway,
  CheckoutSessionView,
  CustomerBillingService,
  DataDeletionScope,
  DataDeletionService,
  DataDeletionWorkflowInput,
  DataLifecycleService,
  ProjectService,
  OnboardingService,
  BulkImportService,
  BulkImportWorkflowInput,
  BulkImportWorkflowOutput,
  WorkerBulkImportService,
  WorkerMediaService,
  Clock,
  ConnectionService,
  ConnectorRegistry,
  ContentService,
  DataExportService,
  DataExportBuildResult,
  DataExportContent,
  DataExportEncryptionPort,
  DataExportWorkflowInput,
  CreateDraftInput,
  CredentialVaultService,
  CredentialVaultPort,
  EntitlementCheck,
  EntitlementStateView,
  GrowthService,
  HealthService,
  IdentityContext,
  IdentityService,
  KeyValueSetOptions,
  KeyValueStore,
  MailMessage,
  MailerPort,
  MasterDraftPatch,
  MoneyView,
  MediaDerivativeRequest,
  MediaDerivativeService,
  MediaDerivativeView,
  MediaDerivativeWorkflowInput,
  MediaEditOperation,
  MediaService,
  MediaTransformFn,
  MediaTransformInput,
  MediaTransformResult,
  MembershipService,
  OAuthAppService,
  OAuthDiscoveryResult,
  OAuthProviderBinding,
  OAuthProviderResolver,
  PageQuery,
  PublishingService,
  PublishConfirmationEvidence,
  PublishWorkflowInput,
  PublishWorkflowTarget,
  PortalLinkView,
  ReceiptService,
  RssService,
  SchedulerPort,
  SchedulerKind,
  ClaimedDomainEventRow,
  DomainEventService,
  RealtimePublisherPort,
  WebhookDeliveryWorkflowInput,
  SchedulingService,
  ServiceDeps,
  Services,
  ShortLinkService,
  StoragePort,
  StorageObjectPage,
  StoredObject,
  TargetSpec,
  UploadTicket,
  UsageSummaryView,
  UserSecurityProfile,
  ValidationService,
  WebhookService,
  WorkflowActorContext,
  WorkspaceService,
} from './types';

export type {
  CredentialStorePort,
  CredentialStoreWrite,
  OAuthConnectionClaim,
  OAuthConnectionClaimActor,
  OAuthConnectionClaimRequest,
  StoredCredentialRecord,
} from './ports/credentials';

export type {
  OAuthAccountSelectionView,
  OAuthPendingAccount,
  OAuthPendingDiscoveryPort,
  OAuthPendingDiscoveryRecord,
} from './ports/oauth-pending';

export { pendingGrantEnvelopeFromRow, pendingGrantEnvelopeToRow } from './oauth-pending-envelope';

export { normalizeAliasForLookup } from './services/identity';
export { deriveOnboardingComplete, mergeStep } from './services/onboarding';
export {
  cancelPublishOutboxPayloadSchema,
  pausePublishOutboxPayloadSchema,
  reschedulePublishOutboxPayloadSchema,
  resumePublishOutboxPayloadSchema,
  startPublishOutboxPayloadSchema,
  startRuleRunOutboxPayloadSchema,
  startBulkImportPayloadSchema,
  startMediaDerivativePayloadSchema,
  DOMAIN_EVENT_OUTBOX_KINDS,
  WORKFLOW_OUTBOX_KINDS,
  isDomainEventOutboxKind,
  isWorkflowOutboxKind,
  workflowOutboxPayloadSchemas,
  type CancelPublishOutboxPayload,
  type PausePublishOutboxPayload,
  type ReschedulePublishOutboxPayload,
  type ResumePublishOutboxPayload,
  type StartPublishOutboxPayload,
  type StartRuleRunOutboxPayload,
  type StartBulkImportPayload,
  type StartMediaDerivativePayload,
  type WorkflowOutboxInput,
  type WorkflowOutboxKind,
  type DomainEventOutboxKind,
} from './outbox';

export type {
  AccountAttentionRowView,
  AccountFreshnessRowView,
  AnalyticsAccountRef,
  AnalyticsOverviewView,
  AnalyticsRangeView,
  BaselineComparisonView,
  BaselinePostView,
  MetricDefinitionView,
  MetricReadingView,
  MetricSeriesView,
  PostComparisonRowView,
  SeriesPointView,
  AgentConfirmationSummary,
  AgentConfirmationView,
  ApiKeyView,
  ApprovalDecisionView,
  ApprovalRequestView,
  AuditEventView,
  AutomationRuleView,
  ProjectView,
  OnboardingStateView,
  OnboardingUseCase,
  BusinessProfileView,
  CalendarEntry,
  CanonicalPreview,
  ComparisonReport,
  ComparisonRow,
  ConnectionHealth,
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
  PublishAttemptView,
  PublishJobView,
  ReceiptItemView,
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

export { CONNECTION_HEALTH, ONBOARDING_USE_CASES } from './views';

/** Local implementations of every outbound port, so the product runs offline. */
export {
  FixedClock,
  InMemoryScheduler,
  LocalFileStorage,
  LoggingMailer,
  MemoryKeyValueStore,
  MemoryStorage,
  RecordingMailer,
  RedisKeyValueStore,
  STORAGE_HEADERS,
  publishWorkflowId,
  dataExportWorkflowId,
  dataDeletionWorkflowId,
  ruleWorkflowId,
  systemClock,
  type LocalStorageOptions,
  type RecordedPublish,
  type RecordedDataExport,
  type RecordedDataDeletion,
  type RedisLikeClient,
} from './ports/index';

/**
 * Selected internals other packages legitimately need: the worker recomputes a
 * publish job's idempotency key, and the links service and the RSS poller reuse
 * the same URL safety check the application applies.
 */
export { fingerprintOf, publishJobIdempotencyKey, withIdempotency } from './internal/idempotency';
export { parseCsvManifest, readDelimitedText, type CsvManifest } from './internal/csv-manifest';
export { bulkImportWorkflowId } from './ports/index';
export { mediaDerivativeWorkflowId } from './services/media-derivatives';
export { assertFetchable, isPrivateAddress, type FetchableUrl } from './internal/url-safety';
export { crossesOffsetChange } from './services/scheduling';
export { feedItemFingerprint, parseFeed } from './services/rss';
export {
  computeContentChecksum,
  parseStoredMaster,
  parseVariantSettings,
  reconcileOverrides,
  resolveTarget,
  storedMasterSchema,
  storedOverridesSchema,
  type StoredMaster,
  type StoredVariantSettings,
} from './internal/stored-content';
