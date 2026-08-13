import { z } from 'zod';

import { contentItemIdSchema } from '../../common/schemas';

/**
 * Weekly digest payloads.
 *
 * Two boundaries this module holds.
 *
 * First, generation is asynchronous and returns an operation handle. The digest
 * retrieves, may call a model, and audits the result; that is not something a
 * client should hold an HTTP connection open for, because a timeout would then
 * look exactly like a failure.
 *
 * Second, a window is a calendar date pair, never a fuzzy phrase. `2026-08-03`
 * is a request for one specific week and is idempotent; "last week" would mean
 * something different depending on when the request arrived.
 */

/** `YYYY-MM-DD`. The digest window is a date, not an instant. */
export const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'INVALID_DATE' });

export const generateDigestSchema = z
  .object({
    /**
     * Inclusive start of the seven day window. Omitted means the most recently
     * completed week, resolved by the service against the workspace's zone.
     */
    windowStart: isoDateSchema.optional(),
    /**
     * Rebuild a window that already has a digest. Default false, so a repeated
     * request is a no-op rather than a second digest for the same week.
     */
    replaceExisting: z.boolean().default(false),
  })
  .strict();
export type GenerateDigestInput = z.infer<typeof generateDigestSchema>;

export const listInsightsQuerySchema = z
  .object({
    contentItemId: contentItemIdSchema.optional(),
  })
  .strict();
export type ListInsightsQuery = z.infer<typeof listInsightsQuerySchema>;
