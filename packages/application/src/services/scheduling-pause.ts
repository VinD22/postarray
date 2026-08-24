import {
  MAX_SCHEDULE_HORIZON_DAYS, pauseRefusal, scheduleSpecSchema, type ScheduleSpec } from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types';
import type { PublishJobView } from '../views';

import { recordAudit } from '../internal/audit';
import { enqueueWorkflowOutbox } from '../internal/enqueue-outbox';
import { invalid, notFound } from '../internal/errors';
import { withIdempotency } from '../internal/idempotency';
import { toLocalDateTime } from '../internal/mappers';
import { PUBLISH_JOB_SELECT, jobToView, toPublishHold } from '../internal/publish-path';
import { authorized, guard, type Db } from '../internal/runtime';

/**
 * Pause and resume.
 *
 * These live beside `scheduling.ts` rather than inside it because that file is
 * already at the size where a reader stops holding the whole thing in their
 * head. They are composed into the same service object, follow the same
 * template as `cancel` (idempotency wrapper, authorization, state validation,
 * one database write, one outbox row, one audit append), and are the only path
 * from a person to the pause and resume signals the publish workflow has always
 * understood.
 *
 * Three rules are worth stating in prose, because they are the ones a future
 * change is most likely to get wrong.
 *
 *  1. **A pause stops what has not happened. It retracts nothing.** A job that
 *     already produced an external post is refused, and so is a job that is
 *     mid-dispatch: at that point the side effect is in flight and ours to
 *     finish, not to abandon halfway.
 *
 *  2. **A person's hold and a billing hold are different things.** The billing
 *     grace path holds scheduled work when a workspace loses full access. That
 *     hold is cleared by paying, never by pressing Resume, so resuming one here
 *     is refused with its own message rather than silently succeeding and
 *     letting the entitlement check fail again minutes later at dispatch.
 *
 *  3. **Resuming never publishes by surprise.** If the original instant has
 *     already passed while the job sat paused, resuming requires an explicit
 *     new time. The alternative, dispatching immediately because "the time has
 *     come", would publish something a person paused precisely so that it would
 *     not go out.
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

/**
 * True when moving between these two instants changes the UTC offset.
 *
 * Shared by `reschedule` and by `resume`, which is the point: a resume that
 * carries a new time is a reschedule wearing a different button, and the two
 * must warn about a daylight saving shift in exactly the same words.
 */
export function crossesOffsetChange(from: Date, to: Date, timeZone: string): boolean {
  return offsetMinutes(from, timeZone) !== offsetMinutes(to, timeZone);
}

export interface PauseInput {
  readonly jobId: string;
  /** Free text the person typed, retained on the audit event only. */
  readonly note?: string;
}

export interface ResumeInput {
  readonly jobId: string;
  /** Required once the original instant has passed. Optional before that. */
  readonly scheduleSpec?: ScheduleSpec;
  readonly confirmDst?: boolean;
}

export interface SchedulingPauseOperations {
  pause(ctx: ActorContext, input: PauseInput): Promise<PublishJobView>;
  resume(ctx: ActorContext, input: ResumeInput): Promise<PublishJobView>;
}

async function readJob(db: Db, jobId: string) {
  const job = await db.publishJob.findFirst({ where: { id: jobId }, select: PUBLISH_JOB_SELECT });
  if (job === null) {
    throw notFound('publish_job', jobId);
  }
  return job;
}

async function reread(db: Db, jobId: string): Promise<PublishJobView> {
  return jobToView(await readJob(db, jobId));
}

export function createSchedulingPause(deps: ServiceDeps): SchedulingPauseOperations {
  return {
    async pause(ctx: ActorContext, input: PauseInput): Promise<PublishJobView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'scheduling.pause',
        body: { jobId: input.jobId },
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'post.reschedule', undefined, async (db, actor) => {
            const job = await readJob(db, input.jobId);
            guard(actor, 'post.reschedule', { connectionId: job.connectionId });

            const existing = toPublishHold(job);
            if (existing?.reason === 'billing') {
              // Overwriting the reason would lose the only record of why this
              // job is not going out, and would put a Resume button in front of
              // a person who cannot resume it.
              throw invalid('errors.job_paused_by_billing', {
                jobId: job.id,
                since: existing.since,
              });
            }
            if (existing?.reason === 'user') {
              // Already held by a person. Pausing again is the same request.
              return jobToView(job);
            }

            const refusal = pauseRefusal(job.state);
            if (refusal === 'already_published') {
              throw invalid('errors.job_already_published', { jobId: job.id, state: job.state });
            }
            if (refusal === 'in_flight') {
              throw invalid('errors.job_already_dispatching', { state: job.state });
            }
            if (refusal === 'terminal') {
              throw invalid('errors.job_not_pausable', { state: job.state });
            }

            if (actor.userId === null) {
              // A hold has to be attributable. A service account or an agent
              // that wants work stopped cancels it, which is a decision with a
              // reason attached, rather than parking it under nobody's name.
              throw invalid('errors.pause_requires_person', { jobId: job.id });
            }

            const at = deps.clock.now();
            await db.publishJob.update({
              where: { id: job.id },
              data: { pausedAt: at, pausedReason: 'user', pausedByUserId: actor.userId },
            });
            await enqueueWorkflowOutbox(db, {
              kind: 'pause_publish',
              dedupeKey: `pause-publish:${job.id}:${ctx.idempotencyKey ?? at.toISOString()}`,
              payload: {
                jobId: job.id,
                workspaceId: ctx.workspaceId,
                requestedAt: at.toISOString(),
              },
            });
            await recordAudit(db, actor, {
              action: 'post.paused',
              targetType: 'publish_job',
              targetId: job.id,
              before: { state: job.state, hold: null },
              after: { state: job.state, hold: 'user' },
              metadata: {
                scheduledInstant: job.scheduledFor.toISOString(),
                ...(input.note === undefined ? {} : { note: input.note }),
              },
            });

            return reread(db, job.id);
          }),
      });
    },

    async resume(ctx: ActorContext, input: ResumeInput): Promise<PublishJobView> {
      const spec =
        input.scheduleSpec === undefined ? null : scheduleSpecSchema.parse(input.scheduleSpec);
      return withIdempotency(deps.kv, ctx, {
        operation: 'scheduling.resume',
        body: { jobId: input.jobId, scheduleSpec: spec },
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'post.reschedule', undefined, async (db, actor) => {
            const job = await readJob(db, input.jobId);
            guard(actor, 'post.reschedule', { connectionId: job.connectionId });

            const hold = toPublishHold(job);
            if (hold === null) {
              throw invalid('errors.job_not_paused', { jobId: job.id, state: job.state });
            }
            if (hold.reason === 'billing') {
              throw invalid('errors.job_paused_by_billing', {
                jobId: job.id,
                since: hold.since,
              });
            }

            const now = deps.clock.now();
            let next: Date | null = null;

            if (spec === null) {
              if (job.scheduledFor.getTime() <= now.getTime()) {
                // The whole point of the pause was that this did not go out.
                // Resuming onto an instant that has already passed would send
                // it the moment the signal lands, which is the one outcome the
                // person was avoiding.
                throw invalid('errors.resume_requires_new_time', {
                  jobId: job.id,
                  missedInstant: job.scheduledFor.toISOString(),
                  ianaTimeZone: job.scheduledTimeZone,
                  localDateTime: toLocalDateTime(job.scheduledFor, job.scheduledTimeZone),
                });
              }
            } else {
              next = new Date(spec.instant);
              if (next.getTime() <= now.getTime()) {
                throw invalid('errors.schedule_in_past', { instant: spec.instant });
              }
              // The thirty day horizon, here too: resuming a paused job with a
              // new time is a reschedule and must not be the loophole.
              if (
                next.getTime() >
                now.getTime() + MAX_SCHEDULE_HORIZON_DAYS * 24 * 60 * 60 * 1000
              ) {
                throw invalid('validation.schedule_too_far_ahead.message', {
                  limit: `${MAX_SCHEDULE_HORIZON_DAYS} days`,
                  instant: spec.instant,
                });
              }
              // Same confirmation the reschedule path uses, and deliberately
              // the same message key: a clock change is a clock change whether
              // it arrived through Move or through Resume.
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
            }

            await db.publishJob.update({
              where: { id: job.id },
              data: {
                pausedAt: null,
                pausedReason: null,
                pausedByUserId: null,
                state: 'scheduled',
                ...(next === null || spec === null
                  ? {}
                  : { scheduledFor: next, scheduledTimeZone: spec.ianaTimeZone }),
              },
            });
            await enqueueWorkflowOutbox(db, {
              kind: 'resume_publish',
              dedupeKey: `resume-publish:${job.id}:${ctx.idempotencyKey ?? now.toISOString()}`,
              payload: {
                jobId: job.id,
                workspaceId: ctx.workspaceId,
                requestedAt: now.toISOString(),
                ...(next === null || spec === null
                  ? {}
                  : { executeAt: next.toISOString(), ianaTimeZone: spec.ianaTimeZone }),
              },
            });
            await recordAudit(db, actor, {
              action: 'post.resumed',
              targetType: 'publish_job',
              targetId: job.id,
              before: {
                hold: hold.reason,
                scheduledInstant: job.scheduledFor.toISOString(),
              },
              after: {
                hold: null,
                scheduledInstant: (next ?? job.scheduledFor).toISOString(),
              },
              metadata: {
                heldSince: hold.since,
                ianaTimeZone: spec?.ianaTimeZone ?? job.scheduledTimeZone,
                timeChanged: next !== null,
              },
            });

            return reread(db, job.id);
          }),
      });
    },
  };
}
