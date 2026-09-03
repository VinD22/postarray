import { REALTIME_EVENT_TYPES, realtimeEventIdSchema } from '@relay/contracts';
import { z } from 'zod';

/**
 * What a client may ask of the stream.
 *
 * Both endpoints take the same two questions, "what have I missed" and "which
 * kinds do I care about", so they share one schema. Neither takes a workspace:
 * that comes from the pinned actor context, exactly as it does on every other
 * route, and accepting it here would be a second way to name a tenant.
 */

/** A single type, or a comma-separated list, as a query string carries it. */
const typeFilterSchema = z
  .string()
  .transform((value) => value.split(',').map((part) => part.trim()))
  .pipe(z.array(z.enum(REALTIME_EVENT_TYPES)).min(1).max(REALTIME_EVENT_TYPES.length));

export const eventStreamQuerySchema = z
  .object({
    /**
     * The last id the client holds. `Last-Event-ID` is the header form a
     * browser sends automatically; this is the form everything else uses.
     */
    since: realtimeEventIdSchema.optional(),
    type: typeFilterSchema.optional(),
  })
  .strict();

export type EventStreamQuery = z.infer<typeof eventStreamQuerySchema>;

export const recentEventsQuerySchema = eventStreamQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(500).default(100),
});

export type RecentEventsQuery = z.infer<typeof recentEventsQuerySchema>;
