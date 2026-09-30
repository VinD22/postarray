import { z } from 'zod';

/**
 * RFC 7591 client metadata, as a registering client sends it.
 *
 * Only public clients register themselves here, so the only accepted
 * authentication method is `none` and PKCE with S256 is enforced at
 * `/oauth/authorize` as it is for every client. Unknown members are stripped,
 * as the RFC requires a server to ignore metadata it does not understand, and
 * every value is length capped so a registration cannot be used to park
 * arbitrary data in the directory.
 */

/** The whole registration document, serialized. Claude sends well under 1 KB. */
export const MAX_REGISTRATION_BYTES = 8 * 1024;

const optionalUri = z.string().trim().max(2048).optional();

export const clientRegistrationRequestSchema = z.object({
  redirect_uris: z.array(z.string().trim().min(1).max(2048)).min(1).max(5),
  client_name: z.string().trim().min(1).max(120).optional(),
  token_endpoint_auth_method: z.string().trim().max(64).optional(),
  grant_types: z.array(z.string().trim().max(64)).max(4).optional(),
  response_types: z.array(z.string().trim().max(64)).max(4).optional(),
  scope: z.string().trim().max(2048).optional(),
  // Accepted and ignored: none of these are shown to anyone, because none of
  // them has been verified.
  client_uri: optionalUri,
  logo_uri: optionalUri,
  tos_uri: optionalUri,
  policy_uri: optionalUri,
  contacts: z.array(z.string().trim().max(320)).max(5).optional(),
  software_id: z.string().trim().max(255).optional(),
  software_version: z.string().trim().max(64).optional(),
});
export type ClientRegistrationRequest = z.infer<typeof clientRegistrationRequestSchema>;

export const SUPPORTED_GRANT_TYPES = ['authorization_code', 'refresh_token'] as const;
export const SUPPORTED_RESPONSE_TYPES = ['code'] as const;

export interface ClientRegistrationResponse {
  readonly client_id: string;
  readonly client_id_issued_at: number;
  readonly client_name: string;
  readonly redirect_uris: readonly string[];
  readonly grant_types: readonly string[];
  readonly response_types: readonly string[];
  readonly token_endpoint_auth_method: 'none';
  readonly scope: string;
}
