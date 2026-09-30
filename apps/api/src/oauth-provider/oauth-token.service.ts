import { Inject, Injectable } from '@nestjs/common';
import {
  ForbiddenError,
  ValidationFailedError,
  newIdFor,
  normalizeScopes,
  scopeStringSchema,
  type ApprovalLevel,
  type Scope,
} from '@relay/contracts';
import type { Logger } from '@relay/observability';

import type { Clock } from '../application/port';
import { CLOCK, LOGGER } from '../application/tokens';
import { instantAfter, requireEpochMillis } from '../common/instant';
import { CredentialDirectory, tokenLookupHash } from '../security/credential-directory';
import { CREDENTIAL_PREFIXES, randomBase62, randomToken } from '../security/credentials';
import type { OAuthClientRecord } from '../security/records';
import { OAuthClientAuthenticator } from './client-authentication';
import type { TokenRequest, TokenResponse } from './oauth.schemas';
import { resolveRedirectUri, verifyCodeVerifier } from './pkce';
import { OAuthResourceRegistry, sameResource } from './resources';

/**
 * The token endpoint: code exchange and refresh rotation.
 *
 * Lifetimes, from section 7.4 of the security plan: a 30 minute opaque
 * reference access token, and a 30 day sliding refresh token with a 60 day
 * absolute cap and mandatory rotation. Scopes, approval level and narrowing
 * are always re-derived from what was stored at consent, never read from the
 * token request, which is what closes the escalation-between-authorize-and-
 * token gap.
 */

export const ACCESS_TOKEN_TTL_SECONDS = 30 * 60;
export const REFRESH_SLIDING_TTL_SECONDS = 30 * 24 * 60 * 60;
export const REFRESH_ABSOLUTE_TTL_SECONDS = 60 * 24 * 60 * 60;

interface GrantSource {
  readonly clientId: string;
  readonly subjectUserId: string;
  readonly workspaceId: string;
  readonly audience: string;
  readonly projectIds: readonly string[];
  readonly connectionIds: readonly string[];
  readonly approvalLevel: ApprovalLevel;
  readonly locale: string;
}

function mintToken(prefix: string): string {
  return `${prefix}${randomBase62(6).slice(0, 8).padEnd(8, '0')}_${randomBase62(32)}`;
}

function invalidGrant(): ForbiddenError {
  return new ForbiddenError({ details: { reason: 'invalid_grant' } });
}

@Injectable()
export class OAuthTokenService {
  constructor(
    @Inject(CLOCK) private readonly clock: Clock,
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly directory: CredentialDirectory,
    private readonly clients: OAuthClientAuthenticator,
    private readonly resources: OAuthResourceRegistry,
  ) {}

  /** Exchange a code or a refresh token for a new token pair. */
  async token(request: TokenRequest): Promise<TokenResponse> {
    const client = await this.clients.authenticate(request.client_id, request.client_secret);
    return request.grant_type === 'authorization_code'
      ? this.exchangeAuthorizationCode(request, client)
      : this.exchangeRefreshToken(request, client);
  }

  /**
   * RFC 8707 on the token request: an optional `resource`, which must name the
   * audience the code or grant was already bound to. It can confirm the
   * binding; it can never move it.
   */
  private assertSameResource(requested: string | undefined, bound: string): void {
    if (requested === undefined) {
      return;
    }
    const resolved = this.resources.resolve(requested);
    if (resolved === null || !sameResource(resolved, bound)) {
      throw new ForbiddenError({ details: { reason: 'invalid_target' } });
    }
  }

  private async exchangeAuthorizationCode(
    request: Extract<TokenRequest, { grant_type: 'authorization_code' }>,
    client: OAuthClientRecord,
  ): Promise<TokenResponse> {
    const codeHash = tokenLookupHash(request.code);
    const record = await this.directory.getAuthorizationCode(codeHash);
    if (record === null) {
      throw invalidGrant();
    }
    if (record.consumedAt !== null) {
      // A second presentation of a used code. Every token minted from it dies,
      // because we cannot tell the legitimate client from the attacker.
      for (const hash of record.issuedTokenHashes) {
        await this.directory.deleteAccessToken(hash);
      }
      this.logger.warn({ clientId: record.clientId }, 'security.oauth_code_replay');
      throw invalidGrant();
    }
    if (requireEpochMillis(record.expiresAt) <= this.clock.now().getTime()) {
      throw invalidGrant();
    }
    if (record.clientId !== client.clientId) {
      throw invalidGrant();
    }
    if (resolveRedirectUri(request.redirect_uri, [record.redirectUri]) === null) {
      throw invalidGrant();
    }
    if (!verifyCodeVerifier(request.code_verifier, record.codeChallenge)) {
      throw invalidGrant();
    }
    this.assertSameResource(request.resource, record.audience);

    const issued = await this.issueTokens(
      record,
      record.scopes,
      record.grantId === undefined ? undefined : { grantId: record.grantId },
    );
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
      throw invalidGrant();
    }
    if (record.consumedAt !== null) {
      await this.directory.revokeRefreshFamily(record.familyId);
      this.logger.warn(
        { clientId: record.clientId, grantId: record.grantId },
        'security.refresh_reuse_detected',
      );
      throw invalidGrant();
    }
    if (requireEpochMillis(record.expiresAt) <= this.clock.now().getTime()) {
      throw invalidGrant();
    }
    this.assertSameResource(request.resource, record.audience);

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
        // Carried from the consent, so a refreshed token is exactly as narrow
        // as the one it replaces.
        projectIds: record.projectIds,
        connectionIds: record.connectionIds,
        approvalLevel: record.approvalLevel,
        locale: record.locale,
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
    source: GrantSource,
    scopes: readonly Scope[],
    existing?: { grantId: string; familyId?: string; absoluteExpiresAt?: string },
  ): Promise<{ response: TokenResponse; accessTokenHash: string; refreshTokenHash: string }> {
    const now = this.clock.now();
    const grantId = existing?.grantId ?? newIdFor('oauthGrant');
    const familyId = existing?.familyId ?? randomToken(16);

    const accessToken = mintToken(CREDENTIAL_PREFIXES.accessToken);
    const refreshToken = mintToken(CREDENTIAL_PREFIXES.refreshToken);
    const accessTokenHash = tokenLookupHash(accessToken);
    const refreshTokenHash = tokenLookupHash(refreshToken);

    await this.directory.putAccessToken(accessTokenHash, {
      grantId,
      clientId: source.clientId,
      subjectUserId: source.subjectUserId,
      workspaceId: source.workspaceId,
      scopes: [...scopes],
      approvalLevel: source.approvalLevel,
      projectIds: [...source.projectIds],
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
      approvalLevel: source.approvalLevel,
      locale: source.locale,
      projectIds: [...source.projectIds],
      connectionIds: [...source.connectionIds],
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
}
