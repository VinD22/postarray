import type { CapabilitySnapshot, CapabilitySupport } from '@relay/contracts';

import {
  MEGABYTE,
  NO_PRIVACY_CHOICE,
  RELAY_SIDE_SCHEDULING,
  UNSUPPORTED_SEQUENCE,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../../shared/capability.js';
import type { ProviderConnection } from '../../shared/contract-shape.js';
import { normalizedNames } from '../../shared/metrics.js';
import { capabilityVersion } from '../../shared/verification.js';
import {
  FACEBOOK_ACCOUNT_METRICS,
  FACEBOOK_ENGAGEMENT_METRICS,
  FACEBOOK_POST_METRICS,
} from './metrics.js';

/**
 * Facebook Pages capability snapshot.
 *
 * Pages only. Personal profile automation is not a target and is not offered.
 * Planning baseline captured 4 August 2026; re-verify before implementation.
 */

export const FACEBOOK_CAPABILITY_REVISION = 1;
/** Facebook's documented message ceiling for a Page post. */
export const FACEBOOK_MAX_TEXT_LENGTH = 63_206;
export const FACEBOOK_MAX_IMAGES = 10;

export interface FacebookCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
  readonly grantedScopes: readonly string[];
}

export function buildFacebookCapabilities(input: FacebookCapabilityInput): CapabilitySnapshot {
  const granted = input.grantedScopes;
  const canPost = granted.includes('pages_manage_posts');
  const canEngage = granted.includes('pages_manage_engagement');
  const canReadInsights = granted.includes('read_insights');
  const postState: CapabilitySupport = canPost ? 'supported' : 'requires_review';

  return buildSnapshot({
    capabilityVersion: capabilityVersion('facebook', FACEBOOK_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'facebook',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: FACEBOOK_MAX_TEXT_LENGTH,
      minLength: 0,
      supportsMarkdown: false,
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: FACEBOOK_MAX_IMAGES,
      maxVideos: 1,
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/quicktime',
      ],
      maxBytesByKind: mediaBytes({
        image: 10 * MEGABYTE,
        gif: 10 * MEGABYTE,
        video: 1024 * MEGABYTE,
      }),
      // Facebook is comparatively permissive on framing relative to Instagram.
      aspectRatios: { min: 0.4, max: 2.5, recommended: [1.91, 1, 4 / 5] },
      maxDurationSeconds: 14_400,
      minDurationSeconds: 1,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: null,
    },
    contentKinds: contentKinds({
      text: postState,
      image: postState,
      carousel: postState,
      video: postState,
      // Facebook Reels is a separate publishing surface we have not built.
      short_video: 'not_implemented',
      long_video: 'unsupported',
      document: 'unsupported',
      thread: 'unsupported',
    }),
    destinations: [
      // Group posting is available only where the official API permits it for our app. We
      // do not promise it, and it is a gap of ours rather than a provider limitation.
      { kind: 'group', support: 'not_implemented', searchable: false },
    ],
    mentions: {
      // Page mentions inside a message use a provider specific inline syntax we have not
      // built. The API offers it, so this is not implemented rather than unsupported.
      support: 'not_implemented',
      resolvesToExternalId: false,
      maxMentions: null,
    },
    firstComment: {
      support: canPost && canEngage ? 'supported' : 'requires_review',
      maxItems: 1,
      minDelaySeconds: 0,
    },
    threads: UNSUPPORTED_SEQUENCE,
    scheduling: RELAY_SIDE_SCHEDULING,
    // A Page post is as public as the Page is. There is no per post audience selector we
    // expose, so there is nothing for the user to choose.
    privacy: NO_PRIVACY_CHOICE,
    disclosure: {
      aiLabel: 'unsupported',
      commercialContent: 'unsupported',
      brandedContent: 'not_implemented',
    },
    analytics: {
      support: canReadInsights ? 'supported' : 'requires_review',
      postMetrics: normalizedNames([...FACEBOOK_POST_METRICS, ...FACEBOOK_ENGAGEMENT_METRICS]),
      accountMetrics: normalizedNames(FACEBOOK_ACCOUNT_METRICS),
      historyWindowDays: 90,
    },
    deletion: { support: postState, windowSeconds: null },
    // Facebook supports unpublished and scheduled posts. We schedule through Temporal and
    // have not built a provider side draft, so this is not implemented.
    drafts: { support: 'not_implemented' },
    rateLimit: null,
    cost: null,
  });
}
