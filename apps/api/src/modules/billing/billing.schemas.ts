import { z } from 'zod';

import { timeRangeShape } from '../../common/pagination.js';

/**
 * Billing payloads.
 *
 * One public plan, two intervals. There are no feature tiers, so there is no
 * plan identifier in these requests, only the interval the customer chose.
 *
 * The checkout success redirect grants nothing. Entitlements come only from
 * verified Polar webhook state plus periodic reconciliation, and until the
 * webhook lands the UI says "Setting up your workspace" rather than pretending.
 * A client that believes a redirect is proof of payment is a client that can be
 * upgraded by editing a URL.
 */

export const createCheckoutSchema = z
  .object({
    interval: z.enum(['monthly', 'annual']),
    /** Must be on the configured app origin. Validated in the controller. */
    successUrl: z.string().trim().min(1).max(2048),
  })
  .strict();

export const createPortalLinkSchema = z
  .object({ returnUrl: z.string().trim().min(1).max(2048) })
  .strict();

export const usageQuerySchema = z.object(timeRangeShape).partial().strict();

/**
 * The Polar webhook envelope.
 *
 * Parsed only after the signature has been verified over the raw bytes. The
 * shape is deliberately permissive about `data`: the event body is Polar's, and
 * re-declaring their entire schema here would break the moment they add a
 * field. What we do assert is the identity of the event, which is what
 * deduplication and the inbox record need.
 */
export const polarWebhookSchema = z
  .object({
    type: z.string().min(1).max(128),
    data: z.record(z.string(), z.unknown()),
  })
  .loose();

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
