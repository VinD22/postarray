import {
  ID_PREFIXES,
  approvalLevelSchema,
  idSchema,
  isoInstantSchema,
  localeSchema,
  scopeSchema,
} from '@relay/contracts';
import { z } from 'zod';

/**
 * The credential records the edge stores and reads.
 *
 * Every one of these is parsed with zod on the way out of the key value store.
 * A record read back from Redis is external input: the process that wrote it
 * may have been an older deploy, and a store an attacker can write to is a
 * store that can forge a session. Parse, never cast.
 */

const workspaceId = idSchema(ID_PREFIXES.workspace);
const userId = idSchema(ID_PREFIXES.user);
const scopes = z.array(scopeSchema).max(64);

/** A signed-in browser session. Carries an identity, never a workspace. */
export const sessionRecordSchema = z
  .object({
    sessionId: z.string().min(16).max(256),
    userId,
    emailVerified: z.boolean(),
    locale: localeSchema,
    /** Instant of the most recent second factor or password re-entry. */
    mfaSatisfiedAt: isoInstantSchema.nullable(),
    /** Workspaces the identity is currently a member of. */
    workspaceIds: z.array(workspaceId).max(200),
    /** Effective scopes per workspace, from the live membership role. */
    scopesByWorkspace: z.record(z.string(), scopes),
    approvalLevel: approvalLevelSchema,
    refreshFamilyId: z.string().min(8).max(128),
    /** Coarse client fingerprint. A mismatch forces reauthentication. */
    clientFingerprint: z.string().min(8).max(128),
    /** The identity provider's own access token id, for provider sign-out. */
    providerSessionId: z.string().min(1).max(512).nullable(),
    csrfSecret: z.string().min(16).max(128),
    createdAt: isoInstantSchema,
    lastSeenAt: isoInstantSchema,
    absoluteExpiresAt: isoInstantSchema,
  })
  .strict();
export type SessionRecord = z.infer<typeof sessionRecordSchema>;

/** A workspace-owned bearer credential. Not for third parties. */
export const apiKeyRecordSchema = z
  .object({
    apiKeyId: idSchema(ID_PREFIXES.apiKey),
    workspaceId,
    createdByUserId: userId,
    name: z.string().min(1).max(120),
    publicPrefix: z.string().length(8),
    secretHash: z.string().regex(/^[0-9a-f]{64}$/),
    scopes,
    approvalLevel: approvalLevelSchema,
    /** Narrowing only. An empty array means "no narrowing", not "none allowed". */
    brandIds: z.array(idSchema(ID_PREFIXES.brand)).max(200),
    connectionIds: z.array(idSchema(ID_PREFIXES.connection)).max(200),
    /** Optional source restriction, as CIDR blocks. */
    ipAllowlist: z.array(z.string().min(7).max(43)).max(20),
    /** Required. There is no "never expires" option. */
    expiresAt: isoInstantSchema,
    revokedAt: isoInstantSchema.nullable(),
    createdAt: isoInstantSchema,
  })
  .strict();
export type ApiKeyRecord = z.infer<typeof apiKeyRecordSchema>;

/**
 * An opaque reference access token. Not a JWT: a self-contained token cannot be
 * revoked before it expires, and revocation within seconds is the entire point
 * of the grant screen.
 */
export const accessTokenRecordSchema = z
  .object({
    grantId: idSchema(ID_PREFIXES.oauthGrant),
    clientId: z.string().min(8).max(128),
    subjectUserId: userId,
    workspaceId,
    scopes,
    approvalLevel: approvalLevelSchema,
    brandIds: z.array(idSchema(ID_PREFIXES.brand)).max(200),
    connectionIds: z.array(idSchema(ID_PREFIXES.connection)).max(200),
    /**
     * The resource identifier this token was minted for. Verified on every
     * request. This is the confused-deputy defence.
     */
    audience: z.string().min(1).max(512),
    locale: localeSchema,
    issuedAt: isoInstantSchema,
    expiresAt: isoInstantSchema,
  })
  .strict();
export type AccessTokenRecord = z.infer<typeof accessTokenRecordSchema>;

/** One rotating refresh token inside a family. Single use, always. */
export const refreshTokenRecordSchema = z
  .object({
    familyId: z.string().min(8).max(128),
    grantId: idSchema(ID_PREFIXES.oauthGrant),
    clientId: z.string().min(8).max(128),
    subjectUserId: userId,
    workspaceId,
    scopes,
    audience: z.string().min(1).max(512),
    issuedAt: isoInstantSchema,
    expiresAt: isoInstantSchema,
    /** Hard cap independent of sliding renewal. */
    absoluteExpiresAt: isoInstantSchema,
    consumedAt: isoInstantSchema.nullable(),
  })
  .strict();
export type RefreshTokenRecord = z.infer<typeof refreshTokenRecordSchema>;

/**
 * A rotating refresh token for a web session.
 *
 * Separate from the OAuth refresh record because a browser session has no
 * client, no grant and no workspace: it carries an identity. Sharing one shape
 * would mean inventing values for three fields that do not apply, and invented
 * values are what later reads mistake for facts.
 */
export const sessionRefreshRecordSchema = z
  .object({
    familyId: z.string().min(8).max(128),
    sessionId: z.string().min(16).max(256),
    userId,
    clientFingerprint: z.string().min(8).max(128),
    issuedAt: isoInstantSchema,
    expiresAt: isoInstantSchema,
    /** Hard cap independent of sliding renewal. */
    absoluteExpiresAt: isoInstantSchema,
    consumedAt: isoInstantSchema.nullable(),
  })
  .strict();
export type SessionRefreshRecord = z.infer<typeof sessionRefreshRecordSchema>;

/** Authorization code. 60 seconds, single use, bound to client and PKCE. */
export const authorizationCodeRecordSchema = z
  .object({
    clientId: z.string().min(8).max(128),
    redirectUri: z.string().min(1).max(2048),
    codeChallenge: z.string().min(43).max(128),
    codeChallengeMethod: z.literal('S256'),
    scopes,
    subjectUserId: userId,
    workspaceId,
    brandIds: z.array(idSchema(ID_PREFIXES.brand)).max(200),
    connectionIds: z.array(idSchema(ID_PREFIXES.connection)).max(200),
    approvalLevel: approvalLevelSchema,
    audience: z.string().min(1).max(512),
    consentVersionHash: z.string().regex(/^[0-9a-f]{64}$/),
    locale: localeSchema,
    issuedAt: isoInstantSchema,
    expiresAt: isoInstantSchema,
    /** Set on first exchange. A second presentation is a replay. */
    consumedAt: isoInstantSchema.nullable(),
    /** Tokens minted from this code, revoked together on replay. */
    issuedTokenHashes: z.array(z.string().regex(/^[0-9a-f]{64}$/)).max(8),
  })
  .strict();
export type AuthorizationCodeRecord = z.infer<typeof authorizationCodeRecordSchema>;

/** A registered developer application. */
export const oauthClientRecordSchema = z
  .object({
    clientId: z.string().min(8).max(128),
    appId: idSchema(ID_PREFIXES.oauthClient),
    workspaceId,
    name: z.string().min(1).max(120),
    clientType: z.enum(['public', 'confidential']),
    /** Present only for confidential clients. Keyed digest, never plaintext. */
    secretHash: z
      .string()
      .regex(/^[0-9a-f]{64}$/)
      .nullable(),
    /** Second live secret during a 24 hour rotation overlap. */
    previousSecretHash: z
      .string()
      .regex(/^[0-9a-f]{64}$/)
      .nullable(),
    previousSecretExpiresAt: isoInstantSchema.nullable(),
    /** Exact match only. No wildcard, no prefix, no subdomain tolerance. */
    redirectUris: z.array(z.string().min(1).max(2048)).min(1).max(5),
    homepageUrl: z.string().min(1).max(2048),
    privacyPolicyUrl: z.string().min(1).max(2048),
    termsUrl: z.string().min(1).max(2048),
    logoUrl: z.string().min(1).max(2048).nullable(),
    supportEmail: z.string().min(3).max(320),
    /** The maximum set the client may ever request. */
    allowedScopes: scopes,
    /** First party clients (our CLI) may use the device authorization grant. */
    firstParty: z.boolean(),
    disabledAt: isoInstantSchema.nullable(),
    createdAt: isoInstantSchema,
  })
  .strict();
export type OAuthClientRecord = z.infer<typeof oauthClientRecordSchema>;

/** A pending authorization request, held between `/authorize` and consent. */
export const authorizationRequestRecordSchema = z
  .object({
    requestId: z.string().min(16).max(256),
    clientId: z.string().min(8).max(128),
    redirectUri: z.string().min(1).max(2048),
    state: z.string().min(1).max(1024).nullable(),
    codeChallenge: z.string().min(43).max(128),
    codeChallengeMethod: z.literal('S256'),
    requestedScopes: scopes,
    resource: z.string().min(1).max(512).nullable(),
    /** Single-use anti-CSRF nonce bound to this request, checked on consent. */
    consentNonce: z.string().min(16).max(128),
    subjectUserId: userId,
    createdAt: isoInstantSchema,
    expiresAt: isoInstantSchema,
  })
  .strict();
export type AuthorizationRequestRecord = z.infer<typeof authorizationRequestRecordSchema>;

/** A stored response, replayed when an idempotency key is presented again. */
export const idempotencyRecordSchema = z
  .object({
    key: z.string().min(8).max(255),
    workspaceId,
    route: z.string().min(1).max(256),
    requestHash: z.string().regex(/^[0-9a-f]{64}$/),
    status: z.number().int().min(100).max(599),
    /** JSON body as stored. Replayed byte for byte. */
    body: z.string().max(1_000_000),
    createdAt: isoInstantSchema,
  })
  .strict();
export type StoredIdempotencyRecord = z.infer<typeof idempotencyRecordSchema>;

/** Dedupe entry for an inbound signed webhook, keyed by provider event id. */
export const inboundWebhookRecordSchema = z
  .object({
    eventId: z.string().min(1).max(256),
    source: z.string().min(1).max(64),
    bodyHash: z.string().regex(/^[0-9a-f]{64}$/),
    receivedAt: isoInstantSchema,
    result: z.enum(['processed', 'duplicate', 'rejected']),
  })
  .strict();
export type InboundWebhookRecord = z.infer<typeof inboundWebhookRecordSchema>;
