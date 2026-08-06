import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPublished,
  mustImplement,
  testConnection,
  testDestinationRequest,
  testDraft,
  testGrant,
  testPublishRequest,
  testStatusRequest,
  type TestDepsOptions,
} from '../shared/testing';
import { createSlackConnector } from './connector';
import { buildSlackCapabilities } from './capabilities';

const NOW = '2026-08-04T12:00:00.000Z';

function connectorFor(routes: TestDepsOptions['routes']) {
  return createTestDeps({ routes, now: new Date(NOW) });
}

const connection = (channel = 'C123') =>
  testConnection({
    provider: 'slack',
    externalAccountId: 'U1',
    accountType: 'organization',
    metadata: { channel },
  });

const authRoute = {
  method: 'POST' as const,
  match: '/auth.test',
  body: {
    ok: true,
    user_id: 'U1',
    user: 'relay',
    team_id: 'T1',
    team: 'Relay Workspace',
    url: null,
  },
};

const channelsRoute = {
  method: 'POST' as const,
  match: '/conversations.list',
  body: {
    ok: true,
    channels: [
      {
        id: 'C123',
        name: 'announcements',
        is_channel: true,
        is_group: false,
        is_archived: false,
        is_private: false,
      },
      {
        id: 'C999',
        name: 'old',
        is_channel: true,
        is_group: false,
        is_archived: true,
        is_private: false,
      },
    ],
  },
};

const postRoute = {
  method: 'POST' as const,
  match: '/chat.postMessage',
  body: {
    ok: true,
    ts: '1754300000.000001',
    channel: 'C123',
    message: { ts: '1754300000.000001', channel: 'C123', text: 'Hello' },
  },
};

describe('slack connector', () => {
  it('declares honest identity metadata', () => {
    const { deps } = connectorFor([]);
    const connector = createSlackConnector(deps);
    expect(connector.identity().provider).toBe('slack');
    expect(connector.identity().features['list_destinations']).toBe('supported');
  });

  it('discovers the workspace from the OAuth token', async () => {
    const { deps } = connectorFor([authRoute]);
    const connector = createSlackConnector(deps);
    const accounts = await connector.discoverAccounts(
      testGrant({ provider: 'slack', scopes: ['chat:write'] }),
    );
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('U1');
    expect(accounts[0]?.displayName).toBe('Relay Workspace');
  });

  it('lists channels as destinations, excluding archived ones', async () => {
    const { deps } = connectorFor([channelsRoute]);
    const connector = createSlackConnector(deps);
    const destinations = await mustImplement(
      connector.listDestinations,
      'listDestinations',
    )(testDestinationRequest(connection(), 'channel'));
    expect(destinations.map((destination) => destination.displayLabel)).toEqual(['announcements']);
  });

  it('publishes a message into the chosen channel', async () => {
    const { deps, simulator } = connectorFor([postRoute]);
    const connector = createSlackConnector(deps);
    const snap = buildSlackCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      body: 'Hello',
      destination: {
        externalId: 'C123',
        kind: 'channel',
        displayLabel: 'announcements',
        parentExternalId: null,
        canPost: true,
        refreshedAt: NOW,
        expiresAt: '2026-08-04T13:00:00.000Z',
        metadata: {},
      },
    });
    const result = expectPublished(
      await connector.publish(testPublishRequest({ draft, preparedMedia: [] })),
    );
    expect(result.externalPostId).toBe('1754300000.000001');
    const sent = simulator.callsTo('/chat.postMessage')[0];
    expect(sent?.form).toMatchObject({ channel: 'C123', text: 'Hello' });
  });

  it('requires a channel destination deterministically', async () => {
    const { deps } = connectorFor([]);
    const connector = createSlackConnector(deps);
    const snap = buildSlackCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({ connection: connection(), capabilities: snap });
    const result = await connector.validateDraft(draft);
    expect(result.issues.some((issue) => issue.code === 'DESTINATION_REQUIRED')).toBe(true);
  });

  it('reads back message status through conversations.history', async () => {
    const { deps } = connectorFor([
      {
        method: 'POST',
        match: '/conversations.history',
        body: { ok: true, messages: [{ ts: '1754300000.000001', channel: 'C123', text: 'Hello' }] },
      },
    ]);
    const connector = createSlackConnector(deps);
    const status = await connector.getStatus(
      testStatusRequest({ connection: connection(), externalPostId: '1754300000.000001' }),
    );
    expect(status.state).toBe('published');
  });

  it('surfaces an application level Slack error as a classified failure', async () => {
    const { deps } = connectorFor([
      {
        method: 'POST',
        match: '/chat.postMessage',
        body: { ok: false, error: 'channel_not_found' },
      },
    ]);
    const connector = createSlackConnector(deps);
    const snap = buildSlackCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      destination: {
        externalId: 'C123',
        kind: 'channel',
        displayLabel: 'announcements',
        parentExternalId: null,
        canPost: true,
        refreshedAt: NOW,
        expiresAt: '2026-08-04T13:00:00.000Z',
        metadata: {},
      },
    });
    await expect(
      connector.publish(testPublishRequest({ draft, preparedMedia: [] })),
    ).rejects.toThrow();
  });
});
