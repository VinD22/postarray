import {
  BUILT_IN_PROVIDERS,
  ProviderHttpClient,
  connectorVaultFromHandles,
  createConnectorRegistry,
  registerBuiltInProviders,
  type ConnectorLogger,
} from '@relay/connectors';
import {
  detectCapabilities,
  VERIFIED_PRODUCTION_CONNECTORS,
  type RelayConfig,
} from '@relay/config';
import {
  ERROR_CODES,
  RelayError,
  type CapabilitySnapshot,
  type ProviderId,
} from '@relay/contracts';
import type { Clock, ConnectorRegistry as ApplicationConnectorRegistry } from '@relay/application';
import type { Logger } from '@relay/observability';

/**
 * The provider package owns registration, while application owns policy. This
 * adapter is the narrow seam between them. A provider is visible to an
 * application service only when the capability detector reports `live`, which
 * includes the explicit definition-of-done allow-list. Credentials alone never
 * make a connector customer-visible.
 *
 * Capability execution remains deliberately unavailable here. It needs the
 * workspace-scoped credential resolver and the worker gateway, which will be
 * added with the first provider dossier. Keeping the method explicit prevents
 * the runtime from accidentally treating a registered adapter as publishable.
 */
export class VerifiedConnectorRegistry implements ApplicationConnectorRegistry {
  readonly #registry: ReturnType<typeof createConnectorRegistry>;
  readonly #capabilities: ReturnType<typeof detectCapabilities>;

  constructor(
    registry: ReturnType<typeof createConnectorRegistry>,
    capabilities: ReturnType<typeof detectCapabilities>,
  ) {
    this.#registry = registry;
    this.#capabilities = capabilities;
  }

  has(provider: ProviderId): boolean {
    if (provider === 'fake') return false;
    try {
      return this.#registry.describe(provider, this.#capabilities).configured;
    } catch {
      return false;
    }
  }

  async capabilitiesFor(input: {
    readonly provider: ProviderId;
    readonly connectionId: string;
    readonly accountType: string;
  }): Promise<CapabilitySnapshot> {
    throw new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, {
      details: {
        reason: 'connector_execution_gateway_not_wired',
        provider: input.provider,
        connectionId: input.connectionId,
        accountType: input.accountType,
      },
    });
  }
}

function connectorLogger(logger: Logger): ConnectorLogger {
  return {
    debug(fields, message): void {
      logger.debug(fields, message);
    },
    info(fields, message): void {
      logger.info(fields, message);
    },
    warn(fields, message): void {
      logger.warn(fields, message);
    },
    error(fields, message): void {
      logger.error(fields, message);
    },
  };
}

/**
 * Compose every adapter for capability introspection without giving any
 * adapter a usable credential vault. The registry marks each adapter with its
 * exact configuration/verification reason, while calls that would cause an
 * external side effect still fail closed in the application gateway.
 */
export function createVerifiedConnectorRegistry(input: {
  readonly config: RelayConfig;
  readonly logger: Logger;
  readonly clock: Clock;
}): VerifiedConnectorRegistry {
  const capabilities = detectCapabilities(input.config);
  const registry = createConnectorRegistry([], { clock: input.clock });
  const http = new ProviderHttpClient({
    provider: 'fake',
    clock: input.clock,
    logger: connectorLogger(input.logger),
  });
  const vault = connectorVaultFromHandles(new Map());
  registerBuiltInProviders(
    registry,
    {
      http: http.asHttpClient(),
      vault,
      clock: input.clock,
      logger: connectorLogger(input.logger),
      config: input.config,
      redirectBaseUrl: input.config.core.apiUrl ?? 'http://127.0.0.1',
    },
    { verifiedProviders: VERIFIED_PRODUCTION_CONNECTORS },
  );

  // Keep this assertion close to composition. It makes an accidental provider
  // omission a boot-time failure instead of a silently incomplete capability
  // matrix when a new built-in adapter is added.
  if (registry.providers().length !== BUILT_IN_PROVIDERS.length) {
    throw new RelayError(ERROR_CODES.INTERNAL, {
      details: {
        reason: 'built_in_connector_registration_incomplete',
        expected: BUILT_IN_PROVIDERS.length,
        actual: registry.providers().length,
      },
    });
  }
  return new VerifiedConnectorRegistry(registry, capabilities);
}
