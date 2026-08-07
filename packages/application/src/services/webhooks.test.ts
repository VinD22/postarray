import { createCredentialVault } from '@relay/connectors';
import { describe, expect, it } from 'vitest';

import {
  encryptWebhookSigningSecret,
  listWebhookSigningSecrets,
  webhookSigningSecretAad,
} from '../internal/webhook-signing-secret';
import {
  webhookPreviousSigningSecretEnvelopeFromRow,
  webhookSigningSecretEnvelopeFromRow,
  webhookSigningSecretEnvelopeToRow,
} from '../webhook-signing-secret-envelope';

const LOCAL_KEY = Buffer.alloc(32, 41).toString('base64');

describe('webhook signing secret envelope', () => {
  it('round-trips through the vault without storing plaintext in the row mapper', async () => {
    const vault = createCredentialVault({ localKeyBase64: LOCAL_KEY });
    const signingSecret = 'whsec_test_signing_secret_value_0123456789';
    const workspaceId = 'ws_test';
    const endpointId = 'whep_test';

    const envelope = await encryptWebhookSigningSecret(vault, {
      workspaceId,
      endpointId,
      signingSecret,
    });
    const row = webhookSigningSecretEnvelopeToRow(envelope);
    expect(row.secretCiphertext.toString('utf8')).not.toContain(signingSecret);

    const restored = webhookSigningSecretEnvelopeFromRow({
      ...row,
      secretEnvelopeVersion: row.secretEnvelopeVersion,
      createdAt: new Date('2026-08-07T00:00:00.000Z'),
    });
    expect(restored.aadContext).toEqual(webhookSigningSecretAad({ workspaceId, endpointId }));

    const secrets = await listWebhookSigningSecrets(
      {
        encrypt: vault.encrypt.bind(vault),
        decrypt: async (input) => {
          const handle = await vault.decryptForRequest({
            record: input.record,
            aad: input.aad,
            purpose: input.purpose ?? 'test',
          });
          try {
            return await handle.use((value) => value);
          } finally {
            handle.release();
          }
        },
      },
      {
        workspaceId,
        id: endpointId,
        secretCiphertext: row.secretCiphertext,
        secretNonce: row.secretNonce,
        secretAuthTag: row.secretAuthTag,
        secretWrappedDataKey: row.secretWrappedDataKey,
        keyVersion: row.keyVersion,
        secretAadContext: row.secretAadContext,
        secretEnvelopeVersion: row.secretEnvelopeVersion,
        algorithm: row.algorithm,
        previousSecretCiphertext: null,
        previousSecretNonce: null,
        previousSecretAuthTag: null,
        previousSecretWrappedDataKey: null,
        previousSecretKeyVersion: null,
        previousSecretAadContext: null,
        previousSecretEnvelopeVersion: null,
        previousSecretExpiresAt: null,
        createdAt: new Date('2026-08-07T00:00:00.000Z'),
      },
      new Date('2026-08-07T00:00:00.000Z'),
    );
    expect(secrets).toEqual([signingSecret]);
  });

  it('includes the previous secret during the overlap window', async () => {
    const vault = createCredentialVault({ localKeyBase64: LOCAL_KEY });
    const workspaceId = 'ws_test';
    const endpointId = 'whep_test';
    const previous = await encryptWebhookSigningSecret(vault, {
      workspaceId,
      endpointId,
      signingSecret: 'whsec_previous',
    });
    const previousRow = webhookSigningSecretEnvelopeToRow(previous);

    const previousEnvelope = webhookPreviousSigningSecretEnvelopeFromRow({
      previousSecretCiphertext: previousRow.secretCiphertext,
      previousSecretNonce: previousRow.secretNonce,
      previousSecretAuthTag: previousRow.secretAuthTag,
      previousSecretWrappedDataKey: previousRow.secretWrappedDataKey,
      previousSecretKeyVersion: previousRow.keyVersion,
      previousSecretAadContext: previousRow.secretAadContext,
      previousSecretEnvelopeVersion: 1,
      createdAt: new Date('2026-08-07T00:00:00.000Z'),
    });
    expect(previousEnvelope).not.toBeNull();
  });
});
