import { ID_PREFIXES, newId, publicationReceiptSchema } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { receiptRowToView, type ReceiptRow } from './receipts';

const at = new Date('2026-08-06T08:00:00.000Z');

function row(): ReceiptRow {
  return {
    id: newId(ID_PREFIXES.receipt),
    workspaceId: newId(ID_PREFIXES.workspace),
    publishJobId: newId(ID_PREFIXES.publishJob),
    provider: 'linkedin',
    connectionId: newId(ID_PREFIXES.connection),
    externalPostId: 'urn:li:share:123',
    permalink: 'https://www.linkedin.com/feed/update/urn:li:share:123',
    contentVersionId: newId(ID_PREFIXES.contentVersion),
    contentHash: 'a'.repeat(64),
    publishedShortLinks: [],
    scheduledFor: null,
    scheduledTimeZone: null,
    dispatchedAt: null,
    publishedAt: at,
    surface: 'web',
    approvedByUserId: newId(ID_PREFIXES.user),
    costActualMinor: 3,
    costCurrency: 'USD',
    responseEvidence: { status: 'created' },
    lastAnalyticsSyncAt: null,
    deletedExternallyAt: null,
    createdAt: at,
    publishJob: {
      state: 'published',
      scheduledFor: new Date('2026-08-06T07:59:00.000Z'),
      scheduledTimeZone: 'Asia/Kolkata',
      nextAttemptAt: null,
      approvalPolicy: 'single_approver',
      approvalRequest: {
        id: newId(ID_PREFIXES.approval),
        state: 'approved',
        decisions: [{ decidedByUserId: newId(ID_PREFIXES.user), createdAt: at }],
      },
      connection: {
        accountType: 'organization',
        externalAccountId: 'company-123',
        capabilityVersion: 'linkedin-2026-08',
      },
      attempts: [
        {
          id: newId(ID_PREFIXES.publishAttempt),
          attemptNumber: 1,
          outcome: 'succeeded',
          errorClass: null,
          errorCode: null,
          sanitizedResponse: { result: 'accepted' },
          providerRequestId: 'provider-request-1',
          httpStatus: 201,
          startedAt: new Date('2026-08-06T07:59:50.000Z'),
          endedAt: at,
        },
      ],
      postVariant: {
        capabilitySnapshotVersion: 'linkedin-2026-08-approved',
        estimatedCostMinor: 5,
        estimatedCostCurrency: 'USD',
        commentItems: [
          {
            id: newId(ID_PREFIXES.comment),
            position: 0,
            state: 'failed_permanently',
            delayMinutes: 5,
          },
        ],
      },
    },
  };
}

describe('publication receipt view', () => {
  it('matches the canonical transport contract', () => {
    const receipt = receiptRowToView(row());

    expect(publicationReceiptSchema.safeParse(receipt)).toMatchObject({ success: true });
    expect(receipt.scheduledLocalTime).toBe('2026-08-06T13:29');
    expect(receipt.capabilityVersion).toBe('linkedin-2026-08-approved');
    expect(receipt.approval.state).toBe('approved');
    expect(receipt.root.externalPostId).toBe('urn:li:share:123');
    expect(receipt.items[0]).toMatchObject({ delaySeconds: 300, state: 'failed_permanently' });
    expect(receipt.attempts[0]).toMatchObject({
      resultState: 'published',
      retryable: false,
      providerRequestId: 'provider-request-1',
    });
  });

  it('uses explicit unavailable evidence when a legacy capability snapshot is absent', () => {
    const legacy = row();
    const receipt = receiptRowToView({
      ...legacy,
      publishJob: {
        ...legacy.publishJob,
        connection: { ...legacy.publishJob.connection, capabilityVersion: null },
        postVariant: null,
      },
    });

    expect(receipt.capabilityVersion).toBe('unavailable');
    expect(receipt.cost).toBeNull();
    expect(publicationReceiptSchema.safeParse(receipt)).toMatchObject({ success: true });
  });
});
