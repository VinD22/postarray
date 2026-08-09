/**
 * Seeded example content.
 *
 * Used by the tests and by the local development route so the composer can be
 * exercised before the API is reachable. Everything here is a plausible Relay
 * workspace: no invented performance claim, no customer logo, no metric.
 * Capability values mirror the shapes in `docs/research/06-source-register.md`
 * and are re-verified per connector before release, which is exactly why the
 * screen reads them from a snapshot instead of hard coding them.
 */

import {
  NOT_IMPLEMENTED_CONTENT_KINDS,
  type CapabilitySnapshot,
  type ContentKind,
  type CapabilitySupport,
  type MasterDraft,
  type ProviderId,
} from '@relay/contracts';

import type {
  BrandedDomain,
  ComposerBootstrap,
  ComposerState,
  SignatureOption,
  TargetAccount,
  TargetSet,
} from '../types';

const OBSERVED_AT = '2026-08-04T07:00:00.000Z';

function kinds(supported: readonly ContentKind[]): Record<ContentKind, CapabilitySupport> {
  const base = { ...NOT_IMPLEMENTED_CONTENT_KINDS };
  for (const kind of supported) {
    base[kind] = 'supported';
  }
  return base;
}

interface SnapshotSeed {
  readonly provider: ProviderId;
  readonly connectionId: string;
  readonly maxLength: number;
  readonly linkChars: number | null;
  readonly markdown: boolean;
  readonly maxImages: number;
  readonly maxVideos: number;
  readonly mimeTypes: readonly string[];
  readonly contentKinds: readonly ContentKind[];
  readonly destinationKind: CapabilitySnapshot['destinations'][number]['kind'];
  readonly destinationSupport: CapabilitySupport;
  readonly mentions: CapabilitySupport;
  readonly firstComment: CapabilitySupport;
  readonly threads: CapabilitySupport;
  readonly privacyExplicit: boolean;
  readonly privacyOptions: readonly { value: string; labelKey: string; isDefault: boolean }[];
  readonly perCreateMinor: number;
  readonly perUrlCreateMinor: number;
  readonly accountType: CapabilitySnapshot['accountType'];
}

function snapshot(seed: SnapshotSeed): CapabilitySnapshot {
  return {
    capabilityVersion: `2026-08-04.${seed.provider}.14`,
    observedAt: OBSERVED_AT,
    provider: seed.provider,
    accountType: seed.accountType,
    connectionId: seed.connectionId,
    text: {
      maxLength: seed.maxLength,
      minLength: 0,
      supportsMarkdown: seed.markdown,
      linkCounting: {
        mode: seed.linkChars === null ? 'actual' : 'fixed',
        charactersPerLink: seed.linkChars,
      },
    },
    media: {
      maxImages: seed.maxImages,
      maxVideos: seed.maxVideos,
      allowedMimeTypes: [...seed.mimeTypes],
      maxBytesByKind: {
        image: 5_242_880,
        gif: 15_728_640,
        video: 536_870_912,
        document: 104_857_600,
        audio: null,
      },
      aspectRatios: { min: 0.8, max: 1.91, recommended: [1, 0.8, 1.91] },
      maxDurationSeconds: seed.maxVideos > 0 ? 140 : null,
      minDurationSeconds: seed.maxVideos > 0 ? 1 : null,
      requiresThumbnail: seed.provider === 'youtube',
      altText: seed.provider === 'youtube' ? 'unsupported' : 'supported',
      maxAltTextLength: seed.provider === 'youtube' ? null : 1000,
    },
    contentKinds: kinds(seed.contentKinds),
    destinations: [
      { kind: seed.destinationKind, support: seed.destinationSupport, searchable: true },
    ],
    mentions: {
      support: seed.mentions,
      resolvesToExternalId: seed.mentions === 'supported',
      maxMentions: seed.mentions === 'supported' ? 20 : null,
    },
    firstComment: {
      support: seed.firstComment,
      maxItems: seed.firstComment === 'supported' ? 1 : 0,
      minDelaySeconds: 60,
    },
    threads: {
      support: seed.threads,
      maxItems: seed.threads === 'supported' ? 25 : 0,
      minDelaySeconds: 60,
    },
    scheduling: { providerNative: 'unsupported', maxLookAheadDays: 365, minLeadSeconds: 120 },
    privacy: {
      support: seed.privacyOptions.length > 0 ? 'supported' : 'unsupported',
      mustBeExplicit: seed.privacyExplicit,
      options: [...seed.privacyOptions],
    },
    disclosure: {
      aiLabel:
        seed.provider === 'youtube' || seed.provider === 'tiktok' ? 'supported' : 'unsupported',
      commercialContent: seed.provider === 'instagram' ? 'supported' : 'unsupported',
      brandedContent: seed.provider === 'instagram' ? 'supported' : 'unsupported',
    },
    analytics: {
      support: 'supported',
      // Normalized metric names only. Engagement is reported as its parts, and
      // a follower count is reported as the change over the window.
      postMetrics: ['impressions', 'likes', 'comments', 'shares'],
      accountMetrics: ['follower_delta'],
      historyWindowDays: 90,
    },
    deletion: { support: 'supported', windowSeconds: null },
    drafts: { support: 'not_implemented' },
    rateLimit: { windowSeconds: 900, maxRequests: 300 },
    cost:
      seed.perCreateMinor > 0 || seed.perUrlCreateMinor > 0
        ? {
            currency: 'USD',
            perCreateMinor: seed.perCreateMinor,
            perUrlCreateMinor: seed.perUrlCreateMinor,
          }
        : null,
  };
}

export const SEED_ACCOUNTS: readonly TargetAccount[] = [
  {
    connectionId: 'conn_seed_x_acme',
    provider: 'x',
    displayName: 'Acme',
    handle: '@acme',
    avatarUrl: null,
    brandId: 'brand_seed_acme_eu',
    paused: false,
    capabilities: snapshot({
      provider: 'x',
      connectionId: 'conn_seed_x_acme',
      accountType: 'business_profile',
      maxLength: 280,
      linkChars: 23,
      markdown: false,
      maxImages: 4,
      maxVideos: 1,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
      contentKinds: ['text', 'image', 'video', 'thread'],
      destinationKind: 'community',
      destinationSupport: 'supported',
      mentions: 'supported',
      firstComment: 'supported',
      threads: 'supported',
      privacyExplicit: false,
      privacyOptions: [],
      perCreateMinor: 5,
      perUrlCreateMinor: 20,
    }),
  },
  {
    connectionId: 'conn_seed_li_acme',
    provider: 'linkedin',
    displayName: 'Acme Europe',
    handle: 'acme-europe',
    avatarUrl: null,
    brandId: 'brand_seed_acme_eu',
    paused: false,
    capabilities: snapshot({
      provider: 'linkedin',
      connectionId: 'conn_seed_li_acme',
      accountType: 'organization',
      maxLength: 3000,
      linkChars: null,
      markdown: false,
      maxImages: 9,
      maxVideos: 1,
      mimeTypes: ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'],
      contentKinds: ['text', 'image', 'carousel', 'video', 'document'],
      destinationKind: 'organization',
      destinationSupport: 'supported',
      mentions: 'supported',
      firstComment: 'supported',
      threads: 'unsupported',
      privacyExplicit: false,
      privacyOptions: [
        { value: 'public', labelKey: 'composerWeb.native.privacy', isDefault: true },
      ],
      perCreateMinor: 0,
      perUrlCreateMinor: 0,
    }),
  },
  {
    connectionId: 'conn_seed_ig_acme',
    provider: 'instagram',
    displayName: 'acme.studio',
    handle: '@acme.studio',
    avatarUrl: null,
    brandId: 'brand_seed_acme_eu',
    paused: false,
    capabilities: snapshot({
      provider: 'instagram',
      connectionId: 'conn_seed_ig_acme',
      accountType: 'business_profile',
      maxLength: 2200,
      linkChars: null,
      markdown: false,
      maxImages: 10,
      maxVideos: 1,
      mimeTypes: ['image/jpeg', 'image/png', 'video/mp4'],
      contentKinds: ['image', 'carousel', 'short_video'],
      destinationKind: 'none',
      destinationSupport: 'unsupported',
      mentions: 'supported',
      firstComment: 'supported',
      threads: 'unsupported',
      privacyExplicit: false,
      privacyOptions: [],
      perCreateMinor: 0,
      perUrlCreateMinor: 0,
    }),
  },
  {
    connectionId: 'conn_seed_yt_acme',
    provider: 'youtube',
    displayName: 'Acme Engineering',
    handle: '@acmeengineering',
    avatarUrl: null,
    brandId: 'brand_seed_acme_eu',
    paused: false,
    capabilities: snapshot({
      provider: 'youtube',
      connectionId: 'conn_seed_yt_acme',
      accountType: 'channel',
      maxLength: 5000,
      linkChars: null,
      markdown: false,
      maxImages: 0,
      maxVideos: 1,
      mimeTypes: ['video/mp4', 'video/quicktime'],
      contentKinds: ['long_video', 'short_video'],
      destinationKind: 'channel',
      destinationSupport: 'supported',
      mentions: 'unsupported',
      firstComment: 'supported',
      threads: 'unsupported',
      privacyExplicit: true,
      privacyOptions: [
        { value: 'private', labelKey: 'composerWeb.native.privacy', isDefault: false },
        { value: 'unlisted', labelKey: 'composerWeb.native.privacy', isDefault: false },
        { value: 'public', labelKey: 'composerWeb.native.privacy', isDefault: false },
      ],
      perCreateMinor: 0,
      perUrlCreateMinor: 0,
    }),
  },
];

export const SEED_MASTER: MasterDraft = {
  id: 'content_seed_launch_thread',
  workspaceId: 'ws_seed_acme',
  brandId: 'brand_seed_acme_eu',
  campaignId: null,
  title: 'Scheduled first comments',
  body: 'We shipped scheduled first comments for every connector that officially supports them. Full notes: https://acme.example/changelog/first-comments',
  contentKind: 'text',
  locale: 'en',
  mediaIds: [],
  links: [],
  signature: null,
  threadItems: [],
  schedule: null,
  disclosure: { aiAssisted: false, commercialContent: false, brandedContent: false },
  createdVia: 'web',
};

export const SEED_SETS: readonly TargetSet[] = [
  {
    id: 'set_seed_launch_eu',
    name: 'Launch EU',
    description: 'The four accounts we use for a product release in Europe.',
    connectionIds: SEED_ACCOUNTS.map((account) => account.connectionId),
    seedBody: '',
    signatureId: 'sig_seed_eu_footer',
  },
  {
    id: 'set_seed_engineering',
    name: 'Engineering notes',
    description: 'X and LinkedIn only, for changelog and technical posts.',
    connectionIds: ['conn_seed_x_acme', 'conn_seed_li_acme'],
    seedBody: '',
    signatureId: null,
  },
];

export const SEED_SIGNATURES: readonly SignatureOption[] = [
  {
    id: 'sig_seed_eu_footer',
    name: 'EU legal footer',
    text: 'Acme Europe BV, Amsterdam. Terms at acme.example/terms',
    brandId: 'brand_seed_acme_eu',
    providers: [],
    locale: 'en',
    autoApply: false,
  },
  {
    id: 'sig_seed_x_short',
    name: 'Short attribution',
    text: 'Built by the Acme team.',
    brandId: 'brand_seed_acme_eu',
    providers: ['x'],
    locale: 'en',
    autoApply: false,
  },
];

export const SEED_DOMAINS: readonly BrandedDomain[] = [
  { domain: 'go.acme.example', verified: true },
  { domain: 'links.acme.example', verified: false },
];

export const SEED_BOOTSTRAP: ComposerBootstrap = {
  master: SEED_MASTER,
  accounts: SEED_ACCOUNTS,
  sets: SEED_SETS,
  signatures: SEED_SIGNATURES,
  brandedDomains: SEED_DOMAINS,
  selectedConnectionIds: ['conn_seed_x_acme', 'conn_seed_li_acme'],
  overrides: {},
  settings: {},
  approvalPinned: false,
  approverName: 'Dana Ito',
  approvalPolicy: 'Two approvers for project Acme EU',
  workspaceTimeZone: 'Europe/Berlin',
};

/** The state a fresh composer starts in, given a bootstrap payload. */
export function initialComposerState(bootstrap: ComposerBootstrap): ComposerState {
  return {
    master: bootstrap.master,
    selectedConnectionIds: [...bootstrap.selectedConnectionIds],
    overrides: { ...bootstrap.overrides },
    settings: { ...bootstrap.settings },
    activeConnectionId: null,
    linkPlan: { mode: 'original' as const, brandedDomain: null, utm: {} },
    appliedSetId: null,
    approvalPinned: bootstrap.approvalPinned,
    revision: 0,
  };
}
