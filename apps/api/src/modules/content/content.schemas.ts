import {
  ID_PREFIXES,
  contentKindSchema,
  disclosureFlagsSchema,
  idSchema,
  linkSpecSchema,
  localeSchema,
  mentionRefSchema,
  publishStateSchema,
  scheduleSpecSchema,
  signatureRefSchema,
  threadItemSchema,
  variantOverridesSchema,
} from '@relay/contracts';
import { z } from 'zod';

import { cursorQueryWith } from '../../common/pagination';
import {
  brandIdSchema,
  campaignIdSchema,
  connectionIdSchema,
  contentItemIdSchema,
  postVariantIdSchema,
  setIdSchema,
  signatureIdSchema,
} from '../../common/schemas';

/**
 * Composer payloads.
 *
 * The model is one master draft plus one variant per target. A variant stores
 * only what it overrides, so editing the master still reaches every target that
 * has not been deliberately customized. `masterDraftSchema` in
 * `@relay/contracts` is the shape both the composer and the API speak, and the
 * request schemas below are derived from it rather than restated, so a new
 * field cannot exist in one and be missing from the other.
 */

/** One target: an account, optionally a native destination inside it. */
export const targetInputSchema = z
  .object({
    connectionId: connectionIdSchema,
    destinationId: z.string().trim().min(1).max(128).nullable().optional(),
    mentions: z.array(mentionRefSchema).max(50).optional(),
    privacyValue: z.string().min(1).max(64).nullable().optional(),
    disclosure: disclosureFlagsSchema.nullable().optional(),
  })
  .strict();

export const createDraftSchema = z
  .object({
    brandId: brandIdSchema,
    campaignId: campaignIdSchema.nullable().optional(),
    title: z.string().max(300).nullable().optional(),
    body: z.string().max(100_000).default(''),
    contentKind: contentKindSchema.optional(),
    locale: localeSchema.optional(),
    mediaIds: z.array(idSchema(ID_PREFIXES.media)).max(50).optional(),
    links: z.array(linkSpecSchema).max(50).optional(),
    signature: signatureRefSchema.nullable().optional(),
    threadItems: z.array(threadItemSchema).max(100).optional(),
    schedule: scheduleSpecSchema.nullable().optional(),
    disclosure: disclosureFlagsSchema.optional(),
    targets: z.array(targetInputSchema).max(200).optional(),
    approvalPolicy: z.string().trim().min(1).max(64).optional(),
  })
  .strict();

export const updateMasterSchema = z
  .object({
    title: z.string().max(300).nullable().optional(),
    body: z.string().max(100_000).optional(),
    contentKind: contentKindSchema.optional(),
    locale: localeSchema.optional(),
    mediaIds: z.array(idSchema(ID_PREFIXES.media)).max(50).optional(),
    links: z.array(linkSpecSchema).max(50).optional(),
    signature: signatureRefSchema.nullable().optional(),
    threadItems: z.array(threadItemSchema).max(100).optional(),
    schedule: scheduleSpecSchema.nullable().optional(),
    disclosure: disclosureFlagsSchema.optional(),
    campaignId: campaignIdSchema.nullable().optional(),
  })
  .strict();

export const setTargetsSchema = z.object({ targets: z.array(targetInputSchema).max(200) }).strict();

/**
 * A variant override. An absent key inherits from the master; an explicit
 * `null` on a nullable field is a deliberate clear. Those are different
 * intentions and the wire format keeps them different.
 */
export const overrideVariantSchema = z.object({ patch: variantOverridesSchema }).strict();

export const applySetSchema = z.object({ setId: setIdSchema }).strict();

export const applySignatureSchema = z
  .object({
    signatureId: signatureIdSchema,
    /** Absent means apply to the master, and therefore to every target. */
    targetId: postVariantIdSchema.optional(),
  })
  .strict();

export const listContentQuerySchema = cursorQueryWith({
  state: publishStateSchema.optional(),
  brandId: brandIdSchema.optional(),
  campaignId: campaignIdSchema.optional(),
});

export const previewQuerySchema = z.object({ targetId: postVariantIdSchema }).strict();

export const variantParamsSchema = z
  .object({ id: contentItemIdSchema, targetId: postVariantIdSchema })
  .strict();

export type CreateDraftInput = z.infer<typeof createDraftSchema>;
export type UpdateMasterInput = z.infer<typeof updateMasterSchema>;
export type TargetInput = z.infer<typeof targetInputSchema>;
