import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPublished,
  mustImplement,
  testConnection,
  testDestinationRequest,
  testDraft,
  testGrant,
  testMedia,
  testPublishRequest,
  testStatusRequest,
  type TestDepsOptions,
} from '../shared/testing';
import { createPinterestConnector } from './connector';
import { buildPinterestCapabilities } from './capabilities';

const NOW = '2026-08-04T12:00:00.000Z';

function connectorFor(routes: TestDepsOptions['routes']) {
  return createTestDeps({ routes, now: new Date(NOW) });
}

const connection = () =>
  testConnection({
    provider: 'pinterest',
    externalAccountId: 'usr_1',
    accountType: 'business_profile',
  });

const meRoute = {
  method: 'GET' as const,
  match: '/v5/user_account',
  body: { username: 'relay_user', id: 'usr_1', account_type: 'BUSINESS' },
};

const boardsRoute = {
  method: 'GET' as const,
  match: '/v5/boards',
  body: {
    items: [{ id: 'board-1', name: 'Design', url: 'https://www.pinterest.com/relay_user/design/' }],
  },
};

const pinRoute = {
  method: 'POST' as const,
  match: '/v5/pins',
  body: { id: 'pin-123', url: 'https://www.pinterest.com/pin/123/', board_id: 'board-1' },
};

describe('pinterest connector', () => {
  it('declares honest identity metadata', () => {
    const { deps } = connectorFor([]);
    const connector = createPinterestConnector(deps);
    expect(connector.identity().provider).toBe('pinterest');
    expect(connector.identity().features['list_destinations']).toBe('supported');
  });

  it('discovers the business account', async () => {
    const { deps } = connectorFor([meRoute]);
    const connector = createPinterestConnector(deps);
    const accounts = await connector.discoverAccounts(
      testGrant({ provider: 'pinterest', scopes: ['user_accounts:read'] }),
    );
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('usr_1');
    expect(accounts[0]?.handle).toBe('relay_user');
  });

  it('lists boards as destinations', async () => {
    const { deps } = connectorFor([boardsRoute]);
    const connector = createPinterestConnector(deps);
    const destinations = await mustImplement(
      connector.listDestinations,
      'listDestinations',
    )(testDestinationRequest(connection(), 'board'));
    expect(destinations).toHaveLength(1);
    expect(destinations[0]?.externalId).toBe('board-1');
    expect(destinations[0]?.kind).toBe('board');
  });

  it('publishes an image pin by URL into the chosen board', async () => {
    const { deps, simulator } = connectorFor([pinRoute]);
    const connector = createPinterestConnector(deps);
    const snap = buildPinterestCapabilities({ connection: connection(), observedAt: NOW });
    const media = [testMedia({ altText: null, altTextWaived: true })];
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      contentKind: 'image',
      title: 'A pin',
      body: 'The description.',
      media,
      destination: {
        externalId: 'board-1',
        kind: 'board',
        displayLabel: 'Design',
        parentExternalId: null,
        canPost: true,
        refreshedAt: NOW,
        expiresAt: '2026-08-04T13:00:00.000Z',
        metadata: {},
      },
    });
    const prepared = await connector.prepareMedia({
      connection: connection(),
      postVariantId: 'pv_test_0001',
      contentKind: 'image',
      media,
      idempotencyKey: 'idem-test-00000001',
      capabilities: snap,
    });
    const result = expectPublished(
      await connector.publish(testPublishRequest({ draft, preparedMedia: prepared })),
    );
    expect(result.externalPostId).toBe('pin-123');
    const sent = simulator.callsTo('/v5/pins')[0];
    expect(sent?.json).toMatchObject({
      board_id: 'board-1',
      media_source: { source_type: 'image_url', url: 'https://storage.invalid/media/sample' },
    });
  });

  it('rejects a pin without media deterministically', async () => {
    const { deps } = connectorFor([]);
    const connector = createPinterestConnector(deps);
    const snap = buildPinterestCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      contentKind: 'image',
      destination: {
        externalId: 'board-1',
        kind: 'board',
        displayLabel: 'Design',
        parentExternalId: null,
        canPost: true,
        refreshedAt: NOW,
        expiresAt: '2026-08-04T13:00:00.000Z',
        metadata: {},
      },
    });
    const result = await connector.validateDraft(draft);
    expect(result.issues.some((issue) => issue.code === 'MEDIA_REQUIRED')).toBe(true);
  });

  it('reads back pin status', async () => {
    const { deps } = connectorFor([
      { method: 'GET', match: '/v5/pins/pin-123', body: { ...pinRoute.body } },
    ]);
    const connector = createPinterestConnector(deps);
    const status = await connector.getStatus(
      testStatusRequest({ connection: connection(), externalPostId: 'pin-123' }),
    );
    expect(status.state).toBe('published');
    expect(status.permalink).toBe('https://www.pinterest.com/pin/123/');
  });
});
