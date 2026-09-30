import { API_HEADERS, newIdFor } from '@relay/contracts';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';

import {
  TEST_ACCEPT_LANGUAGE,
  TEST_ORIGIN,
  TEST_USER_AGENT,
  createHarness,
  seedSession,
  type Harness,
} from '../../testing/harness';

// In production the API is api.postarray.com and the web app is postarray.com.
// A host-only session cookie on the API host is invisible to the web host, so
// sign-in "worked" and every page then redirected back to sign-in.

let harness: Harness | undefined;
const USER_ID = newIdFor('user');

afterEach(async () => {
  await harness?.close();
  harness = undefined;
});

async function harnessWithDomain(domain: string | undefined): Promise<Harness> {
  return createHarness({
    config: (base) => ({ ...base, core: { ...base.core, sessionCookieDomain: domain } }),
    services: (base) => ({
      ...base,
      identity: {
        ...base.identity,
        resolveLoginIdentifier: (identifier) =>
          Promise.resolve({ userId: USER_ID, email: identifier }),
        linkProviderIdentity: () => Promise.resolve(USER_ID),
        getSecurityProfile: (userId) =>
          Promise.resolve({
            userId,
            email: 'owner@example.test',
            emailVerified: true,
            locale: 'en',
            approvalLevel: 'level_2_scheduled',
            workspaceIds: [],
            scopesByWorkspace: {},
            mfaEnrolled: false,
          }),
      },
    }),
  });
}

async function signIn(target: Harness): Promise<readonly string[]> {
  target.identity.seedIdentity({
    userId: 'identity_cookie_domain',
    email: 'owner@example.test',
    password: 'a long test password',
  });
  const response = await request(target.server)
    .post('/v1/auth/signin')
    .set('origin', TEST_ORIGIN)
    .set('user-agent', TEST_USER_AGENT)
    .set('accept-language', TEST_ACCEPT_LANGUAGE)
    .send({ identifier: 'owner@example.test', password: 'a long test password' });
  expect(response.status, JSON.stringify(response.body)).toBe(200);
  return setCookies(response.headers['set-cookie']);
}

function setCookies(header: unknown): readonly string[] {
  if (Array.isArray(header)) {
    return header.filter((value): value is string => typeof value === 'string');
  }
  return typeof header === 'string' ? [header] : [];
}

function cookieNamed(cookies: readonly string[], name: string): string {
  const found = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  expect(found, name).toBeDefined();
  return found ?? '';
}

describe('session cookie domain', () => {
  it('scopes every session cookie to the shared domain at sign-in', async () => {
    harness = await harnessWithDomain('relay.test');
    const cookies = await signIn(harness);

    for (const name of ['relay_session', 'relay_refresh', 'relay_csrf']) {
      expect(cookieNamed(cookies, name)).toContain('Domain=relay.test');
    }
  });

  it('keeps cookies host-only when no shared domain applies', async () => {
    harness = await harnessWithDomain(undefined);
    const cookies = await signIn(harness);

    for (const name of ['relay_session', 'relay_refresh', 'relay_csrf']) {
      expect(cookieNamed(cookies, name)).not.toContain('Domain=');
    }
  });

  it('expires the cookies on the same domain at sign-out, or the browser keeps them', async () => {
    harness = await harnessWithDomain('relay.test');
    const session = await seedSession(harness);

    const response = await request(harness.server)
      .post('/v1/auth/signout')
      .set('cookie', session.cookie)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .send({});

    expect(response.status).toBe(200);
    const cookies = setCookies(response.headers['set-cookie']);
    for (const name of ['relay_session', 'relay_refresh', 'relay_csrf']) {
      const cookie = cookieNamed(cookies, name);
      expect(cookie).toContain('Domain=relay.test');
      expect(cookie).toContain('Max-Age=0');
    }
  });
});
