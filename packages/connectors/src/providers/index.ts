import type { ProviderId } from '@relay/contracts';

import type { ConnectorDeps, ConnectorRegistry, SocialConnector } from './shared/contract-shape';
import { createBlueskyConnector } from './bluesky/index';
import { createDevtoConnector } from './devto/index';
import { createDiscordConnector } from './discord/index';
import { createFacebookConnector } from './meta/facebook/index';
import { createInstagramConnector } from './meta/instagram/index';
import { createLinkedInConnector } from './linkedin/index';
import { createMastodonConnector } from './mastodon/index';
import { createMediumConnector } from './medium/index';
import { createPinterestConnector } from './pinterest/index';
import { createRedditConnector } from './reddit/index';
import { createSlackConnector } from './slack/index';
import { createTelegramConnector } from './telegram/index';
import { createThreadsConnector } from './meta/threads/index';
import { createTikTokConnector } from './tiktok/index';
import { createWordpressConnector } from './wordpress/index';
import { createXConnector } from './x/index';
import { createYouTubeConnector } from './youtube/index';

/**
 * The provider adapters.
 *
 * A connector with no configured credentials is reported as not configured, is hidden from
 * user-facing flows, and does not break any other connector or any other surface.
 */

export * from './shared/index';
export * from './x/index';
export * from './linkedin/index';
export * from './meta/index';
export * from './youtube/index';
export * from './tiktok/index';
export * from './bluesky/index';
export * from './mastodon/index';
export * from './telegram/index';
export * from './reddit/index';
export * from './wordpress/index';
export * from './medium/index';
export * from './devto/index';
export * from './pinterest/index';
export * from './discord/index';
export * from './slack/index';

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
  'mastodon',
  'telegram',
  'reddit',
  'wordpress',
  'medium',
  'devto',
  'pinterest',
  'discord',
  'slack',
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
  mastodon: createMastodonConnector,
  telegram: createTelegramConnector,
  reddit: createRedditConnector,
  wordpress: createWordpressConnector,
  medium: createMediumConnector,
  devto: createDevtoConnector,
  pinterest: createPinterestConnector,
  discord: createDiscordConnector,
  slack: createSlackConnector,
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
    mastodon: ['MASTODON_CLIENT_ID', 'MASTODON_CLIENT_SECRET'],
    telegram: ['TELEGRAM_BOT_TOKEN'],
    reddit: ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET'],
    wordpress: ['WORDPRESS_CLIENT_ID', 'WORDPRESS_CLIENT_SECRET'],
    medium: ['MEDIUM_CLIENT_ID', 'MEDIUM_CLIENT_SECRET'],
    devto: ['DEVTO_API_KEY'],
    pinterest: ['PINTEREST_CLIENT_ID', 'PINTEREST_CLIENT_SECRET'],
    discord: ['DISCORD_BOT_TOKEN'],
    slack: ['SLACK_CLIENT_ID', 'SLACK_CLIENT_SECRET'],
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
    case 'mastodon':
      return [providers.mastodon.clientId, providers.mastodon.clientSecret];
    case 'telegram':
      return [providers.telegram.botToken];
    case 'reddit':
      return [providers.reddit.clientId, providers.reddit.clientSecret];
    case 'wordpress':
      return [providers.wordpress.clientId, providers.wordpress.clientSecret];
    case 'medium':
      return [providers.medium.clientId, providers.medium.clientSecret];
    case 'devto':
      return [providers.devto.apiKey];
    case 'pinterest':
      return [providers.pinterest.clientId, providers.pinterest.clientSecret];
    case 'discord':
      return [providers.discord.botToken];
    case 'slack':
      return [providers.slack.clientId, providers.slack.clientSecret];
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

/**
 * Configuration and verification are separate gates. Credentials alone never
 * make a connector customer-visible.
 */
export function providerStatus(
  config: ConnectorDeps['config'],
  provider: BuiltInProvider,
  verifiedProviders: readonly BuiltInProvider[] = [],
): string {
  const missing = missingCredentials(config, provider);
  if (missing.length > 0) {
    return `disabled:missing ${missing.join(', ')}`;
  }
  return verifiedProviders.includes(provider) ? 'live' : 'disabled:verification-not-complete';
}

export interface RegistrationOutcome {
  readonly provider: ProviderId;
  readonly status: string;
  /** True when every credential this provider needs is configured. */
  readonly available: boolean;
}

/** The slice of the registry this function drives. */
export type ProviderRegistrar = Pick<ConnectorRegistry, 'register' | 'markUnavailable'>;

export interface RegisterBuiltInProvidersOptions {
  /** Providers whose definition-of-done evidence passed in this release. */
  readonly verifiedProviders?: readonly BuiltInProvider[];
}

/**
 * Register every provider adapter, and mark the ones with missing credentials
 * `disabled:missing <ENV_VAR>` so the admin panel can say exactly what to set.
 *
 * Registration comes first even when a provider is unconfigured: `markUnavailable`
 * describes a registered connector, and a connector that is absent from the registry
 * cannot tell the capability page why it is unusable. An unconfigured provider is hidden
 * from user-facing flows by its `disabled:` status, not by being missing.
 *
 * The second argument is the full `ConnectorDeps` rather than only the config, because a
 * factory needs the HTTP client, the vault, the logger and the clock as well. The config it
 * reads is `deps.config`.
 */
export function registerBuiltInProviders(
  registry: ProviderRegistrar,
  deps: ConnectorDeps,
  options: RegisterBuiltInProvidersOptions = {},
): RegistrationOutcome[] {
  const outcomes: RegistrationOutcome[] = [];
  for (const provider of BUILT_IN_PROVIDERS) {
    const status = providerStatus(deps.config, provider, options.verifiedProviders ?? []);
    registry.register(PROVIDER_FACTORIES[provider](deps));
    if (status !== 'live') {
      registry.markUnavailable(provider, status);
    }
    outcomes.push({ provider, status, available: status === 'live' });
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
