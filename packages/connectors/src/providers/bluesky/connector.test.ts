import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  testConnection,
  testDraft,
  testMedia,
  testThreadItem,
} from '../shared/testing.js';
import { buildBlueskyCapabilities } from './capabilities.js';
import { blueskyPermalink, createBlueskyConnector } from './connector.js';
import { buildFacets, byteLength, byteOffsetOf } from './facets.js';
import {
  BLUESKY_ACTOR_SEARCH_FIXTURE,
  BLUESKY_BLOB_FIXTURE,
  BLUESKY_CREATE_RECORD_FIXTURE,
  BLUESKY_CREATE_REPLY_FIXTURE,
  BLUESKY_POST_NOT_FOUND_FIXTURE,
  BLUESKY_POST_THREAD_FIXTURE,
  BLUESKY_PROFILE_FIXTURE,
  BLUESKY_SESSION_FIXTURE,
} from './__fixtures__/index.js';

const connection = testConnection({
  provider: 'bluesky',
  accountType: 'personal_profile',
  externalAccountId: 'did:plc:fakedidfakedidfake01',
  metadata: { handle: 'sample-studio.fake.invalid', serviceUrl: 'https://bsky.invalid' },
});

const capabilities = buildBlueskyCapabilities({
  connection,
  observedAt: '2026-08-04T12:00:00.000Z',
});

function request(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    connection,
    preparedMedia: [],
    idempotencyKey: 'idem-bluesky-0001',
    capabilityVersion: capabilities.capabilityVersion,
    contentChecksum: '3'.repeat(64),
    dispatchedAt: '2026-08-04T12:00:00.000Z',
    resume: {},
    ...overrides,
  };
}

describe('Bluesky facets', () => {
  it('indexes into UTF-8 bytes, not UTF-16 code units', () => {
    const text = 'Hi 👋 see https://example.invalid/a';
    const stringIndex = text.indexOf('https://');
    // The emoji is four UTF-8 bytes but two UTF-16 code units, so the two differ.
    expect(byteOffsetOf(text, stringIndex)).not.toBe(stringIndex);
    const [facet] = buildFacets(text, []);
    expect(facet?.index.byteStart).toBe(byteOffsetOf(text, stringIndex));
    expect(facet?.index.byteEnd).toBe(byteLength(text));
    expect(facet?.features[0]?.$type).toBe('app.bsky.richtext.facet#link');
  });

  it('emits a mention facet only for a resolved DID', () => {
    const text = 'Thanks @someone-else.fake.invalid';
    const offset = text.indexOf('@');
    const withDid = buildFacets(text, [
      { did: 'did:plc:fakedidfakedidfake02', offset, length: text.length - offset },
    ]);
    expect(withDid.some((facet) => facet.features[0]?.did !== undefined)).toBe(true);
    // Without a resolved DID there is no mention facet: a display string never
    // masquerades as a native tag.
    expect(buildFacets(text, []).some((facet) => facet.features[0]?.did !== undefined)).toBe(false);
  });

  it('emits a tag facet for a hashtag', () => {
    const facets = buildFacets('Shipping today #release', []);
    expect(facets[0]?.features[0]?.tag).toBe('release');
  });
});

describe('Bluesky capability snapshot', () => {
  it('resolves mentions to a real entity id', () => {
    expect(capabilities.mentions.resolvesToExternalId).toBe(true);
  });

  it('supports replies as threads and as a first comment', () => {
    expect(capabilities.threads.support).toBe('supported');
    expect(capabilities.firstComment.support).toBe('supported');
  });

  it('carries the documented create budget', () => {
    expect(capabilities.rateLimit).toEqual({ windowSeconds: 3600, maxRequests: 1666 });
  });
});

describe('Bluesky validation', () => {
  it('treats missing alt text as an error, not a warning', async () => {
    const { deps } = createTestDeps();
    const connector = createBlueskyConnector(deps);
    const result = await connector.validateDraft(
      testDraft({
        connection,
        capabilities,
        contentKind: 'image',
        media: [testMedia({ kind: 'image', altText: null })],
      }),
    );
    const issue = result.issues.find((entry) => entry.code === 'ALT_TEXT_MISSING');
    expect(issue?.severity).toBe('error');
    expect(result.ok).toBe(false);
  });

  it('accepts an explicitly waived alt text', async () => {
    const { deps } = createTestDeps();
    const connector = createBlueskyConnector(deps);
    const result = await connector.validateDraft(
      testDraft({
        connection,
        capabilities,
        contentKind: 'image',
        media: [testMedia({ kind: 'image', altText: null, altTextWaived: true })],
      }),
    );
    expect(result.issues.some((issue) => issue.code === 'ALT_TEXT_MISSING')).toBe(false);
  });

  it('enforces the byte ceiling underneath the grapheme limit', async () => {
    const { deps } = createTestDeps();
    const connector = createBlueskyConnector(deps);
    // 290 four-byte emoji are under 300 graphemes but over 3000 bytes.
    const result = await connector.validateDraft(
      testDraft({ connection, capabilities, body: '🌱'.repeat(290) }),
    );
    expect(result.issues.some((issue) => issue.code === 'BLUESKY_BYTE_LIMIT_EXCEEDED')).toBe(true);
    expect(result.issues.some((issue) => issue.code === 'TEXT_TOO_LONG')).toBe(false);
  });
});

describe('Bluesky publish', () => {
  it('creates a post record and derives the public permalink', async () => {
    const { deps } = createTestDeps({
      routes: [
        {
          method: 'POST',
          match: 'com.atproto.repo.createRecord',
          body: BLUESKY_CREATE_RECORD_FIXTURE,
        },
      ],
    });
    const connector = createBlueskyConnector(deps);
    const result = await connector.publish(
      request({ draft: testDraft({ connection, capabilities, body: 'Hello Bluesky.' }) }) as never,
    );
    expect(result.state).toBe('published');
    expect(result.externalPostId).toBe(
      'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001',
    );
    expect(result.permalink).toBe(
      'https://bsky.app/profile/sample-studio.fake.invalid/post/fakerkey0001',
    );
  });

  it('builds a thread with replies pointing at the root and the previous part', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        {
          method: 'POST',
          match: 'com.atproto.repo.createRecord',
          body: BLUESKY_CREATE_RECORD_FIXTURE,
          once: true,
        },
        {
          method: 'POST',
          match: 'com.atproto.repo.createRecord',
          body: BLUESKY_CREATE_REPLY_FIXTURE,
        },
      ],
    });
    const connector = createBlueskyConnector(deps);
    const result = await connector.publish(
      request({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Part one.',
          threadItems: [testThreadItem(1, 'Part two.')],
        }),
      }) as never,
    );
    expect(result.state).toBe('published');
    const reply = simulator.calls[1];
    expect(reply?.json).toMatchObject({
      record: {
        reply: {
          root: { uri: 'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001' },
          parent: { uri: 'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001' },
        },
      },
    });
  });

  it('adopts an existing root on retry rather than posting twice', async () => {
    const { deps, simulator } = createTestDeps();
    const connector = createBlueskyConnector(deps);
    const result = await connector.publish(
      request({
        draft: testDraft({ connection, capabilities }),
        resume: {
          rootUri: 'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001',
          rootCid: 'bafyreifakerecordcidfakerecordcidfakerecordcid001',
        },
      }) as never,
    );
    expect(result.externalPostId).toBe(
      'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001',
    );
    expect(simulator.calls).toHaveLength(0);
  });

  it('uploads a blob and attaches it with its alt text', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        { method: 'GET', match: 'storage.invalid', bytes: new Uint8Array(64) },
        { method: 'POST', match: 'com.atproto.repo.uploadBlob', body: BLUESKY_BLOB_FIXTURE },
      ],
    });
    const connector = createBlueskyConnector(deps);
    const prepared = await connector.prepareMedia({
      connection,
      draft: testDraft({ connection, capabilities }),
      media: [testMedia({ kind: 'image', altText: 'A described photograph.' })],
      idempotencyKey: 'idem-bluesky-0002',
    } as never);
    expect(prepared[0]?.providerMediaId).toBe(
      'bafkreifakeblobreferencefakeblobreferencefake0001',
    );
    expect(simulator.callsTo('uploadBlob')).toHaveLength(1);
  });

  it('reports a deleted post as failed rather than unknown', async () => {
    const { deps } = createTestDeps({
      routes: [
        {
          method: 'GET',
          match: 'app.bsky.feed.getPostThread',
          body: BLUESKY_POST_NOT_FOUND_FIXTURE,
        },
      ],
    });
    const connector = createBlueskyConnector(deps);
    const status = await connector.getStatus({
      connection,
      pollToken: 'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/gone',
    });
    expect(status.state).toBe('failed');
  });
});

describe('Bluesky reads', () => {
  it('maps public engagement counts', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: 'app.bsky.feed.getPostThread', body: BLUESKY_POST_THREAD_FIXTURE },
      ],
    });
    const connector = createBlueskyConnector(deps);
    const observations = await connector.fetchMetrics({
      connection,
      scope: 'post',
      externalPostId: 'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001',
    });
    expect(observations.find((entry) => entry.normalizedName === 'likes')?.value).toBe(57);
    expect(observations.find((entry) => entry.normalizedName === 'comments')?.value).toBe(4);
  });

  it('reads the account post count', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: 'app.bsky.actor.getProfile', body: BLUESKY_PROFILE_FIXTURE }],
    });
    const connector = createBlueskyConnector(deps);
    const observations = await connector.fetchMetrics({ connection, scope: 'account' });
    expect(observations.find((entry) => entry.normalizedName === 'published_count')?.value).toBe(
      437,
    );
  });

  it('resolves a mention to a DID', async () => {
    const { deps } = createTestDeps({
      routes: [
        {
          method: 'GET',
          match: 'app.bsky.actor.searchActorsTypeahead',
          body: BLUESKY_ACTOR_SEARCH_FIXTURE,
        },
      ],
    });
    const connector = createBlueskyConnector(deps);
    const mentions = await connector.searchMentions?.({ connection, query: '@someone-else' });
    expect(mentions?.[0]?.externalId).toBe('did:plc:fakedidfakedidfake02');
    expect(mentions?.[0]?.resolved).toBe(true);
  });

  it('discovers exactly one identity', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: 'com.atproto.server.getSession', body: BLUESKY_SESSION_FIXTURE },
      ],
    });
    const connector = createBlueskyConnector(deps);
    const accounts = await connector.discoverAccounts({
      provider: 'bluesky',
      accessToken: 'fake-test-access-token-not-a-real-credential',
      refreshToken: null,
      expiresAt: null,
      scopes: [],
      externalUserId: null,
      extra: {},
    });
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalId).toBe('did:plc:fakedidfakedidfake01');
  });
});

describe('Bluesky permalink', () => {
  it('falls back to the DID in the AT URI when no handle is stored', () => {
    expect(
      blueskyPermalink(
        null,
        'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001',
      ),
    ).toBe('https://bsky.app/profile/did:plc:fakedidfakedidfake01/post/fakerkey0001');
  });
});
