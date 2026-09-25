import { z } from 'zod';

import { ID_PREFIXES, idSchema } from './ids';
import { isoInstantSchema } from './primitives';

/**
 * Signed, short lived URLs a browser may read media bytes from.
 *
 * Nothing else in the API says where an asset's bytes live, which is why the
 * composer and the library rendered grey rectangles instead of pictures.
 * `GET /v1/media/{id}/read-urls` serves this shape.
 *
 * Every URL is nullable and carries its own expiry. A null derivative means
 * the file has no rendition of that kind, which is a different fact from the
 * asset being unavailable: `MediaAssetView.storageAvailable` already says
 * that. A caller must never treat a null thumbnail as an error.
 */
export const mediaReadUrlSchema = z
  .object({
    url: z.string().url(),
    width: z.number().int().positive().nullable(),
    height: z.number().int().positive().nullable(),
    /** After this instant the URL stops working. Refresh before it, not after. */
    expiresAt: isoInstantSchema,
  })
  .strict();
export type MediaReadUrl = z.infer<typeof mediaReadUrlSchema>;

export const mediaReadUrlsSchema = z
  .object({
    mediaId: idSchema(ID_PREFIXES.media),
    /** A small rendition for grids and strips. */
    thumbnail: mediaReadUrlSchema.nullable(),
    /** The still frame for a video or an animated image. */
    poster: mediaReadUrlSchema.nullable(),
    /** The stored file itself. Null when the caller may not read it whole. */
    original: mediaReadUrlSchema.nullable(),
  })
  .strict();
export type MediaReadUrls = z.infer<typeof mediaReadUrlsSchema>;

/**
 * How long a set of read URLs may be treated as fresh.
 *
 * A minute of headroom, so a request that starts just inside the window still
 * finishes with a URL the storage layer accepts. Never negative.
 */
export const MEDIA_READ_URL_REFRESH_MARGIN_MS = 60_000;

/**
 * How long a signed read URL stays valid.
 *
 * Long enough to render a page and scroll it, short enough that a leaked link
 * is not a permanently public file.
 */
export const MEDIA_READ_URL_TTL_SECONDS = 15 * 60;

export function mediaReadUrlsStaleTimeMs(urls: MediaReadUrls, nowMs: number): number {
  const expiries = [urls.thumbnail, urls.poster, urls.original]
    .filter((entry): entry is MediaReadUrl => entry !== null)
    .map((entry) => Date.parse(entry.expiresAt));
  if (expiries.length === 0) {
    return 0;
  }
  const soonest = Math.min(...expiries);
  return Math.max(soonest - nowMs - MEDIA_READ_URL_REFRESH_MARGIN_MS, 0);
}
