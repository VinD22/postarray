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
    redirectTo: z.string().min(1).max(2048),
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

/**
 * Connect with a provider-issued secret.
 *
 * Bluesky is the only provider whose official programmatic credential is an app
 * password rather than an authorization code, so `provider` is a literal rather
 * than the provider enum: widening it would be claiming a flow we have not
 * built. The app password is exchanged once for a session and never stored, and
 * it is never echoed back in any response.
 */
export const connectWithProviderSecretSchema = z
  .object({
    provider: z.literal('bluesky'),
    /** A handle, a DID or an email. The provider decides which it recognizes. */
    identifier: z.string().trim().min(1).max(253),
    appPassword: z.string().min(1).max(256),
  })
  .strict();

export const callbackParamsSchema = z.object({ provider: providerIdSchema }).strict();
export const oauthPendingParamsSchema = z
  .object({ transactionId: z.string().min(1).max(128) })
  .strict();
export const oauthClaimSchema = z
  .object({
    transactionId: z.string().min(1).max(128),
    selectedExternalAccountIds: z.array(z.string().min(1).max(512)).min(1).max(10),
  })
  .strict();

export const listDestinationsQuerySchema = z
  .object({
    kind: destinationKindSchema,
    query: shortTextSchema.optional(),
  })
  .strict();

export const searchMentionsQuerySchema = z.object({ query: shortTextSchema }).strict();

export type BeginOAuthInput = z.infer<typeof beginOAuthSchema>;
export type ConnectWithProviderSecretInput = z.infer<typeof connectWithProviderSecretSchema>;
export type ListConnectionsQuery = z.infer<typeof listConnectionsQuerySchema>;
