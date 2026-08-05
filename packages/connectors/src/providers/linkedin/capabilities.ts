import type { CapabilitySnapshot, CapabilitySupport } from '@relay/contracts';

import {
  MEGABYTE,
  RELAY_SIDE_SCHEDULING,
  UNSUPPORTED_SEQUENCE,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../shared/capability.js';
import type { ProviderConnection } from '../shared/contract-shape.js';
import { normalizedNames } from '../shared/metrics.js';
import { capabilityVersion, reviewApproved } from '../shared/verification.js';
import {
  LINKEDIN_ORGANIZATION_ACCOUNT_METRICS,
  LINKEDIN_ORGANIZATION_POST_METRICS,
  LINKEDIN_SOCIAL_METRICS,
} from './metrics.js';

/**
 * LinkedIn capability snapshot.
 *
 * Planning baseline captured 4 August 2026. Re-verify before implementation, including the
 * API version header, which LinkedIn rotates on a published schedule.
 */

export const LINKEDIN_CAPABILITY_REVISION = 1;
/**
 * The LinkedIn API version header value. A stale header is a common and confusing failure,
 * so it is a single constant with its review date recorded next to it.
 * Reviewed 4 August 2026. Next review before implementation.
 */
export const LINKEDIN_API_VERSION = '202603';
export const LINKEDIN_MAX_TEXT_LENGTH = 3000;
export const LINKEDIN_MAX_IMAGES = 20;

export const LINKEDIN_SCOPES = [
  'openid',
  'profile',
  'w_member_social',
  'w_organization_social',
  'r_organization_social',
  'rw_organization_admin',
] as const;

export interface LinkedInCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
  readonly grantedScopes: readonly string[];
}

function has(granted: readonly string[], scope: string): boolean {
  return granted.includes(scope);
}

export function buildLinkedInCapabilities(input: LinkedInCapabilityInput): CapabilitySnapshot {
  const isOrganization = input.connection.accountType === 'organization';
  const writeScope = isOrganization ? 'w_organization_social' : 'w_member_social';
  const canWrite = has(input.grantedScopes, writeScope);
  const canReadOrganization = has(input.grantedScopes, 'r_organization_social');
  const communityAccessApproved = reviewApproved('linkedin');

  const writeState: CapabilitySupport = canWrite ? 'supported' : 'requires_review';

  /**
   * Member post read back is restricted for new applications. That is a provider
   * restriction on our app, so it is `requires_review` rather than `unsupported`, and the
   * remediation copy says LinkedIn does not provide this data to new applications.
   */
  const analyticsSupport: CapabilitySupport = isOrganization
    ? canReadOrganization
      ? 'supported'
      : 'requires_review'
    : 'requires_review';

  const postMetrics = isOrganization
    ? normalizedNames([...LINKEDIN_SOCIAL_METRICS, ...LINKEDIN_ORGANIZATION_POST_METRICS])
    : normalizedNames(LINKEDIN_SOCIAL_METRICS);

  return buildSnapshot({
    capabilityVersion: capabilityVersion('linkedin', LINKEDIN_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'linkedin',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: LINKEDIN_MAX_TEXT_LENGTH,
      minLength: 0,
      supportsMarkdown: false,
      // LinkedIn does not shorten links, so a URL costs its own characters.
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: LINKEDIN_MAX_IMAGES,
      maxVideos: 1,
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
      maxBytesByKind: mediaBytes({
        image: 10 * MEGABYTE,
        gif: 10 * MEGABYTE,
        video: 500 * MEGABYTE,
        document: 100 * MEGABYTE,
      }),
      aspectRatios: { min: 1 / 2.4, max: 2.4, recommended: [1.91, 1, 4 / 5] },
      maxDurationSeconds: 900,
      minDurationSeconds: 3,
      requiresThumbnail: false,
      altText: 'supported',
      // LinkedIn does not publish an alt text ceiling we could verify, so we do not invent
      // one. The composer still requires alt text; it simply does not assert a limit.
      maxAltTextLength: null,
    },
    contentKinds: contentKinds({
      text: writeState,
      image: writeState,
      // A multi image post is LinkedIn's carousel.
      carousel: writeState,
      video: writeState,
      // The document post is a LinkedIn specific format and is worth supporting.
      document: writeState,
      // LinkedIn has no short video product distinct from a video post.
      short_video: 'unsupported',
      long_video: 'requires_review',
      // LinkedIn has no thread. A follow up is a comment, not a chained post.
      thread: 'unsupported',
    }),
    destinations: [
      {
        kind: 'organization',
        support: has(input.grantedScopes, 'w_organization_social')
          ? 'supported'
          : 'requires_review',
        searchable: true,
      },
    ],
    mentions: {
      // A resolved LinkedIn mention stores a real entity URN, which is what makes company
      // tagging work rather than rendering a display string.
      support: 'supported',
      resolvesToExternalId: true,
      maxMentions: null,
    },
    firstComment: {
      support: canWrite && communityAccessApproved ? 'supported' : 'requires_review',
      maxItems: 1,
      minDelaySeconds: 0,
    },
    threads: UNSUPPORTED_SEQUENCE,
    scheduling: RELAY_SIDE_SCHEDULING,
    privacy: {
      support: 'supported',
      // LinkedIn has a safe default, so the user is not forced to choose.
      mustBeExplicit: false,
      options: isOrganization
        ? [{ value: 'PUBLIC', labelKey: 'connectors.linkedin.visibility.public', isDefault: true }]
        : [
            { value: 'PUBLIC', labelKey: 'connectors.linkedin.visibility.public', isDefault: true },
            {
              value: 'CONNECTIONS',
              labelKey: 'connectors.linkedin.visibility.connections',
              isDefault: false,
            },
          ],
    },
    disclosure: {
      aiLabel: 'unsupported',
      commercialContent: 'unsupported',
      brandedContent: 'unsupported',
    },
    analytics: {
      support: analyticsSupport,
      postMetrics,
      accountMetrics: isOrganization ? normalizedNames(LINKEDIN_ORGANIZATION_ACCOUNT_METRICS) : [],
      historyWindowDays: null,
    },
    deletion: { support: writeState, windowSeconds: null },
    // LinkedIn has a DRAFT lifecycle state. We have not built it, so it is not implemented
    // rather than unsupported.
    drafts: { support: 'not_implemented' },
    // Application and member daily limits exist but the exact numbers are visible only in
    // the LinkedIn Developer Portal for our specific app, so we record observed limits at
    // runtime and never assert a published ceiling here.
    rateLimit: null,
    cost: null,
  });
}
