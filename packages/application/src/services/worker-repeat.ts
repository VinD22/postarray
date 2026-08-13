import type {
  ActorContext,
  ServiceDeps,
  WorkerActivityContext,
  WorkerRepeatService,
} from '../types';

import { enqueueWorkflowOutbox } from '../internal/enqueue-outbox';
import { toProviderId } from '../internal/mappers';
import { runInWorkspace } from '../internal/runtime';
import { localDateTimeIn, partsOf, resolveWallClock } from '../internal/zone-time';

/**
 * A repeating series, occurrence by occurrence.
 *
 * Two activities and no connector. Planning answers "when is occurrence N, and
 * should it run at all"; creation inserts that occurrence's publish jobs.
 *
 * Both are written around one failure we refuse to have: a repeat that
 * double-inserts is a duplicate post, and a duplicate post is the worst thing
 * this product can do. The insert is therefore keyed on a caller-supplied
 * dedupe key that already names the series and the occurrence index, and the
 * database holds a unique index on `(workspace_id, idempotency_key)`. A second
 * call finds the row it wrote the first time and reports `created: false`.
 */

const DAY_MS = 24 * 60 * 60_000;
const MINUTES_PER_DAY = 24 * 60;

function context(ctx: WorkerActivityContext): ActorContext {
  return { ...ctx, scopes: [] };
}

/** Content items that can no longer produce an occurrence. */
const STOPPED_STATES = new Set(['canceled', 'deleted_externally']);

/**
 * Occurrence N of a series, in the series' own time zone.
 *
 * The cadence is counted in local calendar days and the wall clock is carried
 * across unchanged, so a weekly 09:00 post is still at 09:00 after the clocks
 * change rather than drifting to 08:00 or 10:00. Where the chosen wall clock
 * does not exist on that day, because the zone sprang forward over it, the
 * occurrence moves to the next hour that does exist. It never silently skips: a
 * missing post is a failure the user did not ask for.
 */
export function occurrenceInstant(input: {
  readonly firstInstant: string;
  readonly ianaTimeZone: string;
  readonly occurrenceIndex: number;
  readonly cadenceDays: number;
}): Date {
  const first = new Date(input.firstInstant);
  const parts = partsOf(first, input.ianaTimeZone);
  const shifted = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day) +
      input.occurrenceIndex * input.cadenceDays * DAY_MS,
  );
  const wall = {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    minuteOfDay: parts.hour * 60 + parts.minute,
  };
  for (let probe = 0; probe < 4; probe += 1) {
    const resolved = resolveWallClock(
      { ...wall, minuteOfDay: (wall.minuteOfDay + probe * 60) % MINUTES_PER_DAY },
      input.ianaTimeZone,
    );
    if (resolved.kind !== 'nonexistent') {
      return resolved.instant;
    }
  }
  // The zone answered "that time does not exist" four hours running, which no
  // real transition does. Fall back to plain arithmetic rather than drop a post.
  return new Date(first.getTime() + input.occurrenceIndex * input.cadenceDays * DAY_MS);
}

export function createWorkerRepeatService(deps: ServiceDeps): WorkerRepeatService {
  return {
    async planRepeatOccurrence(input) {
      const instant = occurrenceInstant({
        firstInstant: input.firstInstant,
        ianaTimeZone: input.ianaTimeZone,
        occurrenceIndex: input.occurrenceIndex,
        cadenceDays: input.cadenceDays,
      });
      const plan = {
        instant: instant.toISOString(),
        localDateTime: localDateTimeIn(instant, input.ianaTimeZone),
      };
      const stop = (
        reasonKey: string,
      ): Awaited<ReturnType<WorkerRepeatService['planRepeatOccurrence']>> => ({
        shouldRun: false,
        ...plan,
        reasonKey,
      });

      if (input.count !== null && input.occurrenceIndex >= input.count) {
        return stop('repeat.series_reached_count');
      }
      if (input.endDate !== null && instant.getTime() > new Date(input.endDate).getTime()) {
        return stop('repeat.series_reached_end_date');
      }

      // The source post is authoritative. A series whose post was canceled or
      // deleted stops, rather than republishing something nobody can see.
      const source = await runInWorkspace(deps, context(input.ctx), (db) =>
        db.contentItem.findFirst({
          where: { id: input.contentItemId, workspaceId: input.ctx.workspaceId },
          select: { id: true, state: true, canceledAt: true },
        }),
      );
      if (source === null || source.canceledAt !== null || STOPPED_STATES.has(source.state)) {
        return stop('repeat.series_canceled');
      }
      return { shouldRun: true, ...plan, reasonKey: null };
    },

    async createOccurrenceJob(input) {
      return runInWorkspace(deps, context(input.ctx), async (db) => {
        const item = await db.contentItem.findFirst({
          where: { id: input.contentItemId, workspaceId: input.ctx.workspaceId },
          select: {
            id: true,
            approvalPolicy: true,
            surface: true,
            currentVersionId: true,
            approvedVersionId: true,
          },
        });
        // The version the series repeats is the approved one where there is
        // one, so an unapproved edit never rides out on the next occurrence.
        const versionId = item?.approvedVersionId ?? item?.currentVersionId ?? null;
        const version =
          versionId === null
            ? null
            : await db.contentVersion.findFirst({
                where: { id: versionId, workspaceId: input.ctx.workspaceId },
                select: { id: true, contentHash: true },
              });
        if (item === null || version === null) {
          return {
            publishJobId: '',
            contentVersionId: '',
            contentVersionChecksum: '',
            created: false,
            targets: [],
          };
        }

        const variants = await db.postVariant.findMany({
          where: {
            contentItemId: item.id,
            contentVersionId: version.id,
            workspaceId: input.ctx.workspaceId,
          },
          orderBy: { id: 'asc' },
          select: {
            id: true,
            connectionId: true,
            provider: true,
            capabilitySnapshotVersion: true,
          },
        });

        const instant = new Date(input.instant);
        let firstJobId = '';
        let created = false;
        for (const variant of variants) {
          // One key per occurrence and target. The workflow's own dedupe key
          // names the series and the index; the target completes it, so the
          // unique index on (workspace_id, idempotency_key) is what actually
          // stops a second insert, not a lookup that could race.
          const idempotencyKey = `${input.idempotencyKey}:${variant.id}`;
          const existing = await db.publishJob.findFirst({
            where: { workspaceId: input.ctx.workspaceId, idempotencyKey },
            select: { id: true },
          });
          if (existing !== null) {
            firstJobId = firstJobId === '' ? existing.id : firstJobId;
            continue;
          }
          const job = await db.publishJob.create({
            data: {
              workspaceId: input.ctx.workspaceId,
              contentItemId: item.id,
              contentVersionId: version.id,
              postVariantId: variant.id,
              connectionId: variant.connectionId,
              approvalPolicy: item.approvalPolicy,
              scheduledFor: instant,
              scheduledTimeZone: input.ianaTimeZone,
              state: 'scheduled',
              idempotencyKey,
              surface: item.surface,
            },
            select: { id: true },
          });
          created = true;
          firstJobId = firstJobId === '' ? job.id : firstJobId;

          // Publishing is started by the outbox dispatcher, exactly as it is
          // for a hand-scheduled post. An occurrence therefore travels the same
          // path, through the same preflight, as everything else in the queue.
          await enqueueWorkflowOutbox(db, {
            kind: 'start_publish',
            dedupeKey: `start-publish:${job.id}`,
            payload: {
              jobId: job.id,
              workspaceId: input.ctx.workspaceId,
              executeAt: instant.toISOString(),
              idempotencyKey,
              workflowInput: {
                ctx: {
                  workspaceId: input.ctx.workspaceId,
                  correlationId: input.ctx.correlationId,
                  actorId: input.ctx.actorId,
                  actorType: input.ctx.actorType,
                  surface: input.ctx.surface,
                  approvalLevel: input.ctx.approvalLevel,
                  locale: input.ctx.locale,
                },
                publishJobId: job.id,
                contentItemId: item.id,
                contentVersionId: version.id,
                contentVersionChecksum: version.contentHash,
                idempotencyKey,
                executeAt: instant.toISOString(),
                scheduledLocalTime: input.localDateTime,
                ianaTimeZone: input.ianaTimeZone,
                targets: [
                  {
                    targetId: variant.id,
                    connectionId: variant.connectionId,
                    provider: toProviderId(variant.provider),
                    approvedCapabilityVersion: variant.capabilitySnapshotVersion ?? 'unavailable',
                    threadItemIds: [],
                    threadDelaysSeconds: [],
                  },
                ],
                immediate: false,
              },
            },
          });
        }

        return {
          publishJobId: firstJobId,
          contentVersionId: version.id,
          contentVersionChecksum: version.contentHash,
          created,
          // Deliberately empty: every occurrence job is dispatched by the
          // outbox above. Handing the same target back would start a second
          // workflow for a job that already has one, which is the duplicate
          // this whole file exists to prevent.
          targets: [],
        };
      });
    },
  };
}
