import { describe, expect, it } from 'vitest';

import { startPublishOutboxPayloadSchema, startRuleRunOutboxPayloadSchema } from './outbox';

const actor = {
  workspaceId: '11111111-1111-4111-8111-111111111111',
  correlationId: 'corr_1',
  actorId: '22222222-2222-4222-8222-222222222222',
  actorType: 'user' as const,
  surface: 'web' as const,
  approvalLevel: 'level_3_confirm' as const,
  locale: 'en',
};

function publishPayload() {
  return {
    jobId: '33333333-3333-4333-8333-333333333333',
    workspaceId: actor.workspaceId,
    executeAt: '2026-08-06T09:00:00.000Z',
    idempotencyKey: 'publish_once',
    workflowInput: {
      ctx: { ...actor },
      publishJobId: '33333333-3333-4333-8333-333333333333',
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

describe('workflow outbox payloads', () => {
  it('accepts a self-consistent publish handoff', () => {
    expect(startPublishOutboxPayloadSchema.parse(publishPayload()).jobId).toBe(
      '33333333-3333-4333-8333-333333333333',
    );
  });

  it('rejects a publish handoff that crosses workspace identity', () => {
    const payload = publishPayload();
    payload.workflowInput.ctx.workspaceId = '88888888-8888-4888-8888-888888888888';
    expect(startPublishOutboxPayloadSchema.safeParse(payload).success).toBe(false);
  });

  it('rejects a rule handoff that crosses workspace identity', () => {
    expect(
      startRuleRunOutboxPayloadSchema.safeParse({
        ctx: actor,
        ruleId: 'rule_1',
        workspaceId: '88888888-8888-4888-8888-888888888888',
        runId: 'run_1',
        sourceKey: 'source_1',
        event: {},
      }).success,
    ).toBe(false);
  });
});
