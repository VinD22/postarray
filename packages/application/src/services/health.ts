import { detectCapabilities } from '@relay/config';
import { buildHealthReport, type HealthCheck, type HealthReport } from '@relay/observability';

import type { HealthService, ServiceDeps } from '../types.js';

/**
 * Health.
 *
 * The only service method with no `ActorContext`: a load balancer and a status
 * page cannot authenticate. It therefore reports capability names, levels and
 * the environment variables an operator still has to set, and never a config
 * value, a host name or a connection string.
 */

const PROBE_TIMEOUT_MS = 2000;

async function timed(
  name: string,
  probe: () => Promise<void>,
): Promise<HealthCheck> {
  const startedAt = Date.now();
  try {
    await Promise.race([
      probe(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), PROBE_TIMEOUT_MS).unref?.();
      }),
    ]);
    return { name, status: 'pass', latencyMs: Date.now() - startedAt };
  } catch (error) {
    return {
      name,
      status: 'fail',
      latencyMs: Date.now() - startedAt,
      detail: error instanceof Error ? error.name : 'unknown',
    };
  }
}

export function createHealthService(deps: ServiceDeps): HealthService {
  const startedAt = Date.now();

  return {
    async report(): Promise<HealthReport> {
      const checks = await Promise.all([
        timed('database.query', async () => {
          await deps.prisma.$queryRaw`select 1`;
        }),
        timed('keyvalue.roundtrip', async () => {
          const probeKey = 'health:probe';
          await deps.kv.set(probeKey, '1', { ttlSeconds: 5 });
          await deps.kv.get(probeKey);
        }),
        timed('storage.head', async () => {
          await deps.storage.head('health/probe');
        }),
      ]);

      return buildHealthReport(detectCapabilities(deps.config), checks, {
        ...(deps.config.service === undefined ? {} : { service: deps.config.service }),
        startedAt,
        now: () => deps.clock.now(),
      });
    },
  };
}
