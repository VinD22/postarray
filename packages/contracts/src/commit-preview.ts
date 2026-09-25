import { z } from 'zod';

import { ID_PREFIXES, idSchema } from './ids';
import { checksumSchema, ianaTimeZoneSchema, isoInstantSchema } from './primitives';
import { validationIssueSchema, validationParamValueSchema } from './validation';

/**
 * Commit preview and confirmation evidence.
 *
 * Before a person schedules or publishes, every surface asks the server what
 * committing would take: how many external publications, the exact version
 * checksum, what blocks it outright and which escalations need an explicit
 * acknowledgement. The preview runs the same policy and validation steps as the
 * commit itself and freezes nothing, so what the confirm step shows is what the
 * commit will check.
 */

export const COMMIT_KINDS = ['publish_now', 'schedule'] as const;
export const commitKindSchema = z.enum(COMMIT_KINDS);
export type CommitKind = z.infer<typeof commitKindSchema>;

/** At most this many connections may be named in a target filter. */
export const MAX_COMMIT_CONNECTION_FILTER = 100;

export const commitConnectionFilterSchema = z
  .array(idSchema(ID_PREFIXES.connection))
  .min(1)
  .max(MAX_COMMIT_CONNECTION_FILTER);

/**
 * Evidence that a human was shown the blast radius and agreed to it. The server
 * checks every field against its own count; it never trusts that a host UI
 * displayed a dialog.
 */
export const publishConfirmationEvidenceSchema = z
  .object({
    /** How many external publications the human was told this would create. */
    acknowledgedTargetCount: z.number().int().nonnegative().max(1000),
    /** The exact content version hash the human saw. */
    acknowledgedVersionChecksum: checksumSchema,
    /** Every escalation code the human acknowledged. Compared as an exact set. */
    acknowledgedEscalations: z.array(z.string().min(1).max(64)).max(32).default([]),
  })
  .strict();
export type PublishConfirmationEvidenceInput = z.infer<typeof publishConfirmationEvidenceSchema>;

export const commitPreviewRequestSchema = z
  .object({
    kind: commitKindSchema,
    /** Required for `schedule`; ignored for `publish_now`. */
    scheduledAt: isoInstantSchema.optional(),
    /** The zone the time was chosen in. Defaults to the workspace zone. */
    ianaTimeZone: ianaTimeZoneSchema.optional(),
    /** Limit the commit to these connections. Omitted means every target. */
    connectionIds: commitConnectionFilterSchema.optional(),
  })
  .strict()
  .refine((body) => body.kind !== 'schedule' || body.scheduledAt !== undefined, {
    error: 'SCHEDULED_AT_REQUIRED',
    path: ['scheduledAt'],
  });
export type CommitPreviewRequest = z.infer<typeof commitPreviewRequestSchema>;

export const commitPreviewNoteSchema = z
  .object({
    code: z.string().min(1),
    messageKey: z.string().min(1),
    params: z.record(z.string(), validationParamValueSchema),
    /** Set when the note concerns one connection rather than the whole commit. */
    connectionId: z.string().min(1).optional(),
  })
  .strict();
export type CommitPreviewNote = z.infer<typeof commitPreviewNoteSchema>;

export const commitPreviewSchema = z
  .object({
    contentItemId: idSchema(ID_PREFIXES.contentItem),
    kind: commitKindSchema,
    /** The number of targets the commit would create jobs for. */
    targetCount: z.number().int().nonnegative(),
    versionChecksum: checksumSchema,
    externalPublicationCount: z.number().int().nonnegative(),
    /** Anything here refuses the commit until it is fixed. */
    blockers: z.array(commitPreviewNoteSchema),
    /** Every code here must be acknowledged, exactly, with the commit. */
    escalations: z.array(commitPreviewNoteSchema),
    validation: z.object({ issues: z.array(validationIssueSchema) }).strict(),
    /** True when there are no blockers. Escalations still need acknowledging. */
    canCommit: z.boolean(),
    requiresConfirmation: z.boolean(),
  })
  .strict();
export type CommitPreview = z.infer<typeof commitPreviewSchema>;
