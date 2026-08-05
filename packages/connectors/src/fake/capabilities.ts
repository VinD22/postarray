import {
  type CapabilitySnapshot,
  type CapabilitySupport,
  type ContentKind,
  type MediaKind,
  capabilitySnapshotSchema,
} from '@relay/contracts';

/**
 * The fake provider's capability snapshot.
 *
 * The numbers are deliberately realistic and deliberately awkward: a character
 * limit that a normal draft can exceed, four images but one video, an aspect
 * ratio band, a duration ceiling, a metered cost that is ten times higher when
 * the post contains a URL, one content kind that is `unsupported` and one that
 * is `not_implemented`. That combination is what makes the composer, the
 * validator, the cost estimator and the capability page exercisable with no
 * provider credentials at all.
 */

export const FAKE_CAPABILITY_VERSION = 'fake-2026-08-04.1';

export const FAKE_TEXT_MAX_LENGTH = 2200;
export const FAKE_CHARACTERS_PER_LINK = 23;
export const FAKE_MAX_IMAGES = 4;
export const FAKE_MAX_VIDEOS = 1;
export const FAKE_MAX_VIDEO_SECONDS = 140;
export const FAKE_MIN_VIDEO_SECONDS = 1;
export const FAKE_MAX_THREAD_ITEMS = 25;
export const FAKE_FIRST_COMMENT_MIN_DELAY_SECONDS = 60;
export const FAKE_MAX_MENTIONS = 10;
export const FAKE_MAX_ALT_TEXT = 1000;

export const FAKE_MAX_BYTES: Readonly<Record<MediaKind, number | null>> = Object.freeze({
  image: 5 * 1024 * 1024,
  gif: 15 * 1024 * 1024,
  video: 512 * 1024 * 1024,
  document: 100 * 1024 * 1024,
  audio: null,
});

export const FAKE_ALLOWED_MIME_TYPES: readonly string[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'application/pdf',
];

export const FAKE_CONTENT_KINDS: Readonly<Record<ContentKind, CapabilitySupport>> = Object.freeze({
  text: 'supported',
  image: 'supported',
  carousel: 'supported',
  video: 'supported',
  short_video: 'supported',
  // The provider does not offer it.
  long_video: 'unsupported',
  // The provider offers it and we have not built it. Different state, on purpose.
  document: 'not_implemented',
  thread: 'supported',
});

// TODO(i18n): `capability.privacy.<value>` keys are not in the English catalog
// yet. Every provider needs its own audience labels, so the keys are namespaced
// by option value rather than by provider.
export const FAKE_PRIVACY_OPTIONS = [
  { value: 'public', labelKey: 'capability.privacy.public', isDefault: true },
  { value: 'followers', labelKey: 'capability.privacy.followers', isDefault: false },
  { value: 'private', labelKey: 'capability.privacy.private', isDefault: false },
] as const;

export interface FakeCapabilityOverrides {
  readonly textMaxLength?: number;
  readonly threadsSupport?: CapabilitySupport;
  readonly firstCommentSupport?: CapabilitySupport;
  readonly mentionsSupport?: CapabilitySupport;
  readonly analyticsSupport?: CapabilitySupport;
  readonly privacyMustBeExplicit?: boolean;
  readonly maxImages?: number;
  readonly capabilityVersion?: string;
  readonly metered?: boolean;
}

/** Build a schema valid snapshot for one fake connection. */
export function buildFakeCapabilitySnapshot(input: {
  readonly connectionId: string;
  readonly accountType: CapabilitySnapshot['accountType'];
  readonly observedAt: string;
  readonly overrides?: FakeCapabilityOverrides;
}): CapabilitySnapshot {
  const overrides = input.overrides ?? {};
  const snapshot: CapabilitySnapshot = {
    capabilityVersion: overrides.capabilityVersion ?? FAKE_CAPABILITY_VERSION,
    observedAt: input.observedAt,
    provider: 'fake',
    accountType: input.accountType,
    connectionId: input.connectionId,
    text: {
      maxLength: overrides.textMaxLength ?? FAKE_TEXT_MAX_LENGTH,
      minLength: 0,
      supportsMarkdown: false,
      linkCounting: { mode: 'fixed', charactersPerLink: FAKE_CHARACTERS_PER_LINK },
    },
    media: {
      maxImages: overrides.maxImages ?? FAKE_MAX_IMAGES,
      maxVideos: FAKE_MAX_VIDEOS,
      allowedMimeTypes: [...FAKE_ALLOWED_MIME_TYPES],
      maxBytesByKind: { ...FAKE_MAX_BYTES },
      aspectRatios: { min: 0.5, max: 2, recommended: [1, 1.7778, 0.8] },
      maxDurationSeconds: FAKE_MAX_VIDEO_SECONDS,
      minDurationSeconds: FAKE_MIN_VIDEO_SECONDS,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: FAKE_MAX_ALT_TEXT,
    },
    contentKinds: { ...FAKE_CONTENT_KINDS },
    destinations: [
      { kind: 'community', support: 'supported', searchable: true },
      { kind: 'group', support: 'unsupported', searchable: false },
      { kind: 'board', support: 'not_implemented', searchable: false },
      { kind: 'none', support: 'supported', searchable: false },
    ],
    mentions: {
      support: overrides.mentionsSupport ?? 'supported',
      resolvesToExternalId: true,
      maxMentions: FAKE_MAX_MENTIONS,
    },
    firstComment: {
      support: overrides.firstCommentSupport ?? 'supported',
      maxItems: 1,
      minDelaySeconds: FAKE_FIRST_COMMENT_MIN_DELAY_SECONDS,
    },
    threads: {
      support: overrides.threadsSupport ?? 'supported',
      maxItems: FAKE_MAX_THREAD_ITEMS,
      minDelaySeconds: 0,
    },
    scheduling: {
      // We schedule; we never hand a schedule to the provider.
      providerNative: 'unsupported',
      maxLookAheadDays: 365,
      minLeadSeconds: 60,
    },
    privacy: {
      support: 'supported',
      mustBeExplicit: overrides.privacyMustBeExplicit ?? false,
      options: FAKE_PRIVACY_OPTIONS.map((option) => ({ ...option })),
    },
    disclosure: {
      aiLabel: 'supported',
      commercialContent: 'supported',
      brandedContent: 'not_implemented',
    },
    analytics: {
      support: overrides.analyticsSupport ?? 'supported',
      postMetrics: ['impressions', 'likes', 'comments', 'shares', 'link_clicks'],
      accountMetrics: ['follower_delta', 'profile_views', 'published_count'],
      historyWindowDays: 90,
    },
    deletion: { support: 'supported', windowSeconds: null },
    // The provider offers a native draft object; we have not built it.
    drafts: { support: 'not_implemented' },
    rateLimit: { windowSeconds: 900, maxRequests: 300 },
    cost:
      overrides.metered === false
        ? null
        : { currency: 'USD', perCreateMinor: 2, perUrlCreateMinor: 20 },
  };
  return capabilitySnapshotSchema.parse(snapshot);
}
