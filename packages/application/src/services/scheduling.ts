import {
  scheduleSpecSchema,
  type Paginated,
  type PublishState,
  type ScheduleSpec,
  type ValidationResult,
} from '@relay/contracts';

import type {
  ActorContext,
  PageQuery,
  SchedulingService,
  ServiceDeps,
  ValidationService,
} from '../types.js';
import type { CalendarEntry, PublishJobView } from '../views.js';

import { recordAudit } from '../internal/audit.js';
import { loadAggregate } from '../internal/content-store.js';
import { invalid, notFound } from '../internal/errors.js';
import { withIdempotency } from '../internal/idempotency.js';
import { toLocalDateTime, toProviderId } from '../internal/mappers.js';
import { pageArgs, toPage } from '../internal/pagination.js';
import { PUBLISH_JOB_SELECT, jobToView, runPublishPath } from '../internal/publish-path.js';
import { authorized, guard, type Db } from '../internal/runtime.js';

/**
 * Scheduling.
 *
 * A schedule is an absolute instant plus the zone the user actually chose it
 * in. We never store a naive local time and never compute a slot in the
 * browser's zone. A reschedule that crosses a daylight-saving boundary is shown
 * to the user before it is accepted, which is what `confirmDst` is for.
 */

const DST_CONFIRMATION_KEY = 'errors.schedule_crosses_dst';

function offsetMinutes(instant: Date, timeZone: string): number {
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  }).formatToParts(instant);
  const name = formatted.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT+00:00';
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name);
  if (match === null) {
    return 0;
  }
  const sign = match[1] === '-' ? -1 : 1;
  const hours = Number.parseInt(match[2] ?? '0', 10);
  const minutes = Number.parseInt(match[3] ?? '0', 10);
  return sign * (hours * 60 + minutes);
}

/** True when moving between these two instants changes the UTC offset. */
export function crossesOffsetChange(from: Date, to: Date, timeZone: string): boolean {
  return offsetMinutes(from, timeZone) !== offsetMinutes(to, timeZone);
}

export function createSchedulingService(
  deps: ServiceDeps,
  validation: ValidationService,
): SchedulingService {
  return {
    async schedule(
      ctx: ActorContext,
      input: { contentItemId: string; scheduleSpec: ScheduleSpec },
    ): Promise<PublishJobView> {
      const spec = scheduleSpecSchema.parse(input.scheduleSpec);
      return withIdempotency(deps.kv, ctx, {
        operation: 'scheduling.schedule',
        body: { contentItemId: input.contentItemId, scheduleSpec: spec },
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(
            deps,
            ctx,
            'post.schedule',
            undefined,
            async (db, actor) => {
              const aggregate = await loadAggregate(db, input.contentItemId);
              for (const variant of aggregate.variants) {
                guard(actor, 'post.schedule', {
                  brandId: aggregate.brandId,
                  connectionId: variant.connectionId,
                });
              }

              const result = await runPublishPath(db, deps, ctx, actor, {
                contentItemId: input.contentItemId,
                scheduleSpec: spec,
                kind: 'schedule',
                confirmation: false,
                validate: async (): Promise<ValidationResult> =>
                  validation.validate(ctx, { contentItemId: input.contentItemId }),
              });

              const first = result.jobs[0];
              if (first === undefined) {
                throw invalid('errors.no_targets_selected', {
                  contentItemId: input.contentItemId,
                });
              }
              return first;
            },
            { timeoutMs: 30_000 },
          ),
      });
    },

    async reschedule(
      ctx: ActorContext,
      input: { jobId: string; scheduleSpec: ScheduleSpec; confirmDst?: boolean },
    ): Promise<PublishJobView> {
      const spec = scheduleSpecSchema.parse(input.scheduleSpec);
      return withIdempotency(deps.kv, ctx, {
        operation: 'scheduling.reschedule',
        body: { jobId: input.jobId, scheduleSpec: spec },
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'post.reschedule', undefined, async (db, actor) => {
            const job = await db.publishJob.findFirst({
              where: { id: input.jobId },
              select: PUBLISH_JOB_SELECT,
            });
            if (job === null) {
              throw notFound('publish_job', input.jobId);
            }
            guard(actor, 'post.reschedule', { connectionId: job.connectionId });

            if (job.state === 'published' || job.state === 'dispatching') {
              throw invalid('errors.job_already_dispatching', { state: job.state });
            }

            const next = new Date(spec.instant);
            if (next.getTime() <= deps.clock.now().getTime()) {
              throw invalid('errors.schedule_in_past', { instant: spec.instant });
            }

            // A daylight-saving shift changes the wall-clock time the user
            // asked for. Say so before accepting it, never afterwards.
            if (
              crossesOffsetChange(job.scheduledFor, next, spec.ianaTimeZone) &&
              input.confirmDst !== true
            ) {
              throw invalid(DST_CONFIRMATION_KEY, {
                from: toLocalDateTime(job.scheduledFor, spec.ianaTimeZone),
                to: toLocalDateTime(next, spec.ianaTimeZone),
                ianaTimeZone: spec.ianaTimeZone,
              });
            }

            await db.publishJob.update({
              where: { id: job.id },
              data: {
                scheduledFor: next,
                scheduledTimeZone: spec.ianaTimeZone,
                state: 'scheduled',
              },
            });
            await deps.scheduler.reschedulePublish({ jobId: job.id, executeAt: next });

            await recordAudit(db, actor, {
              action: 'post.rescheduled',
              targetType: 'publish_job',
              targetId: job.id,
              before: { scheduledInstant: job.scheduledFor.toISOString() },
              after: { scheduledInstant: next.toISOString() },
              metadata: { ianaTimeZone: spec.ianaTimeZone },
            });

            const refreshed = await db.publishJob.findFirst({
              where: { id: job.id },
              select: PUBLISH_JOB_SELECT,
            });
            if (refreshed === null) {
              throw notFound('publish_job', job.id);
            }
            return jobToView(refreshed);
          }),
      });
    },

    async cancel(
      ctx: ActorContext,
      input: { jobId: string; reason: string },
    ): Promise<PublishJobView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'scheduling.cancel',
        body: input,
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'post.cancel', undefined, async (db, actor) => {
            const job = await db.publishJob.findFirst({
              where: { id: input.jobId },
              select: PUBLISH_JOB_SELECT,
            });
            if (job === null) {
              throw notFound('publish_job', input.jobId);
            }
            guard(actor, 'post.cancel', { connectionId: job.connectionId });

            // A target that already produced an external post is never rolled
            // back by a cancel. Cancelling stops what has not happened yet.
            if (job.state === 'published') {
              throw invalid('errors.job_already_published', { jobId: job.id });
            }

            await deps.scheduler.cancelPublish({ jobId: job.id, reason: input.reason });
            await db.publishJob.update({
              where: { id: job.id },
              data: { state: 'canceled', canceledAt: deps.clock.now() },
            });
            await recordAudit(db, actor, {
              action: 'post.canceled',
              targetType: 'publish_job',
              targetId: job.id,
              before: { state: job.state },
              after: { state: 'canceled' },
              metadata: { reason: input.reason },
            });

            const refreshed = await db.publishJob.findFirst({
              where: { id: job.id },
              select: PUBLISH_JOB_SELECT,
            });
            if (refreshed === null) {
              throw notFound('publish_job', job.id);
            }
            return jobToView(refreshed);
          }),
      });
    },

    async getCalendar(
      ctx: ActorContext,
      input: PageQuery & {
        from: string;
        to: string;
        filters?: {
          brandId?: string;
          campaignId?: string;
          connectionId?: string;
          state?: PublishState;
        };
      },
    ): Promise<Paginated<CalendarEntry>> {
      return authorized(deps, ctx, 'content.read', undefined, async (db) => {
        const args = pageArgs(input);
        const from = new Date(input.from);
        const to = new Date(input.to);
        if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
          throw invalid('errors.invalid_range', { from: input.from, to: input.to });
        }
        const filters = input.filters ?? {};
        const rows = await db.publishJob.findMany({
          where: {
            scheduledFor: { gte: from, lte: to },
            ...(filters.connectionId === undefined ? {} : { connectionId: filters.connectionId }),
            ...(filters.state === undefined ? {} : { state: filters.state }),
            ...(filters.brandId === undefined && filters.campaignId === undefined
              ? {}
              : {
                  contentItem: {
                    ...(filters.brandId === undefined ? {} : { brandId: filters.brandId }),
                    ...(filters.campaignId === undefined ? {} : { campaignId: filters.campaignId }),
                  },
                }),
          },
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: {
            id: true,
            contentItemId: true,
            connectionId: true,
            state: true,
            scheduledFor: true,
            scheduledTimeZone: true,
            approvalPolicy: true,
            connection: { select: { provider: true } },
            contentItem: { select: { title: true, brandId: true, campaignId: true } },
          },
        });

        return toPage(
          rows,
          args,
          (row) => row.id,
          (row): CalendarEntry => ({
            jobId: row.id,
            contentItemId: row.contentItemId,
            title: row.contentItem.title,
            brandId: row.contentItem.brandId,
            campaignId: row.contentItem.campaignId,
            connectionId: row.connectionId,
            provider: toProviderId(row.connection.provider),
            state: row.state,
            instant: row.scheduledFor.toISOString(),
            ianaTimeZone: row.scheduledTimeZone,
            approvalRequired: row.approvalPolicy !== 'none',
          }),
        );
      });
    },

    async nextAvailableSlot(
      ctx: ActorContext,
      input: { brandId: string; after?: string },
    ): Promise<{ instant: string; ianaTimeZone: string }> {
      return authorized(
        deps,
        ctx,
        'content.read',
        { brandId: input.brandId },
        async (db, actor) => {
          const brand = await db.brand.findFirst({
            where: { id: input.brandId },
            select: { defaultTimeZone: true },
          });
          if (brand === null) {
            throw notFound('brand', input.brandId);
          }
          const timeZone = brand.defaultTimeZone ?? actor.workspace.defaultTimeZone;
          const after = input.after === undefined ? deps.clock.now() : new Date(input.after);
          if (Number.isNaN(after.getTime())) {
            throw invalid('errors.invalid_range', { after: input.after ?? null });
          }
          return findNextSlot(db, input.brandId, after, timeZone);
        },
      );
    },
  };
}

/** Slots are on the hour. The first hour with no scheduled job for the brand. */
const SLOT_MINUTES = 60;
const MAX_SLOT_SEARCH_HOURS = 24 * 30;

async function findNextSlot(
  db: Db,
  brandId: string,
  after: Date,
  timeZone: string,
): Promise<{ instant: string; ianaTimeZone: string }> {
  const start = new Date(after.getTime());
  start.setUTCMinutes(0, 0, 0);
  start.setUTCHours(start.getUTCHours() + 1);

  const horizon = new Date(start.getTime() + MAX_SLOT_SEARCH_HOURS * 3_600_000);
  const taken = await db.publishJob.findMany({
    where: {
      scheduledFor: { gte: start, lte: horizon },
      state: { notIn: ['canceled', 'failed_permanently'] },
      contentItem: { brandId },
    },
    select: { scheduledFor: true },
  });
  const occupied = new Set(taken.map((row) => row.scheduledFor.toISOString()));

  for (let hour = 0; hour < MAX_SLOT_SEARCH_HOURS; hour += 1) {
    const candidate = new Date(start.getTime() + hour * SLOT_MINUTES * 60_000);
    if (!occupied.has(candidate.toISOString())) {
      return { instant: candidate.toISOString(), ianaTimeZone: timeZone };
    }
  }
  return { instant: horizon.toISOString(), ianaTimeZone: timeZone };
}
