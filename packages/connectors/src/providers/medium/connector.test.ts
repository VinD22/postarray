import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPublished,
  testConnection,
  testDraft,
  testGrant,
  testPublishRequest,
  testStatusRequest,
  type TestDepsOptions,
} from '../shared/testing';
import { createMediumConnector } from './connector';
import { buildMediumCapabilities } from './capabilities';

const NOW = '2026-08-04T12:00:00.000Z';

function connectorFor(routes: TestDepsOptions['routes']) {
  return createTestDeps({ routes, now: new Date(NOW) });
}

const connection = () =>
  testConnection({ provider: 'medium', externalAccountId: 'author-1', accountType: 'publication' });

const meRoute = {
  method: 'GET' as const,
  match: '/v1/me',
  body: {
    data: {
      id: 'author-1',
      name: 'Medium Author',
      username: 'relayauthor',
      url: 'https://medium.com/@relayauthor',
    },
  },
};

const postRoute = {
  method: 'POST' as const,
  match: '/v1/users/author-1/posts',
  body: {
    data: {
      id: 'post-77',
      title: 'A story',
      url: 'https://medium.com/@relayauthor/a-story-77',
      publishStatus: 'public',
      publishedAt: 1754300000,
    },
  },
};

describe('medium connector', () => {
  it('declares honest identity metadata', () => {
    const { deps } = connectorFor([]);
    const connector = createMediumConnector(deps);
    expect(connector.identity().provider).toBe('medium');
    expect(connector.identity().features['publish']).toBe('supported');
    expect(connector.identity().features['delete_post']).toBe('not_implemented');
  });

  it('discovers the author from the OAuth token', async () => {
    const { deps } = connectorFor([meRoute]);
    const connector = createMediumConnector(deps);
    const accounts = await connector.discoverAccounts(
      testGrant({ provider: 'medium', scopes: ['basicProfile', 'publishPost'] }),
    );
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('author-1');
    expect(accounts[0]?.handle).toBe('relayauthor');
  });

  it('publishes a markdown story', async () => {
    const { deps, simulator } = connectorFor([postRoute]);
    const connector = createMediumConnector(deps);
    const snap = buildMediumCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      title: 'A story',
      body: '# Hello\n\nMarkdown body.',
    });
    const result = expectPublished(
      await connector.publish(testPublishRequest({ draft, preparedMedia: [] })),
    );
    expect(result.externalPostId).toBe('post-77');
    expect(result.permalink).toBe('https://medium.com/@relayauthor/a-story-77');
    const sent = simulator.callsTo('/v1/users/author-1/posts')[0];
    expect(sent?.json).toMatchObject({
      title: 'A story',
      contentFormat: 'markdown',
      publishStatus: 'public',
    });
  });

  it('requires a title deterministically', async () => {
    const { deps } = connectorFor([]);
    const connector = createMediumConnector(deps);
    const snap = buildMediumCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({ connection: connection(), capabilities: snap, title: null });
    const result = await connector.validateDraft(draft);
    expect(result.issues.some((issue) => issue.code === 'TITLE_REQUIRED')).toBe(true);
  });

  it('reports unknown when there is no read-back', async () => {
    const { deps } = connectorFor([]);
    const connector = createMediumConnector(deps);
    const status = await connector.getStatus(
      testStatusRequest({ connection: connection(), externalPostId: 'post-77' }),
    );
    expect(status.state).toBe('unknown');
    expect(status.sanitizedResponse).toEqual({ reason: 'no_post_read_back' });
  });
});
