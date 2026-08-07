import { describe, expect, it } from 'vitest';

import { createWorkerGateway } from '../prelaunch-gateway';

import {
  createActivities,
  parseActivityContext,
  type ActivityContext,
  type WorkerActivities,
} from './index';

const context: ActivityContext = {
  workspaceId: 'ws_test',
  correlationId: 'corr_test',
  actorId: 'worker',
  actorType: 'system',
  surface: 'automation_rule',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

describe('activity runtime boundary', () => {
  it('rejects an invalid context before establishing ambient tenancy', () => {
    expect(() => parseActivityContext({ ...context, workspaceId: '' })).toThrowError(
      expect.objectContaining({ code: 'VALIDATION_FAILED' }),
    );
  });

  it('rejects an invalid idempotency key before the gateway is called', async () => {
    let called = 0;
    const gateway: WorkerActivities = {
      ...createWorkerGateway(),
      beginPublishAttempt: async () => {
        called += 1;
        return {
          attemptId: 'attempt_test',
          attemptNumber: 1,
          providerIdempotencyToken: 'token_test',
          alreadyPublished: null,
        };
      },
    };
    const activities = createActivities({ gateway });

    await expect(
      activities.beginPublishAttempt({
        ctx: context,
        publishJobId: 'job_test',
        targetId: 'target_test',
        connectionId: 'connection_test',
        attemptNumber: 1,
        idempotencyKey: 'short',
      }),
    ).rejects.toMatchObject({ type: 'VALIDATION_FAILED', nonRetryable: true });
    expect(called).toBe(0);
  });

  it('accepts a valid idempotency key and keeps the gateway failure taxonomy', async () => {
    const activities = createActivities({ gateway: createWorkerGateway() });

    await expect(
      activities.beginPublishAttempt({
        ctx: context,
        publishJobId: 'job_test',
        targetId: 'target_test',
        connectionId: 'connection_test',
        attemptNumber: 1,
        idempotencyKey: 'publish:job_test:target_test',
      }),
    ).rejects.toMatchObject({ type: 'CAPABILITY_NOT_IMPLEMENTED', nonRetryable: true });
  });
});
