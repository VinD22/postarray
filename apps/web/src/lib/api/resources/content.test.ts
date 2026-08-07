import { beforeEach, describe, expect, it, vi } from 'vitest';

const callMock = vi.hoisted(() => vi.fn());

vi.mock('../call', () => ({ call: callMock }));

import { approvalsApi, contentApi } from './content';

describe('browser content and approval resource contracts', () => {
  beforeEach(() => {
    callMock.mockReset();
    callMock.mockResolvedValue({ data: [], pageInfo: { nextCursor: null, hasMore: false, limit: 25 } });
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

  it('keeps approval request, queue and decision payloads aligned with the service contract', async () => {
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

    expect(callMock).toHaveBeenNthCalledWith(
      1,
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
      2,
      '/approvals/pending',
      { query: { limit: 100 } },
      expect.any(Function),
    );
    expect(callMock).toHaveBeenNthCalledWith(
      3,
      '/approvals/approval_01/decision',
      {
        method: 'POST',
        body: { decision: 'request_changes', note: 'Update the total.' },
        idempotencyKey: 'idem-decision',
      },
      expect.any(Function),
    );
  });
});
