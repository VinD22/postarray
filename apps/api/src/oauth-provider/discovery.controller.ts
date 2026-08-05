import { Controller, Get, Inject } from '@nestjs/common';
import { ALL_SCOPES } from '@relay/contracts';

import { Public } from '../common/decorators';
import { CODE_CHALLENGE_METHOD } from './pkce';
import { OAuthProviderService } from './oauth-provider.service';
import { RELAY_CONFIG } from '../application/tokens';
import type { RelayConfig } from '@relay/config';

/**
 * Discovery documents.
 *
 * MCP clients require these. A compliant client reads the protected-resource
 * metadata from the `WWW-Authenticate` header we return on a 401, follows it to
 * the authorization server metadata, and runs the flow without anyone pasting a
 * URL into a config file. That is the difference between "supports MCP" and
 * "works the first time".
 *
 * Both documents are public and cacheable. Neither contains a secret; they
 * describe endpoints and supported parameters, which is the point.
 */
@Controller('.well-known')
export class OAuthDiscoveryController {
  constructor(
    private readonly oauth: OAuthProviderService,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
  ) {}

  private get apiUrl(): string {
    return this.config.core.apiUrl ?? this.oauth.issuer;
  }

  /** RFC 8414 authorization server metadata. */
  @Public()
  @Get('oauth-authorization-server')
  authorizationServer(): Record<string, unknown> {
    const base = this.apiUrl.replace(/\/+$/, '');
    return {
      issuer: this.oauth.issuer,
      authorization_endpoint: `${base}/oauth/authorize`,
      token_endpoint: `${base}/oauth/token`,
      revocation_endpoint: `${base}/oauth/revoke`,
      introspection_endpoint: `${base}/oauth/introspect`,
      scopes_supported: ALL_SCOPES,
      response_types_supported: ['code'],
      // No implicit, no password, no client credentials for third parties.
      grant_types_supported: ['authorization_code', 'refresh_token'],
      // S256 only. `plain` is not advertised because it is not accepted.
      code_challenge_methods_supported: [CODE_CHALLENGE_METHOD],
      token_endpoint_auth_methods_supported: ['client_secret_post', 'none'],
      revocation_endpoint_auth_methods_supported: ['client_secret_post', 'none'],
      introspection_endpoint_auth_methods_supported: ['client_secret_post'],
      service_documentation: `${base}/docs`,
      ui_locales_supported: ['en'],
    };
  }

  /**
   * RFC 9728 protected resource metadata.
   *
   * Names the resource identifier a token's audience must match. Audience
   * verification is mandatory on every request, and publishing the identifier
   * here is what lets a client request a token for the right one.
   */
  @Public()
  @Get('oauth-protected-resource')
  protectedResource(): Record<string, unknown> {
    const base = this.apiUrl.replace(/\/+$/, '');
    return {
      resource: this.oauth.defaultAudience,
      authorization_servers: [this.oauth.issuer],
      scopes_supported: ALL_SCOPES,
      bearer_methods_supported: ['header'],
      resource_documentation: `${base}/docs`,
    };
  }
}
