import type { ProviderId } from '@relay/contracts';
import type { MessageKey } from '@relay/i18n/translate';

/**
 * Pixel dimensions for platform image surfaces, maintained by hand.
 *
 * READ THIS BEFORE ADDING A ROW.
 *
 * This file is NOT generated. `publishing-limits.ts` next to it is: a
 * generator in `@relay/connectors` writes it from connector capability code,
 * so nobody types a number into it and nobody can. That dataset carries byte
 * caps, durations, counts, alt text ceilings and MIME lists, and it carries no
 * pixel dimensions at all, because the publishing APIs those connectors talk to
 * do not express one. A person asking how wide a reel cover should be is asking
 * a question the generated dataset cannot answer.
 *
 * So this one is hand maintained, and it pays for that with a stricter
 * contract than the generated file needs:
 *
 *  - Every row records the exact official page the numbers came from and the
 *    ISO date that page was last opened and the numbers read off it.
 *
 *    The first batch of rows was read and then independently re-read against
 *    the live sources during the change that introduced this file, both times
 *    by an agent rather than by a named person. The figures were confirmed
 *    against the cited pages, so they are accurate as of that date, but a
 *    human has not yet signed them off. Treat that sign-off as outstanding
 *    before these pages are promoted, and note that every row in the first
 *    batch carries the same date and so will fall due together.
 *  - A row without both of those may not exist. `media-dimensions.test.ts`
 *    fails the build rather than letting one through, and it also fails a row
 *    whose reading is older than `MEDIA_DIMENSION_STALE_AFTER_DAYS`, so the
 *    drift is visible in CI instead of rotting quietly on a reference page.
 *  - Only figures the source states in its own words. Not a figure computed
 *    from another figure, not a figure from a marketing blog, an agency
 *    roundup or a competitor's size chart, and never a figure from memory. If
 *    a platform does not publish a pixel size for a surface, this file has no
 *    row for it and the site has no page for it. That is the intended outcome,
 *    not a gap to fill.
 *  - `aspectRatio` is the ratio the source itself prints. It is `null` when the
 *    source gives pixels and no ratio. Missing is `null`, never a guess and
 *    never a zero.
 *  - `basis` says what kind of number this is, because the platforms do not
 *    agree. A minimum, a maximum, a recommendation, a rendered size and a safe
 *    area are five different claims, and flattening them into one column would
 *    put words in a platform's mouth.
 *
 * To add a row: open the platform's own help centre or developer
 * documentation, find the sentence that states the pixels, copy the numbers and
 * the page title, set `readOn` to today, and add the variant's label to the
 * `web.specs.dimensions.variant.*` catalog slice if it is a new one. If you
 * cannot find that sentence, you are done: there is no row to add.
 *
 * To refresh a row: reopen the same page. If the numbers still match, move
 * `readOn` forward. If they changed, change them here too. If the page is gone,
 * delete the row.
 */

/** The kinds of surface a dimension can belong to. */
export const MEDIA_SURFACES = [
  'feed-image',
  'reel-cover',
  'video-thumbnail',
  'banner',
  'banner-safe-area',
  'profile-picture',
  'video-watermark',
] as const;

export type MediaSurface = (typeof MEDIA_SURFACES)[number];

/**
 * What kind of claim the numbers are.
 *
 * `rendered` is the size the platform says it displays the image at, which is
 * not advice about what to upload. `safe-area` is the region inside a larger
 * image that is never cropped.
 */
export const DIMENSION_BASES = [
  'minimum',
  'maximum',
  'recommended',
  'rendered',
  'safe-area',
] as const;

export type DimensionBasis = (typeof DIMENSION_BASES)[number];

/**
 * The named surface variants, which is what a reader actually searches for.
 *
 * A variant is the platform's own name for the slot, generalized just enough
 * to be shared where two platforms genuinely mean the same thing. No variant
 * name carries a platform name: the platform is a separate field, and the
 * label copy for a variant lives in the catalog like every other string.
 */
export const DIMENSION_VARIANTS = [
  'feedPhotoTallest',
  'feedPhotoWidest',
  'reelCover',
  'videoThumbnail',
  'channelBanner',
  'channelBannerSafeArea',
  'serverBanner',
  'headerImage',
  'pageCoverPhoto',
  'profilePicture',
  'videoWatermark',
] as const;

export type DimensionVariant = (typeof DIMENSION_VARIANTS)[number];

/** The official page a row was read from, with the day it was read. */
export interface DimensionSource {
  /** The document's own title. Never a summary of what we wish it said. */
  readonly title: string;
  /** Official platform documentation. Never a blog post or a size roundup. */
  readonly url: string;
  /** ISO calendar date that page was opened and these numbers read off it. */
  readonly readOn: string;
}

export interface MediaDimensionRow {
  readonly platform: ProviderId;
  readonly surface: MediaSurface;
  readonly variant: DimensionVariant;
  readonly width: number;
  readonly height: number;
  /** As printed by the source. `null` when the source states no ratio. */
  readonly aspectRatio: string | null;
  readonly basis: DimensionBasis;
  readonly source: DimensionSource;
}

/**
 * How long a reading stays fresh before the test starts complaining.
 *
 * Six months. Platforms redesign these surfaces without announcing it, and a
 * pixel size nobody has rechecked since last year is a claim this site should
 * not be making with a straight face.
 */
export const MEDIA_DIMENSION_STALE_AFTER_DAYS = 180;

/** The catalog key naming one variant. */
export function variantLabelKey(variant: DimensionVariant): MessageKey {
  return `web.specs.dimensions.variant.${variant}` as MessageKey;
}

/** The catalog key naming one basis. */
export function basisLabelKey(basis: DimensionBasis): MessageKey {
  const camel = basis.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase());
  return `web.specs.dimensions.basis.${camel}` as MessageKey;
}

/**
 * Every sourced row.
 *
 * Grouped by platform for reading, but nothing depends on the order: the
 * registry sorts what it renders.
 */
export const MEDIA_DIMENSIONS: readonly MediaDimensionRow[] = [
  /* Instagram --------------------------------------------------------- */
  {
    platform: 'instagram',
    surface: 'feed-image',
    variant: 'feedPhotoTallest',
    width: 1080,
    height: 1440,
    aspectRatio: '3:4',
    basis: 'maximum',
    source: {
      title: 'Image resolution of photos you share on Instagram',
      url: 'https://help.instagram.com/1631821640426723',
      readOn: '2026-08-22',
    },
  },
  {
    platform: 'instagram',
    surface: 'feed-image',
    variant: 'feedPhotoWidest',
    width: 1080,
    height: 566,
    aspectRatio: '1.91:1',
    basis: 'maximum',
    source: {
      title: 'Image resolution of photos you share on Instagram',
      url: 'https://help.instagram.com/1631821640426723',
      readOn: '2026-08-22',
    },
  },
  {
    platform: 'instagram',
    surface: 'reel-cover',
    variant: 'reelCover',
    width: 420,
    height: 654,
    aspectRatio: '1:1.55',
    basis: 'recommended',
    source: {
      title: 'Reel size and aspect ratios on Instagram',
      url: 'https://help.instagram.com/1038071743007909',
      readOn: '2026-08-22',
    },
  },

  /* YouTube ----------------------------------------------------------- */
  {
    platform: 'youtube',
    surface: 'video-thumbnail',
    variant: 'videoThumbnail',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    basis: 'recommended',
    source: {
      title: 'Add custom thumbnails on YouTube',
      url: 'https://support.google.com/youtube/answer/72431?hl=en',
      readOn: '2026-08-22',
    },
  },
  {
    platform: 'youtube',
    surface: 'banner',
    variant: 'channelBanner',
    width: 2048,
    height: 1152,
    aspectRatio: '16:9',
    basis: 'minimum',
    source: {
      title: 'Manage your channel branding',
      url: 'https://support.google.com/youtube/answer/10456525?hl=en',
      readOn: '2026-08-22',
    },
  },
  {
    platform: 'youtube',
    surface: 'banner-safe-area',
    variant: 'channelBannerSafeArea',
    width: 1235,
    height: 338,
    aspectRatio: null,
    basis: 'safe-area',
    source: {
      title: 'Manage your channel branding',
      url: 'https://support.google.com/youtube/answer/10456525?hl=en',
      readOn: '2026-08-22',
    },
  },
  {
    platform: 'youtube',
    surface: 'profile-picture',
    variant: 'profilePicture',
    width: 98,
    height: 98,
    aspectRatio: null,
    basis: 'rendered',
    source: {
      title: 'Manage your channel branding',
      url: 'https://support.google.com/youtube/answer/10456525?hl=en',
      readOn: '2026-08-22',
    },
  },
  {
    platform: 'youtube',
    surface: 'video-watermark',
    variant: 'videoWatermark',
    width: 150,
    height: 150,
    aspectRatio: null,
    basis: 'minimum',
    source: {
      title: 'Manage your channel branding',
      url: 'https://support.google.com/youtube/answer/10456525?hl=en',
      readOn: '2026-08-22',
    },
  },

  /* X ----------------------------------------------------------------- */
  {
    platform: 'x',
    surface: 'profile-picture',
    variant: 'profilePicture',
    width: 400,
    height: 400,
    aspectRatio: null,
    basis: 'recommended',
    source: {
      title: 'Help with uploading a profile photo',
      url: 'https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo',
      readOn: '2026-08-22',
    },
  },
  {
    platform: 'x',
    surface: 'banner',
    variant: 'headerImage',
    width: 1500,
    height: 500,
    aspectRatio: null,
    basis: 'recommended',
    source: {
      title: 'Help with uploading a profile photo',
      url: 'https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo',
      readOn: '2026-08-22',
    },
  },

  /* Facebook ---------------------------------------------------------- */
  {
    platform: 'facebook',
    surface: 'profile-picture',
    variant: 'profilePicture',
    width: 320,
    height: 320,
    aspectRatio: null,
    basis: 'recommended',
    source: {
      title: 'Facebook Page profile picture and cover photo dimensions',
      url: 'https://www.facebook.com/help/125379114252045',
      readOn: '2026-08-22',
    },
  },
  {
    platform: 'facebook',
    surface: 'banner',
    variant: 'pageCoverPhoto',
    width: 851,
    height: 315,
    aspectRatio: null,
    basis: 'recommended',
    source: {
      title: 'Facebook Page profile picture and cover photo dimensions',
      url: 'https://www.facebook.com/help/125379114252045',
      readOn: '2026-08-22',
    },
  },

  /* Discord ----------------------------------------------------------- */
  {
    platform: 'discord',
    surface: 'banner',
    variant: 'serverBanner',
    width: 960,
    height: 540,
    aspectRatio: '16:9',
    basis: 'minimum',
    source: {
      title: 'Server Banners',
      url: 'https://support.discord.com/hc/en-us/articles/360028716472-Server-Banners',
      readOn: '2026-08-22',
    },
  },
];

/** The platforms that have at least one sourced row, in dataset order. */
export const MEDIA_DIMENSION_PLATFORMS: readonly ProviderId[] = [
  ...new Set(MEDIA_DIMENSIONS.map((row) => row.platform)),
];

/** Every row recorded for one platform. Empty when nothing is recorded. */
export function dimensionsForPlatform(platform: ProviderId): readonly MediaDimensionRow[] {
  return MEDIA_DIMENSIONS.filter((row) => row.platform === platform);
}

/**
 * A row's dimensions as a plain `1080 x 1440` string.
 *
 * Formatted here rather than in a component so the page, the metadata and the
 * structured data cannot print the same row three different ways.
 */
export function formatPixels(row: MediaDimensionRow): string {
  return `${row.width.toLocaleString('en-US')} x ${row.height.toLocaleString('en-US')}`;
}

/** Days between an ISO calendar date and `now`, floored. Negative if future. */
export function daysSince(isoDate: string, now: Date): number {
  const read = Date.parse(`${isoDate}T00:00:00Z`);
  return Math.floor((now.getTime() - read) / 86_400_000);
}

/** The rows whose reading is older than the staleness window. */
export function staleDimensionRows(
  now: Date,
  windowDays: number = MEDIA_DIMENSION_STALE_AFTER_DAYS,
): readonly MediaDimensionRow[] {
  return MEDIA_DIMENSIONS.filter((row) => daysSince(row.source.readOn, now) > windowDays);
}
