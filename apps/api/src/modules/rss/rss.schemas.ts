import { z } from 'zod';

import { cursorQuerySchema } from '../../common/pagination';
import { brandIdSchema, feedIdSchema, ruleIdSchema, shortTextSchema } from '../../common/schemas';

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
    url: z.string().trim().min(1).max(2048),
    brandId: brandIdSchema,
    name: shortTextSchema,
    /** Which rule turns an item into a draft. Absent uses the default mapping. */
    ruleId: ruleIdSchema.optional(),
    /** How often we poll, in minutes. Bounded so a feed cannot be hammered. */
    pollIntervalMinutes: z.number().int().min(15).max(1440).default(60),
    /** Place produced drafts on the calendar. Approval still applies. */
    autoSchedule: z.boolean().default(false),
    /** Only items published after this instant are considered on first run. */
    backfillFrom: z.string().min(1).max(64).optional(),
  })
  .strict();

export const updateFeedSchema = createFeedSchema.partial().strict();

export const validateFeedSchema = z.object({ url: z.string().trim().min(1).max(2048) }).strict();

export const listFeedsQuerySchema = cursorQuerySchema;

export const feedParamsSchema = z.object({ id: feedIdSchema }).strict();

export type CreateFeedInput = z.infer<typeof createFeedSchema>;
