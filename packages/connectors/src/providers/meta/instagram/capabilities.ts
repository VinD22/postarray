import type { CapabilitySnapshot, CapabilitySupport } from '@relay/contracts';

import {
  MEGABYTE,
  NO_PRIVACY_CHOICE,
  RELAY_SIDE_SCHEDULING,
  UNSUPPORTED_SEQUENCE,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../../shared/capability';
import type { ProviderConnection } from '../../shared/contract-shape';
import { normalizedNames } from '../../shared/metrics';
import { capabilityVersion } from '../../shared/verification';
import { INSTAGRAM_ACCOUNT_METRICS, INSTAGRAM_POST_METRICS } from './metrics';

/**
 * Instagram capability snapshot.
 *
 * Professional business and creator accounts only. A consumer account cannot publish
 * through the API, and the connect flow says so before OAuth starts rather than after it
 * fails. Planning baseline captured 4 August 2026; re-verify before implementation.
 */

export const INSTAGRAM_CAPABILITY_REVISION = 1;
export const INSTAGRAM_MAX_CAPTION_LENGTH = 2200;
export const INSTAGRAM_CAROUSEL_MIN = 2;
export const INSTAGRAM_CAROUSEL_MAX = 10;
/** Instagram's content publishing limit is 50 published posts per rolling 24 hours. */
export const INSTAGRAM_PUBLISH_WINDOW_SECONDS = 24 * 60 * 60;
export const INSTAGRAM_PUBLISH_QUOTA = 50;

/** Account types Instagram permits publishing from. */
export const INSTAGRAM_PROFESSIONAL_ACCOUNT_TYPES = new Set(['BUSINESS', 'MEDIA_CREATOR']);

export interface InstagramCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
  readonly grantedScopes: readonly string[];
}

export function buildInstagramCapabilities(input: InstagramCapabilityInput): CapabilitySnapshot {
  const granted = input.grantedScopes;
  const canPublish = granted.includes('instagram_content_publish');
  const canComment = granted.includes('instagram_manage_comments');
  const canReadInsights = granted.includes('instagram_manage_insights');

  const publishState: CapabilitySupport = canPublish ? 'supported' : 'requires_review';

  return buildSnapshot({
    capabilityVersion: capabilityVersion('instagram', INSTAGRAM_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'instagram',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: INSTAGRAM_MAX_CAPTION_LENGTH,
      minLength: 0,
      supportsMarkdown: false,
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: INSTAGRAM_CAROUSEL_MAX,
      maxVideos: 1,
      allowedMimeTypes: ['image/jpeg', 'video/mp4', 'video/quicktime'],
      maxBytesByKind: mediaBytes({
        image: 8 * MEGABYTE,
        video: 1024 * MEGABYTE,
      }),
      // Feed posts accept 4:5 through 1.91:1. Reels are 9:16 and are validated separately
      // against the chosen surface, because one snapshot cannot describe both at once.
      aspectRatios: { min: 0.8, max: 1.91, recommended: [1, 0.8, 1.91] },
      maxDurationSeconds: 900,
      minDurationSeconds: 3,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: null,
    },
    contentKinds: contentKinds({
      // Instagram has no text only post. Every publish carries media.
      text: 'unsupported',
      image: publishState,
      carousel: publishState,
      video: publishState,
      short_video: publishState,
      long_video: 'unsupported',
      document: 'unsupported',
      thread: 'unsupported',
    }),
    destinations: [{ kind: 'none', support: 'unsupported', searchable: false }],
    mentions: {
      // A caption mention is plain text that Instagram resolves when it renders. There is
      // no entity id to store, and tagging a user in an image is a separate API feature we
      // have not built.
      support: 'supported',
      resolvesToExternalId: false,
      maxMentions: 20,
    },
    firstComment: {
      support: canPublish && canComment ? 'supported' : 'requires_review',
      maxItems: 1,
      minDelaySeconds: 0,
    },
    threads: UNSUPPORTED_SEQUENCE,
    scheduling: RELAY_SIDE_SCHEDULING,
    privacy: NO_PRIVACY_CHOICE,
    disclosure: {
      aiLabel: 'unsupported',
      commercialContent: 'unsupported',
      brandedContent: 'not_implemented',
    },
    analytics: {
      support: canReadInsights ? 'supported' : 'requires_review',
      postMetrics: normalizedNames(INSTAGRAM_POST_METRICS),
      accountMetrics: normalizedNames(INSTAGRAM_ACCOUNT_METRICS),
      historyWindowDays: 90,
    },
    // The Instagram Graph API does not offer media deletion. This is a provider
    // limitation, so deleting in Post Array never implies deleting on Instagram.
    deletion: { support: 'unsupported', windowSeconds: null },
    drafts: { support: 'unsupported' },
    rateLimit: {
      windowSeconds: INSTAGRAM_PUBLISH_WINDOW_SECONDS,
      maxRequests: INSTAGRAM_PUBLISH_QUOTA,
    },
    cost: null,
  });
}

/**
 * Stories are narrower than feed posts: availability depends on the account and on the
 * current API surface. Until a specific connection is proven eligible, treat Stories as
 * gated behind review rather than promising them.
 */
export function storiesSupport(grantedScopes: readonly string[]): CapabilitySupport {
  return grantedScopes.includes('instagram_content_publish')
    ? 'requires_review'
    : 'requires_review';
}
