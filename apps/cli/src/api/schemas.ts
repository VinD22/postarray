import { z } from 'zod';

import {
  accountTypeSchema,
  approvalLevelSchema,
  approvalStateSchema,
  capabilitySnapshotSchema,
  contentKindSchema,
  creationSurfaceSchema,
  growthPlanSchema,
  ianaTimeZoneSchema,
  isoInstantSchema,
  localeSchema,
  metricAvailabilitySchema,
  mediaKindSchema,
  metricUnitSchema,
  normalizedMetricNameSchema,
  opportunityRecordSchema,
  pageInfoSchema,
  providerIdSchema,
  publicationReceiptSchema,
  publishStateSchema,
  scopeSchema,
  validationResultSchema,
  realtimeEventSchema,
} from '@relay/contracts';

/**
 * Response shapes.
 *
 * Everything the API returns is parsed here before the CLI prints a character
 * of it. Where `@relay/contracts` already owns a shape (validation results,
 * capability snapshots, growth plans, receipts) that schema is used directly.
 * The remaining view models are declared with exactly the fields the CLI
 * renders, so `--json` output is a stable projection rather than a passthrough
 * of whatever the server happened to send.
 */

export function paginated<T extends z.ZodType>(item: T) {
  return z.object({ data: z.array(item), pageInfo: pageInfoSchema });
}

/** Several endpoints wrap a collection in `{ data }` without paging it. */
export function wrapped<T extends z.ZodType>(item: T) {
  return z.object({ data: z.array(item) });
}

export const connectionViewSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  projectId: z.string().min(1).nullable(),
  provider: providerIdSchema,
  accountType: accountTypeSchema,
  displayName: z.string(),
  handle: z.string().nullable(),
  health: z.string().min(1),
  /** An i18n key. The CLI prints the key, never invented prose. */
  statusMessageKey: z.string().nullable(),
  capabilityVersion: z.string().nullable(),
  connectedAt: z.string().min(1),
  lastSuccessfulActionAt: z.string().nullable(),
});
export type ConnectionView = z.infer<typeof connectionViewSchema>;

export const publishJobViewSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  contentItemId: z.string().min(1),
  contentVersionId: z.string().min(1),
  connectionId: z.string().min(1),
  provider: providerIdSchema,
  state: publishStateSchema,
  scheduledInstant: isoInstantSchema,
  ianaTimeZone: ianaTimeZoneSchema,
  idempotencyKey: z.string().min(1),
  approvalRequired: z.boolean(),
  approvalState: approvalStateSchema,
  attemptCount: z.number().int().nonnegative(),
  lastErrorCode: z.string().nullable(),
  createdVia: creationSurfaceSchema,
  createdAt: isoInstantSchema,
  updatedAt: isoInstantSchema,
  canceledAt: isoInstantSchema.nullable(),
});
export type PublishJobView = z.infer<typeof publishJobViewSchema>;

export const postVariantViewSchema = z.object({
  id: z.string().min(1),
  connectionId: z.string().min(1),
  provider: providerIdSchema,
  accountType: accountTypeSchema,
  locale: z.string().min(1),
  contentKind: contentKindSchema,
  overriddenFields: z.array(z.string()),
});

export const contentItemViewSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  projectId: z.string().min(1),
  campaignId: z.string().nullable(),
  title: z.string().nullable(),
  state: publishStateSchema,
  approvalState: approvalStateSchema,
  locale: z.string().min(1),
  contentKind: contentKindSchema,
  variants: z.array(postVariantViewSchema),
  currentChecksum: z
    .string()
    .regex(/^[0-9a-f]{64}$/)
    .nullable(),
  reapprovalRequired: z.boolean(),
  createdVia: creationSurfaceSchema,
  createdAt: isoInstantSchema,
  updatedAt: isoInstantSchema,
});
export type ContentItemView = z.infer<typeof contentItemViewSchema>;

export const calendarEntrySchema = z.object({
  jobId: z.string().nullable(),
  contentItemId: z.string().min(1),
  title: z.string().nullable(),
  projectId: z.string().min(1),
  campaignId: z.string().nullable(),
  connectionId: z.string().nullable(),
  provider: providerIdSchema.nullable(),
  state: publishStateSchema,
  instant: isoInstantSchema,
  ianaTimeZone: ianaTimeZoneSchema,
  approvalRequired: z.boolean(),
});
export type CalendarEntry = z.infer<typeof calendarEntrySchema>;

export const canonicalPreviewSchema = z.object({
  contentItemId: z.string().min(1),
  targetId: z.string().min(1),
  provider: providerIdSchema,
  accountType: accountTypeSchema,
  displayName: z.string(),
  handle: z.string().nullable(),
  body: z.string(),
  contentKind: contentKindSchema,
  media: z.array(z.object({ id: z.string().min(1), altText: z.string().nullable() })),
  threadItems: z.array(z.object({ order: z.number().int().nonnegative() })),
  characterCount: z.number().int().nonnegative(),
  characterLimit: z.number().int().positive().nullable(),
  truncated: z.boolean(),
});
export type CanonicalPreview = z.infer<typeof canonicalPreviewSchema>;

export const shortLinkViewSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  domain: z.string().nullable(),
  shortUrl: z.string().min(1),
  destinationUrl: z.string().min(1),
  campaignId: z.string().nullable(),
  state: z.enum(['active', 'disabled', 'expired', 'blocked']),
  expiresAt: z.string().nullable(),
  createdAt: isoInstantSchema,
});
export type ShortLinkView = z.infer<typeof shortLinkViewSchema>;

export const shortLinkStatsSchema = z.object({
  linkId: z.string().min(1),
  totalClicks: z.number().int().nonnegative(),
  humanClicks: z.number().int().nonnegative(),
  suspectedBotClicks: z.number().int().nonnegative(),
  series: z.array(
    z.object({ bucketStart: z.string().min(1), requests: z.number().int().nonnegative() }),
  ),
  topCountries: z.array(
    z.object({ countryCode: z.string(), clicks: z.number().int().nonnegative() }),
  ),
  topReferrerClasses: z.array(
    z.object({ referrerClass: z.string(), clicks: z.number().int().nonnegative() }),
  ),
  /** First-party redirect measurement, never a provider link-click number. */
  sourceKey: z.literal('analytics.source.first_party_redirect'),
});
export type ShortLinkStats = z.infer<typeof shortLinkStatsSchema>;

/**
 * A media asset as the library reports it.
 *
 * Only the fields the CLI prints. `altText`, the dimensions and the duration
 * are nullable because the pipeline genuinely does not always know them, and a
 * `--json` consumer needs to tell "not extracted" apart from zero.
 */
export const mediaAssetViewSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  projectId: z.string().min(1).nullable(),
  kind: mediaKindSchema,
  fileName: z.string().nullable(),
  mimeType: z.string().min(1),
  byteSize: z.number().int().nonnegative(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  durationMs: z.number().int().nullable(),
  checksumSha256: z.string().min(1),
  altText: z.string().nullable(),
  altTextWaived: z.boolean(),
  scanState: z.enum(['pending', 'clean', 'suspicious', 'infected', 'failed']),
  originKind: z.string().min(1),
  originUrl: z.string().nullable(),
  retentionExpiresAt: z.string().min(1),
  storageAvailable: z.boolean(),
  createdAt: isoInstantSchema,
});
export type MediaAssetView = z.infer<typeof mediaAssetViewSchema>;

/**
 * A short-lived, single-object upload ticket. The CLI never invents any part
 * of it: the URL, the method and every header come from the server, which is
 * what lets the same command work against local storage and against a
 * presigned object-store URL without knowing which is in use.
 */
export const uploadTicketSchema = z.object({
  mediaId: z.string().min(1),
  uploadUrl: z.string().min(1),
  method: z.enum(['PUT', 'POST']),
  headers: z.record(z.string(), z.string()),
  expiresAt: isoInstantSchema,
  retentionExpiresAt: isoInstantSchema,
});
export type UploadTicket = z.infer<typeof uploadTicketSchema>;

export const automationRuleViewSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  name: z.string(),
  state: z.enum(['draft', 'active', 'paused', 'disabled', 'archived']),
  trigger: z.object({ kind: z.string().min(1) }),
  actions: z.array(z.object({ kind: z.string().min(1) })),
  requiresApproval: z.boolean(),
  preauthorizedConnectionIds: z.array(z.string().min(1)),
  executionCount: z.number().int().nonnegative(),
  maxExecutions: z.number().int().nullable(),
  lastRunAt: z.string().nullable(),
  pausedReasonKey: z.string().nullable(),
});
export type AutomationRuleView = z.infer<typeof automationRuleViewSchema>;

export const ruleRunViewSchema = z.object({
  id: z.string().min(1),
  ruleId: z.string().min(1),
  ruleVersion: z.number().int().positive(),
  state: z.enum(['pending', 'running', 'succeeded', 'failed', 'skipped', 'blocked_by_policy']),
  isTest: z.boolean(),
  sourceKind: z.string().min(1),
  performedActions: z.array(z.object({ kind: z.string().min(1), outcome: z.string().min(1) })),
  blockedReasonKey: z.string().nullable(),
  errorCode: z.string().nullable(),
  startedAt: z.string().min(1),
  endedAt: z.string().nullable(),
});
export type RuleRunView = z.infer<typeof ruleRunViewSchema>;

/**
 * `GET /v1/auth/me`. It describes the principal, not a workspace: a credential
 * can be valid for several workspaces, and the CLI shows which one it is using.
 */
export const principalSchema = z.object({
  actorType: z.enum(['user', 'service_account', 'oauth_app', 'system']),
  userId: z.string().nullable(),
  workspaceIds: z.array(z.string().min(1)),
  scopes: z.array(z.string().min(1)),
  approvalLevel: approvalLevelSchema,
  emailVerified: z.boolean(),
  locale: localeSchema,
});
export type Principal = z.infer<typeof principalSchema>;

export const metricObservationViewSchema = z.object({
  normalizedName: normalizedMetricNameSchema,
  provider: providerIdSchema,
  providerField: z.string().min(1),
  providerDefinition: z.string().min(1),
  scope: z.enum(['post', 'account']),
  value: z.number().nullable(),
  unit: metricUnitSchema,
  availability: metricAvailabilitySchema,
  observedAt: isoInstantSchema,
  freshnessSeconds: z.number().int().nonnegative(),
  derivationRestricted: z.boolean(),
});
export type MetricObservationView = z.infer<typeof metricObservationViewSchema>;

export const scopeListSchema = z.array(scopeSchema);

/** One page of `GET /v1/events/recent`. */
export const realtimeEventPageSchema = z.object({
  events: z.array(realtimeEventSchema),
  lastEventId: z.string().nullable(),
});

export {
  capabilitySnapshotSchema,
  growthPlanSchema,
  opportunityRecordSchema,
  publicationReceiptSchema,
  validationResultSchema,
};
