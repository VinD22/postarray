import { checksumSchema, mediaKindSchema } from '@relay/contracts';
import { z } from 'zod';

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
export const UPLOADABLE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'audio/mpeg',
  'audio/mp4',
  'application/pdf',
] as const;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 * 1024;

export const createUploadUrlSchema = z
  .object({
    filename: z.string().trim().min(1).max(255),
    mimeType: z.enum(UPLOADABLE_MIME_TYPES),
    byteSize: z.number().int().positive().max(MAX_UPLOAD_BYTES),
    /** Computed by the client. Re-verified server side after the upload. */
    sha256: checksumSchema,
  })
  .strict();

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
    brandId: brandIdSchema,
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
    altText: z.string().trim().max(1000).nullable(),
    waived: z.boolean().optional(),
  })
  .strict()
  .refine((value) => value.altText !== null || value.waived === true, {
    error: 'ALT_TEXT_REQUIRED_OR_WAIVED',
    path: ['altText'],
  });

export const listMediaQuerySchema = cursorQueryWith({
  brandId: brandIdSchema.optional(),
  kind: mediaKindSchema.optional(),
});

export const finalizeParamsSchema = z.object({ id: mediaIdSchema }).strict();

export type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>;
export type EditMediaInput = z.infer<typeof editMediaSchema>;
