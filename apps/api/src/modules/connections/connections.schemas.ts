import { destinationKindSchema, providerIdSchema } from '@relay/contracts';
import { z } from 'zod';

import { cursorQueryWith } from '../../common/pagination';
import { brandIdSchema, shortTextSchema } from '../../common/schemas';

/** Connection listing, OAuth handshake and provider lookup payloads. */

export const listConnectionsQuerySchema = cursorQueryWith({
  brandId: brandIdSchema.optional(),
  provider: providerIdSchema.optional(),
});

export const beginOAuthSchema = z
  .object({
    provider: providerIdSchema,
    brandId: brandIdSchema,
    /**
     * Where to send the browser when the handshake finishes. Validated against
     * the configured app origin at the callback, never followed blindly: an
     * unchecked return path is an open redirect with a fresh session attached.
     */
    redirectTo: z.string().min(1).max(2048).optional(),
  })
  .strict();

/**
 * The provider callback. `code` and `state` arrive in the query string because
 * that is what the authorization code flow specifies. Neither is a Relay
 * credential, and neither is trusted until `state` matches both the stored
 * transaction and the cookie set on this browser.
 */
export const oauthCallbackQuerySchema = z
  .object({
    code: z.string().min(1).max(4096).optional(),
    state: z.string().min(1).max(512).optional(),
    error: z.string().min(1).max(256).optional(),
    error_description: z.string().min(1).max(1024).optional(),
  })
  .loose();

export const callbackParamsSchema = z.object({ provider: providerIdSchema }).strict();

export const listDestinationsQuerySchema = z
  .object({
    kind: destinationKindSchema,
    query: shortTextSchema.optional(),
  })
  .strict();

export const searchMentionsQuerySchema = z.object({ query: shortTextSchema }).strict();

export type BeginOAuthInput = z.infer<typeof beginOAuthSchema>;
