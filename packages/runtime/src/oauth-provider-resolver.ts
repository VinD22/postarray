import { ProviderHttpClient, SecretValue, type ClientAuthMethod } from '@relay/connectors';
import type { RelayConfig } from '@relay/config';
import type { ProviderId } from '@relay/contracts';
import type { Clock, OAuthProviderBinding, OAuthProviderResolver } from '@relay/application';
import { socialOAuthCallbackUrl } from '@relay/application';
import type { Logger } from '@relay/observability';

import {
  connectorLogger,
  oauthClientId,
  oauthClientSecret,
  type VerifiedConnectorRegistry,
} from './verified-connectors';

/**
 * The runtime binding the application-owned OAuth gateway asks for.
 *
 * The gateway knows the protocol and owns the transaction. It does not know
 * which adapter is registered, which client credentials are configured or which
 * HTTP client a provider should use. This resolver is the only place those
 * three facts meet, and it answers `null` rather than half a binding whenever
 * one of them is missing, so an unconfigured provider surfaces as
 * `CAPABILITY_NOT_IMPLEMENTED` instead of a failed token call.
 */

export interface OAuthProviderResolverOptions {
  readonly base: VerifiedConnectorRegistry;
  readonly config: RelayConfig;
  readonly logger: Logger;
  readonly clock: Clock;
}

/**
 * How a provider authenticates itself at the token endpoint.
 *
 * `AuthorizationDefinition` carries no field for this today, and no connector
 * dossier in `docs/connectors/` records one, so there is nothing to read. We do
 * not guess: an entry is added here only together with the official provider
 * documentation that justifies it, in the same commit that records the source.
 * Until then the shared token helper's documented default (`body`, the form
 * parameters of RFC 6749 section 2.3.1) applies.
 */
function oauthClientAuthMethod(_provider: ProviderId): ClientAuthMethod | undefined {
  return undefined;
}

export function createOAuthProviderResolver(
  options: OAuthProviderResolverOptions,
): OAuthProviderResolver {
  return {
    resolve(provider: ProviderId): OAuthProviderBinding | null {
      if (!options.base.has(provider)) {
        return null;
      }
      const apiUrl = options.config.core.apiUrl;
      const clientId = oauthClientId(options.config, provider);
      const clientSecret = oauthClientSecret(options.config, provider);
      if (apiUrl === undefined || clientId === undefined || clientSecret === undefined) {
        return null;
      }

      // `verifiedConnector` re-applies both production gates. Reaching into the
      // underlying registry here would let an unverified adapter receive a real
      // client secret.
      const connector = options.base.verifiedConnector(provider, 'discover_accounts');

      // A per-provider client, never the registry's shared one. That client is
      // deliberately constructed with `provider: 'fake'` for capability
      // introspection, so reusing it would file every real token call under the
      // fake provider's rate-limit buckets and error taxonomy.
      const http = new ProviderHttpClient({
        provider,
        clock: options.clock,
        logger: connectorLogger(options.logger),
      });

      const clientAuthMethod = oauthClientAuthMethod(provider);
      return {
        connector,
        http,
        client: {
          clientId,
          clientSecret: new SecretValue(clientSecret, 'client_secret'),
          // The same builder `connections.beginOAuth` used when it stored the
          // transaction, so `assertRedirectMatchesBinding` compares equal
          // values rather than two independently derived strings.
          redirectUri: socialOAuthCallbackUrl(apiUrl, provider),
        },
        ...(clientAuthMethod === undefined ? {} : { clientAuthMethod }),
      };
    },
  };
}
