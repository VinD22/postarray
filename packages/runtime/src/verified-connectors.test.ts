import { loadConfigFor } from '@relay/config';
import { createLogger } from '@relay/observability';
import { describe, expect, it } from 'vitest';

import { createVerifiedConnectorRegistry } from './verified-connectors';

function config(overrides: Record<string, string> = {}) {
  return loadConfigFor('api', {
    NODE_ENV: 'development',
    APP_URL: 'https://app.example.test',
    API_URL: 'https://api.example.test',
    DATABASE_URL: 'postgresql://relay:relay@localhost:5432/relay',
    TOKEN_ENCRYPTION_LOCAL_KEY: Buffer.alloc(32, 3).toString('base64'),
    ...overrides,
  });
}

const logger = createLogger({ service: 'verified-connectors-test' }, { level: 'silent' });

describe('createVerifiedConnectorRegistry', () => {
  it('registers the complete adapter matrix but exposes no unverified provider', () => {
    const registry = createVerifiedConnectorRegistry({
      config: config(),
      logger,
      clock: { now: () => new Date('2026-08-07T00:00:00.000Z') },
    });

    expect(registry.has('bluesky')).toBe(false);
    expect(registry.has('x')).toBe(false);
    expect(registry.has('fake')).toBe(false);
  });

  it('does not let configured credentials bypass the verification gate', () => {
    const registry = createVerifiedConnectorRegistry({
      config: config({ X_CLIENT_ID: 'client-id', X_CLIENT_SECRET: 'client-secret' }),
      logger,
      clock: { now: () => new Date('2026-08-07T00:00:00.000Z') },
    });

    expect(registry.has('x')).toBe(false);
  });

  it('fails capability execution closed until the shared gateway is wired', async () => {
    const registry = createVerifiedConnectorRegistry({
      config: config(),
      logger,
      clock: { now: () => new Date('2026-08-07T00:00:00.000Z') },
    });

    await expect(
      registry.capabilitiesFor({
        provider: 'bluesky',
        connectionId: 'conn_test',
        accountType: 'personal_profile',
      }),
    ).rejects.toMatchObject({ code: 'CAPABILITY_NOT_IMPLEMENTED' });
  });
});
