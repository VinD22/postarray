import {
  ianaTimeZoneSchema,
  isoInstantSchema,
  providerIdSchema,
  publishStateSchema,
  scheduleSpecSchema,
} from '@relay/contracts';
import { z } from 'zod';

import { cursorQueryWith } from '../../common/pagination.js';
import { requireEpochMillis } from '../../common/instant.js';
import {
  brandIdSchema,
  campaignIdSchema,
  connectionIdSchema,
  contentItemIdSchema,
  mediumTextSchema,
} from '../../common/schemas.js';

/**
 * Scheduling payloads.
 *
 * A schedule is an absolute instant plus the IANA zone the human actually chose
 * it in. Both are stored. Keeping the zone is what lets the calendar redraw
 * correctly after a daylight saving change, and what lets us tell a user "this
 * hour does not exist on that date in Europe/Berlin" instead of silently
 * shifting their post by an hour.
 */

export const scheduleRequestSchema = z
  .object({
    contentItemId: contentItemIdSchema,
    scheduleSpec: scheduleSpecSchema,
  })
  .strict();

export const rescheduleRequestSchema = z
  .object({
    scheduleSpec: scheduleSpecSchema,
    /**
     * Set by the client after the person acknowledged that the new local time
     * is ambiguous or does not exist because of a daylight saving transition.
     */
    confirmDst: z.boolean().optional(),
  })
  .strict();

export const cancelRequestSchema = z.object({ reason: mediumTextSchema }).strict();

export const calendarQuerySchema = cursorQueryWith({
  from: isoInstantSchema,
  to: isoInstantSchema,
  /** The zone the grid is drawn in. Required: there is no implicit local time. */
  ianaTimeZone: ianaTimeZoneSchema,
  brandId: brandIdSchema.optional(),
  campaignId: campaignIdSchema.optional(),
  connectionId: connectionIdSchema.optional(),
  provider: providerIdSchema.optional(),
  state: publishStateSchema.optional(),
}).refine((query) => requireEpochMillis(query.from) <= requireEpochMillis(query.to), {
  error: 'RANGE_INVERTED',
  path: ['to'],
});

export const nextSlotQuerySchema = z
  .object({
    brandId: brandIdSchema,
    after: isoInstantSchema.optional(),
  })
  .strict();

export type ScheduleRequestInput = z.infer<typeof scheduleRequestSchema>;
export type CalendarQueryInput = z.infer<typeof calendarQuerySchema>;
