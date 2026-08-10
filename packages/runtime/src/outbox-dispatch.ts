import {
  cancelPublishOutboxPayloadSchema,
  pausePublishOutboxPayloadSchema,
  reschedulePublishOutboxPayloadSchema,
  resumePublishOutboxPayloadSchema,
  startPublishOutboxPayloadSchema,
  startRuleRunOutboxPayloadSchema,
  type SchedulerPort,
  type WorkflowOutboxKind,
} from '@relay/application';
import { ERROR_CODES, RelayError } from '@relay/contracts';

export interface OutboxDispatchInput {
  readonly kind: string;
  readonly payload: unknown;
}

export interface OutboxDispatchResult {
  readonly workflowId: string | null;
  readonly runId: string | null;
  readonly publishJobId: string | null;
}

function unsupportedKind(kind: string): never {
  throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
    details: { field: 'kind', reason: 'unknown_outbox_kind', kind },
  });
}

/** Dispatch one validated workflow intent. Every scheduler operation is idempotent. */
export async function dispatchWorkflowOutbox(
  scheduler: SchedulerPort,
  input: OutboxDispatchInput,
): Promise<OutboxDispatchResult> {
  const kind = input.kind as WorkflowOutboxKind;

  switch (kind) {
    case 'start_publish': {
      const payload = startPublishOutboxPayloadSchema.parse(input.payload);
      const started = await scheduler.schedulePublish({
        jobId: payload.jobId,
        workspaceId: payload.workspaceId,
        executeAt: new Date(payload.executeAt),
        idempotencyKey: payload.idempotencyKey,
        workflowInput: payload.workflowInput,
      });
      return {
        workflowId: started.workflowId,
        runId: started.runId,
        publishJobId: payload.jobId,
      };
    }
    case 'cancel_publish': {
      const payload = cancelPublishOutboxPayloadSchema.parse(input.payload);
      await scheduler.cancelPublish(payload);
      return { workflowId: null, runId: null, publishJobId: null };
    }
    case 'reschedule_publish': {
      const payload = reschedulePublishOutboxPayloadSchema.parse(input.payload);
      await scheduler.reschedulePublish({
        ...payload,
        executeAt: new Date(payload.executeAt),
      });
      return { workflowId: null, runId: null, publishJobId: null };
    }
    case 'pause_publish': {
      const payload = pausePublishOutboxPayloadSchema.parse(input.payload);
      // A scheduler that has not learned the named method still delivers the
      // intent: `pause` is a signal the publish workflow already handles.
      if (scheduler.pausePublish === undefined) {
        await scheduler.signalPublish({
          jobId: payload.jobId,
          workspaceId: payload.workspaceId,
          signal: 'pause',
        });
      } else {
        await scheduler.pausePublish({
          jobId: payload.jobId,
          workspaceId: payload.workspaceId,
        });
      }
      return { workflowId: null, runId: null, publishJobId: null };
    }
    case 'resume_publish': {
      const payload = resumePublishOutboxPayloadSchema.parse(input.payload);
      const moved =
        payload.executeAt === undefined || payload.ianaTimeZone === undefined
          ? null
          : { executeAt: new Date(payload.executeAt), ianaTimeZone: payload.ianaTimeZone };
      if (scheduler.resumePublish === undefined) {
        // Order matters. The new instant has to be in place before the workflow
        // is allowed to leave the pause loop, or it would wake on the instant
        // that passed while it was held and publish immediately.
        if (moved !== null) {
          await scheduler.reschedulePublish({
            jobId: payload.jobId,
            workspaceId: payload.workspaceId,
            executeAt: moved.executeAt,
            ianaTimeZone: moved.ianaTimeZone,
          });
        }
        await scheduler.signalPublish({
          jobId: payload.jobId,
          workspaceId: payload.workspaceId,
          signal: 'resume',
        });
      } else {
        await scheduler.resumePublish({
          jobId: payload.jobId,
          workspaceId: payload.workspaceId,
          ...(moved === null
            ? {}
            : { executeAt: moved.executeAt, ianaTimeZone: moved.ianaTimeZone }),
        });
      }
      return { workflowId: null, runId: null, publishJobId: null };
    }
    case 'start_rule_run': {
      const payload = startRuleRunOutboxPayloadSchema.parse(input.payload);
      const started = await scheduler.startRuleRun(payload);
      return { workflowId: started.workflowId, runId: null, publishJobId: null };
    }
    default:
      return unsupportedKind(input.kind);
  }
}
