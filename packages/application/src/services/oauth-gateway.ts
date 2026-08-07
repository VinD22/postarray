import {
  createAuthorizationUrl,
  exchangeAndDiscoverAccounts,
  normalizeRedirectUri,
} from '@relay/connectors';
import {
  CapabilityNotImplementedError,
  ERROR_CODES,
  RelayError,
  type ProviderId,
} from '@relay/contracts';
import type { ExternalAccount } from '@relay/connectors';

import type {
  ConnectorRegistry,
  OAuthDiscoveryResult,
  OAuthProviderBinding,
  OAuthProviderResolver,
} from '../types';

type BeginOAuth = NonNullable<ConnectorRegistry['beginOAuth']>;
type CompleteOAuth = NonNullable<ConnectorRegistry['completeOAuth']>;

export interface OAuthGateway {
  readonly beginOAuth: BeginOAuth;
  readonly completeOAuth: CompleteOAuth;
}

/**
 * Validate the account IDs a person selected after discovery. Providers can
 * return several Pages, organizations or profiles from one grant, so callers
 * must never silently attach every eligible account to a workspace. This
 * helper is deliberately pure and provider-neutral; the persistence layer can
 * call it immediately before encrypting and writing the selected credentials.
 */
export function selectOAuthAccounts(
  accounts: readonly ExternalAccount[],
  selectedExternalAccountIds: readonly string[],
): readonly ExternalAccount[] {
  if (selectedExternalAccountIds.length === 0) {
    throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'OAUTH_ACCOUNT_SELECTION_EMPTY' },
    });
  }

  const byExternalId = new Map<string, ExternalAccount>();
  for (const account of accounts) {
    if (byExternalId.has(account.externalAccountId)) {
      throw new RelayError(ERROR_CODES.INTERNAL, {
        messageKey: 'error.internal.message',
        details: { reason: 'OAUTH_DISCOVERY_DUPLICATE_ACCOUNT_ID' },
      });
    }
    byExternalId.set(account.externalAccountId, account);
  }

  const selected = new Set<string>();
  const result: ExternalAccount[] = [];
  for (const externalAccountId of selectedExternalAccountIds) {
    if (selected.has(externalAccountId)) {
      throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
        messageKey: 'error.request_invalid.message',
        details: { reason: 'OAUTH_ACCOUNT_SELECTION_DUPLICATE' },
      });
    }
    selected.add(externalAccountId);
    const account = byExternalId.get(externalAccountId);
    if (account === undefined) {
      throw new RelayError(ERROR_CODES.NOT_FOUND, {
        messageKey: 'error.not_found.message',
        details: { resource: 'oauth_account' },
      });
    }
    if (!account.eligible) {
      throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
        messageKey: 'error.request_invalid.message',
        details: { reason: 'OAUTH_ACCOUNT_INELIGIBLE' },
      });
    }
    result.push(account);
  }
  return result;
}

function unavailable(provider: ProviderId, capability: string): CapabilityNotImplementedError {
  return new CapabilityNotImplementedError({
    messageKey: 'errors.capability_not_implemented',
    details: { provider, capability },
  });
}

function bindingOrThrow(
  resolver: OAuthProviderResolver,
  provider: ProviderId,
  capability: string,
): OAuthProviderBinding {
  const binding = resolver.resolve(provider);
  if (binding === null) {
    throw unavailable(provider, capability);
  }
  return binding;
}

function assertRedirectMatchesBinding(binding: OAuthProviderBinding, redirectUri: string): string {
  const configured = normalizeRedirectUri(binding.client.redirectUri);
  const candidate = normalizeRedirectUri(redirectUri);
  if (configured !== candidate) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'OAUTH_REDIRECT_URI_MISMATCH' },
    });
  }
  return configured;
}

function assertStandardPkce(
  definition: ReturnType<OAuthProviderBinding['connector']['authorization']>,
  provider: ProviderId,
  capability: string,
): void {
  if (definition.flavor !== 'oauth2_pkce' || !definition.pkceRequired) {
    throw unavailable(provider, capability);
  }
}

/**
 * Compose the application OAuth port over one provider resolver.
 *
 * This factory intentionally stops after account discovery. It does not know
 * about Prisma, connection IDs or credential rows. Callers must select an
 * eligible account and encrypt the returned token values in one workspace- and
 * connection-bound vault transaction before claiming that a connection exists.
 */
export function createOAuthGateway(input: { resolver: OAuthProviderResolver }): OAuthGateway {
  const beginOAuth: BeginOAuth = async (request) => {
    const binding = bindingOrThrow(input.resolver, request.provider, 'oauth_start');
    const redirectUri = assertRedirectMatchesBinding(binding, request.redirectUri);
    const definition = binding.connector.authorization();
    assertStandardPkce(definition, request.provider, 'oauth_start');
    const authorization = createAuthorizationUrl({
      definition,
      client: { ...binding.client, redirectUri },
      state: request.state,
      codeChallenge: request.codeChallenge,
    });
    return {
      authorizationUrl: authorization.authorizationUrl,
      requestedScopes: authorization.scopes,
    };
  };

  const completeOAuth: CompleteOAuth = async (request): Promise<OAuthDiscoveryResult> => {
    const binding = bindingOrThrow(input.resolver, request.provider, 'oauth_completion');
    const redirectUri = assertRedirectMatchesBinding(binding, request.redirectUri);
    const definition = binding.connector.authorization();
    assertStandardPkce(definition, request.provider, 'oauth_completion');
    return await exchangeAndDiscoverAccounts({
      connector: binding.connector,
      http: binding.http,
      provider: request.provider,
      definition,
      client: { ...binding.client, redirectUri },
      workspaceId: request.workspaceId,
      code: request.code,
      codeVerifier: request.codeVerifier,
      expectedCodeChallenge: request.expectedCodeChallenge,
      ...(binding.clientAuthMethod === undefined
        ? {}
        : { clientAuthMethod: binding.clientAuthMethod }),
    });
  };

  return { beginOAuth, completeOAuth };
}
