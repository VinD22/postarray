import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPublished,
  mustImplement,
  testConnection,
  testDraft,
  testGrant,
  testPublishRequest,
  testStatusRequest,
  type TestDepsOptions,
} from '../shared/testing';
import { createDevtoConnector } from './connector';
import { buildDevtoCapabilities } from './capabilities';

const NOW = '2026-08-04T12:00:00.000Z';

function connectorFor(routes: TestDepsOptions['routes']) {
  return createTestDeps({ routes, now: new Date(NOW) });
}

const connection = () =>
  testConnection({ provider: 'devto', externalAccountId: '7', accountType: 'publication' });

const meRoute = {
  method: 'GET' as const,
  match: '/users/me',
  body: {
    id: 7,
    username: 'relay',
    name: 'Relay User',
    profile_image: 'https://dev.to/avatar.png',
    website_url: null,
  },
};

const articleRoute = {
  method: 'POST' as const,
  match: '/articles',
  body: {
    id: 99,
    title: 'A title',
    url: 'https://dev.to/relay/a-title-99',
    published: true,
    published_at: NOW,
  },
};

describe('devto connector', () => {
  it('declares honest identity metadata', () => {
    const { deps } = connectorFor([]);
    const connector = createDevtoConnector(deps);
    expect(connector.identity().provider).toBe('devto');
    expect(connector.identity().accountTypes).toEqual(['publication']);
    expect(connector.identity().features['publish']).toBe('supported');
  });

  it('discovers the account from the API key', async () => {
    const { deps } = connectorFor([meRoute]);
    const connector = createDevtoConnector(deps);
    const accounts = await connector.discoverAccounts(
      testGrant({ provider: 'devto', scopes: ['article'] }),
    );
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('7');
    expect(accounts[0]?.handle).toBe('relay');
  });

  it('publishes an article and returns the canonical URL', async () => {
    const { deps, simulator } = connectorFor([articleRoute]);
    const connector = createDevtoConnector(deps);
    const snap = buildDevtoCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      title: 'A title',
      body: '# Hello\n\nA markdown body.',
    });
    const result = expectPublished(
      await connector.publish(testPublishRequest({ draft, preparedMedia: [] })),
    );
    expect(result.externalPostId).toBe('99');
    expect(result.permalink).toBe('https://dev.to/relay/a-title-99');
    const sent = simulator.callsTo('/articles')[0];
    expect(sent?.json).toMatchObject({
      article: { title: 'A title', published: true },
    });
  });

  it('requires a title deterministically', async () => {
    const { deps } = connectorFor([]);
    const connector = createDevtoConnector(deps);
    const snap = buildDevtoCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({ connection: connection(), capabilities: snap, title: null });
    const result = await connector.validateDraft(draft);
    expect(result.issues.some((issue) => issue.code === 'TITLE_REQUIRED')).toBe(true);
  });

  it('reads back article status by id', async () => {
    const { deps } = connectorFor([
      { method: 'GET', match: '/articles/99', body: { ...articleRoute.body } },
    ]);
    const connector = createDevtoConnector(deps);
    const status = await connector.getStatus(
      testStatusRequest({ connection: connection(), externalPostId: '99' }),
    );
    expect(status.state).toBe('published');
    expect(status.permalink).toBe('https://dev.to/relay/a-title-99');
  });

  it('deletes an article', async () => {
    const { deps, simulator } = connectorFor([{ method: 'DELETE', match: '/articles/99' }]);
    const connector = createDevtoConnector(deps);
    await mustImplement(
      connector.deletePost,
      'deletePost',
    )({
      connection: connection(),
      externalPostId: '99',
      confirmedByActorId: 'usr_1',
    });
    expect(simulator.callsTo('/articles/99')[0]?.method).toBe('DELETE');
  });
});
