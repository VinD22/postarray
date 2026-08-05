import type { CapabilitySnapshot, CapabilitySupport, PrivacyOption } from '@relay/contracts';

import {
  RELAY_SIDE_SCHEDULING,
  UNSUPPORTED_SEQUENCE,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../shared/capability';
import type { ProviderConnection } from '../shared/contract-shape';
import { normalizedNames } from '../shared/metrics';
import { capabilityVersion, reviewStatus } from '../shared/verification';
import { YOUTUBE_ACCOUNT_METRICS, YOUTUBE_POST_METRICS } from './metrics';

/**
 * YouTube capability snapshot.
 *
 * The defining constraint: **an unaudited Google Cloud project may upload videos only as
 * private.** That is a provider rule, so it is encoded here as a capability constraint and
 * shown before the user connects, rather than discovered as a runtime surprise.
 *
 * Planning baseline captured 4 August 2026; re-verify before implementation.
 */

export const YOUTUBE_CAPABILITY_REVISION = 1;
export const YOUTUBE_MAX_TITLE_LENGTH = 100;
export const YOUTUBE_MAX_DESCRIPTION_LENGTH = 5000;
export const YOUTUBE_MAX_TAGS = 30;
/** Videos longer than 15 minutes need a verified channel. */
export const YOUTUBE_UNVERIFIED_MAX_DURATION_SECONDS = 15 * 60;
export const YOUTUBE_VERIFIED_MAX_DURATION_SECONDS = 12 * 60 * 60;
/** A Short is a video that meets the Shorts criteria. There is no separate Shorts API. */
export const YOUTUBE_SHORTS_MAX_DURATION_SECONDS = 180;
export const YOUTUBE_MAX_UPLOAD_BYTES = 128 * 1024 * 1024 * 1024;

/** The Data API daily quota and the cost of one upload, in quota units. */
export const YOUTUBE_DAILY_QUOTA_UNITS = 10_000;
export const YOUTUBE_INSERT_QUOTA_UNITS = 1600;
export const YOUTUBE_UPLOADS_PER_DAY = Math.floor(
  YOUTUBE_DAILY_QUOTA_UNITS / YOUTUBE_INSERT_QUOTA_UNITS,
);

export const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl',
] as const;

export const YOUTUBE_PRIVACY_PRIVATE: PrivacyOption = {
  value: 'private',
  labelKey: 'connectors.youtube.privacy.private',
  isDefault: true,
};

export interface YouTubeCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
  readonly grantedScopes: readonly string[];
  /** True when the channel is verified for uploads longer than 15 minutes. */
  readonly longUploadsAllowed: boolean;
  /** True when the channel may set a custom thumbnail. */
  readonly customThumbnailAllowed: boolean;
}

/**
 * True while the Google Cloud project has not passed the YouTube API Services compliance
 * audit. Sourced from the review status table so an approval is one edit, not a code
 * change in the adapter.
 */
export function isUnaudited(): boolean {
  return reviewStatus('youtube').state !== 'approved';
}

export function youTubePrivacyOptions(): PrivacyOption[] {
  if (isUnaudited()) {
    // An unaudited project may upload only as private. We do not offer a choice we cannot
    // honour, and the connect screen, the composer and the capability page all say so.
    return [YOUTUBE_PRIVACY_PRIVATE];
  }
  return [
    YOUTUBE_PRIVACY_PRIVATE,
    { value: 'unlisted', labelKey: 'connectors.youtube.privacy.unlisted', isDefault: false },
    { value: 'public', labelKey: 'connectors.youtube.privacy.public', isDefault: false },
  ];
}

export function buildYouTubeCapabilities(input: YouTubeCapabilityInput): CapabilitySnapshot {
  const granted = input.grantedScopes;
  const canUpload = granted.includes('https://www.googleapis.com/auth/youtube.upload');
  const canRead = granted.includes('https://www.googleapis.com/auth/youtube.readonly');
  const canComment = granted.includes('https://www.googleapis.com/auth/youtube.force-ssl');
  const uploadState: CapabilitySupport = canUpload ? 'supported' : 'requires_review';

  return buildSnapshot({
    capabilityVersion: capabilityVersion('youtube', YOUTUBE_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'youtube',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      // The body of a YouTube draft is the description. The title is validated separately
      // against YOUTUBE_MAX_TITLE_LENGTH because it is a different field with its own limit.
      maxLength: YOUTUBE_MAX_DESCRIPTION_LENGTH,
      minLength: 0,
      supportsMarkdown: false,
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: 0,
      maxVideos: 1,
      allowedMimeTypes: [
        'video/mp4',
        'video/quicktime',
        'video/x-matroska',
        'video/webm',
        'video/mpeg',
        'video/x-msvideo',
      ],
      maxBytesByKind: mediaBytes({ video: YOUTUBE_MAX_UPLOAD_BYTES }),
      // YouTube accepts a wide range of framings, so we do not invent a narrow window.
      aspectRatios: { min: 0.1, max: 10, recommended: [16 / 9, 9 / 16] },
      maxDurationSeconds: input.longUploadsAllowed
        ? YOUTUBE_VERIFIED_MAX_DURATION_SECONDS
        : YOUTUBE_UNVERIFIED_MAX_DURATION_SECONDS,
      minDurationSeconds: 1,
      // A custom thumbnail requires channel eligibility, so it is not a hard requirement.
      requiresThumbnail: false,
      // A video has no alt text on YouTube. Captions are a separate feature.
      altText: 'unsupported',
      maxAltTextLength: null,
    },
    contentKinds: contentKinds({
      video: uploadState,
      // A Short is an ordinary upload that meets the Shorts criteria. We do not claim a
      // separate Shorts API because there is not one.
      short_video: uploadState,
      long_video: input.longUploadsAllowed ? uploadState : 'requires_review',
      text: 'unsupported',
      image: 'unsupported',
      carousel: 'unsupported',
      document: 'unsupported',
      thread: 'unsupported',
    }),
    destinations: [
      // The channels on a multi channel Google account are chosen at connect time.
      { kind: 'channel', support: canRead ? 'supported' : 'requires_review', searchable: false },
    ],
    mentions: {
      // YouTube has no mention resolution API.
      support: 'unsupported',
      resolvesToExternalId: false,
      maxMentions: null,
    },
    firstComment: {
      // Uses the comment thread insert endpoint. It fails if the uploader disabled
      // comments on the video, which validation warns about before publish.
      support: canComment ? 'supported' : 'requires_review',
      maxItems: 1,
      minDelaySeconds: 0,
    },
    threads: UNSUPPORTED_SEQUENCE,
    scheduling: RELAY_SIDE_SCHEDULING,
    privacy: {
      support: 'supported',
      // YouTube has a safe default (private), so the user is not forced to choose. What we
      // must never do is offer public while the project is unaudited.
      mustBeExplicit: false,
      options: youTubePrivacyOptions(),
    },
    disclosure: {
      // YouTube requires an altered or synthetic content declaration where relevant. We
      // collect and store the declaration but have not wired it to an API field yet.
      aiLabel: 'not_implemented',
      commercialContent: 'not_implemented',
      brandedContent: 'unsupported',
    },
    analytics: {
      support: canRead ? 'supported' : 'requires_review',
      postMetrics: normalizedNames(YOUTUBE_POST_METRICS),
      accountMetrics: normalizedNames(YOUTUBE_ACCOUNT_METRICS),
      historyWindowDays: null,
    },
    deletion: { support: uploadState, windowSeconds: null },
    // A private upload is not a draft. YouTube has no draft resource.
    drafts: { support: 'unsupported' },
    // Expressed as uploads per day, derived from the daily quota and the cost of one
    // `videos.insert`. Read calls consume the same quota, so this is a ceiling.
    rateLimit: { windowSeconds: 24 * 60 * 60, maxRequests: YOUTUBE_UPLOADS_PER_DAY },
    cost: null,
  });
}

export interface ThumbnailCapability {
  readonly support: CapabilitySupport;
  readonly reasonKey: string | null;
}

/** A custom thumbnail needs channel eligibility, which is a permission, not a gap. */
export function thumbnailCapability(customThumbnailAllowed: boolean): ThumbnailCapability {
  return customThumbnailAllowed
    ? { support: 'supported', reasonKey: null }
    : { support: 'requires_review', reasonKey: 'connectors.youtube.thumbnail_not_eligible' };
}
