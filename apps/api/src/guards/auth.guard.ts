import { Inject, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { RelayConfig } from '@relay/config';
import { AuthRequiredError, ForbiddenError } from '@relay/contracts';
import type { Request } from 'express';

import type { Clock } from '../application/port';
import { CLOCK, RELAY_CONFIG } from '../application/tokens';
import { PUBLIC_ROUTE_KEY } from '../common/decorators';
import { SESSION_COOKIE, parseCookies } from '../common/cookies';
import { epochMillis } from '../common/instant';
import { relayState, type Principal } from '../common/request.types';
import { CredentialDirectory, tokenLookupHash } from '../security/credential-directory';
import { CREDENTIAL_PREFIXES, parseCredential, secretMatches } from '../security/credentials';
import { clientFingerprint } from '../security/csrf';
import { ipInAllowlist } from './ip-allowlist';

/**
 * Edge authentication: session cookie, bearer access token, or API key.
 *
 * This guard answers "who is calling" and nothing else. It does not decide
 * whether the caller may do the thing; that is `@relay/application`'s job, and
 * PostgreSQL row level security is the third and final check. Three
 * independent layers is the design (`AGENTS.md`, hard rule 5).
 *
 * Rules enforced here:
 *
 * - **One credential per request.** A request carrying both a session cookie
 *   and an `Authorization` header is rejected rather than resolved by
 *   precedence. That combination means a confused client, and picking a winner
 *   is how privilege confusion bugs are born (section 14.2 of the security plan).
 * - **Audience binding on every bearer token.** A token is accepted only after
 *   its recorded audience matches this resource's identifier. This is the
 *   confused-deputy defence: a token minted for another Post Array resource does not
 *   work here.
 * - **Tokens never come from the query string.** `Authorization: Bearer` only,
 *   so a credential cannot end up in a proxy log, a referrer or browser history.
 * - **Failure is uniform.** Unknown, expired, revoked and malformed credentials
 *   all produce the same `AUTH_REQUIRED` problem document.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly directory: CredentialDirectory,
    @Inject(CLOCK) private readonly clock: Clock,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') {
      return true;
    }
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest<Request>();
    const state = relayState(request);

    const authorization = this.readAuthorizationHeader(request);
    const cookies = parseCookies(request.headers.cookie);
    const sessionId = cookies[SESSION_COOKIE];

    if (authorization !== undefined && sessionId !== undefined) {
      throw new ForbiddenError({
        details: { reason: 'ambiguous_credential' },
      });
    }

    if (isPublic === true && authorization === undefined && sessionId === undefined) {
      return true;
    }

    const principal =
      authorization !== undefined
        ? await this.resolveBearer(authorization, request)
        : sessionId !== undefined
          ? await this.resolveSession(sessionId, request)
          : null;

    if (principal === null) {
      if (isPublic === true) {
        return true;
      }
      throw new AuthRequiredError();
    }

    state.principal = principal;
    // A cookie is the web app; a bearer token or an API key is a programmatic
    // surface. The surface is recorded on the receipt, so it has to be right.
    state.surface = principal.credentialKind === 'session' ? 'web' : 'api';
    return true;
  }

  /** `Authorization: Bearer <token>`. Any other scheme is not a credential. */
  private readAuthorizationHeader(request: Request): string | undefined {
    const header = request.headers.authorization;
    if (typeof header !== 'string') {
      return undefined;
    }
    const [scheme, value] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || value === undefined || value.length === 0) {
      return undefined;
    }
    return value;
  }

  /** This resource's identifier, for audience verification. */
  private get resourceIdentifier(): string {
    return this.config.core.apiUrl ?? 'urn:relay:api';
  }

  private async resolveBearer(token: string, request: Request): Promise<Principal | null> {
    const parsed = parseCredential(token);
    if (parsed === null) {
      return null;
    }
    if (parsed.prefix === CREDENTIAL_PREFIXES.apiKey) {
      return this.resolveApiKey(parsed.publicPrefix, parsed.secret, request);
    }
    if (parsed.prefix === CREDENTIAL_PREFIXES.accessToken) {
      return this.resolveAccessToken(token);
    }
    // A refresh token, a client secret or an authorization code presented as a
    // bearer credential is a client bug, and is treated as no credential.
    return null;
  }

  private async resolveAccessToken(token: string): Promise<Principal | null> {
    const record = await this.directory.getAccessToken(tokenLookupHash(token));
    if (record === null) {
      return null;
    }
    if (record.audience !== this.resourceIdentifier) {
      // A token for a different resource. Never accept a token whose audience
      // you did not check.
      return null;
    }
    return {
      actorType: 'oauth_app',
      actorId: record.grantId,
      credentialKind: 'bearer',
      userId: record.subjectUserId,
      clientId: record.clientId,
      grantId: record.grantId,
      scopes: record.scopes,
      scopesByWorkspace: undefined,
      workspaceIds: [record.workspaceId],
      approvalLevel: record.approvalLevel,
      mfaSatisfiedAt: undefined,
      emailVerified: true,
      locale: record.locale,
      credentialId: record.grantId,
    };
  }

  private async resolveApiKey(
    publicPrefix: string,
    secret: string,
    request: Request,
  ): Promise<Principal | null> {
    const record = await this.directory.getApiKey(publicPrefix);
    if (record === null) {
      return null;
    }
    if (!secretMatches(secret, record.secretHash, this.directory.pepper)) {
      return null;
    }
    if (record.ipAllowlist.length > 0 && !ipInAllowlist(request.ip, record.ipAllowlist)) {
      return null;
    }
    return {
      actorType: 'service_account',
      // The account is the actor; the key is only how it proved it. A rotation
      // must not change who the audit log says acted.
      actorId: record.serviceAccountId ?? record.apiKeyId,
      credentialKind: 'api_key',
      userId: record.createdByUserId,
      clientId: undefined,
      grantId: undefined,
      scopes: record.scopes,
      scopesByWorkspace: undefined,
      workspaceIds: [record.workspaceId],
      approvalLevel: record.approvalLevel,
      mfaSatisfiedAt: undefined,
      emailVerified: true,
      locale: 'en',
      credentialId: record.apiKeyId,
    };
  }

  private async resolveSession(sessionId: string, request: Request): Promise<Principal | null> {
    const record = await this.directory.getSession(sessionId);
    if (record === null) {
      return null;
    }
    const fingerprint = clientFingerprint(
      request.headers['user-agent'],
      request.headers['accept-language'],
    );
    if (fingerprint !== record.clientFingerprint) {
      // A session presented from a different device family. Fail closed and
      // make the human reauthenticate rather than silently continuing.
      return null;
    }
    // Scopes are per workspace on a session, because a role differs per
    // workspace. `WorkspaceGuard` narrows to the one that was selected.
    const allScopes = new Set(Object.values(record.scopesByWorkspace).flat());
    return {
      actorType: 'user',
      actorId: record.userId,
      credentialKind: 'session',
      userId: record.userId,
      clientId: undefined,
      grantId: undefined,
      scopes: [...allScopes],
      scopesByWorkspace: record.scopesByWorkspace,
      workspaceIds: record.workspaceIds,
      approvalLevel: record.approvalLevel,
      mfaSatisfiedAt: record.mfaSatisfiedAt ?? undefined,
      emailVerified: record.emailVerified,
      locale: record.locale,
      credentialId: record.sessionId,
    };
  }

  /** Exposed so the session module can reuse the same freshness rule. */
  isStale(instant: string | undefined, windowSeconds: number): boolean {
    if (instant === undefined) {
      return true;
    }
    const parsed = epochMillis(instant);
    if (parsed === null) {
      return true;
    }
    return this.clock.now().getTime() - parsed > windowSeconds * 1000;
  }
}
