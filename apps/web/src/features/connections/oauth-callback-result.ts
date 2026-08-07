import type { ProviderId } from '@/lib/api/types';

/** The browser-facing status vocabulary emitted by the social OAuth callback. */
export const OAUTH_CALLBACK_STATUSES = ['connected', 'declined', 'failed'] as const;
export type OAuthCallbackStatus = (typeof OAUTH_CALLBACK_STATUSES)[number];

/** Safe, localizable failure categories. Provider messages never cross this boundary. */
export const OAUTH_CALLBACK_FAILURE_REASONS = [
  'not_implemented',
  'unsupported',
  'provider',
  'failed',
] as const;
export type OAuthCallbackFailureReason = (typeof OAUTH_CALLBACK_FAILURE_REASONS)[number];

const PROVIDERS: readonly ProviderId[] = [
  'x',
  'linkedin',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'threads',
  'bluesky',
  'mastodon',
  'telegram',
  'reddit',
  'wordpress',
  'medium',
  'devto',
  'pinterest',
  'discord',
  'slack',
  'fake',
];

export interface ReadableOAuthCallbackParams {
  get(name: string): string | null;
}

export interface OAuthCallbackResult {
  readonly status: OAuthCallbackStatus;
  readonly provider: ProviderId;
  readonly reason?: OAuthCallbackFailureReason;
  readonly count?: number;
}

function pick<T extends string>(
  params: ReadableOAuthCallbackParams,
  name: string,
  allowed: readonly T[],
): T | null {
  const value = params.get(name);
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function parseCount(params: ReadableOAuthCallbackParams): number | undefined {
  const value = params.get('count');
  if (value === null || !/^\d+$/.test(value)) return undefined;
  const count = Number(value);
  return Number.isSafeInteger(count) ? count : undefined;
}

/**
 * Parse callback query parameters without ever rendering arbitrary URL text.
 * Unknown values are ignored or downgraded to the generic failure state.
 */
export function parseOAuthCallbackResult(
  params: ReadableOAuthCallbackParams,
): OAuthCallbackResult | null {
  const status = pick(params, 'status', OAUTH_CALLBACK_STATUSES);
  const provider = pick(params, 'provider', PROVIDERS);
  if (status === null || provider === null) return null;

  if (status === 'failed') {
    return {
      status,
      provider,
      reason: pick(params, 'reason', OAUTH_CALLBACK_FAILURE_REASONS) ?? 'failed',
    };
  }

  if (status === 'connected') {
    const count = parseCount(params);
    return count === undefined ? { status, provider } : { status, provider, count };
  }

  return { status, provider };
}
