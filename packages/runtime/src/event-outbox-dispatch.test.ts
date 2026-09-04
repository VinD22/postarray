import { describe, expect, it, vi } from 'vitest';

import { dispatchDomainEventOutbox } from './event-outbox-dispatch';
import { UnknownOutboxKindError } from './outbox-dispatch';

import type { ClaimedOutboxEvent } from './outbox-repository';

function row(overrides: Partial<ClaimedOutboxEvent> = {}): ClaimedOutboxEvent {
  return {
    id: 'evt_1',
    workspaceId: 'ws_1',
    kind: 'post.published',
    dedupeKey: 'post.published:job_1',
    payload: { resourceId: 'job_1' },
    attempts: 0,
    ...overrides,
  };
}

describe('dispatchDomainEventOutbox', () => {
  it('hands a domain event to the fan-out service', async () => {
    const dispatch = vi.fn().mockResolvedValue(undefined);
    const result = await dispatchDomainEventOutbox({ dispatch }, row());

    expect(dispatch).toHaveBeenCalledWith({
      id: 'evt_1',
      workspaceId: 'ws_1',
      kind: 'post.published',
      dedupeKey: 'post.published:job_1',
      payload: { resourceId: 'job_1' },
    });
    // Nothing is started, so there is no workflow identity to report.
    expect(result).toEqual({ workflowId: null, runId: null, publishJobId: null });
  });

  it('accepts the internal kinds that never reach a customer', async () => {
    const dispatch = vi.fn().mockResolvedValue(undefined);
    await dispatchDomainEventOutbox({ dispatch }, row({ kind: 'notification.requested' }));
    expect(dispatch).toHaveBeenCalledOnce();
  });

  it('refuses a workflow intent, which belongs to the other dispatcher', async () => {
    const dispatch = vi.fn();
    await expect(
      dispatchDomainEventOutbox({ dispatch }, row({ kind: 'start_publish' })),
    ).rejects.toBeInstanceOf(UnknownOutboxKindError);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
