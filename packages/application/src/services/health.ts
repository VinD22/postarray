import { detectCapabilities } from '@relay/config';
import { buildHealthReport, type HealthCheck, type HealthReport } from '@relay/observability';

import type { HealthService, ServiceDeps } from '../types';
import { probeKeyValueRoundtrip } from './health-probes';

/**
 * Health.
 *
 * The only service method with no `ActorContext`: a load balancer and a status
 * page cannot authenticate. It therefore reports capability names, levels and
 * the environment variables an operator still has to set, and never a config
 * value, a host name or a connection string.
 */

const PROBE_TIMEOUT_MS = 2000;

async function timed(name: string, probe: () => Promise<void>): Promise<HealthCheck> {
  // A duration, not a wall clock reading. performance.now() is monotonic and is
  // unaffected by a clock change, which is what a latency probe needs.
  const startedAt = performance.now();
  try {
    await Promise.race([
      probe(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), PROBE_TIMEOUT_MS).unref?.();
      }),
    ]);
    return { name, status: 'pass', latencyMs: Math.round(performance.now() - startedAt) };
  } catch (error) {
    return {
      name,
      status: 'fail',
      latencyMs: Math.round(performance.now() - startedAt),
      detail: error instanceof Error ? error.name : 'unknown',
    };
  }
}

export function createHealthService(deps: ServiceDeps): HealthService {
  const startedAt = deps.clock.now().getTime();

  return {
    async report(): Promise<HealthReport> {
      const checks = await Promise.all([
        timed('database.query', async () => {
          await deps.prisma.$queryRaw`select 1`;
        }),
        timed('keyvalue.roundtrip', async () => {
          await probeKeyValueRoundtrip(deps.kv);
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
