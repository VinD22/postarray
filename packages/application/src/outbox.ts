import {
  approvalLevelSchema,
  creationSurfaceSchema,
  mediaDerivativeOperationsSchema,
  providerIdSchema,
} from '@relay/contracts';
import { z } from 'zod';

const workflowActorSchema = z
  .object({
    workspaceId: z.string().min(1),
    correlationId: z.string().min(1),
    actorId: z.string().min(1),
    actorType: z.enum(['user', 'service_account', 'oauth_app', 'system']),
    surface: creationSurfaceSchema,
    approvalLevel: approvalLevelSchema,
    locale: z.string().min(1),
  })
  .strict();

const publishTargetSchema = z
  .object({
    targetId: z.string().min(1),
    connectionId: z.string().min(1),
    provider: providerIdSchema,
    approvedCapabilityVersion: z.string().min(1),
    threadItemIds: z.array(z.string().min(1)),
    threadDelaysSeconds: z.array(z.number().int().nonnegative()),
  })
  .strict();

export const startPublishOutboxPayloadSchema = z
  .object({
    jobId: z.string().min(1),
    workspaceId: z.string().min(1),
    executeAt: z.string().datetime(),
    idempotencyKey: z.string().min(1),
    workflowInput: z
      .object({
        ctx: workflowActorSchema,
        publishJobId: z.string().min(1),
        contentItemId: z.string().min(1),
        contentVersionId: z.string().min(1),
        contentVersionChecksum: z.string().min(1),
        idempotencyKey: z.string().min(1),
        executeAt: z.string().datetime(),
        scheduledLocalTime: z.string().min(1),
        ianaTimeZone: z.string().min(1),
        targets: z.array(publishTargetSchema).min(1),
        immediate: z.boolean(),
      })
      .strict(),
  })
  .strict()
  .superRefine((payload, context) => {
    const mismatches = [
      payload.workspaceId !== payload.workflowInput.ctx.workspaceId ? 'workspaceId' : null,
      payload.jobId !== payload.workflowInput.publishJobId ? 'jobId' : null,
      payload.executeAt !== payload.workflowInput.executeAt ? 'executeAt' : null,
      payload.idempotencyKey !== payload.workflowInput.idempotencyKey ? 'idempotencyKey' : null,
    ].filter((field): field is string => field !== null);
    for (const field of mismatches) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [field],
        message: 'outbox payload identity mismatch',
      });
    }
  });

export const cancelPublishOutboxPayloadSchema = z
  .object({
    jobId: z.string().min(1),
    workspaceId: z.string().min(1),
    reason: z.string().min(1).max(500),
  })
  .strict();

export const reschedulePublishOutboxPayloadSchema = z
  .object({
    jobId: z.string().min(1),
    workspaceId: z.string().min(1),
    executeAt: z.string().datetime(),
    ianaTimeZone: z.string().min(1),
  })
  .strict();

/**
 * Hold this job where it is.
 *
 * Delivered as the workflow's `pause` signal, which the publish workflow has
 * always understood; what was missing was the path from a person to it. There
 * is nothing to undo here, so the payload carries no content: a pause stops
 * what has not happened and never retracts an external post.
 */
export const pausePublishOutboxPayloadSchema = z
  .object({
    jobId: z.string().min(1),
    workspaceId: z.string().min(1),
    requestedAt: z.string().datetime(),
  })
  .strict();

/**
 * Let this job continue, optionally at a new instant.
 *
 * `executeAt` and `ianaTimeZone` travel together or not at all. A resume that
 * carries them is delivered as a reschedule followed by the resume signal, so
 * the workflow wakes on the new instant rather than on the one that passed
 * while it was held. A resume without them is only ever enqueued for a job
 * whose instant is still in the future, which the application service checks
 * before this row exists.
 */
export const resumePublishOutboxPayloadSchema = z
  .object({
    jobId: z.string().min(1),
    workspaceId: z.string().min(1),
    requestedAt: z.string().datetime(),
    executeAt: z.string().datetime().optional(),
    ianaTimeZone: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((payload, context) => {
    if ((payload.executeAt === undefined) !== (payload.ianaTimeZone === undefined)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ianaTimeZone'],
        message: 'a resumed instant always carries the zone it was chosen in',
      });
    }
  });

export const startRuleRunOutboxPayloadSchema = z
  .object({
    ctx: workflowActorSchema,
    ruleId: z.string().min(1),
    workspaceId: z.string().min(1),
    runId: z.string().min(1),
    sourceKey: z.string().min(1),
    event: z.record(z.string(), z.unknown()),
    dryRun: z.boolean().optional(),
  })
  .strict()
  .superRefine((payload, context) => {
    if (payload.workspaceId !== payload.ctx.workspaceId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['workspaceId'],
        message: 'outbox payload workspace mismatch',
      });
    }
  });

/**
 * A bulk import intent.
 *
 * Registered here so the worker parses the same shape the application builds,
 * rather than trusting an untyped object across the process boundary. It is
 * deliberately absent from `workflowOutboxPayloadSchemas` below: that map is
 * the contract of what the transactional outbox dispatcher can hand to a
 * scheduler, and adding a kind it cannot dispatch would turn a rejected row
 * into a dead letter. A bulk import is started directly by the service that
 * owns the job, the way a data export is.
 *
 * `applyMode` is nullable and null means dry run. There is no value here that
 * publishes.
 */
export const startBulkImportPayloadSchema = z
  .object({
    ctx: workflowActorSchema,
    importJobId: z.string().min(1),
    workspaceId: z.string().min(1),
    applyMode: z.enum(['drafts', 'scheduled']).nullable(),
  })
  .strict()
  .superRefine((payload, context) => {
    if (payload.workspaceId !== payload.ctx.workspaceId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['workspaceId'],
        message: 'outbox payload workspace mismatch',
      });
    }
  });
export type StartBulkImportPayload = z.infer<typeof startBulkImportPayloadSchema>;

/**
 * A non-generative image derivative.
 *
 * Registered here so the worker parses the same shape the application builds.
 * Like the bulk import payload it is deliberately absent from
 * `workflowOutboxPayloadSchemas`: the derivative run is started directly by the
 * service that owns the asset, and a kind the transactional dispatcher cannot
 * hand to a scheduler would turn a valid request into a dead letter.
 *
 * The operations are geometry and MIME types. There is no prompt, no model, no
 * seed and no provider in this payload, and there is nowhere for one to be
 * added without failing this strict schema.
 */
export const startMediaDerivativePayloadSchema = z
  .object({
    ctx: workflowActorSchema,
    workspaceId: z.string().min(1),
    mediaAssetId: z.string().min(1),
    presetKey: z.string().regex(/^[0-9a-f]{64}$/u),
    operations: mediaDerivativeOperationsSchema,
  })
  .strict()
  .superRefine((payload, context) => {
    if (payload.workspaceId !== payload.ctx.workspaceId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['workspaceId'],
        message: 'outbox payload workspace mismatch',
      });
    }
  });
export type StartMediaDerivativePayload = z.infer<typeof startMediaDerivativePayloadSchema>;

export const workflowOutboxPayloadSchemas = {
  start_publish: startPublishOutboxPayloadSchema,
  cancel_publish: cancelPublishOutboxPayloadSchema,
  reschedule_publish: reschedulePublishOutboxPayloadSchema,
  pause_publish: pausePublishOutboxPayloadSchema,
  resume_publish: resumePublishOutboxPayloadSchema,
  start_rule_run: startRuleRunOutboxPayloadSchema,
} as const;

export type WorkflowOutboxKind = keyof typeof workflowOutboxPayloadSchemas;
export type StartPublishOutboxPayload = z.infer<typeof startPublishOutboxPayloadSchema>;
export type CancelPublishOutboxPayload = z.infer<typeof cancelPublishOutboxPayloadSchema>;
export type ReschedulePublishOutboxPayload = z.infer<typeof reschedulePublishOutboxPayloadSchema>;
export type PausePublishOutboxPayload = z.infer<typeof pausePublishOutboxPayloadSchema>;
export type ResumePublishOutboxPayload = z.infer<typeof resumePublishOutboxPayloadSchema>;
export type StartRuleRunOutboxPayload = z.infer<typeof startRuleRunOutboxPayloadSchema>;

export type WorkflowOutboxInput =
  | { readonly kind: 'start_publish'; readonly payload: StartPublishOutboxPayload }
  | { readonly kind: 'cancel_publish'; readonly payload: CancelPublishOutboxPayload }
  | { readonly kind: 'reschedule_publish'; readonly payload: ReschedulePublishOutboxPayload }
  | { readonly kind: 'pause_publish'; readonly payload: PausePublishOutboxPayload }
  | { readonly kind: 'resume_publish'; readonly payload: ResumePublishOutboxPayload }
  | { readonly kind: 'start_rule_run'; readonly payload: StartRuleRunOutboxPayload };
