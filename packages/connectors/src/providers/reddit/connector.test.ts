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
import { createRedditConnector } from './connector';
import { buildRedditCapabilities } from './capabilities';

const NOW = '2026-08-04T12:00:00.000Z';

function connectorFor(routes: TestDepsOptions['routes']) {
  return createTestDeps({ routes, now: new Date(NOW) });
}

const connection = () =>
  testConnection({
    provider: 'reddit',
    externalAccountId: 't2_user1',
    accountType: 'personal_profile',
  });

const meRoute = {
  method: 'GET' as const,
  match: '/api/v1/me',
  body: { name: 'relay_user', id: 't2_user1', icon_img: '' },
};

const submitRoute = {
  method: 'POST' as const,
  match: '/api/submit',
  body: {
    json: {
      errors: [],
      data: { id: 't3_abc123', url: 'https://www.reddit.com/r/test/comments/abc123' },
    },
  },
};

const subredditListing = {
  method: 'GET' as const,
  match: '/subreddits/mine/submitter',
  body: {
    data: {
      children: [
        { data: { display_name: 'test', name: 't5_test', url: '/r/test/' } },
        { data: { display_name: 'relay', name: 't5_relay', url: '/r/relay/' } },
      ],
    },
  },
};

describe('reddit connector', () => {
  it('declares honest identity metadata', () => {
    const { deps } = connectorFor([]);
    const connector = createRedditConnector(deps);
    expect(connector.identity().provider).toBe('reddit');
    expect(connector.identity().features['list_destinations']).toBe('supported');
    expect(connector.identity().features['publish']).toBe('supported');
  });

  it('discovers the user', async () => {
    const { deps } = connectorFor([meRoute]);
    const connector = createRedditConnector(deps);
    const accounts = await connector.discoverAccounts(
      testGrant({ provider: 'reddit', scopes: ['identity', 'submit', 'mysubreddits'] }),
    );
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('t2_user1');
    expect(accounts[0]?.handle).toBe('relay_user');
  });

  it('lists the subreddits the user may post to', async () => {
    const { deps } = connectorFor([subredditListing]);
    const connector = createRedditConnector(deps);
    const destinations = await mustImplement(
      connector.listDestinations,
      'listDestinations',
    )(testDestinationRequest(connection(), 'community'));
    expect(destinations.map((destination) => destination.displayLabel)).toEqual([
      'r/test',
      'r/relay',
    ]);
  });

  it('publishes a self post into the chosen subreddit', async () => {
    const { deps, simulator } = connectorFor([submitRoute]);
    const connector = createRedditConnector(deps);
    const snap = buildRedditCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      title: 'A title',
      body: 'The body.',
      destination: {
        externalId: 'test',
        kind: 'community',
        displayLabel: 'r/test',
        parentExternalId: null,
        canPost: true,
        refreshedAt: NOW,
        expiresAt: '2026-08-04T13:00:00.000Z',
        metadata: { fullname: 't5_test' },
      },
    });
    const result = expectPublished(
      await connector.publish(testPublishRequest({ draft, preparedMedia: [] })),
    );
    expect(result.externalPostId).toBe('t3_abc123');
    expect(result.permalink).toBe('https://www.reddit.com/r/test/comments/abc123');
    const sent = simulator.callsTo('/api/submit')[0];
    expect(sent?.form).toMatchObject({ sr: 'test', kind: 'self', title: 'A title' });
  });

  it('requires a title and a subreddit deterministically', async () => {
    const { deps } = connectorFor([]);
    const connector = createRedditConnector(deps);
    const snap = buildRedditCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({ connection: connection(), capabilities: snap, title: null });
    const result = await connector.validateDraft(draft);
    expect(result.issues.some((issue) => issue.code === 'TITLE_REQUIRED')).toBe(true);
    expect(result.issues.some((issue) => issue.code === 'DESTINATION_REQUIRED')).toBe(true);
  });

  it('reads back post status through /api/info', async () => {
    const { deps } = connectorFor([
      {
        method: 'GET',
        match: '/api/info',
        body: {
          data: {
            children: [
              { data: { id: 'abc123', name: 't3_abc123', permalink: '/r/test/comments/abc123' } },
            ],
          },
        },
      },
    ]);
    const connector = createRedditConnector(deps);
    const status = await connector.getStatus(
      testStatusRequest({ connection: connection(), externalPostId: 't3_abc123' }),
    );
    expect(status.state).toBe('published');
    expect(status.permalink).toBe('https://www.reddit.com/r/test/comments/abc123');
  });
});
