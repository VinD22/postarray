import type { CapabilitySnapshot } from '@relay/contracts';

import {
  MEGABYTE,
  NO_PRIVACY_CHOICE,
  RELAY_SIDE_SCHEDULING,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../shared/capability.js';
import type { ProviderConnection } from '../shared/contract-shape.js';
import { normalizedNames } from '../shared/metrics.js';
import { capabilityVersion } from '../shared/verification.js';
import { BLUESKY_ACCOUNT_METRICS, BLUESKY_POST_METRICS } from './metrics.js';

/**
 * Bluesky capability snapshot.
 *
 * Planning baseline captured 4 August 2026; re-verify before implementation, and pin the
 * official documentation URL in the source register when the connector starts.
 *
 * The one opinionated rule: **accessible alt text is a strong community norm on Bluesky and
 * our composer requires it by default**, with an explicit waive action rather than a silent
 * omission. That is encoded in `BLUESKY_REQUIRE_ALT_TEXT` and enforced in validation.
 */

export const BLUESKY_CAPABILITY_REVISION = 1;
/** Bluesky counts 300 graphemes, with a 3000 byte ceiling underneath it. */
export const BLUESKY_MAX_GRAPHEMES = 300;
export const BLUESKY_MAX_BYTES = 3000;
export const BLUESKY_MAX_IMAGES = 4;
export const BLUESKY_MAX_THREAD_PARTS = 25;
export const BLUESKY_MAX_ALT_TEXT = 2000;
/** Alt text is required by our composer for Bluesky targets. */
export const BLUESKY_REQUIRE_ALT_TEXT = true;

/**
 * Bluesky's documented create budget is 5000 points per hour and a create costs 3 points.
 * Expressed as creates per hour so the connection panel can show a real number.
 */
export const BLUESKY_HOURLY_POINTS = 5000;
export const BLUESKY_CREATE_POINT_COST = 3;
export const BLUESKY_CREATES_PER_HOUR = Math.floor(
  BLUESKY_HOURLY_POINTS / BLUESKY_CREATE_POINT_COST,
);

export interface BlueskyCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
}

export function buildBlueskyCapabilities(input: BlueskyCapabilityInput): CapabilitySnapshot {
  return buildSnapshot({
    capabilityVersion: capabilityVersion('bluesky', BLUESKY_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'bluesky',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: BLUESKY_MAX_GRAPHEMES,
      minLength: 0,
      supportsMarkdown: false,
      // A link costs its own characters. Bluesky does not shorten it; it facets it.
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: BLUESKY_MAX_IMAGES,
      maxVideos: 1,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
      maxBytesByKind: mediaBytes({
        image: 1 * MEGABYTE,
        gif: 1 * MEGABYTE,
        video: 50 * MEGABYTE,
      }),
      aspectRatios: { min: 0.1, max: 10, recommended: [1.91, 1, 4 / 5] },
      maxDurationSeconds: 180,
      minDurationSeconds: 1,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: BLUESKY_MAX_ALT_TEXT,
    },
    contentKinds: contentKinds({
      text: 'supported',
      image: 'supported',
      video: 'supported',
      // Replies are how a thread is built on the AT Protocol.
      thread: 'supported',
      // Several images are one image embed, not a swipeable carousel product.
      carousel: 'unsupported',
      short_video: 'unsupported',
      long_video: 'unsupported',
      document: 'unsupported',
    }),
    destinations: [{ kind: 'none', support: 'unsupported', searchable: false }],
    mentions: {
      // A Bluesky mention facet carries a DID, which is a real, immutable entity id.
      support: 'supported',
      resolvesToExternalId: true,
      maxMentions: null,
    },
    firstComment: { support: 'supported', maxItems: 1, minDelaySeconds: 0 },
    threads: {
      support: 'supported',
      maxItems: BLUESKY_MAX_THREAD_PARTS,
      minDelaySeconds: 0,
    },
    scheduling: RELAY_SIDE_SCHEDULING,
    // A Bluesky post is public. There is no per post audience selector.
    privacy: NO_PRIVACY_CHOICE,
    disclosure: {
      aiLabel: 'unsupported',
      commercialContent: 'unsupported',
      brandedContent: 'unsupported',
    },
    analytics: {
      // These are public engagement counts read from the post thread view, not
      // platform-reported insights, and the UI labels them as such.
      support: 'supported',
      postMetrics: normalizedNames(BLUESKY_POST_METRICS),
      accountMetrics: normalizedNames(BLUESKY_ACCOUNT_METRICS),
      historyWindowDays: null,
    },
    deletion: { support: 'supported', windowSeconds: null },
    drafts: { support: 'unsupported' },
    rateLimit: { windowSeconds: 3600, maxRequests: BLUESKY_CREATES_PER_HOUR },
    cost: null,
  });
}
