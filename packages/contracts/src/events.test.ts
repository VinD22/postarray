import { describe, expect, it } from 'vitest';

import {
  realtimeEventInputSchema,
  realtimeEventSchema,
  toRealtimeEvents,
  type DomainEventEnvelope,
} from './events';

const WORKSPACE = 'ws_01j0000000000000000000000a';
const OTHER_WORKSPACE = 'ws_01j0000000000000000000000b';
const JOB = 'job_01j0000000000000000000000a';
const CONTENT = 'content_01j0000000000000000000000a';
const RECEIPT = 'receipt_01j0000000000000000000000a';
const CONNECTION = 'conn_01j0000000000000000000000a';
const MEDIA = 'media_01j0000000000000000000000a';

function envelope(overrides: Partial<DomainEventEnvelope> = {}): DomainEventEnvelope {
  return {
    id: 'outbox_01j0000000000000000000000a',
    type: 'post.published',
    workspaceId: WORKSPACE,
    occurredAt: '2026-09-03T10:00:00.000Z',
    resourceId: JOB,
    connectionId: null,
    correlationId: null,
    data: {},
    ...overrides,
  };
}

describe('realtimeEventSchema', () => {
  it('accepts a well formed event', () => {
    const parsed = realtimeEventSchema.safeParse({
      id: '1725357600000-0',
      type: 'post.status',
      workspaceId: WORKSPACE,
      occurredAt: '2026-09-03T10:00:00.000Z',
      data: { type: 'post.status', publishJobId: JOB, contentItemId: CONTENT, state: 'published' },
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects an outer type that disagrees with the payload', () => {
    const parsed = realtimeEventSchema.safeParse({
      id: '1725357600000-0',
      type: 'receipt.updated',
      workspaceId: WORKSPACE,
      occurredAt: '2026-09-03T10:00:00.000Z',
      data: { type: 'post.status', publishJobId: JOB, contentItemId: null, state: 'published' },
    });
    expect(parsed.success).toBe(false);
  });

  it('rejects an id that is not a stream entry id', () => {
    const parsed = realtimeEventSchema.safeParse({
      id: 'not-a-stream-id',
      type: 'post.status',
      workspaceId: WORKSPACE,
      occurredAt: '2026-09-03T10:00:00.000Z',
      data: { type: 'post.status', publishJobId: JOB, contentItemId: null, state: 'published' },
    });
    expect(parsed.success).toBe(false);
  });

  it('rejects an unknown field rather than passing it through to a client', () => {
    const parsed = realtimeEventInputSchema.safeParse({
      type: 'post.status',
      workspaceId: WORKSPACE,
      occurredAt: '2026-09-03T10:00:00.000Z',
      data: { type: 'post.status', publishJobId: JOB, contentItemId: null, state: 'published' },
      title: 'the caption somebody wrote',
    });
    expect(parsed.success).toBe(false);
  });
});

describe('toRealtimeEvents', () => {
  it('maps a published post to a status update and a receipt update', () => {
    const events = toRealtimeEvents(
      envelope({ data: { publishJobId: JOB, contentItemId: CONTENT, receiptId: RECEIPT } }),
    );
    expect(events.map((event) => event.type)).toEqual(['post.status', 'receipt.updated']);
    expect(events[0]?.data).toMatchObject({ state: 'published', contentItemId: CONTENT });
  });

  it('emits only the status update when no receipt was written', () => {
    const events = toRealtimeEvents(envelope({ type: 'post.dispatching' }));
    expect(events).toHaveLength(1);
    expect(events[0]?.data).toMatchObject({ state: 'dispatching', publishJobId: JOB });
  });

  it('carries no field the emitter added beyond the declared payload', () => {
    const events = toRealtimeEvents(
      envelope({ data: { publishJobId: JOB, title: 'launch day', providerResponse: { ok: true } } }),
    );
    expect(Object.keys(events[0]?.data ?? {}).sort()).toEqual([
      'contentItemId',
      'publishJobId',
      'state',
      'type',
    ]);
  });

  it('maps connection and media events', () => {
    expect(
      toRealtimeEvents(
        envelope({ type: 'connection.action_required', connectionId: CONNECTION }),
      )[0]?.data,
    ).toMatchObject({ connectionId: CONNECTION, status: 'action_required' });

    expect(
      toRealtimeEvents(
        envelope({ type: 'media.scanned', resourceId: MEDIA, data: { scanState: 'rejected' } }),
      )[0]?.data,
    ).toMatchObject({ mediaAssetId: MEDIA, scanState: 'rejected' });
  });

  it('produces nothing for a domain event no screen renders live', () => {
    expect(toRealtimeEvents(envelope({ type: 'analytics.updated' }))).toEqual([]);
  });

  it('drops a malformed payload instead of emitting an unparsed one', () => {
    expect(toRealtimeEvents(envelope({ resourceId: 'not-a-job-id', data: {} }))).toEqual([]);
  });

  it('never rewrites the workspace an event belongs to', () => {
    const events = toRealtimeEvents(envelope({ workspaceId: OTHER_WORKSPACE }));
    expect(events.every((event) => event.workspaceId === OTHER_WORKSPACE)).toBe(true);
  });
});
