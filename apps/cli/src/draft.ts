import { readFile } from 'node:fs/promises';

import { z } from 'zod';
import {
  RelayError,
  contentKindSchema,
  disclosureFlagsSchema,
  ianaTimeZoneSchema,
  isoInstantSchema,
  localeSchema,
  webUrlSchema,
} from '@relay/contracts';

/**
 * The draft file.
 *
 * A small, hand-writable, reviewable JSON document. It is deliberately not the
 * internal `MasterDraft` shape: an agent or a person writing this by hand should
 * name a connection and a time, not construct a variant graph. The API expands
 * it into the real content model.
 *
 * It is parsed, not cast. A draft file is external input like any other.
 */

export const draftTargetSchema = z
  .object({
    connectionId: z.string().min(1),
    /** Absent means the target inherits every field from the master. */
    body: z.string().optional(),
    destinationId: z.string().min(1).optional(),
    privacyValue: z.string().min(1).optional(),
    mediaIds: z.array(z.string().min(1)).optional(),
  })
  .strict();
export type DraftTarget = z.infer<typeof draftTargetSchema>;

export const draftThreadItemSchema = z
  .object({
    kind: z.enum(['comment', 'thread']),
    body: z.string(),
    delaySeconds: z.number().int().nonnegative().default(0),
    mediaIds: z.array(z.string().min(1)).default([]),
  })
  .strict();

export const draftScheduleSchema = z
  .object({
    instant: isoInstantSchema,
    ianaTimeZone: ianaTimeZoneSchema,
  })
  .strict();

export const draftDocumentSchema = z
  .object({
    /** Bump when the file format changes in a way an old CLI cannot read. */
    version: z.literal(1),
    brandId: z.string().min(1).optional(),
    campaignId: z.string().min(1).optional(),
    title: z.string().optional(),
    body: z.string(),
    contentKind: contentKindSchema.default('text'),
    locale: localeSchema.default('en'),
    mediaIds: z.array(z.string().min(1)).default([]),
    links: z
      .array(
        z
          .object({
            originalUrl: webUrlSchema,
            tracked: z.boolean().default(false),
          })
          .strict(),
      )
      .default([]),
    threadItems: z.array(draftThreadItemSchema).default([]),
    targets: z.array(draftTargetSchema).min(1),
    schedule: draftScheduleSchema.optional(),
    disclosure: disclosureFlagsSchema.default({
      aiAssisted: false,
      commercialContent: false,
      brandedContent: false,
    }),
    signatureId: z.string().min(1).optional(),
  })
  .strict();
export type DraftDocument = z.infer<typeof draftDocumentSchema>;

/** Read and validate a draft file. Errors name the field, not the parser. */
export async function readDraftFile(path: string): Promise<DraftDocument> {
  let raw: string;
  try {
    raw = await readFile(path, 'utf8');
  } catch (error) {
    throw new RelayError('NOT_FOUND', {
      messageKey: 'error.not_found.message',
      details: { reason: 'DRAFT_FILE_UNREADABLE', path },
      cause: error,
    });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw) as unknown;
  } catch (error) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'DRAFT_FILE_NOT_JSON', path },
      cause: error,
    });
  }

  const parsed = draftDocumentSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.validation_failed.message',
      details: {
        reason: 'DRAFT_FILE_INVALID',
        fields: parsed.error.issues.slice(0, 10).map((issue) => ({
          path: issue.path.map(String).join('.'),
          code: issue.code,
        })),
      },
    });
  }
  return parsed.data;
}

/** How many external publications this draft would produce. */
export function externalPublicationCount(draft: DraftDocument): number {
  const perTarget = 1 + draft.threadItems.length;
  return draft.targets.length * perTarget;
}
