import { z } from 'zod';

import {
  accountTypeSchema,
  contentKindSchema,
  creationSurfaceSchema,
  providerIdSchema,
} from './enums.js';
import { ID_PREFIXES, idSchema } from './ids.js';
import {
  checksumSchema,
  deepEqual,
  ianaTimeZoneSchema,
  isoDateSchema,
  isoInstantSchema,
  localeSchema,
  webUrlSchema,
} from './primitives.js';

/**
 * One master draft is the canonical version. Every target variant either
 * inherits a field from the master or explicitly overrides it, and that state is
 * always visible. An edit to one target never leaks into another.
 */

export const utmParametersSchema = z
  .object({
    source: z.string().min(1).optional(),
    medium: z.string().min(1).optional(),
    campaign: z.string().min(1).optional(),
    term: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
  })
  .strict();
export type UtmParameters = z.infer<typeof utmParametersSchema>;

/**
 * A link keeps its original destination alongside the exact public short URL
 * that will publish, so a receipt can prove what appeared on each platform.
 */
export const linkSpecSchema = z
  .object({
    originalUrl: webUrlSchema,
    tracked: z.boolean(),
    shortLinkId: idSchema(ID_PREFIXES.shortLink).nullable(),
    publishedUrl: webUrlSchema.nullable(),
    utm: utmParametersSchema.nullable(),
    frozenAt: isoInstantSchema.nullable(),
  })
  .strict();
export type LinkSpec = z.infer<typeof linkSpecSchema>;

export const signatureRefSchema = z
  .object({
    signatureId: idSchema(ID_PREFIXES.signature),
    appliedText: z.string(),
    locale: localeSchema,
    autoApplied: z.boolean(),
  })
  .strict();
export type SignatureRef = z.infer<typeof signatureRefSchema>;

export const THREAD_ITEM_KINDS = ['comment', 'thread'] as const;
export const threadItemKindSchema = z.enum(THREAD_ITEM_KINDS);
export type ThreadItemKind = z.infer<typeof threadItemKindSchema>;

/** Delay presets offered in the composer, in minutes. Custom values are allowed. */
export const DELAY_PRESET_MINUTES = [1, 2, 5, 10, 15, 30, 60, 120] as const;

/** A first comment or a subsequent thread part, ordered after the root post. */
export const threadItemSchema = z
  .object({
    id: idSchema(ID_PREFIXES.comment),
    kind: threadItemKindSchema,
    order: z.number().int().nonnegative(),
    body: z.string(),
    mediaIds: z.array(idSchema(ID_PREFIXES.media)),
    links: z.array(linkSpecSchema),
    delaySeconds: z.number().int().nonnegative(),
    connectionId: idSchema(ID_PREFIXES.connection).nullable(),
  })
  .strict();
export type ThreadItem = z.infer<typeof threadItemSchema>;
export type CommentItem = ThreadItem;
export const commentItemSchema = threadItemSchema;

/** Repeat cadences the composer offers, in days. */
export const REPEAT_CADENCE_DAYS = [1, 2, 3, 4, 5, 6, 7, 14, 30] as const;
export const repeatCadenceDaysSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(14),
  z.literal(30),
]);
export type RepeatCadenceDays = z.infer<typeof repeatCadenceDaysSchema>;

export const repeatSpecSchema = z
  .object({
    cadenceDays: repeatCadenceDaysSchema,
    endDate: isoDateSchema.nullable(),
    count: z.number().int().positive().max(52).nullable(),
  })
  .strict()
  .superRefine((repeat, ctx) => {
    if (repeat.endDate === null && repeat.count === null) {
      ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'REPEAT_END_REQUIRED' });
    }
    if (repeat.endDate !== null && repeat.count !== null) {
      ctx.addIssue({ code: 'custom', path: ['count'], message: 'REPEAT_END_AMBIGUOUS' });
    }
  });
export type RepeatSpec = z.infer<typeof repeatSpecSchema>;

/** An absolute instant plus the zone the user actually chose it in. */
export const scheduleSpecSchema = z
  .object({
    instant: isoInstantSchema,
    ianaTimeZone: ianaTimeZoneSchema,
    repeat: repeatSpecSchema.nullable(),
  })
  .strict();
export type ScheduleSpec = z.infer<typeof scheduleSpecSchema>;

export const mentionRefSchema = z
  .object({
    mentionId: idSchema(ID_PREFIXES.mention),
    externalId: z.string().min(1),
    displayLabel: z.string().min(1),
    offset: z.number().int().nonnegative(),
    length: z.number().int().positive(),
  })
  .strict();
export type MentionRef = z.infer<typeof mentionRefSchema>;

export const destinationRefSchema = z
  .object({
    destinationId: idSchema(ID_PREFIXES.destination),
    externalId: z.string().min(1),
    displayLabel: z.string().min(1),
  })
  .strict();
export type DestinationRef = z.infer<typeof destinationRefSchema>;

export const disclosureFlagsSchema = z
  .object({
    aiAssisted: z.boolean(),
    commercialContent: z.boolean(),
    brandedContent: z.boolean(),
  })
  .strict();
export type DisclosureFlags = z.infer<typeof disclosureFlagsSchema>;

export const masterDraftSchema = z
  .object({
    id: idSchema(ID_PREFIXES.contentItem),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    brandId: idSchema(ID_PREFIXES.brand).nullable(),
    campaignId: idSchema(ID_PREFIXES.campaign).nullable(),
    title: z.string().nullable(),
    body: z.string(),
    contentKind: contentKindSchema,
    locale: localeSchema,
    mediaIds: z.array(idSchema(ID_PREFIXES.media)),
    links: z.array(linkSpecSchema),
    signature: signatureRefSchema.nullable(),
    threadItems: z.array(threadItemSchema),
    schedule: scheduleSpecSchema.nullable(),
    disclosure: disclosureFlagsSchema,
    createdVia: creationSurfaceSchema,
  })
  .strict();
export type MasterDraft = z.infer<typeof masterDraftSchema>;

/** The fields a target may override. Everything else always follows the master. */
export const OVERRIDABLE_VARIANT_FIELDS = [
  'body',
  'contentKind',
  'locale',
  'mediaIds',
  'links',
  'signature',
  'threadItems',
  'schedule',
] as const;
export type OverridableVariantField = (typeof OVERRIDABLE_VARIANT_FIELDS)[number];

/**
 * An absent key means inherit. An explicit `null` on a nullable field means the
 * target deliberately clears the master value.
 */
export const variantOverridesSchema = z
  .object({
    body: z.string().optional(),
    contentKind: contentKindSchema.optional(),
    locale: localeSchema.optional(),
    mediaIds: z.array(idSchema(ID_PREFIXES.media)).optional(),
    links: z.array(linkSpecSchema).optional(),
    signature: signatureRefSchema.nullable().optional(),
    threadItems: z.array(threadItemSchema).optional(),
    schedule: scheduleSpecSchema.nullable().optional(),
  })
  .strict();
export type VariantOverrides = z.infer<typeof variantOverridesSchema>;

export const postVariantSchema = z
  .object({
    id: idSchema(ID_PREFIXES.postVariant),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    contentItemId: idSchema(ID_PREFIXES.contentItem),
    connectionId: idSchema(ID_PREFIXES.connection),
    provider: providerIdSchema,
    accountType: accountTypeSchema,
    overrides: variantOverridesSchema,
    destination: destinationRefSchema.nullable(),
    mentions: z.array(mentionRefSchema),
    privacyValue: z.string().nullable(),
    disclosure: disclosureFlagsSchema.nullable(),
    capabilityVersion: z.string().nullable(),
  })
  .strict();
export type PostVariant = z.infer<typeof postVariantSchema>;

export interface ResolvedVariantValues {
  readonly body: string;
  readonly contentKind: MasterDraft['contentKind'];
  readonly locale: string;
  readonly mediaIds: readonly string[];
  readonly links: readonly LinkSpec[];
  readonly signature: SignatureRef | null;
  readonly threadItems: readonly ThreadItem[];
  readonly schedule: ScheduleSpec | null;
}

export interface ResolvedVariant {
  readonly values: ResolvedVariantValues;
  readonly inherited: readonly OverridableVariantField[];
  readonly overridden: readonly OverridableVariantField[];
}

function masterValue(master: MasterDraft, field: OverridableVariantField): unknown {
  switch (field) {
    case 'body':
      return master.body;
    case 'contentKind':
      return master.contentKind;
    case 'locale':
      return master.locale;
    case 'mediaIds':
      return master.mediaIds;
    case 'links':
      return master.links;
    case 'signature':
      return master.signature;
    case 'threadItems':
      return master.threadItems;
    case 'schedule':
      return master.schedule;
  }
}

/**
 * Fold the master and a target's overrides into the exact values that will be
 * validated, previewed and published, plus the inheritance state per field.
 */
export function resolveVariant(master: MasterDraft, overrides: VariantOverrides): ResolvedVariant {
  const inherited: OverridableVariantField[] = [];
  const overridden: OverridableVariantField[] = [];
  const values: Record<string, unknown> = {};

  for (const field of OVERRIDABLE_VARIANT_FIELDS) {
    const candidate = overrides[field];
    if (candidate === undefined) {
      inherited.push(field);
      values[field] = masterValue(master, field);
    } else {
      overridden.push(field);
      values[field] = candidate;
    }
  }

  return {
    values: values as unknown as ResolvedVariantValues,
    inherited,
    overridden,
  };
}

export interface VariantFieldDiff {
  readonly field: OverridableVariantField;
  readonly masterValue: unknown;
  readonly variantValue: unknown;
}

/**
 * Fields whose overridden value genuinely differs from the master. An override
 * that happens to equal the master is reported as overridden by `resolveVariant`
 * but produces no diff, so `reset to master` is never offered for nothing.
 */
export function diffFromMaster(
  master: MasterDraft,
  overrides: VariantOverrides,
): VariantFieldDiff[] {
  const diffs: VariantFieldDiff[] = [];
  for (const field of OVERRIDABLE_VARIANT_FIELDS) {
    const candidate = overrides[field];
    if (candidate === undefined) {
      continue;
    }
    const original = masterValue(master, field);
    if (!deepEqual(original, candidate)) {
      diffs.push({ field, masterValue: original, variantValue: candidate });
    }
  }
  return diffs;
}

/** Drop overrides that match the master, collapsing them back to inheritance. */
export function pruneRedundantOverrides(
  master: MasterDraft,
  overrides: VariantOverrides,
): VariantOverrides {
  const differing = new Set(diffFromMaster(master, overrides).map((diff) => diff.field));
  const pruned: Record<string, unknown> = {};
  for (const field of OVERRIDABLE_VARIANT_FIELDS) {
    if (differing.has(field)) {
      pruned[field] = overrides[field];
    }
  }
  return pruned as VariantOverrides;
}

/** Remove a single override so the target follows the master again. */
export function resetFieldToMaster(
  overrides: VariantOverrides,
  field: OverridableVariantField,
): VariantOverrides {
  const next: Record<string, unknown> = { ...overrides };
  delete next[field];
  return next as VariantOverrides;
}

export const CONTENT_VERSION_SCHEMA_VERSION = '2026-08-04';

/**
 * Immutable. Every publish attempt references one of these by checksum, and the
 * checksum covers the master, the variants and the exact links that will ship.
 */
export const contentVersionSchema = z
  .object({
    id: idSchema(ID_PREFIXES.contentVersion),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    contentItemId: idSchema(ID_PREFIXES.contentItem),
    schemaVersion: z.literal(CONTENT_VERSION_SCHEMA_VERSION),
    revision: z.number().int().positive(),
    master: masterDraftSchema,
    variants: z.array(postVariantSchema),
    checksum: checksumSchema,
    createdAt: isoInstantSchema,
    createdBy: z.string().min(1),
    createdVia: creationSurfaceSchema,
    aiAssistance: z
      .object({
        model: z.string().min(1),
        promptVersion: z.string().min(1),
        acceptedEdits: z.number().int().nonnegative(),
      })
      .strict()
      .nullable(),
  })
  .strict();
export type ContentVersion = z.infer<typeof contentVersionSchema>;

/** The exact payload a content version checksum is computed over. */
export function checksumPayload(
  master: MasterDraft,
  variants: readonly PostVariant[],
): Record<string, unknown> {
  return {
    schemaVersion: CONTENT_VERSION_SCHEMA_VERSION,
    master,
    variants: [...variants].sort((left, right) => (left.id < right.id ? -1 : 1)),
  };
}
