import { createHash } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';
import { MAX_DYNAMIC_REDIRECT_URIS, isAcceptableDynamicRedirectUri } from '@relay/application';
import { ALL_SCOPES, normalizeScopes, scopeStringSchema, type Scope } from '@relay/contracts';
import type { Logger } from '@relay/observability';

import type { KeyValueStore, Services } from '../application/port';
import { KEY_VALUE_STORE, LOGGER, SERVICES } from '../application/tokens';
import { epochMillis } from '../common/instant';
import { CredentialDirectory } from '../security/credential-directory';
import { OAuthProtocolError } from './oauth-errors';
import { THIRD_PARTY_FORBIDDEN_SCOPES } from './oauth-provider.service';
import {
  MAX_REGISTRATION_BYTES,
  SUPPORTED_GRANT_TYPES,
  SUPPORTED_RESPONSE_TYPES,
  clientRegistrationRequestSchema,
  type ClientRegistrationResponse,
} from './registration.schemas';

/**
 * RFC 7591 dynamic client registration, for public clients only.
 *
 * This is how Claude, Claude Desktop and Claude Code connect without anyone
 * creating an app first: the client registers itself, runs the authorization
 * code flow with PKCE, and a signed-in person approves it on the consent
 * screen, which says plainly that the app named itself.
 *
 * Identical registrations are answered with the same client. Every claude.ai
 * user who adds the connector sends the same metadata, and one row for all of
 * them keeps the directory from growing with every click while changing
 * nothing about security: a public client has no secret to share, and every
 * grant is still per person and per workspace.
 */

const DEDUPE_NAMESPACE = 'relay:edge:dcr';

/** Scopes a self-registered client may ever be offered. */
export const DYNAMIC_CLIENT_SCOPES: readonly Scope[] = ALL_SCOPES.filter(
  (scope) => !THIRD_PARTY_FORBIDDEN_SCOPES.includes(scope),
);

function metadataError(description: string): OAuthProtocolError {
  return new OAuthProtocolError('invalid_client_metadata', 400, description);
}

/**
 * A client that sends no name is shown by the host it returns to, which is at
 * least a fact about it. Called only after the URI passed validation.
 */
function hostOf(redirectUri: string): string {
  return new URL(redirectUri).host.slice(0, 120);
}

@Injectable()
export class DynamicRegistrationService {
  constructor(
    @Inject(SERVICES) private readonly services: Services,
    @Inject(KEY_VALUE_STORE) private readonly kv: KeyValueStore,
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly directory: CredentialDirectory,
  ) {}

  private scopesFor(requested: string | undefined): readonly Scope[] {
    if (requested === undefined || requested.length === 0) {
      return DYNAMIC_CLIENT_SCOPES;
    }
    const parsed = scopeStringSchema.safeParse(requested);
    const scopes = parsed.success
      ? normalizeScopes(parsed.data).filter((scope) => DYNAMIC_CLIENT_SCOPES.includes(scope))
      : [];
    if (scopes.length === 0) {
      throw metadataError('scope names nothing a third party may hold');
    }
    return scopes;
  }

  async register(body: unknown): Promise<ClientRegistrationResponse> {
    if (JSON.stringify(body ?? null).length > MAX_REGISTRATION_BYTES) {
      throw metadataError('registration document too large');
    }
    const parsed = clientRegistrationRequestSchema.safeParse(body);
    if (!parsed.success) {
      const onRedirects = parsed.error.issues.some((issue) => issue.path[0] === 'redirect_uris');
      throw onRedirects
        ? new OAuthProtocolError('invalid_redirect_uri', 400, 'redirect_uris is required')
        : metadataError('malformed client metadata');
    }
    const metadata = parsed.data;

    const method = metadata.token_endpoint_auth_method ?? 'none';
    if (method !== 'none') {
      throw metadataError('only public clients (token_endpoint_auth_method none) may register');
    }
    const grantTypes = metadata.grant_types ?? [...SUPPORTED_GRANT_TYPES];
    if (
      !grantTypes.every((grant) => (SUPPORTED_GRANT_TYPES as readonly string[]).includes(grant))
    ) {
      throw metadataError('grant_types may only be authorization_code and refresh_token');
    }
    const responseTypes = metadata.response_types ?? [...SUPPORTED_RESPONSE_TYPES];
    if (
      !responseTypes.every((type) => (SUPPORTED_RESPONSE_TYPES as readonly string[]).includes(type))
    ) {
      throw metadataError('response_types may only be code');
    }
    const redirectUris = [...new Set(metadata.redirect_uris)];
    if (
      redirectUris.length > MAX_DYNAMIC_REDIRECT_URIS ||
      !redirectUris.every(isAcceptableDynamicRedirectUri)
    ) {
      throw new OAuthProtocolError(
        'invalid_redirect_uri',
        400,
        'redirect_uris must be https, or http on a loopback host, without a fragment',
      );
    }
    const firstRedirect = redirectUris[0] ?? '';
    const name = metadata.client_name ?? hostOf(firstRedirect);
    const scopes = this.scopesFor(metadata.scope);

    const dedupeKey = `${DEDUPE_NAMESPACE}:${createHash('sha256')
      .update(JSON.stringify([name, [...redirectUris].sort(), [...scopes]]), 'utf8')
      .digest('hex')}`;
    const existingId = await this.kv.get(dedupeKey);
    if (existingId !== null) {
      const existing = await this.directory.getOAuthClient(existingId);
      if (existing !== null && existing.registration === 'dynamic') {
        return this.describe(existing.clientId, existing.createdAt, name, redirectUris, scopes);
      }
    }

    const created = await this.services.oauthApps.registerDynamicClient({
      name,
      redirectUris,
      allowedScopes: scopes,
    });
    await this.kv.set(dedupeKey, created.clientId);
    this.logger.info(
      { event: 'oauth.client_registered', clientId: created.clientId },
      'oauth.client_registered',
    );
    return this.describe(created.clientId, created.createdAt, name, redirectUris, scopes);
  }

  private describe(
    clientId: string,
    createdAt: string,
    name: string,
    redirectUris: readonly string[],
    scopes: readonly Scope[],
  ): ClientRegistrationResponse {
    return {
      client_id: clientId,
      client_id_issued_at: Math.floor((epochMillis(createdAt) ?? 0) / 1000),
      client_name: name,
      redirect_uris: redirectUris,
      grant_types: [...SUPPORTED_GRANT_TYPES],
      response_types: [...SUPPORTED_RESPONSE_TYPES],
      token_endpoint_auth_method: 'none',
      scope: scopes.join(' '),
    };
  }
}
