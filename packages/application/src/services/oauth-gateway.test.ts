import {
  createFakeConnector,
  createCodeChallenge,
  generateCodeVerifier,
  generateState,
} from '@relay/connectors';
import { ProviderHttpClient } from '@relay/connectors';
import { describe, expect, it } from 'vitest';

import { createOAuthGateway } from './oauth-gateway';

const clock = {
  now: () => new Date('2026-08-07T12:00:00.000Z'),
};

const redirectUri = 'https://api.example.test/v1/connections/callback/fake';

function httpReturning(body: unknown): ProviderHttpClient {
  return new ProviderHttpClient({
    provider: 'fake',
    clock,
    fetchImpl: async () =>
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
  });
}

function gateway(
  options: {
    readonly http?: ProviderHttpClient;
    readonly providerSpecific?: boolean;
  } = {},
) {
  const connector = createFakeConnector({ instant: true, clock });
  if (options.providerSpecific === true) {
    const originalAuthorization = connector.authorization();
    Object.defineProperty(connector, 'authorization', {
      value: () => ({ ...originalAuthorization, flavor: 'provider_specific' }),
    });
  }
  return createOAuthGateway({
    resolver: {
      resolve(provider) {
        if (provider !== 'fake') return null;
        return {
          connector,
          http:
            options.http ?? httpReturning({ access_token: 'oauth-access-token', expires_in: 3600 }),
          client: {
            clientId: 'fake-client-id',
            clientSecret: null,
            redirectUri,
          },
        };
      },
    },
  });
}

describe('application OAuth gateway', () => {
  it('builds a provider URL from the application-owned proof pair', async () => {
    const state = generateState();
    const verifier = generateCodeVerifier();
    const result = await gateway().beginOAuth({
      provider: 'fake',
      state,
      codeChallenge: createCodeChallenge(verifier),
      codeChallengeMethod: 'S256',
      redirectUri,
    });
    const url = new URL(result.authorizationUrl);
    expect(url.searchParams.get('state')).toBe(state);
    expect(url.searchParams.get('code_challenge')).toBe(createCodeChallenge(verifier));
    expect(result.requestedScopes).toEqual(['fake.read', 'fake.write']);
  });

  it('exchanges and discovers in memory, leaving persistence to the caller', async () => {
    const verifier = generateCodeVerifier();
    const result = await gateway({
      http: httpReturning({
        access_token: 'oauth-access-token',
        refresh_token: 'oauth-refresh-token',
        expires_in: 3600,
        scope: 'fake.read',
      }),
    }).completeOAuth({
      provider: 'fake',
      workspaceId: 'ws_oauth_test',
      code: 'authorization-code',
      codeVerifier: verifier,
      expectedCodeChallenge: createCodeChallenge(verifier),
      redirectUri,
    });
    expect(result.accounts.some((account) => account.eligible)).toBe(true);
    expect(result.credential.accessToken.reveal()).toBe('oauth-access-token');
    expect(JSON.stringify(result)).not.toContain('oauth-refresh-token');
  });

  it('rejects a callback URI that is not the configured exact URI', async () => {
    await expect(
      gateway().beginOAuth({
        provider: 'fake',
        state: generateState(),
        codeChallenge: createCodeChallenge(generateCodeVerifier()),
        codeChallengeMethod: 'S256',
        redirectUri: 'https://evil.example.test/callback',
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
  });

  it('reports an unavailable provider as not implemented', async () => {
    await expect(
      gateway().beginOAuth({
        provider: 'x',
        state: generateState(),
        codeChallenge: createCodeChallenge(generateCodeVerifier()),
        codeChallengeMethod: 'S256',
        redirectUri,
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
  });

  it('does not guess at provider-specific token exchange semantics', async () => {
    const verifier = generateCodeVerifier();
    await expect(
      gateway({
        providerSpecific: true,
        http: httpReturning({ access_token: 'should-not-be-used' }),
      }).completeOAuth({
        provider: 'fake',
        workspaceId: 'ws_oauth_test',
        code: 'authorization-code',
        codeVerifier: verifier,
        expectedCodeChallenge: createCodeChallenge(verifier),
        redirectUri,
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
  });
});
