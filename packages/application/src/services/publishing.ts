import {
  CapabilityNotImplementedError,
  scheduleSpecSchema,
  type ValidationResult,
} from '@relay/contracts';

import type {
  ActorContext,
  PublishConfirmationEvidence,
  PublishingService,
  ServiceDeps,
  ValidationService,
} from '../types';
import type { PublishJobView } from '../views';

import { loadAggregate } from '../internal/content-store';
import { invalid, notFound } from '../internal/errors';
import { withIdempotency } from '../internal/idempotency';
import { confirmationMatchesContent } from '../internal/publish-confirmation';
import { PUBLISH_JOB_SELECT, jobToView, runPublishPath } from '../internal/publish-path';
import { authorized, guard } from '../internal/runtime';

/**
 * Immediate publishing.
 *
 * It runs the identical path as scheduling, aimed at now rather than later, and
 * it always requires an explicit confirmation: publishing immediately is the
 * one action a level 3 identity still cannot preauthorize.
 */

/** A short lead so the worker picks the job up rather than racing the write. */
const IMMEDIATE_LEAD_SECONDS = 5;

export function createPublishingService(
  deps: ServiceDeps,
  validation: ValidationService,
): PublishingService {
  return {
    async publishNow(
      ctx: ActorContext,
      input: { contentItemId: string; confirmation: PublishConfirmationEvidence },
    ): Promise<PublishJobView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'publishing.publishNow',
        body: { contentItemId: input.contentItemId, confirmation: input.confirmation },
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(
            deps,
            ctx,
            'post.publish_now',
            undefined,
            async (db, actor) => {
              const aggregate = await loadAggregate(db, input.contentItemId);
              if (
                !confirmationMatchesContent(input.confirmation, {
                  targetCount: aggregate.variants.length,
                  checksum: aggregate.checksum,
                })
              ) {
                throw invalid('errors.human_confirmation_required', {
                  contentItemId: input.contentItemId,
                  reason: 'stale_confirmation',
                  expectedTargetCount: aggregate.variants.length,
                  acknowledgedTargetCount: input.confirmation.acknowledgedTargetCount,
                  expectedVersionChecksum: aggregate.checksum,
                  acknowledgedVersionChecksum:
                    input.confirmation.acknowledgedVersionChecksum,
                });
              }
              for (const variant of aggregate.variants) {
                guard(actor, 'post.publish_now', {
                  brandId: aggregate.brandId,
                  connectionId: variant.connectionId,
                });
              }

              const instant = new Date(deps.clock.now().getTime() + IMMEDIATE_LEAD_SECONDS * 1000);
              const spec = scheduleSpecSchema.parse({
                instant: instant.toISOString(),
                ianaTimeZone: actor.workspace.defaultTimeZone,
                repeat: null,
              });

              const result = await runPublishPath(db, deps, ctx, actor, {
                contentItemId: input.contentItemId,
                scheduleSpec: spec,
                kind: 'publish_now',
                confirmation: input.confirmation,
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

    async getJob(ctx: ActorContext, jobId: string): Promise<PublishJobView> {
      return authorized(deps, ctx, 'receipt.read', undefined, async (db) => {
        const row = await db.publishJob.findFirst({
          where: { id: jobId },
          select: PUBLISH_JOB_SELECT,
        });
        if (row === null) {
          throw notFound('publish_job', jobId);
        }
        return jobToView(row);
      });
    },

    async retryTarget(
      ctx: ActorContext,
      input: { jobId: string; targetId: string },
    ): Promise<PublishJobView> {
      return authorized(deps, ctx, 'post.retry', undefined, async (db, actor) => {
        const job = await db.publishJob.findFirst({
          where: { id: input.jobId },
          select: { ...PUBLISH_JOB_SELECT, receipt: { select: { id: true } } },
        });
        if (job === null) {
          throw notFound('publish_job', input.jobId);
        }
        guard(actor, 'post.retry', { connectionId: job.connectionId });

        // A target that already produced an external post is never retried.
        // Retrying it would be the duplicate publication this whole system
        // exists to prevent.
        if (job.receipt !== null || job.state === 'published') {
          throw invalid('errors.job_already_published', { jobId: job.id });
        }
        if (job.state !== 'action_required' && job.state !== 'failed_permanently') {
          throw invalid('errors.job_not_retryable', { state: job.state });
        }
        if (job.postVariantId !== input.targetId) {
          throw notFound('post_variant', input.targetId);
        }
        throw new CapabilityNotImplementedError({
          details: { capability: 'single_target_retry', reason: 'duplicate_safety_pending' },
        });
      });
    },
  };
}
