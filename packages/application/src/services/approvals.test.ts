import { describe, expect, it } from 'vitest';

import { approvalRowToView, type ApprovalRow } from './approvals';

const createdAt = new Date('2026-08-06T08:00:00.000Z');

function row(): ApprovalRow {
  return {
    id: 'approval_01',
    contentItemId: 'content_01',
    contentVersionId: 'version_01',
    policy: 'any_approver',
    state: 'changes_requested',
    requestedByUserId: 'user_author',
    assignedUserIds: ['user_reviewer'],
    note: 'Check the total.',
    dueAt: new Date('2026-08-07T08:00:00.000Z'),
    resolvedAt: new Date('2026-08-06T09:00:00.000Z'),
    createdAt,
    decisions: [
      {
        id: 'decision_01',
        decision: 'request_changes',
        decidedByUserId: 'user_reviewer',
        comment: 'Update the total.',
        reviewedContentHash: 'a'.repeat(64),
        createdAt: new Date('2026-08-06T09:00:00.000Z'),
      },
    ],
  };
}

describe('approval request view', () => {
  it('keeps requested changes distinct from rejection and preserves review evidence', () => {
    expect(approvalRowToView(row())).toMatchObject({
      id: 'approval_01',
      state: 'changes_requested',
      requestedBy: 'user_author',
      assignedUserIds: ['user_reviewer'],
      dueAt: '2026-08-07T08:00:00.000Z',
      resolvedAt: '2026-08-06T09:00:00.000Z',
      decisions: [
        {
          decision: 'request_changes',
          decidedByUserId: 'user_reviewer',
          comment: 'Update the total.',
          reviewedChecksum: 'a'.repeat(64),
        },
      ],
    });
  });
});
