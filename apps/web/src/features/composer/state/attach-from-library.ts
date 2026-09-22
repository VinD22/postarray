import { isUnsavedDraft, type ComposerBootstrap } from '../types';

/**
 * "Use in post" from the Library, and a file dropped on the app shell, both
 * land on `/compose?mediaId=...`. This attaches that asset to a new draft.
 *
 * It only ever touches a draft that has no row yet: a saved draft is somebody's
 * work and a URL parameter must not change it. The asset must be one this
 * project can already see, so a hand-edited link cannot attach a stranger's
 * file. Scan state is left alone: an asset still pending shows as pending in
 * the media strip and the preflight blocks publishing until it is clean.
 */
export function attachFromLibrary(
  bootstrap: ComposerBootstrap,
  mediaIds: readonly string[],
  assets: readonly { readonly id: string }[],
): ComposerBootstrap {
  if (mediaIds.length === 0 || !isUnsavedDraft(bootstrap.master)) {
    return bootstrap;
  }
  const known = new Set(assets.map((asset) => asset.id));
  const existing = new Set(bootstrap.master.mediaIds);
  const additions = [...new Set(mediaIds)].filter((id) => known.has(id) && !existing.has(id));
  if (additions.length === 0) {
    return bootstrap;
  }
  return {
    ...bootstrap,
    master: { ...bootstrap.master, mediaIds: [...bootstrap.master.mediaIds, ...additions] },
  };
}
