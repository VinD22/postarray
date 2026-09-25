import { describe, expect, it } from 'vitest';

import type { CommitPreview } from '@relay/contracts';

import { assertCommittable, confirmationFrom, escalationCodes } from './commit-preview';

function preview(overrides: Partial<CommitPreview> = {}): CommitPreview {
  return {
    contentItemId: 'content_1',
    kind: 'publish_now',
    targetCount: 2,
    versionChecksum: 'b'.repeat(64),
    externalPublicationCount: 2,
    blockers: [],
    escalations: [
      {
        code: 'immediate_publish',
        messageKey: 'agent_policy.immediate_publish',
        params: { targetCount: 2 },
      },
      {
        code: 'first_use_connection',
        messageKey: 'agent_policy.first_use_connection',
        params: { connectionId: 'conn_2' },
        connectionId: 'conn_2',
      },
    ],
    validation: { issues: [] },
    canCommit: true,
    requiresConfirmation: true,
    ...overrides,
  };
}

describe('commit preview in the CLI', () => {
  it('acknowledges every escalation the server named, not only immediate_publish', () => {
    expect(confirmationFrom(preview())).toEqual({
      acknowledgedTargetCount: 2,
      acknowledgedVersionChecksum: 'b'.repeat(64),
      acknowledgedEscalations: ['first_use_connection', 'immediate_publish'],
    });
  });

  it('asks for --confirm when a schedule escalates', () => {
    const scheduled = preview({
      kind: 'schedule',
      escalations: preview().escalations.filter((entry) => entry.code !== 'immediate_publish'),
    });
    expect(escalationCodes(scheduled)).toEqual(['first_use_connection']);
    expect(() => assertCommittable(scheduled, false, 'corr')).toThrow(
      expect.objectContaining({ code: 'APPROVAL_REQUIRED' }),
    );
    expect(() => assertCommittable(scheduled, true, 'corr')).not.toThrow();
  });

  it('refuses before committing when the preview has a blocker', () => {
    const blocked = preview({
      canCommit: false,
      blockers: [{ code: 'approval_required', messageKey: 'errors.approval_required', params: {} }],
    });
    expect(() => assertCommittable(blocked, true, 'corr')).toThrow(
      expect.objectContaining({ code: 'POLICY_BLOCKED' }),
    );
  });
});
