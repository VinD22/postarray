/**
 * Which read URL an `<img>` can actually show, for one asset kind.
 *
 * The endpoint returns three renditions and they are not interchangeable. Two
 * facts about what it serves today drive every rule below.
 *
 * `thumbnail` is null unless a thumbnail derivative has been produced, which
 * for most existing assets it has not, so `original` is the URL a caller
 * usually gets. That is fine for a picture: the tile sizes it down in CSS.
 *
 * `poster` is always null, because the derivative pipeline does not generate
 * video stills yet. So a video has no image to show and falls through to the
 * placeholder tile. It must never fall back to `original`, which is the video
 * file itself: an `<img>` pointed at an MP4 renders nothing, and having asked
 * the browser to download the whole video to render nothing is worse than
 * showing the tile that says there is no preview picture. The same holds for a
 * document or an audio file, whose originals are not images either.
 */

import type { MediaKind, MediaReadUrls } from '@relay/contracts';

export function displayableMediaUrl(
  kind: MediaKind,
  urls: MediaReadUrls | null | undefined,
): string | null {
  if (!urls) {
    return null;
  }
  if (kind === 'image' || kind === 'gif') {
    return urls.thumbnail?.url ?? urls.original?.url ?? null;
  }
  if (kind === 'video') {
    return urls.poster?.url ?? null;
  }
  // A document or an audio file only ever has a picture if something rendered
  // one for it. Its own bytes are not one.
  return urls.thumbnail?.url ?? null;
}
