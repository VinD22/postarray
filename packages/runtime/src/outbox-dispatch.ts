import {
  cancelPublishOutboxPayloadSchema,
  reschedulePublishOutboxPayloadSchema,
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
    case 'start_rule_run': {
      const payload = startRuleRunOutboxPayloadSchema.parse(input.payload);
      const started = await scheduler.startRuleRun(payload);
      return { workflowId: started.workflowId, runId: null, publishJobId: null };
    }
    default:
      return unsupportedKind(input.kind);
  }
}
