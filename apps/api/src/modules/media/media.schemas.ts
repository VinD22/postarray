import {
  IMAGE_UPLOAD_LIMIT_BYTES,
  UPLOADABLE_MEDIA_MIME_TYPES,
  VIDEO_UPLOAD_LIMIT_BYTES,
  checksumSchema,
  mediaDerivativeOperationSchema,
  mediaDerivativeOperationsSchema,
  mediaKindSchema,
  type MediaDerivativeOperation,
} from '@relay/contracts';
import { z } from 'zod';

import { cursorQueryWith } from '../../common/pagination';
import { projectIdSchema, mediaIdSchema } from '../../common/schemas';

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

/**
 * The object key a local upload ticket points at.
 *
 * `LocalFileStorage` issues `${workspaceId}/${sha256}`, so the route takes it as
 * two path segments rather than a wildcard. A segment cannot contain a slash,
 * which makes a traversal key unrepresentable here rather than merely rejected,
 * and the digest shape is checked before anything touches storage.
 */
export const objectKeyParamsSchema = z
  .object({ workspaceId: z.string().trim().min(1).max(64), digest: checksumSchema })
  .strict();

/**
 * The two headers a local upload ticket told the client to send. Both are
 * compared against the pending asset row, never trusted on their own.
 */
export const directUploadHeadersSchema = z
  .object({ contentType: z.enum(UPLOADABLE_MIME_TYPES), checksumSha256: checksumSchema })
  .strict();

export const createUploadUrlSchema = z
  .object({
    filename: z.string().trim().min(1).max(255),
    mimeType: z.enum(UPLOADABLE_MIME_TYPES),
    byteSize: z.number().int().positive().max(MAX_UPLOAD_BYTES),
    projectId: projectIdSchema.nullable().optional(),
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
 * Import by URL. SSRF-safe: the fetch resolves DNS itself,
 * refuses loopback, link-local, private, CGNAT and cloud metadata addresses,
 * pins the resolved address on connect and repeats every check on each
 * redirect. That work happens in `@relay/application`'s single `safeFetch`, so
 * the URL is accepted here and validated there.
 */
export const importFromUrlSchema = z
  .object({
    url: z.string().trim().min(1).max(2048),
    projectId: projectIdSchema.nullable().optional(),
  })
  .strict();

/**
 * Non-generative edits only. V1 generates no image or video, ever.
 *
 * The union is the one in `@relay/contracts`, not a second copy: crop, rotate,
 * resize, convert and compress, each strict, none carrying a prompt, a model or
 * a seed. The transport therefore cannot describe an edit the pipeline would
 * refuse, and there is no field a generative request could arrive in.
 */
export const mediaEditOpSchema = mediaDerivativeOperationSchema;

export const editMediaSchema = z.object({ ops: mediaDerivativeOperationsSchema }).strict();

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
  projectId: projectIdSchema.optional(),
  kind: mediaKindSchema.optional(),
});

export const finalizeParamsSchema = z.object({ id: mediaIdSchema }).strict();

/** Derivatives of one asset. Read only: they are produced, never uploaded. */
export const listDerivativesParamsSchema = z.object({ id: mediaIdSchema }).strict();

export type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>;
export type EditMediaInput = z.infer<typeof editMediaSchema>;
export type DeclareRightsInput = z.infer<typeof declareRightsSchema>;

/**
 * The transport shape is already the domain shape, so this is the identity.
 * It stays as a named function because the boundary is worth naming: the
 * application canonicalizes and validates these against the source file, and
 * the handler must not do either.
 */
export function toMediaEditOperations(input: EditMediaInput): readonly MediaDerivativeOperation[] {
  return input.ops;
}
