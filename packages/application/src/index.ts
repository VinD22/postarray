/**
 * `@relay/application`: the use cases every surface shares.
 *
 * The web app, the REST API, the worker, the remote MCP server and the CLI all
 * call the same objects built by `createServices`. Publishing logic never lives
 * in a route handler or a controller; if it is not reachable through the
 * `Services` interface, it does not exist.
 */

export { createServices } from './services/index';

export type {
  ActorContext,
  AiGateway,
  AnalyticsService,
  ApiKeyService,
  ApprovalService,
  AuditService,
  AutomationRuleInput,
  AutomationRuleService,
  BillingService,
  BrandService,
  Clock,
  ConnectionService,
  ConnectorRegistry,
  ContentService,
  CreateDraftInput,
  CredentialVaultService,
  EntitlementCheck,
  GrowthService,
  HealthService,
  KeyValueSetOptions,
  KeyValueStore,
  MailMessage,
  MailerPort,
  MasterDraftPatch,
  MediaEditOperation,
  MediaService,
  MembershipService,
  OAuthAppService,
  PageQuery,
  PublishingService,
  ReceiptService,
  RssService,
  SchedulerPort,
  SchedulingService,
  ServiceDeps,
  Services,
  ShortLinkService,
  StoragePort,
  StoredObject,
  TargetSpec,
  UploadTicket,
  ValidationService,
  WebhookService,
  WorkspaceService,
} from './types';

export type {
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
  ExperimentView,
  FeedHealthView,
  FeedPreview,
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
  RssFeedView,
  RulePreview,
  RuleRunView,
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
  systemClock,
  type LocalStorageOptions,
  type RecordedPublish,
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
