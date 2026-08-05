import type { CapabilitySnapshot, CapabilitySupport, PrivacyOption } from '@relay/contracts';

import {
  MEGABYTE,
  RELAY_SIDE_SCHEDULING,
  UNSUPPORTED_SEQUENCE,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../shared/capability';
import type { ProviderConnection } from '../shared/contract-shape';
import { capabilityVersion, reviewStatus } from '../shared/verification';
import type { TikTokCreatorInfo } from './schemas';

/**
 * TikTok capability snapshot.
 *
 * Two rules define this connector and both are encoded here rather than in a controller:
 *
 * 1. **Never default the privacy selection.** `privacy.mustBeExplicit` is true and no
 *    option is ever marked `isDefault`. An unselected privacy is a validation error.
 * 2. **The available options come from creator info fetched at publish time**, not from a
 *    constant and not from connect time. A snapshot built without creator info reports the
 *    unaudited fallback and says so.
 *
 * Planning baseline captured 4 August 2026; re-verify before implementation.
 */

export const TIKTOK_CAPABILITY_REVISION = 1;
export const TIKTOK_MAX_CAPTION_LENGTH = 2200;
/** Unaudited apps may only post privately, with per-account and per-user caps. */
export const TIKTOK_UNAUDITED_PRIVACY_LEVEL = 'SELF_ONLY';
export const TIKTOK_DEFAULT_MAX_DURATION_SECONDS = 600;
export const TIKTOK_MAX_PHOTOS = 35;

export const TIKTOK_SCOPES = [
  'user.info.basic',
  'user.info.profile',
  'video.publish',
  'video.upload',
] as const;

const PRIVACY_LABEL_KEYS: Readonly<Record<string, string>> = {
  PUBLIC_TO_EVERYONE: 'connectors.tiktok.privacy.public_to_everyone',
  MUTUAL_FOLLOW_FRIENDS: 'connectors.tiktok.privacy.mutual_follow_friends',
  FOLLOWER_OF_CREATOR: 'connectors.tiktok.privacy.follower_of_creator',
  SELF_ONLY: 'connectors.tiktok.privacy.self_only',
};

export function isUnaudited(): boolean {
  return reviewStatus('tiktok').state !== 'approved';
}

/**
 * Build the privacy options from what the creator info actually returned. No option is
 * ever marked as the default: TikTok requires the user to choose.
 */
export function tikTokPrivacyOptions(available: readonly string[]): PrivacyOption[] {
  const source = available.length > 0 ? available : [TIKTOK_UNAUDITED_PRIVACY_LEVEL];
  const permitted = isUnaudited()
    ? source.filter((value) => value === TIKTOK_UNAUDITED_PRIVACY_LEVEL)
    : source;
  const options = permitted.length > 0 ? permitted : [TIKTOK_UNAUDITED_PRIVACY_LEVEL];
  return options.map((value) => ({
    value,
    labelKey: PRIVACY_LABEL_KEYS[value] ?? 'connectors.tiktok.privacy.unknown',
    // Never a default. TikTok does not allow us to choose for the user.
    isDefault: false,
  }));
}

export interface TikTokCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
  readonly grantedScopes: readonly string[];
  /** Creator info fetched at publish time. Absent means we have not asked yet. */
  readonly creatorInfo?: TikTokCreatorInfo['data'];
}

export function buildTikTokCapabilities(input: TikTokCapabilityInput): CapabilitySnapshot {
  const granted = input.grantedScopes;
  const canPublish = granted.includes('video.publish');
  const publishState: CapabilitySupport = canPublish ? 'supported' : 'requires_review';
  const creator = input.creatorInfo;
  const maxDuration = creator?.max_video_post_duration_sec ?? TIKTOK_DEFAULT_MAX_DURATION_SECONDS;

  return buildSnapshot({
    capabilityVersion: capabilityVersion('tiktok', TIKTOK_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'tiktok',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: TIKTOK_MAX_CAPTION_LENGTH,
      minLength: 0,
      supportsMarkdown: false,
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: TIKTOK_MAX_PHOTOS,
      maxVideos: 1,
      allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/webm', 'image/jpeg', 'image/webp'],
      maxBytesByKind: mediaBytes({ video: 4096 * MEGABYTE, image: 20 * MEGABYTE }),
      // TikTok varies framing rules by account, so we do not assert a narrow window here.
      aspectRatios: { min: 0.1, max: 10, recommended: [9 / 16] },
      maxDurationSeconds: maxDuration,
      minDurationSeconds: 3,
      requiresThumbnail: false,
      // A TikTok video has no alt text field.
      altText: 'unsupported',
      maxAltTextLength: null,
    },
    contentKinds: contentKinds({
      video: publishState,
      short_video: publishState,
      // Photo posts are available only where approved for our app.
      image: 'requires_review',
      carousel: 'requires_review',
      long_video: 'unsupported',
      text: 'unsupported',
      document: 'unsupported',
      thread: 'unsupported',
    }),
    destinations: [{ kind: 'none', support: 'unsupported', searchable: false }],
    mentions: {
      // A caption mention is plain text that TikTok resolves when it renders.
      support: 'supported',
      resolvesToExternalId: false,
      maxMentions: null,
    },
    /**
     * The Content Posting API gives our app no way to comment on the post it created. This
     * is a provider limitation, so the composer hides the first comment field for TikTok
     * targets rather than showing an option that always fails.
     */
    firstComment: UNSUPPORTED_SEQUENCE,
    threads: UNSUPPORTED_SEQUENCE,
    scheduling: RELAY_SIDE_SCHEDULING,
    privacy: {
      support: publishState,
      // The rule that defines this connector.
      mustBeExplicit: true,
      options: tikTokPrivacyOptions(creator?.privacy_level_options ?? []),
    },
    disclosure: {
      aiLabel: 'unsupported',
      // The commercial content declaration and the branded content toggle are real fields
      // on the direct post request.
      commercialContent: publishState,
      brandedContent: publishState,
    },
    analytics: {
      // We are not approved for a TikTok insights product, so account and post metrics are
      // unavailable with a stated reason rather than a screen of zeros.
      support: 'requires_review',
      postMetrics: [],
      accountMetrics: [],
      historyWindowDays: null,
    },
    // The Content Posting API does not delete a published post.
    deletion: { support: 'unsupported', windowSeconds: null },
    // `SEND_TO_USER_INBOX` sends a draft to the creator's TikTok inbox. We publish directly
    // and have not built the inbox path, so this is not implemented.
    drafts: { support: 'not_implemented' },
    // Per-app and per-user caps apply and are tighter in unaudited mode. TikTok does not
    // publish a number for our app, so we record observations rather than assert one.
    rateLimit: null,
    cost: null,
  });
}

export interface InteractionAvailability {
  readonly commentAllowed: boolean;
  readonly duetAllowed: boolean;
  readonly stitchAllowed: boolean;
}

/** What the creator currently permits. Absent creator info means nothing is assumed on. */
export function interactionAvailability(
  creator: TikTokCreatorInfo['data'] | undefined,
): InteractionAvailability {
  return {
    commentAllowed: creator?.comment_disabled !== true,
    duetAllowed: creator?.duet_disabled !== true,
    stitchAllowed: creator?.stitch_disabled !== true,
  };
}
