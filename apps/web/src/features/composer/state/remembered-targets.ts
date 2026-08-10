/**
 * Seeding the composer from a remembered channel selection.
 *
 * Pure, so the notice the person reads and the selection they get are decided
 * by the same code, and both are testable without a browser.
 *
 * The server already filters a remembered selection against live channel health
 * before returning it. This module filters again against the channels this
 * composer can actually see. That is not redundancy for its own sake: the two
 * lists are read at different moments, and a channel revoked in between must
 * come back as "left out", never as a preselected account somebody is about to
 * publish through.
 */

import { filterRememberedTargets, type RememberedTargetsView } from '@relay/contracts';

/** A channel as the composer knows it. `health` is the connection's own. */
export interface ComposerChannel {
  readonly connectionId: string;
  readonly health: string;
  /** False when this person may not publish through this channel. */
  readonly authorized: boolean;
}

export interface RestoredSelection {
  readonly connectionIds: readonly string[];
  /** Remembered channels that are not offerable right now. */
  readonly droppedConnectionIds: readonly string[];
  /**
   * The sentence to show, or null when there is nothing honest to say.
   *
   * `null` covers the two silent cases: the project has not opted in, and
   * nothing was remembered. Neither deserves a notice, because neither is
   * something the person did.
   */
  readonly noticeKey:
    | 'targetMemory.composer.restored'
    | 'targetMemory.composer.droppedSome'
    | 'targetMemory.composer.droppedAll'
    | null;
}

const EMPTY: RestoredSelection = {
  connectionIds: [],
  droppedConnectionIds: [],
  noticeKey: null,
};

/**
 * What the composer should start with.
 *
 * Never throws and never guesses. An opted-out project, an empty memory and a
 * memory whose channels have all been revoked are three different outcomes, and
 * only the third produces a notice saying nothing was restored.
 */
export function restoreSelection(
  remembered: RememberedTargetsView | null | undefined,
  available: readonly ComposerChannel[],
): RestoredSelection {
  if (!remembered?.enabled) {
    return EMPTY;
  }

  // The union of what the server dropped and what this composer drops now.
  const filtered = filterRememberedTargets(remembered.connectionIds, available);
  const dropped = [
    ...remembered.droppedConnectionIds,
    ...filtered.droppedConnectionIds.filter(
      (id) => !remembered.droppedConnectionIds.includes(id),
    ),
  ];

  if (filtered.connectionIds.length === 0) {
    return {
      connectionIds: [],
      droppedConnectionIds: dropped,
      noticeKey: dropped.length === 0 ? null : 'targetMemory.composer.droppedAll',
    };
  }

  return {
    connectionIds: filtered.connectionIds,
    droppedConnectionIds: dropped,
    noticeKey: dropped.length > 0 ? 'targetMemory.composer.droppedSome' : 'targetMemory.composer.restored',
  };
}

/** The count the notice interpolates, which differs by which notice it is. */
export function noticeCount(restored: RestoredSelection): number {
  return restored.noticeKey === 'targetMemory.composer.droppedSome'
    ? restored.droppedConnectionIds.length
    : restored.connectionIds.length;
}
