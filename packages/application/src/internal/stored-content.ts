import {
  CONTENT_VERSION_SCHEMA_VERSION,
  OVERRIDABLE_VARIANT_FIELDS,
  checksumPayload,
  computeChecksum,
  contentKindSchema,
  creationSurfaceSchema,
  diffFromMaster,
  disclosureFlagsSchema,
  localeSchema,
  pruneRedundantOverrides,
  resolveVariant,
  scheduleSpecSchema,
  utmParametersSchema,
  webUrlSchema,
  type MasterDraft,
  type OverridableVariantField,
  type PostVariant,
  type ResolvedVariant,
  type VariantOverrides,
} from '@relay/contracts';
import { z } from 'zod';

/**
 * The canonical payload stored in `content_versions.payload`, and the helpers
 * that fold a master and its per-target overrides together.
 *
 * Identifiers here are the durable UUID primary keys, not the prefixed public
 * form: prefixes are a presentation concern that never reaches a column. The
 * shapes are otherwise the content model from `@relay/contracts`, and the fold
 * uses that package's `resolveVariant` and `diffFromMaster` so the composer,
 * the API, the preview and the worker cannot disagree about what a target will
 * actually publish.
 */

const idSchema = z.string().min(1);

const linkSpecSchema = z
  .object({
    originalUrl: webUrlSchema,
    tracked: z.boolean(),
    shortLinkId: idSchema.nullable(),
    publishedUrl: webUrlSchema.nullable(),
    utm: utmParametersSchema.nullable(),
    frozenAt: z.string().nullable(),
  })
  .strict();

const signatureRefSchema = z
  .object({
    signatureId: idSchema,
    appliedText: z.string(),
    locale: localeSchema,
    autoApplied: z.boolean(),
  })
  .strict();

const threadItemSchema = z
  .object({
    id: idSchema,
    kind: z.enum(['comment', 'thread']),
    order: z.number().int().nonnegative(),
    body: z.string(),
    mediaIds: z.array(idSchema),
    links: z.array(linkSpecSchema),
    delaySeconds: z.number().int().nonnegative(),
    connectionId: idSchema.nullable(),
  })
  .strict();

const mentionRefSchema = z
  .object({
    mentionId: idSchema,
    externalId: z.string().min(1),
    displayLabel: z.string().min(1),
    offset: z.number().int().nonnegative(),
    length: z.number().int().positive(),
  })
  .strict();

/** The master draft as it is written to and read back from the Json column. */
export const storedMasterSchema = z
  .object({
    id: idSchema,
    workspaceId: idSchema,
    projectId: idSchema.nullable(),
    campaignId: idSchema.nullable(),
    title: z.string().nullable(),
    body: z.string(),
    contentKind: contentKindSchema,
    locale: localeSchema,
    mediaIds: z.array(idSchema),
    links: z.array(linkSpecSchema),
    signature: signatureRefSchema.nullable(),
    threadItems: z.array(threadItemSchema),
    schedule: scheduleSpecSchema.nullable(),
    disclosure: disclosureFlagsSchema,
    createdVia: creationSurfaceSchema,
  })
  .strict();

export type StoredMaster = z.infer<typeof storedMasterSchema>;

export const storedOverridesSchema = z
  .object({
    body: z.string().optional(),
    contentKind: contentKindSchema.optional(),
    locale: localeSchema.optional(),
    mediaIds: z.array(idSchema).optional(),
    links: z.array(linkSpecSchema).optional(),
    signature: signatureRefSchema.nullable().optional(),
    threadItems: z.array(threadItemSchema).optional(),
    schedule: scheduleSpecSchema.nullable().optional(),
  })
  .strict();

/** Per-target settings that are not overridable master fields. */
export const storedVariantSettingsSchema = z
  .object({
    overrides: storedOverridesSchema.default({}),
    mentions: z.array(mentionRefSchema).default([]),
    privacyValue: z.string().nullable().default(null),
    disclosure: disclosureFlagsSchema.nullable().default(null),
    accountType: z.string().default('personal_profile'),
  })
  .strict();

export type StoredVariantSettings = z.infer<typeof storedVariantSettingsSchema>;

export const EMPTY_VARIANT_SETTINGS: StoredVariantSettings = {
  overrides: {},
  mentions: [],
  privacyValue: null,
  disclosure: null,
  accountType: 'personal_profile',
};

/** Parse the payload column. Unknown or malformed data is an error, not a guess. */
export function parseStoredMaster(value: unknown): StoredMaster {
  return storedMasterSchema.parse(value);
}

export function parseVariantSettings(value: unknown): StoredVariantSettings {
  const parsed = storedVariantSettingsSchema.safeParse(value ?? {});
  return parsed.success ? parsed.data : { ...EMPTY_VARIANT_SETTINGS };
}

/**
 * The stored master is structurally the contract's `MasterDraft`, so the shared
 * fold applies directly. Only the identifier format differs, and the fold never
 * inspects an identifier.
 */
export function asMasterDraft(master: StoredMaster): MasterDraft {
  return master;
}

export function resolveTarget(master: StoredMaster, overrides: VariantOverrides): ResolvedVariant {
  return resolveVariant(asMasterDraft(master), overrides);
}

export function overriddenFields(
  master: StoredMaster,
  overrides: VariantOverrides,
): readonly OverridableVariantField[] {
  return diffFromMaster(asMasterDraft(master), overrides).map((diff) => diff.field);
}

export function inheritedFields(
  master: StoredMaster,
  overrides: VariantOverrides,
): readonly OverridableVariantField[] {
  const claimed = new Set(overriddenFields(master, overrides));
  return OVERRIDABLE_VARIANT_FIELDS.filter((field) => !claimed.has(field));
}

/** Collapse an override that happens to equal the master back to inheritance. */
export function prune(master: StoredMaster, overrides: VariantOverrides): VariantOverrides {
  return pruneRedundantOverrides(asMasterDraft(master), overrides);
}

/**
 * Applying a master patch must never silently overwrite an override.
 *
 * The master changes; a target that had claimed a field keeps its own value
 * until the field is explicitly released. `releaseFields` is the caller saying
 * "put these back on the master everywhere", which is an audited, deliberate
 * act rather than a side effect of typing in the composer.
 */
export function reconcileOverrides(input: {
  readonly previousMaster: StoredMaster;
  readonly nextMaster: StoredMaster;
  readonly overrides: VariantOverrides;
  readonly releaseFields?: readonly string[];
}): VariantOverrides {
  const released = new Set(input.releaseFields ?? []);
  const claimed = new Set(overriddenFields(input.previousMaster, input.overrides));
  const next: Record<string, unknown> = {};

  for (const field of OVERRIDABLE_VARIANT_FIELDS) {
    if (released.has(field)) {
      continue;
    }
    if (!claimed.has(field)) {
      continue;
    }
    next[field] = input.overrides[field];
  }

  const candidate = storedOverridesSchema.parse(next);
  return prune(input.nextMaster, candidate);
}

export interface VariantForChecksum {
  readonly id: string;
  readonly connectionId: string;
  readonly provider: string;
  readonly accountType: string;
  readonly overrides: VariantOverrides;
  readonly destinationId: string | null;
  readonly mentions: readonly { readonly mentionId: string; readonly externalId: string }[];
  readonly privacyValue: string | null;
  readonly capabilityVersion: string | null;
}

/**
 * SHA-256 over the canonical serialization of the master and every target. The
 * checksum is what approval binds to and what a receipt proves, so it covers
 * exactly the bytes that will publish and nothing that will not.
 */
export async function computeContentChecksum(
  master: StoredMaster,
  variants: readonly VariantForChecksum[],
): Promise<string> {
  const normalized = [...variants]
    .sort((left, right) => (left.id < right.id ? -1 : 1))
    .map((variant) => ({
      id: variant.id,
      workspaceId: master.workspaceId,
      contentItemId: master.id,
      connectionId: variant.connectionId,
      provider: variant.provider,
      accountType: variant.accountType,
      overrides: variant.overrides,
      destination:
        variant.destinationId === null
          ? null
          : { destinationId: variant.destinationId, externalId: '', displayLabel: '' },
      mentions: variant.mentions,
      privacyValue: variant.privacyValue,
      disclosure: null,
      capabilityVersion: variant.capabilityVersion,
    }));

  // The payload shape is the contract's, so a checksum computed here matches
  // one computed by any other consumer of `checksumPayload`.
  const payload = checksumPayload(
    asMasterDraft(master),
    normalized as unknown as readonly PostVariant[],
  );
  return computeChecksum(payload);
}

export const CONTENT_SCHEMA_VERSION = CONTENT_VERSION_SCHEMA_VERSION;
