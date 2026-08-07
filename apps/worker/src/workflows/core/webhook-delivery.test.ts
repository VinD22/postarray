import { describe, expect, it } from 'vitest';

import { ENDPOINT_FAILURE_THRESHOLD } from './webhook-delivery.core';
import { makeWebhookInput } from '../../testing/fixtures';
import { runWorkflow } from '../../testing/harness';
import { activityHistory, countActivity } from '../../testing/replay';

import { webhookDeliveryDescriptor } from './webhook-delivery.core';

describe('webhook delivery workflow', () => {
  it('dead-letters after the retry budget is exhausted', async () => {
    const run = await runWorkflow(
      webhookDeliveryDescriptor,
      makeWebhookInput({ maxAttempts: 3 }),
      {
        workflowId: 'whd:ws_test:whd_dead',
        simulatorOptions: { webhookScript: ['failed', 'failed', 'failed'] },
      },
    );

    expect(run.output).toMatchObject({
      deliveryId: 'whd_1',
      status: 'exhausted',
      deadLettered: true,
      endpointDisabled: false,
    });
    expect(run.simulator.deadLettered).toHaveLength(1);
    expect(countActivity(run.commands, 'deadLetterWebhookDelivery')).toBe(1);
    expect(countActivity(run.commands, 'deliverWebhook')).toBe(3);
  });

  it('disables the endpoint when consecutive failures cross the threshold', async () => {
    const priorFailures = ENDPOINT_FAILURE_THRESHOLD - 1;
    const run = await runWorkflow(
      webhookDeliveryDescriptor,
      makeWebhookInput({ maxAttempts: 1 }),
      {
        workflowId: 'whd:ws_test:whd_disable',
        simulatorOptions: {
          webhookConsecutiveFailures: priorFailures,
          webhookScript: ['failed'],
        },
      },
    );

    expect(run.output).toMatchObject({
      deadLettered: true,
      endpointDisabled: true,
      status: 'disabled',
    });
    expect(run.simulator.disabledEndpoints).toHaveLength(1);
    expect(countActivity(run.commands, 'disableWebhookEndpoint')).toBe(1);
  });

  it('skips delivery when the event was already delivered', async () => {
    const run = await runWorkflow(webhookDeliveryDescriptor, makeWebhookInput(), {
      workflowId: 'whd:ws_test:whd_skip',
      simulatorOptions: { webhookAlreadyDelivered: true },
    });

    expect(run.output).toMatchObject({
      status: 'skipped',
      deadLettered: false,
    });
    expect(countActivity(run.commands, 'deliverWebhook')).toBe(0);
    expect(countActivity(run.commands, 'deadLetterWebhookDelivery')).toBe(0);
  });

  it('records attempt progression before dead-lettering', async () => {
    const run = await runWorkflow(
      webhookDeliveryDescriptor,
      makeWebhookInput({ maxAttempts: 2 }),
      {
        workflowId: 'whd:ws_test:whd_attempts',
        simulatorOptions: { webhookScript: ['failed', 'failed'] },
      },
    );

    expect(
      activityHistory(run.commands).filter((name) => name === 'recordWebhookAttempt').length,
    ).toBeGreaterThanOrEqual(2);
  });
});
