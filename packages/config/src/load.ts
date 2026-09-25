import { ConfigValidationError, type ConfigIssue } from './errors';
import {
  ENV_KEYS,
  type AiProvider,
  type EnvKey,
  type LogLevel,
  type NodeEnvironment,
  type RuntimeProfile,
  type PolarServer,
  type RelayEnv,
  envSchema,
  normalizeEnv,
} from './schema';

/** The six deployable surfaces. Each validates only what it actually uses. */
export const RELAY_SERVICES = ['web', 'api', 'worker', 'mcp', 'cli', 'links'] as const;
export type RelayService = (typeof RELAY_SERVICES)[number];

export interface ServiceRequirement {
  /** Variables that must be present for this service to start. */
  readonly required: readonly EnvKey[];
  /** Groups where at least one variable must be present. */
  readonly requiredAnyOf: readonly (readonly EnvKey[])[];
}

const ENCRYPTION_ANY_OF: readonly EnvKey[] = [
  'TOKEN_ENCRYPTION_KMS_KEY_ID',
  'TOKEN_ENCRYPTION_LOCAL_KEY',
];

/**
 * What `.env.example` calls "required to boot locally". `loadConfig` enforces
 * this superset; `loadConfigFor` enforces only the per service subset.
 */
export const GLOBAL_REQUIREMENT: ServiceRequirement = {
  required: ['APP_URL', 'API_URL', 'DATABASE_URL'],
  requiredAnyOf: [ENCRYPTION_ANY_OF],
};

export const SERVICE_REQUIREMENTS: Record<RelayService, ServiceRequirement> = {
  web: {
    required: ['APP_URL', 'API_URL', 'NEXT_PUBLIC_SITE_ORIGIN'],
    requiredAnyOf: [],
  },
  api: {
    required: ['APP_URL', 'API_URL', 'DATABASE_URL'],
    requiredAnyOf: [ENCRYPTION_ANY_OF],
  },
  worker: { required: ['APP_URL', 'DATABASE_URL'], requiredAnyOf: [ENCRYPTION_ANY_OF] },
  mcp: { required: ['API_URL', 'DATABASE_URL'], requiredAnyOf: [] },
  cli: { required: ['API_URL'], requiredAnyOf: [] },
  links: { required: ['SHORT_LINK_BASE_URL', 'DATABASE_URL'], requiredAnyOf: [] },
};

export interface CoreConfig {
  readonly nodeEnv: NodeEnvironment;
  /**
   * What this process is for. See RUNTIME_PROFILES: this, not `isProduction`,
   * is what gates adapters that are allowed to discard work on a laptop.
   */
  readonly runtimeProfile: RuntimeProfile;
  readonly isProduction: boolean;
  readonly isDevelopment: boolean;
  readonly isTest: boolean;
  readonly appUrl: string | undefined;
  readonly apiUrl: string | undefined;
  /** Public canonical origin used by the web surface's SEO metadata. */
  readonly siteOrigin: string | undefined;
  /**
   * Development/test opt-in that lets the `fake` simulator be dispatched.
   * Never honored in production; `isFakeConnectorDispatchable` owns the gate.
   */
  readonly allowFakeConnector: boolean;
  readonly logLevel: LogLevel;
}

export interface DatabaseConfig {
  readonly url: string | undefined;
  /** Migrations bypass the pooler. Falls back to `DATABASE_URL`. */
  readonly directUrl: string | undefined;
}

export interface NeonConfig {
  readonly authBaseUrl: string | undefined;
  /** Server only. Signs the short-lived local Neon session cache. */
  readonly authCookieSecret: string | undefined;
  readonly authJwksUrl: string | undefined;
  readonly storageEndpoint: string | undefined;
  readonly storageRegion: string;
  readonly storageBucket: string;
  readonly storageAccessKeyId: string | undefined;
  /** Server only. Must never reach a browser bundle. */
  readonly storageSecretAccessKey: string | undefined;
}

export interface RedisConfig {
  readonly url: string | undefined;
}

export interface TemporalConfig {
  readonly address: string | undefined;
  readonly namespace: string;
  readonly taskQueue: string;
  readonly apiKey: string | undefined;
}

export interface PolarConfig {
  readonly checkoutEnabled: boolean;
  readonly accessToken: string | undefined;
  readonly webhookSecret: string | undefined;
  readonly server: PolarServer;
  readonly monthlyProductId: string | undefined;
  readonly annualProductId: string | undefined;
  readonly growthMonthlyProductId: string | undefined;
  readonly growthAnnualProductId: string | undefined;
  readonly studioMonthlyProductId: string | undefined;
  readonly studioAnnualProductId: string | undefined;
  /**
   * Every configured Polar product id, keyed by the environment variable name
   * that carried it, with absent variables omitted.
   *
   * Billing owns the tier table and therefore owns the `productId -> tier`
   * mapping; it builds that from this map rather than this package building it,
   * because `@relay/config` depends on nothing and must keep it that way. Ids
   * are configuration, not secrets, but they are still never logged.
   */
  readonly productIdsByEnvKey: Readonly<Record<string, string>>;
  readonly trialDays: number;
}

export interface AiConfig {
  readonly provider: AiProvider;
  readonly promptVersion: string | undefined;
  readonly requestTimeoutMs: number;
  readonly maxMonthlyUsdPerWorkspace: number;
  readonly deepseek: AiProviderConfig;
  readonly anthropic: AiProviderConfig;
}

/**
 * One provider's endpoint settings. The two entries are the same shape on
 * purpose: `@relay/ai` picks one by name and hands it to the matching adapter,
 * so adding a provider is a schema entry plus an adapter, not a new branch in
 * every caller.
 */
export interface AiProviderConfig {
  readonly apiKey: string | undefined;
  readonly baseUrl: string;
  readonly model: string;
}

export interface EncryptionConfig {
  readonly kmsKeyId: string | undefined;
  readonly kmsRegion: string;
  /** Local development only. Production uses envelope encryption via KMS. */
  readonly localKey: string | undefined;
}

export interface OAuthIssuerConfig {
  readonly issuerUrl: string | undefined;
  readonly signingKmsKeyId: string | undefined;
  readonly signingLocalKey: string | undefined;
}

export interface ShortLinksConfig {
  readonly baseUrl: string | undefined;
  readonly hashKey: string | undefined;
}

export interface EmailConfig {
  readonly apiUrl: string;
  readonly apiKey: string | undefined;
  readonly from: string | undefined;
}

export interface ObservabilityConfig {
  readonly sentryDsn: string | undefined;
  readonly posthogKey: string | undefined;
  readonly otelExporterOtlpEndpoint: string | undefined;
}

export interface ProvidersConfig {
  readonly x: { readonly clientId: string | undefined; readonly clientSecret: string | undefined };
  readonly linkedin: {
    readonly clientId: string | undefined;
    readonly clientSecret: string | undefined;
  };
  readonly meta: { readonly appId: string | undefined; readonly appSecret: string | undefined };
  readonly google: {
    readonly clientId: string | undefined;
    readonly clientSecret: string | undefined;
  };
  readonly tiktok: {
    readonly clientKey: string | undefined;
    readonly clientSecret: string | undefined;
  };
  readonly bluesky: { readonly serviceUrl: string };
  readonly mastodon: {
    readonly clientId: string | undefined;
    readonly clientSecret: string | undefined;
    readonly instanceUrl: string;
  };
  readonly telegram: { readonly botToken: string | undefined };
  readonly reddit: {
    readonly clientId: string | undefined;
    readonly clientSecret: string | undefined;
  };
  readonly wordpress: {
    readonly clientId: string | undefined;
    readonly clientSecret: string | undefined;
  };
  readonly medium: {
    readonly clientId: string | undefined;
    readonly clientSecret: string | undefined;
  };
  readonly devto: { readonly apiKey: string | undefined };
  readonly pinterest: {
    readonly clientId: string | undefined;
    readonly clientSecret: string | undefined;
  };
  readonly discord: { readonly botToken: string | undefined };
  readonly slack: {
    readonly clientId: string | undefined;
    readonly clientSecret: string | undefined;
  };
}

export interface RelayConfig {
  readonly service: RelayService | undefined;
  readonly core: CoreConfig;
  readonly database: DatabaseConfig;
  readonly neon: NeonConfig;
  readonly redis: RedisConfig;
  readonly temporal: TemporalConfig;
  readonly polar: PolarConfig;
  readonly ai: AiConfig;
  readonly encryption: EncryptionConfig;
  readonly oauth: OAuthIssuerConfig;
  readonly shortLinks: ShortLinksConfig;
  readonly email: EmailConfig;
  readonly observability: ObservabilityConfig;
  readonly providers: ProvidersConfig;
  /** Keys that were present in the environment. Never their values. */
  readonly presentKeys: readonly EnvKey[];
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  for (const inner of Object.values(value as Record<string, unknown>)) {
    deepFreeze(inner);
  }
  return Object.freeze(value);
}

function collectFormatIssues(env: Record<string, unknown>): {
  issues: ConfigIssue[];
  parsed: RelayEnv | undefined;
} {
  const result = envSchema.safeParse(env);
  if (result.success) return { issues: [], parsed: result.data };

  const issues: ConfigIssue[] = result.error.issues.map((issue) => {
    const key = String(issue.path[0] ?? 'UNKNOWN') as EnvKey;
    return { kind: 'invalid' as const, keys: [key], detail: issue.message };
  });
  return { issues, parsed: undefined };
}

/** The six Polar product-id variables, in the order the tier ladder climbs. */
const POLAR_PRODUCT_ID_KEYS = [
  'POLAR_MONTHLY_PRODUCT_ID',
  'POLAR_ANNUAL_PRODUCT_ID',
  'POLAR_GROWTH_MONTHLY_PRODUCT_ID',
  'POLAR_GROWTH_ANNUAL_PRODUCT_ID',
  'POLAR_STUDIO_MONTHLY_PRODUCT_ID',
  'POLAR_STUDIO_ANNUAL_PRODUCT_ID',
] as const satisfies readonly EnvKey[];

/** Configured product ids keyed by variable name. Absent variables are omitted. */
function polarProductIdsByEnvKey(env: RelayEnv): Readonly<Record<string, string>> {
  const ids: Record<string, string> = {};
  for (const key of POLAR_PRODUCT_ID_KEYS) {
    const value = env[key];
    if (value !== undefined && value.length > 0) {
      ids[key] = value;
    }
  }
  return ids;
}

function collectPresenceIssues(
  env: Record<string, unknown>,
  requirement: ServiceRequirement,
): ConfigIssue[] {
  const issues: ConfigIssue[] = [];
  for (const key of requirement.required) {
    if (env[key] === undefined) {
      issues.push({ kind: 'missing', keys: [key], detail: 'required but not set' });
    }
  }
  for (const group of requirement.requiredAnyOf) {
    if (group.every((key) => env[key] === undefined)) {
      issues.push({
        kind: 'missing_one_of',
        keys: group,
        detail: 'at least one of these must be set',
      });
    }
  }
  return issues;
}

/**
 * A deployment that says nothing gets the profile its NODE_ENV implies, so
 * this is additive: existing production and test processes keep their exact
 * behaviour, and only a deployed box with a development-shaped NODE_ENV has
 * to say `staging` out loud.
 */
function defaultRuntimeProfile(nodeEnv: NodeEnvironment): RuntimeProfile {
  if (nodeEnv === 'production') {
    return 'production';
  }
  if (nodeEnv === 'test') {
    return 'test';
  }
  return 'local';
}

function toConfig(
  env: RelayEnv,
  present: readonly EnvKey[],
  service: RelayService | undefined,
): RelayConfig {
  return {
    service,
    core: {
      nodeEnv: env.NODE_ENV,
      runtimeProfile: env.POSTARRAY_RUNTIME_PROFILE ?? defaultRuntimeProfile(env.NODE_ENV),
      isProduction: env.NODE_ENV === 'production',
      isDevelopment: env.NODE_ENV === 'development',
      isTest: env.NODE_ENV === 'test',
      appUrl: env.APP_URL,
      apiUrl: env.API_URL,
      siteOrigin: env.NEXT_PUBLIC_SITE_ORIGIN,
      allowFakeConnector: env.POSTARRAY_ALLOW_FAKE_CONNECTOR,
      logLevel: env.LOG_LEVEL,
    },
    database: {
      url: env.DATABASE_URL,
      directUrl: env.DIRECT_DATABASE_URL ?? env.DATABASE_URL,
    },
    neon: {
      authBaseUrl: env.NEON_AUTH_BASE_URL,
      authCookieSecret: env.NEON_AUTH_COOKIE_SECRET,
      authJwksUrl: env.NEON_AUTH_JWKS_URL,
      storageEndpoint: env.NEON_STORAGE_ENDPOINT,
      storageRegion: env.NEON_STORAGE_REGION,
      storageBucket: env.NEON_STORAGE_BUCKET,
      storageAccessKeyId: env.NEON_STORAGE_ACCESS_KEY_ID,
      storageSecretAccessKey: env.NEON_STORAGE_SECRET_ACCESS_KEY,
    },
    redis: { url: env.REDIS_URL },
    temporal: {
      address: env.TEMPORAL_ADDRESS,
      namespace: env.TEMPORAL_NAMESPACE,
      taskQueue: env.TEMPORAL_TASK_QUEUE,
      apiKey: env.TEMPORAL_API_KEY,
    },
    polar: {
      checkoutEnabled: env.BILLING_CHECKOUT_ENABLED,
      accessToken: env.POLAR_ACCESS_TOKEN,
      webhookSecret: env.POLAR_WEBHOOK_SECRET,
      server: env.POLAR_SERVER,
      monthlyProductId: env.POLAR_MONTHLY_PRODUCT_ID,
      annualProductId: env.POLAR_ANNUAL_PRODUCT_ID,
      growthMonthlyProductId: env.POLAR_GROWTH_MONTHLY_PRODUCT_ID,
      growthAnnualProductId: env.POLAR_GROWTH_ANNUAL_PRODUCT_ID,
      studioMonthlyProductId: env.POLAR_STUDIO_MONTHLY_PRODUCT_ID,
      studioAnnualProductId: env.POLAR_STUDIO_ANNUAL_PRODUCT_ID,
      productIdsByEnvKey: polarProductIdsByEnvKey(env),
      trialDays: env.POLAR_TRIAL_DAYS,
    },
    ai: {
      provider: env.AI_PROVIDER,
      promptVersion: env.AI_PROMPT_VERSION,
      requestTimeoutMs: env.AI_REQUEST_TIMEOUT_MS,
      maxMonthlyUsdPerWorkspace: env.AI_MAX_MONTHLY_USD_PER_WORKSPACE,
      deepseek: {
        apiKey: env.DEEPSEEK_API_KEY,
        baseUrl: env.DEEPSEEK_BASE_URL,
        model: env.DEEPSEEK_MODEL,
      },
      anthropic: {
        apiKey: env.ANTHROPIC_API_KEY,
        baseUrl: env.ANTHROPIC_BASE_URL,
        model: env.ANTHROPIC_MODEL,
      },
    },
    encryption: {
      kmsKeyId: env.TOKEN_ENCRYPTION_KMS_KEY_ID,
      kmsRegion: env.TOKEN_ENCRYPTION_KMS_REGION,
      localKey: env.TOKEN_ENCRYPTION_LOCAL_KEY,
    },
    oauth: {
      issuerUrl: env.OAUTH_ISSUER_URL ?? env.API_URL,
      signingKmsKeyId: env.OAUTH_SIGNING_KMS_KEY_ID,
      signingLocalKey: env.OAUTH_SIGNING_LOCAL_KEY,
    },
    shortLinks: {
      baseUrl: env.SHORT_LINK_BASE_URL,
      hashKey: env.SHORT_LINK_HASH_KEY,
    },
    email: { apiUrl: env.EMAIL_API_URL, apiKey: env.EMAIL_API_KEY, from: env.EMAIL_FROM },
    observability: {
      sentryDsn: env.SENTRY_DSN,
      posthogKey: env.POSTHOG_KEY,
      otelExporterOtlpEndpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
    },
    providers: {
      x: { clientId: env.X_CLIENT_ID, clientSecret: env.X_CLIENT_SECRET },
      linkedin: { clientId: env.LINKEDIN_CLIENT_ID, clientSecret: env.LINKEDIN_CLIENT_SECRET },
      meta: { appId: env.META_APP_ID, appSecret: env.META_APP_SECRET },
      google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
      tiktok: { clientKey: env.TIKTOK_CLIENT_KEY, clientSecret: env.TIKTOK_CLIENT_SECRET },
      bluesky: { serviceUrl: env.BLUESKY_SERVICE_URL },
      mastodon: {
        clientId: env.MASTODON_CLIENT_ID,
        clientSecret: env.MASTODON_CLIENT_SECRET,
        instanceUrl: env.MASTODON_INSTANCE_URL,
      },
      telegram: { botToken: env.TELEGRAM_BOT_TOKEN },
      reddit: { clientId: env.REDDIT_CLIENT_ID, clientSecret: env.REDDIT_CLIENT_SECRET },
      wordpress: {
        clientId: env.WORDPRESS_CLIENT_ID,
        clientSecret: env.WORDPRESS_CLIENT_SECRET,
      },
      medium: { clientId: env.MEDIUM_CLIENT_ID, clientSecret: env.MEDIUM_CLIENT_SECRET },
      devto: { apiKey: env.DEVTO_API_KEY },
      pinterest: {
        clientId: env.PINTEREST_CLIENT_ID,
        clientSecret: env.PINTEREST_CLIENT_SECRET,
      },
      discord: { botToken: env.DISCORD_BOT_TOKEN },
      slack: { clientId: env.SLACK_CLIENT_ID, clientSecret: env.SLACK_CLIENT_SECRET },
    },
    presentKeys: present,
  };
}

function load(
  env: NodeJS.ProcessEnv | Record<string, unknown>,
  requirement: ServiceRequirement,
  service: RelayService | undefined,
): RelayConfig {
  const normalized = normalizeEnv(env);
  const presence = collectPresenceIssues(normalized, requirement);
  const format = collectFormatIssues(normalized);
  const issues = [...presence, ...format.issues];

  if (issues.length > 0 || format.parsed === undefined) {
    throw new ConfigValidationError(sortIssues(issues), service);
  }

  const present = ENV_KEYS.filter((key) => normalized[key] !== undefined);
  return deepFreeze(toConfig(format.parsed, present, service));
}

function sortIssues(issues: readonly ConfigIssue[]): ConfigIssue[] {
  const order = new Map(ENV_KEYS.map((key, index) => [key, index]));
  return [...issues].sort((a, b) => {
    const left = order.get(a.keys[0] ?? 'NODE_ENV') ?? Number.MAX_SAFE_INTEGER;
    const right = order.get(b.keys[0] ?? 'NODE_ENV') ?? Number.MAX_SAFE_INTEGER;
    return left - right;
  });
}

/**
 * Validate the whole environment. Use this for tooling and tests. Services
 * should prefer `loadConfigFor` so an unrelated missing key cannot stop a boot.
 */
export function loadConfig(
  env: NodeJS.ProcessEnv | Record<string, unknown> = process.env,
): RelayConfig {
  return load(env, GLOBAL_REQUIREMENT, undefined);
}

/** Validate only what `service` needs, then return the frozen config. */
export function loadConfigFor(
  service: RelayService,
  env: NodeJS.ProcessEnv | Record<string, unknown> = process.env,
): RelayConfig {
  return load(env, SERVICE_REQUIREMENTS[service], service);
}

/**
 * Narrow an optional config value at the point of use. Throws a
 * `ConfigValidationError` naming the key, never printing the value.
 */
export function requireConfigValue<T>(value: T | undefined, key: EnvKey): T {
  if (value === undefined) {
    throw new ConfigValidationError([
      { kind: 'missing', keys: [key], detail: 'required by this code path but not set' },
    ]);
  }
  return value;
}
