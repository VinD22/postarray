import type { Clock, MediaService } from '@relay/application';
import {
  serviceRoleClaims,
  withRlsContext,
  type RelayPrismaClient,
} from '@relay/database';
import type { Logger } from '@relay/observability';

export const MEDIA_RETENTION_SWEEP_INTERVAL_MS = 60 * 60 * 1_000;
export const MEDIA_RETENTION_WORKSPACE_BATCH = 100;
export const MEDIA_RETENTION_ASSET_BATCH = 100;
const MAX_SWEEP_PASSES = 1_000;

export interface MediaRetentionSweepResult {
  readonly workspaces: number;
  readonly purged: number;
  readonly failures: number;
}

interface DrainMediaRetentionOptions {
  readonly listWorkspaceIds: (
    excludedWorkspaceIds: readonly string[],
  ) => Promise<readonly string[]>;
  readonly purgeWorkspace: (workspaceId: string) => Promise<number>;
}

/**
 * Drain every expired object available at the start of a sweep.
 *
 * A failed tenant is excluded for the rest of this run so one unavailable
 * object cannot starve every workspace behind it. The next hourly sweep retries
 * it. Each workspace is drained in bounded batches because object deletion is
 * an external side effect and every successful object is recorded before the
 * next batch begins.
 */
export async function drainMediaRetention(
  options: DrainMediaRetentionOptions,
): Promise<MediaRetentionSweepResult> {
  const failedWorkspaceIds = new Set<string>();
  const visitedWorkspaceIds = new Set<string>();
  let purged = 0;

  for (let pass = 0; pass < MAX_SWEEP_PASSES; pass += 1) {
    const workspaceIds = await options.listWorkspaceIds([...failedWorkspaceIds]);
    if (workspaceIds.length === 0) {
      return {
        workspaces: visitedWorkspaceIds.size,
        purged,
        failures: failedWorkspaceIds.size,
      };
    }

    for (const workspaceId of workspaceIds) {
      visitedWorkspaceIds.add(workspaceId);
      try {
        for (let batch = 0; batch < MAX_SWEEP_PASSES; batch += 1) {
          const count = await options.purgeWorkspace(workspaceId);
          purged += count;
          if (count < MEDIA_RETENTION_ASSET_BATCH) {
            break;
          }
        }
      } catch {
        failedWorkspaceIds.add(workspaceId);
      }
    }
  }

  return {
    workspaces: visitedWorkspaceIds.size,
    purged,
    failures: failedWorkspaceIds.size,
  };
}

export interface RunMediaRetentionSweepOptions {
  readonly prisma: RelayPrismaClient;
  readonly media: Pick<MediaService, 'purgeExpired'>;
  readonly clock: Clock;
  readonly logger: Logger;
}

/** Discover tenants under service-role RLS, then delete through the app service. */
export async function runMediaRetentionSweep(
  options: RunMediaRetentionSweepOptions,
): Promise<MediaRetentionSweepResult> {
  const result = await drainMediaRetention({
    listWorkspaceIds: (excludedWorkspaceIds) =>
      withRlsContext(options.prisma, serviceRoleClaims(), async (db) => {
        const rows = await db.mediaAsset.findMany({
          where: {
            retentionExpiresAt: { lte: options.clock.now() },
            storageDeletedAt: null,
            ...(excludedWorkspaceIds.length === 0
              ? {}
              : { workspaceId: { notIn: [...excludedWorkspaceIds] } }),
          },
          distinct: ['workspaceId'],
          orderBy: { workspaceId: 'asc' },
          take: MEDIA_RETENTION_WORKSPACE_BATCH,
          select: { workspaceId: true },
        });
        return rows.map((row) => row.workspaceId);
      }),
    purgeWorkspace: async (workspaceId) => {
      try {
        const batch = await options.media.purgeExpired(
          {
            actorType: 'system',
            actorId: 'media-retention-worker',
            workspaceId,
            scopes: [],
            surface: 'automation_rule',
            correlationId: `media-retention:${options.clock.now().toISOString()}`,
            approvalLevel: 'level_3_confirm',
            locale: 'en',
          },
          MEDIA_RETENTION_ASSET_BATCH,
        );
        return batch.purged;
      } catch (error: unknown) {
        options.logger.warn(
          {
            workspaceId,
            error: error instanceof Error ? error.name : 'unknown',
          },
          'media.retention_workspace_failed',
        );
        throw error;
      }
    },
  });

  options.logger.info(result, 'media.retention_sweep_complete');
  return result;
}

export interface RunningMediaRetentionSweep {
  stop(): Promise<void>;
}

/** Start immediately, then hourly. Overlapping sweeps are skipped. */
export function startMediaRetentionSweep(
  options: RunMediaRetentionSweepOptions,
  intervalMs: number = MEDIA_RETENTION_SWEEP_INTERVAL_MS,
): RunningMediaRetentionSweep {
  let active: Promise<void> | null = null;

  const run = (): void => {
    if (active !== null) {
      options.logger.warn({}, 'media.retention_sweep_overlap_skipped');
      return;
    }
    active = runMediaRetentionSweep(options)
      .then(() => undefined)
      .catch((error: unknown) => {
        options.logger.error(
          { error: error instanceof Error ? error.name : 'unknown' },
          'media.retention_sweep_failed',
        );
      })
      .finally(() => {
        active = null;
      });
  };

  run();
  const timer = setInterval(run, Math.max(1_000, intervalMs));
  timer.unref();

  return {
    async stop(): Promise<void> {
      clearInterval(timer);
      await active;
    },
  };
}
