import { describe, expect, it } from 'vitest';

import {
  assertCapability,
  availableConnectors,
  capabilityLevel,
  capabilityReason,
  detectCapabilities,
  getCapability,
  listCapabilities,
  missingEnvVars,
} from './capabilities';
import { CapabilityUnavailableError } from './errors';
import { loadConfig } from './load';

const LOCAL_KEY_32_BYTES = Buffer.alloc(32, 3).toString('base64');

const minimal = {
  APP_URL: 'http://localhost:3000',
  API_URL: 'http://localhost:3001',
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/relay?schema=public',
  TOKEN_ENCRYPTION_LOCAL_KEY: LOCAL_KEY_32_BYTES,
};

const capabilitiesFor = (extra: Record<string, string> = {}) =>
  detectCapabilities(loadConfig({ ...minimal, ...extra }));

describe('detectCapabilities', () => {
  it('reports the bare local install truthfully', () => {
    const capabilities = capabilitiesFor();
    expect(capabilities.database).toBe('live');
    expect(capabilities.redis).toBe('degraded:in-memory');
    expect(capabilities.temporal).toBe('degraded:inline-scheduler');
    expect(capabilities.storage).toBe('degraded:local-filesystem');
    expect(capabilities.email).toBe('degraded:console');
    expect(capabilities.errorReporting).toBe('degraded:logs-only');
    expect(capabilities.billing).toBe('disabled:missing POLAR_ACCESS_TOKEN');
    expect(capabilities.ai).toBe('disabled:missing DEEPSEEK_API_KEY');
    expect(capabilities.tracing).toBe('disabled:missing OTEL_EXPORTER_OTLP_ENDPOINT');
    expect(capabilities.productAnalytics).toBe('disabled:missing POSTHOG_KEY');
    expect(capabilities.shortLinks).toBe('disabled:missing SHORT_LINK_BASE_URL');
  });

  it('reports every connector as disabled with the exact variable to set', () => {
    const capabilities = capabilitiesFor();
    expect(capabilities.connectors.x).toBe('disabled:missing X_CLIENT_ID, X_CLIENT_SECRET');
    expect(capabilities.connectors.linkedin).toBe(
      'disabled:missing LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET',
    );
    expect(capabilities.connectors.youtube).toBe(
      'disabled:missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET',
    );
    expect(capabilities.connectors.tiktok).toBe(
      'disabled:missing TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET',
    );
  });

  it('keeps the fake connector and bluesky usable offline', () => {
    const capabilities = capabilitiesFor();
    expect(capabilities.connectors.fake).toBe('live');
    expect(capabilities.connectors.bluesky).toBe('live');
    expect(availableConnectors(capabilities)).toEqual(['bluesky', 'fake']);
  });

  it('reports a half configured connector as disabled, naming the missing half', () => {
    const capabilities = capabilitiesFor({ X_CLIENT_ID: 'placeholder-id' });
    expect(capabilities.connectors.x).toBe('disabled:missing X_CLIENT_SECRET');
    expect(missingEnvVars(capabilities.connectors.x)).toEqual(['X_CLIENT_SECRET']);
  });

  it('shares the Meta app across instagram, facebook and threads', () => {
    const capabilities = capabilitiesFor({
      META_APP_ID: 'placeholder-id',
      META_APP_SECRET: 'placeholder-secret',
    });
    expect(capabilities.connectors.instagram).toBe('live');
    expect(capabilities.connectors.facebook).toBe('live');
    expect(capabilities.connectors.threads).toBe('live');
  });

  it('goes live once the supporting services are configured', () => {
    const capabilities = capabilitiesFor({
      REDIS_URL: 'redis://localhost:6379',
      TEMPORAL_ADDRESS: 'localhost:7233',
      SUPABASE_URL: 'https://project.supabase.co',
      SUPABASE_ANON_KEY: 'placeholder-anon',
      SUPABASE_SERVICE_ROLE_KEY: 'placeholder-service-role',
      SUPABASE_JWT_SECRET: 'placeholder-jwt-secret',
      DEEPSEEK_API_KEY: 'placeholder-ai-key',
      EMAIL_API_KEY: 'placeholder-email-key',
      EMAIL_FROM: 'Relay <no-reply@example.test>',
      OTEL_EXPORTER_OTLP_ENDPOINT: 'https://otel.example.test',
      SENTRY_DSN: 'https://public@sentry.example.test/1',
      POSTHOG_KEY: 'placeholder-posthog',
    });
    expect(capabilities.redis).toBe('live');
    expect(capabilities.temporal).toBe('live');
    expect(capabilities.storage).toBe('live');
    expect(capabilities.auth).toBe('live');
    expect(capabilities.ai).toBe('live');
    expect(capabilities.email).toBe('live');
    expect(capabilities.tracing).toBe('live');
    expect(capabilities.errorReporting).toBe('live');
    expect(capabilities.productAnalytics).toBe('live');
  });

  it('degrades billing when the access token exists but the rest does not', () => {
    const capabilities = capabilitiesFor({ POLAR_ACCESS_TOKEN: 'placeholder-token' });
    expect(capabilities.billing).toBe(
      'degraded:missing POLAR_WEBHOOK_SECRET, POLAR_MONTHLY_PRODUCT_ID, POLAR_ANNUAL_PRODUCT_ID',
    );
  });

  it('degrades encryption in production when only a local key exists', () => {
    const capabilities = capabilitiesFor({ NODE_ENV: 'production' });
    expect(capabilities.encryption).toBe('degraded:local-key-without-kms');
  });

  it('keeps encryption live in development with a local key', () => {
    expect(capabilitiesFor().encryption).toBe('live');
  });

  it('degrades short links when the hash key is absent', () => {
    const capabilities = capabilitiesFor({ SHORT_LINK_BASE_URL: 'http://localhost:3002' });
    expect(capabilities.shortLinks).toBe('degraded:missing SHORT_LINK_HASH_KEY');
  });

  it('is frozen so a caller cannot rewrite the reported truth', () => {
    const capabilities = capabilitiesFor();
    expect(Object.isFrozen(capabilities)).toBe(true);
    expect(Object.isFrozen(capabilities.connectors)).toBe(true);
  });
});

describe('capability helpers', () => {
  it('splits a status into a level and a reason', () => {
    expect(capabilityLevel('live')).toBe('live');
    expect(capabilityLevel('degraded:in-memory')).toBe('degraded');
    expect(capabilityLevel('disabled:missing POLAR_ACCESS_TOKEN')).toBe('disabled');
    expect(capabilityReason('live')).toBeUndefined();
    expect(capabilityReason('degraded:in-memory')).toBe('in-memory');
  });

  it('extracts the variables an operator must set', () => {
    expect(missingEnvVars('disabled:missing META_APP_ID, META_APP_SECRET')).toEqual([
      'META_APP_ID',
      'META_APP_SECRET',
    ]);
    expect(missingEnvVars('degraded:in-memory')).toEqual([]);
    expect(missingEnvVars('live')).toEqual([]);
  });

  it('resolves both subsystem and connector references', () => {
    const capabilities = capabilitiesFor();
    expect(getCapability(capabilities, 'database')).toBe('live');
    expect(getCapability(capabilities, 'connector:fake')).toBe('live');
  });

  it('lists every capability for the admin panel', () => {
    const entries = listCapabilities(capabilitiesFor());
    expect(entries).toHaveLength(14 + 9);
    const billing = entries.find((entry) => entry.name === 'billing');
    expect(billing?.level).toBe('disabled');
    expect(billing?.requiredEnvVars).toEqual(['POLAR_ACCESS_TOKEN']);
  });
});

describe('assertCapability', () => {
  it('passes for a live capability', () => {
    expect(() => assertCapability(capabilitiesFor(), 'database')).not.toThrow();
  });

  it('accepts a degraded substitute by default', () => {
    expect(() => assertCapability(capabilitiesFor(), 'redis')).not.toThrow();
  });

  it('rejects a degraded substitute when the caller demands live', () => {
    expect(() => assertCapability(capabilitiesFor(), 'redis', { allowDegraded: false })).toThrow(
      CapabilityUnavailableError,
    );
  });

  it('throws a typed error naming the exact variable to set', () => {
    let error: unknown;
    try {
      assertCapability(capabilitiesFor(), 'connector:tiktok');
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(CapabilityUnavailableError);
    const typed = error as CapabilityUnavailableError;
    expect(typed.code).toBe('capability_unavailable');
    expect(typed.capability).toBe('connector:tiktok');
    expect(typed.level).toBe('disabled');
    expect(typed.requiredEnvVars).toEqual(['TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET']);
    expect(typed.message).toContain('TIKTOK_CLIENT_KEY');
    expect(typed.message).toContain('.env');
  });
});
