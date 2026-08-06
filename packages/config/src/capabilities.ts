import { CapabilityUnavailableError } from './errors';
import type { RelayConfig } from './load';
import type { EnvKey } from './schema';

/**
 * Runtime capability detection.
 *
 * The product must boot with no provider keys at all and then tell the truth
 * about what is off. A capability is:
 *
 * - `live`: fully configured.
 * - `degraded:<reason>`: works, but through a local or unverified substitute.
 * - `disabled:<reason>`: not available, with the exact variable to set.
 *
 * This object is what the admin panel and `/health` render. It contains no
 * values, only key names.
 */

export type CapabilityLevel = 'live' | 'degraded' | 'disabled';

export type CapabilityStatus = 'live' | `degraded:${string}` | `disabled:${string}`;

export const SUBSYSTEM_NAMES = [
  'database',
  'redis',
  'temporal',
  'storage',
  'auth',
  'billing',
  'ai',
  'email',
  'shortLinks',
  'oauthIssuer',
  'encryption',
  'tracing',
  'errorReporting',
  'productAnalytics',
] as const;

export type SubsystemName = (typeof SUBSYSTEM_NAMES)[number];

/**
 * `fake` is the in-repo provider simulator. It is always available so the full
 * compose, approve, schedule, publish and receipt loop is exercisable offline.
 */
export const CONNECTOR_KEYS = [
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
  'fake',
] as const;

export type ConnectorKey = (typeof CONNECTOR_KEYS)[number];

export type RuntimeCapabilities = {
  readonly [K in SubsystemName]: CapabilityStatus;
} & {
  readonly connectors: { readonly [K in ConnectorKey]: CapabilityStatus };
};

export type CapabilityRef = SubsystemName | `connector:${ConnectorKey}`;

const MISSING = 'missing ';

function missing(...keys: readonly EnvKey[]): `disabled:${string}` {
  return `disabled:${MISSING}${keys.join(', ')}`;
}

function partial(...keys: readonly EnvKey[]): `degraded:${string}` {
  return `degraded:${MISSING}${keys.join(', ')}`;
}

function absentKeys(
  entries: readonly (readonly [EnvKey, string | undefined])[],
): readonly EnvKey[] {
  return entries.filter(([, value]) => value === undefined).map(([key]) => key);
}

function allOrNothing(
  entries: readonly (readonly [EnvKey, string | undefined])[],
): CapabilityStatus {
  const absent = absentKeys(entries);
  return absent.length === 0 ? 'live' : missing(...absent);
}

export function capabilityLevel(status: CapabilityStatus): CapabilityLevel {
  if (status === 'live') return 'live';
  return status.startsWith('degraded:') ? 'degraded' : 'disabled';
}

export function capabilityReason(status: CapabilityStatus): string | undefined {
  if (status === 'live') return undefined;
  return status.slice(status.indexOf(':') + 1);
}

/** The variables an operator must set to move a capability to `live`. */
export function missingEnvVars(status: CapabilityStatus): readonly string[] {
  const reason = capabilityReason(status);
  if (reason === undefined || !reason.startsWith(MISSING)) return [];
  return reason
    .slice(MISSING.length)
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function isLive(status: CapabilityStatus): boolean {
  return status === 'live';
}

/** `live` or `degraded`. Degraded subsystems still serve requests. */
export function isUsable(status: CapabilityStatus): boolean {
  return capabilityLevel(status) !== 'disabled';
}

function detectDatabase(config: RelayConfig): CapabilityStatus {
  if (config.database.url === undefined) return missing('DATABASE_URL');
  return 'live';
}

function detectRedis(config: RelayConfig): CapabilityStatus {
  if (config.redis.url === undefined) return 'degraded:in-memory';
  return 'live';
}

function detectTemporal(config: RelayConfig): CapabilityStatus {
  if (config.temporal.address === undefined) return 'degraded:inline-scheduler';
  return 'live';
}

function detectStorage(config: RelayConfig): CapabilityStatus {
  if (config.supabase.url === undefined || config.supabase.serviceRoleKey === undefined) {
    return 'degraded:local-filesystem';
  }
  return 'live';
}

function detectAuth(config: RelayConfig): CapabilityStatus {
  const absent = absentKeys([
    ['SUPABASE_URL', config.supabase.url],
    ['SUPABASE_ANON_KEY', config.supabase.anonKey],
    ['SUPABASE_JWT_SECRET', config.supabase.jwtSecret],
  ]);
  if (absent.length === 3) return missing(...absent);
  if (absent.length > 0) return partial(...absent);
  return 'live';
}

function detectBilling(config: RelayConfig): CapabilityStatus {
  if (config.polar.accessToken === undefined) return missing('POLAR_ACCESS_TOKEN');
  const absent = absentKeys([
    ['POLAR_WEBHOOK_SECRET', config.polar.webhookSecret],
    ['POLAR_MONTHLY_PRODUCT_ID', config.polar.monthlyProductId],
    ['POLAR_ANNUAL_PRODUCT_ID', config.polar.annualProductId],
  ]);
  if (absent.length > 0) return partial(...absent);
  return 'live';
}

function detectAi(config: RelayConfig): CapabilityStatus {
  if (config.ai.provider === 'deepseek' && config.ai.deepseek.apiKey === undefined) {
    return missing('DEEPSEEK_API_KEY');
  }
  return 'live';
}

function detectEmail(config: RelayConfig): CapabilityStatus {
  if (config.email.apiKey === undefined) return 'degraded:console';
  if (config.email.from === undefined) return partial('EMAIL_FROM');
  return 'live';
}

function detectShortLinks(config: RelayConfig): CapabilityStatus {
  if (config.shortLinks.baseUrl === undefined) return missing('SHORT_LINK_BASE_URL');
  if (config.shortLinks.hashKey === undefined) return partial('SHORT_LINK_HASH_KEY');
  return 'live';
}

function detectOAuthIssuer(config: RelayConfig): CapabilityStatus {
  if (config.oauth.issuerUrl === undefined) return missing('OAUTH_ISSUER_URL');
  if (config.oauth.signingKmsKeyId !== undefined) return 'live';
  if (config.oauth.signingLocalKey === undefined) {
    return missing('OAUTH_SIGNING_KMS_KEY_ID', 'OAUTH_SIGNING_LOCAL_KEY');
  }
  return config.core.isProduction ? 'degraded:local-signing-key' : 'live';
}

function detectEncryption(config: RelayConfig): CapabilityStatus {
  if (config.encryption.kmsKeyId !== undefined) return 'live';
  if (config.encryption.localKey === undefined) {
    return missing('TOKEN_ENCRYPTION_KMS_KEY_ID', 'TOKEN_ENCRYPTION_LOCAL_KEY');
  }
  return config.core.isProduction ? 'degraded:local-key-without-kms' : 'live';
}

function detectTracing(config: RelayConfig): CapabilityStatus {
  if (config.observability.otelExporterOtlpEndpoint === undefined) {
    return missing('OTEL_EXPORTER_OTLP_ENDPOINT');
  }
  return 'live';
}

function detectErrorReporting(config: RelayConfig): CapabilityStatus {
  if (config.observability.sentryDsn === undefined) return 'degraded:logs-only';
  return 'live';
}

function detectProductAnalytics(config: RelayConfig): CapabilityStatus {
  if (config.observability.posthogKey === undefined) return missing('POSTHOG_KEY');
  return 'live';
}

function detectConnectors(config: RelayConfig): Record<ConnectorKey, CapabilityStatus> {
  const meta = allOrNothing([
    ['META_APP_ID', config.providers.meta.appId],
    ['META_APP_SECRET', config.providers.meta.appSecret],
  ]);
  return {
    x: allOrNothing([
      ['X_CLIENT_ID', config.providers.x.clientId],
      ['X_CLIENT_SECRET', config.providers.x.clientSecret],
    ]),
    linkedin: allOrNothing([
      ['LINKEDIN_CLIENT_ID', config.providers.linkedin.clientId],
      ['LINKEDIN_CLIENT_SECRET', config.providers.linkedin.clientSecret],
    ]),
    instagram: meta,
    facebook: meta,
    threads: meta,
    youtube: allOrNothing([
      ['GOOGLE_CLIENT_ID', config.providers.google.clientId],
      ['GOOGLE_CLIENT_SECRET', config.providers.google.clientSecret],
    ]),
    tiktok: allOrNothing([
      ['TIKTOK_CLIENT_KEY', config.providers.tiktok.clientKey],
      ['TIKTOK_CLIENT_SECRET', config.providers.tiktok.clientSecret],
    ]),
    // Bluesky authenticates per connection through the AT Protocol service, so
    // there is no application level credential to configure.
    bluesky: 'live',
    mastodon: allOrNothing([
      ['MASTODON_CLIENT_ID', config.providers.mastodon.clientId],
      ['MASTODON_CLIENT_SECRET', config.providers.mastodon.clientSecret],
    ]),
    telegram: allOrNothing([['TELEGRAM_BOT_TOKEN', config.providers.telegram.botToken]]),
    reddit: allOrNothing([
      ['REDDIT_CLIENT_ID', config.providers.reddit.clientId],
      ['REDDIT_CLIENT_SECRET', config.providers.reddit.clientSecret],
    ]),
    wordpress: allOrNothing([
      ['WORDPRESS_CLIENT_ID', config.providers.wordpress.clientId],
      ['WORDPRESS_CLIENT_SECRET', config.providers.wordpress.clientSecret],
    ]),
    medium: allOrNothing([
      ['MEDIUM_CLIENT_ID', config.providers.medium.clientId],
      ['MEDIUM_CLIENT_SECRET', config.providers.medium.clientSecret],
    ]),
    devto: allOrNothing([['DEVTO_API_KEY', config.providers.devto.apiKey]]),
    pinterest: allOrNothing([
      ['PINTEREST_CLIENT_ID', config.providers.pinterest.clientId],
      ['PINTEREST_CLIENT_SECRET', config.providers.pinterest.clientSecret],
    ]),
    discord: allOrNothing([['DISCORD_BOT_TOKEN', config.providers.discord.botToken]]),
    slack: allOrNothing([
      ['SLACK_CLIENT_ID', config.providers.slack.clientId],
      ['SLACK_CLIENT_SECRET', config.providers.slack.clientSecret],
    ]),
    fake: 'live',
  };
}

export function detectCapabilities(config: RelayConfig): RuntimeCapabilities {
  const capabilities: RuntimeCapabilities = {
    database: detectDatabase(config),
    redis: detectRedis(config),
    temporal: detectTemporal(config),
    storage: detectStorage(config),
    auth: detectAuth(config),
    billing: detectBilling(config),
    ai: detectAi(config),
    email: detectEmail(config),
    shortLinks: detectShortLinks(config),
    oauthIssuer: detectOAuthIssuer(config),
    encryption: detectEncryption(config),
    tracing: detectTracing(config),
    errorReporting: detectErrorReporting(config),
    productAnalytics: detectProductAnalytics(config),
    connectors: detectConnectors(config),
  };
  return Object.freeze({ ...capabilities, connectors: Object.freeze(capabilities.connectors) });
}

export function getCapability(
  capabilities: RuntimeCapabilities,
  ref: CapabilityRef,
): CapabilityStatus {
  if (ref.startsWith('connector:')) {
    const key = ref.slice('connector:'.length) as ConnectorKey;
    return capabilities.connectors[key];
  }
  return capabilities[ref as SubsystemName];
}

export interface AssertCapabilityOptions {
  /** Degraded substitutes are accepted by default. Set false to demand `live`. */
  readonly allowDegraded?: boolean;
}

/**
 * Throw a typed error naming the exact variables to set. Callers that must not
 * silently run on an in-memory substitute pass `{ allowDegraded: false }`.
 */
export function assertCapability(
  capabilities: RuntimeCapabilities,
  ref: CapabilityRef,
  options: AssertCapabilityOptions = {},
): void {
  const status = getCapability(capabilities, ref);
  const level = capabilityLevel(status);
  if (level === 'live') return;
  if (level === 'degraded' && options.allowDegraded !== false) return;
  throw new CapabilityUnavailableError({
    capability: ref,
    level,
    reason: capabilityReason(status) ?? 'unavailable',
    requiredEnvVars: missingEnvVars(status),
  });
}

export interface CapabilityEntry {
  readonly name: string;
  readonly status: CapabilityStatus;
  readonly level: CapabilityLevel;
  readonly reason: string | undefined;
  readonly requiredEnvVars: readonly string[];
}

/** Flatten capabilities for rendering. Subsystems first, then connectors. */
export function listCapabilities(capabilities: RuntimeCapabilities): readonly CapabilityEntry[] {
  const entries: CapabilityEntry[] = [];
  for (const name of SUBSYSTEM_NAMES) {
    entries.push(describe(name, capabilities[name]));
  }
  for (const key of CONNECTOR_KEYS) {
    entries.push(describe(`connector:${key}`, capabilities.connectors[key]));
  }
  return entries;
}

function describe(name: string, status: CapabilityStatus): CapabilityEntry {
  return {
    name,
    status,
    level: capabilityLevel(status),
    reason: capabilityReason(status),
    requiredEnvVars: missingEnvVars(status),
  };
}

/** Connectors that can be offered in the connect flow right now. */
export function availableConnectors(capabilities: RuntimeCapabilities): readonly ConnectorKey[] {
  return CONNECTOR_KEYS.filter((key) => isUsable(capabilities.connectors[key]));
}
