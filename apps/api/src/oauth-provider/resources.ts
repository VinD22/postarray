import { Inject, Injectable } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';

import { RELAY_CONFIG } from '../application/tokens';

/**
 * The resources this authorization server mints tokens for (RFC 8707).
 *
 * Two exist: the REST API, which is the default audience, and the remote MCP
 * server when one is deployed. A `resource` naming anything else is refused
 * with `invalid_target` instead of being stamped onto a token, because a token
 * whose audience nobody checks is a token for somebody else's service.
 */

/** Exact comparison after trailing-slash and case normalization. No prefixes. */
export function sameResource(left: string, right: string): boolean {
  const normalize = (value: string): string => value.trim().replace(/\/+$/, '').toLowerCase();
  return normalize(left) === normalize(right);
}

@Injectable()
export class OAuthResourceRegistry {
  constructor(@Inject(RELAY_CONFIG) private readonly config: RelayConfig) {}

  /** The REST API's own identifier. The audience when no resource is named. */
  get apiAudience(): string {
    return this.config.core.apiUrl ?? 'urn:relay:api';
  }

  /** The MCP server's canonical URL, or undefined when none is configured. */
  get mcpResource(): string | undefined {
    return this.config.oauth.resourceServer.resourceUrl;
  }

  /**
   * The canonical audience for a requested resource. `undefined` means the
   * default (the REST API). `null` means the resource is not one of ours.
   */
  resolve(requested: string | undefined): string | null {
    if (requested === undefined) {
      return this.apiAudience;
    }
    if (sameResource(requested, this.apiAudience)) {
      return this.apiAudience;
    }
    const mcp = this.mcpResource;
    if (mcp !== undefined && sameResource(requested, mcp)) {
      return mcp;
    }
    return null;
  }

  /**
   * The resource a client serves, when it is the designated resource server.
   * Only that client may introspect a token it did not request, and only for
   * tokens bound to its own resource.
   */
  resourceServedBy(clientId: string): string | null {
    const { clientId: resourceServerClientId, resourceUrl } = this.config.oauth.resourceServer;
    if (
      resourceServerClientId === undefined ||
      resourceUrl === undefined ||
      resourceServerClientId !== clientId
    ) {
      return null;
    }
    return resourceUrl;
  }
}
