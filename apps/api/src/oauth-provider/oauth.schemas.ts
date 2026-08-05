import { scopeSchema } from '@relay/contracts';
import { z } from 'zod';

import { brandIdSchema, connectionIdSchema, workspaceIdSchema } from '../common/schemas.js';
import { CODE_CHALLENGE_METHOD, isValidCodeChallenge, isValidCodeVerifier } from './pkce.js';

/**
 * OAuth 2.1 request shapes.
 *
 * What is missing is as deliberate as what is here. There is no implicit grant,
 * no resource owner password grant, no hybrid flow, and no client credentials
 * grant for third parties: a third party never acts without a user's grant.
 * Workspace-owned automation uses an API key or a service account, which is a
 * different credential with a different lifecycle and a different audit story.
 */

export const authorizeQuerySchema = z
  .object({
    response_type: z.literal('code'),
    client_id: z.string().trim().min(8).max(128),
    redirect_uri: z.string().trim().min(1).max(2048),
    scope: z.string().trim().min(1).max(2048),
    /** Required. At least 16 bytes of entropy from the client's perspective. */
    state: z.string().trim().min(8).max(1024),
    code_challenge: z.string().trim().refine(isValidCodeChallenge, {
      error: 'CODE_CHALLENGE_INVALID',
    }),
    /** `plain` is not accepted, so the literal is the only permitted value. */
    code_challenge_method: z.literal(CODE_CHALLENGE_METHOD),
    /** The resource the token is being requested for. Bound into the token. */
    resource: z.string().trim().min(1).max(512).optional(),
    prompt: z.enum(['none', 'consent']).optional(),
  })
  .strict();
export type AuthorizeQuery = z.infer<typeof authorizeQuerySchema>;

/**
 * The consent decision.
 *
 * `state` protects the client. The single-use nonce below protects us: it is
 * bound to the pending authorization request and to the browser that started
 * it, so a consent POST cannot be forged from another page.
 */
export const consentDecisionSchema = z
  .object({
    requestId: z.string().trim().min(16).max(256),
    consentNonce: z.string().trim().min(16).max(128),
    decision: z.enum(['approve', 'deny']),
    /** Exactly one workspace. Never a list. */
    workspaceId: workspaceIdSchema,
    /** Narrowing only. Empty means "every brand in that workspace". */
    brandIds: z.array(brandIdSchema).max(200).default([]),
    connectionIds: z.array(connectionIdSchema).max(200).default([]),
    /** The subset of the requested scopes the user actually agreed to. */
    grantedScopes: z.array(scopeSchema).max(32).default([]),
    /** Hash of the exact consent copy the user was shown. Stored with the grant. */
    consentVersionHash: z.string().regex(/^[0-9a-f]{64}$/),
  })
  .strict();
export type ConsentDecision = z.infer<typeof consentDecisionSchema>;

const authorizationCodeGrantSchema = z
  .object({
    grant_type: z.literal('authorization_code'),
    code: z.string().trim().min(16).max(512),
    redirect_uri: z.string().trim().min(1).max(2048),
    client_id: z.string().trim().min(8).max(128),
    client_secret: z.string().trim().min(16).max(512).optional(),
    code_verifier: z.string().trim().refine(isValidCodeVerifier, {
      error: 'CODE_VERIFIER_INVALID',
    }),
  })
  .strict();

const refreshTokenGrantSchema = z
  .object({
    grant_type: z.literal('refresh_token'),
    refresh_token: z.string().trim().min(16).max(512),
    client_id: z.string().trim().min(8).max(128),
    client_secret: z.string().trim().min(16).max(512).optional(),
    /** A refresh may narrow the scope set. It may never widen it. */
    scope: z.string().trim().max(2048).optional(),
  })
  .strict();

export const tokenRequestSchema = z.discriminatedUnion('grant_type', [
  authorizationCodeGrantSchema,
  refreshTokenGrantSchema,
]);
export type TokenRequest = z.infer<typeof tokenRequestSchema>;

export const revocationRequestSchema = z
  .object({
    token: z.string().trim().min(16).max(512),
    token_type_hint: z.enum(['access_token', 'refresh_token']).optional(),
    client_id: z.string().trim().min(8).max(128),
    client_secret: z.string().trim().min(16).max(512).optional(),
  })
  .strict();

export const introspectionRequestSchema = z
  .object({
    token: z.string().trim().min(16).max(512),
    token_type_hint: z.enum(['access_token', 'refresh_token']).optional(),
    client_id: z.string().trim().min(8).max(128),
    /** Introspection is offered to confidential clients only, for own tokens. */
    client_secret: z.string().trim().min(16).max(512),
  })
  .strict();

export interface TokenResponse {
  readonly access_token: string;
  readonly token_type: 'Bearer';
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly scope: string;
}
