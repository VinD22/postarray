import { createTemporalRuntime, workerActivities } from './temporal-runtime.js';
import { runWebhookDelivery } from './core/webhook-delivery.core.js';
import type { WebhookDeliveryWorkflowInput, WebhookDeliveryWorkflowOutput } from './inputs.js';

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
