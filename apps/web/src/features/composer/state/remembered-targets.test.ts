import { describe, expect, it } from 'vitest';
import type { RememberedTargetsView } from '@relay/contracts';

import { noticeCount, restoreSelection, type ComposerChannel } from './remembered-targets';

function memory(overrides: Partial<RememberedTargetsView> = {}): RememberedTargetsView {
  return {
    brandId: 'brand_1',
    enabled: true,
    connectionIds: [],
    droppedConnectionIds: [],
    updatedAt: '2026-06-05T10:00:00.000Z',
    ...overrides,
  };
}

function channel(connectionId: string, health = 'active', authorized = true): ComposerChannel {
  return { connectionId, health, authorized };
}

describe('opting out', () => {
  it('restores nothing and says nothing when the project has not opted in', () => {
    const restored = restoreSelection(
      memory({ enabled: false, connectionIds: ['conn_a'] }),
      [channel('conn_a')],
    );
    expect(restored.connectionIds).toEqual([]);
    expect(restored.noticeKey).toBeNull();
  });

  it('restores nothing and says nothing when there is no memory at all', () => {
    expect(restoreSelection(null, [channel('conn_a')]).noticeKey).toBeNull();
    expect(restoreSelection(undefined, [channel('conn_a')]).connectionIds).toEqual([]);
  });

  it('says nothing when the memory is empty rather than announcing an empty restore', () => {
    expect(restoreSelection(memory(), [channel('conn_a')]).noticeKey).toBeNull();
  });
});

describe('restoring', () => {
  it('preselects the remembered channels in order', () => {
    const restored = restoreSelection(memory({ connectionIds: ['conn_b', 'conn_a'] }), [
      channel('conn_a'),
      channel('conn_b'),
    ]);
    expect(restored.connectionIds).toEqual(['conn_b', 'conn_a']);
    expect(restored.noticeKey).toBe('targetMemory.composer.restored');
    expect(noticeCount(restored)).toBe(2);
  });

  it('never reselects a channel revoked since the server answered', () => {
    const restored = restoreSelection(memory({ connectionIds: ['conn_a', 'conn_b'] }), [
      channel('conn_a'),
      channel('conn_b', 'revoked'),
    ]);
    expect(restored.connectionIds).toEqual(['conn_a']);
    expect(restored.droppedConnectionIds).toEqual(['conn_b']);
    expect(restored.noticeKey).toBe('targetMemory.composer.droppedSome');
    expect(noticeCount(restored)).toBe(1);
  });

  it('never reselects a paused channel', () => {
    const restored = restoreSelection(memory({ connectionIds: ['conn_a'] }), [
      channel('conn_a', 'paused'),
    ]);
    expect(restored.connectionIds).toEqual([]);
    expect(restored.noticeKey).toBe('targetMemory.composer.droppedAll');
  });

  it('never reselects a channel this person is not authorized for', () => {
    const restored = restoreSelection(memory({ connectionIds: ['conn_a'] }), [
      channel('conn_a', 'active', false),
    ]);
    expect(restored.connectionIds).toEqual([]);
    expect(restored.noticeKey).toBe('targetMemory.composer.droppedAll');
  });

  it('keeps the ids the server already dropped without listing one twice', () => {
    const restored = restoreSelection(
      memory({ connectionIds: ['conn_a'], droppedConnectionIds: ['conn_gone'] }),
      [channel('conn_a')],
    );
    expect(restored.droppedConnectionIds).toEqual(['conn_gone']);
    expect(restored.connectionIds).toEqual(['conn_a']);
  });

  it('merges a server drop and a client drop without duplicating', () => {
    const restored = restoreSelection(
      memory({ connectionIds: ['conn_a', 'conn_b'], droppedConnectionIds: ['conn_b'] }),
      [channel('conn_a'), channel('conn_b', 'expired')],
    );
    expect(restored.droppedConnectionIds).toEqual(['conn_b']);
  });
});
