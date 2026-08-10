import { CONTENT_KINDS, capabilitySnapshotSchema } from '@relay/contracts';
import type {
  AccountType,
  CapabilitySnapshot,
  CapabilitySupport,
  ContentKind,
  MediaKind,
  ProviderId,
} from '@relay/contracts';

import { FIXTURE_NOW, fixtureId } from '../ids';

/**
 * Capability snapshots.
 *
 * These describe what a connected account may do, in the shape the composer,
 * the validators and the connectors all read. They are deliberately
 * conservative: anything a connector in this repository has not built is
 * `not_implemented`, and anything a provider does not offer is `unsupported`.
 * The two are never interchanged, which is what the connector contract suite
 * asserts.
 */

function kinds(
  supported: readonly ContentKind[],
  unsupported: readonly ContentKind[],
): Record<ContentKind, CapabilitySupport> {
  const record = {} as Record<ContentKind, CapabilitySupport>;
  for (const kind of CONTENT_KINDS) {
    record[kind] = supported.includes(kind)
      ? 'supported'
      : unsupported.includes(kind)
        ? 'unsupported'
        : 'not_implemented';
  }
  return record;
}

function bytes(
  overrides: Partial<Record<MediaKind, number | null>>,
): Record<MediaKind, number | null> {
  return {
    image: 5 * 1024 * 1024,
    video: 512 * 1024 * 1024,
    gif: 15 * 1024 * 1024,
    document: 100 * 1024 * 1024,
    audio: null,
    ...overrides,
  };
}

interface ProviderCapabilityProfile {
  readonly accountType: AccountType;
  readonly maxTextLength: number;
  readonly supportsMarkdown: boolean;
  readonly linkCounting: { mode: 'none' | 'fixed' | 'actual'; charactersPerLink: number | null };
  readonly maxImages: number;
  readonly maxVideos: number;
  readonly allowedMimeTypes: readonly string[];
  readonly maxBytesByKind: Record<MediaKind, number | null>;
  readonly maxDurationSeconds: number | null;
  readonly requiresThumbnail: boolean;
  readonly altText: CapabilitySupport;
  readonly maxAltTextLength: number | null;
  readonly supportedKinds: readonly ContentKind[];
  readonly unsupportedKinds: readonly ContentKind[];
  readonly firstComment: CapabilitySupport;
  readonly threads: CapabilitySupport;
  readonly maxThreadItems: number;
  readonly privacyMustBeExplicit: boolean;
  readonly privacyOptions: ReadonlyArray<{ value: string; labelKey: string; isDefault: boolean }>;
  readonly deletion: CapabilitySupport;
  readonly drafts: CapabilitySupport;
  readonly costMinorPerCreate: number | null;
  readonly costMinorPerUrlCreate: number | null;
}

/**
 * The per-provider shapes used across the test suites. They mirror the limits
 * documented in `docs/planning/05-social-connectors.md`; at runtime the live
 * capability snapshot is always the only source of truth.
 */
const PROFILES: Readonly<Record<ProviderId, ProviderCapabilityProfile>> = {
  x: {
    accountType: 'personal_profile',
    maxTextLength: 280,
    supportsMarkdown: false,
    linkCounting: { mode: 'fixed', charactersPerLink: 23 },
    maxImages: 4,
    maxVideos: 1,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
    maxBytesByKind: bytes({ video: 512 * 1024 * 1024 }),
    maxDurationSeconds: 140,
    requiresThumbnail: false,
    altText: 'supported',
    maxAltTextLength: 1_000,
    supportedKinds: ['text', 'image', 'video', 'thread'],
    unsupportedKinds: ['document'],
    firstComment: 'supported',
    threads: 'supported',
    maxThreadItems: 25,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'not_implemented',
    // X is the only V1 provider that charges per operation. The capability
    // schema carries whole minor units, so these are the per-create prices
    // rounded to cents for display. The exact micro-dollar prices that a
    // customer is billed at live in the `@relay/billing` price book.
    costMinorPerCreate: 2,
    costMinorPerUrlCreate: 20,
  },
  linkedin: {
    accountType: 'organization',
    maxTextLength: 3_000,
    supportsMarkdown: false,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 20,
    maxVideos: 1,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: 900,
    requiresThumbnail: false,
    altText: 'supported',
    maxAltTextLength: 300,
    supportedKinds: ['text', 'image', 'carousel', 'video', 'document'],
    unsupportedKinds: ['thread'],
    firstComment: 'supported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'not_implemented',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  instagram: {
    accountType: 'business_profile',
    maxTextLength: 2_200,
    supportsMarkdown: false,
    linkCounting: { mode: 'none', charactersPerLink: null },
    maxImages: 10,
    maxVideos: 1,
    allowedMimeTypes: ['image/jpeg', 'video/mp4'],
    maxBytesByKind: bytes({ image: 8 * 1024 * 1024, video: 1024 * 1024 * 1024 }),
    maxDurationSeconds: 900,
    requiresThumbnail: true,
    altText: 'supported',
    maxAltTextLength: 1_000,
    supportedKinds: ['image', 'carousel', 'video', 'short_video'],
    unsupportedKinds: ['text', 'document', 'thread'],
    firstComment: 'supported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  facebook: {
    accountType: 'page',
    maxTextLength: 63_206,
    supportsMarkdown: false,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 10,
    maxVideos: 1,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: 14_400,
    requiresThumbnail: false,
    altText: 'supported',
    maxAltTextLength: 1_000,
    supportedKinds: ['text', 'image', 'carousel', 'video', 'short_video'],
    unsupportedKinds: ['document', 'thread'],
    firstComment: 'supported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'not_implemented',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  youtube: {
    accountType: 'channel',
    maxTextLength: 5_000,
    supportsMarkdown: false,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 1,
    maxVideos: 1,
    allowedMimeTypes: ['video/mp4', 'video/quicktime', 'image/jpeg', 'image/png'],
    maxBytesByKind: bytes({ video: 128 * 1024 * 1024 * 1024 }),
    maxDurationSeconds: 43_200,
    requiresThumbnail: true,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['video', 'short_video', 'long_video'],
    unsupportedKinds: ['text', 'image', 'carousel', 'document', 'thread'],
    firstComment: 'supported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: true,
    privacyOptions: [
      { value: 'public', labelKey: 'composer.privacy.public', isDefault: false },
      { value: 'unlisted', labelKey: 'composer.privacy.unlisted', isDefault: false },
      { value: 'private', labelKey: 'composer.privacy.private', isDefault: false },
    ],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  tiktok: {
    accountType: 'creator_profile',
    maxTextLength: 2_200,
    supportsMarkdown: false,
    linkCounting: { mode: 'none', charactersPerLink: null },
    maxImages: 35,
    maxVideos: 1,
    allowedMimeTypes: ['video/mp4', 'video/quicktime', 'image/jpeg', 'image/webp'],
    maxBytesByKind: bytes({ video: 4 * 1024 * 1024 * 1024 }),
    maxDurationSeconds: 600,
    requiresThumbnail: false,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['short_video', 'video', 'carousel'],
    unsupportedKinds: ['text', 'image', 'document', 'thread'],
    firstComment: 'supported',
    threads: 'unsupported',
    maxThreadItems: 0,
    // TikTok forbids a preselected privacy value. The user must choose.
    privacyMustBeExplicit: true,
    privacyOptions: [
      { value: 'PUBLIC_TO_EVERYONE', labelKey: 'composer.privacy.public', isDefault: false },
      { value: 'MUTUAL_FOLLOW_FRIENDS', labelKey: 'composer.privacy.friends', isDefault: false },
      { value: 'SELF_ONLY', labelKey: 'composer.privacy.private', isDefault: false },
    ],
    deletion: 'unsupported',
    drafts: 'supported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  threads: {
    accountType: 'personal_profile',
    maxTextLength: 500,
    supportsMarkdown: false,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 20,
    maxVideos: 1,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: 300,
    requiresThumbnail: false,
    altText: 'supported',
    maxAltTextLength: 1_000,
    supportedKinds: ['text', 'image', 'carousel', 'video', 'thread'],
    unsupportedKinds: ['document'],
    firstComment: 'supported',
    threads: 'supported',
    maxThreadItems: 10,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'not_implemented',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  bluesky: {
    accountType: 'personal_profile',
    maxTextLength: 300,
    supportsMarkdown: false,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 4,
    maxVideos: 1,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxBytesByKind: bytes({ image: 1024 * 1024 }),
    maxDurationSeconds: 60,
    requiresThumbnail: false,
    altText: 'supported',
    maxAltTextLength: 2_000,
    supportedKinds: ['text', 'image', 'video', 'thread'],
    unsupportedKinds: ['document'],
    firstComment: 'supported',
    threads: 'supported',
    maxThreadItems: 25,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  fake: {
    accountType: 'personal_profile',
    maxTextLength: 1_000,
    supportsMarkdown: true,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 4,
    maxVideos: 1,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: 600,
    requiresThumbnail: false,
    altText: 'supported',
    maxAltTextLength: 1_000,
    supportedKinds: ['text', 'image', 'carousel', 'video', 'thread'],
    unsupportedKinds: ['document'],
    firstComment: 'supported',
    threads: 'supported',
    maxThreadItems: 10,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'supported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  mastodon: {
    accountType: 'personal_profile',
    maxTextLength: 500,
    supportsMarkdown: true,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 4,
    maxVideos: 1,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: 600,
    requiresThumbnail: false,
    altText: 'supported',
    maxAltTextLength: 1_500,
    supportedKinds: ['text', 'image', 'video', 'thread'],
    unsupportedKinds: ['carousel', 'document'],
    firstComment: 'supported',
    threads: 'supported',
    maxThreadItems: 25,
    privacyMustBeExplicit: false,
    privacyOptions: [
      { value: 'public', labelKey: 'privacy.mastodon.public.label', isDefault: true },
      { value: 'unlisted', labelKey: 'privacy.mastodon.unlisted.label', isDefault: false },
      { value: 'private', labelKey: 'privacy.mastodon.private.label', isDefault: false },
    ],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  telegram: {
    accountType: 'community',
    maxTextLength: 4_096,
    supportsMarkdown: true,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 1,
    maxVideos: 0,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: null,
    requiresThumbnail: false,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['text', 'image', 'thread'],
    unsupportedKinds: ['carousel', 'video', 'document'],
    firstComment: 'unsupported',
    threads: 'supported',
    maxThreadItems: 25,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  reddit: {
    accountType: 'personal_profile',
    maxTextLength: 40_000,
    supportsMarkdown: true,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 0,
    maxVideos: 0,
    allowedMimeTypes: [],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: null,
    requiresThumbnail: false,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['text'],
    unsupportedKinds: ['carousel', 'video', 'document'],
    firstComment: 'unsupported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  wordpress: {
    accountType: 'publication',
    maxTextLength: 10_000,
    supportsMarkdown: true,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 0,
    maxVideos: 0,
    allowedMimeTypes: [],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: null,
    requiresThumbnail: false,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['text'],
    unsupportedKinds: ['carousel', 'video', 'document'],
    firstComment: 'unsupported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  medium: {
    accountType: 'publication',
    maxTextLength: 3_200,
    supportsMarkdown: true,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 0,
    maxVideos: 0,
    allowedMimeTypes: [],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: null,
    requiresThumbnail: false,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['text'],
    unsupportedKinds: ['carousel', 'video', 'document'],
    firstComment: 'unsupported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'unsupported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  devto: {
    accountType: 'publication',
    maxTextLength: 4_096,
    supportsMarkdown: true,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 0,
    maxVideos: 0,
    allowedMimeTypes: [],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: null,
    requiresThumbnail: false,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['text'],
    unsupportedKinds: ['carousel', 'video', 'document'],
    firstComment: 'unsupported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  /**
   * Google Business Profile has no adapter yet. Every field below is
   * deliberately the most restrictive value the schema allows, so a fixture can
   * never assert a capability nobody has verified against the provider. The
   * real profile is written when the adapter lands and its definition-of-done
   * evidence is signed.
   */
  google_business_profile: {
    accountType: 'business_profile',
    maxTextLength: 1_500,
    supportsMarkdown: false,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 1,
    maxVideos: 0,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: null,
    requiresThumbnail: false,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['text', 'image'],
    unsupportedKinds: ['carousel', 'video', 'document', 'thread'],
    firstComment: 'unsupported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'not_implemented',
    drafts: 'not_implemented',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  pinterest: {
    accountType: 'business_profile',
    maxTextLength: 500,
    supportsMarkdown: false,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 1,
    maxVideos: 0,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: null,
    requiresThumbnail: false,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['image'],
    unsupportedKinds: ['text', 'carousel', 'document'],
    firstComment: 'unsupported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  discord: {
    accountType: 'community',
    maxTextLength: 2_000,
    supportsMarkdown: true,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 0,
    maxVideos: 0,
    allowedMimeTypes: [],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: null,
    requiresThumbnail: false,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['text'],
    unsupportedKinds: ['carousel', 'video', 'document'],
    firstComment: 'unsupported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
  slack: {
    accountType: 'organization',
    maxTextLength: 40_000,
    supportsMarkdown: false,
    linkCounting: { mode: 'actual', charactersPerLink: null },
    maxImages: 0,
    maxVideos: 0,
    allowedMimeTypes: [],
    maxBytesByKind: bytes({}),
    maxDurationSeconds: null,
    requiresThumbnail: false,
    altText: 'unsupported',
    maxAltTextLength: null,
    supportedKinds: ['text'],
    unsupportedKinds: ['carousel', 'video', 'document'],
    firstComment: 'unsupported',
    threads: 'unsupported',
    maxThreadItems: 0,
    privacyMustBeExplicit: false,
    privacyOptions: [],
    deletion: 'supported',
    drafts: 'unsupported',
    costMinorPerCreate: null,
    costMinorPerUrlCreate: null,
  },
};

export interface MakeCapabilitySnapshotInput {
  readonly provider?: ProviderId;
  readonly connectionId?: string;
  readonly observedAt?: string;
  readonly capabilityVersion?: string;
  readonly overrides?: Partial<CapabilitySnapshot>;
}

/** A schema-valid capability snapshot for one provider. */
export function makeCapabilitySnapshot(
  input: MakeCapabilitySnapshotInput = {},
): CapabilitySnapshot {
  const provider = input.provider ?? 'x';
  const profile = PROFILES[provider];
  const connectionId = input.connectionId ?? fixtureId('connection', `${provider}-primary`);
  const snapshot = {
    capabilityVersion: input.capabilityVersion ?? `${provider}-2026-08-04`,
    observedAt: input.observedAt ?? FIXTURE_NOW,
    provider,
    accountType: profile.accountType,
    connectionId,
    text: {
      maxLength: profile.maxTextLength,
      minLength: 0,
      supportsMarkdown: profile.supportsMarkdown,
      linkCounting: { ...profile.linkCounting },
    },
    media: {
      maxImages: profile.maxImages,
      maxVideos: profile.maxVideos,
      allowedMimeTypes: [...profile.allowedMimeTypes],
      maxBytesByKind: { ...profile.maxBytesByKind },
      aspectRatios: { min: 0.5, max: 1.91, recommended: [1, 1.91, 0.5625] },
      maxDurationSeconds: profile.maxDurationSeconds,
      minDurationSeconds: 1,
      requiresThumbnail: profile.requiresThumbnail,
      altText: profile.altText,
      maxAltTextLength: profile.maxAltTextLength,
    },
    contentKinds: kinds(profile.supportedKinds, profile.unsupportedKinds),
    destinations: [{ kind: 'none' as const, support: 'supported' as const, searchable: false }],
    mentions: {
      support: 'supported' as const,
      resolvesToExternalId: true,
      maxMentions: 10,
    },
    firstComment: {
      support: profile.firstComment,
      maxItems: profile.firstComment === 'supported' ? 1 : 0,
      minDelaySeconds: 60,
    },
    threads: {
      support: profile.threads,
      maxItems: profile.maxThreadItems,
      minDelaySeconds: 0,
    },
    scheduling: {
      providerNative: 'not_implemented' as const,
      maxLookAheadDays: 365,
      minLeadSeconds: 60,
    },
    privacy: {
      support:
        profile.privacyOptions.length > 0 ? ('supported' as const) : ('unsupported' as const),
      mustBeExplicit: profile.privacyMustBeExplicit,
      options: profile.privacyOptions.map((option) => ({ ...option })),
    },
    disclosure: {
      aiLabel: 'not_implemented' as const,
      commercialContent:
        provider === 'tiktok' ? ('supported' as const) : ('not_implemented' as const),
      brandedContent: provider === 'tiktok' ? ('supported' as const) : ('not_implemented' as const),
    },
    analytics: {
      support: 'supported' as const,
      postMetrics: ['impressions', 'likes', 'comments', 'shares'] as const,
      accountMetrics: ['follower_delta', 'profile_views'] as const,
      historyWindowDays: 90,
    },
    deletion: { support: profile.deletion, windowSeconds: null },
    drafts: { support: profile.drafts },
    rateLimit: { windowSeconds: 900, maxRequests: 300 },
    cost:
      profile.costMinorPerCreate === null || profile.costMinorPerUrlCreate === null
        ? null
        : {
            currency: 'USD',
            perCreateMinor: profile.costMinorPerCreate,
            perUrlCreateMinor: profile.costMinorPerUrlCreate,
          },
    ...(input.overrides ?? {}),
  };
  return capabilitySnapshotSchema.parse(snapshot);
}

/** Every V1 provider's snapshot, keyed by provider. */
export function makeAllCapabilitySnapshots(): Readonly<Record<ProviderId, CapabilitySnapshot>> {
  const entries = (Object.keys(PROFILES) as ProviderId[]).map(
    (provider) => [provider, makeCapabilitySnapshot({ provider })] as const,
  );
  return Object.fromEntries(entries) as Record<ProviderId, CapabilitySnapshot>;
}

/**
 * A snapshot that has drifted since approval: the text limit shrank and the
 * account lost its analytics permission. Used by the revalidation tests.
 */
export function makeDriftedCapabilitySnapshot(provider: ProviderId = 'x'): CapabilitySnapshot {
  const base = makeCapabilitySnapshot({ provider });
  return capabilitySnapshotSchema.parse({
    ...base,
    capabilityVersion: `${provider}-2026-08-05`,
    observedAt: '2026-08-05T12:00:00.000Z',
    text: { ...base.text, maxLength: Math.max(1, Math.floor(base.text.maxLength / 2)) },
    analytics: { ...base.analytics, support: 'unsupported', postMetrics: [], accountMetrics: [] },
  });
}
