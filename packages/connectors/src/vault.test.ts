import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import { capturingLogger, fixedClock } from './ports';
import { sanitizeProviderPayload } from './sanitize';
import {
  type CredentialAad,
  CredentialVault,
  LocalMasterKeyProvider,
  REDACTED,
  SecretValue,
  type VaultAuditEvent,
  createCredentialVault,
  encryptedCredentialSchema,
  generateLocalMasterKey,
  leaseSecret,
} from './vault';

const TOKEN = 'provider-access-token-do-not-log-me';

const aad: CredentialAad = {
  workspaceId: 'ws_1',
  connectionId: 'conn_1',
  provider: 'fake',
  credentialKind: 'access_token',
};

function vaultWith(versions: readonly number[] = [1]): {
  vault: CredentialVault;
  events: VaultAuditEvent[];
  providers: LocalMasterKeyProvider[];
} {
  const events: VaultAuditEvent[] = [];
  const providers = versions.map(
    (version) => new LocalMasterKeyProvider(generateLocalMasterKey(), version),
  );
  const vault = new CredentialVault({
    keyProviders: providers,
    clock: fixedClock('2026-08-04T12:00:00.000Z'),
    onAudit: (event) => events.push(event),
  });
  return { vault, events, providers };
}

describe('SecretValue', () => {
  it('never serializes its plaintext', () => {
    const secret = new SecretValue(TOKEN);
    expect(String(secret)).toBe(REDACTED);
    expect(JSON.stringify({ secret })).not.toContain(TOKEN);
    expect(JSON.stringify({ secret })).toContain(REDACTED);
    expect(secret.reveal()).toBe(TOKEN);
  });

  it('compares in constant time and fingerprints without exposing', () => {
    const secret = new SecretValue(TOKEN);
    expect(secret.equals(TOKEN)).toBe(true);
    expect(secret.equals('something else')).toBe(false);
    expect(secret.fingerprint()).toHaveLength(16);
    expect(secret.fingerprint()).not.toContain(TOKEN);
  });
});

describe('SecretHandle', () => {
  it('reveals only inside the callback and refuses after release', async () => {
    const handle = leaseSecret({ secret: TOKEN, credentialKind: 'access_token', purpose: 'test' });
    expect(await handle.use((plaintext) => plaintext)).toBe(TOKEN);
    handle.release();
    expect(handle.isUsable()).toBe(false);
    await expect(handle.use((plaintext) => plaintext)).rejects.toBeInstanceOf(RelayError);
  });

  it('expires with the clock', async () => {
    const clock = fixedClock('2026-08-04T12:00:00.000Z');
    const handle = leaseSecret({
      secret: TOKEN,
      credentialKind: 'access_token',
      purpose: 'test',
      clock,
      ttlMs: 1000,
    });
    expect(handle.isUsable()).toBe(true);
    clock.advance(1001);
    expect(handle.isUsable()).toBe(false);
    await expect(handle.use((plaintext) => plaintext)).rejects.toBeInstanceOf(RelayError);
  });

  it('serializes to the redaction placeholder', () => {
    const handle = leaseSecret({ secret: TOKEN, credentialKind: 'access_token', purpose: 'test' });
    expect(JSON.stringify({ handle })).not.toContain(TOKEN);
    expect(JSON.stringify({ handle })).toContain(REDACTED);
  });
});

describe('CredentialVault', () => {
  it('round trips a credential', async () => {
    const { vault } = vaultWith();
    const record = await vault.encrypt({ secret: TOKEN, aad });
    expect(encryptedCredentialSchema.safeParse(record).success).toBe(true);
    expect(record.algorithm).toBe('AES-256-GCM');
    const handle = await vault.decryptForRequest({ record, aad, purpose: 'publish' });
    expect(await handle.use((plaintext) => plaintext)).toBe(TOKEN);
    handle.release();
  });

  it('stores ciphertext, nonce, tag and wrapped key separately', async () => {
    const { vault } = vaultWith();
    const record = await vault.encrypt({ secret: TOKEN, aad });
    expect(record.ciphertext).not.toBe(record.nonce);
    expect(record.wrappedDek.length).toBeGreaterThan(0);
    expect(record.authTag.length).toBeGreaterThan(0);
    expect(JSON.stringify(record)).not.toContain(TOKEN);
  });

  it('uses a fresh nonce for every write', async () => {
    const { vault } = vaultWith();
    const first = await vault.encrypt({ secret: TOKEN, aad });
    const second = await vault.encrypt({ secret: TOKEN, aad });
    expect(first.nonce).not.toBe(second.nonce);
    expect(first.ciphertext).not.toBe(second.ciphertext);
    expect(first.wrappedDek).not.toBe(second.wrappedDek);
  });

  it('refuses a ciphertext moved to another connection row', async () => {
    const { vault } = vaultWith();
    const record = await vault.encrypt({ secret: TOKEN, aad });
    const movedRow = { ...record, aadContext: { ...aad, connectionId: 'conn_2' } };
    await expect(
      vault.decryptForRequest({
        record: movedRow,
        aad: { ...aad, connectionId: 'conn_2' },
        purpose: 'publish',
      }),
    ).rejects.toBeInstanceOf(RelayError);
  });

  it('refuses when the requested context does not match the stored one', async () => {
    const { vault } = vaultWith();
    const record = await vault.encrypt({ secret: TOKEN, aad });
    await expect(
      vault.decryptForRequest({
        record,
        aad: { ...aad, credentialKind: 'refresh_token' },
        purpose: 'publish',
      }),
    ).rejects.toBeInstanceOf(RelayError);
  });

  it('audits every encrypt and every decrypt', async () => {
    const { vault, events } = vaultWith();
    const record = await vault.encrypt({ secret: TOKEN, aad });
    const handle = await vault.decryptForRequest({ record, aad, purpose: 'publish' });
    handle.release();
    expect(events.map((event) => event.action)).toEqual(['encrypt', 'decrypt']);
    expect(events[1]?.purpose).toBe('publish');
    expect(JSON.stringify(events)).not.toContain(TOKEN);
  });

  it('rotates to the current master key and still decrypts', async () => {
    const { providers } = vaultWith([1]);
    const first = providers[0];
    if (first === undefined) {
      expect.unreachable('expected one key provider');
      return;
    }
    const oldVault = new CredentialVault({
      keyProviders: [first],
      clock: fixedClock('2026-08-04T12:00:00.000Z'),
    });
    const record = await oldVault.encrypt({ secret: TOKEN, aad });
    expect(record.keyVersion).toBe(1);

    const second = new LocalMasterKeyProvider(generateLocalMasterKey(), 2);
    const rotatingVault = new CredentialVault({
      keyProviders: [first, second],
      clock: fixedClock('2026-08-04T12:00:00.000Z'),
    });
    expect(rotatingVault.currentKeyVersion).toBe(2);
    expect(rotatingVault.needsRotation(record)).toBe(true);

    const rotated = await rotatingVault.rotate({ record, aad });
    expect(rotated.keyVersion).toBe(2);
    expect(rotated.wrappedDek).not.toBe(record.wrappedDek);
    expect(rotatingVault.needsRotation(rotated)).toBe(false);

    const handle = await rotatingVault.decryptForRequest({
      record: rotated,
      aad,
      purpose: 'publish',
    });
    expect(await handle.use((plaintext) => plaintext)).toBe(TOKEN);
    handle.release();

    // The old row is still readable during the rotation window.
    const legacy = await rotatingVault.decryptForRequest({ record, aad, purpose: 'publish' });
    expect(await legacy.use((plaintext) => plaintext)).toBe(TOKEN);
    legacy.release();
  });

  it('re-encrypts a batch and skips rows already on the current key', async () => {
    const first = new LocalMasterKeyProvider(generateLocalMasterKey(), 1);
    const second = new LocalMasterKeyProvider(generateLocalMasterKey(), 2);
    const oldVault = new CredentialVault({ keyProviders: [first] });
    const stale = await oldVault.encrypt({ secret: TOKEN, aad });

    const vault = new CredentialVault({ keyProviders: [first, second] });
    const fresh = await vault.encrypt({ secret: TOKEN, aad });

    const outcome = await vault.reencryptBatch([
      { record: stale, aad },
      { record: fresh, aad },
    ]);
    expect(outcome.skipped).toBe(1);
    expect(outcome.rotated).toHaveLength(1);
    expect(outcome.rotated[0]?.record.keyVersion).toBe(2);
  });

  it('rejects a master key of the wrong length', () => {
    expect(() => new LocalMasterKeyProvider('c2hvcnQ=', 1)).toThrow(RelayError);
  });

  it('refuses to build without any key material', () => {
    expect(() => createCredentialVault({})).toThrow(RelayError);
  });
});

describe('redaction of the whole vault surface', () => {
  it('keeps the plaintext out of logs, audit events and sanitized payloads', async () => {
    const logger = capturingLogger();
    const vault = new CredentialVault({
      keyProviders: [new LocalMasterKeyProvider(generateLocalMasterKey(), 1)],
      clock: fixedClock('2026-08-04T12:00:00.000Z'),
      logger,
    });
    const record = await vault.encrypt({ secret: TOKEN, aad });
    const handle = await vault.decryptForRequest({ record, aad, purpose: 'publish' });
    await handle.use((plaintext) => plaintext.length);
    handle.release();

    expect(logger.serialized()).not.toContain(TOKEN);
    expect(JSON.stringify(record)).not.toContain(TOKEN);
    expect(JSON.stringify(sanitizeProviderPayload({ handle, record }))).not.toContain(TOKEN);
  });
});
