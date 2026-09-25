'use client';

/**
 * A copy of the draft on this device, so a closed tab is not a lost post.
 *
 * Autosave is 800ms behind the keyboard and can fail for a whole minute while
 * somebody keeps typing. Everything in between existed only in React state:
 * a reload, a crash, a phone that killed the tab, and it was gone. The mirror
 * is written 300ms after an edit, keyed by workspace and draft, and removed the
 * moment the server accepts the work.
 *
 * It stores media identifiers, never media bytes, because that is all the draft
 * itself holds: the files are already in the library. It is capped, and a draft
 * larger than the cap is simply not mirrored rather than being truncated into
 * something that would restore as a shorter post than the one somebody wrote.
 */

import { useEffect, useRef } from 'react';

import type { ComposerState } from '../types';

/** Bumped when the stored shape changes. An older mirror is discarded. */
const MIRROR_VERSION = 1;

/** Roughly half a megabyte of JSON, well inside every browser's quota. */
const MAX_MIRROR_BYTES = 512 * 1024;

const WRITE_DELAY_MS = 300;

/** The key for a draft that has no server row yet. */
const NEW_DRAFT_KEY = 'new';

export interface DraftMirror {
  readonly version: number;
  readonly contentItemId: string | null;
  /**
   * The server's `updatedAt` this copy was taken from.
   *
   * Restoring is only safe while the server still holds that same version. A
   * newer one means somebody saved from another device, and the mirror is a
   * copy of something that has since been overtaken.
   */
  readonly baseUpdatedAt: string | null;
  readonly dirty: boolean;
  readonly state: ComposerState;
}

export function draftMirrorKey(workspaceId: string, contentItemId: string | null): string {
  return `pa:draft:${workspaceId}:${contentItemId === null || contentItemId.length === 0 ? NEW_DRAFT_KEY : contentItemId}`;
}

/** The stored copy, or null when there is none this code can trust. */
export function readDraftMirror(key: string): DraftMirror | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      (parsed as { version?: unknown }).version !== MIRROR_VERSION ||
      typeof (parsed as { state?: unknown }).state !== 'object'
    ) {
      return null;
    }
    return parsed as DraftMirror;
  } catch {
    // A quota error, a private window, a half-written value: none of them are
    // worth a message. The draft is still on screen.
    return null;
  }
}

export function clearDraftMirror(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}

export interface DraftMirrorInput {
  readonly workspaceId: string;
  readonly state: ComposerState;
  /** True while the draft holds edits the server has not accepted. */
  readonly dirty: boolean;
  /** The server's `updatedAt` from the last successful save, if any. */
  readonly savedAt: string | null;
  /** The `updatedAt` the composer opened with. */
  readonly loadedAt: string | null;
}

/**
 * Keep the device copy in step with the draft.
 *
 * Only a dirty draft is written. A clean one has nothing the server does not
 * already have, and writing it would overwrite a mirror somebody has not
 * decided about yet.
 */
export function useDraftMirror(input: DraftMirrorInput): void {
  const key = draftMirrorKey(input.workspaceId, input.state.master.id);
  const previousKey = useRef(key);

  // The lazily created draft gets its real id part way through, which moves it
  // to a new key. The copy filed under "new" is the same draft and would
  // otherwise be offered back on the next visit as a second one.
  useEffect(() => {
    if (previousKey.current !== key) {
      clearDraftMirror(previousKey.current);
      previousKey.current = key;
    }
  }, [key]);

  useEffect(() => {
    if (!input.dirty) {
      clearDraftMirror(key);
      return;
    }
    const handle = setTimeout(() => {
      const mirror: DraftMirror = {
        version: MIRROR_VERSION,
        contentItemId: input.state.master.id.length === 0 ? null : input.state.master.id,
        baseUpdatedAt: input.savedAt ?? input.loadedAt,
        dirty: true,
        state: input.state,
      };
      try {
        const payload = JSON.stringify(mirror);
        if (payload.length > MAX_MIRROR_BYTES) {
          return;
        }
        window.localStorage.setItem(key, payload);
      } catch {
        return;
      }
    }, WRITE_DELAY_MS);
    return () => {
      clearTimeout(handle);
    };
  }, [input.dirty, input.loadedAt, input.savedAt, input.state, key]);
}

export type RestoreOffer =
  | { readonly kind: 'none' }
  /** The mirror matches the version the server holds. It can be restored. */
  | { readonly kind: 'restorable'; readonly state: ComposerState }
  /** Somebody saved this draft elsewhere. The mirror is out of date. */
  | { readonly kind: 'superseded' };

/**
 * What to offer the person, given the stored copy and the server's version.
 *
 * Pure, so the sentence somebody reads and the state they would get back are
 * decided by the same code.
 */
export function restoreOfferFrom(
  mirror: DraftMirror | null,
  serverUpdatedAt: string | null,
): RestoreOffer {
  if (mirror === null || !mirror.dirty) {
    return { kind: 'none' };
  }
  // Two nulls means a draft that was never saved on either side, which is the
  // commonest restore of all: a post somebody started and never finished.
  return mirror.baseUpdatedAt === serverUpdatedAt
    ? { kind: 'restorable', state: mirror.state }
    : { kind: 'superseded' };
}
