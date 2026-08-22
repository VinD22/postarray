import {
  createCredentialVault,
  type CredentialVault,
  type Clock,
  type KmsClient,
  type VaultAuditEvent,
} from '@relay/connectors';
import type { CredentialVaultPort } from '@relay/application';
import type { RelayConfig } from '@relay/config';
import { ERROR_CODES, RelayError } from '@relay/contracts';
import {
  DecryptCommand,
  EncryptCommand,
  KMSClient,
  type KMSClientConfig,
} from '@aws-sdk/client-kms';
import type { Logger } from '@relay/observability';

export function asCredentialVaultPort(vault: CredentialVault): CredentialVaultPort {
  return {
    encrypt: (input) => vault.encrypt(input),
    decryptForRequest: (input) => vault.decryptForRequest(input),
    decrypt: async ({ record, aad, purpose }) => {
      const handle = await vault.decryptForRequest({
        record,
        aad,
        purpose: purpose ?? 'oauth_pending_grant',
      });
      try {
        return await handle.use((plaintext) => plaintext);
      } finally {
        handle.release();
      }
    },
  };
}

/** The configured vault plus the cloud client it owns. */
export interface ConfiguredCredentialVault {
  readonly vault: CredentialVault;
  close(): void;
}

function vaultError(operation: string, cause?: unknown): RelayError {
  return new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
    messageKey: 'errors.provider_unavailable',
    details: { subsystem: 'kms', operation },
    ...(cause === undefined ? {} : { cause }),
  });
}

/** AWS SDK adapter reduced to the connector vault's narrow KMS port. */
export class AwsCredentialKmsClient implements KmsClient {
  readonly #client: KMSClient;

  constructor(options: KMSClientConfig = {}) {
    this.#client = new KMSClient(options);
  }

  async encrypt(input: { readonly keyId: string; readonly plaintext: Buffer }): Promise<Buffer> {
    try {
      const result = await this.#client.send(
        new EncryptCommand({ KeyId: input.keyId, Plaintext: input.plaintext }),
      );
      if (result.CiphertextBlob === undefined || result.CiphertextBlob.byteLength === 0) {
        throw vaultError('encrypt_ciphertext_missing');
      }
      return Buffer.from(result.CiphertextBlob);
    } catch (cause) {
      if (cause instanceof RelayError) throw cause;
      throw vaultError('encrypt', cause);
    }
  }

  async decrypt(input: { readonly keyId: string; readonly ciphertext: Buffer }): Promise<Buffer> {
    try {
      const result = await this.#client.send(
        new DecryptCommand({ KeyId: input.keyId, CiphertextBlob: input.ciphertext }),
      );
      if (result.Plaintext === undefined || result.Plaintext.byteLength === 0) {
        throw vaultError('decrypt_plaintext_missing');
      }
      return Buffer.from(result.Plaintext);
    } catch (cause) {
      if (cause instanceof RelayError) throw cause;
      throw vaultError('decrypt', cause);
    }
  }

  close(): void {
    this.#client.destroy();
  }
}

function auditLogger(logger: Logger): (event: VaultAuditEvent) => void {
  return (event) => {
    logger.debug(
      {
        action: event.action,
        purpose: event.purpose,
        workspaceId: event.workspaceId,
        connectionId: event.connectionId,
        provider: event.provider,
        credentialKind: event.credentialKind,
        keyVersion: event.keyVersion,
        at: event.at,
      },
      'credential_vault.access',
    );
  };
}

/**
 * Configure the credential vault at the outer runtime boundary.
 *
 * A local key is accepted only outside production. Production composition
 * requires KMS, even if the config loader has reported a degraded local-key
 * capability. Returning `null` keeps OAuth completion fail-closed.
 */
export function createConfiguredCredentialVault(input: {
  readonly config: Pick<RelayConfig, 'core' | 'encryption'>;
  readonly logger: Logger;
  readonly clock?: Clock;
}): ConfiguredCredentialVault | null {
  const encryption = input.config.encryption;
  if (encryption.kmsKeyId !== undefined) {
    const kms = new AwsCredentialKmsClient({ region: encryption.kmsRegion });
    const vault = createCredentialVault({
      kms: { client: kms, keyId: encryption.kmsKeyId, keyVersion: 1 },
      ...(input.clock === undefined ? {} : { clock: input.clock }),
      onAudit: auditLogger(input.logger),
    });
    return { vault, close: () => kms.close() };
  }

  if (encryption.localKey === undefined || input.config.core.isProduction) {
    return null;
  }

  return {
    vault: createCredentialVault({
      localKeyBase64: encryption.localKey,
      localKeyVersion: 1,
      ...(input.clock === undefined ? {} : { clock: input.clock }),
      onAudit: auditLogger(input.logger),
    }),
    close(): void {},
  };
}
