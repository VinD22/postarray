import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPublished,
  testConnection,
  testDraft,
  testGrant,
  testMedia,
  testMentionSearchRequest,
  testMetricsRequest,
  testPublishRequest,
  testStatusRequest,
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
    // Family emoji are a single grapheme made of several UTF-8 code points, so this
    // stays below 300 visible characters while crossing the 3000-byte protocol cap.
    const result = await connector.validateDraft(
      testDraft({ connection, capabilities, body: '👨‍👩‍👧‍👦'.repeat(150) }),
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
      testPublishRequest({ draft: testDraft({ connection, capabilities, body: 'Hello Bluesky.' }) }),
    );
    expect(result.status).toBe('published');
    if (result.status !== 'published') return;
    expect(expectPublished(result).externalPostId).toBe(
      'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001',
    );
    expect(expectPublished(result).permalink).toBe(
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
      testPublishRequest({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Part one.',
          threadItems: [testThreadItem(1, 'Part two.')],
        }),
      }),
    );
    expect(result.status).toBe('published');
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
      postVariantId: 'pv_test_0001',
      contentKind: 'image',
      media: [testMedia({ kind: 'image', altText: 'A described photograph.' })],
      idempotencyKey: 'idem-bluesky-0002',
      capabilities,
    });
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
    const status = await connector.getStatus(
      testStatusRequest({
        connection,
        externalPostId: 'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/gone',
      }),
    );
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
    const observations = await connector.fetchMetrics(
      testMetricsRequest({
        connection,
        scope: 'post',
        externalPostId: 'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001',
      }),
    );
    expect(observations.find((entry) => entry.normalizedName === 'likes')?.value).toBe(57);
    expect(observations.find((entry) => entry.normalizedName === 'comments')?.value).toBe(4);
  });

  it('reads the account post count', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: 'app.bsky.actor.getProfile', body: BLUESKY_PROFILE_FIXTURE }],
    });
    const connector = createBlueskyConnector(deps);
    const observations = await connector.fetchMetrics(testMetricsRequest({ connection, scope: 'account' }));
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
    const mentions = await connector.searchMentions?.(
      testMentionSearchRequest(connection, '@someone-else'),
    );
    expect(mentions?.[0]?.externalId).toBe('did:plc:fakedidfakedidfake02');
    expect(mentions?.[0]?.resolvedToExternalId).toBe(true);
  });

  it('discovers exactly one identity', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: 'com.atproto.server.getSession', body: BLUESKY_SESSION_FIXTURE },
      ],
    });
    const connector = createBlueskyConnector(deps);
    const accounts = await connector.discoverAccounts(testGrant({ provider: 'bluesky' }));
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('did:plc:fakedidfakedidfake01');
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
