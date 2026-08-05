import type { ProviderId } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import type { ConnectorRegistry, SocialConnector } from './shared/contract-shape.js';
import { createTestDeps } from './shared/testing.js';
import {
  BUILT_IN_PROVIDERS,
  missingCredentials,
  providerStatus,
  registerBuiltInProviders,
} from './index.js';

function recordingRegistry(): {
  registry: ConnectorRegistry;
  registered: ProviderId[];
  unavailable: { provider: ProviderId; status: string }[];
} {
  const registered: ProviderId[] = [];
  const unavailable: { provider: ProviderId; status: string }[] = [];
  const registry: ConnectorRegistry = {
    register(connector: SocialConnector) {
      registered.push(connector.identity().provider);
    },
    markUnavailable(provider: ProviderId, status: string) {
      unavailable.push({ provider, status });
    },
  };
  return { registry, registered, unavailable };
}

describe('registerBuiltInProviders', () => {
  it('registers every provider when all credentials are configured', () => {
    const { deps } = createTestDeps();
    const { registry, registered, unavailable } = recordingRegistry();
    const outcomes = registerBuiltInProviders(registry, deps);
    expect(registered).toHaveLength(BUILT_IN_PROVIDERS.length);
    expect(unavailable).toHaveLength(0);
    expect(outcomes.every((outcome) => outcome.status === 'live')).toBe(true);
  });

  it('names the exact variables to set for a provider with no credentials', () => {
    const { deps } = createTestDeps({ providers: { x: {} } });
    const { registry, registered, unavailable } = recordingRegistry();
    registerBuiltInProviders(registry, deps);
    expect(registered).not.toContain('x');
    expect(unavailable).toContainEqual({
      provider: 'x',
      status: 'disabled:missing X_CLIENT_ID, X_CLIENT_SECRET',
    });
  });

  it('reports a partially configured provider with only the missing variable', () => {
    const { deps } = createTestDeps({ providers: { linkedin: { clientId: 'set' } } });
    expect(providerStatus(deps.config, 'linkedin')).toBe(
      'disabled:missing LINKEDIN_CLIENT_SECRET',
    );
    expect(missingCredentials(deps.config, 'linkedin')).toEqual(['LINKEDIN_CLIENT_SECRET']);
  });

  it('disables all three Meta surfaces together, because they share one app', () => {
    const { deps } = createTestDeps({ providers: { meta: {} } });
    const { registry, registered, unavailable } = recordingRegistry();
    registerBuiltInProviders(registry, deps);
    for (const provider of ['instagram', 'facebook', 'threads'] as const) {
      expect(registered).not.toContain(provider);
      expect(unavailable).toContainEqual({
        provider,
        status: 'disabled:missing META_APP_ID, META_APP_SECRET',
      });
    }
  });

  it('keeps Bluesky available without an application credential', () => {
    const { deps } = createTestDeps({ providers: { bluesky: {} } });
    expect(providerStatus(deps.config, 'bluesky')).toBe('live');
    const { registry, registered } = recordingRegistry();
    registerBuiltInProviders(registry, deps);
    expect(registered).toContain('bluesky');
  });

  it('does not let one unconfigured provider break the others', () => {
    const { deps } = createTestDeps({ providers: { x: {}, tiktok: {} } });
    const { registry, registered } = recordingRegistry();
    registerBuiltInProviders(registry, deps);
    expect(registered).toContain('linkedin');
    expect(registered).toContain('youtube');
    expect(registered).toContain('bluesky');
    expect(registered).not.toContain('x');
    expect(registered).not.toContain('tiktok');
  });
});

describe('provider identities', () => {
  it('gives every provider a distinct identity with an owner and a review date', () => {
    const { deps } = createTestDeps();
    const { registry, registered } = recordingRegistry();
    registerBuiltInProviders(registry, deps);
    expect(new Set(registered).size).toBe(BUILT_IN_PROVIDERS.length);
  });
});
