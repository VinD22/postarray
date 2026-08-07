/** Connections, their capability snapshots, destinations and mention search. */

import type { CapabilitySnapshot } from '@relay/contracts';
import type {
  ConnectionView as ApplicationConnectionView,
  MentionEntityView,
  ProviderDestinationView,
} from '@relay/application';

import { call } from '../call';
import { demoConnections, page } from '../fixtures';
import type {
  ConnectionDestination,
  ConnectionView,
  MentionResult,
  Paginated,
  ProviderId,
} from '../types';
import { requireFirst } from '@/lib/utils/require-first';

export type ConnectionListQuery = {
  readonly brandId?: string;
  readonly provider?: ProviderId;
  readonly cursor?: string;
  readonly limit?: number;
};

function demoConnection(connectionId: string): ConnectionView {
  const found = demoConnections.find((connection) => connection.id === connectionId);
  return found ?? requireFirst(demoConnections, 'connection');
}

function toConnection(connection: ApplicationConnectionView): ConnectionView {
  const health: ConnectionView['health'] =
    connection.health === 'active'
      ? 'healthy'
      : connection.health === 'action_required'
        ? 'permission_missing'
        : connection.health === 'disconnected'
          ? 'revoked'
          : connection.health;
  return {
    id: connection.id,
    workspaceId: connection.workspaceId,
    provider: connection.provider,
    accountType: connection.accountType,
    displayName: connection.displayName,
    handle: connection.handle,
    avatarUrl: connection.avatarUrl,
    health,
    connectedAt: connection.connectedAt,
    connectedByName: null,
    expiresAt: connection.accessTokenExpiresAt,
    lastPublishedAt: connection.lastPublishedAt,
    lastAnalyticsSyncAt: connection.lastAnalyticsSyncAt,
    capabilitySnapshotVersion: connection.capabilityVersion,
  };
}

export const connectionsApi = {
  listAvailableProviders: (): Promise<readonly ProviderId[]> =>
    call('/connections/providers', {}, () => ['x', 'linkedin', 'instagram', 'facebook']),

  list: (query: ConnectionListQuery = {}): Promise<Paginated<ConnectionView>> =>
    call<Paginated<ApplicationConnectionView>, Paginated<ConnectionView>>(
      '/connections',
      { query },
      () =>
        page(
          demoConnections.filter(
            (connection) => query.provider === undefined || connection.provider === query.provider,
          ),
        ),
      (result) => ({ ...result, data: result.data.map(toConnection) }),
    ),

  get: (connectionId: string): Promise<ConnectionView> =>
    call<ApplicationConnectionView, ConnectionView>(
      `/connections/${connectionId}`,
      {},
      () => demoConnection(connectionId),
      toConnection,
    ),

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
    input: { provider: ProviderId; brandId: string; returnUrl: string },
    idempotencyKey: string,
  ): Promise<{ authorizationUrl: string; transactionId: string }> =>
    call(
      '/connections/oauth/begin',
      {
        method: 'POST',
        body: { provider: input.provider, brandId: input.brandId, redirectTo: input.returnUrl },
        idempotencyKey,
      },
      () => ({ authorizationUrl: input.returnUrl, transactionId: 'oauth_demo' }),
    ),

  reconnect: (
    connectionId: string,
    input: { returnUrl: string },
    idempotencyKey: string,
  ): Promise<ConnectionView> =>
    call<ApplicationConnectionView, ConnectionView>(
      `/connections/${connectionId}/reconnect`,
      { method: 'POST', idempotencyKey },
      () => demoConnection(connectionId),
      toConnection,
    ),

  pause: (connectionId: string, idempotencyKey: string): Promise<ConnectionView> =>
    call<ApplicationConnectionView, ConnectionView>(
      `/connections/${connectionId}/pause`,
      { method: 'POST', idempotencyKey },
      () => ({ ...demoConnection(connectionId), health: 'paused' as const }),
      toConnection,
    ),

  resume: (connectionId: string, idempotencyKey: string): Promise<ConnectionView> =>
    call<ApplicationConnectionView, ConnectionView>(
      `/connections/${connectionId}/resume`,
      { method: 'POST', idempotencyKey },
      () => ({ ...demoConnection(connectionId), health: 'healthy' as const }),
      toConnection,
    ),

  disconnect: (connectionId: string, idempotencyKey: string): Promise<ConnectionView> =>
    call<ApplicationConnectionView, ConnectionView>(
      `/connections/${connectionId}/disconnect`,
      { method: 'POST', idempotencyKey },
      () => ({ ...demoConnection(connectionId), health: 'revoked' as const }),
      toConnection,
    ),

  /**
   * Pages, boards, communities and channels this connection can publish into.
   * `q` narrows the list by name, which is what the composer's destination
   * search sends as the user types.
   */
  listDestinations: (
    connectionId: string,
    query: { kind?: string; q?: string } = {},
  ): Promise<readonly ConnectionDestination[]> =>
    call<readonly ProviderDestinationView[], readonly ConnectionDestination[]>(
      `/connections/${connectionId}/destinations`,
      { query: { kind: query.kind ?? '', query: query.q } },
      () => [],
      (results) =>
        results.map((entry) => ({
          id: entry.id,
          connectionId: entry.connectionId,
          kind: entry.kind,
          externalId: entry.externalId,
          name: entry.displayName,
        })),
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
    call<readonly MentionEntityView[], readonly MentionResult[]>(
      `/connections/${connectionId}/mentions`,
      { query: { query: query.q } },
      () => [],
      (results) =>
        results.map((entry) => ({
          externalId: entry.externalId,
          handle: entry.handle ?? '',
          displayName: entry.displayLabel,
          avatarUrl: entry.avatarUrl,
        })),
    ),
};
