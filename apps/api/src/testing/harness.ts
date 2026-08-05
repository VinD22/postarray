import type { NestExpressApplication } from '@nestjs/platform-express';
import { newIdFor, type Scope } from '@relay/contracts';
import type { Server } from 'node:http';

import type { Services } from '../application/port.js';
import { createApiApp } from '../bootstrap.js';
import { instantAfter } from '../common/instant.js';
import { CredentialDirectory, tokenLookupHash } from '../security/credential-directory.js';
import { CREDENTIAL_PREFIXES, issueCredential } from '../security/credentials.js';
import { clientFingerprint, issueCsrfToken } from '../security/csrf.js';
import { apiKeyRecordSchema, sessionRecordSchema } from '../security/records.js';
import { MemoryKeyValueStore } from '../runtime/redis-key-value-store.js';
import { FakeClock, FakeIdentityProvider, RecordingLogger, asLogger, testConfig } from './fakes.js';
import { createRefusingServices } from './service-doubles.js';

/**
 * The integration test harness.
 *
 * It boots the **real** application: the real guards in the real order, the
 * real problem+json filter, the real security headers and the real body
 * parsers. Only the things the API is handed at bootstrap are doubled. A test
 * that boots a reduced pipeline proves nothing about the pipeline that ships.
 */

/** The user agent the harness sends, so session fingerprints stay stable. */
export const TEST_USER_AGENT = 'relay-test-agent/1.0';
export const TEST_ACCEPT_LANGUAGE = 'en';
export const TEST_ORIGIN = 'https://app.relay.test';

export interface Harness {
  readonly app: NestExpressApplication;
  readonly server: Server;
  readonly services: Services;
  readonly kv: MemoryKeyValueStore;
  readonly clock: FakeClock;
  readonly identity: FakeIdentityProvider;
  readonly logger: RecordingLogger;
  readonly directory: CredentialDirectory;
  close(): Promise<void>;
}

export interface HarnessOptions {
  /** Replace or extend the refusing service doubles. */
  readonly services?: (base: Services) => Services;
}

export async function createHarness(options: HarnessOptions = {}): Promise<Harness> {
  const clock = new FakeClock();
  const kv = new MemoryKeyValueStore(() => clock.now().getTime());
  const logger = new RecordingLogger();
  const config = testConfig();
  const identity = new FakeIdentityProvider({ identities: new Map() });
  const base = createRefusingServices();
  const services = options.services === undefined ? base : options.services(base);

  const app = await createApiApp({
    services,
    kv,
    clock,
    config,
    logger: asLogger(logger),
    identityProvider: identity,
    corsOrigins: [TEST_ORIGIN],
    trustProxyHops: 0,
  });
  await app.init();

  const directory = app.get(CredentialDirectory);
  const server = app.getHttpServer();

  return {
    app,
    server,
    services,
    kv,
    clock,
    identity,
    logger,
    directory,
    close: async () => {
      await app.close();
    },
  };
}

export interface SeededSession {
  readonly sessionId: string;
  readonly csrfToken: string;
  readonly userId: string;
  readonly workspaceId: string;
  readonly cookie: string;
}

/**
 * Seed a signed-in browser session directly in the credential store.
 *
 * The alternative, driving the sign-in route, would couple every test to the
 * identity provider double and to the uniform timing floor, which would make
 * the suite slow for no additional coverage. Sign-in itself has its own tests.
 */
export async function seedSession(
  harness: Harness,
  input: {
    workspaceId?: string;
    workspaceIds?: readonly string[];
    scopes?: readonly Scope[];
    scopesByWorkspace?: Readonly<Record<string, readonly Scope[]>>;
    mfaSatisfied?: boolean;
    approvalLevel?: 'level_0_read' | 'level_1_draft' | 'level_2_scheduled' | 'level_3_confirm';
  } = {},
): Promise<SeededSession> {
  const userId = newIdFor('user');
  const workspaceId = input.workspaceId ?? newIdFor('workspace');
  const workspaceIds = input.workspaceIds ?? [workspaceId];
  const scopes = input.scopes ?? [];
  const scopesByWorkspace =
    input.scopesByWorkspace ??
    Object.fromEntries(workspaceIds.map((id) => [id, [...scopes]] as const));

  const csrf = issueCsrfToken();
  const sessionId = `session_${newIdFor('user')}`;
  const now = harness.clock.now();

  await harness.directory.putSession(
    sessionRecordSchema.parse({
      sessionId,
      userId,
      emailVerified: true,
      locale: 'en',
      mfaSatisfiedAt: input.mfaSatisfied === true ? now.toISOString() : null,
      workspaceIds,
      scopesByWorkspace,
      approvalLevel: input.approvalLevel ?? 'level_2_scheduled',
      refreshFamilyId: `family_${sessionId}`,
      clientFingerprint: clientFingerprint(TEST_USER_AGENT, TEST_ACCEPT_LANGUAGE),
      providerSessionId: null,
      csrfSecret: csrf.secret,
      createdAt: now.toISOString(),
      lastSeenAt: now.toISOString(),
      absoluteExpiresAt: instantAfter(now, 3600),
    }),
  );

  return {
    sessionId,
    csrfToken: csrf.token,
    userId,
    workspaceId,
    cookie: `relay_session=${sessionId}`,
  };
}

export interface SeededApiKey {
  readonly secret: string;
  readonly apiKeyId: string;
  readonly workspaceId: string;
}

/** Seed a workspace API key and return the plaintext to present. */
export async function seedApiKey(
  harness: Harness,
  input: { workspaceId?: string; scopes?: readonly Scope[]; ipAllowlist?: readonly string[] } = {},
): Promise<SeededApiKey> {
  const workspaceId = input.workspaceId ?? newIdFor('workspace');
  const apiKeyId = newIdFor('apiKey');
  const issued = issueCredential(CREDENTIAL_PREFIXES.apiKey, harness.directory.pepper);
  const now = harness.clock.now();

  await harness.directory.putApiKey(
    apiKeyRecordSchema.parse({
      apiKeyId,
      workspaceId,
      createdByUserId: newIdFor('user'),
      name: 'test key',
      publicPrefix: issued.publicPrefix,
      secretHash: issued.secretHash,
      scopes: input.scopes ?? [],
      approvalLevel: 'level_2_scheduled',
      brandIds: [],
      connectionIds: [],
      ipAllowlist: input.ipAllowlist ?? [],
      expiresAt: instantAfter(now, 86_400),
      revokedAt: null,
      createdAt: now.toISOString(),
    }),
  );

  return { secret: issued.plaintext, apiKeyId, workspaceId };
}

/** Seed an OAuth access token bound to this resource's audience. */
export async function seedAccessToken(
  harness: Harness,
  input: {
    workspaceId?: string;
    scopes?: readonly Scope[];
    audience?: string;
  } = {},
): Promise<{ token: string; workspaceId: string; grantId: string }> {
  const workspaceId = input.workspaceId ?? newIdFor('workspace');
  const grantId = newIdFor('oauthGrant');
  const token = `${CREDENTIAL_PREFIXES.accessToken}abcdefgh_${'t'.repeat(40)}`;
  const now = harness.clock.now();

  await harness.directory.putAccessToken(tokenLookupHash(token), {
    grantId,
    clientId: 'rly_pk_testclient',
    subjectUserId: newIdFor('user'),
    workspaceId,
    scopes: [...(input.scopes ?? [])],
    approvalLevel: 'level_2_scheduled',
    brandIds: [],
    connectionIds: [],
    audience: input.audience ?? 'https://api.relay.test',
    locale: 'en',
    issuedAt: now.toISOString(),
    expiresAt: instantAfter(now, 1800),
  });

  return { token, workspaceId, grantId };
}
