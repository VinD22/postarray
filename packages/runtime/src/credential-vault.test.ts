import { createCredentialVault, type CredentialAad } from '@relay/connectors';
import { loadConfigFor } from '@relay/config';
import { createLogger } from '@relay/observability';
import { describe, expect, it } from 'vitest';

import { createConfiguredCredentialVault } from './credential-vault';

const LOCAL_KEY = Buffer.alloc(32, 23).toString('base64');
const TOKEN = 'token-never-stored-in-plaintext';
const AAD: CredentialAad = {
  workspaceId: 'ws_test',
  connectionId: 'conn_test',
  provider: 'x',
  credentialKind: 'access_token',
};

function config(nodeEnv: 'development' | 'production', encryption: Record<string, string>) {
  return loadConfigFor('api', {
    NODE_ENV: nodeEnv,
    APP_URL: 'https://app.example.test',
    API_URL: 'https://api.example.test',
    DATABASE_URL: 'postgresql://relay:relay@localhost:5432/relay',
    ...encryption,
  });
}

const logger = createLogger({ service: 'credential-vault-test' }, { level: 'silent' });

describe('createConfiguredCredentialVault', () => {
  it('builds an authenticated local envelope in development', async () => {
    const configured = createConfiguredCredentialVault({
      config: config('development', { TOKEN_ENCRYPTION_LOCAL_KEY: LOCAL_KEY }),
      logger,
    });
    if (configured === null) throw new Error('expected a development vault');

    const record = await configured.vault.encrypt({ secret: TOKEN, aad: AAD });
    expect(JSON.stringify(record)).not.toContain(TOKEN);

    const handle = await configured.vault.decryptForRequest({
      record,
      aad: AAD,
      purpose: 'test',
    });
    await expect(handle.use((value) => value)).resolves.toBe(TOKEN);
    handle.release();
    configured.close();
  });

  it('does not use a local key in production', () => {
    const configured = createConfiguredCredentialVault({
      config: config('production', { TOKEN_ENCRYPTION_LOCAL_KEY: LOCAL_KEY }),
      logger,
    });
    expect(configured).toBeNull();
  });

  it('constructs a KMS-backed vault without making a provider call at boot', () => {
    const configured = createConfiguredCredentialVault({
      config: config('production', {
        TOKEN_ENCRYPTION_KMS_KEY_ID: 'alias/relay-credentials-test',
      }),
      logger,
    });
    if (configured === null) throw new Error('expected a KMS vault');
    expect(configured.vault.currentKeyVersion).toBe(1);
    configured.close();
  });

  it('uses the connector vault contract directly for local test composition', async () => {
    const vault = createCredentialVault({ localKeyBase64: LOCAL_KEY });
    const record = await vault.encrypt({ secret: TOKEN, aad: AAD });
    expect(record.aadContext).toEqual(AAD);
  });
});
