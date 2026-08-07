import { isoInstantSchema, utmParametersSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQuerySchema, timeRangeSchema } from '../../common/pagination';
import { campaignIdSchema, shortLinkIdSchema } from '../../common/schemas';

/**
 * Short link payloads.
 *
 * The redirect service itself is a separate app on a separate registrable
 * domain, so a session cookie is never sent to something that emits 302s to
 * attacker-influenced destinations. This module only manages the records.
 *
 * A destination is checked before the link is created: scheme allowlist,
 * private network denial, redirect chain depth, and reputation where lawful.
 * The user is always shown the exact destination, because a shortener the user
 * cannot inspect is a phishing tool.
 */
export const createShortLinkSchema = z
  .object({
    destinationUrl: z.string().trim().min(1).max(2048),
    campaignId: campaignIdSchema.optional(),
    /** A verified branded domain. Absent uses the default isolated domain. */
    domainId: z.string().trim().min(1).max(128).optional(),
    slug: z
      .string()
      .regex(/^[A-Za-z0-9][A-Za-z0-9_-]{3,63}$/)
      .optional(),
    utm: utmParametersSchema.optional(),
    expiresAt: isoInstantSchema.optional(),
  })
  .strict();

export const updateShortLinkDestinationSchema = z
  .object({
    destinationUrl: z.string().trim().min(1).max(2048),
    reason: z.string().trim().min(1).max(500),
  })
  .strict();

export const setShortLinkEnabledSchema = z
  .object({ enabled: z.boolean(), reason: z.string().trim().max(500).default('') })
  .strict();

export const listShortLinksQuerySchema = cursorQuerySchema;

export const shortLinkStatsQuerySchema = timeRangeSchema;

export const shortLinkParamsSchema = z.object({ id: shortLinkIdSchema }).strict();

export type CreateShortLinkInput = z.infer<typeof createShortLinkSchema>;
export type UpdateShortLinkDestinationInput = z.infer<typeof updateShortLinkDestinationSchema>;
export type SetShortLinkEnabledInput = z.infer<typeof setShortLinkEnabledSchema>;
