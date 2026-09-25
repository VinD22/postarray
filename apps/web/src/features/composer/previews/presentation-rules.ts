/**
 * Per provider display constants.
 *
 * Two kinds of fact live here and the file keeps them apart on purpose.
 *
 * The first kind is provider behaviour: whether a platform renders a link
 * preview card, whether its post carries a title of its own, where it stops
 * showing text. Each of those carries the official documentation URL it came
 * from. **Anything we could not source is `null`, and `null` means the preview
 * does not pretend.** No entry here may be filled in from memory, from a
 * screenshot or from what a competitor's preview does.
 *
 * The second kind is our own layout: the width of the frame and how a grid of
 * attachments is tiled. Those are not claims about the platform, so they carry
 * no citation, and they are labelled as ours wherever they appear.
 *
 * A note on `collapse`. Every provider's entry is `null`. Instagram, X,
 * LinkedIn, Facebook and Threads all truncate long captions behind a "more"
 * control in their own clients, but none of them publishes the threshold in
 * developer or help documentation, and the observed values differ by surface,
 * by locale and by release. Writing a number here would be inventing provider
 * behaviour, which this repository does not do, so the preview shows the whole
 * body and says nothing about truncation. `collapseText` and the "See more"
 * control are already built and tested; the moment a threshold is sourced, one
 * value in this file turns them on.
 */

import type { ProviderId } from '@relay/contracts';

import type { PresentationRule } from './types';

/**
 * Frame widths in CSS pixels. Ours, not a provider fact.
 *
 * 360 is the narrow phone width the whole product is tested at. The desktop
 * numbers are a readable measure for the body text at our type scale, tuned
 * per shape: a feed column, a portrait video column, a tall pin column.
 */
const MOBILE_WIDTH = 360;
const FEED_DESKTOP_WIDTH = 560;
const PORTRAIT_DESKTOP_WIDTH = 380;

/**
 * What an unknown provider gets. No card, no title, no truncation: the three
 * safest answers, because each one only ever shows less than the platform will.
 */
export const DEFAULT_PRESENTATION: PresentationRule = {
  collapse: null,
  mediaGrid: 'aspect',
  linkCard: null,
  showsTitle: false,
  desktopWidth: FEED_DESKTOP_WIDTH,
  mobileWidth: MOBILE_WIDTH,
};

const PRESENTATION_RULES: Partial<Record<ProviderId, PresentationRule>> = {
  x: {
    collapse: null,
    mediaGrid: 'aspect',
    // Cards: a post whose body contains a URL renders a summary card built from
    // the destination's card markup.
    // https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards
    linkCard: 'large',
    // The create endpoint takes `text`; there is no separate title field.
    // https://docs.x.com/x-api/posts/creation-of-a-post
    showsTitle: false,
    desktopWidth: FEED_DESKTOP_WIDTH,
    mobileWidth: MOBILE_WIDTH,
  },

  instagram: {
    collapse: null,
    // Our layout. The snapshot's `media.aspectRatios` already carries the
    // ratios Instagram accepts, so the grid honours the file rather than
    // cropping it to a square the publish call would not apply.
    mediaGrid: 'aspect',
    // Captions are plain text: URLs in a caption are not linkified and no
    // preview card is produced.
    // https://developers.facebook.com/docs/instagram-platform/content-publishing
    linkCard: null,
    showsTitle: false,
    desktopWidth: PORTRAIT_DESKTOP_WIDTH,
    mobileWidth: MOBILE_WIDTH,
  },

  linkedin: {
    collapse: null,
    mediaGrid: 'aspect',
    // A share with an article URL carries the destination's title, description
    // and thumbnail.
    // https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
    linkCard: 'large',
    // The post body is `commentary`. The title in a share belongs to the
    // article being shared, not to the post, so the composer's own title field
    // is not shown here.
    // https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
    showsTitle: false,
    desktopWidth: FEED_DESKTOP_WIDTH,
    mobileWidth: MOBILE_WIDTH,
  },

  facebook: {
    collapse: null,
    mediaGrid: 'aspect',
    // A shared link is rendered from the destination's Open Graph markup.
    // https://developers.facebook.com/docs/sharing/webmasters/
    linkCard: 'large',
    showsTitle: false,
    desktopWidth: FEED_DESKTOP_WIDTH,
    mobileWidth: MOBILE_WIDTH,
  },

  threads: {
    collapse: null,
    mediaGrid: 'aspect',
    // A TEXT post takes a `link_attachment`, which the platform renders as a
    // preview of the destination.
    // https://developers.facebook.com/docs/threads/posts
    linkCard: 'compact',
    showsTitle: false,
    desktopWidth: FEED_DESKTOP_WIDTH,
    mobileWidth: MOBILE_WIDTH,
  },

  bluesky: {
    collapse: null,
    mediaGrid: 'aspect',
    // `app.bsky.embed.external` is the external link embed in the lexicon the
    // app renders from.
    // https://docs.bsky.app/docs/advanced-guides/posts
    linkCard: 'large',
    showsTitle: false,
    desktopWidth: FEED_DESKTOP_WIDTH,
    mobileWidth: MOBILE_WIDTH,
  },

  mastodon: {
    collapse: null,
    mediaGrid: 'aspect',
    // A status carries a `PreviewCard` for the first link it contains.
    // https://docs.joinmastodon.org/entities/PreviewCard/
    linkCard: 'large',
    showsTitle: false,
    desktopWidth: FEED_DESKTOP_WIDTH,
    mobileWidth: MOBILE_WIDTH,
  },

  tiktok: {
    collapse: null,
    // One video per post, so there is no grid to shape. Ours.
    mediaGrid: 'stacked',
    // The post is a video with a caption. Nothing in the publishing
    // documentation produces a link preview.
    // https://developers.tiktok.com/doc/content-posting-api-get-started
    linkCard: null,
    // The caption is the only text field.
    // https://developers.tiktok.com/doc/content-posting-api-reference-direct-post
    showsTitle: false,
    desktopWidth: PORTRAIT_DESKTOP_WIDTH,
    mobileWidth: MOBILE_WIDTH,
  },

  youtube: {
    collapse: null,
    mediaGrid: 'stacked',
    linkCard: null,
    // `snippet.title` is a required, separate field on a video.
    // https://developers.google.com/youtube/v3/docs/videos
    showsTitle: true,
    desktopWidth: FEED_DESKTOP_WIDTH,
    mobileWidth: MOBILE_WIDTH,
  },

  pinterest: {
    collapse: null,
    // A Pin is a single tall image. Ours.
    mediaGrid: 'stacked',
    // The Pin's own `link` is the destination; the platform does not render a
    // second preview card inside the Pin.
    // https://developers.pinterest.com/docs/api/v5/pins-create/
    linkCard: null,
    // A Pin carries `title` alongside `description`.
    // https://developers.pinterest.com/docs/api/v5/pins-create/
    showsTitle: true,
    desktopWidth: PORTRAIT_DESKTOP_WIDTH,
    mobileWidth: MOBILE_WIDTH,
  },
};

export function presentationFor(provider: ProviderId): PresentationRule {
  return PRESENTATION_RULES[provider] ?? DEFAULT_PRESENTATION;
}

/** Every provider this file carries a sourced rule for. Used by its test. */
export function providersWithPresentationRules(): readonly ProviderId[] {
  return Object.keys(PRESENTATION_RULES) as ProviderId[];
}
