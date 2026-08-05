import { Inject, Injectable } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import {
  ForbiddenError,
  ValidationFailedError,
  newIdFor,
  normalizeScopes,
  scopeStringSchema,
  type Scope,
} from '@relay/contracts';
import type { Logger } from '@relay/observability';

import type { Clock, Services } from '../application/port';
import { CLOCK, LOGGER, RELAY_CONFIG, SERVICES } from '../application/tokens';
import { instantAfter, requireEpochMillis } from '../common/instant';
import { CredentialDirectory, tokenLookupHash } from '../security/credential-directory';
import {
  CREDENTIAL_PREFIXES,
  constantTimeEquals,
  randomBase62,
  randomToken,
  secretMatches,
} from '../security/credentials';
import {
  authorizationCodeRecordSchema,
  authorizationRequestRecordSchema,
  type AuthorizationCodeRecord,
  type OAuthClientRecord,
} from '../security/records';
import { resolveRedirectUri, verifyCodeVerifier } from './pkce';
import type { AuthorizeQuery, ConsentDecision, TokenRequest, TokenResponse } from './oauth.schemas';

/**
 * Relay's own OAuth 2.1 authorization server.
 *
 * Lifetimes, from section 7.4 of the security plan: a 60 second single-use
 * authorization code, a 30 minute opaque reference access token, and a 30 day
 * sliding refresh token with a 60 day absolute cap and mandatory rotation.
 *
 * Access tokens are opaque references, not JWTs. A self-contained token cannot
 * be revoked before it expires, and "revoke this app" taking effect within
 * seconds is the entire point of the grant screen. The cost is one lookup per
 * request, which is the right trade for a product that holds publishing rights
 * over other people's brands.
 */

export const AUTHORIZATION_CODE_TTL_SECONDS = 60;
export const ACCESS_TOKEN_TTL_SECONDS = 30 * 60;
export const REFRESH_SLIDING_TTL_SECONDS = 30 * 24 * 60 * 60;
export const REFRESH_ABSOLUTE_TTL_SECONDS = 60 * 24 * 60 * 60;
export const AUTHORIZATION_REQUEST_TTL_SECONDS = 15 * 60;

/**
 * Scopes a third-party application may never hold, whatever it asks for and
 * whatever the user clicks. A third party cannot take money actions and cannot
 * mint new credentials (`04-auth-oauth-and-security.md`, section 10.1).
 */
export const THIRD_PARTY_FORBIDDEN_SCOPES: readonly Scope[] = ['connections:admin'];

export interface PendingAuthorization {
  readonly requestId: string;
  readonly consentNonce: string;
  readonly client: OAuthClientRecord;
  readonly redirectUri: string;
  readonly requestedScopes: readonly Scope[];
  readonly state: string;
}

@Injectable()
export class OAuthProviderService {
  constructor(
    @Inject(SERVICES) private readonly services: Services,
    @Inject(CLOCK) private readonly clock: Clock,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly directory: CredentialDirectory,
  ) {}

  get issuer(): string {
    return this.config.oauth.issuerUrl ?? this.config.core.apiUrl ?? 'urn:relay:issuer';
  }

  /** The resource identifier this server mints tokens for by default. */
  get defaultAudience(): string {
    return this.config.core.apiUrl ?? 'urn:relay:api';
  }

  /**
   * Validate an authorization request and stage it for the consent screen.
   *
   * Everything that could redirect a browser somewhere is checked before
   * anything is stored: the client must exist and be enabled, and the redirect
   * URI must match one of its registered values exactly. Only after both hold
   * is it safe to redirect at all, which is why an unknown client or an
   * unmatched URI is rendered as an error page rather than as a redirect.
   */
  async beginAuthorization(
    query: AuthorizeQuery,
    subjectUserId: string,
  ): Promise<PendingAuthorization> {
    const client = await this.directory.getOAuthClient(query.client_id);
    if (client === null) {
      throw new ValidationFailedError({ details: { field: 'client_id', reason: 'unknown' } });
    }

    const redirectUri = resolveRedirectUri(query.redirect_uri, client.redirectUris);
    if (redirectUri === null) {
      throw new ValidationFailedError({
        details: { field: 'redirect_uri', reason: 'no_exact_match' },
      });
    }

    const parsedScopes = scopeStringSchema.safeParse(query.scope);
    if (!parsedScopes.success || parsedScopes.data.length === 0) {
      throw new ValidationFailedError({ details: { field: 'scope', reason: 'unknown_scope' } });
    }
    const requested = normalizeScopes(parsedScopes.data);

    const forbidden = requested.filter((scope) => THIRD_PARTY_FORBIDDEN_SCOPES.includes(scope));
    if (forbidden.length > 0 && !client.firstParty) {
      throw new ValidationFailedError({
        details: { field: 'scope', reason: 'invalid_scope', scopes: forbidden },
      });
    }
    const outsideRegistration = requested.filter((scope) => !client.allowedScopes.includes(scope));
    if (outsideRegistration.length > 0) {
      throw new ValidationFailedError({
        details: { field: 'scope', reason: 'not_registered', scopes: outsideRegistration },
      });
    }

    const now = this.clock.now();
    const record = authorizationRequestRecordSchema.parse({
      requestId: randomToken(24),
      clientId: client.clientId,
      redirectUri,
      state: query.state,
      codeChallenge: query.code_challenge,
      codeChallengeMethod: query.code_challenge_method,
      requestedScopes: requested,
      resource: query.resource ?? null,
      consentNonce: randomToken(24),
      subjectUserId,
      createdAt: now.toISOString(),
      expiresAt: instantAfter(now, AUTHORIZATION_REQUEST_TTL_SECONDS),
    });
    await this.directory.putAuthorizationRequest(record);

    return {
      requestId: record.requestId,
      consentNonce: record.consentNonce,
      client,
      redirectUri,
      requestedScopes: requested,
      state: query.state,
    };
  }

  /** The pending request, for rendering the consent screen. */
  async describeAuthorization(
    requestId: string,
    subjectUserId: string,
  ): Promise<PendingAuthorization> {
    const record = await this.directory.getAuthorizationRequest(requestId);
    if (record === null || record.subjectUserId !== subjectUserId) {
      throw new ValidationFailedError({ details: { field: 'requestId', reason: 'unknown' } });
    }
    const client = await this.directory.getOAuthClient(record.clientId);
    if (client === null) {
      throw new ValidationFailedError({ details: { field: 'client_id', reason: 'unknown' } });
    }
    return {
      requestId: record.requestId,
      consentNonce: record.consentNonce,
      client,
      redirectUri: record.redirectUri,
      requestedScopes: record.requestedScopes,
      state: record.state ?? '',
    };
  }

  /**
   * Record the user's decision and mint a code.
   *
   * The granted scopes are intersected with what was requested and with what
   * the client registered. Nothing here can widen: a consent screen that could
   * grant more than the app asked for is a consent screen nobody can reason
   * about.
   */
  async completeConsent(
    decision: ConsentDecision,
    subjectUserId: string,
    locale: string,
  ): Promise<{ redirectUri: string; code: string | null; state: string | null; denied: boolean }> {
    const request = await this.directory.getAuthorizationRequest(decision.requestId);
    if (request === null || request.subjectUserId !== subjectUserId) {
      throw new ValidationFailedError({ details: { field: 'requestId', reason: 'unknown' } });
    }
    if (!constantTimeEquals(request.consentNonce, decision.consentNonce)) {
      throw new ForbiddenError({ details: { reason: 'consent_nonce_mismatch' } });
    }
    await this.directory.deleteAuthorizationRequest(decision.requestId);

    if (decision.decision === 'deny') {
      return { redirectUri: request.redirectUri, code: null, state: request.state, denied: true };
    }

    const client = await this.directory.getOAuthClient(request.clientId);
    if (client === null) {
      throw new ValidationFailedError({ details: { field: 'client_id', reason: 'unknown' } });
    }

    const granted = normalizeScopes(decision.grantedScopes).filter(
      (scope) =>
        request.requestedScopes.includes(scope) &&
        client.allowedScopes.includes(scope) &&
        (client.firstParty || !THIRD_PARTY_FORBIDDEN_SCOPES.includes(scope)),
    );
    if (granted.length === 0) {
      return { redirectUri: request.redirectUri, code: null, state: request.state, denied: true };
    }

    const now = this.clock.now();
    const code = `${CREDENTIAL_PREFIXES.authorizationCode}${randomBase62(6).slice(0, 8).padEnd(8, '0')}_${randomBase62(32)}`;
    const record = authorizationCodeRecordSchema.parse({
      clientId: client.clientId,
      redirectUri: request.redirectUri,
      codeChallenge: request.codeChallenge,
      codeChallengeMethod: request.codeChallengeMethod,
      scopes: granted,
      subjectUserId,
      workspaceId: decision.workspaceId,
      brandIds: decision.brandIds,
      connectionIds: decision.connectionIds,
      // A grant never starts above "may schedule". Immediate publish stays a
      // human confirmation, which is what the consent screen promises.
      approvalLevel: 'level_2_scheduled',
      audience: request.resource ?? this.defaultAudience,
      consentVersionHash: decision.consentVersionHash,
      locale,
      issuedAt: now.toISOString(),
      expiresAt: instantAfter(now, AUTHORIZATION_CODE_TTL_SECONDS),
      consumedAt: null,
      issuedTokenHashes: [],
    });
    await this.directory.putAuthorizationCode(tokenLookupHash(code), record);

    return { redirectUri: request.redirectUri, code, state: request.state, denied: false };
  }

  /** Exchange a code or a refresh token for a new token pair. */
  async token(request: TokenRequest): Promise<TokenResponse> {
    const client = await this.authenticateClient(request.client_id, request.client_secret);
    return request.grant_type === 'authorization_code'
      ? this.exchangeAuthorizationCode(request, client)
      : this.exchangeRefreshToken(request, client);
  }

  private async authenticateClient(
    clientId: string,
    clientSecret: string | undefined,
  ): Promise<OAuthClientRecord> {
    const client = await this.directory.getOAuthClient(clientId);
    if (client === null) {
      throw new ForbiddenError({ details: { reason: 'invalid_client' } });
    }
    if (client.clientType === 'public') {
      // A public client has no secret. PKCE is what binds the exchange.
      return client;
    }
    if (clientSecret === undefined) {
      throw new ForbiddenError({ details: { reason: 'invalid_client' } });
    }
    const pepper = this.directory.pepper;
    const currentMatches =
      client.secretHash !== null && secretMatches(clientSecret, client.secretHash, pepper);
    const previousLive =
      client.previousSecretExpiresAt !== null &&
      requireEpochMillis(client.previousSecretExpiresAt) > this.clock.now().getTime();
    const previousMatches =
      previousLive &&
      client.previousSecretHash !== null &&
      secretMatches(clientSecret, client.previousSecretHash, pepper);
    if (!currentMatches && !previousMatches) {
      throw new ForbiddenError({ details: { reason: 'invalid_client' } });
    }
    return client;
  }

  private async exchangeAuthorizationCode(
    request: Extract<TokenRequest, { grant_type: 'authorization_code' }>,
    client: OAuthClientRecord,
  ): Promise<TokenResponse> {
    const codeHash = tokenLookupHash(request.code);
    const record = await this.directory.getAuthorizationCode(codeHash);
    if (record === null) {
      throw new ForbiddenError({ details: { reason: 'invalid_grant' } });
    }

    if (record.consumedAt !== null) {
      // A second presentation of a used code. Every token minted from it dies,
      // because we cannot tell the legitimate client from the attacker.
      for (const hash of record.issuedTokenHashes) {
        await this.directory.deleteAccessToken(hash);
      }
      this.logger.warn({ clientId: record.clientId }, 'security.oauth_code_replay');
      throw new ForbiddenError({ details: { reason: 'invalid_grant' } });
    }
    if (requireEpochMillis(record.expiresAt) <= this.clock.now().getTime()) {
      throw new ForbiddenError({ details: { reason: 'invalid_grant' } });
    }
    if (record.clientId !== client.clientId) {
      throw new ForbiddenError({ details: { reason: 'invalid_grant' } });
    }
    if (resolveRedirectUri(request.redirect_uri, [record.redirectUri]) === null) {
      throw new ForbiddenError({ details: { reason: 'invalid_grant' } });
    }
    if (!verifyCodeVerifier(request.code_verifier, record.codeChallenge)) {
      throw new ForbiddenError({ details: { reason: 'invalid_grant' } });
    }

    const issued = await this.issueTokens(record, record.scopes);
    await this.directory.putAuthorizationCode(codeHash, {
      ...record,
      consumedAt: this.clock.now().toISOString(),
      issuedTokenHashes: [issued.accessTokenHash, issued.refreshTokenHash],
    });
    return issued.response;
  }

  private async exchangeRefreshToken(
    request: Extract<TokenRequest, { grant_type: 'refresh_token' }>,
    client: OAuthClientRecord,
  ): Promise<TokenResponse> {
    const hash = tokenLookupHash(request.refresh_token);
    const record = await this.directory.getRefreshToken(hash);
    if (record === null || record.clientId !== client.clientId) {
      throw new ForbiddenError({ details: { reason: 'invalid_grant' } });
    }
    if (record.consumedAt !== null) {
      await this.directory.revokeRefreshFamily(record.familyId);
      this.logger.warn(
        { clientId: record.clientId, grantId: record.grantId },
        'security.refresh_reuse_detected',
      );
      throw new ForbiddenError({ details: { reason: 'invalid_grant' } });
    }
    if (requireEpochMillis(record.expiresAt) <= this.clock.now().getTime()) {
      throw new ForbiddenError({ details: { reason: 'invalid_grant' } });
    }

    // A refresh may narrow the scope set. It can never widen it: the ceiling is
    // whatever the user consented to, and the token request is not a consent.
    let scopes = record.scopes;
    if (request.scope !== undefined && request.scope.length > 0) {
      const parsed = scopeStringSchema.safeParse(request.scope);
      if (!parsed.success) {
        throw new ValidationFailedError({ details: { field: 'scope', reason: 'unknown_scope' } });
      }
      scopes = normalizeScopes(parsed.data).filter((scope) => record.scopes.includes(scope));
      if (scopes.length === 0) {
        throw new ValidationFailedError({ details: { field: 'scope', reason: 'not_granted' } });
      }
    }

    await this.directory.putRefreshToken(hash, {
      ...record,
      consumedAt: this.clock.now().toISOString(),
    });

    const issued = await this.issueTokens(
      {
        clientId: record.clientId,
        subjectUserId: record.subjectUserId,
        workspaceId: record.workspaceId,
        audience: record.audience,
        brandIds: [],
        connectionIds: [],
        approvalLevel: 'level_2_scheduled',
        locale: 'en',
      },
      scopes,
      {
        grantId: record.grantId,
        familyId: record.familyId,
        absoluteExpiresAt: record.absoluteExpiresAt,
      },
    );
    return issued.response;
  }

  private async issueTokens(
    source: {
      clientId: string;
      subjectUserId: string;
      workspaceId: string;
      audience: string;
      brandIds: readonly string[];
      connectionIds: readonly string[];
      approvalLevel: AuthorizationCodeRecord['approvalLevel'];
      locale: string;
    },
    scopes: readonly Scope[],
    existing?: { grantId: string; familyId: string; absoluteExpiresAt: string },
  ): Promise<{ response: TokenResponse; accessTokenHash: string; refreshTokenHash: string }> {
    const now = this.clock.now();
    const grantId = existing?.grantId ?? newIdFor('oauthGrant');
    const familyId = existing?.familyId ?? randomToken(16);

    const accessToken = `${CREDENTIAL_PREFIXES.accessToken}${randomBase62(6).slice(0, 8).padEnd(8, '0')}_${randomBase62(32)}`;
    const refreshToken = `${CREDENTIAL_PREFIXES.refreshToken}${randomBase62(6).slice(0, 8).padEnd(8, '0')}_${randomBase62(32)}`;
    const accessTokenHash = tokenLookupHash(accessToken);
    const refreshTokenHash = tokenLookupHash(refreshToken);

    await this.directory.putAccessToken(accessTokenHash, {
      grantId,
      clientId: source.clientId,
      subjectUserId: source.subjectUserId,
      workspaceId: source.workspaceId,
      scopes: [...scopes],
      approvalLevel: source.approvalLevel,
      brandIds: [...source.brandIds],
      connectionIds: [...source.connectionIds],
      audience: source.audience,
      locale: source.locale,
      issuedAt: now.toISOString(),
      expiresAt: instantAfter(now, ACCESS_TOKEN_TTL_SECONDS),
    });

    await this.directory.putRefreshToken(refreshTokenHash, {
      familyId,
      grantId,
      clientId: source.clientId,
      subjectUserId: source.subjectUserId,
      workspaceId: source.workspaceId,
      scopes: [...scopes],
      audience: source.audience,
      issuedAt: now.toISOString(),
      expiresAt: instantAfter(now, REFRESH_SLIDING_TTL_SECONDS),
      absoluteExpiresAt:
        existing?.absoluteExpiresAt ?? instantAfter(now, REFRESH_ABSOLUTE_TTL_SECONDS),
      consumedAt: null,
    });

    return {
      accessTokenHash,
      refreshTokenHash,
      response: {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: ACCESS_TOKEN_TTL_SECONDS,
        refresh_token: refreshToken,
        scope: scopes.join(' '),
      },
    };
  }

  /**
   * RFC 7009 revocation. Always answers 200, even for an unknown token: telling
   * a caller that a token was not found is an oracle for guessing tokens.
   */
  async revoke(token: string, clientId: string, clientSecret: string | undefined): Promise<void> {
    const client = await this.authenticateClient(clientId, clientSecret);
    const hash = tokenLookupHash(token);

    const access = await this.directory.getAccessToken(hash);
    if (access !== null && access.clientId === client.clientId) {
      await this.directory.deleteAccessToken(hash);
      return;
    }
    const refresh = await this.directory.getRefreshToken(hash);
    if (refresh !== null && refresh.clientId === client.clientId) {
      // Revoking a refresh token revokes its whole family: the client asked for
      // this credential lineage to stop working.
      await this.directory.revokeRefreshFamily(refresh.familyId);
      await this.directory.revokeGrantTokens(refresh.grantId);
    }
  }

  /**
   * RFC 7662 introspection, for confidential clients inspecting their own
   * tokens. A token belonging to another client always reads as inactive.
   */
  async introspect(
    token: string,
    clientId: string,
    clientSecret: string,
  ): Promise<Record<string, unknown>> {
    const client = await this.authenticateClient(clientId, clientSecret);
    if (client.clientType !== 'confidential') {
      throw new ForbiddenError({ details: { reason: 'introspection_confidential_only' } });
    }
    const record = await this.directory.getAccessToken(tokenLookupHash(token));
    if (record === null || record.clientId !== client.clientId) {
      return { active: false };
    }
    return {
      active: true,
      scope: record.scopes.join(' '),
      client_id: record.clientId,
      sub: record.subjectUserId,
      aud: record.audience,
      iss: this.issuer,
      token_type: 'Bearer',
      exp: Math.floor(requireEpochMillis(record.expiresAt) / 1000),
      iat: Math.floor(requireEpochMillis(record.issuedAt) / 1000),
    };
  }

  /** Used by the consent screen to list the workspaces a user may choose. */
  listWorkspacesFor(userId: string): ReturnType<Services['workspaces']['listForUser']> {
    return this.services.workspaces.listForUser(userId);
  }
}
