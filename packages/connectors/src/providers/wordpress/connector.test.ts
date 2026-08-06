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
import { createWordpressConnector } from './connector';
import { buildWordpressCapabilities } from './capabilities';

const NOW = '2026-08-04T12:00:00.000Z';

function connectorFor(routes: TestDepsOptions['routes']) {
  return createTestDeps({ routes, now: new Date(NOW) });
}

const SITE = 'https://example.invalid';
const connection = () =>
  testConnection({
    provider: 'wordpress',
    externalAccountId: '1',
    accountType: 'publication',
    metadata: { siteUrl: SITE },
  });

const meRoute = {
  method: 'GET' as const,
  match: '/wp-json/wp/v2/users/me',
  body: { id: 1, name: 'Site Owner', slug: 'owner', link: 'https://example.invalid' },
};

const postRoute = {
  method: 'POST' as const,
  match: '/wp-json/wp/v2/posts',
  body: { id: 42, link: 'https://example.invalid/hello/', status: 'publish', date: NOW },
};

describe('wordpress connector', () => {
  it('declares honest identity metadata', () => {
    const { deps } = connectorFor([]);
    const connector = createWordpressConnector(deps);
    expect(connector.identity().provider).toBe('wordpress');
    expect(connector.identity().features['publish']).toBe('supported');
    expect(connector.identity().features['video']).toBe('not_implemented');
  });

  it('discovers the user on the site carried in grant metadata', async () => {
    const { deps } = connectorFor([meRoute]);
    const connector = createWordpressConnector(deps);
    const accounts = await connector.discoverAccounts(
      testGrant({ provider: 'wordpress', scopes: ['posts'], grantMetadata: { siteUrl: SITE } }),
    );
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('1');
    expect(accounts[0]?.metadata).toEqual({ siteUrl: SITE });
  });

  it('publishes a post with the site URL from connection metadata', async () => {
    const { deps, simulator } = connectorFor([postRoute]);
    const connector = createWordpressConnector(deps);
    const snap = buildWordpressCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      title: 'Hello',
      body: 'The body of the post.',
    });
    const result = expectPublished(
      await connector.publish(testPublishRequest({ draft, preparedMedia: [] })),
    );
    expect(result.externalPostId).toBe('42');
    expect(result.permalink).toBe('https://example.invalid/hello/');
    const sent = simulator.callsTo('/wp-json/wp/v2/posts')[0];
    expect(sent?.url).toContain(SITE);
    expect(sent?.json).toMatchObject({ title: 'Hello', status: 'publish' });
  });

  it('requires a title deterministically', async () => {
    const { deps } = connectorFor([]);
    const connector = createWordpressConnector(deps);
    const snap = buildWordpressCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({ connection: connection(), capabilities: snap, title: null });
    const result = await connector.validateDraft(draft);
    expect(result.issues.some((issue) => issue.code === 'TITLE_REQUIRED')).toBe(true);
  });

  it('reads back post status', async () => {
    const { deps } = connectorFor([
      { method: 'GET', match: '/wp-json/wp/v2/posts/42', body: { ...postRoute.body } },
    ]);
    const connector = createWordpressConnector(deps);
    const status = await connector.getStatus(
      testStatusRequest({ connection: connection(), externalPostId: '42' }),
    );
    expect(status.state).toBe('published');
  });

  it('deletes a post', async () => {
    const { deps, simulator } = connectorFor([
      { method: 'DELETE', match: '/wp-json/wp/v2/posts/42' },
    ]);
    const connector = createWordpressConnector(deps);
    await mustImplement(
      connector.deletePost,
      'deletePost',
    )({
      connection: connection(),
      externalPostId: '42',
      confirmedByActorId: 'usr_1',
    });
    expect(simulator.callsTo('/wp-json/wp/v2/posts/42')[0]?.method).toBe('DELETE');
  });
});
