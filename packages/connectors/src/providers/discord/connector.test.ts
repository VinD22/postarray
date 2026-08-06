import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPublished,
  mustImplement,
  testConnection,
  testDestinationRequest,
  testDraft,
  testPublishRequest,
  testStatusRequest,
  type TestDepsOptions,
} from '../shared/testing';
import { createDiscordConnector } from './connector';
import { buildDiscordCapabilities } from './capabilities';

const NOW = '2026-08-04T12:00:00.000Z';

function connectorFor(routes: TestDepsOptions['routes']) {
  return createTestDeps({ routes, now: new Date(NOW) });
}

const connection = (channelId = 'channel-1') =>
  testConnection({
    provider: 'discord',
    externalAccountId: 'bot-1',
    accountType: 'community',
    metadata: { channelId },
  });

const meRoute = {
  method: 'GET' as const,
  match: '/users/@me',
  body: { id: 'bot-1', username: 'relay_bot', global_name: 'Relay Bot' },
};

const guildsRoute = {
  method: 'GET' as const,
  match: '/users/@me/guilds',
  body: [{ id: 'guild-1', name: 'Relay HQ' }],
};

const channelsRoute = {
  method: 'GET' as const,
  match: '/guilds/guild-1/channels',
  body: [
    { id: 'channel-1', guild_id: 'guild-1', name: 'announcements', type: 0 },
    { id: 'channel-2', guild_id: 'guild-1', name: 'voice', type: 2 },
  ],
};

const messageRoute = {
  method: 'POST' as const,
  match: '/channels/channel-1/messages',
  body: {
    id: 'msg-5000',
    channel_id: 'channel-1',
    guild_id: 'guild-1',
    content: 'Hello',
  },
};

describe('discord connector', () => {
  it('declares honest identity metadata', () => {
    const { deps } = connectorFor([]);
    const connector = createDiscordConnector(deps);
    expect(connector.identity().provider).toBe('discord');
    expect(connector.identity().features['list_destinations']).toBe('supported');
  });

  it('discovers the bot as the connected account', async () => {
    const { deps } = connectorFor([meRoute]);
    const connector = createDiscordConnector(deps);
    const accounts = await connector.discoverAccounts({
      provider: 'discord',
      workspaceId: 'ws_test_0000',
      accessToken: {} as never,
      refreshToken: null,
      grantedScopes: ['bot'],
      obtainedAt: NOW,
      accessTokenExpiresAt: null,
      grantMetadata: {},
    });
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('bot-1');
  });

  it('lists text channels as destinations, skipping voice channels', async () => {
    const { deps } = connectorFor([guildsRoute, channelsRoute]);
    const connector = createDiscordConnector(deps);
    const destinations = await mustImplement(
      connector.listDestinations,
      'listDestinations',
    )(testDestinationRequest(connection(), 'channel'));
    expect(destinations.map((destination) => destination.displayLabel)).toEqual(['#announcements']);
  });

  it('publishes a message into the chosen channel', async () => {
    const { deps, simulator } = connectorFor([messageRoute]);
    const connector = createDiscordConnector(deps);
    const snap = buildDiscordCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      body: 'Hello',
      destination: {
        externalId: 'channel-1',
        kind: 'channel',
        displayLabel: '#announcements',
        parentExternalId: null,
        canPost: true,
        refreshedAt: NOW,
        expiresAt: '2026-08-04T13:00:00.000Z',
        metadata: { guildId: 'guild-1' },
      },
    });
    const result = expectPublished(
      await connector.publish(testPublishRequest({ draft, preparedMedia: [] })),
    );
    expect(result.externalPostId).toBe('msg-5000');
    expect(result.permalink).toBe('https://discord.com/channels/guild-1/channel-1/msg-5000');
    const sent = simulator.callsTo('/channels/channel-1/messages')[0];
    expect(sent?.json).toEqual({ content: 'Hello' });
  });

  it('requires a channel destination deterministically', async () => {
    const { deps } = connectorFor([]);
    const connector = createDiscordConnector(deps);
    const snap = buildDiscordCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({ connection: connection(), capabilities: snap });
    const result = await connector.validateDraft(draft);
    expect(result.issues.some((issue) => issue.code === 'DESTINATION_REQUIRED')).toBe(true);
  });

  it('reads back message status', async () => {
    const { deps } = connectorFor([
      {
        method: 'GET',
        match: '/channels/channel-1/messages/msg-5000',
        body: { ...messageRoute.body },
      },
    ]);
    const connector = createDiscordConnector(deps);
    const status = await connector.getStatus(
      testStatusRequest({ connection: connection(), externalPostId: 'msg-5000' }),
    );
    expect(status.state).toBe('published');
    expect(status.permalink).toBe('https://discord.com/channels/guild-1/channel-1/msg-5000');
  });
});
