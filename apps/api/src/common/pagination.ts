import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  cursorSchema,
  ianaTimeZoneSchema,
  isoInstantSchema,
} from '@relay/contracts';
import { z } from 'zod';

import { requireEpochMillis } from './instant';

/**
 * Cursor pagination and explicit time zones, on every list endpoint without
 * exception.
 *
 * Offset pagination is not offered: with concurrent writes it silently skips
 * and repeats rows, which for a publishing calendar means a post a user never
 * sees. A naive local time is not accepted anywhere either: a range is an
 * instant pair plus the IANA zone the human meant, so a query written in Berlin
 * still means the same window when it is executed in Virginia.
 */

export const cursorQuerySchema = z
  .object({
    cursor: cursorSchema.optional(),
    limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  })
  .strict();
export type CursorQueryInput = z.infer<typeof cursorQuerySchema>;

/**
 * An explicit, zone-qualified window. Both bounds are absolute instants, and
 * the zone is the one the human was looking at, not the server's.
 */
export const timeRangeShape = {
  from: isoInstantSchema,
  to: isoInstantSchema,
  ianaTimeZone: ianaTimeZoneSchema,
} as const;

export const timeRangeSchema = z
  .object(timeRangeShape)
  .strict()
  .refine((range) => requireEpochMillis(range.from) <= requireEpochMillis(range.to), {
    error: 'RANGE_INVERTED',
    path: ['to'],
  });
export type TimeRangeInput = z.infer<typeof timeRangeSchema>;

/** Extend the standard cursor query with route-specific filters. */
export function cursorQueryWith<T extends z.ZodRawShape>(
  shape: T,
): z.ZodObject<T & typeof cursorQuerySchema.shape> {
  return cursorQuerySchema.extend(shape);
}

export const MAX_LIST_LIMIT = MAX_PAGE_SIZE;
export const DEFAULT_LIST_LIMIT = DEFAULT_PAGE_SIZE;
