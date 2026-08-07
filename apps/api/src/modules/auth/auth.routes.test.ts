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
    brands: [],
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
