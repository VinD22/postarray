import { ConfigValidationError, type ConfigIssue } from './errors.js';
import {
  ENV_KEYS,
  type AiProvider,
  type EnvKey,
  type LogLevel,
  type NodeEnvironment,
  type PolarServer,
  type RelayEnv,
  envSchema,
  normalizeEnv,
} from './schema.js';

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
  web: { required: ['APP_URL', 'API_URL'], requiredAnyOf: [] },
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
  readonly isProduction: boolean;
  readonly isDevelopment: boolean;
  readonly isTest: boolean;
  readonly appUrl: string | undefined;
  readonly apiUrl: string | undefined;
  readonly logLevel: LogLevel;
}

export interface DatabaseConfig {
  readonly url: string | undefined;
  /** Migrations bypass the pooler. Falls back to `DATABASE_URL`. */
  readonly directUrl: string | undefined;
}

export interface SupabaseConfig {
  readonly url: string | undefined;
  readonly anonKey: string | undefined;
  /** Server only. Must never reach a browser bundle. */
  readonly serviceRoleKey: string | undefined;
  readonly jwtSecret: string | undefined;
  readonly storageBucket: string;
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
  readonly accessToken: string | undefined;
  readonly webhookSecret: string | undefined;
  readonly server: PolarServer;
  readonly monthlyProductId: string | undefined;
  readonly annualProductId: string | undefined;
  readonly trialDays: number;
}

export interface AiConfig {
  readonly provider: AiProvider;
  readonly promptVersion: string | undefined;
  readonly requestTimeoutMs: number;
  readonly maxMonthlyUsdPerWorkspace: number;
  readonly deepseek: {
    readonly apiKey: string | undefined;
    readonly baseUrl: string;
    readonly model: string;
  };
}

export interface EncryptionConfig {
  readonly kmsKeyId: string | undefined;
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
}

export interface RelayConfig {
  readonly service: RelayService | undefined;
  readonly core: CoreConfig;
  readonly database: DatabaseConfig;
  readonly supabase: SupabaseConfig;
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

function toConfig(
  env: RelayEnv,
  present: readonly EnvKey[],
  service: RelayService | undefined,
): RelayConfig {
  return {
    service,
    core: {
      nodeEnv: env.NODE_ENV,
      isProduction: env.NODE_ENV === 'production',
      isDevelopment: env.NODE_ENV === 'development',
      isTest: env.NODE_ENV === 'test',
      appUrl: env.APP_URL,
      apiUrl: env.API_URL,
      logLevel: env.LOG_LEVEL,
    },
    database: {
      url: env.DATABASE_URL,
      directUrl: env.DIRECT_DATABASE_URL ?? env.DATABASE_URL,
    },
    supabase: {
      url: env.SUPABASE_URL,
      anonKey: env.SUPABASE_ANON_KEY,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
      jwtSecret: env.SUPABASE_JWT_SECRET,
      storageBucket: env.STORAGE_BUCKET,
    },
    redis: { url: env.REDIS_URL },
    temporal: {
      address: env.TEMPORAL_ADDRESS,
      namespace: env.TEMPORAL_NAMESPACE,
      taskQueue: env.TEMPORAL_TASK_QUEUE,
      apiKey: env.TEMPORAL_API_KEY,
    },
    polar: {
      accessToken: env.POLAR_ACCESS_TOKEN,
      webhookSecret: env.POLAR_WEBHOOK_SECRET,
      server: env.POLAR_SERVER,
      monthlyProductId: env.POLAR_MONTHLY_PRODUCT_ID,
      annualProductId: env.POLAR_ANNUAL_PRODUCT_ID,
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
    },
    encryption: {
      kmsKeyId: env.TOKEN_ENCRYPTION_KMS_KEY_ID,
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
    email: { apiKey: env.EMAIL_API_KEY, from: env.EMAIL_FROM },
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
export function loadConfig(env: NodeJS.ProcessEnv | Record<string, unknown> = process.env): RelayConfig {
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
