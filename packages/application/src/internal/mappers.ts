import type { AccountType, CreationSurface, ProviderId } from '@relay/contracts';

/**
 * Translation between the storage vocabulary and the shared contract
 * vocabulary.
 *
 * The two are not identical and pretending otherwise is how a wrong enum ends
 * up in a receipt. Every mapping here is total and explicit, and every function
 * has a documented fallback rather than a silent `as`.
 */

/** `agent` is a contract surface with no column of its own; it stores as `api`. */
export function toStoredSurface(
  surface: CreationSurface,
): 'web' | 'api' | 'mcp' | 'cli' | 'rss' | 'automation_rule' | 'import' {
  switch (surface) {
    case 'web':
    case 'api':
    case 'mcp':
    case 'cli':
    case 'rss':
    case 'automation_rule':
      return surface;
    case 'agent':
      return 'api';
  }
}

export function fromStoredSurface(surface: string): CreationSurface {
  switch (surface) {
    case 'web':
    case 'api':
    case 'mcp':
    case 'cli':
    case 'rss':
    case 'automation_rule':
      return surface;
    default:
      // `import` has no contract surface. It arrived through the API.
      return 'api';
  }
}

export function toStoredActorType(
  actorType: 'user' | 'service_account' | 'oauth_app' | 'system',
): 'user' | 'service_account' | 'oauth_client' | 'system' {
  return actorType === 'oauth_app' ? 'oauth_client' : actorType;
}

const ACCOUNT_TYPE_TO_STORED: Readonly<
  Record<
    AccountType,
    | 'personal_profile'
    | 'creator_account'
    | 'business_account'
    | 'page'
    | 'organization'
    | 'channel'
    | 'group'
  >
> = {
  personal_profile: 'personal_profile',
  creator_profile: 'creator_account',
  business_profile: 'business_account',
  page: 'page',
  organization: 'organization',
  channel: 'channel',
  group: 'group',
  // The storage enum has no distinct value for these three. They are all
  // business surfaces on the providers that offer them.
  board: 'business_account',
  community: 'group',
  publication: 'organization',
};

export function toStoredAccountType(
  accountType: AccountType,
): (typeof ACCOUNT_TYPE_TO_STORED)[AccountType] {
  return ACCOUNT_TYPE_TO_STORED[accountType];
}

export function fromStoredAccountType(stored: string): AccountType {
  switch (stored) {
    case 'personal_profile':
      return 'personal_profile';
    case 'creator_account':
      return 'creator_profile';
    case 'business_account':
      return 'business_profile';
    case 'page':
      return 'page';
    case 'organization':
      return 'organization';
    case 'channel':
      return 'channel';
    case 'group':
      return 'group';
    default:
      return 'personal_profile';
  }
}

const PROVIDER_IDS: readonly ProviderId[] = [
  'x',
  'linkedin',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'threads',
  'bluesky',
  'fake',
];

/** Providers are named identically on both sides; this proves it at runtime. */
export function toProviderId(stored: string): ProviderId {
  const match = PROVIDER_IDS.find((provider) => provider === stored);
  if (match === undefined) {
    throw new RangeError(`UNKNOWN_PROVIDER:${stored}`);
  }
  return match;
}

/** ISO 8601 with an offset, or null. Never a naive local string. */
export function toIso(value: Date | null | undefined): string | null {
  return value === null || value === undefined ? null : value.toISOString();
}

export function requireIso(value: Date): string {
  return value.toISOString();
}

/**
 * `YYYY-MM-DDTHH:mm` as the user would read it in `timeZone`. Stored beside the
 * UTC instant so a daylight-saving shift is explainable after the fact.
 */
export function toLocalDateTime(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant);
  const lookup = (type: string): string => parts.find((part) => part.type === type)?.value ?? '00';
  return `${lookup('year')}-${lookup('month')}-${lookup('day')}T${lookup('hour')}:${lookup(
    'minute',
  )}`;
}

/** Prisma `BigInt` columns reach the view layer as a plain number of bytes. */
export function bigIntToNumber(value: bigint): number {
  return Number(value);
}

/** Prisma `Decimal` columns arrive as an object with a `toString`. */
export function decimalToNumber(value: { toString(): string } | null): number | null {
  if (value === null) {
    return null;
  }
  const parsed = Number.parseFloat(value.toString());
  return Number.isFinite(parsed) ? parsed : null;
}
