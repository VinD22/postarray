import type { WorkflowClient } from '@temporalio/client';
import { describe, expect, it, vi } from 'vitest';

import type { Logger } from '@relay/observability';

import { TemporalScheduler } from './temporal-scheduler';

const clock = { now: () => new Date('2026-08-06T00:00:00.000Z') };

function logger(): Logger {
  return { warn: vi.fn() } as unknown as Logger;
}

function workflowInput() {
  return {
    ctx: {
      workspaceId: 'ws_1',
      correlationId: 'corr_1',
      actorId: 'user_1',
      actorType: 'user' as const,
      surface: 'web' as const,
      approvalLevel: 'level_3_confirm' as const,
      locale: 'en',
    },
    publishJobId: 'job_1',
    contentItemId: 'content_1',
    contentVersionId: 'cver_1',
    contentVersionChecksum: 'a'.repeat(64),
    idempotencyKey: 'publish_1',
    executeAt: '2026-08-07T00:00:00.000Z',
    scheduledLocalTime: '2026-08-07T00:00:00',
    ianaTimeZone: 'UTC',
    targets: [],
    immediate: false,
  };
}

function scheduler(workflow: Partial<WorkflowClient>): TemporalScheduler {
  return new TemporalScheduler({
    address: 'temporal.example.test:7233',
    namespace: 'relay',
    taskQueue: 'relay-publishing',
    clock,
    logger: logger(),
    workflowClient: workflow as WorkflowClient,
  });
}

describe('TemporalScheduler', () => {
  it('starts the canonical publish workflow with a deterministic id', async () => {
    const start = vi.fn().mockResolvedValue({ firstExecutionRunId: 'run_1' });
    const temporal = scheduler({ start });

    await expect(
      temporal.schedulePublish({
        jobId: 'job_1',
        workspaceId: 'ws_1',
        executeAt: new Date('2026-08-07T00:00:00.000Z'),
        idempotencyKey: 'publish_1',
        workflowInput: workflowInput(),
      }),
    ).resolves.toEqual({ workflowId: 'publish:ws_1:job_1', runId: 'run_1' });
    expect(start).toHaveBeenCalledWith(
      'publishPostWorkflow',
      expect.objectContaining({
        workflowId: 'publish:ws_1:job_1',
        taskQueue: 'relay-publishing',
        args: [workflowInput()],
      }),
    );
  });

  it('signals cancellation using the workflow contract', async () => {
    const signal = vi.fn().mockResolvedValue(undefined);
    const temporal = scheduler({
      getHandle: vi.fn().mockReturnValue({ signal }),
    });

    await temporal.cancelPublish({
      jobId: 'job_1',
      workspaceId: 'ws_1',
      reason: 'user_canceled',
    });

    expect(signal).toHaveBeenCalledWith('cancel', {
      reason: 'user_canceled',
      requestedAt: '2026-08-06T00:00:00.000Z',
    });
  });

  it('returns null when Temporal has no matching workflow', async () => {
    const { WorkflowNotFoundError } = await import('@temporalio/client');
    const temporal = scheduler({
      getHandle: vi.fn().mockReturnValue({
        describe: vi
          .fn()
          .mockRejectedValue(new WorkflowNotFoundError('missing', 'publish:ws_1:job_1', undefined)),
      }),
    });

    await expect(temporal.describe({ jobId: 'job_1', workspaceId: 'ws_1' })).resolves.toBeNull();
  });
});
