import { socialOAuthCallbackUrl } from '@relay/application';
import { detectCapabilities, loadConfigFor } from '@relay/config';
import { createConnectorRegistry, registerBuiltInProviders } from '@relay/connectors';
import { ProviderHttpClient, connectorVaultFromHandles } from '@relay/connectors';
import { createLogger } from '@relay/observability';
import { describe, expect, it } from 'vitest';

import { createOAuthProviderResolver } from './oauth-provider-resolver';
import { VerifiedConnectorRegistry, connectorLogger } from './verified-connectors';

/**
 * The resolver is the only place the adapter, the client credentials and the
 * callback URL meet. Two properties matter and are asserted here: the redirect
 * URI it hands the token endpoint is the one `beginOAuth` stored (otherwise
 * every callback fails the binding check), and an unconfigured provider
 * resolves to `null` rather than to a half-built binding.
 */

const clock = { now: () => new Date('2026-08-12T00:00:00.000Z') };
const logger = createLogger({ service: 'resolver-test' }, { level: 'silent' });

const X_CLIENT_ID = 'x-client-id-placeholder';
const X_CLIENT_SECRET = 'x-client-secret-placeholder';

function config(overrides: Record<string, string> = {}) {
  return loadConfigFor('api', {
    NODE_ENV: 'development',
    APP_URL: 'https://app.example.test',
    API_URL: 'https://api.example.test',
    DATABASE_URL: 'postgresql://relay:relay@localhost:5432/relay',
    TOKEN_ENCRYPTION_LOCAL_KEY: Buffer.alloc(32, 9).toString('base64'),
    ...overrides,
  });
}

/** A registry with every built-in adapter registered and `x` forced live. */
function registryFor(relayConfig: ReturnType<typeof config>): VerifiedConnectorRegistry {
  const registry = createConnectorRegistry([], { clock });
  const http = new ProviderHttpClient({
    provider: 'fake',
    clock,
    logger: connectorLogger(logger),
  });
  registerBuiltInProviders(
    registry,
    {
      http: http.asHttpClient(),
      vault: connectorVaultFromHandles(new Map()),
      clock,
      logger: connectorLogger(logger),
      config: relayConfig,
      redirectBaseUrl: 'https://api.example.test',
    },
    { verifiedProviders: ['x'] },
  );
  const detected = detectCapabilities(relayConfig);
  return new VerifiedConnectorRegistry(
    registry,
    { ...detected, connectors: { ...detected.connectors, x: 'live' as const } },
    relayConfig,
  );
}

function resolverFor(overrides: Record<string, string> = {}) {
  const relayConfig = config(overrides);
  return createOAuthProviderResolver({
    base: registryFor(relayConfig),
    config: relayConfig,
    logger,
    clock,
  });
}

const CONFIGURED = { X_CLIENT_ID, X_CLIENT_SECRET };

describe('oauth provider resolver', () => {
  it('builds the same redirect URI the application stored when it began the handshake', () => {
    const binding = resolverFor(CONFIGURED).resolve('x');

    expect(binding).not.toBeNull();
    expect(binding?.client.redirectUri).toBe(
      socialOAuthCallbackUrl('https://api.example.test', 'x'),
    );
    expect(binding?.client.redirectUri).toBe('https://api.example.test/v1/connections/callback/x');
  });

  it('gives the provider its own HTTP client instead of the registry introspection one', () => {
    const binding = resolverFor(CONFIGURED).resolve('x');

    // The shared client is deliberately constructed with `provider: 'fake'`.
    // Reusing it would file real token calls under the fake provider's rate
    // limit buckets and error taxonomy.
    expect(binding?.http.provider).toBe('x');
  });

  it('returns null for a provider that is not verified in this environment', () => {
    expect(resolverFor(CONFIGURED).resolve('linkedin')).toBeNull();
  });

  it('returns null when the client secret is absent, rather than a half-built binding', () => {
    expect(resolverFor({ X_CLIENT_ID }).resolve('x')).toBeNull();
  });

  it('returns null for providers whose official flow is not an authorization code', () => {
    // Bluesky has no OAuth client at all; it connects with an app password.
    expect(resolverFor(CONFIGURED).resolve('bluesky')).toBeNull();
  });
});
