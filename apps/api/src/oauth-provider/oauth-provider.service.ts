import { Inject, Injectable } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import {
  ForbiddenError,
  ValidationFailedError,
  normalizeScopes,
  scopeStringSchema,
  type Scope,
} from '@relay/contracts';

import type { ActorContext, Clock, Services } from '../application/port';
import { CLOCK, RELAY_CONFIG, SERVICES } from '../application/tokens';
import { instantAfter } from '../common/instant';
import { CredentialDirectory, tokenLookupHash } from '../security/credential-directory';
import {
  CREDENTIAL_PREFIXES,
  constantTimeEquals,
  randomBase62,
  randomToken,
} from '../security/credentials';
import {
  authorizationCodeRecordSchema,
  authorizationRequestRecordSchema,
  type OAuthClientRecord,
} from '../security/records';
import { resolveRedirectUri } from './pkce';
import type { AuthorizeQuery, ConsentDecision } from './oauth.schemas';
import { OAuthResourceRegistry } from './resources';

/**
 * Post Array's own OAuth 2.1 authorization server: the authorization request
 * and the consent decision. The token endpoint lives in `oauth-token.service`,
 * introspection and revocation in `oauth-introspection.service`.
 *
 * Access tokens are opaque references, not JWTs. A self-contained token cannot
 * be revoked before it expires, and "revoke this app" taking effect within
 * seconds is the entire point of the grant screen.
 */

export const AUTHORIZATION_CODE_TTL_SECONDS = 60;
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

export interface ConsentOutcome {
  readonly redirectUri: string;
  readonly code: string | null;
  readonly state: string | null;
  readonly denied: boolean;
}

@Injectable()
export class OAuthProviderService {
  constructor(
    @Inject(SERVICES) private readonly services: Services,
    @Inject(CLOCK) private readonly clock: Clock,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
    private readonly directory: CredentialDirectory,
    private readonly resources: OAuthResourceRegistry,
  ) {}

  get issuer(): string {
    return this.config.oauth.issuerUrl ?? this.config.core.apiUrl ?? 'urn:relay:issuer';
  }

  /** The resource identifier this server mints tokens for by default. */
  get defaultAudience(): string {
    return this.resources.apiAudience;
  }

  /**
   * The scopes this request will ask the person for.
   *
   * What the client asked for, intersected with what it registered and, for a
   * third party, with what a third party may ever hold. Asking for more than
   * that narrows the request instead of failing it, so a client that reads our
   * full `scopes_supported` still reaches the consent screen. Only a request
   * left with nothing is refused.
   */
  private requestedScopes(query: AuthorizeQuery, client: OAuthClientRecord): readonly Scope[] {
    let asked: readonly Scope[] = client.allowedScopes;
    if (query.scope !== undefined) {
      const parsed = scopeStringSchema.safeParse(query.scope);
      if (!parsed.success || parsed.data.length === 0) {
        throw new ValidationFailedError({ details: { field: 'scope', reason: 'unknown_scope' } });
      }
      asked = normalizeScopes(parsed.data);
    }
    const permitted = asked.filter(
      (scope) => client.firstParty || !THIRD_PARTY_FORBIDDEN_SCOPES.includes(scope),
    );
    if (permitted.length === 0) {
      throw new ValidationFailedError({
        details: { field: 'scope', reason: 'invalid_scope', scopes: [...asked] },
      });
    }
    const registered = permitted.filter((scope) => client.allowedScopes.includes(scope));
    if (registered.length === 0) {
      throw new ValidationFailedError({
        details: { field: 'scope', reason: 'not_registered', scopes: [...permitted] },
      });
    }
    return registered;
  }

  /**
   * Validate an authorization request and stage it for the consent screen.
   *
   * Everything that could redirect a browser somewhere is checked before
   * anything is stored: the client must exist and be enabled, and the redirect
   * URI must match one of its registered values exactly.
   */
  async beginAuthorization(
    query: AuthorizeQuery,
    subjectUserId: string,
  ): Promise<PendingAuthorization> {
    const client = await this.directory.getOAuthClient(query.client_id);
    if (client === null || client.registration === 'resource_server') {
      throw new ValidationFailedError({ details: { field: 'client_id', reason: 'unknown' } });
    }

    const redirectUri = resolveRedirectUri(query.redirect_uri, client.redirectUris);
    if (redirectUri === null) {
      throw new ValidationFailedError({
        details: { field: 'redirect_uri', reason: 'no_exact_match' },
      });
    }

    const audience = this.resources.resolve(query.resource);
    if (audience === null) {
      throw new ValidationFailedError({ details: { field: 'resource', reason: 'invalid_target' } });
    }
    const requested = this.requestedScopes(query, client);

    const now = this.clock.now();
    const record = authorizationRequestRecordSchema.parse({
      requestId: randomToken(24),
      clientId: client.clientId,
      redirectUri,
      state: query.state,
      codeChallenge: query.code_challenge,
      codeChallengeMethod: query.code_challenge_method,
      requestedScopes: requested,
      resource: audience,
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
   * the client registered. Nothing here can widen. An approval writes the
   * durable grant row first: every token carries its id, and the application
   * layer refuses any call whose grant row does not exist or was revoked.
   */
  async completeConsent(
    decision: ConsentDecision,
    ctx: ActorContext,
    subjectUserId: string,
  ): Promise<ConsentOutcome> {
    const request = await this.directory.getAuthorizationRequest(decision.requestId);
    if (request === null || request.subjectUserId !== subjectUserId) {
      throw new ValidationFailedError({ details: { field: 'requestId', reason: 'unknown' } });
    }
    if (!constantTimeEquals(request.consentNonce, decision.consentNonce)) {
      throw new ForbiddenError({ details: { reason: 'consent_nonce_mismatch' } });
    }
    await this.directory.deleteAuthorizationRequest(decision.requestId);

    const denied: ConsentOutcome = {
      redirectUri: request.redirectUri,
      code: null,
      state: request.state,
      denied: true,
    };
    if (decision.decision === 'deny') {
      return denied;
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
      return denied;
    }

    const { grantId } = await this.services.oauthApps.recordGrant(ctx, {
      appId: client.appId,
      clientId: client.clientId,
      scopes: granted,
      projectIds: decision.projectIds,
      connectionIds: decision.connectionIds,
    });

    const now = this.clock.now();
    const code = `${CREDENTIAL_PREFIXES.authorizationCode}${randomBase62(6).slice(0, 8).padEnd(8, '0')}_${randomBase62(32)}`;
    const record = authorizationCodeRecordSchema.parse({
      clientId: client.clientId,
      redirectUri: request.redirectUri,
      codeChallenge: request.codeChallenge,
      codeChallengeMethod: request.codeChallengeMethod,
      scopes: granted,
      subjectUserId,
      workspaceId: ctx.workspaceId,
      projectIds: decision.projectIds,
      connectionIds: decision.connectionIds,
      // A grant never starts above "may schedule": the consent screen offers no
      // other level yet, and immediate publish stays a human confirmation.
      approvalLevel: 'level_2_scheduled',
      audience: request.resource ?? this.defaultAudience,
      consentVersionHash: decision.consentVersionHash,
      locale: ctx.locale,
      grantId,
      issuedAt: now.toISOString(),
      expiresAt: instantAfter(now, AUTHORIZATION_CODE_TTL_SECONDS),
      consumedAt: null,
      issuedTokenHashes: [],
    });
    await this.directory.putAuthorizationCode(tokenLookupHash(code), record);

    return { redirectUri: request.redirectUri, code, state: request.state, denied: false };
  }

  /** Used by the consent screen to list the workspaces a user may choose. */
  listWorkspacesFor(userId: string): ReturnType<Services['workspaces']['listForUser']> {
    return this.services.workspaces.listForUser(userId);
  }
}
