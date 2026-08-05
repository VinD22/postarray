/** Connections, their capability snapshots, destinations and mention search. */

import type { CapabilitySnapshot } from '@relay/contracts';

import { call } from '../call.js';
import { demoConnections, page } from '../fixtures.js';
import type {
  ConnectionDestination,
  ConnectionView,
  MentionResult,
  Paginated,
  ProviderId,
} from '../types.js';

export interface ConnectionListQuery {
  readonly brandId?: string;
  readonly provider?: ProviderId;
  readonly cursor?: string;
  readonly limit?: number;
}

function demoConnection(connectionId: string): ConnectionView {
  const found = demoConnections.find((connection) => connection.id === connectionId);
  return found ?? demoConnections[0]!;
}

export const connectionsApi = {
  list: (query: ConnectionListQuery = {}): Promise<Paginated<ConnectionView>> =>
    call('/connections', { query }, () =>
      page(
        demoConnections.filter(
          (connection) => query.provider === undefined || connection.provider === query.provider,
        ),
      ),
    ),

  get: (connectionId: string): Promise<ConnectionView> =>
    call(`/connections/${connectionId}`, {}, () => demoConnection(connectionId)),

  /**
   * The versioned capability snapshot. Never assume a limit: read it from here,
   * because limits differ by account type on the same provider.
   */
  getCapabilities: (connectionId: string): Promise<CapabilitySnapshot | null> =>
    call(`/connections/${connectionId}/capabilities`, {}, () => null),

  /**
   * Start the OAuth handoff. Returns the provider consent URL and the exact
   * scopes the consent screen will show, so the permissions can be explained
   * before the user leaves Relay.
   */
  beginOAuth: (
    input: { provider: ProviderId; brandId?: string; returnUrl: string },
    idempotencyKey: string,
  ): Promise<{ authorizationUrl: string; scopes: readonly string[] }> =>
    call('/connections/oauth/begin', { method: 'POST', body: input, idempotencyKey }, () => ({
      authorizationUrl: input.returnUrl,
      scopes: [],
    })),

  reconnect: (
    connectionId: string,
    input: { returnUrl: string },
    idempotencyKey: string,
  ): Promise<{ authorizationUrl: string; scopes: readonly string[] }> =>
    call(
      `/connections/${connectionId}/reconnect`,
      { method: 'POST', body: input, idempotencyKey },
      () => ({ authorizationUrl: input.returnUrl, scopes: [] }),
    ),

  pause: (connectionId: string, idempotencyKey: string): Promise<ConnectionView> =>
    call(`/connections/${connectionId}/pause`, { method: 'POST', idempotencyKey }, () => ({
      ...demoConnection(connectionId),
      health: 'paused' as const,
    })),

  resume: (connectionId: string, idempotencyKey: string): Promise<ConnectionView> =>
    call(`/connections/${connectionId}/resume`, { method: 'POST', idempotencyKey }, () => ({
      ...demoConnection(connectionId),
      health: 'healthy' as const,
    })),

  disconnect: (connectionId: string): Promise<void> =>
    call(`/connections/${connectionId}`, { method: 'DELETE' }, () => undefined),

  /** Pages, boards, communities and channels this connection can publish into. */
  listDestinations: (
    connectionId: string,
    query: { kind?: string } = {},
  ): Promise<Paginated<ConnectionDestination>> =>
    call(`/connections/${connectionId}/destinations`, { query }, () =>
      page<ConnectionDestination>([]),
    ),

  /**
   * Provider-backed mention lookup. A result that does not resolve to a
   * provider external id is not returned, because a display-text mention is not
   * a native tag.
   */
  searchMentions: (
    connectionId: string,
    query: { q: string; limit?: number },
  ): Promise<readonly MentionResult[]> =>
    call(`/connections/${connectionId}/mentions`, { query }, () => []),
};
