import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runWebhookDelivery } from './core/webhook-delivery.core';
import type { WebhookDeliveryWorkflowInput, WebhookDeliveryWorkflowOutput } from './inputs';

/**
 * One signed delivery to one customer endpoint.

 * Workflow id: `whd:{workspaceId}:{deliveryId}`.
 */
export async function webhookDeliveryWorkflow(
  input: WebhookDeliveryWorkflowInput,
): Promise<WebhookDeliveryWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runWebhookDelivery(runtime, workerActivities, input);
}
