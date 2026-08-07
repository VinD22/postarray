import type { CredentialStorePort, Clock } from '@relay/application';
import type { RelayConfig } from '@relay/config';
import type { RelayPrismaClient } from '@relay/database';
import type { Logger } from '@relay/observability';
import {
  ConnectorExecutionGateway,
  createConfiguredCredentialVault,
  createCredentialStore,
  createVerifiedConnectorRegistry,
  createWorkspaceCredentialResolver,
} from '@relay/runtime';

type ConfiguredVault = NonNullable<ReturnType<typeof createConfiguredCredentialVault>>;

/**
 * Process-owned connector infrastructure passed to an optional gateway
 * module. The default prelaunch gateway does not consume it, so constructing
 * the seam cannot make an unverified provider callable by accident.
 */
export interface WorkerConnectorRuntime {
  readonly gateway: ConnectorExecutionGateway | null;
  readonly credentialStore: CredentialStorePort;
  readonly credentialVault: ConfiguredVault['vault'] | null;
  close(): void;
}

export function createWorkerConnectorRuntime(input: {
  readonly config: RelayConfig;
  readonly logger: Logger;
  readonly prisma: RelayPrismaClient;
  readonly clock: Clock;
}): WorkerConnectorRuntime {
  const credentialStore = createCredentialStore(input.prisma);
  const configuredVault = createConfiguredCredentialVault({
    config: input.config,
    logger: input.logger,
    clock: input.clock,
  });

  if (configuredVault === null) {
    return {
      gateway: null,
      credentialStore,
      credentialVault: null,
      close(): void {},
    };
  }

  const registry = createVerifiedConnectorRegistry({
    config: input.config,
    logger: input.logger,
    clock: input.clock,
  });
  const credentials = createWorkspaceCredentialResolver({
    store: credentialStore,
    vault: configuredVault.vault,
  });

  return {
    gateway: new ConnectorExecutionGateway({
      registry,
      credentials,
      clock: input.clock,
    }),
    credentialStore,
    credentialVault: configuredVault.vault,
    close: configuredVault.close,
  };
}
