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
  BrandService,
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
  MediaEditOperation,
  MediaService,
  MembershipService,
  OAuthAppService,
  PageQuery,
  PublishingService,
  PublishConfirmationEvidence,
  PublishWorkflowInput,
  PublishWorkflowTarget,
  PortalLinkView,
  ReceiptService,
  RssService,
  SchedulerPort,
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

export { normalizeAliasForLookup } from './services/identity';
export {
  cancelPublishOutboxPayloadSchema,
  reschedulePublishOutboxPayloadSchema,
  startPublishOutboxPayloadSchema,
  startRuleRunOutboxPayloadSchema,
  workflowOutboxPayloadSchemas,
  type CancelPublishOutboxPayload,
  type ReschedulePublishOutboxPayload,
  type StartPublishOutboxPayload,
  type StartRuleRunOutboxPayload,
  type WorkflowOutboxInput,
  type WorkflowOutboxKind,
} from './outbox';

export type {
  AgentConfirmationSummary,
  AgentConfirmationView,
  ApiKeyView,
  ApprovalDecisionView,
  ApprovalRequestView,
  AuditEventView,
  AutomationRuleView,
  BrandView,
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

export { CONNECTION_HEALTH } from './views';

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
export { assertFetchable, isPrivateAddress, type FetchableUrl } from './internal/url-safety';
export { crossesOffsetChange } from './services/scheduling';
export { feedItemFingerprint, parseFeed } from './services/rss';
export {
  computeContentChecksum,
  parseStoredMaster,
  reconcileOverrides,
  resolveTarget,
  storedMasterSchema,
  storedOverridesSchema,
  type StoredMaster,
  type StoredVariantSettings,
} from './internal/stored-content';
