import {
  CONNECTOR_KEYS,
  detectCapabilities,
  loadConfig,
  type RuntimeCapabilities,
} from '@relay/config';
import { describe, expect, it } from 'vitest';

import { buildHealthReport, healthHttpStatus, type HealthCheck } from './health';

const LOCAL_KEY_32_BYTES = Buffer.alloc(32, 5).toString('base64');

const minimal = {
  APP_URL: 'http://localhost:3000',
  API_URL: 'http://localhost:3001',
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/relay?schema=public',
  TOKEN_ENCRYPTION_LOCAL_KEY: LOCAL_KEY_32_BYTES,
};

const capabilitiesFor = (extra: Record<string, string> = {}): RuntimeCapabilities =>
  detectCapabilities(loadConfig({ ...minimal, ...extra }));

const fixedNow = () => new Date('2026-08-04T12:00:00.000Z');

describe('buildHealthReport', () => {
  it('reports degraded for a local install with substitutes in place', () => {
    const report = buildHealthReport(capabilitiesFor(), [], { now: fixedNow });
    expect(report.status).toBe('degraded');
    expect(report.checkedAt).toBe('2026-08-04T12:00:00.000Z');
    expect(healthHttpStatus(report)).toBe(200);
  });

  it('lists every subsystem and connector with its level and remedy', () => {
    const report = buildHealthReport(capabilitiesFor(), [], { now: fixedNow });

    expect(report.subsystems).toHaveLength(14);
    expect(report.connectors).toHaveLength(19);

    const redis = report.subsystems.find((component) => component.name === 'redis');
    expect(redis).toEqual({
      name: 'redis',
      level: 'degraded',
      reason: 'in-memory',
      requiredEnvVars: [],
    });

    const tiktok = report.connectors.find((component) => component.name === 'tiktok');
    expect(tiktok?.level).toBe('disabled');
    expect(tiktok?.requiredEnvVars).toEqual(['TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET']);
  });

  it('counts live, degraded and disabled components', () => {
    const report = buildHealthReport(capabilitiesFor(), [], { now: fixedNow });
    const total = report.summary.live + report.summary.degraded + report.summary.disabled;
    expect(total).toBe(14 + 19);
    expect(report.summary.failingChecks).toBe(0);
  });

  it('goes down when a critical subsystem is disabled', () => {
    const capabilities: RuntimeCapabilities = {
      ...capabilitiesFor(),
      database: 'disabled:missing DATABASE_URL',
    };
    const report = buildHealthReport(capabilities, [], { now: fixedNow });
    expect(report.status).toBe('down');
    expect(healthHttpStatus(report)).toBe(503);
  });

  it('goes down when a check fails', () => {
    const checks: HealthCheck[] = [{ name: 'database.query', status: 'fail', latencyMs: 1200.6 }];
    const report = buildHealthReport(capabilitiesFor(), checks, { now: fixedNow });
    expect(report.status).toBe('down');
    expect(report.summary.failingChecks).toBe(1);
    expect(report.checks[0]?.latencyMs).toBe(1201);
  });

  it('never leaks a value through a check detail', () => {
    const checks: HealthCheck[] = [
      {
        name: 'database.query',
        status: 'warn',
        detail: 'connect failed for postgresql://postgres:hunter2hunter2@db:5432/relay',
      },
    ];
    const report = buildHealthReport(capabilitiesFor(), checks, { now: fixedNow });
    expect(report.checks[0]?.detail).not.toContain('hunter2hunter2');
    expect(report.checks[0]?.detail).toContain('[redacted]');
  });

  it('reports ok only when everything is live and every check passes', () => {
    const capabilities = capabilitiesFor({
      REDIS_URL: 'redis://localhost:6379',
      TEMPORAL_ADDRESS: 'localhost:7233',
      NEON_AUTH_BASE_URL: 'https://auth.example.neon.tech',
      NEON_AUTH_COOKIE_SECRET: 'placeholder-cookie-secret-at-least-32-bytes',
      NEON_STORAGE_ENDPOINT: 'https://storage.example.neon.tech',
      NEON_STORAGE_ACCESS_KEY_ID: 'placeholder-access-key',
      NEON_STORAGE_SECRET_ACCESS_KEY: 'placeholder-storage-secret',
      DEEPSEEK_API_KEY: 'placeholder-ai-key',
      EMAIL_API_KEY: 'placeholder-email-key',
      EMAIL_FROM: 'Post Array <no-reply@example.test>',
      OTEL_EXPORTER_OTLP_ENDPOINT: 'https://otel.example.test',
      SENTRY_DSN: 'https://public@sentry.example.test/1',
      POSTHOG_KEY: 'placeholder-posthog',
      SHORT_LINK_BASE_URL: 'http://localhost:3002',
      SHORT_LINK_HASH_KEY: 'placeholder-hash-key',
      BILLING_CHECKOUT_ENABLED: 'true',
      POLAR_ACCESS_TOKEN: 'placeholder-token',
      POLAR_WEBHOOK_SECRET: 'placeholder-webhook-secret',
      POLAR_MONTHLY_PRODUCT_ID: 'prod_monthly',
      POLAR_ANNUAL_PRODUCT_ID: 'prod_annual',
      OAUTH_SIGNING_LOCAL_KEY: Buffer.alloc(32, 9).toString('base64'),
      X_CLIENT_ID: 'x-id',
      X_CLIENT_SECRET: 'x-secret',
      LINKEDIN_CLIENT_ID: 'li-id',
      LINKEDIN_CLIENT_SECRET: 'li-secret',
      META_APP_ID: 'meta-id',
      META_APP_SECRET: 'meta-secret',
      GOOGLE_CLIENT_ID: 'google-id',
      GOOGLE_CLIENT_SECRET: 'google-secret',
      TIKTOK_CLIENT_KEY: 'tiktok-key',
      TIKTOK_CLIENT_SECRET: 'tiktok-secret',
      MASTODON_CLIENT_ID: 'mastodon-id',
      MASTODON_CLIENT_SECRET: 'mastodon-secret',
      TELEGRAM_BOT_TOKEN: 'placeholder-telegram-bot-token',
      REDDIT_CLIENT_ID: 'reddit-id',
      REDDIT_CLIENT_SECRET: 'reddit-secret',
      WORDPRESS_CLIENT_ID: 'wordpress-id',
      WORDPRESS_CLIENT_SECRET: 'wordpress-secret',
      MEDIUM_CLIENT_ID: 'medium-id',
      MEDIUM_CLIENT_SECRET: 'medium-secret',
      DEVTO_API_KEY: 'placeholder-devto-api-key',
      PINTEREST_CLIENT_ID: 'pinterest-id',
      PINTEREST_CLIENT_SECRET: 'pinterest-secret',
      DISCORD_BOT_TOKEN: 'placeholder-discord-bot-token',
      SLACK_CLIENT_ID: 'slack-id',
      SLACK_CLIENT_SECRET: 'slack-secret',
    });
    expect(capabilities.connectors.bluesky).toBe('live');
    const fullyLive: RuntimeCapabilities = {
      ...capabilities,
      connectors: Object.fromEntries(
        CONNECTOR_KEYS.map((provider) => [provider, 'live'] as const),
      ) as RuntimeCapabilities['connectors'],
    };
    const report = buildHealthReport(fullyLive, [{ name: 'database.query', status: 'pass' }], {
      now: fixedNow,
      service: 'api',
      version: '0.1.0',
    });
    expect(report.status).toBe('ok');
    expect(report.service).toBe('api');
    expect(report.version).toBe('0.1.0');
    expect(report.summary.degraded).toBe(0);
    expect(report.summary.disabled).toBe(0);
  });

  it('computes uptime from the process start', () => {
    const report = buildHealthReport(capabilitiesFor(), [], {
      now: fixedNow,
      startedAt: fixedNow().getTime() - 90_000,
    });
    expect(report.uptimeSeconds).toBe(90);
  });

  it('serializes to JSON without any configuration value', () => {
    const report = buildHealthReport(capabilitiesFor(), [], { now: fixedNow });
    const serialized = JSON.stringify(report);
    expect(serialized).not.toContain(LOCAL_KEY_32_BYTES);
    expect(serialized).not.toContain('postgresql://');
  });
});
