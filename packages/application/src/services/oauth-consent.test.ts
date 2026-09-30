import { describe, expect, it } from 'vitest';

import { MemoryKeyValueStore } from '../ports/key-value';
import type { ServiceDeps } from '../types';
import { isAcceptableDynamicRedirectUri, registerDynamicClient } from './oauth-consent';
import { edgeClientKey, edgeClientSchema } from './oauth-edge-client';

describe('dynamic client redirect URIs', () => {
  it('accepts https and loopback http, including the Claude callbacks', () => {
    for (const uri of [
      'https://claude.ai/api/mcp/auth_callback',
      'https://claude.com/api/mcp/auth_callback',
      'http://localhost:33418/callback',
      'http://127.0.0.1:6274/oauth/callback',
      'http://[::1]:8080/cb',
    ]) {
      expect(isAcceptableDynamicRedirectUri(uri)).toBe(true);
    }
  });

  it('refuses plain http, fragments, user info and nested URLs', () => {
    for (const uri of [
      'http://claude.ai/api/mcp/auth_callback',
      'https://client.example/cb#frag',
      'https://user:pass@client.example/cb',
      'https://client.example/cb?next=https://evil.example',
      'https://client.example/cb?next=https%3A%2F%2Fevil.example',
      'javascript:alert(1)',
      'not a url',
    ]) {
      expect(isAcceptableDynamicRedirectUri(uri)).toBe(false);
    }
  });
});

describe('registerDynamicClient', () => {
  function depsWith(kv: MemoryKeyValueStore, created: Record<string, unknown>[]): ServiceDeps {
    const tx = {
      $executeRaw: async () => 0,
      oAuthClient: {
        create: async (args: { data: Record<string, unknown> }) => {
          created.push(args.data);
          return {
            ...args.data,
            id: 'app_0000000000000000000000000000dc01',
            homepageUrl: null,
            privacyPolicyUrl: null,
            termsUrl: null,
            logoUrl: null,
            supportEmail: null,
            createdAt: new Date('2026-09-30T10:00:00.000Z'),
          };
        },
      },
    };
    const prisma = {
      $transaction: (handler: (client: typeof tx) => Promise<unknown>) => handler(tx),
    };
    // A partial dependency bag: only the members this path touches exist.
    return {
      prisma,
      kv,
      clock: { now: () => new Date('2026-09-30T10:00:00.000Z') },
    } as unknown as ServiceDeps;
  }

  it('writes an ownerless public row and an edge record marked dynamic', async () => {
    const kv = new MemoryKeyValueStore();
    const created: Record<string, unknown>[] = [];
    const view = await registerDynamicClient(depsWith(kv, created), {
      name: '  Claude  ',
      redirectUris: ['https://claude.ai/api/mcp/auth_callback'],
      allowedScopes: ['drafts:read', 'drafts:write'],
    });

    expect(view.clientId).toMatch(/^rly_dc_/);
    expect(view.name).toBe('Claude');
    expect(created[0]).toMatchObject({
      workspaceId: null,
      createdByUserId: null,
      clientType: 'public',
      secretHash: null,
      registration: 'dynamic',
      status: 'active',
    });

    const raw = await kv.get(edgeClientKey(view.clientId));
    const edge = edgeClientSchema.parse(JSON.parse(raw ?? 'null'));
    expect(edge.registration).toBe('dynamic');
    expect(edge.workspaceId).toBeNull();
    expect(edge.firstParty).toBe(false);
    expect(edge.disabledAt).toBeNull();
  });

  it('refuses an insecure redirect before writing anything', async () => {
    const kv = new MemoryKeyValueStore();
    const created: Record<string, unknown>[] = [];
    await expect(
      registerDynamicClient(depsWith(kv, created), {
        name: 'Somebody',
        redirectUris: ['http://evil.example/cb'],
        allowedScopes: ['drafts:read'],
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
    expect(created).toHaveLength(0);
  });
});
