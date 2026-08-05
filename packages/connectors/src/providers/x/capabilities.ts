import type { CapabilitySnapshot } from '@relay/contracts';

import {
  MEGABYTE,
  NO_PRIVACY_CHOICE,
  RELAY_SIDE_SCHEDULING,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../shared/capability';
import type { ProviderConnection } from '../shared/contract-shape';
import { normalizedNames } from '../shared/metrics';
import { capabilityVersion } from '../shared/verification';
import { X_ACCOUNT_METRICS, X_POST_METRICS } from './metrics';
import { X_SNAPSHOT_COST } from './cost';

/**
 * X capability snapshot.
 *
 * Planning baseline captured 4 August 2026 from the X API documentation listed in
 * `README.md`. Re-verify before implementation. At runtime the snapshot is the only source
 * of truth and no adapter or component may hard code any of these numbers.
 */

export const X_CAPABILITY_REVISION = 1;
export const X_MAX_TEXT_LENGTH = 280;
/** X rewrites every link to a t.co URL of a fixed width, so links cost a flat amount. */
export const X_CHARACTERS_PER_LINK = 23;
export const X_MAX_IMAGES = 4;
export const X_MAX_THREAD_PARTS = 25;
export const X_MAX_ALT_TEXT = 1000;

/** The scopes we request. `media.write` is only requested because we upload media. */
export const X_SCOPES = [
  'tweet.read',
  'tweet.write',
  'users.read',
  'media.write',
  'offline.access',
] as const;

export interface XCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
  /** Scopes the grant actually carries, which may be narrower than what we requested. */
  readonly grantedScopes: readonly string[];
}

function support(granted: readonly string[], scope: string): boolean {
  return granted.includes(scope);
}

export function buildXCapabilities(input: XCapabilityInput): CapabilitySnapshot {
  const canWrite = support(input.grantedScopes, 'tweet.write');
  const canRead = support(input.grantedScopes, 'tweet.read');
  const canUploadMedia = support(input.grantedScopes, 'media.write');

  const writeState = canWrite ? 'supported' : 'requires_review';
  const mediaState = canWrite && canUploadMedia ? 'supported' : 'requires_review';

  return buildSnapshot({
    capabilityVersion: capabilityVersion('x', X_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'x',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: X_MAX_TEXT_LENGTH,
      minLength: 0,
      supportsMarkdown: false,
      linkCounting: { mode: 'fixed', charactersPerLink: X_CHARACTERS_PER_LINK },
    },
    media: {
      maxImages: X_MAX_IMAGES,
      maxVideos: 1,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
      maxBytesByKind: mediaBytes({
        image: 5 * MEGABYTE,
        gif: 15 * MEGABYTE,
        video: 512 * MEGABYTE,
      }),
      aspectRatios: { min: 1 / 3, max: 3, recommended: [16 / 9, 1, 4 / 5] },
      maxDurationSeconds: 140,
      minDurationSeconds: 1,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: X_MAX_ALT_TEXT,
    },
    contentKinds: contentKinds({
      text: writeState,
      image: mediaState,
      video: mediaState,
      thread: writeState,
      // X has no carousel product and no document post. These are provider limitations.
      carousel: 'unsupported',
      document: 'unsupported',
      // There is no separate short video product on X; a short clip is a video post.
      short_video: 'unsupported',
      // Longer video is gated behind a higher access tier we have not been granted.
      long_video: 'requires_review',
    }),
    destinations: [
      {
        kind: 'community',
        // Community posting availability at our access tier is unconfirmed
        // (open decision 1 in docs/planning/05-social-connectors.md section 9).
        support: 'requires_review',
        searchable: true,
      },
    ],
    mentions: {
      // X resolves `@handle` when it renders the post. There is no entity id to store, so
      // `resolvesToExternalId` is false and the composer labels the tag as plain text.
      support: canRead ? 'supported' : 'requires_review',
      resolvesToExternalId: false,
      maxMentions: null,
    },
    firstComment: {
      support: writeState,
      maxItems: 1,
      minDelaySeconds: 0,
    },
    threads: {
      support: writeState,
      maxItems: X_MAX_THREAD_PARTS,
      minDelaySeconds: 0,
    },
    scheduling: RELAY_SIDE_SCHEDULING,
    privacy: NO_PRIVACY_CHOICE,
    disclosure: {
      // X exposes AI and content disclosure fields. We have not built the flow that
      // collects and submits the declaration, so it is not implemented rather than
      // unsupported: the provider offers it, we have not shipped it.
      aiLabel: 'not_implemented',
      commercialContent: 'unsupported',
      brandedContent: 'unsupported',
    },
    analytics: {
      support: canRead ? 'supported' : 'requires_review',
      postMetrics: normalizedNames(X_POST_METRICS),
      accountMetrics: normalizedNames(X_ACCOUNT_METRICS),
      // The readable history depends on the paid access tier, which we do not assume.
      historyWindowDays: null,
    },
    deletion: { support: writeState, windowSeconds: null },
    // The X API has no draft concept. This is a provider limitation, not a gap of ours.
    drafts: { support: 'unsupported' },
    // X rate limits are tier dependent and are not published for our specific app, so we
    // record observed limits at runtime rather than asserting a number here.
    rateLimit: null,
    cost: X_SNAPSHOT_COST,
  });
}
