'use client';

/**
 * Seed the composer's account selection from what this person picked last time.
 *
 * Runs once, when the composer opens on an empty selection. It deliberately
 * does nothing to a draft that already has accounts: reopening a draft must
 * show the accounts that draft has, not the ones the person used somewhere
 * else.
 *
 * Everything the restore refuses to preselect is reported rather than hidden.
 * A revoked, paused or expired channel comes back as "left out", so nobody
 * discovers at publish time that an account they thought was selected was
 * quietly dropped, and nobody publishes through an account they thought was
 * disconnected.
 */

import { useEffect, useMemo, useRef } from 'react';

import {
  restoreSelection,
  type ComposerChannel,
  type RestoredSelection,
} from '../state/remembered-targets';
import type { ComposerAction } from '../state/composer-reducer';
import type { TargetAccount } from '../types';
import { useRememberedTargets } from './use-remembered-targets';

export interface SeedRememberedTargetsInput {
  readonly brandId: string | null;
  readonly accounts: readonly TargetAccount[];
  readonly selectedConnectionIds: readonly string[];
  readonly dispatch: (action: ComposerAction) => void;
}

export interface SeededTargets {
  /**
   * The ICU key for the notice, or null when there is nothing to say.
   *
   * Kept as the literal union rather than widened to `string`, so a key that is
   * not in the catalog is a compile error rather than a blank line in the rail.
   */
  readonly noticeKey: RestoredSelection['noticeKey'];
  readonly count: number;
  readonly droppedConnectionIds: readonly string[];
}

/**
 * A channel as the filter sees it.
 *
 * `paused` on the composer's account model is the connection's paused state, so
 * it maps onto the health vocabulary the shared filter understands. An account
 * the composer cannot see at all is simply absent, and is dropped for that
 * reason rather than treated as available.
 */
function toChannels(accounts: readonly TargetAccount[]): readonly ComposerChannel[] {
  return accounts.map((account) => ({
    connectionId: account.connectionId,
    health: account.paused ? 'paused' : 'active',
    // The composer only ever receives accounts this person may publish
    // through, so presence here is the authorization signal.
    authorized: true,
  }));
}

export function useSeedRememberedTargets(input: SeedRememberedTargetsInput): SeededTargets {
  const memory = useRememberedTargets(input.brandId);
  const seeded = useRef(false);

  const restored = useMemo(
    () => restoreSelection(memory.data ?? null, toChannels(input.accounts)),
    [memory.data, input.accounts],
  );

  useEffect(() => {
    if (seeded.current) return;
    if (memory.data === undefined) return;
    // An existing selection is the draft's own answer and outranks a memory.
    if (input.selectedConnectionIds.length > 0) {
      seeded.current = true;
      return;
    }
    if (restored.connectionIds.length === 0) return;
    seeded.current = true;
    for (const connectionId of restored.connectionIds) {
      input.dispatch({ type: 'target/add', connectionId });
    }
  }, [memory.data, restored, input]);

  return {
    noticeKey: restored.noticeKey,
    count:
      restored.noticeKey === 'targetMemory.composer.droppedSome'
        ? restored.droppedConnectionIds.length
        : restored.connectionIds.length,
    droppedConnectionIds: restored.droppedConnectionIds,
  };
}
