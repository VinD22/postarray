/**
 * `@relay/mcp`: the remote Streamable HTTP MCP server.
 *
 * It is a resource server in front of the same application services the web
 * app, the REST API and the CLI use. It contains no publishing logic, no second
 * authorization system and no way to reach a platform that the approval policy
 * does not permit.
 */

export {
  ALL_TOOLS,
  CONSEQUENTIAL_TOOLS,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  READ_TOOLS,
  RESOURCE_URIS,
  REVERSIBLE_TOOLS,
  TOOL_NAMES,
  TOOL_RISKS,
  createRegistry,
  createToolRegistry,
  defineTool,
  describeTool,
  idempotencyInputShape,
  pageInputShape,
  requirementOf,
  resourceLink,
  type ResourceLink,
  type ToolContext,
  type ToolDefinition,
  type ToolRegistry,
  type ToolResult,
  type ToolRisk,
} from './tools/index';

export {
  APPROVAL_LEVEL_ORDER,
  approvalLevelSatisfies,
  approvalRank,
  authorizeCall,
  type AuthorizationInput,
  type AuthorizationRequirement,
} from './auth/authorize';

export {
  DEFAULT_VERIFICATION_CACHE_TTL_SECONDS,
  bearerFromHeader,
  createIntrospectionVerifier,
  introspectionResponseSchema,
  verifiedGrantSchema,
  type IntrospectionTransport,
  type IntrospectionVerifierOptions,
  type TokenVerifier,
  type VerifiedGrant,
} from './auth/verifier';

export {
  PROTECTED_RESOURCE_PATH,
  buildAuthenticateChallenge,
  buildProtectedResourceMetadata,
  protectedResourceMetadataSchema,
  type ProtectedResourceMetadata,
} from './auth/metadata';

export {
  DEFAULT_CONFIRMATION_TTL_SECONDS,
  createMemoryConfirmationStore,
  fingerprintSummary,
  type ConfirmationStore,
  type ConfirmationSummary,
  type ConfirmationTicket,
  type PendingConfirmation,
} from './confirmations';

export {
  createDispatcher,
  createWorkspaceKillSwitch,
  type DispatchInput,
  type DispatchOutcome,
  type Dispatcher,
  type DispatcherOptions,
  type WorkspaceKillSwitch,
} from './dispatch';

export {
  SERVER_NAME,
  SERVER_VERSION,
  createMcpServer,
  declareTool,
  toCallToolError,
  toCallToolResult,
  type McpServerOptions,
} from './server';

export {
  HEALTH_PATH,
  MAX_BODY_BYTES,
  MCP_PATH,
  createMcpHttpService,
  type McpHttpOptions,
  type McpHttpService,
} from './http';

export {
  SANDBOX_BRAND_ID,
  createSandboxServices,
  fakeCapabilitySnapshot,
  type SandboxOptions,
  type SandboxServices,
} from './sandbox';

export type {
  ActorContextLike,
  ApprovalRequestSummary,
  AuditRecordInput,
  AuditSink,
  CalendarEntrySummary,
  ConnectionSummary,
  ContentItemSummary,
  CreateDraftInputLike,
  MetricObservationSummary,
  OperationRefLike,
  PageLike,
  PreviewSummary,
  PublishConfirmation,
  PublishJobSummary,
  ReceiptSummary,
  RelayServicePort,
  ScheduleSpecLike,
  TargetSpecLike,
  VariantSummary,
} from './ports';

export { toApplicationConfirmationStore, toRelayServicePort } from './wiring';

export { SKILLS, skillFor, type SkillDefinition, type SkillHost } from './skills';
