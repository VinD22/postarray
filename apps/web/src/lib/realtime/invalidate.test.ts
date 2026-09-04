import { QueryClient } from '@tanstack/react-query';
import type { RealtimeEvent } from '@relay/contracts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { invalidateForEvent, invalidateLiveQueries } from './invalidate';

const WORKSPACE = 'ws_01j0000000000000000000000a';
const OTHER_WORKSPACE = 'ws_01j0000000000000000000000b';
const JOB = 'job_01j0000000000000000000000a';
const CONTENT = 'content_01j0000000000000000000000a';
const RECEIPT = 'receipt_01j0000000000000000000000a';
const CONNECTION = 'conn_01j0000000000000000000000a';

let client: QueryClient;
let invalidate: ReturnType<typeof vi.fn>;

beforeEach(() => {
  client = new QueryClient();
  invalidate = vi.fn();
  client.invalidateQueries = invalidate;
});

function invalidatedKeys(): string[] {
  return invalidate.mock.calls.map((call) => JSON.stringify(call[0]?.queryKey));
}

function statusEvent(workspaceId = WORKSPACE): RealtimeEvent {
  return {
    id: '1725357600000-1',
    type: 'post.status',
    workspaceId,
    occurredAt: '2026-09-03T10:00:00.000Z',
    data: { type: 'post.status', publishJobId: JOB, contentItemId: CONTENT, state: 'dispatching' },
  };
}

describe('invalidateForEvent', () => {
  it('refreshes the job, the post and the queue when a post moves', () => {
    invalidateForEvent(client, WORKSPACE, statusEvent());

    expect(invalidatedKeys()).toContain(JSON.stringify(['ws', WORKSPACE, 'job', JOB]));
    expect(invalidatedKeys()).toContain(JSON.stringify(['ws', WORKSPACE, 'content']));
    expect(invalidatedKeys()).toContain(JSON.stringify(['ws', WORKSPACE, 'action-center']));
  });

  it('scopes every key to the workspace it was given', () => {
    invalidateForEvent(client, OTHER_WORKSPACE, statusEvent(OTHER_WORKSPACE));

    for (const call of invalidate.mock.calls) {
      expect((call[0]?.queryKey as readonly unknown[])[1]).toBe(OTHER_WORKSPACE);
    }
  });

  it('refreshes the receipt and the job behind it', () => {
    invalidateForEvent(client, WORKSPACE, {
      id: '1725357600000-2',
      type: 'receipt.updated',
      workspaceId: WORKSPACE,
      occurredAt: '2026-09-03T10:00:00.000Z',
      data: {
        type: 'receipt.updated',
        receiptId: RECEIPT,
        publishJobId: JOB,
        contentItemId: CONTENT,
      },
    });

    expect(invalidatedKeys()).toContain(JSON.stringify(['ws', WORKSPACE, 'receipt', RECEIPT]));
    expect(invalidatedKeys()).toContain(JSON.stringify(['ws', WORKSPACE, 'job', JOB]));
  });

  it('refreshes the accounts list and the queue when a connection needs attention', () => {
    invalidateForEvent(client, WORKSPACE, {
      id: '1725357600000-3',
      type: 'connection.status',
      workspaceId: WORKSPACE,
      occurredAt: '2026-09-03T10:00:00.000Z',
      data: { type: 'connection.status', connectionId: CONNECTION, status: 'action_required' },
    });

    expect(invalidatedKeys()).toContain(JSON.stringify(['ws', WORKSPACE, 'connections']));
    expect(invalidatedKeys()).toContain(JSON.stringify(['ws', WORKSPACE, 'action-center']));
  });

  it('never writes into the cache, only marks it stale', () => {
    const setQueryData = vi.fn();
    client.setQueryData = setQueryData;
    invalidateForEvent(client, WORKSPACE, statusEvent());
    expect(setQueryData).not.toHaveBeenCalled();
  });
});

describe('invalidateLiveQueries', () => {
  it('covers everything the stream would have, for one workspace only', () => {
    invalidateLiveQueries(client, WORKSPACE);

    expect(invalidate.mock.calls.length).toBeGreaterThan(0);
    for (const call of invalidate.mock.calls) {
      expect((call[0]?.queryKey as readonly unknown[])[1]).toBe(WORKSPACE);
    }
    expect(invalidatedKeys()).toContain(JSON.stringify(['ws', WORKSPACE, 'content']));
    expect(invalidatedKeys()).toContain(JSON.stringify(['ws', WORKSPACE, 'action-center']));
  });
});
