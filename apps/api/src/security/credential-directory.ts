import { createHash } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import { requireConfigValue } from '@relay/config';
import type { z } from 'zod';

import type { Clock, KeyValueStore } from '../application/port.js';
import { CLOCK, KEY_VALUE_STORE, RELAY_CONFIG } from '../application/tokens.js';
import { requireEpochMillis } from '../common/instant.js';
import {
  accessTokenRecordSchema,
  apiKeyRecordSchema,
  authorizationCodeRecordSchema,
  authorizationRequestRecordSchema,
  oauthClientRecordSchema,
  refreshTokenRecordSchema,
  sessionRecordSchema,
  sessionRefreshRecordSchema,
  type AccessTokenRecord,
  type ApiKeyRecord,
  type AuthorizationCodeRecord,
  type AuthorizationRequestRecord,
  type OAuthClientRecord,
  type RefreshTokenRecord,
  type SessionRecord,
  type SessionRefreshRecord,
} from './records.js';

/**
 * The edge credential store.
 *
 * Authentication happens at the edge; authorization happens in
 * `@relay/application`; tenancy is enforced a third time by row level security
 * in PostgreSQL. This class owns only the first of those three. It answers one
 * question: "does this presented string correspond to a live credential, and
 * what is that credential's ceiling".
 *
 * Records live in the key value store because revocation has to take effect
 * within seconds and because every one of these lookups is on the hot path of
 * every request. The durable record of an API key or a grant belongs to the
 * application layer; what lives here is the verification index it writes
 * alongside, plus a time to live so an expired credential disappears on its
 * own rather than relying on a sweep.
 *
 * Every read is zod-parsed. A malformed or tampered record resolves to null,
 * which fails closed as an unauthenticated request.
 */

const NAMESPACE = 'relay:edge';

export const CREDENTIAL_KEYS = {
  session: (sessionId: string) => `${NAMESPACE}:session:${sessionId}`,
  sessionsForUser: (userId: string) => `${NAMESPACE}:user-sessions:${userId}`,
  apiKey: (publicPrefix: string) => `${NAMESPACE}:apikey:${publicPrefix}`,
  accessToken: (tokenHash: string) => `${NAMESPACE}:at:${tokenHash}`,
  refreshToken: (tokenHash: string) => `${NAMESPACE}:rt:${tokenHash}`,
  refreshFamily: (familyId: string) => `${NAMESPACE}:rtfam:${familyId}`,
  sessionRefresh: (tokenHash: string) => `${NAMESPACE}:srt:${tokenHash}`,
  authorizationCode: (codeHash: string) => `${NAMESPACE}:code:${codeHash}`,
  authorizationRequest: (requestId: string) => `${NAMESPACE}:authreq:${requestId}`,
  oauthClient: (clientId: string) => `${NAMESPACE}:client:${clientId}`,
  grantTokens: (grantId: string) => `${NAMESPACE}:grant-tokens:${grantId}`,
} as const;

/** Look up key for a presented bearer token. Never store the token itself. */
export function tokenLookupHash(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

@Injectable()
export class CredentialDirectory {
  constructor(
    @Inject(KEY_VALUE_STORE) private readonly kv: KeyValueStore,
    @Inject(CLOCK) private readonly clock: Clock,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
  ) {}

  /**
   * The server-held pepper for credential digests. It is deliberately sourced
   * from the OAuth signing key rather than the token vault key, so that a
   * compromise of one does not immediately yield the other.
   */
  get pepper(): string {
    return requireConfigValue(
      this.config.oauth.signingLocalKey ?? this.config.oauth.signingKmsKeyId,
      'OAUTH_SIGNING_LOCAL_KEY',
    );
  }

  private async read<T extends z.ZodType>(key: string, schema: T): Promise<z.infer<T> | null> {
    const raw = await this.kv.get(key);
    if (raw === null) {
      return null;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }
    const result = schema.safeParse(parsed);
    return result.success ? result.data : null;
  }

  private async write(key: string, value: unknown, expiresAt: string): Promise<void> {
    const ttlSeconds = Math.max(
      1,
      Math.ceil((requireEpochMillis(expiresAt) - this.clock.now().getTime()) / 1000),
    );
    await this.kv.set(key, JSON.stringify(value), { ttlSeconds });
  }

  /**
   * Read an index written by `write`, which JSON encodes its value. Reading it
   * back with a raw `kv.get` returns a quoted string, and splitting that on
   * commas yields hashes with stray quotes that match no key. That is how a
   * refresh family could be "revoked" without any of its tokens being deleted.
   */
  private async readIndex(key: string): Promise<readonly string[]> {
    const raw = await this.kv.get(key);
    if (raw === null || raw === undefined || raw === '') {
      return [];
    }
    let value: unknown = raw;
    try {
      value = JSON.parse(raw);
    } catch {
      // Tolerate a value written before this encoding was fixed.
    }
    if (typeof value !== 'string') {
      return [];
    }
    return value.split(',').filter((hash) => hash.length > 0);
  }

  private expired(expiresAt: string): boolean {
    return requireEpochMillis(expiresAt) <= this.clock.now().getTime();
  }

  /* ---------------------------------------------------------------------- */
  /* Sessions                                                               */
  /* ---------------------------------------------------------------------- */

  async putSession(record: SessionRecord): Promise<void> {
    await this.write(CREDENTIAL_KEYS.session(record.sessionId), record, record.absoluteExpiresAt);
    await this.indexSessionForUser(record.userId, record.sessionId, record.absoluteExpiresAt);
  }

  async getSession(sessionId: string): Promise<SessionRecord | null> {
    const record = await this.read(CREDENTIAL_KEYS.session(sessionId), sessionRecordSchema);
    if (record === null || this.expired(record.absoluteExpiresAt)) {
      return null;
    }
    return record;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.kv.delete(CREDENTIAL_KEYS.session(sessionId));
  }

  /** Sign out everywhere: every session this identity holds, including this one. */
  async deleteAllSessionsForUser(userId: string): Promise<number> {
    const index = await this.kv.get(CREDENTIAL_KEYS.sessionsForUser(userId));
    if (index === null) {
      return 0;
    }
    const ids = index.split(',').filter((id) => id.length > 0);
    await Promise.all(ids.map((id) => this.kv.delete(CREDENTIAL_KEYS.session(id))));
    await this.kv.delete(CREDENTIAL_KEYS.sessionsForUser(userId));
    return ids.length;
  }

  private async indexSessionForUser(
    userId: string,
    sessionId: string,
    expiresAt: string,
  ): Promise<void> {
    const key = CREDENTIAL_KEYS.sessionsForUser(userId);
    const ids = new Set(await this.readIndex(key));
    ids.add(sessionId);
    await this.write(key, [...ids].join(','), expiresAt);
  }

  /**
   * Store a session refresh token. Retained past its sliding expiry so a
   * presentation after rotation is recognised as reuse rather than as an
   * ordinary expiry, which is the difference between detecting a stolen token
   * and shrugging at one.
   */
  async putSessionRefresh(tokenHash: string, record: SessionRefreshRecord): Promise<void> {
    await this.write(CREDENTIAL_KEYS.sessionRefresh(tokenHash), record, record.absoluteExpiresAt);
    await this.appendToFamily(record.familyId, tokenHash, record.absoluteExpiresAt);
  }

  async getSessionRefresh(tokenHash: string): Promise<SessionRefreshRecord | null> {
    return this.read(CREDENTIAL_KEYS.sessionRefresh(tokenHash), sessionRefreshRecordSchema);
  }

  /**
   * Revoke every refresh token in a family and every session derived from it.
   * A consumed token presented a second time means one of the two holders is an
   * attacker and we cannot tell which, so both lose access.
   */
  async revokeSessionRefreshFamily(familyId: string): Promise<readonly string[]> {
    const key = CREDENTIAL_KEYS.refreshFamily(familyId);
    const hashes = await this.readIndex(key);
    for (const hash of hashes) {
      const record = await this.getSessionRefresh(hash);
      if (record !== null) {
        await this.deleteSession(record.sessionId);
      }
      await this.kv.delete(CREDENTIAL_KEYS.sessionRefresh(hash));
    }
    await this.kv.delete(key);
    return hashes;
  }

  /* ---------------------------------------------------------------------- */
  /* API keys                                                               */
  /* ---------------------------------------------------------------------- */

  async putApiKey(record: ApiKeyRecord): Promise<void> {
    await this.write(CREDENTIAL_KEYS.apiKey(record.publicPrefix), record, record.expiresAt);
  }

  async getApiKey(publicPrefix: string): Promise<ApiKeyRecord | null> {
    const record = await this.read(CREDENTIAL_KEYS.apiKey(publicPrefix), apiKeyRecordSchema);
    if (record === null || record.revokedAt !== null || this.expired(record.expiresAt)) {
      return null;
    }
    return record;
  }

  async revokeApiKey(publicPrefix: string): Promise<void> {
    await this.kv.delete(CREDENTIAL_KEYS.apiKey(publicPrefix));
  }

  /* ---------------------------------------------------------------------- */
  /* OAuth tokens                                                           */
  /* ---------------------------------------------------------------------- */

  async putAccessToken(tokenHash: string, record: AccessTokenRecord): Promise<void> {
    await this.write(CREDENTIAL_KEYS.accessToken(tokenHash), record, record.expiresAt);
    await this.indexTokenForGrant(record.grantId, tokenHash, record.expiresAt);
  }

  async getAccessToken(tokenHash: string): Promise<AccessTokenRecord | null> {
    const record = await this.read(CREDENTIAL_KEYS.accessToken(tokenHash), accessTokenRecordSchema);
    if (record === null || this.expired(record.expiresAt)) {
      return null;
    }
    return record;
  }

  async deleteAccessToken(tokenHash: string): Promise<void> {
    await this.kv.delete(CREDENTIAL_KEYS.accessToken(tokenHash));
  }

  async putRefreshToken(tokenHash: string, record: RefreshTokenRecord): Promise<void> {
    await this.write(CREDENTIAL_KEYS.refreshToken(tokenHash), record, record.absoluteExpiresAt);
    await this.appendToFamily(record.familyId, tokenHash, record.absoluteExpiresAt);
  }

  async getRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const record = await this.read(
      CREDENTIAL_KEYS.refreshToken(tokenHash),
      refreshTokenRecordSchema,
    );
    if (record === null || this.expired(record.absoluteExpiresAt)) {
      return null;
    }
    return record;
  }

  /**
   * Refresh reuse detection. Presenting a token that was already consumed means
   * one of the two holders is an attacker, and we cannot tell which, so the
   * whole family dies. This is the OAuth 2.1 replay defence and it is not
   * optional (`04-auth-oauth-and-security.md`, section 4.1).
   */
  async revokeRefreshFamily(familyId: string): Promise<readonly string[]> {
    const key = CREDENTIAL_KEYS.refreshFamily(familyId);
    const hashes = await this.readIndex(key);
    await Promise.all(hashes.map((hash) => this.kv.delete(CREDENTIAL_KEYS.refreshToken(hash))));
    await this.kv.delete(key);
    return hashes;
  }

  /** Revoking a grant kills every access and refresh token minted under it. */
  async revokeGrantTokens(grantId: string): Promise<number> {
    const key = CREDENTIAL_KEYS.grantTokens(grantId);
    const hashes = await this.readIndex(key);
    await Promise.all(
      hashes.flatMap((hash) => [
        this.kv.delete(CREDENTIAL_KEYS.accessToken(hash)),
        this.kv.delete(CREDENTIAL_KEYS.refreshToken(hash)),
      ]),
    );
    await this.kv.delete(key);
    return hashes.length;
  }

  private async appendToFamily(
    familyId: string,
    tokenHash: string,
    expiresAt: string,
  ): Promise<void> {
    const key = CREDENTIAL_KEYS.refreshFamily(familyId);
    const hashes = new Set(await this.readIndex(key));
    hashes.add(tokenHash);
    await this.write(key, [...hashes].join(','), expiresAt);
  }

  private async indexTokenForGrant(
    grantId: string,
    tokenHash: string,
    expiresAt: string,
  ): Promise<void> {
    const key = CREDENTIAL_KEYS.grantTokens(grantId);
    const hashes = new Set(await this.readIndex(key));
    hashes.add(tokenHash);
    await this.write(key, [...hashes].join(','), expiresAt);
  }

  /* ---------------------------------------------------------------------- */
  /* Authorization codes and pending requests                               */
  /* ---------------------------------------------------------------------- */

  async putAuthorizationCode(codeHash: string, record: AuthorizationCodeRecord): Promise<void> {
    // Retained past expiry so a replay is detected rather than silently 404ing.
    const key = CREDENTIAL_KEYS.authorizationCode(codeHash);
    await this.kv.set(key, JSON.stringify(record), { ttlSeconds: AUTHORIZATION_CODE_RETENTION });
  }

  async getAuthorizationCode(codeHash: string): Promise<AuthorizationCodeRecord | null> {
    return this.read(CREDENTIAL_KEYS.authorizationCode(codeHash), authorizationCodeRecordSchema);
  }

  async putAuthorizationRequest(record: AuthorizationRequestRecord): Promise<void> {
    await this.write(
      CREDENTIAL_KEYS.authorizationRequest(record.requestId),
      record,
      record.expiresAt,
    );
  }

  async getAuthorizationRequest(requestId: string): Promise<AuthorizationRequestRecord | null> {
    const record = await this.read(
      CREDENTIAL_KEYS.authorizationRequest(requestId),
      authorizationRequestRecordSchema,
    );
    if (record === null || this.expired(record.expiresAt)) {
      return null;
    }
    return record;
  }

  async deleteAuthorizationRequest(requestId: string): Promise<void> {
    await this.kv.delete(CREDENTIAL_KEYS.authorizationRequest(requestId));
  }

  /* ---------------------------------------------------------------------- */
  /* Registered clients                                                     */
  /* ---------------------------------------------------------------------- */

  async putOAuthClient(record: OAuthClientRecord): Promise<void> {
    await this.kv.set(CREDENTIAL_KEYS.oauthClient(record.clientId), JSON.stringify(record));
  }

  async getOAuthClient(clientId: string): Promise<OAuthClientRecord | null> {
    const record = await this.read(CREDENTIAL_KEYS.oauthClient(clientId), oauthClientRecordSchema);
    if (record === null || record.disabledAt !== null) {
      return null;
    }
    return record;
  }

  async deleteOAuthClient(clientId: string): Promise<void> {
    await this.kv.delete(CREDENTIAL_KEYS.oauthClient(clientId));
  }
}

/**
 * Authorization codes live 60 seconds but the record is kept for an hour so a
 * second presentation is recognised as a replay and revokes the tokens the
 * first presentation produced.
 */
export const AUTHORIZATION_CODE_RETENTION = 3600;
