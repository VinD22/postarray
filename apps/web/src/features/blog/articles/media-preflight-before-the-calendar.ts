import {
  PUBLISHING_LIMITS,
  PUBLISHING_LIMIT_PROVIDERS,
} from '@/features/marketing/data/publishing-limits';
import type { PublishingLimitProvider } from '@/features/marketing/data/publishing-limits-types';
import { ROUTES } from '@/features/marketing/site';

import { EDITORIAL_DESK, PLATFORM_DESK } from '../bylines';
import type { BlogArticle, BlogSource } from '../types';

/**
 * Content module. English only, loaded per slug.
 *
 * Every number in this article is read from the generated publishing-limits
 * dataset rather than typed into the prose, and the sources list is built from
 * that dataset's own citations. The dataset is regenerated from the connector
 * registry, so a limit that changes upstream changes this article too, and a
 * platform with no adapter renders as unavailable rather than as a zero. That
 * is the whole reason to write a numbers article this way: prose goes stale
 * silently, generated tables do not.
 */

/** Display names, because brand casing is not derivable from an identifier. */
const PLATFORM_NAME: Readonly<Record<string, string>> = {
  x: 'X',
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  pinterest: 'Pinterest',
  bluesky: 'Bluesky',
  threads: 'Threads',
  google_business_profile: 'Google Business Profile',
};

const SOURCE_TITLE: Readonly<Record<string, string>> = {
  x: 'Create a post, X API',
  instagram: 'Instagram Platform content publishing',
  facebook: 'Pages API posts, Meta for Developers',
  linkedin: 'Posts API, LinkedIn community management',
  tiktok: 'Content Posting API, TikTok for Developers',
  youtube: 'Videos insert, YouTube Data API',
  pinterest: 'Pinterest API version 5 reference',
  bluesky: 'Posts, Bluesky documentation',
  threads: 'Threads API documentation, published by Meta',
};

const UNAVAILABLE = 'Unavailable. No adapter in this build, so no number is recorded.';

function nameOf(provider: PublishingLimitProvider): string {
  return PLATFORM_NAME[provider] ?? provider;
}

function countingUnit(provider: PublishingLimitProvider): string {
  const unit = PUBLISHING_LIMITS[provider].countingUnit;
  if (unit === null) return 'Unavailable';
  if (unit === 'grapheme') return 'Graphemes, which is what a person means by characters';
  if (unit === 'utf16') return 'UTF-16 code units, so some emoji cost two';
  return 'A weighted scheme where most non Latin code points cost two';
}

function bodyLimit(provider: PublishingLimitProvider): string {
  const limits = PUBLISHING_LIMITS[provider];
  if (limits.text === null) return UNAVAILABLE;
  const title =
    limits.maxTitleLength === null
      ? ''
      : `, plus a separate title field of ${String(limits.maxTitleLength)}`;
  return `${String(limits.text.maxLength)} characters${title}`;
}

function megabytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${String(Math.round(mb / 1024))} GB` : `${String(Math.round(mb))} MB`;
}

function imageCeiling(provider: PublishingLimitProvider): string {
  const media = PUBLISHING_LIMITS[provider].media;
  if (media === null) return UNAVAILABLE;
  if (media.maxImages === 0) return 'None recorded. This destination takes video, not images';
  const size =
    media.maxImageBytes === null
      ? 'no recorded size ceiling'
      : `${megabytes(media.maxImageBytes)} each`;
  return `${String(media.maxImages)} per post, ${size}`;
}

function videoCeiling(provider: PublishingLimitProvider): string {
  const media = PUBLISHING_LIMITS[provider].media;
  if (media === null) return UNAVAILABLE;
  if (media.maxVideos === 0 || media.maxVideoBytes === null) return 'No recorded video ceiling';
  const duration =
    media.maxDurationSeconds === null
      ? 'no recorded duration ceiling'
      : media.maxDurationSeconds % 60 === 0
        ? `up to ${String(media.maxDurationSeconds / 60)} minutes`
        : `up to ${String(media.maxDurationSeconds)} seconds`;
  return `${megabytes(media.maxVideoBytes)}, ${duration}`;
}

function altTextNote(provider: PublishingLimitProvider): string {
  const media = PUBLISHING_LIMITS[provider].media;
  if (media === null) return UNAVAILABLE;
  return media.maxAltTextLength === null
    ? 'No alt text ceiling recorded, so put the meaning in the visible caption'
    : `${String(media.maxAltTextLength)} characters of alt text recorded`;
}

const TEXT_ROWS: readonly (readonly string[])[] = PUBLISHING_LIMIT_PROVIDERS.map((provider) => [
  nameOf(provider),
  bodyLimit(provider),
  countingUnit(provider),
]);

const MEDIA_ROWS: readonly (readonly string[])[] = PUBLISHING_LIMIT_PROVIDERS.map((provider) => [
  nameOf(provider),
  imageCeiling(provider),
  videoCeiling(provider),
  altTextNote(provider),
]);

/** Built from the dataset's own citations, so a moved document cannot be missed. */
const SOURCES: readonly BlogSource[] = PUBLISHING_LIMIT_PROVIDERS.flatMap((provider) => {
  const source = PUBLISHING_LIMITS[provider].source;
  if (source === null) return [];
  return [
    {
      title: SOURCE_TITLE[provider] ?? `${nameOf(provider)} publishing documentation`,
      url: source.url,
      readOn: source.readOn,
    },
  ];
});

export const mediaPreflightBeforeTheCalendar: BlogArticle = {
  slug: 'media-preflight-before-the-calendar',
  title: 'Check the media against the platform before you fill the calendar',
  description:
    'The limits that decide whether a piece can exist at all are published, and they disagree across platforms. Check them while the work is still cheap to change.',
  cluster: 'adaptation',
  author: EDITORIAL_DESK,
  reviewer: PLATFORM_DESK,
  published: '2026-08-10',
  updated: '2026-08-10',
  sources: SOURCES,
  blocks: [
    {
      kind: 'paragraph',
      text: 'The expensive way to discover a platform limit is at publication time, when the work is finished, the slot is booked and the only available fix is to cut something. The cheap way is to check the limits while the piece is still an outline, because they are published, they are specific, and they disagree with each other in ways no general rule can absorb.',
    },
    {
      kind: 'paragraph',
      text: 'The tables below are generated from the dataset this site keeps for the launch cohort, which is itself derived from the connector registry. That means these numbers cannot quietly drift away from the ones the product uses, and a platform with no adapter shows as unavailable rather than as a zero.',
    },

    {
      kind: 'heading',
      id: 'text',
      text: 'Length is not one number, and characters are not one thing',
    },
    {
      kind: 'table',
      caption: 'Body ceilings and how each platform counts them, as recorded in the dataset',
      columns: ['Platform', 'Body ceiling as recorded', 'How characters are counted'],
      rows: TEXT_ROWS,
    },
    {
      kind: 'paragraph',
      text: 'The third column is the one that surprises people. A caption that fits by one measure can overflow by another, because a family emoji, an accented character and a Japanese sentence are counted differently depending on which unit the platform chose. A preflight that counts with the wrong unit is a preflight that passes work the platform will refuse.',
    },
    {
      kind: 'callout',
      title: 'Links are charged differently too',
      body: 'Some platforms rewrite every link to a fixed width whatever the original length, so a long tracking URL costs the same as a short one. Others charge the characters the URL actually occupies. That single difference decides whether a piece of writing fits.',
    },

    { kind: 'heading', id: 'media', text: 'Media ceilings decide the shape before anybody writes' },
    {
      kind: 'table',
      caption: 'Media ceilings as recorded in the dataset',
      columns: ['Platform', 'Images', 'Video', 'Alt text'],
      rows: MEDIA_ROWS,
    },
    {
      kind: 'paragraph',
      text: 'Read that table as a planning constraint rather than as an export setting. A destination with no images is not a place a carousel can be adapted into. A destination with no recorded alt text ceiling is a place where meaning carried by words inside a picture has to move into the visible caption, or it is lost to anybody using a screen reader.',
    },

    { kind: 'heading', id: 'preflight', text: 'A preflight that is worth running' },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Decide the shape per destination first: text, image with caption, several images, video, or a link. Everything else follows from that.',
        'Count the body with the unit the destination actually uses, and count the link the way that destination charges for it.',
        'Check the file against the recorded size and duration ceilings before rendering the final version, not after.',
        'Write the alt text where the destination has a field for it, and move the meaning into the caption where it does not.',
        'Record the date you checked each limit. A number without a date is a rumour.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Steps one and two remove most publication time failures on their own. Step five is what keeps the whole sheet honest a year later, when the platform has quietly changed a ceiling and nobody noticed because the old number still looked authoritative.',
    },

    { kind: 'heading', id: 'processing', text: 'Accepted is not the same as ready' },
    {
      kind: 'paragraph',
      text: 'Video adds a state that text never has. Several platforms accept an upload, take it away to process, and only then make it publishable, so a queue that treats an accepted upload as a finished post will publish nothing at the moment it promised.',
    },
    {
      kind: 'paragraph',
      text: 'Plan the processing window into the schedule rather than into the retry logic. A video that has to be live at nine should be uploaded long enough before nine that a slow encode is an inconvenience rather than a missed slot.',
    },
    {
      kind: 'callout',
      title: 'Every number here carries a date',
      body: 'The dataset behind these tables records the official document each limit came from and the day a person read it. When a number here disagrees with the platform, the platform is right and this page is stale, which is exactly why the date is printed rather than hidden.',
    },
    {
      kind: 'cta',
      label: 'See the full limits and the sources per platform',
      href: ROUTES.schedule,
    },
  ],
};
