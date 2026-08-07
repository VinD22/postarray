import { describe, expect, it } from 'vitest';

import { ConfigValidationError } from './errors';
import { loadConfig, loadConfigFor, requireConfigValue } from './load';

const LOCAL_KEY_32_BYTES = Buffer.alloc(32, 7).toString('base64');

const minimal = {
  APP_URL: 'http://localhost:3000',
  API_URL: 'http://localhost:3001',
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/relay?schema=public',
  TOKEN_ENCRYPTION_LOCAL_KEY: LOCAL_KEY_32_BYTES,
};

describe('loadConfig', () => {
  it('boots with no provider keys at all', () => {
    const config = loadConfig(minimal);
    expect(config.core.nodeEnv).toBe('development');
    expect(config.core.logLevel).toBe('info');
    expect(config.providers.x.clientId).toBeUndefined();
    expect(config.providers.bluesky.serviceUrl).toBe('https://bsky.social');
  });

  it('applies the documented defaults', () => {
    const config = loadConfig(minimal);
    expect(config.neon.storageBucket).toBe('relay-media');
    expect(config.neon.storageRegion).toBe('us-east-2');
    expect(config.temporal.namespace).toBe('default');
    expect(config.temporal.taskQueue).toBe('relay-publishing');
    expect(config.polar.server).toBe('sandbox');
    expect(config.polar.checkoutEnabled).toBe(false);
    expect(config.polar.trialDays).toBe(7);
    expect(config.ai.provider).toBe('deepseek');
    expect(config.ai.deepseek.baseUrl).toBe('https://api.deepseek.com');
    expect(config.ai.deepseek.model).toBe('deepseek-v4-flash');
    expect(config.ai.requestTimeoutMs).toBe(60_000);
    expect(config.ai.maxMonthlyUsdPerWorkspace).toBe(25);
  });

  it('requires an explicit commercial checkout switch', () => {
    expect(loadConfig({ ...minimal, BILLING_CHECKOUT_ENABLED: 'true' }).polar.checkoutEnabled).toBe(
      true,
    );
  });

  it('coerces numeric variables', () => {
    const config = loadConfig({
      ...minimal,
      POLAR_TRIAL_DAYS: '14',
      AI_REQUEST_TIMEOUT_MS: '15000',
      AI_MAX_MONTHLY_USD_PER_WORKSPACE: '12.5',
    });
    expect(config.polar.trialDays).toBe(14);
    expect(config.ai.requestTimeoutMs).toBe(15_000);
    expect(config.ai.maxMonthlyUsdPerWorkspace).toBe(12.5);
  });

  it('treats an empty value as unset', () => {
    const config = loadConfig({ ...minimal, NEON_AUTH_BASE_URL: '', REDIS_URL: '   ' });
    expect(config.neon.authBaseUrl).toBeUndefined();
    expect(config.redis.url).toBeUndefined();
  });

  it('falls back from the direct database url to the pooled one', () => {
    const config = loadConfig(minimal);
    expect(config.database.directUrl).toBe(minimal.DATABASE_URL);
  });

  it('falls back from the oauth issuer url to the api url', () => {
    const config = loadConfig(minimal);
    expect(config.oauth.issuerUrl).toBe('http://localhost:3001');
  });

  it('accepts a public site origin without a development default', () => {
    const configured = 'https://app.example.test';
    const config = loadConfig({ ...minimal, NEXT_PUBLIC_SITE_ORIGIN: configured });
    expect(config.core.siteOrigin).toBe(configured);
    expect(loadConfig(minimal).core.siteOrigin).toBeUndefined();
  });

  it('rejects a public site origin that is not an exact origin', () => {
    expect(() =>
      loadConfig({ ...minimal, NEXT_PUBLIC_SITE_ORIGIN: 'https://app.example.test/marketing' }),
    ).toThrow(ConfigValidationError);
    expect(() =>
      loadConfig({ ...minimal, NEXT_PUBLIC_SITE_ORIGIN: 'https://app.example.test/' }),
    ).toThrow(ConfigValidationError);
  });

  it('returns a deeply frozen object', () => {
    const config = loadConfig(minimal);
    expect(Object.isFrozen(config)).toBe(true);
    expect(Object.isFrozen(config.providers.x)).toBe(true);
  });

  it('reports every missing variable at once', () => {
    let error: unknown;
    try {
      loadConfig({});
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(ConfigValidationError);
    const issues = (error as ConfigValidationError).issues;
    expect(issues.map((issue) => issue.keys.join('|'))).toEqual([
      'APP_URL',
      'API_URL',
      'DATABASE_URL',
      'TOKEN_ENCRYPTION_KMS_KEY_ID|TOKEN_ENCRYPTION_LOCAL_KEY',
    ]);
  });

  it('names the file to fix and never prints a value', () => {
    const secretValue = 'not-a-url-super-secret-value';
    let message = '';
    try {
      loadConfig({ ...minimal, APP_URL: secretValue });
    } catch (caught) {
      message = (caught as Error).message;
    }
    expect(message).toContain('APP_URL');
    expect(message).toContain('.env');
    expect(message).not.toContain(secretValue);
  });

  it('rejects a local key that is not 32 bytes', () => {
    expect(() =>
      loadConfig({ ...minimal, TOKEN_ENCRYPTION_LOCAL_KEY: Buffer.alloc(16).toString('base64') }),
    ).toThrow(ConfigValidationError);
  });

  it('accepts a kms key id instead of a local key', () => {
    const { TOKEN_ENCRYPTION_LOCAL_KEY: _unused, ...withoutLocalKey } = minimal;
    const config = loadConfig({
      ...withoutLocalKey,
      TOKEN_ENCRYPTION_KMS_KEY_ID: 'arn:aws:kms:eu-west-1:000000000000:key/placeholder',
    });
    expect(config.encryption.localKey).toBeUndefined();
    expect(config.encryption.kmsKeyId).toBeDefined();
  });

  it('rejects a non postgres database url', () => {
    expect(() => loadConfig({ ...minimal, DATABASE_URL: 'mysql://localhost/relay' })).toThrow(
      ConfigValidationError,
    );
  });

  it('rejects a temporal address without a port', () => {
    expect(() => loadConfig({ ...minimal, TEMPORAL_ADDRESS: 'localhost' })).toThrow(
      ConfigValidationError,
    );
  });
});

describe('loadConfigFor', () => {
  it('lets the api boot without any connector credentials', () => {
    const config = loadConfigFor('api', minimal);
    expect(config.service).toBe('api');
    expect(config.providers.tiktok.clientSecret).toBeUndefined();
  });

  it('lets the cli boot with only an api url', () => {
    const config = loadConfigFor('cli', { API_URL: 'https://api.example.test' });
    expect(config.core.apiUrl).toBe('https://api.example.test');
    expect(config.database.url).toBeUndefined();
  });

  it('does not require the encryption key for the web app', () => {
    const config = loadConfigFor('web', {
      APP_URL: 'http://localhost:3000',
      API_URL: 'http://localhost:3001',
      NEXT_PUBLIC_SITE_ORIGIN: 'http://localhost:3000',
    });
    expect(config.encryption.localKey).toBeUndefined();
  });

  it('requires the canonical public origin for the web app', () => {
    expect(() =>
      loadConfigFor('web', {
        APP_URL: 'http://localhost:3000',
        API_URL: 'http://localhost:3001',
      }),
    ).toThrow(ConfigValidationError);
  });

  it('requires the short link base url for the links service', () => {
    let error: unknown;
    try {
      loadConfigFor('links', minimal);
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(ConfigValidationError);
    expect((error as ConfigValidationError).keys).toContain('SHORT_LINK_BASE_URL');
  });

  it('names the service in the failure message', () => {
    try {
      loadConfigFor('worker', {});
      throw new Error('expected a failure');
    } catch (caught) {
      expect((caught as Error).message).toContain('Relay worker');
    }
  });

  it('still validates the format of an optional variable that is present', () => {
    expect(() =>
      loadConfigFor('cli', { API_URL: 'http://localhost:3001', REDIS_URL: 'nope' }),
    ).toThrow(ConfigValidationError);
  });
});

describe('requireConfigValue', () => {
  it('returns a present value', () => {
    expect(requireConfigValue('postgresql://x', 'DATABASE_URL')).toBe('postgresql://x');
  });

  it('throws naming the key when absent', () => {
    expect(() => requireConfigValue(undefined, 'DATABASE_URL')).toThrow(/DATABASE_URL/);
  });
});
