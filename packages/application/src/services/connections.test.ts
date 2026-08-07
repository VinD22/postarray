import { ACTIVE_CHANNEL_LIMIT, ERROR_CODES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import {
  assertChannelSlotAvailable,
  CHANNEL_SLOT_STATUSES,
  oauthVerifierKey,
  socialOAuthCallbackUrl,
} from './connections';

describe('connection plan capacity', () => {
  it('counts every connected state and excludes only an explicit disconnect', () => {
    expect(CHANNEL_SLOT_STATUSES).toEqual([
      'active',
      'action_required',
      'expired',
      'revoked',
      'paused',
    ]);
    expect(CHANNEL_SLOT_STATUSES).not.toContain('disconnected');
  });

  it('allows the tenth channel and refuses an eleventh with a stable error', () => {
    expect(() => assertChannelSlotAvailable(ACTIVE_CHANNEL_LIMIT - 1)).not.toThrow();
    expect(() => assertChannelSlotAvailable(ACTIVE_CHANNEL_LIMIT)).toThrowError(
      expect.objectContaining({
        code: ERROR_CODES.QUOTA_EXCEEDED,
        messageKey: 'errors.channel_limit_reached',
        details: { used: ACTIVE_CHANNEL_LIMIT, limit: ACTIVE_CHANNEL_LIMIT },
      }),
    );
  });

  it('uses the canonical API callback, never the browser return path, as the provider redirect', () => {
    expect(socialOAuthCallbackUrl('https://api.example.test///', 'bluesky')).toBe(
      'https://api.example.test/v1/connections/callback/bluesky',
    );
  });

  it('names the short-lived verifier by the single-use transaction', () => {
    expect(oauthVerifierKey('oauth_01ABC')).toBe('relay:social-oauth-verifier:oauth_01ABC');
  });
});
