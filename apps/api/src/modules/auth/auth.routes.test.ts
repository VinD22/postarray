import { API_HEADERS, newIdFor, type Role } from '@relay/contracts';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { SessionView, UserSecurityProfile } from '../../application/port';
import {
  TEST_ACCEPT_LANGUAGE,
  TEST_ORIGIN,
  TEST_USER_AGENT,
  createHarness,
  seedSession,
  type Harness,
} from '../../testing/harness';
import { instantAfter } from '../../common/instant';
import { issueCsrfToken, clientFingerprint } from '../../security/csrf';
import { sessionRecordSchema } from '../../security/records';

let harness: Harness;
let selectedWorkspace: string | undefined;
const consentCalls: unknown[] = [];
const securityProfiles = new Map<string, UserSecurityProfile>();

function sessionView(userId: string, workspaceId: string, role: Role = 'owner'): SessionView {
  const workspace = {
    id: workspaceId,
    name: 'Launch workspace',
    slug: 'launch-workspace',
    timeZone: 'Asia/Kolkata',
    locale: 'en',
    role,
    readOnly: false,
    projectLimit: 3,
  } as const;
  return {
    user: {
      id: userId,
      name: 'Launch Owner',
      email: 'owner@example.test',
      username: null,
      avatarUrl: null,
      locale: 'en',
      timeZone: 'Asia/Kolkata',
    },
    workspace,
    workspaces: [workspace],
    projects: [],
    scopes: ['accounts:read'],
    onboardingComplete: true,
  };
}

beforeEach(async () => {
  selectedWorkspace = undefined;
  consentCalls.length = 0;
  securityProfiles.clear();
  harness = await createHarness({
    services: (base) => ({
      ...base,
      identity: {
        ...base.identity,
        recordSignupConsent: (input) => {
          consentCalls.push(input);
          return Promise.resolve();
        },
        getSessionView: (userId, workspaceId) => {
          selectedWorkspace = workspaceId;
          return Promise.resolve(sessionView(userId, workspaceId ?? newIdFor('workspace')));
        },
        getSecurityProfile: (userId) => Promise.resolve(securityProfiles.get(userId) ?? null),
      },
    }),
  });
});

afterEach(async () => {
  await harness.close();
});

describe('authentication routes', () => {
  it('provisions signup profile input and sends the same one-time-code response', async () => {
    const identitySubjectId = newIdFor('user');
    harness.identity.seedIdentity({
      userId: identitySubjectId,
      email: 'owner@example.test',
      password: 'a long test password',
    });

    const response = await request(harness.server)
      .post('/v1/auth/signup')
      .send({
        email: 'owner@example.test',
        password: 'a long test password',
        displayName: 'Launch Owner',
        locale: 'en',
        timeZone: 'Asia/Kolkata',
        termsVersionHash: 'a'.repeat(64),
        privacyVersionHash: 'b'.repeat(64),
        acceptedTerms: true,
      });

    expect(response.status).toBe(202);
    expect(response.body).toEqual({ status: 'accepted' });
    expect(harness.identity.signUpCalls[0]).toMatchObject({ displayName: 'Launch Owner' });
    expect(harness.identity.magicLinks).toEqual([{ email: 'owner@example.test', locale: 'en' }]);
    expect(consentCalls[0]).toMatchObject({
      identitySubjectId,
      displayName: 'Launch Owner',
      timeZone: 'Asia/Kolkata',
    });
  });

  it('rejects planned interface locales at the auth boundary', async () => {
    const response = await request(harness.server)
      .post('/v1/auth/signup')
      .send({
        email: 'owner@example.test',
        password: 'a long test password',
        displayName: 'Launch Owner',
        // `nb` is planned, not active. `es-419` used to sit here and no
        // longer belongs: it is one of the twenty-five launch locales now, so
        // the boundary is right to accept it.
        locale: 'nb',
        timeZone: 'Asia/Kolkata',
        termsVersionHash: 'a'.repeat(64),
        privacyVersionHash: 'b'.repeat(64),
        acceptedTerms: true,
    });

    expect(response.status).toBe(422);
    expect(response.body.code).toBe('VALIDATION_FAILED');
    expect(harness.identity.signUpCalls).toEqual([]);
    expect(harness.identity.magicLinks).toEqual([]);
  });

  it('sets a new password from a valid reset token and establishes no session', async () => {
    const response = await request(harness.server).post('/v1/auth/password-reset/complete').send({
      token: harness.identity.passwordResetToken,
      newPassword: 'a long replacement password',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'reset' });
    expect(harness.identity.completedPasswordResets[0]).toMatchObject({
      token: harness.identity.passwordResetToken,
    });
    // Nothing is signed in by resetting. The new password is used at sign-in,
    // once, deliberately.
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('refuses an expired or already used reset token without naming an account', async () => {
    const response = await request(harness.server)
      .post('/v1/auth/password-reset/complete')
      .send({ token: 'a-stale-token-that-was-already-used', newPassword: 'a long new password' });

    expect(response.status).toBe(422);
    const serialized = JSON.stringify(response.body);
    expect(serialized).toContain('VALIDATION_FAILED');
    // The refusal says the token is no good, never whose token it was.
    expect(serialized).not.toContain('example.test');
  });

  it('refuses a new password below the length policy before reaching the provider', async () => {
    const response = await request(harness.server)
      .post('/v1/auth/password-reset/complete')
      .send({ token: harness.identity.passwordResetToken, newPassword: 'short' });

    expect(response.status).toBe(422);
    expect(harness.identity.completedPasswordResets).toEqual([]);
  });

  it('returns the selected tenant in the browser session bootstrap', async () => {
    const workspaceA = newIdFor('workspace');
    const workspaceB = newIdFor('workspace');
    const session = await seedSession(harness, {
      workspaceId: workspaceA,
      workspaceIds: [workspaceA, workspaceB],
      scopes: ['accounts:read'],
    });

    const response = await request(harness.server)
      .get('/v1/auth/session')
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, workspaceB)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);

    expect(response.status).toBe(200);
    expect(selectedWorkspace).toBe(workspaceB);
    expect(response.body.workspace.id).toBe(workspaceB);
  });

  it('lists active browser sessions without exposing provider session handles', async () => {
    const session = await seedSession(harness);
    const now = harness.clock.now();
    const otherSessionId = `session_${newIdFor('user')}`;
    await harness.directory.putSession(
      sessionRecordSchema.parse({
        sessionId: otherSessionId,
        userId: session.userId,
        emailVerified: true,
        locale: 'en',
        mfaSatisfiedAt: null,
        workspaceIds: [session.workspaceId],
        scopesByWorkspace: { [session.workspaceId]: [] },
        approvalLevel: 'level_0_read',
        refreshFamilyId: `family_${otherSessionId}`,
        clientFingerprint: clientFingerprint('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'en-US'),
        device: 'windows',
        providerSessionId: 'provider-session-other',
        csrfSecret: issueCsrfToken().secret,
        createdAt: new Date(now.getTime() - 60_000).toISOString(),
        lastSeenAt: new Date(now.getTime() - 10_000).toISOString(),
        absoluteExpiresAt: instantAfter(now, 3_600),
      }),
    );

    const response = await request(harness.server)
      .get('/v1/auth/sessions')
      .set('cookie', session.cookie)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: otherSessionId, device: 'windows', isCurrent: false }),
        expect.objectContaining({ id: session.sessionId, isCurrent: true }),
      ]),
    );
    expect(
      response.body.data.find((entry: { id: string }) => entry.id === otherSessionId),
    ).not.toHaveProperty('providerSessionId');
  });

  it('signs out every other session and its provider session', async () => {
    const session = await seedSession(harness);
    const now = harness.clock.now();
    const otherSessionId = `session_${newIdFor('user')}`;
    await harness.directory.putSession(
      sessionRecordSchema.parse({
        sessionId: otherSessionId,
        userId: session.userId,
        emailVerified: true,
        locale: 'en',
        mfaSatisfiedAt: null,
        workspaceIds: [session.workspaceId],
        scopesByWorkspace: { [session.workspaceId]: [] },
        approvalLevel: 'level_0_read',
        refreshFamilyId: `family_${otherSessionId}`,
        clientFingerprint: clientFingerprint('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'en-US'),
        device: 'windows',
        providerSessionId: 'provider-session-other',
        csrfSecret: issueCsrfToken().secret,
        createdAt: new Date(now.getTime() - 60_000).toISOString(),
        lastSeenAt: new Date(now.getTime() - 10_000).toISOString(),
        absoluteExpiresAt: instantAfter(now, 3_600),
      }),
    );

    const response = await request(harness.server)
      .post('/v1/auth/sessions/revoke-others')
      .set('cookie', `${session.cookie}; relay_csrf=${session.csrfToken}`)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set(API_HEADERS.idempotencyKey, 'revoke-other-sessions-test')
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ terminatedSessions: 1 });
    expect(await harness.directory.getSession(otherSessionId)).toBeNull();
    expect(await harness.directory.getSession(session.sessionId)).not.toBeNull();
    expect(harness.identity.signOuts).toContain('provider-session-other');
  });

  it('re-verifies the current password and marks the existing session stepped up', async () => {
    const session = await seedSession(harness, { scopes: ['posts:publish'] });
    securityProfiles.set(session.userId, {
      userId: session.userId,
      email: 'owner@example.test',
      emailVerified: true,
      locale: 'en',
      approvalLevel: 'level_3_confirm',
      workspaceIds: [session.workspaceId],
      scopesByWorkspace: { [session.workspaceId]: ['posts:publish'] },
      mfaEnrolled: false,
    });
    harness.identity.seedIdentity({
      userId: session.userId,
      email: 'owner@example.test',
      password: 'a long test password',
    });

    const response = await request(harness.server)
      .post('/v1/auth/step-up/password')
      .set('cookie', session.cookie)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .send({ password: 'a long test password' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ verified: true });
    expect((await harness.directory.getSession(session.sessionId))?.mfaSatisfiedAt).toBe(
      harness.clock.now().toISOString(),
    );
    expect(harness.identity.signOuts).toEqual([`provider-session-${session.userId}`]);
  });
});
