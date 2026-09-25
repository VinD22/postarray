import { describe, expect, it } from 'vitest';

import { SEED_BOOTSTRAP } from './seed';
import { attachFromLibrary } from './attach-from-library';
import { UNSAVED_DRAFT_ID, type ComposerBootstrap } from '../types';

const NEW_DRAFT: ComposerBootstrap = {
  ...SEED_BOOTSTRAP,
  master: { ...SEED_BOOTSTRAP.master, id: UNSAVED_DRAFT_ID, mediaIds: [] },
};

describe('attachFromLibrary', () => {
  it('attaches a known asset to a new draft', () => {
    const next = attachFromLibrary(NEW_DRAFT, ['media_a'], [{ id: 'media_a' }]);
    expect(next.master.mediaIds).toEqual(['media_a']);
  });

  it('ignores an asset this project cannot see', () => {
    const next = attachFromLibrary(NEW_DRAFT, ['media_other'], [{ id: 'media_a' }]);
    expect(next).toBe(NEW_DRAFT);
  });

  it('never changes a draft that is already saved', () => {
    const next = attachFromLibrary(SEED_BOOTSTRAP, ['media_a'], [{ id: 'media_a' }]);
    expect(next).toBe(SEED_BOOTSTRAP);
  });

  it('does not attach the same asset twice', () => {
    const once = attachFromLibrary(NEW_DRAFT, ['media_a', 'media_a'], [{ id: 'media_a' }]);
    expect(attachFromLibrary(once, ['media_a'], [{ id: 'media_a' }]).master.mediaIds).toEqual([
      'media_a',
    ]);
  });
});
