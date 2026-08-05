import type { ProviderId } from '@relay/contracts';

import type { ConnectorDeps, ConnectorRegistry, SocialConnector } from './shared/contract-shape.js';
import { createBlueskyConnector } from './bluesky/index.js';
import { createFacebookConnector } from './meta/facebook/index.js';
import { createInstagramConnector } from './meta/instagram/index.js';
import { createLinkedInConnector } from './linkedin/index.js';
import { createThreadsConnector } from './meta/threads/index.js';
import { createTikTokConnector } from './tiktok/index.js';
import { createXConnector } from './x/index.js';
import { createYouTubeConnector } from './youtube/index.js';

/**
 * The provider adapters.
 *
 * A connector with no configured credentials is reported as not configured, is hidden from
 * user-facing flows, and does not break any other connector or any other surface.
 */

export * from './shared/index.js';
export * from './x/index.js';
export * from './linkedin/index.js';
export * from './meta/index.js';
export * from './youtube/index.js';
export * from './tiktok/index.js';
export * from './bluesky/index.js';

/** Every provider this package ships an adapter for. */
export const BUILT_IN_PROVIDERS = [
  'x',
  'linkedin',
  'instagram',
  'facebook',
  'threads',
  'youtube',
  'tiktok',
  'bluesky',
] as const;
export type BuiltInProvider = (typeof BUILT_IN_PROVIDERS)[number];

/** The factory for one provider, keyed by its provider id. */
export const PROVIDER_FACTORIES: Readonly<
  Record<BuiltInProvider, (deps: ConnectorDeps) => SocialConnector>
> = Object.freeze({
  x: createXConnector,
  linkedin: createLinkedInConnector,
  instagram: createInstagramConnector,
  facebook: createFacebookConnector,
  threads: createThreadsConnector,
  youtube: createYouTubeConnector,
  tiktok: createTikTokConnector,
  bluesky: createBlueskyConnector,
});

/**
 * The environment variables each provider needs. Bluesky authenticates per connection
 * through the AT Protocol, so it has no application level credential and is always
 * available.
 */
export const PROVIDER_REQUIRED_ENV: Readonly<Record<BuiltInProvider, readonly string[]>> =
  Object.freeze({
    x: ['X_CLIENT_ID', 'X_CLIENT_SECRET'],
    linkedin: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET'],
    instagram: ['META_APP_ID', 'META_APP_SECRET'],
    facebook: ['META_APP_ID', 'META_APP_SECRET'],
    threads: ['META_APP_ID', 'META_APP_SECRET'],
    youtube: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
    tiktok: ['TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET'],
    bluesky: [],
  });

function configuredValues(
  config: ConnectorDeps['config'],
  provider: BuiltInProvider,
): readonly (string | undefined)[] {
  const providers = config.providers;
  switch (provider) {
    case 'x':
      return [providers.x.clientId, providers.x.clientSecret];
    case 'linkedin':
      return [providers.linkedin.clientId, providers.linkedin.clientSecret];
    case 'instagram':
    case 'facebook':
    case 'threads':
      return [providers.meta.appId, providers.meta.appSecret];
    case 'youtube':
      return [providers.google.clientId, providers.google.clientSecret];
    case 'tiktok':
      return [providers.tiktok.clientKey, providers.tiktok.clientSecret];
    case 'bluesky':
      return [];
  }
}

/** The variables an operator still has to set for this provider to work. */
export function missingCredentials(
  config: ConnectorDeps['config'],
  provider: BuiltInProvider,
): readonly string[] {
  const required = PROVIDER_REQUIRED_ENV[provider];
  const values = configuredValues(config, provider);
  return required.filter((_name, index) => values[index] === undefined);
}

export function isProviderConfigured(
  config: ConnectorDeps['config'],
  provider: BuiltInProvider,
): boolean {
  return missingCredentials(config, provider).length === 0;
}

/** `live`, or `disabled:missing X_CLIENT_ID, X_CLIENT_SECRET`. */
export function providerStatus(
  config: ConnectorDeps['config'],
  provider: BuiltInProvider,
): string {
  const missing = missingCredentials(config, provider);
  return missing.length === 0 ? 'live' : `disabled:missing ${missing.join(', ')}`;
}

export interface RegistrationOutcome {
  readonly provider: ProviderId;
  readonly status: string;
  readonly registered: boolean;
}

/**
 * Register every provider whose credentials are configured, and mark the rest
 * `disabled:missing <ENV_VAR>` so the admin panel can say exactly what to set.
 *
 * The second argument is the full `ConnectorDeps` rather than only the config, because a
 * factory needs the HTTP client, the vault, the logger and the clock as well. The config it
 * reads is `deps.config`.
 */
export function registerBuiltInProviders(
  registry: ConnectorRegistry,
  deps: ConnectorDeps,
): RegistrationOutcome[] {
  const outcomes: RegistrationOutcome[] = [];
  for (const provider of BUILT_IN_PROVIDERS) {
    const status = providerStatus(deps.config, provider);
    if (status !== 'live') {
      registry.markUnavailable(provider, status);
      outcomes.push({ provider, status, registered: false });
      continue;
    }
    registry.register(PROVIDER_FACTORIES[provider](deps));
    outcomes.push({ provider, status, registered: true });
  }
  return outcomes;
}

/** Build one connector without touching the registry. Used by tests and the CLI. */
export function createProviderConnector(
  provider: BuiltInProvider,
  deps: ConnectorDeps,
): SocialConnector {
  return PROVIDER_FACTORIES[provider](deps);
}
