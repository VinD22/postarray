import {
  ianaTimeZoneSchema,
  isoInstantSchema,
  providerIdSchema,
  publishStateSchema,
  scheduleSpecSchema,
} from '@relay/contracts';
import { z } from 'zod';

import { cursorQueryWith } from '../../common/pagination';
import { requireEpochMillis } from '../../common/instant';
import {
  brandIdSchema,
  campaignIdSchema,
  connectionIdSchema,
  contentItemIdSchema,
  mediumTextSchema,
} from '../../common/schemas';

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

/**
 * Holding a scheduled job.
 *
 * There is no reason code here on purpose. A pause is reversible and retracts
 * nothing, so it does not need the justification a cancel does; the optional
 * note exists only so the audit trail can carry what the person typed.
 */
export const pauseRequestSchema = z
  .object({ note: z.string().min(1).max(280).optional() })
  .strict();

/**
 * Releasing a held job.
 *
 * `scheduleSpec` is optional at the edge and required by the application once
 * the original instant has passed. Enforcing it here instead would mean the
 * edge deciding what "has passed" means, which is a clock question the
 * application already owns. `confirmDst` behaves exactly as it does on
 * reschedule, because a resume that carries a new time is a reschedule.
 */
export const resumeRequestSchema = z
  .object({
    scheduleSpec: scheduleSpecSchema.optional(),
    confirmDst: z.boolean().optional(),
  })
  .strict();

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
export type PauseRequestInput = z.infer<typeof pauseRequestSchema>;
export type ResumeRequestInput = z.infer<typeof resumeRequestSchema>;
export type RescheduleRequestInput = z.infer<typeof rescheduleRequestSchema>;
export type CalendarQueryInput = z.infer<typeof calendarQuerySchema>;
