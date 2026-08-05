import type { CapabilityState } from '@relay/design-system/patterns';
import type { MessageKey } from '@relay/i18n/translate';

/**
 * The public connector capability data.
 *
 * This mirrors the shape of the connector definitions the product reads, so
 * the marketing matrix and the in product capability panel say the same thing.
 * The rules it exists to enforce:
 *
 *  - `unsupported` means the platform does not offer it through its official
 *    API. That is a fact about the platform and it is final.
 *  - `requires_review` means the platform gates it behind an app review or a
 *    production access approval we have not passed.
 *  - `not_implemented` means the platform offers it and we have not shipped
 *    it. Since no connector has passed its definition of done yet, this is the
 *    honest default, and the page says so in a banner rather than dressing it
 *    up.
 *  - `supported` is written here only by the engineer who took the connector
 *    through its definition of done, including contract tests against the
 *    recorded fixtures. Nothing here is `supported` today.
 *
 * Every `unsupported` and `requires_review` cell carries the official source
 * it came from and the date that source was read.
 *
 * TODO(web): generate this file from `@relay/connectors` definitions once that
 * package exports a public snapshot. `apps/web` may not import it directly.
 */

export const CAPABILITY_COLUMNS = [
  'text',
  'image',
  'carousel',
  'video',
  'document',
  'thread',
  'altText',
  'destinations',
  'privacy',
  'thumbnail',
  'analytics',
  'delete',
  'disclosure',
] as const;

export type CapabilityColumn = (typeof CAPABILITY_COLUMNS)[number];

/** `capability.feature.*` lives in the shared connections catalog. */
export function capabilityLabelKey(column: CapabilityColumn): MessageKey {
  return `capability.feature.${column}` as MessageKey;
}

export function capabilityStateLabelKey(state: CapabilityState): MessageKey {
  return `capability.level.${state}` as MessageKey;
}

export interface Citation {
  /** Official documentation or policy URL. Never a blog post. */
  readonly url: string;
  /** ISO date the source was last read by a person. */
  readonly readOn: string;
}

export interface CapabilityCell {
  readonly state: CapabilityState;
  /** Required whenever the state is not `not_implemented`. */
  readonly noteKey?: MessageKey;
  readonly citation?: Citation;
}

export interface ConnectorRecord {
  readonly id: string;
  readonly nameKey: MessageKey;
  readonly accountTypesKey: MessageKey;
  readonly restrictionKey: MessageKey;
  readonly costKey: MessageKey;
  /** Official API documentation for this connector. */
  readonly primarySource: Citation;
  /** Official policy or automation rules for this connector. */
  readonly policySource: Citation;
  readonly capabilities: Readonly<Record<CapabilityColumn, CapabilityCell>>;
}

/** The date the whole snapshot below was compiled and reviewed by a person. */
export const CAPABILITY_SNAPSHOT = {
  version: '2026.08.04',
  reviewedOn: '2026-08-04',
  nextReviewOn: '2026-09-04',
} as const;

const READ = '2026-08-04';

const inBuild: CapabilityCell = { state: 'not_implemented' };

function unsupported(noteKey: MessageKey, citation?: Citation): CapabilityCell {
  return citation ? { state: 'unsupported', noteKey, citation } : { state: 'unsupported', noteKey };
}

function needsReview(noteKey: MessageKey, citation: Citation): CapabilityCell {
  return { state: 'requires_review', noteKey, citation };
}

function gated(noteKey: MessageKey, citation: Citation): CapabilityCell {
  return { state: 'not_implemented', noteKey, citation };
}

export const CONNECTORS: readonly ConnectorRecord[] = [
  {
    id: 'x',
    nameKey: 'web.marketing.provider.x',
    accountTypesKey: 'web.marketing.provider.x.accountTypes',
    restrictionKey: 'web.marketing.provider.x.restriction',
    costKey: 'web.marketing.provider.x.cost',
    primarySource: { url: 'https://docs.x.com/x-api/posts/create-post', readOn: READ },
    policySource: { url: 'https://help.x.com/en/rules-and-policies/x-automation', readOn: READ },
    capabilities: {
      text: gated('web.capabilities.note.xConsent', {
        url: 'https://help.x.com/en/rules-and-policies/x-automation',
        readOn: READ,
      }),
      image: inBuild,
      carousel: inBuild,
      video: inBuild,
      document: unsupported('web.capabilities.note.noDocuments'),
      thread: inBuild,
      altText: inBuild,
      destinations: unsupported('web.capabilities.note.noDestinations'),
      privacy: inBuild,
      thumbnail: unsupported('web.capabilities.note.noThumbnail'),
      analytics: inBuild,
      delete: inBuild,
      disclosure: gated('web.capabilities.note.xDisclosure', {
        url: 'https://docs.x.com/x-api/posts/create-post',
        readOn: READ,
      }),
    },
  },
  {
    id: 'linkedin',
    nameKey: 'web.marketing.provider.linkedin',
    accountTypesKey: 'web.marketing.provider.linkedin.accountTypes',
    restrictionKey: 'web.marketing.provider.linkedin.restriction',
    costKey: 'web.marketing.provider.linkedin.cost',
    primarySource: {
      url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-03',
      readOn: READ,
    },
    policySource: {
      url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management-app-review?view=li-lms-2026-01',
      readOn: READ,
    },
    capabilities: {
      text: needsReview('web.capabilities.note.linkedinOrgAccess', {
        url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management-app-review?view=li-lms-2026-01',
        readOn: READ,
      }),
      image: inBuild,
      carousel: inBuild,
      video: inBuild,
      document: gated('web.capabilities.note.linkedinDocuments', {
        url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-03',
        readOn: READ,
      }),
      thread: unsupported('web.capabilities.note.noThreads'),
      altText: inBuild,
      destinations: inBuild,
      privacy: inBuild,
      thumbnail: unsupported('web.capabilities.note.noThumbnail'),
      analytics: unsupported('web.capabilities.note.linkedinMemberAnalytics', {
        url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview?view=li-lms-2026-02',
        readOn: READ,
      }),
      delete: inBuild,
      disclosure: inBuild,
    },
  },
  {
    id: 'instagram',
    nameKey: 'web.marketing.provider.instagram',
    accountTypesKey: 'web.marketing.provider.instagram.accountTypes',
    restrictionKey: 'web.marketing.provider.instagram.restriction',
    costKey: 'web.marketing.provider.instagram.cost',
    primarySource: {
      url: 'https://developers.facebook.com/docs/instagram-platform/content-publishing/',
      readOn: READ,
    },
    policySource: {
      url: 'https://developers.facebook.com/docs/development/release/business-verification/',
      readOn: READ,
    },
    capabilities: {
      text: needsReview('web.capabilities.note.instagramProfessional', {
        url: 'https://developers.facebook.com/docs/instagram-platform/content-publishing/',
        readOn: READ,
      }),
      image: needsReview('web.capabilities.note.metaReview', {
        url: 'https://developers.facebook.com/docs/development/release/business-verification/',
        readOn: READ,
      }),
      carousel: inBuild,
      video: inBuild,
      document: unsupported('web.capabilities.note.noDocuments'),
      thread: unsupported('web.capabilities.note.noThreads'),
      altText: inBuild,
      destinations: unsupported('web.capabilities.note.noDestinations'),
      privacy: inBuild,
      thumbnail: inBuild,
      analytics: inBuild,
      delete: inBuild,
      disclosure: inBuild,
    },
  },
  {
    id: 'facebook',
    nameKey: 'web.marketing.provider.facebook',
    accountTypesKey: 'web.marketing.provider.facebook.accountTypes',
    restrictionKey: 'web.marketing.provider.facebook.restriction',
    costKey: 'web.marketing.provider.facebook.cost',
    primarySource: { url: 'https://developers.facebook.com/docs/pages-api/posts/', readOn: READ },
    policySource: {
      url: 'https://developers.facebook.com/docs/development/release/business-verification/',
      readOn: READ,
    },
    capabilities: {
      text: needsReview('web.capabilities.note.facebookPagesOnly', {
        url: 'https://developers.facebook.com/docs/pages-api/posts/',
        readOn: READ,
      }),
      image: needsReview('web.capabilities.note.metaReview', {
        url: 'https://developers.facebook.com/docs/development/release/business-verification/',
        readOn: READ,
      }),
      carousel: inBuild,
      video: inBuild,
      document: unsupported('web.capabilities.note.noDocuments'),
      thread: unsupported('web.capabilities.note.noThreads'),
      altText: inBuild,
      destinations: inBuild,
      privacy: inBuild,
      thumbnail: inBuild,
      analytics: inBuild,
      delete: inBuild,
      disclosure: inBuild,
    },
  },
  {
    id: 'youtube',
    nameKey: 'web.marketing.provider.youtube',
    accountTypesKey: 'web.marketing.provider.youtube.accountTypes',
    restrictionKey: 'web.marketing.provider.youtube.restriction',
    costKey: 'web.marketing.provider.youtube.cost',
    primarySource: {
      url: 'https://developers.google.com/youtube/v3/docs/videos/insert',
      readOn: READ,
    },
    policySource: {
      url: 'https://developers.google.com/youtube/terms/developer-policies',
      readOn: READ,
    },
    capabilities: {
      text: unsupported('web.capabilities.note.videoOnly'),
      image: unsupported('web.capabilities.note.videoOnly'),
      carousel: unsupported('web.capabilities.note.videoOnly'),
      video: needsReview('web.capabilities.note.youtubeAudit', {
        url: 'https://developers.google.com/youtube/v3/docs/videos/insert',
        readOn: READ,
      }),
      document: unsupported('web.capabilities.note.videoOnly'),
      thread: unsupported('web.capabilities.note.noThreads'),
      altText: unsupported('web.capabilities.note.noAltText'),
      destinations: unsupported('web.capabilities.note.noDestinations'),
      privacy: needsReview('web.capabilities.note.youtubeAudit', {
        url: 'https://developers.google.com/youtube/v3/docs/videos/insert',
        readOn: READ,
      }),
      thumbnail: inBuild,
      analytics: inBuild,
      delete: inBuild,
      disclosure: gated('web.capabilities.note.inBuild', {
        url: 'https://support.google.com/youtube/answer/14328491',
        readOn: READ,
      }),
    },
  },
  {
    id: 'tiktok',
    nameKey: 'web.marketing.provider.tiktok',
    accountTypesKey: 'web.marketing.provider.tiktok.accountTypes',
    restrictionKey: 'web.marketing.provider.tiktok.restriction',
    costKey: 'web.marketing.provider.tiktok.cost',
    primarySource: {
      url: 'https://developers.tiktok.com/doc/content-posting-api-get-started/',
      readOn: READ,
    },
    policySource: {
      url: 'https://developers.tiktok.com/doc/content-sharing-guidelines/',
      readOn: READ,
    },
    capabilities: {
      text: unsupported('web.capabilities.note.videoOnly'),
      image: inBuild,
      carousel: inBuild,
      video: needsReview('web.capabilities.note.tiktokAudit', {
        url: 'https://developers.tiktok.com/doc/content-sharing-guidelines/',
        readOn: READ,
      }),
      document: unsupported('web.capabilities.note.videoOnly'),
      thread: unsupported('web.capabilities.note.noThreads'),
      altText: unsupported('web.capabilities.note.noAltText'),
      destinations: unsupported('web.capabilities.note.noDestinations'),
      privacy: needsReview('web.capabilities.note.tiktokPrivacy', {
        url: 'https://developers.tiktok.com/doc/content-sharing-guidelines/',
        readOn: READ,
      }),
      thumbnail: inBuild,
      analytics: inBuild,
      delete: inBuild,
      disclosure: gated('web.capabilities.note.inBuild', {
        url: 'https://developers.tiktok.com/doc/content-sharing-guidelines/',
        readOn: READ,
      }),
    },
  },
  {
    id: 'threads',
    nameKey: 'web.marketing.provider.threads',
    accountTypesKey: 'web.marketing.provider.threads.accountTypes',
    restrictionKey: 'web.marketing.provider.threads.restriction',
    costKey: 'web.marketing.provider.threads.cost',
    primarySource: {
      url: 'https://www.postman.com/meta/threads/documentation/dht3nzz/threads-api',
      readOn: READ,
    },
    policySource: {
      url: 'https://developers.facebook.com/docs/development/release/business-verification/',
      readOn: READ,
    },
    capabilities: {
      text: inBuild,
      image: inBuild,
      carousel: inBuild,
      video: inBuild,
      document: unsupported('web.capabilities.note.noDocuments'),
      thread: inBuild,
      altText: inBuild,
      destinations: unsupported('web.capabilities.note.noDestinations'),
      privacy: inBuild,
      thumbnail: unsupported('web.capabilities.note.noThumbnail'),
      analytics: inBuild,
      delete: inBuild,
      disclosure: inBuild,
    },
  },
  {
    id: 'bluesky',
    nameKey: 'web.marketing.provider.bluesky',
    accountTypesKey: 'web.marketing.provider.bluesky.accountTypes',
    restrictionKey: 'web.marketing.provider.bluesky.restriction',
    costKey: 'web.marketing.provider.bluesky.cost',
    primarySource: { url: 'https://docs.bsky.app/docs/advanced-guides/posts', readOn: READ },
    policySource: { url: 'https://bsky.social/about/support/community-guidelines', readOn: READ },
    capabilities: {
      text: inBuild,
      image: inBuild,
      carousel: inBuild,
      video: inBuild,
      document: unsupported('web.capabilities.note.noDocuments'),
      thread: inBuild,
      altText: inBuild,
      destinations: unsupported('web.capabilities.note.noDestinations'),
      privacy: unsupported('web.capabilities.note.noPrivacyChoice'),
      thumbnail: unsupported('web.capabilities.note.noThumbnail'),
      analytics: inBuild,
      delete: inBuild,
      disclosure: inBuild,
    },
  },
];

/** Counts used by the matrix summary line. Computed, never hand written. */
export function capabilityStateCounts(): Readonly<Record<CapabilityState, number>> {
  const counts: Record<CapabilityState, number> = {
    supported: 0,
    unsupported: 0,
    not_implemented: 0,
    requires_review: 0,
  };
  for (const connector of CONNECTORS) {
    for (const column of CAPABILITY_COLUMNS) {
      counts[connector.capabilities[column].state] += 1;
    }
  }
  return counts;
}
