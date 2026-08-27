import {
  MAX_SCHEDULE_HORIZON_DAYS,
  scheduleSpecSchema,
  type Paginated,
  type PublishState,
  type ScheduleSpec,
  type SlotProposal,
  type ValidationResult,
} from '@relay/contracts';

import type {
  ActorContext,
  PageQuery,
  SchedulingService,
  ServiceDeps,
  ValidationService,
} from '../types';
import type { CalendarEntry, PublishJobView } from '../views';

import { recordAudit } from '../internal/audit';
import { loadAggregate } from '../internal/content-store';
import { enqueueWorkflowOutbox } from '../internal/enqueue-outbox';
import { invalid, notFound } from '../internal/errors';
import { withIdempotency } from '../internal/idempotency';
import { toLocalDateTime, toProviderId } from '../internal/mappers';
import { pageArgs, toPage } from '../internal/pagination';
import {
  PUBLISH_JOB_SELECT,
  jobToView,
  runPublishPath,
  toPublishHold,
} from '../internal/publish-path';
import { authorized, guard } from '../internal/runtime';
import { findNextSlot } from '../internal/slot-finder';
import { storedMasterSchema } from '../internal/stored-content';
import { linkReservationToJob, readQueueContext } from './queue-rules.mappers';
import { createSchedulingPause, crossesOffsetChange } from './scheduling-pause';

/**
 * Scheduling.
 *
 * A schedule is an absolute instant plus the zone the user actually chose it
 * in. We never store a naive local time and never compute a slot in the
 * browser's zone. A reschedule that crosses a daylight-saving boundary is shown
 * to the user before it is accepted, which is what `confirmDst` is for.
 */

const DST_CONFIRMATION_KEY = 'errors.schedule_crosses_dst';

/**
 * The daylight saving check lives with pause and resume, and is re-exported
 * here so its long-standing import path keeps working. There is exactly one
 * implementation, which is what makes "Move" and "Resume at a new time" warn
 * about a clock change in identical words.
 */
export { crossesOffsetChange } from './scheduling-pause';

export function createSchedulingService(
  deps: ServiceDeps,
  validation: ValidationService,
): SchedulingService {
  // Pause and resume are the same template as `cancel` and belong to the same
  // service; they live in a sibling file only because this one is already long.
  const holds = createSchedulingPause(deps);

  return {
    pause: holds.pause,
    resume: holds.resume,

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
                  projectId: aggregate.projectId,
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

              // A person may have accepted a queue slot for exactly this draft
              // at exactly this instant. Link the job onto it so the receipt and
              // the audit can say which rule chose the time. Nothing is created
              // here: an unmatched schedule simply has no reservation.
              const linked = await linkReservationToJob(db, {
                projectId: aggregate.projectId,
                instant: new Date(spec.instant),
                contentItemId: input.contentItemId,
                publishJobId: first.id,
              });
              if (linked !== null) {
                await recordAudit(db, actor, {
                  action: 'queue_slot.linked',
                  targetType: 'queue_slot_reservation',
                  targetId: linked,
                  after: { publishJobId: first.id, instant: spec.instant },
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
            // The same thirty day horizon the publish path enforces on a new
            // schedule. A reschedule must not be the loophole.
            if (
              next.getTime() >
              deps.clock.now().getTime() + MAX_SCHEDULE_HORIZON_DAYS * 24 * 60 * 60 * 1000
            ) {
              throw invalid('validation.schedule_too_far_ahead.message', {
                limit: `${MAX_SCHEDULE_HORIZON_DAYS} days`,
                instant: spec.instant,
              });
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
            await enqueueWorkflowOutbox(db, {
              kind: 'reschedule_publish',
              dedupeKey: `reschedule-publish:${job.id}:${ctx.idempotencyKey ?? spec.instant}`,
              payload: {
                jobId: job.id,
                workspaceId: ctx.workspaceId,
                executeAt: next.toISOString(),
                ianaTimeZone: spec.ianaTimeZone,
              },
            });

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

            await db.publishJob.update({
              where: { id: job.id },
              data: { state: 'canceled', canceledAt: deps.clock.now() },
            });
            await enqueueWorkflowOutbox(db, {
              kind: 'cancel_publish',
              dedupeKey: `cancel-publish:${job.id}:${ctx.idempotencyKey ?? input.reason}`,
              payload: {
                jobId: job.id,
                workspaceId: ctx.workspaceId,
                reason: input.reason,
              },
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
          projectId?: string;
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
            ...(filters.projectId === undefined && filters.campaignId === undefined
              ? {}
              : {
                  contentItem: {
                    ...(filters.projectId === undefined ? {} : { projectId: filters.projectId }),
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
            pausedAt: true,
            pausedReason: true,
            pausedByUserId: true,
            connection: { select: { provider: true, displayName: true } },
            approvalRequest: { select: { state: true } },
            contentItem: {
              select: {
                title: true,
                projectId: true,
                campaignId: true,
                currentVersion: { select: { payload: true } },
              },
            },
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
            projectId: row.contentItem.projectId,
            campaignId: row.contentItem.campaignId,
            connectionId: row.connectionId,
            provider: toProviderId(row.connection.provider),
            accountLabel: row.connection.displayName,
            contentKind: readCalendarContentKind(row.contentItem.currentVersion?.payload),
            state: row.state,
            instant: row.scheduledFor.toISOString(),
            ianaTimeZone: row.scheduledTimeZone,
            approvalRequired: row.approvalPolicy !== 'none',
            approvalState:
              row.approvalPolicy === 'none'
                ? 'not_required'
                : toCalendarApprovalState(row.approvalRequest?.state),
            hold: toPublishHold(row),
          }),
        );
      });
    },

    /**
     * The next slot, delegated to the queue model.
     *
     * The old behaviour, "the first free hour with no job for this project", is
     * still here: it is the labelled fallback inside the slot finder, used when
     * a project has configured no queue rules yet. What changed is that the
     * choice is now explainable, and the reasons travel with it.
     */
    async nextAvailableSlot(
      ctx: ActorContext,
      input: { projectId: string; after?: string },
    ): Promise<SlotProposal> {
      return authorized(
        deps,
        ctx,
        'content.read',
        { projectId: input.projectId },
        async (db, actor) => {
          const context = await readQueueContext(
            db,
            deps.clock,
            actor.workspace.defaultTimeZone,
            input,
          );
          return findNextSlot({
            rules: context.rules,
            occupied: context.occupied,
            reserved: context.reserved,
            after: context.after,
            fallbackTimeZone: context.timeZone,
          });
        },
      );
    },
  };
}

function readCalendarContentKind(payload: unknown): CalendarEntry['contentKind'] {
  const parsed = storedMasterSchema.safeParse(payload);
  return parsed.success ? parsed.data.contentKind : 'text';
}

function toCalendarApprovalState(state: string | undefined): CalendarEntry['approvalState'] {
  switch (state) {
    case 'approved':
      return 'approved';
    case 'rejected':
    case 'changes_requested':
      return 'rejected';
    case 'expired':
      return 'expired';
    case 'pending':
    case undefined:
      return 'requested';
    case 'canceled':
      return 'not_required';
    default:
      return 'requested';
  }
}
