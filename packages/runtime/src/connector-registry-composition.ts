import {
  ProviderHttpClient,
  createAppPasswordSession,
  externalAccountSchema,
  leaseSecret,
  oauthGrantInputSchema,
  type CredentialVault,
} from '@relay/connectors';
import type { RelayConfig } from '@relay/config';
import {
  ERROR_CODES,
  RelayError,
  type AccountType,
  type CapabilitySnapshot,
  type ProviderId,
} from '@relay/contracts';
import { createOAuthGateway } from '@relay/application';
import type {
  Clock,
  ConnectorRegistry as ApplicationConnectorRegistry,
  CredentialStorePort,
  OAuthDiscoveryResult,
} from '@relay/application';
import type { RelayPrismaClient } from '@relay/database';
import type { Logger } from '@relay/observability';

import { ConnectorExecutionGateway } from './connector-execution';
import { createOAuthProviderResolver } from './oauth-provider-resolver';
import { createWorkspaceCredentialResolver, type ConnectionDetails } from './workspace-credentials';
import { connectorLogger, type VerifiedConnectorRegistry } from './verified-connectors';

/**
 * The application-facing connector registry, assembled from the parts that only
 * exist at the outer runtime boundary.
 *
 * `VerifiedConnectorRegistry` answers "is this adapter allowed to exist" and
 * owns the PKCE authorization URL. It deliberately cannot execute anything,
 * because execution needs a credential vault and a credential store and it has
 * neither. This factory supplies both and composes the seams the application
 * actually calls:
 *
 * - `has` and `beginOAuth` delegate to the base registry unchanged.
 * - `completeOAuth` is the application's own OAuth gateway over a runtime
 *   provider resolver.
 * - `capabilitiesFor` and `completeProviderSecretAuth` run through the same
 *   `ConnectorExecutionGateway` the worker uses.
 *
 * The base registry is wrapped, never subclassed and never mutated, so its
 * tests keep describing the object they were written against.
 */

export interface ComposedConnectorRegistryOptions {
  readonly base: VerifiedConnectorRegistry;
  readonly prisma: RelayPrismaClient;
  readonly credentialStore: CredentialStorePort;
  readonly credentialVault: CredentialVault;
  readonly config: RelayConfig;
  readonly logger: Logger;
  readonly clock: Clock;
}

/**
 * Translate the storage account-type enum into the contract vocabulary.
 *
 * `fromStoredAccountType` in `packages/application/src/internal/mappers.ts` is
 * package-internal and may not be imported across a package boundary, so this
 * is a deliberate local copy of the same total mapping the worker keeps in
 * `apps/worker/src/connector-execution-activities.ts`. Total and explicit
 * rather than a cast, so an unknown column value lands on a documented default
 * instead of a wrong enum inside a capability snapshot.
 */
function accountTypeFromStored(stored: string): AccountType {
  switch (stored) {
    case 'creator_account':
      return 'creator_profile';
    case 'business_account':
      return 'business_profile';
    case 'page':
      return 'page';
    case 'organization':
      return 'organization';
    case 'channel':
      return 'channel';
    case 'group':
      return 'group';
    case 'personal_profile':
      return 'personal_profile';
    default:
      return 'personal_profile';
  }
}

function compositionError(
  code: (typeof ERROR_CODES)[keyof typeof ERROR_CODES],
  reason: string,
  details: Record<string, unknown> = {},
): RelayError {
  return new RelayError(code, {
    messageKey:
      code === ERROR_CODES.NOT_FOUND
        ? 'error.connection_not_found.message'
        : code === ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED
          ? 'errors.capability_not_implemented'
          : 'error.internal.message',
    details: { reason, ...details },
  });
}

export function createComposedConnectorRegistry(
  options: ComposedConnectorRegistryOptions,
): ApplicationConnectorRegistry {
  const credentials = createWorkspaceCredentialResolver({
    store: options.credentialStore,
    vault: options.credentialVault,
  });
  const gateway = new ConnectorExecutionGateway({
    registry: options.base,
    credentials,
    clock: options.clock,
  });
  const oauth = createOAuthGateway({
    resolver: createOAuthProviderResolver({
      base: options.base,
      config: options.config,
      logger: options.logger,
      clock: options.clock,
    }),
  });

  /**
   * Load the connection the application named.
   *
   * The application port carries no workspace id, so the row's own
   * `workspaceId` is the binding, and `ConnectorExecutionGateway` re-checks it
   * against connection details built from that very same row. Every caller has
   * already resolved this id inside its own workspace-scoped, authorized
   * transaction; this read only recovers the fields that transaction did not
   * pass along.
   */
  async function connectionDetails(input: {
    readonly provider: ProviderId;
    readonly connectionId: string;
  }): Promise<ConnectionDetails> {
    const row = await options.prisma.socialConnection.findFirst({
      where: { id: input.connectionId },
      select: {
        workspaceId: true,
        provider: true,
        externalAccountId: true,
        displayName: true,
        accountType: true,
        grantedScopes: true,
      },
    });
    if (row === null) {
      throw compositionError(ERROR_CODES.NOT_FOUND, 'connection_not_found', {
        connectionId: input.connectionId,
      });
    }
    if (row.provider !== input.provider) {
      // Asking about provider A with provider B's connection id is a bug in the
      // caller, not a missing row. Say which it is rather than answering.
      throw compositionError(ERROR_CODES.INTERNAL, 'connection_provider_mismatch', {
        connectionId: input.connectionId,
      });
    }
    return {
      workspaceId: row.workspaceId,
      connectionId: input.connectionId,
      provider: input.provider,
      accountType: accountTypeFromStored(row.accountType),
      externalAccountId: row.externalAccountId,
      displayName: row.displayName,
      grantedScopes: [...row.grantedScopes],
      locale: 'en',
      metadata: {},
    };
  }

  return {
    has(provider: ProviderId): boolean {
      return options.base.has(provider);
    },

    beginOAuth(input) {
      // PKCE, application state and the stored redirect binding stay with the
      // base registry, which owns them and has the tests that prove it.
      return options.base.beginOAuth(input);
    },

    completeOAuth: oauth.completeOAuth,

    async capabilitiesFor(input: {
      readonly provider: ProviderId;
      readonly connectionId: string;
      readonly accountType: string;
    }): Promise<CapabilitySnapshot> {
      const connection = await connectionDetails(input);
      return await gateway.capabilitiesFor({
        workspaceId: connection.workspaceId,
        connection,
      });
    },

    /**
     * Bluesky connects with an app password, not an authorization code.
     *
     * Its `authorization()` is `provider_specific`, so neither the PKCE URL
     * builder nor the standard code exchange applies. The app password is
     * exchanged once, here, for an AT Protocol session pair. The app password
     * itself is never persisted, and the caller receives exactly the shape PKCE
     * discovery returns, so the rest of the connect flow is unchanged.
     */
    async completeProviderSecretAuth(input): Promise<OAuthDiscoveryResult> {
      if (input.provider !== 'bluesky') {
        throw compositionError(
          ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
          'provider_secret_auth_not_supported',
          { provider: input.provider, capability: 'oauth_completion' },
        );
      }
      const connector = options.base.verifiedConnector('bluesky', 'discover_accounts');
      const definition = connector.authorization();
      const http = new ProviderHttpClient({
        provider: 'bluesky',
        clock: options.clock,
        logger: connectorLogger(options.logger),
      });
      const credential = await createAppPasswordSession({
        http: http.asHttpClient(),
        // The connector declares its own session endpoint, including the
        // configured PDS host. Rebuilding the URL here would let the two drift.
        sessionUrl: definition.tokenUrl,
        identifier: input.identifier,
        appPassword: input.secret,
        grantedScopes: definition.scopes.map((scope) => scope.scope),
        clock: options.clock,
      });

      const accessToken = leaseSecret({
        secret: credential.accessToken,
        credentialKind: 'access_token',
        purpose: 'oauth_account_discovery',
        clock: options.clock,
      });
      const refreshToken =
        credential.refreshToken === null
          ? null
          : leaseSecret({
              secret: credential.refreshToken,
              credentialKind: 'refresh_token',
              purpose: 'oauth_account_discovery',
              clock: options.clock,
            });
      try {
        const grant = oauthGrantInputSchema.parse({
          provider: 'bluesky',
          workspaceId: input.workspaceId,
          accessToken,
          refreshToken,
          grantedScopes: [...credential.grantedScopes],
          obtainedAt: credential.obtainedAt,
          accessTokenExpiresAt: credential.expiresAt,
          grantMetadata: {},
        });
        const accounts = externalAccountSchema
          .array()
          .parse(await connector.discoverAccounts(grant));
        return { credential, accounts };
      } finally {
        refreshToken?.release();
        accessToken.release();
      }
    },
  };
}
