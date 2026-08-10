import { describe, expect, it } from 'vitest';

import { filterRememberedTargets, type OfferableChannel } from './target-memory';

/**
 * The one rule worth a test of its own: a remembered channel is re-checked
 * before it is offered. Everything a person could be surprised by later starts
 * with a channel being silently reselected here.
 */

function channel(
  connectionId: string,
  health: string,
  authorized = true,
): OfferableChannel {
  return { connectionId, health, authorized };
}

const REMEMBERED = ['conn_a', 'conn_b', 'conn_c', 'conn_d', 'conn_e'];

describe('filterRememberedTargets', () => {
  it('keeps active authorized channels in remembered order', () => {
    const result = filterRememberedTargets(['conn_b', 'conn_a'], [
      channel('conn_a', 'active'),
      channel('conn_b', 'active'),
    ]);
    expect(result.connectionIds).toEqual(['conn_b', 'conn_a']);
    expect(result.droppedConnectionIds).toEqual([]);
  });

  it('drops revoked, paused, expired and unauthorized channels', () => {
    const result = filterRememberedTargets(REMEMBERED, [
      channel('conn_a', 'active'),
      channel('conn_b', 'revoked'),
      channel('conn_c', 'paused'),
      channel('conn_d', 'expired'),
      channel('conn_e', 'active', false),
    ]);
    expect(result.connectionIds).toEqual(['conn_a']);
    expect(result.droppedConnectionIds).toEqual(['conn_b', 'conn_c', 'conn_d', 'conn_e']);
  });

  it('drops a channel that no longer exists in the project', () => {
    const result = filterRememberedTargets(['conn_a', 'conn_gone'], [channel('conn_a', 'active')]);
    expect(result.connectionIds).toEqual(['conn_a']);
    expect(result.droppedConnectionIds).toEqual(['conn_gone']);
  });

  it('offers nothing when every remembered channel needs attention', () => {
    const result = filterRememberedTargets(['conn_a'], [channel('conn_a', 'action_required')]);
    expect(result.connectionIds).toEqual([]);
    expect(result.droppedConnectionIds).toEqual(['conn_a']);
  });

  it('is empty for an empty memory', () => {
    expect(filterRememberedTargets([], [channel('conn_a', 'active')])).toEqual({
      connectionIds: [],
      droppedConnectionIds: [],
    });
  });
});
