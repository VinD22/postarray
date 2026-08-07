import { loadConfigFor } from '@relay/config';
import type { RelayPrismaClient } from '@relay/database';
import { createLogger } from '@relay/observability';
import { describe, expect, it } from 'vitest';

import { createWorkerConnectorRuntime } from './connector-runtime';

const prisma = {} as RelayPrismaClient;
const logger = createLogger({ service: 'worker-connector-runtime-test' }, { level: 'silent' });

function config(nodeEnv: 'development' | 'production') {
  return loadConfigFor('worker', {
    NODE_ENV: nodeEnv,
    APP_URL: 'https://app.example.test',
    API_URL: 'https://api.example.test',
    DATABASE_URL: 'postgresql://relay:relay@localhost:5432/relay',
    TOKEN_ENCRYPTION_LOCAL_KEY: Buffer.alloc(32, 13).toString('base64'),
  });
}

describe('worker connector runtime composition', () => {
  it('constructs the seam locally while the verified allow-list still blocks providers', () => {
    const runtime = createWorkerConnectorRuntime({
      config: config('development'),
      logger,
      prisma,
      clock: { now: () => new Date('2026-08-07T00:00:00.000Z') },
    });

    expect(runtime.gateway).not.toBeNull();
    expect(runtime.credentialVault).not.toBeNull();
    runtime.close();
  });

  it('does not construct a credential execution gateway from a local key in production', () => {
    const runtime = createWorkerConnectorRuntime({
      config: config('production'),
      logger,
      prisma,
      clock: { now: () => new Date('2026-08-07T00:00:00.000Z') },
    });

    expect(runtime.gateway).toBeNull();
    expect(runtime.credentialVault).toBeNull();
    runtime.close();
  });
});

