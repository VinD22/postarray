import { describe, expect, it } from 'vitest';

import { createFakeConnector } from './fake/connector';
import { fakeDraft, fakePublishRequest, fakeStatusRequest } from './fake/fixtures';
import {
  computeContentFingerprint,
  ensureNotAlreadyPublished,
  fingerprintDraft,
  providerHonoursIdempotencyKey,
} from './idempotency';
import { fixedClock } from './ports';

const clock = fixedClock('2026-08-04T12:00:00.000Z');

function windowAround(): { from: string; to: string } {
  const nowMs = clock.now().getTime();
  return {
    from: new Date(nowMs - 60 * 60 * 1000).toISOString(),
    to: new Date(nowMs + 60 * 60 * 1000).toISOString(),
  };
}

describe('content fingerprint', () => {
  it('is stable for the same content and different for different content', () => {
    const base = {
      connectionId: 'conn_1',
      body: 'hello',
      mediaChecksums: ['a', 'b'],
      destinationExternalId: null,
      threadBodies: ['first comment'],
      privacyValue: 'public',
    };
    expect(computeContentFingerprint(base)).toBe(computeContentFingerprint(base));
    expect(computeContentFingerprint({ ...base, mediaChecksums: ['b', 'a'] })).toBe(
      computeContentFingerprint(base),
    );
    expect(computeContentFingerprint({ ...base, body: 'hello!' })).not.toBe(
      computeContentFingerprint(base),
    );
    expect(computeContentFingerprint(base)).toMatch(/^[0-9a-f]{64}$/);
  });

  it('differs per connection, so the same draft on two accounts is not confused', () => {
    const draft = fakeDraft({}, { clock });
    const other = fakeDraft(
      { connection: { ...draft.connection, connectionId: 'conn_other' } },
      { clock },
    );
    expect(fingerprintDraft(draft)).not.toBe(fingerprintDraft(other));
  });
});

describe('providerHonoursIdempotencyKey', () => {
  it('treats not_implemented as "we must look it up", not as false', () => {
    expect(providerHonoursIdempotencyKey('supported')).toBe(true);
    expect(providerHonoursIdempotencyKey('not_implemented')).toBe(false);
    expect(providerHonoursIdempotencyKey('unsupported')).toBe(false);
  });
});

describe('ensureNotAlreadyPublished', () => {
  it('proceeds on the first attempt without asking the provider', async () => {
    const connector = createFakeConnector({ clock, instant: true });
    const draft = fakeDraft({}, { clock });
    const bounds = windowAround();
    const result = await ensureNotAlreadyPublished({
      connector,
      connection: draft.connection,
      capabilities: draft.capabilities,
      idempotencyKey: 'fake-idem-000000000001',
      contentFingerprint: fingerprintDraft(draft),
      dispatchWindowFrom: bounds.from,
      dispatchWindowTo: bounds.to,
      attemptNumber: 1,
      clock,
    });
    expect(result.decision).toBe('proceed');
    expect(result.source).toBeNull();
  });

  it('skips the lookup when the provider honours our idempotency key', async () => {
    const connector = createFakeConnector({ clock, instant: true });
    const draft = fakeDraft({}, { clock });
    const bounds = windowAround();
    const result = await ensureNotAlreadyPublished({
      connector,
      connection: draft.connection,
      capabilities: draft.capabilities,
      providerIdempotencySupport: 'supported',
      idempotencyKey: 'fake-idem-000000000001',
      contentFingerprint: fingerprintDraft(draft),
      dispatchWindowFrom: bounds.from,
      dispatchWindowTo: bounds.to,
      attemptNumber: 2,
      clock,
    });
    expect(result.decision).toBe('proceed');
    expect(result.source).toBe('provider_idempotency');
  });

  it('adopts the existing post after a timeout that followed a successful create', async () => {
    const connector = createFakeConnector({ clock, instant: true });
    const draft = fakeDraft({}, { clock });
    const request = fakePublishRequest(draft, {}, { clock });

    // The provider accepted and created the post, then the connection died.
    connector.setFailureMode('timeout_after_accept', 1);
    await expect(connector.publish(request)).rejects.toThrow();
    expect(connector.state.postsFor(draft.connection.connectionId)).toHaveLength(1);

    const bounds = windowAround();
    const result = await ensureNotAlreadyPublished({
      connector,
      connection: draft.connection,
      capabilities: draft.capabilities,
      providerIdempotencySupport: 'not_implemented',
      idempotencyKey: request.idempotencyKey,
      contentFingerprint: request.contentFingerprint,
      dispatchWindowFrom: bounds.from,
      dispatchWindowTo: bounds.to,
      attemptNumber: 2,
      clock,
    });
    expect(result.decision).toBe('adopt');
    expect(result.externalPostId).not.toBeNull();
    expect(result.source).toBe('provider_status');
    // Nothing new was created by the guard itself.
    expect(connector.state.postsFor(draft.connection.connectionId)).toHaveLength(1);
  });

  it('proceeds when the provider proves nothing was created', async () => {
    const connector = createFakeConnector({ clock, instant: true });
    const draft = fakeDraft({}, { clock });
    const bounds = windowAround();
    const result = await ensureNotAlreadyPublished({
      connector,
      connection: draft.connection,
      capabilities: draft.capabilities,
      idempotencyKey: 'fake-idem-000000000001',
      contentFingerprint: fingerprintDraft(draft),
      dispatchWindowFrom: bounds.from,
      dispatchWindowTo: bounds.to,
      attemptNumber: 3,
      clock,
    });
    expect(result.decision).toBe('proceed');
  });

  it('blocks rather than guessing when the status call itself fails', async () => {
    const connector = createFakeConnector({ clock, instant: true });
    const draft = fakeDraft({}, { clock });
    const bounds = windowAround();
    connector.setFailureMode('rate_limit');
    const result = await ensureNotAlreadyPublished({
      connector,
      connection: draft.connection,
      capabilities: draft.capabilities,
      idempotencyKey: 'fake-idem-000000000001',
      contentFingerprint: fingerprintDraft(draft),
      dispatchWindowFrom: bounds.from,
      dispatchWindowTo: bounds.to,
      attemptNumber: 2,
      clock,
    });
    expect(result.decision).toBe('block');
    expect(result.blockReasonKey).not.toBeNull();
  });

  it('blocks while a container is still processing', async () => {
    const connector = createFakeConnector({ clock, instant: true });
    const draft = fakeDraft({}, { clock });
    const request = fakePublishRequest(draft, {}, { clock });
    connector.setFailureMode('container_stuck', 1);
    const pending = await connector.publish(request);
    expect(pending.status).toBe('pending');
    const bounds = windowAround();
    const result = await ensureNotAlreadyPublished({
      connector,
      connection: draft.connection,
      capabilities: draft.capabilities,
      idempotencyKey: request.idempotencyKey,
      contentFingerprint: request.contentFingerprint,
      providerJobId: pending.status === 'pending' ? pending.providerJobId : null,
      dispatchWindowFrom: bounds.from,
      dispatchWindowTo: bounds.to,
      attemptNumber: 2,
      clock,
    });
    expect(result.decision).toBe('block');
  });

  it('does not adopt a post created outside the dispatch window', async () => {
    const connector = createFakeConnector({ clock, instant: true });
    const draft = fakeDraft({}, { clock });
    const request = fakePublishRequest(draft, {}, { clock });
    connector.setFailureMode('timeout_after_accept', 1);
    await expect(connector.publish(request)).rejects.toThrow();

    const status = await connector.getStatus(
      fakeStatusRequest(
        draft,
        {
          dispatchWindowFrom: '2020-01-01T00:00:00.000Z',
          dispatchWindowTo: '2020-01-02T00:00:00.000Z',
        },
        { clock },
      ),
    );
    expect(status.state).toBe('failed');
  });
});
