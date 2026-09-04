import { beforeEach, describe, expect, it, vi } from 'vitest';

const callMock = vi.hoisted(() => vi.fn());

vi.mock('../call', () => ({ call: callMock }));

import { demoReceipts } from '../fixtures';
import { ApiError } from '../error';
import { approvalsApi, contentApi, publishingApi, receiptsApi } from './content';

describe('browser content and approval resource contracts', () => {
  beforeEach(() => {
    callMock.mockReset();
    callMock.mockResolvedValue({
      data: [],
      pageInfo: { nextCursor: null, hasMore: false, limit: 25 },
    });
  });

  it('uses the canonical content read route needed by approval review', async () => {
    await contentApi.get('content_01');

    expect(callMock).toHaveBeenCalledWith(
      '/content/content_01',
      {},
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('freezes an immutable version before a publish intent can be committed', async () => {
    await contentApi.freezeVersion('content_01', 'idem-version');

    expect(callMock).toHaveBeenCalledWith(
      '/content/content_01/versions',
      { method: 'POST', idempotencyKey: 'idem-version' },
      expect.any(Function),
    );
  });

  it('keeps approval request, queue and decision payloads aligned with the service contract', async () => {
    await approvalsApi.get('approval_01');
    await approvalsApi.request(
      {
        contentItemId: 'content_01',
        approverIds: ['user_01', 'user_02'],
        note: 'Check the figures.',
      },
      'idem-request',
    );
    await approvalsApi.listPending({ limit: 100 });
    await approvalsApi.decide(
      'approval_01',
      { decision: 'request_changes', note: 'Update the total.' },
      'idem-decision',
    );

    expect(callMock).toHaveBeenNthCalledWith(1, '/approvals/approval_01', {}, expect.any(Function));
    expect(callMock).toHaveBeenNthCalledWith(
      2,
      '/approvals',
      {
        method: 'POST',
        body: {
          contentItemId: 'content_01',
          approverIds: ['user_01', 'user_02'],
          note: 'Check the figures.',
        },
        idempotencyKey: 'idem-request',
      },
      expect.any(Function),
    );
    expect(callMock).toHaveBeenNthCalledWith(
      3,
      '/approvals/pending',
      { query: { limit: 100 } },
      expect.any(Function),
    );
    expect(callMock).toHaveBeenNthCalledWith(
      4,
      '/approvals/approval_01/decision',
      {
        method: 'POST',
        body: { decision: 'request_changes', note: 'Update the total.' },
        idempotencyKey: 'idem-decision',
      },
      expect.any(Function),
    );
  });

  it('keeps each demo receipt summary linked to matching content and valid evidence', async () => {
    const summary = demoReceipts[0];
    expect(summary).toBeDefined();
    if (!summary) return;

    await receiptsApi.get(summary.receiptId);
    const receiptFallback = callMock.mock.calls[0]?.[2] as (() => unknown) | undefined;
    const receipt = receiptFallback?.() as
      { readonly id?: unknown; readonly publishJobId?: unknown } | undefined;

    callMock.mockClear();
    await contentApi.get(summary.contentItemId);
    const contentFallback = callMock.mock.calls[0]?.[2] as (() => unknown) | undefined;
    const content = contentFallback?.() as
      { readonly id?: unknown; readonly state?: unknown; readonly title?: unknown } | undefined;

    expect(receipt).toMatchObject({
      id: summary.receiptId,
      publishJobId: expect.stringMatching(/^job_/),
    });
    expect(content).toMatchObject({
      id: summary.contentItemId,
      state: summary.state,
      title: summary.title,
    });
  });

  it('explains that a demo publish is unavailable instead of reporting success', async () => {
    await publishingApi.publishNow(
      {
        contentItemId: 'content_demo0000000000001',
        confirmation: {
          acknowledgedTargetCount: 1,
          acknowledgedVersionChecksum: '1'.repeat(64),
          acknowledgedEscalations: [],
        },
      },
      'publish-demo-1',
    );
    const fallback = callMock.mock.calls[0]?.[2] as (() => unknown) | undefined;

    let thrown: unknown;
    try {
      fallback?.();
    } catch (error) {
      thrown = error;
    }

    expect(ApiError.is(thrown)).toBe(true);
    if (ApiError.is(thrown)) {
      expect(thrown.messageKey).toBe('error.demo_unavailable.message');
      expect(thrown.retryable).toBe(false);
    }
  });
});
