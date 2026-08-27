import { chmod, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import {
  assertNoTokenInArgv,
  createFileCredentialStore,
  createMemoryCredentialStore,
  summarize,
} from './credentials';
import type { StoredCredential } from './credentials';
import { configDir, credentialsFilePath } from './paths';

const CREDENTIAL: StoredCredential = {
  accessToken: 'access-token-value',
  refreshToken: 'refresh-token-value',
  expiresAt: '2026-08-05T12:00:00.000Z',
  tokenType: 'Bearer',
  scopes: ['accounts:read'],
  subject: 'user_01',
  workspaceId: 'ws_01',
  apiUrl: 'https://api.relay.example/',
  issuer: 'https://api.relay.example',
  obtainedAt: '2026-08-04T12:00:00.000Z',
};

async function tempPath(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'relay-cred-'));
  return join(directory, 'credentials.json');
}

describe('paths', () => {
  it('honours RELAY_CONFIG_DIR first', () => {
    expect(configDir({ RELAY_CONFIG_DIR: '/custom' }, '/home/x')).toBe('/custom');
  });

  it('falls back to XDG_CONFIG_HOME then ~/.config', () => {
    expect(configDir({ XDG_CONFIG_HOME: '/xdg' }, '/home/x')).toBe('/xdg/postarray');
    expect(configDir({}, '/home/x')).toBe('/home/x/.config/postarray');
  });

  it('keeps credentials in their own file', () => {
    expect(credentialsFilePath({ RELAY_CONFIG_DIR: '/c' })).toBe('/c/credentials.json');
  });
});

describe('createFileCredentialStore', () => {
  it('writes owner-only permissions', async () => {
    const path = await tempPath();
    const store = createFileCredentialStore(path);
    await store.put('default', CREDENTIAL);

    const info = await stat(path);
    expect(info.mode & 0o777).toBe(0o600);
  });

  it('round trips a credential', async () => {
    const path = await tempPath();
    const store = createFileCredentialStore(path);
    await store.put('default', CREDENTIAL);
    expect(await store.get('default')).toEqual(CREDENTIAL);
    expect(await store.get('other')).toBeNull();
  });

  it('refuses a file that anyone else can read', async () => {
    const path = await tempPath();
    const store = createFileCredentialStore(path);
    await store.put('default', CREDENTIAL);
    await chmod(path, 0o644);

    await expect(store.get('default')).rejects.toSatisfy(
      (error: unknown) =>
        RelayError.is(error) &&
        error.code === 'AUTH_REQUIRED' &&
        error.details['reason'] === 'CREDENTIAL_FILE_PERMISSIONS',
    );
  });

  it('treats a corrupt file as a missing session rather than crashing', async () => {
    const path = await tempPath();
    await writeFile(path, '{not json', { mode: 0o600 });
    const store = createFileCredentialStore(path);
    await expect(store.get('default')).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.code === 'AUTH_REQUIRED',
    );
  });

  it('returns empty when nothing has been stored yet', async () => {
    const path = await tempPath();
    const store = createFileCredentialStore(path);
    expect(await store.get('default')).toBeNull();
  });

  it('removes the file entirely when the last profile goes', async () => {
    const path = await tempPath();
    const store = createFileCredentialStore(path);
    await store.put('default', CREDENTIAL);
    expect(await store.remove('default')).toBe(true);
    await expect(readFile(path, 'utf8')).rejects.toThrow();
    expect(await store.remove('default')).toBe(false);
  });
});

describe('summarize', () => {
  it('never includes the token', () => {
    const summary = summarize(CREDENTIAL);
    const serialized = JSON.stringify(summary);
    expect(serialized).not.toContain('access-token-value');
    expect(serialized).not.toContain('refresh-token-value');
    expect(summary.hasRefreshToken).toBe(true);
    expect(summary.subject).toBe('user_01');
  });
});

describe('assertNoTokenInArgv', () => {
  it('accepts ordinary arguments', () => {
    expect(() => {
      assertNoTokenInArgv(['posts', 'list', '--json', '--limit', '5']);
    }).not.toThrow();
  });

  it('rejects a secret-shaped flag in either form', () => {
    for (const argument of ['--token', '--TOKEN=abc', '--client-secret', '--api-key=x']) {
      expect(() => {
        assertNoTokenInArgv(['accounts', 'list', argument]);
      }, argument).toThrow();
    }
  });
});

describe('createMemoryCredentialStore', () => {
  it('behaves like the file store without touching a disk', async () => {
    const store = createMemoryCredentialStore();
    expect(await store.get('default')).toBeNull();
    await store.put('default', CREDENTIAL);
    expect(await store.get('default')).toEqual(CREDENTIAL);
    expect(await store.remove('default')).toBe(true);
    expect(await store.get('default')).toBeNull();
  });
});
