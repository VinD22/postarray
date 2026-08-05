import { describe, expect, it } from 'vitest';
import type { PublicationReceipt, PublishAttempt, ReceiptItem } from '@relay/contracts';

import { buildTimeline, dispatchLatencyMs, hasFailedFollowUp } from './timeline-model';
import { buildCampaignTargets, campaignOutcome, canExportReceipt } from './types';
import type { CampaignTargetView } from './types';
import type { ContentTargetView, ReceiptSummaryView } from '@/lib/api/types';

const CHECKSUM = 'a'.repeat(64);

function attempt(overrides: Partial<PublishAttempt> = {}): PublishAttempt {
  return {
    id: 'att_01j000000000000000000001',
    publishJobId: 'job_01j000000000000000000001',
    attemptNumber: 1,
    startedAt: '2026-08-06T07:30:00.000Z',
    finishedAt: '2026-08-06T07:30:02.000Z',
    resultState: 'published',
    errorClass: null,
    errorCode: null,
    retryable: false,
    nextRetryAt: null,
    providerRequestId: 'req-1',
    httpStatus: 201,
    sanitizedResponse: {},
    ...overrides,
  };
}

function item(overrides: Partial<ReceiptItem> = {}): ReceiptItem {
  return {
    kind: 'comment',
    order: 1,
    threadItemId: null,
    state: 'published',
    externalPostId: '1834905',
    permalink: 'https://example.test/1834905',
    delaySeconds: 120,
    publishedAt: '2026-08-06T07:32:00.000Z',
    errorCode: null,
    ...overrides,
  };
}

function receipt(overrides: Partial<PublicationReceipt> = {}): PublicationReceipt {
  return {
    id: 'rcpt_01j000000000000000000001',
    workspaceId: 'ws_01j000000000000000000001',
    publishJobId: 'job_01j000000000000000000001',
    provider: 'x',
    accountType: 'personal_profile',
    connectionId: 'conn_01j000000000000000000001',
    externalAccountId: 'acct-1',
    externalPostId: '1834221',
    permalink: 'https://example.test/1834221',
    contentVersionId: 'cver_01j000000000000000000001',
    contentVersionChecksum: CHECKSUM,
    capabilityVersion: 'v14',
    scheduledLocalTime: '2026-08-06T09:30:00',
    ianaTimeZone: 'Europe/Berlin',
    scheduledInstant: '2026-08-06T07:30:00.000Z',
    dispatchedAt: '2026-08-06T07:30:01.000Z',
    publishedAt: '2026-08-06T07:30:03.000Z',
    creationSurface: 'web',
    approval: {
      state: 'approved',
      approvalId: 'appr_01j000000000000000000001',
      decidedBy: 'Dana Ito',
      decidedAt: '2026-08-04T07:12:00.000Z',
      policyKey: 'brand.acme_eu.two_approvers',
    },
    cost: {
      currency: 'USD',
      estimatedMinor: 20,
      actualMinor: 20,
      reconciledAt: '2026-08-07T02:00:00.000Z',
    },
    attempts: [attempt()],
    sanitizedProviderResponse: {},
    root: {
      kind: 'root',
      order: 0,
      threadItemId: null,
      state: 'published',
      externalPostId: '1834221',
      permalink: 'https://example.test/1834221',
      delaySeconds: 0,
      publishedAt: '2026-08-06T07:30:03.000Z',
      errorCode: null,
    },
    items: [],
    lastAnalyticsSyncAt: '2026-08-06T08:30:00.000Z',
    createdAt: '2026-08-06T07:30:04.000Z',
    ...overrides,
  };
}

const baseInput = {
  provider: 'X',
  createdByName: 'Ana Ruiz',
  approverName: 'Dana Ito',
  preparedMediaCount: 1,
  analyticsSyncedAt: '2026-08-06T08:30:00.000Z',
  idempotencyKey: 'pub_01j000000000000000000001',
};

describe('buildTimeline', () => {
  it('records approval, the policy and who decided', () => {
    const steps = buildTimeline({ receipt: receipt(), ...baseInput });
    const approved = steps.find((step) => step.id === 'approved');
    expect(approved?.messageKey).toBe('receipt.timeline.approved');
    expect(approved?.values).toMatchObject({
      actor: 'Dana Ito',
      policy: 'brand.acme_eu.two_approvers',
    });
  });

  it('carries the content checksum and the capability version on revalidation', () => {
    const steps = buildTimeline({ receipt: receipt(), ...baseInput });
    const revalidated = steps.find((step) => step.id === 'revalidated');
    expect(revalidated?.detail?.checksum).toBe(CHECKSUM);
    expect(revalidated?.detail?.capabilityVersion).toBe('v14');
  });

  it('carries the idempotency reference on dispatch', () => {
    const steps = buildTimeline({ receipt: receipt(), ...baseInput });
    expect(steps.find((step) => step.id === 'dispatched')?.detail?.idempotencyKey).toBe(
      'pub_01j000000000000000000001',
    );
  });

  it('shows every attempt, including one that failed before a later success', () => {
    const steps = buildTimeline({
      receipt: receipt({
        attempts: [
          attempt({
            attemptNumber: 1,
            resultState: 'retry_scheduled',
            errorClass: 'transient_provider',
            errorCode: 'PROVIDER_TRANSIENT',
            retryable: true,
            nextRetryAt: '2026-08-06T07:31:00.000Z',
            httpStatus: 503,
          }),
          attempt({ attemptNumber: 2 }),
        ],
      }),
      ...baseInput,
    });

    const attemptSteps = steps.filter((step) => step.id.startsWith('attempt-'));
    expect(attemptSteps).toHaveLength(2);
    expect(attemptSteps[0]?.outcome).toBe('retried');
    expect(attemptSteps[0]?.detail?.errorCode).toBe('PROVIDER_TRANSIENT');
    expect(attemptSteps[0]?.detail?.httpStatus).toBe(503);
    expect(attemptSteps[1]?.outcome).toBe('completed');
  });

  it('marks a permanently failed attempt as failed rather than retried', () => {
    const steps = buildTimeline({
      receipt: receipt({
        attempts: [
          attempt({
            resultState: 'failed_permanently',
            errorClass: 'content_invalid',
            errorCode: 'DUPLICATE_CONTENT',
            retryable: false,
            nextRetryAt: null,
            httpStatus: 400,
          }),
        ],
      }),
      ...baseInput,
    });
    expect(steps.find((step) => step.id === 'attempt-1')?.outcome).toBe('failed');
  });

  it('never turns the root post step into a failure when a comment fails', () => {
    const steps = buildTimeline({
      receipt: receipt({
        items: [
          item({ order: 1 }),
          item({
            order: 2,
            state: 'failed_permanently',
            externalPostId: null,
            permalink: null,
            errorCode: 'DUPLICATE_CONTENT',
          }),
        ],
      }),
      ...baseInput,
    });

    const published = steps.find((step) => step.id === 'published');
    expect(published?.outcome).toBe('completed');
    expect(published?.detail?.externalPostId).toBe('1834221');

    const failedItem = steps.find((step) => step.id === 'item-2');
    // A follow up failure is a warning, not a failure of the whole receipt.
    expect(failedItem?.outcome).toBe('warning');
    expect(failedItem?.detail?.errorCode).toBe('DUPLICATE_CONTENT');
  });

  it('orders follow up items by their position', () => {
    const steps = buildTimeline({
      receipt: receipt({ items: [item({ order: 3 }), item({ order: 2 })] }),
      ...baseInput,
    });
    const ids = steps.filter((step) => step.id.startsWith('item-')).map((step) => step.id);
    expect(ids).toEqual(['item-2', 'item-3']);
  });

  it('omits the media step when nothing was prepared', () => {
    const steps = buildTimeline({ receipt: receipt(), ...baseInput, preparedMediaCount: 0 });
    expect(steps.some((step) => step.id === 'media-prepared')).toBe(false);
  });

  it('omits the analytics step when no sync has run', () => {
    const steps = buildTimeline({ receipt: receipt(), ...baseInput, analyticsSyncedAt: null });
    expect(steps.some((step) => step.id === 'analytics')).toBe(false);
  });
});

describe('derived facts', () => {
  it('detects a failed follow up while the root is live', () => {
    expect(hasFailedFollowUp(receipt())).toBe(false);
    expect(
      hasFailedFollowUp(receipt({ items: [item({ order: 2, errorCode: 'PROVIDER_PERMANENT' })] })),
    ).toBe(true);
  });

  it('measures dispatch latency against the scheduled instant', () => {
    expect(dispatchLatencyMs(receipt())).toBe(1000);
  });
});

describe('campaignOutcome', () => {
  function target(overrides: Partial<CampaignTargetView> = {}): CampaignTargetView {
    return {
      variantId: 'var_1',
      connectionId: 'conn_1',
      provider: 'x',
      accountLabel: '@acme',
      state: 'published',
      hasExternalPost: true,
      receiptId: 'rcpt_1',
      permalink: null,
      failedItemCount: 0,
      ...overrides,
    };
  }

  it('is partially published when one target produced a post and another did not', () => {
    expect(
      campaignOutcome([
        target(),
        target({
          variantId: 'var_2',
          state: 'failed_permanently',
          hasExternalPost: false,
        }),
      ]),
    ).toBe('partially_published');
  });

  it('is published only when every target produced a post', () => {
    expect(campaignOutcome([target(), target({ variantId: 'var_2' })])).toBe('published');
  });

  it('counts a post deleted on the platform as one that existed', () => {
    expect(
      campaignOutcome([
        target(),
        target({ variantId: 'var_2', state: 'deleted_externally', hasExternalPost: true }),
      ]),
    ).toBe('published');
  });

  it('is failed only when no target produced a post and all are finished', () => {
    expect(
      campaignOutcome([
        target({ state: 'failed_permanently', hasExternalPost: false }),
        target({ variantId: 'var_2', state: 'canceled', hasExternalPost: false }),
      ]),
    ).toBe('failed');
  });

  it('is in flight while a target is still running', () => {
    expect(campaignOutcome([target({ state: 'dispatching', hasExternalPost: false })])).toBe(
      'in_flight',
    );
  });

  it('is in flight when there is nothing to roll up yet', () => {
    expect(campaignOutcome([])).toBe('in_flight');
  });
});

describe('buildCampaignTargets', () => {
  function contentTarget(overrides: Partial<ContentTargetView> = {}): ContentTargetView {
    return {
      variantId: 'var_1',
      connectionId: 'conn_1',
      provider: 'x',
      accountLabel: '@acme',
      inherits: true,
      state: 'scheduled',
      characterCount: 100,
      characterLimit: 280,
      issueCount: 0,
      blockingIssueCount: 0,
      ...overrides,
    };
  }

  function summary(overrides: Partial<ReceiptSummaryView> = {}): ReceiptSummaryView {
    return {
      receiptId: 'rcpt_1',
      contentItemId: 'post_1',
      title: 'Launch thread',
      provider: 'x',
      accountLabel: '@acme',
      state: 'published',
      publishedAt: '2026-08-06T07:30:03.000Z',
      permalink: 'https://example.test/1834221',
      failedItemCount: 0,
      ...overrides,
    };
  }

  it('keeps a target that has no receipt yet rather than hiding it', () => {
    const result = buildCampaignTargets(
      [
        contentTarget(),
        contentTarget({ variantId: 'var_2', accountLabel: 'Acme EU', provider: 'linkedin' }),
      ],
      [summary()],
    );
    expect(result).toHaveLength(2);
    expect(result[1]?.receiptId).toBeNull();
    expect(result[1]?.hasExternalPost).toBe(false);
  });

  it('prefers the receipt state over the planned target state', () => {
    const result = buildCampaignTargets([contentTarget()], [summary()]);
    expect(result[0]?.state).toBe('published');
    expect(result[0]?.hasExternalPost).toBe(true);
    expect(result[0]?.permalink).toBe('https://example.test/1834221');
  });

  it('carries the failed follow up count through', () => {
    const result = buildCampaignTargets([contentTarget()], [summary({ failedItemCount: 1 })]);
    expect(result[0]?.failedItemCount).toBe(1);
  });
});

describe('canExportReceipt', () => {
  it('allows owners, admins and approvers', () => {
    expect(canExportReceipt('owner')).toBe(true);
    expect(canExportReceipt('admin')).toBe(true);
    expect(canExportReceipt('approver')).toBe(true);
  });

  it('refuses everyone else', () => {
    expect(canExportReceipt('editor')).toBe(false);
    expect(canExportReceipt('analyst')).toBe(false);
    expect(canExportReceipt('viewer')).toBe(false);
    expect(canExportReceipt('manager')).toBe(false);
  });
});
