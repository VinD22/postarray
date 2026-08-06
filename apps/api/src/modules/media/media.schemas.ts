import {
  IMAGE_UPLOAD_LIMIT_BYTES,
  UPLOADABLE_MEDIA_MIME_TYPES,
  VIDEO_UPLOAD_LIMIT_BYTES,
  checksumSchema,
  mediaKindSchema,
} from '@relay/contracts';
import { z } from 'zod';
import type { MediaEditOperation } from '../../application/port';

import { cursorQueryWith } from '../../common/pagination';
import { brandIdSchema, mediaIdSchema } from '../../common/schemas';

/**
 * Media payloads.
 *
 * Uploads go straight to object storage through a short-lived signed URL scoped
 * to one object key, one declared content type and one maximum size. The server
 * issues that URL only after checking the plan and the quota, and the asset
 * stays unusable until an isolated worker has sniffed the real MIME type from
 * the bytes, computed the checksum, run the malware scan and extracted metadata
 * (`04-auth-oauth-and-security.md`, section 14.5).
 *
 * The client's declared `mimeType` is a hint for the signed URL, never a fact.
 * Type is decided from content, because an attacker controls the extension and
 * the header but not what the bytes actually are.
 */

/** Accepted upload types. Deliberately an allowlist, never a denylist. */
export const UPLOADABLE_MIME_TYPES = UPLOADABLE_MEDIA_MIME_TYPES;

export const MAX_UPLOAD_BYTES = VIDEO_UPLOAD_LIMIT_BYTES;

export const createUploadUrlSchema = z
  .object({
    filename: z.string().trim().min(1).max(255),
    mimeType: z.enum(UPLOADABLE_MIME_TYPES),
    byteSize: z.number().int().positive().max(MAX_UPLOAD_BYTES),
    /** Computed by the client. Re-verified server side after the upload. */
    sha256: checksumSchema,
  })
  .strict()
  .superRefine((value, context) => {
    const limit = value.mimeType.startsWith('video/')
      ? VIDEO_UPLOAD_LIMIT_BYTES
      : IMAGE_UPLOAD_LIMIT_BYTES;
    if (value.byteSize > limit) {
      context.addIssue({
        code: 'too_big',
        maximum: limit,
        inclusive: true,
        origin: 'number',
        path: ['byteSize'],
        message: 'MEDIA_SIZE_LIMIT_EXCEEDED',
      });
    }
  });

/**
 * Import by URL. Asynchronous and SSRF-safe: the fetch resolves DNS itself,
 * refuses loopback, link-local, private, CGNAT and cloud metadata addresses,
 * pins the resolved address on connect and repeats every check on each
 * redirect. That work happens in `@relay/application`'s single `safeFetch`, so
 * the URL is accepted here and validated there.
 */
export const importFromUrlSchema = z
  .object({
    url: z.string().trim().min(1).max(2048),
    brandId: brandIdSchema.nullable().optional(),
  })
  .strict();

/** Non-generative edits only. V1 generates no image or video, ever. */
export const mediaEditOpSchema = z.discriminatedUnion('op', [
  z
    .object({
      op: z.literal('crop'),
      x: z.number().int().nonnegative(),
      y: z.number().int().nonnegative(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .strict(),
  z
    .object({
      op: z.literal('resize'),
      width: z.number().int().positive().max(16_384),
      height: z.number().int().positive().max(16_384),
    })
    .strict(),
  z
    .object({
      op: z.literal('rotate'),
      degrees: z.union([z.literal(90), z.literal(180), z.literal(270)]),
    })
    .strict(),
  z.object({ op: z.literal('compress'), quality: z.number().int().min(1).max(100) }).strict(),
]);

export const editMediaSchema = z
  .object({ ops: z.array(mediaEditOpSchema).min(1).max(10) })
  .strict();

/**
 * Alt text. It can be waived, but only explicitly and only with a reason, so
 * "no alt text" is a recorded decision rather than an empty field nobody noticed.
 */
export const setAltTextSchema = z
  .object({
    altText: z.string().trim().min(1).max(1000).nullable(),
    waived: z.boolean().optional(),
    waivedReason: z.string().trim().min(1).max(500).nullable().optional(),
  })
  .strict()
  .refine((value) => value.altText !== null || value.waived === true, {
    error: 'ALT_TEXT_REQUIRED_OR_WAIVED',
    path: ['altText'],
  })
  .refine((value) => value.altText === null || value.waived !== true, {
    error: 'ALT_TEXT_AND_WAIVER_CONFLICT',
    path: ['waived'],
  })
  .refine((value) => value.waived !== true || (value.waivedReason?.trim().length ?? 0) > 0, {
    error: 'ALT_TEXT_WAIVER_REASON_REQUIRED',
    path: ['waivedReason'],
  });

export const declareRightsSchema = z
  .object({
    owner: z.enum(['workspace', 'licensed', 'ugc']),
    licenseReference: z.string().trim().min(1).max(500).nullable(),
    peopleAppear: z.boolean(),
    peopleConsented: z.boolean(),
    containsMusic: z.boolean(),
    confirmed: z.literal(true),
  })
  .strict()
  .refine((value) => value.owner !== 'licensed' || value.licenseReference !== null, {
    error: 'MEDIA_LICENSE_REFERENCE_REQUIRED',
    path: ['licenseReference'],
  })
  .refine((value) => !value.peopleAppear || value.peopleConsented, {
    error: 'MEDIA_PEOPLE_CONSENT_REQUIRED',
    path: ['peopleConsented'],
  });

export const listMediaQuerySchema = cursorQueryWith({
  brandId: brandIdSchema.optional(),
  kind: mediaKindSchema.optional(),
});

export const finalizeParamsSchema = z.object({ id: mediaIdSchema }).strict();

export type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>;
export type EditMediaInput = z.infer<typeof editMediaSchema>;
export type DeclareRightsInput = z.infer<typeof declareRightsSchema>;

export function toMediaEditOperations(input: EditMediaInput): readonly MediaEditOperation[] {
  return input.ops.map((operation): MediaEditOperation => {
    switch (operation.op) {
      case 'crop':
        return {
          kind: operation.op,
          params: {
            x: operation.x,
            y: operation.y,
            width: operation.width,
            height: operation.height,
          },
        } satisfies MediaEditOperation;
      case 'resize':
        return {
          kind: operation.op,
          params: { width: operation.width, height: operation.height },
        } satisfies MediaEditOperation;
      case 'rotate':
        return {
          kind: operation.op,
          params: { degrees: operation.degrees },
        } satisfies MediaEditOperation;
      case 'compress':
        return {
          kind: operation.op,
          params: { quality: operation.quality },
        } satisfies MediaEditOperation;
    }
  });
}
