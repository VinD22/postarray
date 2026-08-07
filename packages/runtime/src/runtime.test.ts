import { MemoryKeyValueStore, MemoryStorage, RecordingMailer } from '@relay/application';
import { loadConfigFor } from '@relay/config';
import type { RelayPrismaClient } from '@relay/database';
import { createLogger } from '@relay/observability';
import { describe, expect, it, vi } from 'vitest';

import { createApplicationRuntime } from './runtime';

const database = {
  entitlement: { findFirst: vi.fn() },
  usageEvent: { aggregate: vi.fn(), upsert: vi.fn() },
  $disconnect: vi.fn(),
} as unknown as RelayPrismaClient;

function config(nodeEnv: 'development' | 'production') {
  return loadConfigFor('api', {
    NODE_ENV: nodeEnv,
    APP_URL: 'https://app.example.test',
    API_URL: 'https://api.example.test',
    DATABASE_URL: 'postgresql://relay:relay@localhost:5432/relay',
    TOKEN_ENCRYPTION_LOCAL_KEY: Buffer.alloc(32, 7).toString('base64'),
  });
}

describe('createApplicationRuntime', () => {
  it('assembles the canonical service graph for local development', async () => {
    const runtime = createApplicationRuntime({
      config: config('development'),
      logger: createLogger({ service: 'runtime-test' }, { level: 'silent' }),
      adapters: { prisma: database },
    });

    expect(runtime.services).toHaveProperty('publishing');
    expect(runtime.services).toHaveProperty('connections');
    await runtime.close();
  });

  it('refuses production when durable adapters were not supplied', () => {
    expect(() =>
      createApplicationRuntime({
        config: config('production'),
        logger: createLogger({ service: 'runtime-test' }, { level: 'silent' }),
        adapters: { prisma: database },
      }),
    ).toThrowError(expect.objectContaining({ code: 'INTERNAL' }));
  });

  it('accepts an explicitly complete production adapter set', async () => {
    const clock = { now: () => new Date('2026-08-06T00:00:00.000Z') };
    const runtime = createApplicationRuntime({
      config: config('production'),
      logger: createLogger({ service: 'runtime-test' }, { level: 'silent' }),
      clock,
      adapters: {
        prisma: database,
        kv: new MemoryKeyValueStore(clock),
        scheduler: {
          schedulePublish: vi.fn(),
          cancelPublish: vi.fn(),
          reschedulePublish: vi.fn(),
          signalPublish: vi.fn(),
          scheduleAnalyticsSync: vi.fn(),
          startRuleRun: vi.fn(),
          scheduleDataExport: vi.fn(),
          describe: vi.fn(),
        },
        storage: new MemoryStorage(clock),
        mailer: new RecordingMailer(),
      },
    });

    expect(runtime.services.health).toBeDefined();
    await runtime.close();
  });
});
