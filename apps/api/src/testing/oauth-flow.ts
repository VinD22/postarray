import { randomBytes } from 'node:crypto';

import { newIdFor, type Scope } from '@relay/contracts';
import request from 'supertest';

import { deriveChallenge } from '../oauth-provider/pkce';
import { hashSecret } from '../security/credentials';
import { oauthClientRecordSchema, type OAuthClientRecord } from '../security/records';
import type { Services } from '../application/port';
import {
  TEST_ACCEPT_LANGUAGE,
  TEST_ORIGIN,
  TEST_USER_AGENT,
  type Harness,
  type SeededSession,
} from './harness';

/**
 * Helpers for driving the OAuth authorization code flow through the real
 * application in tests. The flow is the one a real client walks: authorize,
 * read the consent data, approve, exchange the code.
 */

export const TEST_CLIENT_ID = 'rly_pk_testclient';
export const TEST_REDIRECT_URI = 'https://partner.example/callback';
/** Matches `testConfig().oauth.resourceServer` in `fakes.ts`. */
export const TEST_MCP_RESOURCE = 'https://mcp.relay.test/mcp';
export const TEST_RESOURCE_SERVER_CLIENT_ID = 'rly_rs_mcp_test';
export const TEST_RESOURCE_SERVER_SECRET = 'resource-server-secret-for-tests-only';

/** Grants are recorded by the application layer; the suite records them in memory. */
export function withRecordedGrants(recorded: { grantId: string; workspaceId: string }[] = []) {
  return (base: Services): Services => ({
    ...base,
    oauthApps: {
      ...base.oauthApps,
      recordGrant: async (ctx) => {
        const grantId = newIdFor('oauthGrant');
        recorded.push({ grantId, workspaceId: ctx.workspaceId });
        return { grantId };
      },
    },
  });
}

/**
 * Dynamic registration as the application layer performs it: a row (here, a
 * count) and the edge record the authorization server reads.
 */
export function withDynamicRegistration(
  harness: () => Harness,
  registered: string[] = [],
): (base: Services) => Services {
  return (base: Services): Services => ({
    ...base,
    oauthApps: {
      ...base.oauthApps,
      registerDynamicClient: async (input) => {
        const current = harness();
        const clientId = `rly_dc_${randomBytes(12).toString('base64url')}`;
        const record = clientRecord(current, {
          clientId,
          workspaceId: null,
          name: input.name,
          redirectUris: [...input.redirectUris],
          allowedScopes: [...input.allowedScopes],
          homepageUrl: '',
          privacyPolicyUrl: '',
          termsUrl: '',
          supportEmail: '',
          registration: 'dynamic',
        });
        await current.directory.putOAuthClient(record);
        registered.push(clientId);
        return {
          appId: record.appId,
          clientId,
          name: record.name,
          redirectUris: record.redirectUris,
          allowedScopes: record.allowedScopes,
          createdAt: record.createdAt,
        };
      },
    },
  });
}

export function clientRecord(
  harness: Harness,
  overrides: Partial<OAuthClientRecord> = {},
): OAuthClientRecord {
  return oauthClientRecordSchema.parse({
    clientId: TEST_CLIENT_ID,
    appId: newIdFor('oauthClient'),
    workspaceId: newIdFor('workspace'),
    name: 'Partner App',
    clientType: 'public',
    secretHash: null,
    previousSecretHash: null,
    previousSecretExpiresAt: null,
    redirectUris: [TEST_REDIRECT_URI],
    homepageUrl: 'https://partner.example',
    privacyPolicyUrl: 'https://partner.example/privacy',
    termsUrl: 'https://partner.example/terms',
    logoUrl: null,
    supportEmail: 'support@partner.example',
    allowedScopes: ['drafts:read', 'drafts:write'],
    firstParty: false,
    disabledAt: null,
    createdAt: harness.clock.now().toISOString(),
    ...overrides,
  });
}

/** The MCP server's own confidential client, as the registration script writes it. */
export async function registerResourceServerClient(harness: Harness): Promise<void> {
  await harness.directory.putOAuthClient(
    clientRecord(harness, {
      clientId: TEST_RESOURCE_SERVER_CLIENT_ID,
      workspaceId: null,
      name: 'Post Array MCP server',
      clientType: 'confidential',
      secretHash: hashSecret(TEST_RESOURCE_SERVER_SECRET, harness.directory.pepper),
      redirectUris: [],
      homepageUrl: '',
      privacyPolicyUrl: '',
      termsUrl: '',
      supportEmail: '',
      allowedScopes: [],
      firstParty: true,
      registration: 'resource_server',
    }),
  );
}

export function pkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(48).toString('base64url');
  return { verifier, challenge: deriveChallenge(verifier) };
}

export function redirectLocation(response: {
  headers: Record<string, string | undefined>;
}): string {
  const location = response.headers['location'];
  if (location === undefined) {
    throw new Error('expected a Location header on this redirect response');
  }
  return location;
}

export function authed(call: request.Test, session: SeededSession): request.Test {
  return call
    .set('cookie', session.cookie)
    .set('origin', TEST_ORIGIN)
    .set('x-relay-csrf-token', session.csrfToken)
    .set('user-agent', TEST_USER_AGENT)
    .set('accept-language', TEST_ACCEPT_LANGUAGE);
}

export interface FlowOptions {
  readonly clientId?: string;
  readonly redirectUri?: string;
  readonly scope?: string;
  readonly resource?: string;
  readonly grantedScopes?: readonly Scope[];
}

export interface FlowResult {
  readonly code: string;
  readonly verifier: string;
  readonly state: string;
  readonly redirectTo: URL;
  /** What `GET /oauth/consent` returned for this request. */
  readonly consentData: { readonly client: Record<string, unknown> };
}

/** Authorize, read consent, approve. Returns the code and its verifier. */
export async function approveAuthorization(
  harness: Harness,
  session: SeededSession,
  options: FlowOptions = {},
): Promise<FlowResult> {
  const { verifier, challenge } = pkcePair();
  const state = randomBytes(16).toString('base64url');
  const authorize = await authed(
    request(harness.server)
      .get('/oauth/authorize')
      .query({
        response_type: 'code',
        client_id: options.clientId ?? TEST_CLIENT_ID,
        redirect_uri: options.redirectUri ?? TEST_REDIRECT_URI,
        scope: options.scope ?? 'drafts:read',
        state,
        code_challenge: challenge,
        code_challenge_method: 'S256',
        ...(options.resource === undefined ? {} : { resource: options.resource }),
      }),
    session,
  );
  if (authorize.status !== 302) {
    throw new Error(`authorize answered ${authorize.status}`);
  }
  const requestId = new URL(redirectLocation(authorize)).searchParams.get('request_id');
  const consentData = await authed(
    request(harness.server).get('/oauth/consent').query({ request_id: requestId }),
    session,
  );
  const scopes =
    options.grantedScopes ??
    (consentData.body.scopes as { scope: Scope }[]).map((entry) => entry.scope);
  const consent = await authed(request(harness.server).post('/oauth/consent'), session).send({
    requestId,
    consentNonce: consentData.body.consentNonce,
    decision: 'approve',
    workspaceId: session.workspaceId,
    grantedScopes: scopes,
    consentVersionHash: 'b'.repeat(64),
  });
  if (consent.status !== 200) {
    throw new Error(`consent answered ${consent.status}`);
  }
  const redirectTo = new URL(consent.body.redirectTo as string);
  const code = redirectTo.searchParams.get('code');
  if (code === null) {
    throw new Error('consent did not return a code');
  }
  return { code, verifier, state, redirectTo, consentData: consentData.body };
}
