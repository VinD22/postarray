import { describe, expect, it } from 'vitest';

import type { RuntimeCapabilities } from '@relay/config';
import { NotFoundError, RelayError } from '@relay/contracts';

import {
  CONNECTOR_CONTRACT_VERSION,
  NOT_IMPLEMENTED_FEATURES,
  type ProviderIdentity,
  type SocialConnector,
} from './contract';
import { createFakeConnector } from './fake/index';
import { fixedClock } from './ports';
import { ConnectorRegistry, createConnectorRegistry } from './registry';

const clock = fixedClock('2026-08-04T12:00:00.000Z');

/** A connector that claims a feature it never implemented. */
function lyingConnector(overrides: Partial<ProviderIdentity>): SocialConnector {
  const base = createFakeConnector({ instant: true });
  const identity: ProviderIdentity = { ...base.identity(), ...overrides };
  const connector: SocialConnector = {
    identity: () => identity,
    authorization: () => base.authorization(),
    discoverAccounts: (input) => base.discoverAccounts(input),
    getCapabilities: (connection) => base.getCapabilities(connection),
    validateDraft: (input) => base.validateDraft(input),
    prepareMedia: (input) => base.prepareMedia(input),
    preview: (input) => base.preview(input),
    publish: (input) => base.publish(input),
    getStatus: (input) => base.getStatus(input),
    fetchMetrics: (input) => base.fetchMetrics(input),
    refreshCredential: (input) => base.refreshCredential(input),
  };
  return connector;
}

function runtimeCapabilities(fake: RuntimeCapabilities['connectors']['fake']): RuntimeCapabilities {
  return {
    database: 'live',
    redis: 'degraded:in-memory',
    temporal: 'degraded:inline-scheduler',
    storage: 'degraded:local-filesystem',
    auth: 'live',
    billing: 'disabled:missing POLAR_ACCESS_TOKEN',
    ai: 'live',
    email: 'degraded:console',
    shortLinks: 'disabled:missing SHORT_LINK_BASE_URL',
    oauthIssuer: 'live',
    encryption: 'live',
    tracing: 'disabled:missing OTEL_EXPORTER_OTLP_ENDPOINT',
    errorReporting: 'degraded:logs-only',
    productAnalytics: 'disabled:missing POSTHOG_KEY',
    connectors: {
      x: 'disabled:missing X_CLIENT_ID, X_CLIENT_SECRET',
      linkedin: 'disabled:missing LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET',
      instagram: 'disabled:missing META_APP_ID, META_APP_SECRET',
      facebook: 'disabled:missing META_APP_ID, META_APP_SECRET',
      threads: 'disabled:missing META_APP_ID, META_APP_SECRET',
      youtube: 'disabled:missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET',
      google_business_profile: 'disabled:missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET',
      tiktok: 'disabled:missing TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET',
      bluesky: 'live',
      mastodon: 'disabled:missing MASTODON_CLIENT_ID, MASTODON_CLIENT_SECRET',
      telegram: 'disabled:missing TELEGRAM_BOT_TOKEN',
      reddit: 'disabled:missing REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET',
      wordpress: 'disabled:missing WORDPRESS_CLIENT_ID, WORDPRESS_CLIENT_SECRET',
      medium: 'disabled:missing MEDIUM_CLIENT_ID, MEDIUM_CLIENT_SECRET',
      devto: 'disabled:missing DEVTO_API_KEY',
      pinterest: 'disabled:missing PINTEREST_CLIENT_ID, PINTEREST_CLIENT_SECRET',
      discord: 'disabled:missing DISCORD_BOT_TOKEN',
      slack: 'disabled:missing SLACK_CLIENT_ID, SLACK_CLIENT_SECRET',
      fake,
    },
  };
}

describe('ConnectorRegistry', () => {
  it('registers, looks up and lists connectors', () => {
    const registry = createConnectorRegistry([createFakeConnector({ instant: true })], { clock });
    expect(registry.has('fake')).toBe(true);
    expect(registry.providers()).toEqual(['fake']);
    expect(registry.get('fake').identity().provider).toBe('fake');
    expect(registry.list()).toHaveLength(1);
  });

  it('throws NOT_FOUND for a provider that is not in this build', () => {
    const registry = new ConnectorRegistry({ clock });
    expect(() => registry.get('tiktok')).toThrow(NotFoundError);
  });

  it('refuses a second registration of the same provider', () => {
    const registry = new ConnectorRegistry({ clock });
    registry.register(createFakeConnector({ instant: true }));
    expect(() => registry.register(createFakeConnector({ instant: true }))).toThrow(RelayError);
  });

  it('refuses a connector built against another contract version', () => {
    const registry = new ConnectorRegistry({ clock });
    expect(() =>
      registry.register(
        lyingConnector({
          contractVersion: '0.0.1',
          features: {
            ...NOT_IMPLEMENTED_FEATURES,
          },
        }),
      ),
    ).toThrow(RelayError);
    expect(CONNECTOR_CONTRACT_VERSION).toBe('1.0.0');
  });

  it('refuses a connector that declares a feature it never implemented', () => {
    const registry = new ConnectorRegistry({ clock });
    expect(() =>
      registry.register(
        lyingConnector({
          features: { ...NOT_IMPLEMENTED_FEATURES, list_destinations: 'supported' },
        }),
      ),
    ).toThrow(RelayError);
  });

  it('refuses a connector that hides a method it does implement', () => {
    const registry = new ConnectorRegistry({ clock });
    const connector = createFakeConnector({ instant: true });
    const identity = connector.identity();
    const hiding: SocialConnector = {
      ...connector,
      identity: () => ({
        ...identity,
        features: { ...identity.features, delete_post: 'unsupported' },
      }),
      deletePost: (input) => connector.deletePost(input),
      discoverAccounts: (input) => connector.discoverAccounts(input),
      authorization: () => connector.authorization(),
      getCapabilities: (input) => connector.getCapabilities(input),
      validateDraft: (input) => connector.validateDraft(input),
      prepareMedia: (input) => connector.prepareMedia(input),
      preview: (input) => connector.preview(input),
      publish: (input) => connector.publish(input),
      getStatus: (input) => connector.getStatus(input),
      fetchMetrics: (input) => connector.fetchMetrics(input),
      refreshCredential: (input) => connector.refreshCredential(input),
    };
    expect(() => registry.register(hiding)).toThrow(RelayError);
  });

  it('keeps unsupported, not_implemented and supported apart in the matrix', () => {
    const registry = createConnectorRegistry([createFakeConnector({ instant: true })], { clock });
    const matrix = registry.supportMatrix();
    const entry = matrix[0];
    expect(entry).toBeDefined();
    expect(entry?.features['publish']).toBe('supported');
    // We have not built a comment inbox on any connector in V1.
    expect(entry?.features['comment_replies']).toBe('not_implemented');
    expect(entry?.features['document']).toBe('not_implemented');
    expect(registry.featureSupport('fake', 'provider_idempotency')).toBe('not_implemented');
  });

  it('reports every feature exactly once', () => {
    const registry = createConnectorRegistry([createFakeConnector({ instant: true })], { clock });
    const descriptor = registry.describe('fake');
    const names = descriptor.features.map((feature) => feature.feature);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain('first_comment');
    expect(names).toContain('comment_count');
    expect(names).toContain('comment_replies');
  });

  it('hides a connector whose credentials are not configured', () => {
    const registry = new ConnectorRegistry({ clock });
    registry.register(createFakeConnector({ instant: true }), {
      configuration: 'disabled:missing FAKE_CLIENT_ID',
    });
    expect(registry.list()).toHaveLength(1);
    expect(registry.listAvailable()).toHaveLength(0);
    const unavailable = registry.listUnavailable();
    expect(unavailable[0]?.provider).toBe('fake');
    expect(unavailable[0]?.requiredEnvVars).toEqual(['FAKE_CLIENT_ID']);
  });

  it('reads the configuration from detected runtime capabilities', () => {
    const registry = createConnectorRegistry([createFakeConnector({ instant: true })], { clock });
    expect(registry.listAvailable(runtimeCapabilities('live'))).toHaveLength(1);
    expect(
      registry.listAvailable(runtimeCapabilities('disabled:missing FAKE_CLIENT_ID')),
    ).toHaveLength(0);
    const descriptor = registry.describe('fake', runtimeCapabilities('degraded:sandbox'));
    expect(descriptor.configured).toBe(true);
    expect(descriptor.configuration).toBe('degraded:sandbox');
  });

  it('drops a supported connector to beta once its policy review date passes', () => {
    const overdueClock = fixedClock('2099-06-01T00:00:00.000Z');
    const connector = createFakeConnector({ instant: true });
    const identity = connector.identity();
    const supported: SocialConnector = {
      ...connector,
      identity: () => ({ ...identity, label: 'supported' }),
      authorization: () => connector.authorization(),
      discoverAccounts: (input) => connector.discoverAccounts(input),
      listDestinations: (input) => connector.listDestinations(input),
      searchMentions: (input) => connector.searchMentions(input),
      deletePost: (input) => connector.deletePost(input),
      revoke: (input) => connector.revoke(input),
      getCapabilities: (input) => connector.getCapabilities(input),
      validateDraft: (input) => connector.validateDraft(input),
      prepareMedia: (input) => connector.prepareMedia(input),
      preview: (input) => connector.preview(input),
      publish: (input) => connector.publish(input),
      getStatus: (input) => connector.getStatus(input),
      fetchMetrics: (input) => connector.fetchMetrics(input),
      refreshCredential: (input) => connector.refreshCredential(input),
    };
    const registry = createConnectorRegistry([supported], { clock: overdueClock });
    const descriptor = registry.describe('fake');
    expect(descriptor.declaredLabel).toBe('supported');
    expect(descriptor.policyReviewOverdue).toBe(true);
    expect(descriptor.effectiveLabel).toBe('beta');
  });
});
