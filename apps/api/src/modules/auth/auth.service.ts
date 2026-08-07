import { Inject, Injectable } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import { AuthRequiredError, ForbiddenError } from '@relay/contracts';
import type { Logger } from '@relay/observability';
import type { Response } from 'express';

import type { Clock, IdentityContext, Services } from '../../application/port';
import { CLOCK, IDENTITY_PROVIDER, LOGGER, RELAY_CONFIG, SERVICES } from '../../application/tokens';
import {
  CSRF_COOKIE,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  expireCookie,
  serializeCookie,
} from '../../common/cookies';
import { instantAfter } from '../../common/instant';
import { CredentialDirectory, tokenLookupHash } from '../../security/credential-directory';
import { randomToken } from '../../security/credentials';
import { csrfTokenFor, deviceCode, issueCsrfToken } from '../../security/csrf';
import { sessionRecordSchema, sessionRefreshRecordSchema } from '../../security/records';
import type { IdentityProvider, IdentitySession } from './identity.port';

/**
 * Session lifecycle.
 *
 * Lifetimes come from section 4 of `docs/planning/04-auth-oauth-and-security.md`:
 * a 60 minute access window, a 30 day sliding refresh with a 90 day absolute
 * cap, and mandatory one-time-use refresh rotation with family-wide revocation
 * on reuse.
 *
 * A session cookie carries an identity. It does not carry a workspace and it
 * does not carry a permission set. Both are resolved per request from the live
 * membership, so a demotion lands on the next call rather than at the next
 * sign-in.
 */

export const SESSION_TTL_SECONDS = 60 * 60;
export const REFRESH_SLIDING_TTL_SECONDS = 30 * 24 * 60 * 60;
export const REFRESH_ABSOLUTE_TTL_SECONDS = 90 * 24 * 60 * 60;
/** How fresh a second factor or password re-entry must be for a step-up. */
export const STEP_UP_WINDOW_SECONDS = 10 * 60;

export interface EstablishedSession {
  readonly userId: string;
  readonly workspaceIds: readonly string[];
  readonly csrfToken: string;
  readonly expiresAt: string;
}

export interface ManagedSession {
  readonly id: string;
  readonly device: 'iphone' | 'ipad' | 'android' | 'windows' | 'mac' | 'linux' | 'browser';
  readonly location: null;
  readonly lastSeenAt: string;
  readonly isCurrent: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(SERVICES) private readonly services: Services,
    @Inject(IDENTITY_PROVIDER) private readonly identity: IdentityProvider,
    @Inject(CLOCK) private readonly clock: Clock,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly directory: CredentialDirectory,
  ) {}

  get provider(): IdentityProvider {
    return this.identity;
  }

  /**
   * Resolve an email or username alias, then verify the password.
   *
   * There is no early return that changes observable behaviour. When the
   * identifier does not resolve we still perform a verification against a fixed
   * dummy credential, so the failed-lookup path costs what the failed-password
   * path costs. Every failure produces the same null here and the same response
   * upstream.
   */
  async signIn(identifier: string, password: string): Promise<IdentitySession | null> {
    const resolved = await this.services.identity.resolveLoginIdentifier(identifier);
    if (resolved === null) {
      await this.identity.verifyDummyCredential();
      return null;
    }
    return this.identity.signInWithPassword({ email: resolved.email, password });
  }

  /**
   * Turn a provider session into ours, and set the cookies.
   *
   * The membership snapshot is read here rather than trusted from the provider:
   * Neon Auth knows who the person is, and only the application layer knows what
   * they may currently do.
   */
  async establishSession(
    session: IdentitySession,
    response: Response,
    fingerprint: string,
    userAgent?: string,
  ): Promise<EstablishedSession> {
    const relayUserId =
      (await this.services.identity.linkProviderIdentity({
        identitySubjectId: session.userId,
        email: session.email,
        emailVerified: session.emailVerified,
      })) ?? session.userId;
    const profile = await this.services.identity.getSecurityProfile(relayUserId);
    if (profile === null) {
      throw new AuthRequiredError({ details: { reason: 'profile_unavailable' } });
    }

    const now = this.clock.now();
    const sessionId = randomToken(32);
    const refreshToken = randomToken(32);
    const familyId = randomToken(16);
    const csrf = issueCsrfToken();

    const record = sessionRecordSchema.parse({
      sessionId,
      userId: profile.userId,
      emailVerified: profile.emailVerified,
      locale: profile.locale,
      mfaSatisfiedAt: session.mfaSatisfiedAt,
      workspaceIds: profile.workspaceIds,
      scopesByWorkspace: profile.scopesByWorkspace,
      approvalLevel: profile.approvalLevel,
      refreshFamilyId: familyId,
      clientFingerprint: fingerprint,
      device: deviceCode(userAgent),
      providerSessionId: session.providerSessionId,
      csrfSecret: csrf.secret,
      createdAt: now.toISOString(),
      lastSeenAt: now.toISOString(),
      absoluteExpiresAt: instantAfter(now, SESSION_TTL_SECONDS),
    });
    await this.directory.putSession(record);

    await this.directory.putSessionRefresh(
      tokenLookupHash(refreshToken),
      sessionRefreshRecordSchema.parse({
        familyId,
        sessionId,
        userId: profile.userId,
        clientFingerprint: fingerprint,
        issuedAt: now.toISOString(),
        expiresAt: instantAfter(now, REFRESH_SLIDING_TTL_SECONDS),
        absoluteExpiresAt: instantAfter(now, REFRESH_ABSOLUTE_TTL_SECONDS),
        consumedAt: null,
      }),
    );

    this.writeSessionCookies(response, { sessionId, refreshToken, csrfToken: csrf.token });

    return {
      userId: profile.userId,
      workspaceIds: profile.workspaceIds,
      csrfToken: csrf.token,
      expiresAt: record.absoluteExpiresAt,
    };
  }

  /**
   * Rotate a refresh token.
   *
   * Presenting a token that was already consumed means one of the two holders
   * is an attacker and we cannot tell which, so the entire family dies and
   * every session derived from it is terminated. That is the OAuth 2.1 replay
   * defence, and it applies identically to web sessions, CLI device tokens, MCP
   * tokens and third-party refresh tokens.
   */
  async refreshSession(
    presented: string,
    response: Response,
    fingerprint: string,
    userAgent?: string,
  ): Promise<EstablishedSession> {
    const hash = tokenLookupHash(presented);
    const record = await this.directory.getSessionRefresh(hash);
    if (record === null) {
      throw new AuthRequiredError({ details: { reason: 'refresh_unknown' } });
    }
    if (record.consumedAt !== null) {
      await this.directory.revokeSessionRefreshFamily(record.familyId);
      this.logger.warn(
        { userId: record.userId, familyId: record.familyId },
        'security.refresh_reuse_detected',
      );
      throw new ForbiddenError({ details: { reason: 'refresh_reuse_detected' } });
    }
    if (record.clientFingerprint !== fingerprint) {
      throw new AuthRequiredError({ details: { reason: 'fingerprint_mismatch' } });
    }

    const now = this.clock.now();
    // Consume before issuing, so a crash between the two leaves the old token
    // dead rather than leaving two live tokens in the same family.
    await this.directory.putSessionRefresh(hash, {
      ...record,
      consumedAt: now.toISOString(),
    });

    const previous = await this.directory.getSession(record.sessionId);
    const profile = await this.services.identity.getSecurityProfile(record.userId);
    if (profile === null) {
      throw new AuthRequiredError({ details: { reason: 'profile_unavailable' } });
    }

    const sessionId = randomToken(32);
    const refreshToken = randomToken(32);
    const csrfSecret = previous?.csrfSecret ?? issueCsrfToken().secret;

    const next = sessionRecordSchema.parse({
      sessionId,
      userId: profile.userId,
      emailVerified: profile.emailVerified,
      locale: profile.locale,
      mfaSatisfiedAt: previous?.mfaSatisfiedAt ?? null,
      workspaceIds: profile.workspaceIds,
      scopesByWorkspace: profile.scopesByWorkspace,
      approvalLevel: profile.approvalLevel,
      refreshFamilyId: record.familyId,
      clientFingerprint: fingerprint,
      device: deviceCode(userAgent),
      providerSessionId: previous?.providerSessionId ?? null,
      csrfSecret,
      createdAt: now.toISOString(),
      lastSeenAt: now.toISOString(),
      absoluteExpiresAt: instantAfter(now, SESSION_TTL_SECONDS),
    });
    await this.directory.putSession(next);
    await this.directory.deleteSession(record.sessionId);

    await this.directory.putSessionRefresh(
      tokenLookupHash(refreshToken),
      sessionRefreshRecordSchema.parse({
        familyId: record.familyId,
        sessionId,
        userId: profile.userId,
        clientFingerprint: fingerprint,
        issuedAt: now.toISOString(),
        expiresAt: instantAfter(now, REFRESH_SLIDING_TTL_SECONDS),
        absoluteExpiresAt: record.absoluteExpiresAt,
        consumedAt: null,
      }),
    );

    const csrfToken = csrfTokenFor(csrfSecret);
    this.writeSessionCookies(response, { sessionId, refreshToken, csrfToken });

    return {
      userId: profile.userId,
      workspaceIds: profile.workspaceIds,
      csrfToken,
      expiresAt: next.absoluteExpiresAt,
    };
  }

  /** End this session, or every session this identity holds. */
  async signOut(sessionId: string, scope: 'current' | 'all', response: Response): Promise<number> {
    const record = await this.directory.getSession(sessionId);
    let terminated = 1;
    if (scope === 'all' && record !== null) {
      const records = await this.directory.listSessionsForUser(record.userId);
      for (const session of records) {
        if (session.providerSessionId !== null) {
          await this.identity.signOut(session.providerSessionId);
        }
        await this.directory.revokeSessionRefreshFamily(session.refreshFamilyId);
      }
      terminated = records.length;
      await this.directory.deleteAllSessionsForUser(record.userId);
    } else {
      if (record !== null && record.providerSessionId !== null) {
        await this.identity.signOut(record.providerSessionId);
      }
      if (record !== null) {
        await this.directory.revokeSessionRefreshFamily(record.refreshFamilyId);
      }
      await this.directory.deleteSession(sessionId);
    }
    this.clearSessionCookies(response);
    return terminated;
  }

  /** Read the live edge session inventory for the signed-in identity. */
  async listSessions(userId: string, currentSessionId: string): Promise<readonly ManagedSession[]> {
    const records = await this.directory.listSessionsForUser(userId);
    return records.map((record) => ({
      id: record.sessionId,
      device: record.device,
      location: null,
      lastSeenAt: record.lastSeenAt,
      isCurrent: record.sessionId === currentSessionId,
    }));
  }

  /** Sign out every other session, including its provider-side session. */
  async revokeOtherSessions(userId: string, currentSessionId: string): Promise<number> {
    const records = await this.directory.listSessionsForUser(userId);
    const others = records.filter((record) => record.sessionId !== currentSessionId);
    for (const record of others) {
      if (record.providerSessionId !== null) {
        await this.identity.signOut(record.providerSessionId);
      }
      await this.directory.revokeSessionRefreshFamily(record.refreshFamilyId);
      await this.directory.deleteSession(record.sessionId);
    }
    return others.length;
  }

  /** Record that a second factor or password re-entry just succeeded. */
  async markStepUpSatisfied(sessionId: string): Promise<void> {
    const record = await this.directory.getSession(sessionId);
    if (record === null) {
      return;
    }
    await this.directory.putSession({
      ...record,
      mfaSatisfiedAt: this.clock.now().toISOString(),
    });
  }

  /** Re-verify the current person without minting or rotating a session. */
  async stepUpWithPassword(sessionId: string, userId: string, password: string): Promise<boolean> {
    const profile = await this.services.identity.getSecurityProfile(userId);
    if (profile === null) {
      await this.identity.verifyDummyCredential();
      return false;
    }
    const verified = await this.identity.signInWithPassword({
      email: profile.email,
      password,
    });
    if (verified === null) {
      return false;
    }
    const verifiedProfile = await this.services.identity.getSecurityProfile(verified.userId);
    if (verified.providerSessionId !== null) {
      await this.identity.signOut(verified.providerSessionId);
    }
    if (verifiedProfile?.userId !== userId) {
      return false;
    }
    await this.markStepUpSatisfied(sessionId);
    return true;
  }

  recordConsent(input: {
    identitySubjectId: string;
    email: string;
    displayName: string;
    locale: string;
    timeZone: string;
    termsVersionHash: string;
    privacyVersionHash: string;
    countryCode: string | null;
  }): Promise<void> {
    return this.services.identity.recordSignupConsent(input);
  }

  setAlias(ctx: IdentityContext, alias: string): Promise<{ alias: string }> {
    return this.services.identity.setUsernameAlias(ctx, alias);
  }

  private writeSessionCookies(
    response: Response,
    tokens: { sessionId: string; refreshToken: string; csrfToken: string },
  ): void {
    const secure = !this.config.core.isDevelopment;
    response.append(
      'set-cookie',
      serializeCookie(SESSION_COOKIE, tokens.sessionId, {
        maxAgeSeconds: SESSION_TTL_SECONDS,
        sameSite: 'Lax',
        secure,
      }),
    );
    response.append(
      'set-cookie',
      serializeCookie(REFRESH_COOKIE, tokens.refreshToken, {
        maxAgeSeconds: REFRESH_ABSOLUTE_TTL_SECONDS,
        sameSite: 'Lax',
        secure,
        // Scoped to the one route that consumes it, so it is not attached to
        // every request it has no business being on.
        path: '/v1/auth/session',
      }),
    );
    response.append(
      'set-cookie',
      serializeCookie(CSRF_COOKIE, tokens.csrfToken, {
        maxAgeSeconds: SESSION_TTL_SECONDS,
        sameSite: 'Lax',
        secure,
        // Readable on purpose: the client copies it into a request header, and
        // the value is useless without the session secret that signed it.
        httpOnly: false,
      }),
    );
  }

  private clearSessionCookies(response: Response): void {
    const secure = !this.config.core.isDevelopment;
    response.append('set-cookie', expireCookie(SESSION_COOKIE, { secure, sameSite: 'Lax' }));
    response.append(
      'set-cookie',
      expireCookie(REFRESH_COOKIE, { secure, sameSite: 'Lax', path: '/v1/auth/session' }),
    );
    response.append(
      'set-cookie',
      expireCookie(CSRF_COOKIE, { secure, sameSite: 'Lax', httpOnly: false }),
    );
  }
}
