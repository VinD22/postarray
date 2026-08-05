import type { WorkerActivities } from '../../activities/types.js';
import { MESSAGE_KEYS } from '../../messages.js';
import { backoffMs, toIsoInstant } from '../../runtime/deterministic.js';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types.js';
import type {
  WebhookDeliveryWorkflowInput,
  WebhookDeliveryWorkflowOutput,
} from '../inputs.js';

/**
 * One signed delivery to one customer endpoint.
 *
 * Retries are exponential with deterministic jitter, so a customer outage does
 * not turn into a thundering herd when it recovers. Every attempt is logged.
 * An endpoint that fails persistently is disabled and the delivery is moved to
 * the dead-letter queue for human review rather than retried forever.
 *
 * The delivery id is stable across every attempt and every manual redelivery,
 * so a receiver that deduplicates on the event id sees the event once.
 */

export const DEFAULT_MAX_ATTEMPTS = 8;

/** Consecutive endpoint failures before the endpoint is switched off. */
export const ENDPOINT_FAILURE_THRESHOLD = 20;

export const DELIVERY_BACKOFF = {
  initialMs: 10_000,
  factor: 2,
  maxMs: 6 * 60 * 60_000,
  jitterRatio: 0.3,
} as const;

export async function runWebhookDelivery(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: WebhookDeliveryWorkflowInput,
): Promise<WebhookDeliveryWorkflowOutput> {
  const { ctx } = input;
  const maxAttempts = input.maxAttempts > 0 ? input.maxAttempts : DEFAULT_MAX_ATTEMPTS;

  const loaded = await activities.loadWebhookDelivery({ ctx, deliveryId: input.deliveryId });

  if (loaded.alreadyDelivered) {
    return {
      deliveryId: input.deliveryId,
      status: 'skipped',
      attempts: loaded.attempt,
      deadLettered: false,
      endpointDisabled: false,
    };
  }

  if (!loaded.endpointEnabled) {
    await activities.recordWebhookAttempt({
      ctx,
      deliveryId: input.deliveryId,
      endpointId: input.endpointId,
      attempt: loaded.attempt,
      status: 'disabled',
      responseStatus: null,
      nextAttemptAt: null,
    });
    return {
      deliveryId: input.deliveryId,
      status: 'disabled',
      attempts: loaded.attempt,
      deadLettered: false,
      endpointDisabled: true,
    };
  }

  let attempt = 0;
  let consecutiveFailures = loaded.consecutiveFailures;

  while (attempt < maxAttempts) {
    if (runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown) {
      break;
    }
    attempt += 1;

    const result = await activities.deliverWebhook({
      ctx,
      deliveryId: input.deliveryId,
      endpointId: input.endpointId,
      attempt,
      isRedelivery: input.isRedelivery || attempt > 1,
    });

    if (result.status === 'succeeded') {
      await activities.recordWebhookAttempt({
        ctx,
        deliveryId: input.deliveryId,
        endpointId: input.endpointId,
        attempt,
        status: 'succeeded',
        responseStatus: result.responseStatus,
        nextAttemptAt: null,
      });
      runtime.publishStatus({
        workflowId: runtime.workflowId,
        state: 'completed',
        phase: 'delivered',
        paused: false,
        cancelRequested: false,
        scheduledInstant: null,
        attempts: attempt,
        updatedAt: toIsoInstant(runtime.now()),
        targets: [],
      });
      return {
        deliveryId: input.deliveryId,
        status: 'succeeded',
        attempts: attempt,
        deadLettered: false,
        endpointDisabled: false,
      };
    }

    consecutiveFailures += 1;
    const lastAttempt = attempt >= maxAttempts || !result.retryable;
    const waitMs = lastAttempt
      ? 0
      : backoffMs(`${input.deliveryId}:delivery`, attempt, DELIVERY_BACKOFF);
    await activities.recordWebhookAttempt({
      ctx,
      deliveryId: input.deliveryId,
      endpointId: input.endpointId,
      attempt,
      status: lastAttempt ? 'exhausted' : 'failed',
      responseStatus: result.responseStatus,
      nextAttemptAt: lastAttempt ? null : toIsoInstant(runtime.now() + waitMs),
    });

    if (lastAttempt) {
      break;
    }
    await runtime.awaitCondition(
      () => runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown,
      waitMs,
    );
  }

  const endpointDisabled = consecutiveFailures >= ENDPOINT_FAILURE_THRESHOLD;
  if (endpointDisabled) {
    await activities.disableWebhookEndpoint({
      ctx,
      endpointId: input.endpointId,
      deliveryId: input.deliveryId,
      reasonKey: MESSAGE_KEYS.webhook.endpointDisabled,
    });
  }
  await activities.deadLetterWebhookDelivery({
    ctx,
    endpointId: input.endpointId,
    deliveryId: input.deliveryId,
    reasonKey: MESSAGE_KEYS.webhook.deadLettered,
  });

  runtime.publishStatus({
    workflowId: runtime.workflowId,
    state: 'failed',
    phase: 'dead_lettered',
    paused: false,
    cancelRequested: runtime.signals.cancelled !== null,
    scheduledInstant: null,
    attempts: attempt,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [],
  });

  return {
    deliveryId: input.deliveryId,
    status: endpointDisabled ? 'disabled' : 'exhausted',
    attempts: attempt,
    deadLettered: true,
    endpointDisabled,
  };
}

export const webhookDeliveryDescriptor: ChildWorkflowDescriptor<
  WebhookDeliveryWorkflowInput,
  WebhookDeliveryWorkflowOutput
> = {
  name: 'webhookDeliveryWorkflow',
  run: runWebhookDelivery,
};
