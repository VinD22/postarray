import type { ProviderId } from '@relay/contracts';
import type { Prisma } from '@relay/database';

/**
 * Narrowing a domain string into a storage enum.
 *
 * Several columns are Postgres enums, and several of the values we hold in the
 * domain are plain strings: a filter arriving from an HTTP query, an approval
 * policy read back out of a `Json` payload, a provider id from the connector
 * contract. Somewhere those two vocabularies have to meet, and the honest place
 * is one total function per enum that either returns a real member or refuses.
 *
 * The enum types are read off the generated Prisma input types rather than
 * spelled out again here, so the schema stays the single source of truth. Each
 * lookup table is declared as a `Record` keyed by its enum, which means adding a
 * variant in `schema.prisma` breaks this file at compile time instead of
 * quietly falling through at runtime.
 */

export type ApprovalPolicy = NonNullable<Prisma.PublishJobUncheckedCreateInput['approvalPolicy']>;
export type ProviderKind = NonNullable<Prisma.PostVariantUncheckedCreateInput['provider']>;
export type DestinationKind = NonNullable<Prisma.ProviderDestinationUncheckedCreateInput['kind']>;
export type MediaKind = NonNullable<Prisma.MediaAssetUncheckedCreateInput['kind']>;
export type OpportunityKind = NonNullable<Prisma.GrowthOpportunityUncheckedCreateInput['kind']>;

const APPROVAL_POLICIES = {
  none: 'none',
  single_approver: 'single_approver',
  any_approver: 'any_approver',
  named_approver: 'named_approver',
  policy_auto: 'policy_auto',
} as const satisfies Record<ApprovalPolicy, ApprovalPolicy>;

const DESTINATION_KINDS = {
  community: 'community',
  board: 'board',
  group: 'group',
  organization: 'organization',
  page: 'page',
  channel: 'channel',
  publication: 'publication',
  playlist: 'playlist',
} as const satisfies Record<DestinationKind, DestinationKind>;

const MEDIA_KINDS = {
  image: 'image',
  video: 'video',
  document: 'document',
  audio: 'audio',
} as const satisfies Record<MediaKind, MediaKind>;

const OPPORTUNITY_KINDS = {
  directory: 'directory',
  community: 'community',
  publication: 'publication',
  launch_platform: 'launch_platform',
  partner: 'partner',
  integration_marketplace: 'integration_marketplace',
  newsletter: 'newsletter',
} as const satisfies Record<OpportunityKind, OpportunityKind>;

/**
 * Providers carry the same names on both sides. The map proves it: it must
 * cover every `ProviderId`, and every value it produces must be a real
 * `ProviderKind`, so a divergence in either package fails the build.
 */
const PROVIDER_KIND_BY_ID = {
  x: 'x',
  linkedin: 'linkedin',
  instagram: 'instagram',
  facebook: 'facebook',
  youtube: 'youtube',
  tiktok: 'tiktok',
  threads: 'threads',
  bluesky: 'bluesky',
  mastodon: 'mastodon',
  telegram: 'telegram',
  reddit: 'reddit',
  wordpress: 'wordpress',
  medium: 'medium',
  devto: 'devto',
  pinterest: 'pinterest',
  discord: 'discord',
  slack: 'slack',
  google_business_profile: 'google_business_profile',
  fake: 'fake',
} as const satisfies Record<ProviderId, ProviderKind>;

export function toProviderKind(provider: ProviderId): ProviderKind {
  return PROVIDER_KIND_BY_ID[provider];
}

function lookup<T extends string>(
  table: Readonly<Record<string, T>>,
  value: string,
): T | undefined {
  for (const member of Object.values(table)) {
    if (member === value) {
      return member;
    }
  }
  return undefined;
}

/**
 * An unknown policy is not "no approval". Refusing outright is what keeps a typo
 * in a stored payload from publishing something nobody approved, so this one
 * throws rather than returning `undefined`: there is no sensible weaker answer.
 */
export function toApprovalPolicy(value: string): ApprovalPolicy {
  const policy = lookup(APPROVAL_POLICIES, value);
  if (policy === undefined) {
    throw new RangeError(`UNKNOWN_APPROVAL_POLICY:${value}`);
  }
  return policy;
}

/**
 * The `as*` pair below is for values that arrive as a caller-supplied filter.
 * They return `undefined` so the service can raise a validation error the user
 * can act on, rather than either crashing or silently dropping the filter and
 * answering a question nobody asked.
 */
export function asDestinationKind(value: string): DestinationKind | undefined {
  return lookup(DESTINATION_KINDS, value);
}

export function asMediaKind(value: string): MediaKind | undefined {
  return lookup(MEDIA_KINDS, value);
}

export function asOpportunityKind(value: string): OpportunityKind | undefined {
  return lookup(OPPORTUNITY_KINDS, value);
}
