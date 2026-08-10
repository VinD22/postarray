import {
  postingSetInputShape,
  postingSetPatchSchema,
  postingSetViewSchema,
  refinePostingSetInput,
} from '@relay/contracts';
import { z } from 'zod';

import { cursorQueryWith } from '../../common/pagination';
import { brandIdSchema, connectionIdSchema, signatureIdSchema } from '../../common/schemas';

/**
 * Posting Set payloads.
 *
 * The bodies are the contract schemas, narrowed only where an identifier
 * deserves its prefix so a malformed id is a 422 at the edge rather than a
 * lookup that finds nothing. Restating the shape here would let the edge and
 * the application drift on `slotBehavior`, which is the field that decides
 * whether applying a Set asks the queue for a slot or leaves the time alone.
 */

export const createPostingSetSchema = postingSetInputShape
  .extend({
    brandId: brandIdSchema,
    connectionIds: z.array(connectionIdSchema).max(200).default([]),
    signatureId: signatureIdSchema.nullable().default(null),
  })
  // The same checks the contract applies, re-applied rather than restated, so
  // the edge and the application cannot disagree about what a valid Set is.
  .superRefine(refinePostingSetInput);

export const updatePostingSetSchema = postingSetPatchSchema.extend({
  connectionIds: z.array(connectionIdSchema).max(200).optional(),
  signatureId: signatureIdSchema.nullable().optional(),
});

export const listPostingSetsQuerySchema = cursorQueryWith({
  brandId: brandIdSchema.optional(),
  /** Archived Sets are hidden by default; the management screen can ask. */
  includeArchived: z.coerce.boolean().optional(),
});

export type CreatePostingSetInput = z.infer<typeof createPostingSetSchema>;
export type UpdatePostingSetInput = z.infer<typeof updatePostingSetSchema>;
export type ListPostingSetsQuery = z.infer<typeof listPostingSetsQuerySchema>;

export { postingSetViewSchema };
