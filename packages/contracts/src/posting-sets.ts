import { z } from 'zod';

import { providerIdSchema } from './enums';
import { ID_PREFIXES, idSchema } from './ids';
import { isoInstantSchema } from './primitives';

/**
 * Posting Sets.
 *
 * A Set is a saved answer to "who am I posting this to, and how". It names a
 * group of channels, the per-platform defaults to start from, an optional
 * signature, the approval policy the resulting campaign inherits, and what the
 * composer should do about a time.
 *
 * The load bearing rule is one sentence long: **a Set is read once, at apply
 * time.** Applying a Set copies its values into a draft. Editing the Set later
 * changes what the next apply will produce and nothing else. A draft or a
 * scheduled campaign created from a Set last week is not a live view of it, and
 * must never be rewritten when the Set changes. This is the same reasoning as
 * the frozen `ruleSnapshot` on a queue slot reservation: configuration is
 * editable, and what a person already reviewed is evidence.
 */

/** The approval policy a campaign inherits from the Set it was applied from. */
export const POSTING_SET_APPROVAL_POLICIES = [
  'none',
  'single_approver',
  'any_approver',
  'named_approver',
  'policy_auto',
] as const;
export const postingSetApprovalPolicySchema = z.enum(POSTING_SET_APPROVAL_POLICIES);
export type PostingSetApprovalPolicy = z.infer<typeof postingSetApprovalPolicySchema>;

/**
 * What applying the Set should do about a time.
 *
 * `next_free_slot` asks the queue rules service for the project's next offered
 * instant; it never invents one and never publishes on its own. `pick_time`
 * leaves the time to the person. `draft_only` says this Set is for building
 * drafts and does not touch the schedule at all.
 */
export const POSTING_SET_SLOT_BEHAVIORS = ['next_free_slot', 'pick_time', 'draft_only'] as const;
export const postingSetSlotBehaviorSchema = z.enum(POSTING_SET_SLOT_BEHAVIORS);
export type PostingSetSlotBehavior = z.infer<typeof postingSetSlotBehaviorSchema>;

/**
 * Per-platform starting values.
 *
 * Only fields the composer already understands appear here. Nothing in this
 * object is a provider capability claim: an unsupported field is dropped by
 * validation at apply time, exactly as a hand-entered value would be.
 */
export const postingSetTargetDefaultSchema = z
  .object({
    provider: providerIdSchema,
    /** Provider privacy value token, when the provider exposes one. */
    privacyValue: z.string().max(80).nullable().default(null),
    /** Prefix the composer seeds the per-platform body with. */
    bodyPrefix: z.string().max(500).nullable().default(null),
    /** Suffix the composer seeds the per-platform body with. */
    bodySuffix: z.string().max(500).nullable().default(null),
    /** Ask for alt text on every image before this target can be scheduled. */
    requireAltText: z.boolean().default(false),
  })
  .strict();
export type PostingSetTargetDefault = z.infer<typeof postingSetTargetDefaultSchema>;

export const MAX_POSTING_SET_TARGETS = 200;

/**
 * The unrefined shape, exported so a transport can narrow an identifier to its
 * prefix with `.extend()` and then re-apply the same checks. Zod refuses to
 * extend a schema that already carries refinements, and duplicating the checks
 * at the edge is exactly the drift this package exists to prevent.
 */
export const postingSetInputShape = z
  .object({
    projectId: idSchema(ID_PREFIXES.project),
    name: z.string().min(1).max(120),
    description: z.string().max(500).nullable().default(null),
    /** The channels this Set posts to. Empty is allowed while it is drafted. */
    connectionIds: z
      .array(idSchema(ID_PREFIXES.connection))
      .max(MAX_POSTING_SET_TARGETS)
      .default([]),
    targetDefaults: z.array(postingSetTargetDefaultSchema).max(50).default([]),
    signatureId: idSchema(ID_PREFIXES.signature).nullable().default(null),
    approvalPolicy: postingSetApprovalPolicySchema.default('none'),
    slotBehavior: postingSetSlotBehaviorSchema.default('next_free_slot'),
  })
  .strict();

/** One default per platform, one entry per channel. */
export function refinePostingSetInput(
  set: { readonly targetDefaults: readonly { readonly provider: string }[]; readonly connectionIds: readonly string[] },
  ctx: z.RefinementCtx,
): void {
  const seen = new Set<string>();
  for (const target of set.targetDefaults) {
    if (seen.has(target.provider)) {
      ctx.addIssue({
        code: 'custom',
        path: ['targetDefaults'],
        message: 'DUPLICATE_PROVIDER_DEFAULT',
      });
    }
    seen.add(target.provider);
  }
  if (new Set(set.connectionIds).size !== set.connectionIds.length) {
    ctx.addIssue({ code: 'custom', path: ['connectionIds'], message: 'DUPLICATE_CONNECTION' });
  }
}

export const postingSetInputSchema = postingSetInputShape.superRefine(refinePostingSetInput);
export type PostingSetInput = z.infer<typeof postingSetInputSchema>;

/** A patch. Absent means "leave alone"; null on a nullable field means "clear". */
export const postingSetPatchSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    description: z.string().max(500).nullable().optional(),
    connectionIds: z
      .array(idSchema(ID_PREFIXES.connection))
      .max(MAX_POSTING_SET_TARGETS)
      .optional(),
    targetDefaults: z.array(postingSetTargetDefaultSchema).max(50).optional(),
    signatureId: idSchema(ID_PREFIXES.signature).nullable().optional(),
    approvalPolicy: postingSetApprovalPolicySchema.optional(),
    slotBehavior: postingSetSlotBehaviorSchema.optional(),
  })
  .strict();
export type PostingSetPatch = z.infer<typeof postingSetPatchSchema>;

export const postingSetViewSchema = z
  .object({
    id: idSchema(ID_PREFIXES.set),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    projectId: idSchema(ID_PREFIXES.project),
    name: z.string(),
    description: z.string().nullable(),
    connectionIds: z.array(idSchema(ID_PREFIXES.connection)),
    targetDefaults: z.array(postingSetTargetDefaultSchema),
    signatureId: idSchema(ID_PREFIXES.signature).nullable(),
    approvalPolicy: postingSetApprovalPolicySchema,
    slotBehavior: postingSetSlotBehaviorSchema,
    archivedAt: isoInstantSchema.nullable(),
    createdAt: isoInstantSchema,
    updatedAt: isoInstantSchema,
  })
  .strict();
export type PostingSetView = z.infer<typeof postingSetViewSchema>;
