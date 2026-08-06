import { InMemoryScheduler, type Clock } from '@relay/application';
import { RelayError } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { dispatchWorkflowOutbox } from './outbox-dispatch';
import { OUTBOX_MAX_ATTEMPTS, outboxRetryDelayMs } from './outbox-repository';

const clock: Clock = { now: () => new Date('2026-08-06T08:00:00.000Z') };
const workspaceId = '11111111-1111-4111-8111-111111111111';
const jobId = '33333333-3333-4333-8333-333333333333';

function startPayload() {
  return {
    jobId,
    workspaceId,
    executeAt: '2026-08-06T09:00:00.000Z',
    idempotencyKey: 'publish_once',
    workflowInput: {
      ctx: {
        workspaceId,
        correlationId: 'corr_1',
        actorId: '22222222-2222-4222-8222-222222222222',
        actorType: 'user' as const,
        surface: 'web' as const,
        approvalLevel: 'level_3_confirm' as const,
        locale: 'en',
      },
      publishJobId: jobId,
      contentItemId: '44444444-4444-4444-8444-444444444444',
      contentVersionId: '55555555-5555-4555-8555-555555555555',
      contentVersionChecksum: 'sha256-value',
      idempotencyKey: 'publish_once',
      executeAt: '2026-08-06T09:00:00.000Z',
      scheduledLocalTime: '2026-08-06T14:30:00',
      ianaTimeZone: 'Asia/Kolkata',
      targets: [
        {
          targetId: '66666666-6666-4666-8666-666666666666',
          connectionId: '77777777-7777-4777-8777-777777777777',
          provider: 'linkedin' as const,
          approvedCapabilityVersion: 'linkedin-2026-08',
          threadItemIds: [],
          threadDelaysSeconds: [],
        },
      ],
      immediate: false,
    },
  };
}

describe('dispatchWorkflowOutbox', () => {
  it('reuses the same durable workflow for a replayed start', async () => {
    const scheduler = new InMemoryScheduler(clock);
    const first = await dispatchWorkflowOutbox(scheduler, {
      kind: 'start_publish',
      payload: startPayload(),
    });
    const replay = await dispatchWorkflowOutbox(scheduler, {
      kind: 'start_publish',
      payload: startPayload(),
    });

    expect(replay).toEqual(first);
    expect(scheduler.publishes).toHaveLength(1);
  });

  it('uses the rule run identity as the deterministic workflow identity', async () => {
    const scheduler = new InMemoryScheduler(clock);
    const result = await dispatchWorkflowOutbox(scheduler, {
      kind: 'start_rule_run',
      payload: {
        ctx: startPayload().workflowInput.ctx,
        ruleId: 'rule_1',
        workspaceId,
        runId: 'run_1',
        sourceKey: 'source_1',
        event: { type: 'rss_item' },
      },
    });

    expect(result.workflowId).toBe(`rule:${workspaceId}:rule_1:run_1`);
  });

  it('normalizes malformed private payloads into the shared error taxonomy', async () => {
    const scheduler = new InMemoryScheduler(clock);
    await expect(
      dispatchWorkflowOutbox(scheduler, { kind: 'start_publish', payload: {} }),
    ).rejects.toSatisfy(
      (error: unknown) => RelayError.fromUnknown(error).code === 'VALIDATION_FAILED',
    );
  });
});

describe('outbox retry budget', () => {
  it('backs off and caps retries before dead-lettering', () => {
    expect(outboxRetryDelayMs(1)).toBe(30_000);
    expect(outboxRetryDelayMs(4)).toBe(3_600_000);
    expect(outboxRetryDelayMs(OUTBOX_MAX_ATTEMPTS)).toBe(86_400_000);
  });
});
