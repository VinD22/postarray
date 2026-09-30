import { describe, expect, it } from 'vitest';

import { CREDENTIAL_KEYS } from '../security/credential-directory';
import { secretMatches } from '../security/credentials';
import { oauthClientRecordSchema } from '../security/records';
import { MemoryKeyValueStore } from '../runtime/redis-key-value-store';
import { testConfig } from '../testing/fakes';
import {
  ResourceServerClientConfigError,
  ensureResourceServerClient,
  registerResourceServerClientAtBoot,
} from './resource-server-client';

const SECRET = 'mcp-resource-server-secret-0001';

function configWith(secret: string | undefined) {
  const base = testConfig();
  return {
    ...base,
    oauth: {
      ...base.oauth,
      resourceServer: { ...base.oauth.resourceServer, clientSecret: secret },
    },
  };
}

describe('ensureResourceServerClient', () => {
  it('writes a confidential resource-server client whose secret the API verifies', async () => {
    const kv = new MemoryKeyValueStore();
    const config = configWith(SECRET);
    const result = await ensureResourceServerClient(kv, config, new Date('2026-09-30T10:00:00Z'));

    expect(result).toEqual({ clientId: 'rly_rs_mcp_test', created: true });
    const record = oauthClientRecordSchema.parse(
      JSON.parse((await kv.get(CREDENTIAL_KEYS.oauthClient('rly_rs_mcp_test'))) ?? 'null'),
    );
    expect(record).toMatchObject({
      clientType: 'confidential',
      registration: 'resource_server',
      redirectUris: [],
      workspaceId: null,
    });
    expect(JSON.stringify(record)).not.toContain(SECRET);
    const pepper = config.oauth.signingLocalKey ?? '';
    expect(secretMatches(SECRET, record.secretHash ?? '', pepper)).toBe(true);
  });

  it('is idempotent and keeps the client identity across a secret rotation', async () => {
    const kv = new MemoryKeyValueStore();
    await ensureResourceServerClient(kv, configWith(SECRET), new Date('2026-09-30T10:00:00Z'));
    const first = JSON.parse(
      (await kv.get(CREDENTIAL_KEYS.oauthClient('rly_rs_mcp_test'))) ?? '{}',
    );

    const again = await ensureResourceServerClient(
      kv,
      configWith('a-rotated-resource-server-secret'),
      new Date('2026-10-01T10:00:00Z'),
    );
    const second = JSON.parse(
      (await kv.get(CREDENTIAL_KEYS.oauthClient('rly_rs_mcp_test'))) ?? '{}',
    );

    expect(again.created).toBe(false);
    expect(second.appId).toBe(first.appId);
    expect(second.createdAt).toBe(first.createdAt);
    expect(second.secretHash).not.toBe(first.secretHash);
  });

  it('names every missing variable instead of writing a half client', async () => {
    const kv = new MemoryKeyValueStore();
    await expect(
      ensureResourceServerClient(kv, configWith(undefined), new Date()),
    ).rejects.toBeInstanceOf(ResourceServerClientConfigError);
    await expect(ensureResourceServerClient(kv, configWith(undefined), new Date())).rejects.toThrow(
      'MCP_CLIENT_SECRET',
    );
    expect(await kv.get(CREDENTIAL_KEYS.oauthClient('rly_rs_mcp_test'))).toBeNull();
  });
});

describe('registerResourceServerClientAtBoot', () => {
  it('does nothing when the MCP server is not configured', async () => {
    const kv = new MemoryKeyValueStore();
    const base = testConfig();
    const config = {
      ...base,
      oauth: {
        ...base.oauth,
        resourceServer: { clientId: undefined, clientSecret: undefined, resourceUrl: undefined },
      },
    };

    await expect(
      registerResourceServerClientAtBoot(kv, config, new Date('2026-09-30T10:00:00Z')),
    ).resolves.toBeNull();
  });

  it('registers the client when it is configured', async () => {
    const kv = new MemoryKeyValueStore();
    const result = await registerResourceServerClientAtBoot(
      kv,
      configWith(SECRET),
      new Date('2026-09-30T10:00:00Z'),
    );

    expect(result?.created).toBe(true);
  });

  it('refuses a partial configuration rather than starting an API Claude cannot use', async () => {
    const kv = new MemoryKeyValueStore();

    await expect(
      registerResourceServerClientAtBoot(kv, configWith(undefined), new Date()),
    ).rejects.toBeInstanceOf(ResourceServerClientConfigError);
  });
});
