import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import type { AuthorizationDefinition, OAuthClientConfig } from './contract';
import { ProviderHttpClient } from './http';
import {
  CODE_CHALLENGE_METHOD,
  assertRedirectAllowed,
  createAuthorizationUrl,
  createAuthorizationRequest,
  createCodeChallenge,
  exchangeAndDiscoverAccounts,
  exchangeAuthorizationCode,
  generateCodeVerifier,
  generateState,
  matchesRegisteredRedirect,
  normalizeRedirectUri,
  refreshAccessToken,
  refreshDueAt,
  revokeCredential,
  verifyCodeChallenge,
  verifyState,
} from './oauth';
import { createFakeConnector } from './fake';
import { fixedClock, recordingSleeper } from './ports';
import { SecretValue, leaseSecret } from './vault';

const clock = fixedClock('2026-08-04T12:00:00.000Z');

const definition: AuthorizationDefinition = {
  flavor: 'oauth2_pkce',
  authorizeUrl: 'https://fake.invalid/oauth/authorize',
  tokenUrl: 'https://fake.invalid/oauth/token',
  revokeUrl: 'https://fake.invalid/oauth/revoke',
  redirectPath: '/v1/connections/callback/fake',
  scopes: [
    {
      scope: 'fake.read',
      explanationKey: 'connection.permissions.whyNeeded',
      usedBy: ['connections'],
      required: true,
    },
    {
      scope: 'fake.optional',
      explanationKey: 'connection.permissions.whyNeeded',
      usedBy: ['analytics'],
      required: false,
    },
  ],
  pkceRequired: true,
  multiStep: false,
  stepDescriptionKeys: [],
  supportsRefresh: true,
  refreshAtLifetimeFraction: 0.75,
  extraAuthorizeParameters: { prompt: 'consent' },
};

const client: OAuthClientConfig = {
  clientId: 'fake-client-id',
  clientSecret: new SecretValue('fake-client-secret', 'client_secret'),
  redirectUri: 'https://app.invalid/v1/connections/callback/fake',
};

function httpReturning(
  body: unknown,
  status = 200,
): { http: ProviderHttpClient; bodies: string[] } {
  const bodies: string[] = [];
  const http = new ProviderHttpClient({
    provider: 'fake',
    clock,
    sleeper: recordingSleeper(),
    fetchImpl: async (_url, init) => {
      bodies.push(typeof init?.body === 'string' ? init.body : '');
      return new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      });
    },
  });
  return { http, bodies };
}

describe('PKCE', () => {
  it('produces the RFC 7636 appendix B challenge', () => {
    expect(createCodeChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    );
  });

  it('generates a verifier in the legal length range', () => {
    const verifier = generateCodeVerifier();
    expect(verifier.reveal().length).toBeGreaterThanOrEqual(43);
    expect(verifier.reveal().length).toBeLessThanOrEqual(128);
    expect(String(verifier)).toBe('[redacted]');
  });

  it('only ever uses S256', () => {
    expect(CODE_CHALLENGE_METHOD).toBe('S256');
  });
});

describe('state', () => {
  it('generates unpredictable values and compares them exactly', () => {
    const state = generateState();
    expect(state.length).toBeGreaterThanOrEqual(43);
    expect(verifyState(state, state)).toBe(true);
    expect(verifyState(state, `${state}x`)).toBe(false);
    expect(verifyState(state, '')).toBe(false);
    expect(verifyState('', '')).toBe(false);
  });
});

describe('redirect matching', () => {
  it('normalizes the default port away', () => {
    expect(normalizeRedirectUri('https://app.invalid:443/cb')).toBe('https://app.invalid/cb');
  });

  it('rejects a fragment', () => {
    expect(() => normalizeRedirectUri('https://app.invalid/cb#frag')).toThrow(RelayError);
  });

  it('rejects plain http on a public host', () => {
    expect(() => normalizeRedirectUri('http://app.invalid/cb')).toThrow(RelayError);
  });

  it('rejects localhost by name and accepts the loopback address', () => {
    expect(() => normalizeRedirectUri('http://localhost:8123/cb')).toThrow(RelayError);
    expect(normalizeRedirectUri('http://127.0.0.1:8123/cb')).toBe('http://127.0.0.1:8123/cb');
  });

  it('matches exactly, with no prefix or wildcard tolerance', () => {
    expect(matchesRegisteredRedirect('https://app.invalid/cb', 'https://app.invalid/cb')).toBe(
      true,
    );
    expect(
      matchesRegisteredRedirect('https://app.invalid/cb', 'https://app.invalid/cb/extra'),
    ).toBe(false);
    expect(matchesRegisteredRedirect('https://app.invalid/cb', 'https://evil.invalid/cb')).toBe(
      false,
    );
    expect(matchesRegisteredRedirect('https://app.invalid/cb', 'https://app.invalid.evil/cb')).toBe(
      false,
    );
  });

  it('ignores the loopback port for a native client', () => {
    expect(matchesRegisteredRedirect('http://127.0.0.1:1234/cb', 'http://127.0.0.1:56789/cb')).toBe(
      true,
    );
    expect(
      matchesRegisteredRedirect('http://127.0.0.1:1234/cb', 'http://127.0.0.1:56789/other'),
    ).toBe(false);
  });

  it('throws when the candidate is not registered', () => {
    expect(() =>
      assertRedirectAllowed(['https://app.invalid/cb'], 'https://evil.invalid/cb'),
    ).toThrow(RelayError);
    expect(assertRedirectAllowed(['https://app.invalid/cb'], 'https://app.invalid/cb')).toBe(
      'https://app.invalid/cb',
    );
  });
});

describe('createAuthorizationRequest', () => {
  it('builds an authorize URL with PKCE and the required scopes only', () => {
    const request = createAuthorizationRequest({ definition, client, clock });
    const url = new URL(request.authorizationUrl);
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('client_id')).toBe('fake-client-id');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('code_challenge')).toBe(createCodeChallenge(request.codeVerifier));
    expect(url.searchParams.get('scope')).toBe('fake.read');
    expect(url.searchParams.get('prompt')).toBe('consent');
    expect(request.expiresAt).toBe('2026-08-04T12:10:00.000Z');
  });

  it('never puts the verifier in the URL', () => {
    const request = createAuthorizationRequest({ definition, client, clock });
    expect(request.authorizationUrl).not.toContain(request.codeVerifier.reveal());
  });

  it('uses application-owned state and challenge without generating a second pair', () => {
    const state = generateState();
    const verifier = generateCodeVerifier();
    const challenge = createCodeChallenge(verifier);
    const result = createAuthorizationUrl({
      definition,
      client,
      state,
      codeChallenge: challenge,
    });
    const url = new URL(result.authorizationUrl);
    expect(url.searchParams.get('state')).toBe(state);
    expect(url.searchParams.get('code_challenge')).toBe(challenge);
    expect(url.searchParams.get('code_challenge_method')).toBe(CODE_CHALLENGE_METHOD);
    expect(result.redirectUri).toBe(client.redirectUri);
    expect(result.scopes).toEqual(['fake.read']);
  });

  it('rejects low-entropy application proof material', () => {
    expect(() =>
      createAuthorizationUrl({
        definition,
        client,
        state: 'short-state',
        codeChallenge: 'short-challenge',
      }),
    ).toThrow(RelayError);
  });
});

describe('application-owned OAuth proof', () => {
  it('verifies a callback verifier against the stored challenge', () => {
    const verifier = generateCodeVerifier();
    const challenge = createCodeChallenge(verifier);
    expect(verifyCodeChallenge(challenge, verifier)).toBe(true);
    expect(verifyCodeChallenge(challenge, generateCodeVerifier())).toBe(false);
  });

  it('exchanges and discovers accounts without persisting credential material', async () => {
    const { http } = httpReturning({
      access_token: 'oauth-access-token',
      refresh_token: 'oauth-refresh-token',
      expires_in: 3600,
      scope: 'fake.read',
    });
    const verifier = generateCodeVerifier();
    const result = await exchangeAndDiscoverAccounts({
      connector: createFakeConnector({ instant: true, clock }),
      http,
      provider: 'fake',
      definition,
      client,
      workspaceId: 'ws_oauth_test',
      code: 'authorization-code',
      codeVerifier: verifier,
      expectedCodeChallenge: createCodeChallenge(verifier),
      clock,
    });
    expect(result.accounts.length).toBeGreaterThan(0);
    expect(result.accounts[0]?.eligible).toBe(true);
    expect(result.credential.accessToken.reveal()).toBe('oauth-access-token');
    expect(JSON.stringify(result)).not.toContain('oauth-access-token');
    expect(JSON.stringify(result)).not.toContain('oauth-refresh-token');
  });

  it('rejects a verifier mismatch before contacting the token endpoint', async () => {
    const { http, bodies } = httpReturning({ access_token: 'should-not-be-used' });
    const verifier = generateCodeVerifier();
    await expect(
      exchangeAndDiscoverAccounts({
        connector: createFakeConnector({ instant: true, clock }),
        http,
        provider: 'fake',
        definition,
        client,
        workspaceId: 'ws_oauth_test',
        code: 'authorization-code',
        codeVerifier: verifier,
        expectedCodeChallenge: createCodeChallenge(generateCodeVerifier()),
        clock,
      }),
    ).rejects.toThrow(RelayError);
    expect(bodies).toEqual([]);
  });

  it('does not guess at provider-specific exchange semantics', async () => {
    const { http } = httpReturning({ access_token: 'not-used' });
    const verifier = generateCodeVerifier();
    await expect(
      exchangeAndDiscoverAccounts({
        connector: createFakeConnector({ instant: true, clock }),
        http,
        provider: 'fake',
        definition: { ...definition, flavor: 'provider_specific' },
        client,
        workspaceId: 'ws_oauth_test',
        code: 'authorization-code',
        codeVerifier: verifier,
        expectedCodeChallenge: createCodeChallenge(verifier),
        clock,
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
  });
});

describe('token exchange', () => {
  it('exchanges a code and returns secrets that cannot be logged', async () => {
    const { http, bodies } = httpReturning({
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'fake.read fake.write',
    });
    const result = await exchangeAuthorizationCode({
      http,
      provider: 'fake',
      definition,
      client,
      code: 'auth-code',
      codeVerifier: new SecretValue('verifier-value'),
      clock,
    });
    expect(result.accessToken.reveal()).toBe('new-access-token');
    expect(result.refreshToken?.reveal()).toBe('new-refresh-token');
    expect(result.expiresAt).toBe('2026-08-04T13:00:00.000Z');
    expect(result.grantedScopes).toEqual(['fake.read', 'fake.write']);
    expect(JSON.stringify(result)).not.toContain('new-access-token');
    expect(bodies[0]).toContain('code_verifier=verifier-value');
    expect(bodies[0]).toContain('grant_type=authorization_code');
  });

  it('parses a form encoded token response', async () => {
    const http = new ProviderHttpClient({
      provider: 'fake',
      clock,
      sleeper: recordingSleeper(),
      fetchImpl: async () =>
        new Response('access_token=form-token&token_type=Bearer&expires_in=60', {
          status: 200,
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        }),
    });
    const result = await exchangeAuthorizationCode({
      http,
      provider: 'fake',
      definition,
      client,
      code: 'auth-code',
      codeVerifier: new SecretValue('verifier-value'),
      clock,
    });
    expect(result.accessToken.reveal()).toBe('form-token');
    expect(result.refreshToken).toBeNull();
    expect(result.refreshTokenRotated).toBe(false);
  });

  it('reports a rotated refresh token so both halves are stored together', async () => {
    const { http } = httpReturning({
      access_token: 'rotated-access',
      refresh_token: 'rotated-refresh',
      expires_in: '7200',
    });
    const handle = leaseSecret({
      secret: 'old-refresh',
      credentialKind: 'refresh_token',
      purpose: 'test',
      clock,
    });
    const result = await refreshAccessToken({
      http,
      provider: 'fake',
      definition,
      client,
      refreshToken: handle,
      clock,
    });
    handle.release();
    expect(result.refreshTokenRotated).toBe(true);
    expect(result.refreshToken?.reveal()).toBe('rotated-refresh');
    expect(result.expiresAt).toBe('2026-08-04T14:00:00.000Z');
  });

  it('refuses to refresh a provider that does not support it', async () => {
    const { http } = httpReturning({ access_token: 'x' });
    const handle = leaseSecret({
      secret: 'old-refresh',
      credentialKind: 'refresh_token',
      purpose: 'test',
      clock,
    });
    await expect(
      refreshAccessToken({
        http,
        provider: 'fake',
        definition: { ...definition, supportsRefresh: false },
        client,
        refreshToken: handle,
        clock,
      }),
    ).rejects.toBeInstanceOf(RelayError);
    handle.release();
  });
});

describe('revokeCredential', () => {
  it('reports success when the provider accepts the revoke', async () => {
    const { http } = httpReturning({});
    const handle = leaseSecret({
      secret: 'token-to-revoke',
      credentialKind: 'access_token',
      purpose: 'test',
      clock,
    });
    const outcome = await revokeCredential({
      http,
      provider: 'fake',
      definition,
      client,
      token: handle,
      clock,
    });
    handle.release();
    expect(outcome.revokedAtProvider).toBe(true);
  });

  it('never throws when the provider refuses, so we still delete our copy', async () => {
    const { http } = httpReturning({ message: 'gone' }, 500);
    const handle = leaseSecret({
      secret: 'token-to-revoke',
      credentialKind: 'access_token',
      purpose: 'test',
      clock,
    });
    const outcome = await revokeCredential({
      http,
      provider: 'fake',
      definition,
      client,
      token: handle,
      clock,
    });
    handle.release();
    expect(outcome.revokedAtProvider).toBe(false);
    expect(outcome.errorClass).toBe('TRANSIENT_PROVIDER');
  });

  it('is a no-op when the provider has no revoke endpoint', async () => {
    const { http } = httpReturning({});
    const handle = leaseSecret({
      secret: 'token',
      credentialKind: 'access_token',
      purpose: 'test',
      clock,
    });
    const outcome = await revokeCredential({
      http,
      provider: 'fake',
      definition: { ...definition, revokeUrl: null },
      client,
      token: handle,
      clock,
    });
    handle.release();
    expect(outcome.revokedAtProvider).toBe(false);
    expect(outcome.errorClass).toBeNull();
  });
});

describe('refreshDueAt', () => {
  it('lands at the configured fraction of the lifetime', () => {
    expect(
      refreshDueAt({
        obtainedAt: '2026-08-04T12:00:00.000Z',
        expiresAt: '2026-08-04T16:00:00.000Z',
        fraction: 0.75,
      }),
    ).toBe('2026-08-04T15:00:00.000Z');
  });

  it('returns null when the provider never expires the token', () => {
    expect(
      refreshDueAt({ obtainedAt: '2026-08-04T12:00:00.000Z', expiresAt: null, fraction: 0.75 }),
    ).toBeNull();
  });
});
