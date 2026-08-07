import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';
import {
  brandIdSchema,
  connectionIdSchema,
  feedIdSchema,
  shortTextSchema,
} from '../../common/schemas';

/**
 * RSS and Atom feed payloads.
 *
 * A feed is fetched through the one SSRF-safe fetch in `@relay/application`.
 * Nothing here follows a URL, and nothing here parses feed markup: an item
 * description is attacker-controlled HTML from a third party, and it is
 * sanitized server side before it is ever rendered or handed to a model.
 *
 * A feed never publishes on its own. It produces drafts, and those drafts go
 * through the same validation, cadence and approval policy as anything a person
 * typed. `autoSchedule` is a request to place a draft on the calendar, not a
 * bypass of review.
 */
export const createFeedSchema = z
  .object({
    brandId: brandIdSchema,
    title: shortTextSchema,
    feedUrl: z.string().trim().url().max(2048),
    connectionIds: z.array(connectionIdSchema).max(200).optional(),
    publishPolicy: z.enum(['draft', 'approval']).optional(),
    /** Bounded so a feed cannot be hammered or accidentally disabled for days. */
    pollIntervalSeconds: z.number().int().min(900).max(86_400).optional(),
  })
  .strict();

export const updateFeedSchema = createFeedSchema
  .pick({ title: true, connectionIds: true, publishPolicy: true, pollIntervalSeconds: true })
  .partial()
  .extend({ paused: z.boolean().optional() })
  .strict();

export const validateFeedSchema = z.object({ url: z.string().trim().min(1).max(2048) }).strict();

export const listFeedsQuerySchema = cursorQuerySchema;

export const feedParamsSchema = z.object({ id: feedIdSchema }).strict();

export type CreateFeedInput = z.infer<typeof createFeedSchema>;
export type UpdateFeedInput = z.infer<typeof updateFeedSchema>;
