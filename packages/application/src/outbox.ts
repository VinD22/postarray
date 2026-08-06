import { approvalLevelSchema, creationSurfaceSchema, providerIdSchema } from '@relay/contracts';
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

export const workflowOutboxPayloadSchemas = {
  start_publish: startPublishOutboxPayloadSchema,
  cancel_publish: cancelPublishOutboxPayloadSchema,
  reschedule_publish: reschedulePublishOutboxPayloadSchema,
  start_rule_run: startRuleRunOutboxPayloadSchema,
} as const;

export type WorkflowOutboxKind = keyof typeof workflowOutboxPayloadSchemas;
export type StartPublishOutboxPayload = z.infer<typeof startPublishOutboxPayloadSchema>;
export type CancelPublishOutboxPayload = z.infer<typeof cancelPublishOutboxPayloadSchema>;
export type ReschedulePublishOutboxPayload = z.infer<typeof reschedulePublishOutboxPayloadSchema>;
export type StartRuleRunOutboxPayload = z.infer<typeof startRuleRunOutboxPayloadSchema>;

export type WorkflowOutboxInput =
  | { readonly kind: 'start_publish'; readonly payload: StartPublishOutboxPayload }
  | { readonly kind: 'cancel_publish'; readonly payload: CancelPublishOutboxPayload }
  | { readonly kind: 'reschedule_publish'; readonly payload: ReschedulePublishOutboxPayload }
  | { readonly kind: 'start_rule_run'; readonly payload: StartRuleRunOutboxPayload };
