import { z } from 'zod';

import { contentItemIdSchema, postVariantIdSchema } from '../../common/schemas';

/**
 * Immediate publish.
 *
 * Level 3 on the autonomy ladder is "may publish immediately", and even at
 * level 3 some actions always escalate to an explicit human confirmation:
 * more than five external publications in one request, substantially similar
 * content to more than three accounts, a connection or link domain used for the
 * first time, commercial, political or otherwise sensitive content, a privacy
 * change, or content edited after approval
 * (`04-auth-oauth-and-security.md`, section 10.3).
 *
 * The confirmation below is *evidence that a human was shown the blast radius
 * and agreed to it*. It is checked against the server's own count in
 * `@relay/application`: a client that claims two accounts when the job targets
 * nine is refused. The server never trusts that a host UI displayed a dialog,
 * because that is not a fact we can observe.
 */
export const publishConfirmationSchema = z
  .object({
    /** How many external publications the human was told this would create. */
    acknowledgedTargetCount: z.number().int().nonnegative().max(1000),
    /** The exact content version hash the human saw. */
    acknowledgedVersionChecksum: z.string().regex(/^[0-9a-f]{64}$/),
    /** Set when the human confirmed each named escalation trigger. */
    acknowledgedEscalations: z.array(z.string().min(1).max(64)).max(32).default([]),
  })
  .strict();

export const publishNowSchema = z
  .object({
    contentItemId: contentItemIdSchema,
    confirmation: publishConfirmationSchema,
  })
  .strict();

export const retryTargetSchema = z.object({ targetId: postVariantIdSchema }).strict();

export type PublishNowInput = z.infer<typeof publishNowSchema>;
