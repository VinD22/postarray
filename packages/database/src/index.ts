/**
 * `@relay/database`: the system of record.
 *
 * Import the workspace-scoped helpers rather than the bare client. A bare
 * `prisma.contentItem.findMany()` is a code review finding: it works, row level
 * security stops it crossing a tenant, but it hides which workspace the caller
 * believed it was in.
 */

export {
  createPrismaClient,
  disconnectPrismaClient,
  getPrismaClient,
  type PrismaClientOptions,
  type RelayPrismaClient,
} from './client.js';

export {
  createStderrLogger,
  noopLogger,
  type DatabaseLogFields,
  type DatabaseLogger,
  type LogLevel,
} from './logger.js';

export {
  DATABASE_ERROR_CODES,
  DatabaseError,
  isDatabaseError,
  type DatabaseErrorCode,
} from './errors.js';

export {
  GLOBAL_MODELS,
  TENANT_MODELS,
  assertWorkspaceScoped,
  buildClaimsPayload,
  isGlobalModel,
  isTenantModel,
  isUnregisteredModel,
  serviceRoleClaims,
  withRlsContext,
  withWorkspace,
  withWorkspaceContext,
  type RlsClaims,
  type RlsContextOptions,
  type RlsRole,
  type RlsTransactionClient,
  type WorkspaceScopedClient,
} from './tenancy/index.js';

export {
  AUDIT_ACTIONS,
  appendAuditEvent,
  appendAuditEvents,
  hashState,
  type AppendAuditEventInput,
  type AuditAction,
  type AuditActor,
  type AuditEventRef,
  type AuditTarget,
} from './audit/index.js';

export { migrate, type MigrateOptions } from './migrate.js';
export { reset, type ResetOptions } from './reset.js';

/**
 * Generated Prisma types and enums are re-exported so consumers do not depend
 * on `@prisma/client` directly. Only this package knows where the client is
 * generated to.
 */
export { Prisma } from '@prisma/client';
export type {
  ApprovalDecision,
  ApprovalRequest,
  AuditEvent,
  AutomationRule,
  AutomationRuleRun,
  Brand,
  BusinessProfile,
  Campaign,
  CommentThreadItem,
  ContentItem,
  ContentVersion,
  Entitlement,
  Experiment,
  GrowthOpportunity,
  GrowthPlan,
  Insight,
  MediaAsset,
  Membership,
  MentionEntity,
  MetricDefinition,
  MetricObservation,
  PostVariant,
  PostingSet,
  PublicationReceipt,
  PublishAttempt,
  PublishJob,
  ProviderDestination,
  RssFeed,
  ShortLink,
  Signature,
  SocialConnection,
  StrategyOpportunityMatch,
  Subscription,
  ToolCatalogEntry,
  User,
  Workspace,
} from '@prisma/client';
