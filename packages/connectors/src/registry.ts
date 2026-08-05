import {
  type CapabilityStatus,
  type ConnectorKey,
  type RuntimeCapabilities,
  capabilityLevel,
  capabilityReason,
  isUsable,
  missingEnvVars,
} from '@relay/config';
import {
  type CapabilitySupport,
  type ProviderId,
  NotFoundError,
  RelayError,
} from '@relay/contracts';

import {
  CONNECTOR_CONTRACT_VERSION,
  CONNECTOR_FEATURES,
  type ConnectorFeature,
  type ConnectorLabel,
  OPTIONAL_METHOD_FEATURES,
  type ProviderIdentity,
  type SocialConnector,
  providerIdentitySchema,
} from './contract';
import { type Clock, epochMillisecondsOf, systemClock } from './ports';

/**
 * The connector registry.
 *
 * It answers three questions and refuses to blur them:
 *
 * 1. Which connectors exist in this build.
 * 2. Which of them are configured right now, so the connect flow can hide the
 *    rest instead of offering a button that cannot work.
 * 3. For every provider and every feature, whether it is `supported`,
 *    `unsupported`, `not_implemented` or `requires_review`.
 *
 * "The provider cannot" (`unsupported`) and "we have not built it"
 * (`not_implemented`) are different states. Registration fails loudly when a
 * connector's declaration disagrees with the methods it actually implements,
 * because a capability page that lies is worse than no capability page.
 */

export interface ConnectorFeatureReport {
  readonly feature: ConnectorFeature;
  readonly support: CapabilitySupport;
  /** Whether the optional interface method backing this feature exists. */
  readonly methodPresent: boolean;
}

export interface ConnectorDescriptor {
  readonly provider: ProviderId;
  readonly displayName: string;
  readonly iconToken: string;
  /** The label the connector claims. */
  readonly declaredLabel: ConnectorLabel;
  /**
   * The label we may actually show. A connector whose policy review date has
   * passed drops to `beta` until it is reviewed again, per the definition of
   * done gate.
   */
  readonly effectiveLabel: ConnectorLabel;
  readonly policyReviewOverdue: boolean;
  readonly limitationKey: string | null;
  readonly contractVersion: string;
  readonly connectorVersion: string;
  readonly accountTypes: ProviderIdentity['accountTypes'];
  readonly officialDocsUrl: string;
  readonly officialPolicyUrl: string;
  readonly engineeringOwner: string;
  readonly policyOwner: string;
  readonly lastPolicyReviewAt: string;
  readonly nextPolicyReviewAt: string;
  readonly configuration: CapabilityStatus;
  readonly configured: boolean;
  readonly missingEnvVars: readonly string[];
  readonly features: readonly ConnectorFeatureReport[];
}

export interface RegisterOptions {
  /**
   * Overrides the configuration status. Omit to let `listAvailable` read it
   * from `detectCapabilities()`.
   */
  readonly configuration?: CapabilityStatus;
}

interface Registration {
  readonly connector: SocialConnector;
  readonly identity: ProviderIdentity;
  configuration: CapabilityStatus | undefined;
}

function registrationError(reason: string, details: Record<string, unknown>): RelayError {
  return new RelayError('INTERNAL', {
    messageKey: 'error.internal.message',
    details: { reason, ...details },
  });
}

/**
 * A declaration must match reality. Registration fails when it does not, so the
 * mismatch is a failing test rather than a wrong capability page in production.
 */
export function assertDeclarationMatchesMethods(
  connector: SocialConnector,
  identity: ProviderIdentity,
): void {
  for (const [methodName, feature] of Object.entries(OPTIONAL_METHOD_FEATURES)) {
    const present =
      typeof (connector as unknown as Record<string, unknown>)[methodName] === 'function';
    const declared = identity.features[feature];
    if (declared === 'supported' && !present) {
      throw registrationError('CONNECTOR_DECLARES_UNIMPLEMENTED_FEATURE', {
        provider: identity.provider,
        feature,
        methodName,
      });
    }
    if (declared === 'unsupported' && present) {
      throw registrationError('CONNECTOR_HIDES_IMPLEMENTED_FEATURE', {
        provider: identity.provider,
        feature,
        methodName,
      });
    }
  }
}

export class ConnectorRegistry {
  readonly #registrations = new Map<ProviderId, Registration>();
  readonly #clock: Clock;

  constructor(options: { readonly clock?: Clock } = {}) {
    this.#clock = options.clock ?? systemClock;
  }

  register(connector: SocialConnector, options: RegisterOptions = {}): this {
    const identity = providerIdentitySchema.parse(connector.identity());
    if (identity.contractVersion !== CONNECTOR_CONTRACT_VERSION) {
      throw registrationError('CONNECTOR_CONTRACT_VERSION_MISMATCH', {
        provider: identity.provider,
        declared: identity.contractVersion,
        expected: CONNECTOR_CONTRACT_VERSION,
      });
    }
    if (this.#registrations.has(identity.provider)) {
      throw registrationError('CONNECTOR_ALREADY_REGISTERED', { provider: identity.provider });
    }
    assertDeclarationMatchesMethods(connector, identity);
    this.#registrations.set(identity.provider, {
      connector,
      identity,
      configuration: options.configuration,
    });
    return this;
  }

  /**
   * Mark a provider unavailable at runtime: missing configuration at boot, a
   * failed health check, or an operator pulling it during an incident. The
   * connector stays registered and keeps telling the truth about why.
   */
  markUnavailable(provider: ProviderId, status: string): void {
    const registration = this.#registrations.get(provider);
    if (registration === undefined) {
      throw new NotFoundError({
        messageKey: 'error.not_found.message',
        details: { resource: 'connector', provider },
      });
    }
    registration.configuration = status.startsWith('disabled:')
      ? (status as CapabilityStatus)
      : (`disabled:${status}` as CapabilityStatus);
  }

  /** Clear a runtime override so detection decides again. */
  markAvailable(provider: ProviderId, status: CapabilityStatus = 'live'): void {
    const registration = this.#registrations.get(provider);
    if (registration !== undefined) {
      registration.configuration = status;
    }
  }

  has(provider: ProviderId): boolean {
    return this.#registrations.has(provider);
  }

  /** Throws `NOT_FOUND` when the provider is not part of this build. */
  get(provider: ProviderId): SocialConnector {
    const registration = this.#registrations.get(provider);
    if (registration === undefined) {
      throw new NotFoundError({
        messageKey: 'error.not_found.message',
        details: { resource: 'connector', provider },
      });
    }
    return registration.connector;
  }

  /** Every registered connector, configured or not. */
  list(): readonly SocialConnector[] {
    return [...this.#registrations.values()].map((registration) => registration.connector);
  }

  providers(): readonly ProviderId[] {
    return [...this.#registrations.keys()];
  }

  identity(provider: ProviderId): ProviderIdentity {
    const registration = this.#registrations.get(provider);
    if (registration === undefined) {
      throw new NotFoundError({
        messageKey: 'error.not_found.message',
        details: { resource: 'connector', provider },
      });
    }
    return registration.identity;
  }

  featureSupport(provider: ProviderId, feature: ConnectorFeature): CapabilitySupport {
    return this.identity(provider).features[feature];
  }

  #configurationOf(
    registration: Registration,
    capabilities: RuntimeCapabilities | undefined,
  ): CapabilityStatus {
    if (registration.configuration !== undefined) {
      return registration.configuration;
    }
    if (capabilities === undefined) {
      return 'live';
    }
    return capabilities.connectors[registration.identity.provider as ConnectorKey];
  }

  #describe(
    registration: Registration,
    capabilities: RuntimeCapabilities | undefined,
  ): ConnectorDescriptor {
    const identity = registration.identity;
    const configuration = this.#configurationOf(registration, capabilities);
    const overdue = epochMillisecondsOf(identity.nextPolicyReviewAt) < this.#clock.now().getTime();
    const features: ConnectorFeatureReport[] = CONNECTOR_FEATURES.map((feature) => {
      const methodName = Object.entries(OPTIONAL_METHOD_FEATURES).find(
        ([, backed]) => backed === feature,
      )?.[0];
      const methodPresent =
        methodName === undefined
          ? true
          : typeof (registration.connector as unknown as Record<string, unknown>)[methodName] ===
            'function';
      return { feature, support: identity.features[feature], methodPresent };
    });

    return {
      provider: identity.provider,
      displayName: identity.displayName,
      iconToken: identity.iconToken,
      declaredLabel: identity.label,
      effectiveLabel: overdue && identity.label === 'supported' ? 'beta' : identity.label,
      policyReviewOverdue: overdue,
      limitationKey: identity.limitationKey,
      contractVersion: identity.contractVersion,
      connectorVersion: identity.connectorVersion,
      accountTypes: identity.accountTypes,
      officialDocsUrl: identity.officialDocsUrl,
      officialPolicyUrl: identity.officialPolicyUrl,
      engineeringOwner: identity.engineeringOwner,
      policyOwner: identity.policyOwner,
      lastPolicyReviewAt: identity.lastPolicyReviewAt,
      nextPolicyReviewAt: identity.nextPolicyReviewAt,
      configuration,
      configured: isUsable(configuration),
      missingEnvVars: missingEnvVars(configuration),
      features,
    };
  }

  describe(provider: ProviderId, capabilities?: RuntimeCapabilities): ConnectorDescriptor {
    const registration = this.#registrations.get(provider);
    if (registration === undefined) {
      throw new NotFoundError({
        messageKey: 'error.not_found.message',
        details: { resource: 'connector', provider },
      });
    }
    return this.#describe(registration, capabilities);
  }

  /** Everything the public capability page and the admin panel render. */
  describeAll(capabilities?: RuntimeCapabilities): readonly ConnectorDescriptor[] {
    return [...this.#registrations.values()].map((registration) =>
      this.#describe(registration, capabilities),
    );
  }

  /**
   * Connectors whose credentials are configured. A connector with no keys is
   * hidden from user-facing flows and reports "not configured", and its absence
   * never breaks another surface.
   */
  listAvailable(capabilities?: RuntimeCapabilities): readonly SocialConnector[] {
    return [...this.#registrations.values()]
      .filter((registration) => isUsable(this.#configurationOf(registration, capabilities)))
      .map((registration) => registration.connector);
  }

  /** The unconfigured ones, with the exact variables an operator must set. */
  listUnavailable(
    capabilities?: RuntimeCapabilities,
  ): readonly { provider: ProviderId; reason: string; requiredEnvVars: readonly string[] }[] {
    return [...this.#registrations.values()]
      .map((registration) => ({
        registration,
        status: this.#configurationOf(registration, capabilities),
      }))
      .filter((entry) => !isUsable(entry.status))
      .map((entry) => ({
        provider: entry.registration.identity.provider,
        reason: capabilityReason(entry.status) ?? 'unavailable',
        requiredEnvVars: missingEnvVars(entry.status),
      }));
  }

  /**
   * The full provider by feature matrix, for the capability page and for the
   * MCP `get_capabilities` tool. Static declarations only: a live account's
   * limits always come from its `CapabilitySnapshot`.
   */
  supportMatrix(capabilities?: RuntimeCapabilities): readonly {
    provider: ProviderId;
    label: ConnectorLabel;
    configured: boolean;
    configurationLevel: ReturnType<typeof capabilityLevel>;
    features: Readonly<Record<ConnectorFeature, CapabilitySupport>>;
  }[] {
    return this.describeAll(capabilities).map((descriptor) => ({
      provider: descriptor.provider,
      label: descriptor.effectiveLabel,
      configured: descriptor.configured,
      configurationLevel: capabilityLevel(descriptor.configuration),
      features: Object.fromEntries(
        descriptor.features.map((report) => [report.feature, report.support]),
      ) as Record<ConnectorFeature, CapabilitySupport>,
    }));
  }
}

/** Build a registry from a list of connectors. */
export function createConnectorRegistry(
  connectors: readonly SocialConnector[],
  options: { readonly clock?: Clock } = {},
): ConnectorRegistry {
  const registry = new ConnectorRegistry(options);
  for (const connector of connectors) {
    registry.register(connector);
  }
  return registry;
}
