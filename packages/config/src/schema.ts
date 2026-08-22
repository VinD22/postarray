import { z } from 'zod';

/**
 * The environment contract for Relay.
 *
 * Every variable in `.env.example` appears here exactly once, grouped the same
 * way the file groups them. Nothing in this module is strictly required: format
 * is validated here, presence is validated per service in `load.ts` so a
 * missing TikTok secret can never stop the API from booting.
 *
 * Values are never echoed. Error messages name the key and the expected shape.
 */

export const ENV_GROUP_NAMES = [
  'core',
  'database',
  'neon',
  'redis',
  'temporal',
  'polar',
  'ai',
  'encryption',
  'oauth',
  'shortLinks',
  'email',
  'observability',
  'providers',
] as const;

export type EnvGroupName = (typeof ENV_GROUP_NAMES)[number];

const ABSOLUTE_HTTP_MESSAGE = 'expected an absolute http(s) URL';
const HTTP_ORIGIN_MESSAGE = 'expected an absolute http(s) origin without a trailing slash';
const POSTGRES_MESSAGE = 'expected a postgresql:// connection string';
const REDIS_MESSAGE = 'expected a redis:// or rediss:// connection string';
const HOST_PORT_MESSAGE = 'expected a host:port pair';
const BASE64_32_MESSAGE = 'expected a base64 encoded 32 byte key';
const DATE_MESSAGE = 'expected a YYYY-MM-DD date';

export function isHttpUrl(value: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return parsed.protocol === 'http:' || parsed.protocol === 'https:';
}

/**
 * A public site origin is an origin, not an arbitrary URL. Keeping it exact
 * prevents canonical URLs from gaining a path, query, fragment, or duplicate
 * separator when application code builds paths with `new URL()`.
 */
export function isHttpOrigin(value: string): boolean {
  if (!isHttpUrl(value)) return false;
  return value === new URL(value).origin;
}

export function isPostgresUrl(value: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return parsed.protocol === 'postgresql:' || parsed.protocol === 'postgres:';
}

export function isRedisUrl(value: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return parsed.protocol === 'redis:' || parsed.protocol === 'rediss:';
}

export function isHostPort(value: string): boolean {
  const separator = value.lastIndexOf(':');
  if (separator <= 0 || separator === value.length - 1) return false;
  const host = value.slice(0, separator);
  const port = Number(value.slice(separator + 1));
  return host.length > 0 && Number.isInteger(port) && port > 0 && port <= 65535;
}

/** Decoded byte length of a strict base64 string, or -1 when it is not base64. */
export function base64ByteLength(value: string): number {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(value) || value.length % 4 !== 0) return -1;
  return Buffer.from(value, 'base64').byteLength;
}

export function isBase64Key(value: string, bytes: number): boolean {
  return base64ByteLength(value) === bytes;
}

/**
 * Environment booleans arrive as strings. `Boolean('false')` is `true`, so the
 * accepted spellings are enumerated instead of coerced.
 */
export function parseBooleanish(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on', 'enabled'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off', 'disabled'].includes(normalized)) return false;
  return undefined;
}

export const booleanish = () => z.preprocess(parseBooleanish, z.boolean());

const httpUrl = z.string().refine(isHttpUrl, { message: ABSOLUTE_HTTP_MESSAGE });
const httpOrigin = z.string().refine(isHttpOrigin, { message: HTTP_ORIGIN_MESSAGE });
const postgresUrl = z.string().refine(isPostgresUrl, { message: POSTGRES_MESSAGE });
const redisUrl = z.string().refine(isRedisUrl, { message: REDIS_MESSAGE });
const hostPort = z.string().refine(isHostPort, { message: HOST_PORT_MESSAGE });
const secret = z.string().min(8, { message: 'expected at least 8 characters' });
const identifier = z.string().min(1, { message: 'expected a non-empty value' });
const base64Key32 = z
  .string()
  .refine((value) => isBase64Key(value, 32), { message: BASE64_32_MESSAGE });
const isoDate = z
  .string()
  .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)), {
    message: DATE_MESSAGE,
  });
const positiveInt = z.coerce.number().int().positive();
const nonNegativeNumber = z.coerce.number().nonnegative();

export const NODE_ENVIRONMENTS = ['development', 'test', 'production'] as const;
export const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'] as const;
export const POLAR_SERVERS = ['sandbox', 'production'] as const;
/**
 * DeepSeek stays first because it is the default. Which provider a deployment
 * runs is a configuration decision, not a code change: `@relay/ai` has one
 * adapter file per entry here and selects between them on this value.
 */
export const AI_PROVIDERS = ['deepseek', 'anthropic'] as const;

export type NodeEnvironment = (typeof NODE_ENVIRONMENTS)[number];
export type LogLevel = (typeof LOG_LEVELS)[number];
export type PolarServer = (typeof POLAR_SERVERS)[number];
export type AiProvider = (typeof AI_PROVIDERS)[number];

const coreShape = {
  NODE_ENV: z.enum(NODE_ENVIRONMENTS).default('development'),
  APP_URL: httpUrl.optional(),
  API_URL: httpUrl.optional(),
  NEXT_PUBLIC_SITE_ORIGIN: httpOrigin.optional(),
  NEXT_PUBLIC_ENABLE_PSEUDO_LOCALES: booleanish().default(false),
  /**
   * Development and test only. Opts the in-repo `fake` provider simulator into
   * being dispatchable so the local publish loop can close. The runtime
   * ignores this flag entirely when NODE_ENV is `production`.
   */
  RELAY_ALLOW_FAKE_CONNECTOR: booleanish().default(false),
  LOG_LEVEL: z.enum(LOG_LEVELS).default('info'),
};

const databaseShape = {
  DATABASE_URL: postgresUrl.optional(),
  DIRECT_DATABASE_URL: postgresUrl.optional(),
};

const neonShape = {
  NEON_AUTH_BASE_URL: httpUrl.optional(),
  NEON_AUTH_COOKIE_SECRET: z
    .string()
    .min(32, { message: 'expected at least 32 characters' })
    .optional(),
  NEON_AUTH_JWKS_URL: httpUrl.optional(),
  NEON_STORAGE_ENDPOINT: httpUrl.optional(),
  NEON_STORAGE_REGION: identifier.default('us-east-2'),
  NEON_STORAGE_BUCKET: identifier.default('relay-media'),
  NEON_STORAGE_ACCESS_KEY_ID: identifier.optional(),
  NEON_STORAGE_SECRET_ACCESS_KEY: secret.optional(),
};

const redisShape = {
  REDIS_URL: redisUrl.optional(),
};

const temporalShape = {
  TEMPORAL_ADDRESS: hostPort.optional(),
  TEMPORAL_NAMESPACE: identifier.default('default'),
  TEMPORAL_TASK_QUEUE: identifier.default('relay-publishing'),
  TEMPORAL_API_KEY: identifier.optional(),
};

const polarShape = {
  /**
   * Commercial kill switch. Credentials alone must never make a checkout
   * reachable before the merchant identity and legal copy are approved.
   */
  BILLING_CHECKOUT_ENABLED: booleanish().default(false),
  POLAR_ACCESS_TOKEN: identifier.optional(),
  POLAR_WEBHOOK_SECRET: secret.optional(),
  POLAR_SERVER: z.enum(POLAR_SERVERS).default('sandbox'),
  POLAR_MONTHLY_PRODUCT_ID: identifier.optional(),
  POLAR_ANNUAL_PRODUCT_ID: identifier.optional(),
  /**
   * The larger project-capacity tiers. Optional: a deployment that sells the
   * base tier alone is a complete deployment, not a degraded one. The tier
   * table in `@relay/billing` names these variables; ids never live in source.
   */
  POLAR_GROWTH_MONTHLY_PRODUCT_ID: identifier.optional(),
  POLAR_GROWTH_ANNUAL_PRODUCT_ID: identifier.optional(),
  POLAR_STUDIO_MONTHLY_PRODUCT_ID: identifier.optional(),
  POLAR_STUDIO_ANNUAL_PRODUCT_ID: identifier.optional(),
  POLAR_TRIAL_DAYS: positiveInt.max(90).default(7),
};

const aiShape = {
  AI_PROVIDER: z.enum(AI_PROVIDERS).default('deepseek'),
  DEEPSEEK_API_KEY: identifier.optional(),
  DEEPSEEK_BASE_URL: httpUrl.default('https://api.deepseek.com'),
  DEEPSEEK_MODEL: identifier.default('deepseek-v4-flash'),
  ANTHROPIC_API_KEY: identifier.optional(),
  ANTHROPIC_BASE_URL: httpUrl.default('https://api.anthropic.com'),
  ANTHROPIC_MODEL: identifier.default('claude-sonnet-5'),
  AI_PROMPT_VERSION: isoDate.optional(),
  AI_REQUEST_TIMEOUT_MS: positiveInt.max(600_000).default(60_000),
  AI_MAX_MONTHLY_USD_PER_WORKSPACE: nonNegativeNumber.default(25),
};

const encryptionShape = {
  TOKEN_ENCRYPTION_KMS_KEY_ID: identifier.optional(),
  TOKEN_ENCRYPTION_KMS_REGION: identifier.default('us-east-2'),
  TOKEN_ENCRYPTION_LOCAL_KEY: base64Key32.optional(),
};

const oauthShape = {
  OAUTH_ISSUER_URL: httpUrl.optional(),
  OAUTH_SIGNING_KMS_KEY_ID: identifier.optional(),
  OAUTH_SIGNING_LOCAL_KEY: base64Key32.optional(),
};

const shortLinksShape = {
  SHORT_LINK_BASE_URL: httpUrl.optional(),
  SHORT_LINK_HASH_KEY: secret.optional(),
};

const emailShape = {
  EMAIL_API_URL: httpUrl.default('https://api.resend.com/emails'),
  EMAIL_API_KEY: identifier.optional(),
  EMAIL_FROM: identifier.optional(),
};

const observabilityShape = {
  SENTRY_DSN: httpUrl.optional(),
  POSTHOG_KEY: identifier.optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: httpUrl.optional(),
};

const providersShape = {
  X_CLIENT_ID: identifier.optional(),
  X_CLIENT_SECRET: identifier.optional(),
  LINKEDIN_CLIENT_ID: identifier.optional(),
  LINKEDIN_CLIENT_SECRET: identifier.optional(),
  META_APP_ID: identifier.optional(),
  META_APP_SECRET: identifier.optional(),
  GOOGLE_CLIENT_ID: identifier.optional(),
  GOOGLE_CLIENT_SECRET: identifier.optional(),
  TIKTOK_CLIENT_KEY: identifier.optional(),
  TIKTOK_CLIENT_SECRET: identifier.optional(),
  BLUESKY_SERVICE_URL: httpUrl.default('https://bsky.social'),
  MASTODON_CLIENT_ID: identifier.optional(),
  MASTODON_CLIENT_SECRET: identifier.optional(),
  MASTODON_INSTANCE_URL: httpUrl.default('https://mastodon.social'),
  TELEGRAM_BOT_TOKEN: identifier.optional(),
  REDDIT_CLIENT_ID: identifier.optional(),
  REDDIT_CLIENT_SECRET: identifier.optional(),
  WORDPRESS_CLIENT_ID: identifier.optional(),
  WORDPRESS_CLIENT_SECRET: identifier.optional(),
  MEDIUM_CLIENT_ID: identifier.optional(),
  MEDIUM_CLIENT_SECRET: identifier.optional(),
  DEVTO_API_KEY: identifier.optional(),
  PINTEREST_CLIENT_ID: identifier.optional(),
  PINTEREST_CLIENT_SECRET: identifier.optional(),
  DISCORD_BOT_TOKEN: identifier.optional(),
  SLACK_CLIENT_ID: identifier.optional(),
  SLACK_CLIENT_SECRET: identifier.optional(),
};

export const envSchema = z.object({
  ...coreShape,
  ...databaseShape,
  ...neonShape,
  ...redisShape,
  ...temporalShape,
  ...polarShape,
  ...aiShape,
  ...encryptionShape,
  ...oauthShape,
  ...shortLinksShape,
  ...emailShape,
  ...observabilityShape,
  ...providersShape,
});

/** The parsed, defaulted environment. Presence rules live in `load.ts`. */
export type RelayEnv = z.infer<typeof envSchema>;

export type EnvKey = keyof RelayEnv;

const keysOf = (shape: Record<string, unknown>): readonly EnvKey[] =>
  Object.keys(shape) as EnvKey[];

/** Which group each variable belongs to, mirroring the layout of `.env.example`. */
export const ENV_GROUPS: Record<EnvGroupName, readonly EnvKey[]> = {
  core: keysOf(coreShape),
  database: keysOf(databaseShape),
  neon: keysOf(neonShape),
  redis: keysOf(redisShape),
  temporal: keysOf(temporalShape),
  polar: keysOf(polarShape),
  ai: keysOf(aiShape),
  encryption: keysOf(encryptionShape),
  oauth: keysOf(oauthShape),
  shortLinks: keysOf(shortLinksShape),
  email: keysOf(emailShape),
  observability: keysOf(observabilityShape),
  providers: keysOf(providersShape),
};

export const ENV_KEYS: readonly EnvKey[] = Object.values(ENV_GROUPS).flat();

export function groupOf(key: EnvKey): EnvGroupName {
  for (const name of ENV_GROUP_NAMES) {
    if (ENV_GROUPS[name].includes(key)) return name;
  }
  return 'core';
}

/**
 * An empty string in a shell environment means "not set". Blank values are
 * dropped so `NEON_AUTH_BASE_URL=` degrades instead of failing URL validation, and
 * unknown variables are ignored so the process environment can carry anything.
 */
export function normalizeEnv(
  env: NodeJS.ProcessEnv | Record<string, unknown>,
): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  for (const key of ENV_KEYS) {
    const value = (env as Record<string, unknown>)[key];
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    normalized[key] = typeof value === 'string' ? value.trim() : value;
  }
  return normalized;
}
