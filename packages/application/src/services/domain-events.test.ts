import { describe, expect, it, vi } from 'vitest';

import { createDomainEventService } from './domain-events';

import type { ClaimedDomainEventRow } from '../types';

function deps(overrides: { realtime?: { publish: ReturnType<typeof vi.fn> } } = {}) {
  const emit = vi.fn().mockResolvedValue([]);
  const warn = vi.fn();
  return {
    emit,
    warn,
    service: createDomainEventService({
      webhooks: { emit } as never,
      clock: { now: () => new Date('2026-09-03T10:00:00.000Z') },
      logger: { warn, info: vi.fn(), error: vi.fn(), debug: vi.fn() } as never,
      ...(overrides.realtime === undefined ? {} : { realtime: overrides.realtime as never }),
    }),
  };
}

function row(overrides: Partial<ClaimedDomainEventRow> = {}): ClaimedDomainEventRow {
  return {
    id: 'evt_1',
    workspaceId: 'ws_1',
    kind: 'post.published',
    dedupeKey: 'post.published:job_1',
    payload: { resourceId: 'job_1', connectionId: 'conn_1', state: 'published' },
    createdAt: new Date('2026-09-03T09:59:00.000Z'),
    ...overrides,
  };
}

describe('createDomainEventService', () => {
  it('emits a customer-facing event to webhook endpoints', async () => {
    const { service, emit } = deps();
    await service.dispatch(row());

    expect(emit).toHaveBeenCalledWith(
      'post.published',
      { state: 'published' },
      { workspaceId: 'ws_1', connectionId: 'conn_1', correlationId: null },
    );
  });

  it('lifts resourceId and connectionId out of the payload, leaving the rest as data', async () => {
    const { service, emit } = deps();
    await service.dispatch(
      row({ payload: { resourceId: 'job_2', connectionId: 'conn_2', a: 1, b: 2 } }),
    );

    expect(emit).toHaveBeenCalledWith('post.published', { a: 1, b: 2 }, expect.anything());
  });

  it('does not send internal events to customer endpoints', async () => {
    const { service, emit } = deps();
    await service.dispatch(row({ kind: 'notification.requested' }));
    expect(emit).not.toHaveBeenCalled();
  });

  it('publishes to realtime when a publisher is configured', async () => {
    const publish = vi.fn().mockResolvedValue(undefined);
    const { service } = deps({ realtime: { publish } });
    await service.dispatch(row());

    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'evt_1', type: 'post.published', workspaceId: 'ws_1' }),
    );
  });

  it('never fails a row because live updates failed', async () => {
    // A dropped live update costs a refresh. A stuck outbox row costs the event.
    const publish = vi.fn().mockRejectedValue(new Error('redis down'));
    const { service, warn } = deps({ realtime: { publish } });

    await expect(service.dispatch(row())).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalled();
  });
});
