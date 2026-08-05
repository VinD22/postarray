import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { createMemoryConfigStore } from './config/store.js';
import { createMemoryCredentialStore } from './config/credentials.js';
import type { StoredCredential } from './config/credentials.js';
import { createMemoryWriter } from './output.js';
import type { JsonEnvelope } from './output.js';
import { EXIT_OK } from './exit-codes.js';
import { runCli } from './program.js';
import type { FetchLike } from './api/client.js';
import { assessBulk, BULK_ACCOUNT_THRESHOLD } from './commands/posts.js';
import { draftDocumentSchema } from './draft.js';

const API_URL = 'https://api.relay.example/';

const CREDENTIAL: StoredCredential = {
  accessToken: 'token',
  refreshToken: null,
  expiresAt: null,
  tokenType: 'Bearer',
  scopes: ['drafts:write', 'posts:schedule'],
  subject: 'user_01',
  workspaceId: 'ws_01',
  apiUrl: API_URL,
  issuer: API_URL,
  obtainedAt: '2026-08-04T12:00:00.000Z',
};

const DRAFT = {
  version: 1,
  brandId: 'brand_1',
  body: 'A launch note that goes to two accounts.',
  targets: [{ connectionId: 'conn_1' }, { connectionId: 'conn_2' }],
  threadItems: [{ kind: 'comment', body: 'Details in the link.', delaySeconds: 60 }],
  schedule: { instant: '2026-08-10T09:00:00.000Z', ianaTimeZone: 'Europe/Berlin' },
};

function connection(id: string, provider: string, handle: string) {
  return {
    id,
    workspaceId: 'ws_01',
    brandId: 'brand_1',
    provider,
    accountType: 'business_profile',
    displayName: 'Acme',
    handle,
    health: 'connected',
    statusMessageKey: null,
    capabilityVersion: 'v1',
    connectedAt: '2026-07-01T09:00:00.000Z',
    lastSuccessfulActionAt: null,
  };
}

const CONNECTIONS = {
  data: [connection('conn_1', 'linkedin', 'acme'), connection('conn_2', 'x', 'acmehq')],
  pageInfo: { nextCursor: null, hasMore: false, limit: 25 },
};

/** The `fake` connector's snapshot, enough for the cost estimate in the plan. */
const CAPABILITIES = {
  capabilityVersion: 'fake@1',
  observedAt: '2026-08-04T12:00:00.000Z',
  provider: 'fake',
  accountType: 'business_profile',
  connectionId: 'conn_1',
  text: {
    maxLength: 280,
    minLength: 1,
    supportsMarkdown: false,
    linkCounting: { mode: 'fixed', charactersPerLink: 23 },
  },
  media: {
    maxImages: 4,
    maxVideos: 1,
    allowedMimeTypes: ['image/png'],
    maxBytesByKind: { image: 1, video: 1, gif: 1, document: null, audio: null },
    aspectRatios: { min: 0.5, max: 2, recommended: [1] },
    maxDurationSeconds: 140,
    minDurationSeconds: 1,
    requiresThumbnail: false,
    altText: 'supported',
    maxAltTextLength: 1000,
  },
  contentKinds: {
    text: 'supported',
    image: 'supported',
    carousel: 'unsupported',
    video: 'unsupported',
    short_video: 'unsupported',
    long_video: 'unsupported',
    document: 'unsupported',
    thread: 'supported',
  },
  destinations: [{ kind: 'none', support: 'supported', searchable: false }],
  mentions: { support: 'supported', resolvesToExternalId: true, maxMentions: 10 },
  firstComment: { support: 'supported', maxItems: 1, minDelaySeconds: 30 },
  threads: { support: 'supported', maxItems: 25, minDelaySeconds: 0 },
  scheduling: { providerNative: 'unsupported', maxLookAheadDays: 365, minLeadSeconds: 60 },
  privacy: { support: 'supported', mustBeExplicit: false, options: [] },
  disclosure: {
    aiLabel: 'supported',
    commercialContent: 'supported',
    brandedContent: 'not_implemented',
  },
  analytics: {
    support: 'supported',
    postMetrics: ['impressions'],
    accountMetrics: ['follower_delta'],
    historyWindowDays: 90,
  },
  deletion: { support: 'supported', windowSeconds: null },
  drafts: { support: 'not_implemented' },
  rateLimit: { windowSeconds: 900, maxRequests: 300 },
  cost: { currency: 'USD', perCreateMinor: 2, perUrlCreateMinor: 20 },
};

async function writeDraft(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'relay-cli-'));
  const path = join(directory, 'draft.json');
  await writeFile(path, JSON.stringify(DRAFT), 'utf8');
  return path;
}

interface Call {
  readonly url: string;
  readonly method: string;
}

function harness() {
  const calls: Call[] = [];
  const writer = createMemoryWriter();
  const fetchImpl: FetchLike = async (url, init) => {
    calls.push({ url, method: init.method });
    const body = url.includes('/capabilities')
      ? CAPABILITIES
      : url.includes('/connections')
        ? CONNECTIONS
        : {};
    return {
      status: 200,
      headers: { get: () => null },
      text: async () => JSON.stringify(body),
    };
  };
  return {
    calls,
    writer,
    deps: {
      configStore: createMemoryConfigStore({
        version: 1,
        defaultProfile: 'default',
        profiles: { default: { apiUrl: API_URL, workspaceId: 'ws_01' } },
      }),
      credentialStore: createMemoryCredentialStore({
        version: 1,
        profiles: { default: CREDENTIAL },
      }),
      env: {},
      writer,
      fetch: fetchImpl,
      clock: { now: () => Date.parse('2026-08-04T12:00:00.000Z') },
    },
  };
}

describe('--dry-run', () => {
  it('lists every external action and performs none of them', async () => {
    const path = await writeDraft();
    const { calls, writer, deps } = harness();

    const result = await runCli(['posts', 'schedule', path, '--dry-run', '--json'], deps);
    expect(result.exitCode).toBe(EXIT_OK);

    // Only read paths were touched. Nothing was created and nothing scheduled.
    const mutating = calls.filter((call) => call.method !== 'GET');
    expect(mutating).toHaveLength(0);

    const envelope = JSON.parse(writer.stdout[writer.stdout.length - 1] ?? '{}') as JsonEnvelope;
    expect(envelope.ok).toBe(true);
    // Two targets, each with a root post and one comment.
    expect(envelope.plannedExternalActions).toHaveLength(4);
    const actions = envelope.plannedExternalActions.map((action) => action.action);
    expect(actions.filter((action) => action === 'schedule_post')).toHaveLength(2);
    expect(actions.filter((action) => action === 'create_comment')).toHaveLength(2);
    const providers = envelope.plannedExternalActions.map((action) => action.provider);
    expect(new Set(providers)).toEqual(new Set(['linkedin', 'x']));
  });

  it('does not require an idempotency key, because it changes nothing', async () => {
    const path = await writeDraft();
    const { deps } = harness();
    const result = await runCli(['posts', 'schedule', path, '--dry-run', '--json'], deps);
    expect(result.exitCode).toBe(EXIT_OK);
  });
});

describe('assessBulk', () => {
  it('flags more than five external publications', () => {
    const draft = draftDocumentSchema.parse({
      version: 1,
      body: 'x',
      targets: [{ connectionId: 'a' }, { connectionId: 'b' }, { connectionId: 'c' }],
      threadItems: [
        { kind: 'thread', body: '1' },
        { kind: 'thread', body: '2' },
      ],
    });
    const assessment = assessBulk(draft);
    expect(assessment.publicationCount).toBe(9);
    expect(assessment.isBulk).toBe(true);
    expect(assessment.reasons).toContain('PUBLICATION_COUNT');
  });

  it('flags substantially similar content to more than three accounts', () => {
    const draft = draftDocumentSchema.parse({
      version: 1,
      body: 'the same everywhere',
      targets: Array.from({ length: BULK_ACCOUNT_THRESHOLD + 1 }, (_, index) => ({
        connectionId: `conn_${index}`,
      })),
    });
    expect(assessBulk(draft).reasons).toContain('ACCOUNT_COUNT');
  });

  it('does not flag four accounts that each got their own copy', () => {
    const draft = draftDocumentSchema.parse({
      version: 1,
      body: 'master',
      targets: Array.from({ length: 4 }, (_, index) => ({
        connectionId: `conn_${index}`,
        body: `variant ${index}`,
      })),
    });
    expect(assessBulk(draft).reasons).not.toContain('ACCOUNT_COUNT');
  });

  it('does not flag a single post', () => {
    const draft = draftDocumentSchema.parse({
      version: 1,
      body: 'one',
      targets: [{ connectionId: 'conn_1' }],
    });
    expect(assessBulk(draft).isBulk).toBe(false);
  });
});
