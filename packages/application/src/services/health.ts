import { detectCapabilities } from '@relay/config';
import { buildHealthReport, type HealthCheck, type HealthReport } from '@relay/observability';

import type { HealthService, ServiceDeps } from '../types';
import { probeKeyValueRoundtrip, probeStorageHead } from './health-probes';

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

/**
 * A process that came up on a scheduler which does not execute durably has
 * booted, can serve reads, and will silently drop every scheduled post. That
 * is not ready, so readiness says so and the load balancer stops routing to
 * it. Anything other than Temporal fails this check by design.
 */
function schedulerCheck(deps: ServiceDeps): HealthCheck {
  const kind = deps.scheduler.describeKind();
  if (kind === 'temporal') {
    return { name: 'scheduler.kind', status: 'pass', detail: kind };
  }
  return {
    name: 'scheduler.kind',
    status: 'fail',
    detail:
      kind === 'memory'
        ? 'scheduler records intent without executing it; set TEMPORAL_ADDRESS'
        : 'scheduler runs in process without durable history; set TEMPORAL_ADDRESS',
  };
}

export function createHealthService(deps: ServiceDeps): HealthService {
  const startedAt = deps.clock.now().getTime();

  return {
    async report(): Promise<HealthReport> {
      const checks: HealthCheck[] = await Promise.all([
        timed('database.query', async () => {
          await deps.prisma.$queryRaw`select 1`;
        }),
        timed('keyvalue.roundtrip', async () => {
          await probeKeyValueRoundtrip(deps.kv);
        }),
        timed('storage.head', async () => {
          await probeStorageHead(deps.storage);
        }),
      ]);

      checks.push(schedulerCheck(deps));

      return buildHealthReport(detectCapabilities(deps.config), checks, {
        ...(deps.config.service === undefined ? {} : { service: deps.config.service }),
        startedAt,
        now: () => deps.clock.now(),
      });
    },
  };
}
