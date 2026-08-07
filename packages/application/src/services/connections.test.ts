import { ACTIVE_CHANNEL_LIMIT, ERROR_CODES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import {
  assertChannelSlotAvailable,
  cacheIsStale,
  CHANNEL_SLOT_STATUSES,
  DESTINATION_CACHE_TTL_MS,
  MENTION_CACHE_TTL_MS,
  oauthCompletionReady,
  oauthCallbackReady,
  oauthVerifierKey,
  providerEligibleForVerifiedRevoke,
  requireExplicitOAuthAccountSelection,
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

  it('keeps OAuth completion unavailable until an atomic claim adapter is composed', () => {
    const base = {
      connectors: {
        has: () => true,
        capabilitiesFor: async () => {
          throw new Error('not used');
        },
      },
    } as const;
    expect(oauthCompletionReady(base)).toBe(false);
    expect(
      oauthCompletionReady({
        ...base,
        connectors: {
          ...base.connectors,
          completeOAuth: async () => {
            throw new Error('not used');
          },
        },
        credentialVault: {
          encrypt: async () => {
            throw new Error('not used');
          },
          decryptForRequest: async () => {
            throw new Error('not used');
          },
        },
        credentialStore: {
          find: async () => null,
          upsert: async () => {
            throw new Error('not used');
          },
          remove: async () => undefined,
          claimOAuthConnections: async () => ({ connectionIds: [] }),
        },
      }),
    ).toBe(true);
  });

  it('enables callback exchange only with connector, vault and one-shot key-value storage', () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    const connectors = {
      has: () => true,
      capabilitiesFor: async () => {
        throw new Error('not used');
      },
      completeOAuth: async () => {
        throw new Error('not used');
      },
    };
    const credentialVault = {
      encrypt: async () => {
        throw new Error('not used');
      },
    };
    expect(oauthCallbackReady({ connectors, kv })).toBe(false);
    expect(oauthCallbackReady({ connectors, credentialVault, kv })).toBe(true);
  });

  it('keeps completeOAuth unavailable when any persistence boundary is absent', () => {
    const completeOAuth = async () => {
      throw new Error('not used');
    };
    const connectors = {
      has: () => true,
      completeOAuth,
      capabilitiesFor: async () => {
        throw new Error('not used');
      },
    } as const;
    const credentialVault = {
      encrypt: async () => {
        throw new Error('not used');
      },
      decryptForRequest: async () => {
        throw new Error('not used');
      },
    };
    const credentialStore = {
      find: async () => null,
      upsert: async () => {
        throw new Error('not used');
      },
      remove: async () => undefined,
    };
    expect(oauthCompletionReady({ connectors })).toBe(false);
    expect(oauthCompletionReady({ connectors, credentialVault })).toBe(false);
    expect(oauthCompletionReady({ connectors, credentialStore })).toBe(false);
    expect(oauthCompletionReady({ connectors, credentialVault, credentialStore })).toBe(false);
    expect(
      oauthCompletionReady({
        connectors,
        credentialVault,
        credentialStore: {
          ...credentialStore,
          claimOAuthConnections: async () => ({ connectionIds: [] }),
        },
      }),
    ).toBe(true);
  });

  it('requires explicit unique account selection before OAuth exchange', () => {
    expect(() => requireExplicitOAuthAccountSelection(undefined)).toThrowError(
      expect.objectContaining({
        code: ERROR_CODES.VALIDATION_FAILED,
        details: { reason: 'OAUTH_ACCOUNT_SELECTION_REQUIRED' },
      }),
    );
    expect(() => requireExplicitOAuthAccountSelection([])).toThrowError(
      expect.objectContaining({
        details: { reason: 'OAUTH_ACCOUNT_SELECTION_REQUIRED' },
      }),
    );
    expect(() => requireExplicitOAuthAccountSelection(['account-a', 'account-a'])).toThrowError(
      expect.objectContaining({
        details: { reason: 'OAUTH_ACCOUNT_SELECTION_DUPLICATE' },
      }),
    );
    expect(() => requireExplicitOAuthAccountSelection(['   '])).toThrowError(
      expect.objectContaining({
        details: { reason: 'OAUTH_ACCOUNT_SELECTION_INVALID' },
      }),
    );
    expect(() => requireExplicitOAuthAccountSelection([' account-a'])).toThrowError(
      expect.objectContaining({
        details: { reason: 'OAUTH_ACCOUNT_SELECTION_INVALID' },
      }),
    );
    expect(() =>
      requireExplicitOAuthAccountSelection(
        Array.from({ length: ACTIVE_CHANNEL_LIMIT + 1 }, (_, index) => `account-${index}`),
      ),
    ).toThrowError(
      expect.objectContaining({
        details: {
          reason: 'OAUTH_ACCOUNT_SELECTION_TOO_LARGE',
          limit: ACTIVE_CHANNEL_LIMIT,
        },
      }),
    );
    expect(requireExplicitOAuthAccountSelection(['account-b', 'account-a'])).toEqual([
      'account-b',
      'account-a',
    ]);
  });

  it('uses a one-shot verifier primitive for completeOAuth callbacks', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    await kv.set(oauthVerifierKey('oauth_01ABC'), 'verifier');
    const [first, second] = await Promise.all([
      kv.getAndDelete(oauthVerifierKey('oauth_01ABC')),
      kv.getAndDelete(oauthVerifierKey('oauth_01ABC')),
    ]);
    expect([first, second].filter((value) => value === 'verifier')).toHaveLength(1);
    expect([first, second].filter((value) => value === null)).toHaveLength(1);
  });

  it('treats missing cache timestamps and expired staleAfter as stale', () => {
    const now = new Date('2026-08-07T12:00:00.000Z');
    expect(cacheIsStale(undefined, now, DESTINATION_CACHE_TTL_MS)).toBe(true);
    expect(cacheIsStale(new Date('2026-08-07T11:50:00.000Z'), now, DESTINATION_CACHE_TTL_MS)).toBe(
      false,
    );
    expect(
      cacheIsStale(
        new Date('2026-08-07T10:00:00.000Z'),
        now,
        MENTION_CACHE_TTL_MS,
        new Date('2026-08-07T11:30:00.000Z'),
      ),
    ).toBe(true);
  });

  it('limits verified provider revoke to development and production allow-lists', () => {
    expect(providerEligibleForVerifiedRevoke('fake', false)).toBe(false);
    expect(providerEligibleForVerifiedRevoke('bluesky', false)).toBe(true);
    expect(providerEligibleForVerifiedRevoke('bluesky', true)).toBe(false);
  });
});

describe('connection discovery caches', () => {
  const now = new Date('2026-08-07T12:00:00.000Z');

  it('refreshes destinations and mentions after their respective TTLs', () => {
    expect(
      cacheIsStale(
        new Date(now.getTime() - DESTINATION_CACHE_TTL_MS),
        now,
        DESTINATION_CACHE_TTL_MS,
      ),
    ).toBe(true);
    expect(
      cacheIsStale(
        new Date(now.getTime() - DESTINATION_CACHE_TTL_MS + 1),
        now,
        DESTINATION_CACHE_TTL_MS,
      ),
    ).toBe(false);
    expect(
      cacheIsStale(new Date(now.getTime() - MENTION_CACHE_TTL_MS), now, MENTION_CACHE_TTL_MS),
    ).toBe(true);
  });

  it('honors a provider expiry over the default TTL', () => {
    expect(cacheIsStale(now, now, DESTINATION_CACHE_TTL_MS, new Date(now.getTime() - 1))).toBe(
      true,
    );
    expect(cacheIsStale(undefined, now, DESTINATION_CACHE_TTL_MS)).toBe(true);
  });
});
