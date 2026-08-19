import { can, type PolicyActor } from '@relay/authz';
import { describe, expect, it } from 'vitest';

import { reapprovalRequired, type ContentAggregate } from './content-store';
import { decisionToError } from './errors';
import { storedMasterSchema } from './stored-content';

function aggregate(overrides: Partial<ContentAggregate> = {}): ContentAggregate {
  const master = storedMasterSchema.parse({
    id: 'content-1',
    workspaceId: 'ws-1',
    projectId: 'project-1',
    campaignId: null,
    title: null,
    body: 'A post.',
    contentKind: 'text',
    locale: 'en',
    mediaIds: [],
    links: [],
    signature: null,
    threadItems: [],
    schedule: null,
    disclosure: { aiAssisted: false, commercialContent: false, brandedContent: false },
    createdVia: 'web',
  });
  return {
    itemId: 'content-1',
    workspaceId: 'ws-1',
    projectId: 'project-1',
    campaignId: null,
    title: null,
    state: 'draft',
    approvalPolicy: 'any_approver',
    approvalState: 'approved',
    currentVersionId: 'version-2',
    approvedVersionId: 'version-1',
    approvedChecksum: 'a'.repeat(64),
    revision: 2,
    checksum: 'a'.repeat(64),
    master,
    variants: [],
    createdVia: 'web',
    createdAt: new Date('2026-08-04T09:00:00.000Z'),
    updatedAt: new Date('2026-08-04T09:00:00.000Z'),
    createdByUserId: 'user-1',
    ...overrides,
  };
}

describe('reapprovalRequired', () => {
  it('is false while the approved checksum still matches what would publish', () => {
    expect(reapprovalRequired(aggregate())).toBe(false);
  });

  it('is true once the content has drifted from what was approved', () => {
    expect(reapprovalRequired(aggregate({ checksum: 'b'.repeat(64) }))).toBe(true);
  });

  it('is false when nothing has been approved yet', () => {
    expect(
      reapprovalRequired(
        aggregate({ approvedVersionId: null, approvedChecksum: null, checksum: 'b'.repeat(64) }),
      ),
    ).toBe(false);
  });
});

describe('decisionToError', () => {
  const agent: PolicyActor = {
    actorType: 'service_account',
    actorId: 'svc-1',
    workspaceId: 'ws-1',
    role: 'owner',
    membershipState: 'active',
    scopes: ['drafts:read'],
    approvalLevel: 'level_3_confirm',
  };

  it('turns a missing scope into an insufficient scope error, not a bare forbidden', () => {
    const decision = can(agent, 'post.publish_now');
    const error = decisionToError(decision, 'corr-1');
    expect(error.code).toBe('SCOPE_INSUFFICIENT');
    expect(error.messageKey).toBe('authz.scope_missing');
    expect(error.details['requiredScopes']).toEqual(['posts:publish']);
    expect(error.correlationId).toBe('corr-1');
  });

  it('turns a role denial into a forbidden error naming the role that would work', () => {
    const analyst: PolicyActor = { ...agent, actorType: 'user', role: 'analyst', scopes: [] };
    const error = decisionToError(can(analyst, 'post.schedule'));
    expect(error.code).toBe('FORBIDDEN');
    expect(error.details['requiredRole']).toBe('editor');
  });

  it('turns an autonomy level denial into a forbidden error naming the level', () => {
    const level2: PolicyActor = {
      ...agent,
      scopes: ['posts:publish'],
      approvalLevel: 'level_2_scheduled',
    };
    const error = decisionToError(can(level2, 'post.publish_now'));
    expect(error.code).toBe('FORBIDDEN');
    expect(error.messageKey).toBe('authz.approval_level_insufficient');
    expect(error.details['required']).toBe('level_3_confirm');
  });
});
