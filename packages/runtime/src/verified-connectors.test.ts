import { loadConfigFor } from '@relay/config';
import { createLogger } from '@relay/observability';
import { describe, expect, it } from 'vitest';

import {
  buildVerifiedOAuthAuthorizationUrl,
  createVerifiedConnectorRegistry,
} from './verified-connectors';

const OAUTH_STATE = 's'.repeat(43);
const OAUTH_CHALLENGE = 'c'.repeat(43);

function config(overrides: Record<string, string> = {}) {
  return loadConfigFor('api', {
    NODE_ENV: 'development',
    APP_URL: 'https://app.example.test',
    API_URL: 'https://api.example.test',
    DATABASE_URL: 'postgresql://relay:relay@localhost:5432/relay',
    TOKEN_ENCRYPTION_LOCAL_KEY: Buffer.alloc(32, 3).toString('base64'),
    ...overrides,
  });
}

const logger = createLogger({ service: 'verified-connectors-test' }, { level: 'silent' });

describe('createVerifiedConnectorRegistry', () => {
  it('keeps application-owned state and PKCE values in the provider URL', () => {
    const result = buildVerifiedOAuthAuthorizationUrl({
      definition: {
        flavor: 'oauth2_pkce',
        authorizeUrl: 'https://provider.example.test/oauth/authorize',
        tokenUrl: 'https://provider.example.test/oauth/token',
        revokeUrl: null,
        redirectPath: '/oauth/test/callback',
        scopes: [
          {
            scope: 'profile.read',
            explanationKey: 'connectors.test.scope.profile',
            usedBy: ['connections'],
            required: true,
          },
        ],
        pkceRequired: true,
        multiStep: false,
        stepDescriptionKeys: [],
        supportsRefresh: true,
        refreshAtLifetimeFraction: 0.75,
        extraAuthorizeParameters: {
          prompt: 'consent',
          state: 'connector_must_not_replace_state',
          code_challenge: 'connector_must_not_replace_challenge',
          code_challenge_method: 'plain',
        },
      },
      clientId: 'client_test',
      state: OAUTH_STATE,
      codeChallenge: OAUTH_CHALLENGE,
      codeChallengeMethod: 'S256',
      redirectUri: 'https://api.example.test/v1/connections/callback/x',
    });

    const url = new URL(result.authorizationUrl);
    expect(url.searchParams.get('state')).toBe(OAUTH_STATE);
    expect(url.searchParams.get('code_challenge')).toBe(OAUTH_CHALLENGE);
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('redirect_uri')).toBe(
      'https://api.example.test/v1/connections/callback/x',
    );
    expect(url.searchParams.get('prompt')).toBe('consent');
    expect(result.requestedScopes).toEqual(['profile.read']);
  });

  it('refuses provider-specific authorization flows in the generic OAuth gate', () => {
    expect(() =>
      buildVerifiedOAuthAuthorizationUrl({
        definition: {
          flavor: 'provider_specific',
          authorizeUrl: 'https://provider.example.test/settings',
          tokenUrl: 'https://provider.example.test/token',
          revokeUrl: null,
          redirectPath: '/oauth/test/callback',
          scopes: [],
          pkceRequired: false,
          multiStep: false,
          stepDescriptionKeys: [],
          supportsRefresh: false,
          refreshAtLifetimeFraction: 0.75,
          extraAuthorizeParameters: {},
        },
        clientId: 'client_test',
        state: OAUTH_STATE,
        codeChallenge: OAUTH_CHALLENGE,
        codeChallengeMethod: 'S256',
        redirectUri: 'https://api.example.test/v1/connections/callback/x',
      }),
    ).toThrowError(expect.objectContaining({ code: 'CAPABILITY_NOT_IMPLEMENTED' }));
  });

  it('registers the complete adapter matrix but exposes no unverified provider', () => {
    const registry = createVerifiedConnectorRegistry({
      config: config(),
      logger,
      clock: { now: () => new Date('2026-08-07T00:00:00.000Z') },
    });

    expect(registry.has('bluesky')).toBe(false);
    expect(registry.has('x')).toBe(false);
    expect(registry.has('fake')).toBe(false);
  });

  it('does not let configured credentials bypass the verification gate', () => {
    const registry = createVerifiedConnectorRegistry({
      config: config({ X_CLIENT_ID: 'client-id', X_CLIENT_SECRET: 'client-secret' }),
      logger,
      clock: { now: () => new Date('2026-08-07T00:00:00.000Z') },
    });

    expect(registry.has('x')).toBe(false);
  });

  it('fails capability execution closed until the shared gateway is wired', async () => {
    const registry = createVerifiedConnectorRegistry({
      config: config(),
      logger,
      clock: { now: () => new Date('2026-08-07T00:00:00.000Z') },
    });

    await expect(
      registry.capabilitiesFor({
        provider: 'bluesky',
        connectionId: 'conn_test',
        accountType: 'personal_profile',
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
  });

  it('fails OAuth start closed while the verified allow-list is empty', async () => {
    const registry = createVerifiedConnectorRegistry({
      config: config({ X_CLIENT_ID: 'client-id', X_CLIENT_SECRET: 'client-secret' }),
      logger,
      clock: { now: () => new Date('2026-08-07T00:00:00.000Z') },
    });

    await expect(
      registry.beginOAuth({
        provider: 'x',
        state: OAUTH_STATE,
        codeChallenge: OAUTH_CHALLENGE,
        codeChallengeMethod: 'S256',
        redirectUri: 'https://api.example.test/v1/connections/callback/x',
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
  });
});
