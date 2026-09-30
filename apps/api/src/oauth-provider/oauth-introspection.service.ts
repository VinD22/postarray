import { Inject, Injectable } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import {
  ForbiddenError,
  INACTIVE_INTROSPECTION,
  type OAuthIntrospectionRequest,
  type OAuthIntrospectionResponse,
} from '@relay/contracts';

import { RELAY_CONFIG } from '../application/tokens';
import { requireEpochMillis } from '../common/instant';
import { CredentialDirectory, tokenLookupHash } from '../security/credential-directory';
import { OAuthClientAuthenticator } from './client-authentication';
import { OAuthResourceRegistry, sameResource } from './resources';

/**
 * RFC 7662 introspection and RFC 7009 revocation.
 *
 * Introspection answers two kinds of caller:
 *
 * - A confidential client asking about a token it was issued itself.
 * - The designated resource server (the MCP server's own client, configured as
 *   `MCP_CLIENT_ID`) asking about any token whose audience is its resource.
 *   Claude's tokens are issued to Claude's client, not to the MCP server, so
 *   without this rule every one of them reads as inactive at `/mcp`.
 *
 * Everything else reads as `{ "active": false }`, which is also the answer for
 * an unknown, expired or revoked token: telling the two apart is an oracle.
 */
@Injectable()
export class OAuthIntrospectionService {
  constructor(
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
    private readonly directory: CredentialDirectory,
    private readonly clients: OAuthClientAuthenticator,
    private readonly resources: OAuthResourceRegistry,
  ) {}

  private get issuer(): string {
    return this.config.oauth.issuerUrl ?? this.config.core.apiUrl ?? 'urn:relay:issuer';
  }

  async introspect(request: OAuthIntrospectionRequest): Promise<OAuthIntrospectionResponse> {
    const client = await this.clients.authenticate(request.client_id, request.client_secret);
    if (client.clientType !== 'confidential') {
      throw new ForbiddenError({ details: { reason: 'introspection_confidential_only' } });
    }
    const record = await this.directory.getAccessToken(tokenLookupHash(request.token));
    if (record === null) {
      return INACTIVE_INTROSPECTION;
    }

    const served = this.resources.resourceServedBy(client.clientId);
    const ownToken = record.clientId === client.clientId;
    const servesThisToken = served !== null && sameResource(record.audience, served);
    if (!ownToken && !servesThisToken) {
      return INACTIVE_INTROSPECTION;
    }
    // A resource server may only ask on behalf of the resource it serves, and
    // a named resource must be the token's exact audience.
    if (
      served !== null &&
      request.resource !== undefined &&
      !sameResource(request.resource, served)
    ) {
      return INACTIVE_INTROSPECTION;
    }
    if (request.resource !== undefined && !sameResource(request.resource, record.audience)) {
      return INACTIVE_INTROSPECTION;
    }

    return {
      active: true,
      scope: record.scopes.join(' '),
      client_id: record.clientId,
      sub: record.subjectUserId,
      aud: record.audience,
      iss: this.issuer,
      token_type: 'Bearer',
      exp: Math.floor(requireEpochMillis(record.expiresAt) / 1000),
      iat: Math.floor(requireEpochMillis(record.issuedAt) / 1000),
      grant_id: record.grantId,
      workspace_id: record.workspaceId,
      approval_level: record.approvalLevel,
      locale: record.locale,
      // The edge record carries no switch of its own. A grant revoked in
      // Settings is refused by the application layer, which re-reads the
      // durable grant row (`revoked_at`) on every call the token makes.
      killed: false,
    };
  }

  /**
   * RFC 7009 revocation. Always answers 200, even for an unknown token: telling
   * a caller that a token was not found is an oracle for guessing tokens.
   */
  async revoke(token: string, clientId: string, clientSecret: string | undefined): Promise<void> {
    const client = await this.clients.authenticate(clientId, clientSecret);
    const hash = tokenLookupHash(token);

    const access = await this.directory.getAccessToken(hash);
    if (access !== null && access.clientId === client.clientId) {
      await this.directory.deleteAccessToken(hash);
      return;
    }
    const refresh = await this.directory.getRefreshToken(hash);
    if (refresh !== null && refresh.clientId === client.clientId) {
      // Revoking a refresh token revokes its whole family: the client asked for
      // this credential lineage to stop working.
      await this.directory.revokeRefreshFamily(refresh.familyId);
      await this.directory.revokeGrantTokens(refresh.grantId);
    }
  }
}
