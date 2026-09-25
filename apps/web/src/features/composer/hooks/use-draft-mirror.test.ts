import { describe, expect, it } from 'vitest';

import { SEED_BOOTSTRAP } from '../state/seed';
import { initialComposerState } from '../state/seed';
import { draftMirrorKey, restoreOfferFrom, type DraftMirror } from './use-draft-mirror';

/**
 * The rule this holds is the one that decides whether somebody's own words
 * come back or somebody else's work is quietly undone: a copy is only offered
 * while the server still holds the version it was taken from.
 */

function mirror(overrides: Partial<DraftMirror> = {}): DraftMirror {
  return {
    version: 1,
    contentItemId: 'content_01',
    baseUpdatedAt: '2026-09-02T10:00:00.000Z',
    dirty: true,
    state: initialComposerState(SEED_BOOTSTRAP),
    ...overrides,
  };
}

describe('draftMirrorKey', () => {
  it('keys a saved draft by workspace and draft', () => {
    expect(draftMirrorKey('ws_01', 'content_01')).toBe('pa:draft:ws_01:content_01');
  });

  it('gives a draft with no server row a key of its own rather than a blank one', () => {
    expect(draftMirrorKey('ws_01', '')).toBe('pa:draft:ws_01:new');
    expect(draftMirrorKey('ws_01', null)).toBe('pa:draft:ws_01:new');
  });
});

describe('restoreOfferFrom', () => {
  it('offers the copy when the server still holds the version it came from', () => {
    const offer = restoreOfferFrom(mirror(), '2026-09-02T10:00:00.000Z');

    expect(offer.kind).toBe('restorable');
  });

  it('refuses to restore over a draft that was saved somewhere else since', () => {
    const offer = restoreOfferFrom(mirror(), '2026-09-02T11:30:00.000Z');

    expect(offer.kind).toBe('superseded');
  });

  it('offers a draft that was never saved on either side, which is the common case', () => {
    const offer = restoreOfferFrom(mirror({ baseUpdatedAt: null, contentItemId: null }), null);

    expect(offer.kind).toBe('restorable');
  });

  it('says nothing when the copy is clean or missing', () => {
    expect(restoreOfferFrom(null, null).kind).toBe('none');
    expect(restoreOfferFrom(mirror({ dirty: false }), null).kind).toBe('none');
  });
});
