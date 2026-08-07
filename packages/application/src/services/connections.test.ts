import { ACTIVE_CHANNEL_LIMIT, ERROR_CODES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import {
  assertChannelSlotAvailable,
  CHANNEL_SLOT_STATUSES,
  oauthCompletionReady,
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

  it('keeps OAuth completion unavailable until exchange, encryption and persistence are composed', () => {
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
        },
        credentialStore: {
          find: async () => null,
          upsert: async () => {
            throw new Error('not used');
          },
          remove: async () => undefined,
        },
      }),
    ).toBe(true);
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
    expect(oauthCompletionReady({ connectors, credentialVault, credentialStore })).toBe(true);
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
});
