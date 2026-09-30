import { z } from 'zod';

/**
 * The OAuth token introspection contract (RFC 7662) between Post Array's
 * authorization server and its resource servers.
 *
 * The API answers `/oauth/introspect` with this shape and the MCP server parses
 * it with the same schema, so a field one side stops sending is a test failure
 * on the other side rather than a production outage that reads as "every token
 * is inactive".
 *
 * `resource` names the resource server asking. When present the token is
 * answered as active only if its audience is exactly that resource, which keeps
 * a token minted for the REST API from being replayed at the MCP server.
 */

export const oauthIntrospectionRequestSchema = z
  .object({
    token: z.string().trim().min(16).max(512),
    token_type_hint: z.enum(['access_token', 'refresh_token']).optional(),
    client_id: z.string().trim().min(8).max(128),
    /** Introspection is offered to confidential clients only. */
    client_secret: z.string().trim().min(16).max(512),
    /** RFC 8707 resource indicator of the resource server asking. */
    resource: z.string().trim().min(1).max(512).optional(),
  })
  .strict();
export type OAuthIntrospectionRequest = z.infer<typeof oauthIntrospectionRequestSchema>;

/**
 * The introspection answer.
 *
 * Unknown members are stripped rather than rejected so the authorization server
 * can add a field without breaking a resource server that has not deployed yet.
 * `approval_level` stays a string here on purpose: the consumer maps an unknown
 * value to the least privileged level instead of failing the whole response.
 */
export const oauthIntrospectionResponseSchema = z
  .object({
    active: z.boolean(),
    scope: z.string().max(4096).optional(),
    client_id: z.string().min(1).max(128).optional(),
    /** The granting user. */
    sub: z.string().min(1).max(128).optional(),
    aud: z.union([z.string().min(1), z.array(z.string().min(1))]).optional(),
    iss: z.string().min(1).optional(),
    token_type: z.string().min(1).optional(),
    exp: z.number().int().optional(),
    iat: z.number().int().optional(),
    /** The durable consent record the token was minted under. */
    grant_id: z.string().min(1).max(128).optional(),
    /** Exactly one workspace. A grant never spans two. */
    workspace_id: z.string().min(1).max(128).optional(),
    approval_level: z.string().min(1).max(64).optional(),
    locale: z.string().min(1).max(35).optional(),
    /** True when the grant was switched off. A killed grant is never active. */
    killed: z.boolean().optional(),
  })
  .strip();
export type OAuthIntrospectionResponse = z.infer<typeof oauthIntrospectionResponseSchema>;

/** The only answer an unknown, expired, foreign or wrong-audience token gets. */
export const INACTIVE_INTROSPECTION: OAuthIntrospectionResponse = Object.freeze({ active: false });
