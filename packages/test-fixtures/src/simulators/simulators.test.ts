import { beforeEach, describe, expect, it } from 'vitest';

import type { ProviderId } from '@relay/contracts';

import {
  SIMULATOR_MODES,
  SIMULATOR_MODE_HEADER,
  SimulatedNetworkError,
  type SimulatorRegistry,
  createSimulatorFetch,
  createSimulatorRegistry,
  simulatorBaseUrls,
} from './index.js';
import type { SimulatorFetch, SimulatorMode } from './index.js';

const AUTH = { authorization: 'Bearer fake-simulator-credential-placeholder' };

let registry: SimulatorRegistry;
let fetchImpl: SimulatorFetch;

function url(provider: ProviderId, path: string): string {
  return `${registry.get(provider).baseUrl}${path}`;
}

async function call(
  provider: ProviderId,
  path: string,
  init: RequestInit & { simulatorMode?: SimulatorMode } = {},
): Promise<Response> {
  const { simulatorMode, ...rest } = init;
  return fetchImpl(url(provider, path), {
    ...rest,
    headers: {
      ...AUTH,
      ...(simulatorMode === undefined ? {} : { [SIMULATOR_MODE_HEADER]: simulatorMode }),
      ...((rest.headers as Record<string, string>) ?? {}),
    },
  });
}

async function json(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

beforeEach(() => {
  registry = createSimulatorRegistry();
  fetchImpl = createSimulatorFetch(registry);
});

describe('the simulator fetch never reaches a network', () => {
  it('throws on an unregistered host', async () => {
    await expect(fetchImpl('https://api.example.invalid/v1/anything')).rejects.toThrow(
      /SIMULATOR_HOST_NOT_REGISTERED/,
    );
  });

  it('keeps every simulator on example.test', () => {
    for (const host of registry.hosts) {
      expect(host.endsWith('.example.test'), host).toBe(true);
    }
    for (const base of Object.values(simulatorBaseUrls(registry))) {
      expect(base.startsWith('https://')).toBe(true);
    }
  });

  it('covers every V1 provider plus the fake provider', () => {
    expect(registry.all.map((simulator) => simulator.provider).sort()).toEqual(
      [
        'bluesky',
        'facebook',
        'fake',
        'instagram',
        'linkedin',
        'threads',
        'tiktok',
        'x',
        'youtube',
      ].sort(),
    );
  });
});

describe('X', () => {
  it('creates a post and returns the id in the documented shape', async () => {
    const response = await call('x', '/2/tweets', {
      method: 'POST',
      body: JSON.stringify({ text: 'A fixture post.' }),
      headers: { 'content-type': 'application/json' },
    });
    expect(response.status).toBe(201);
    const body = await json(response);
    const data = body.data as { id: string; text: string };
    expect(data.id).toMatch(/^fake-x-/);
    expect(data.text).toBe('A fixture post.');
  });

  it('reports 429 with retry-after and the reset headers', async () => {
    const response = await call('x', '/2/tweets', {
      method: 'POST',
      simulatorMode: 'rate_limited',
    });
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('900');
    expect(response.headers.get('x-rate-limit-reset')).not.toBeNull();
    expect((await json(response)).title).toBe('Too Many Requests');
  });

  it('fails once then succeeds in flaky mode, which is what proves retries work', async () => {
    const first = await call('x', '/2/tweets', { method: 'POST', simulatorMode: 'flaky' });
    expect(first.status).toBe(500);
    const second = await call('x', '/2/tweets', { method: 'POST', simulatorMode: 'flaky' });
    expect(second.status).toBe(201);
  });

  it('records the write even when the client never sees the response', async () => {
    await expect(
      call('x', '/2/tweets', {
        method: 'POST',
        simulatorMode: 'lost_response',
        body: JSON.stringify({ text: 'Accepted but never acknowledged.' }),
        headers: { 'content-type': 'application/json' },
      }),
    ).rejects.toBeInstanceOf(SimulatedNetworkError);
    // The duplicate-publication trap: the provider has the post, we do not.
    expect(registry.get('x').posts).toHaveLength(1);
  });

  it('deduplicates a retried write that carries the same idempotency key', async () => {
    const body = JSON.stringify({ text: 'Retried exactly once.' });
    const headers = { 'content-type': 'application/json', 'x-idempotency-key': 'fixture-key-1' };
    const first = await json(await call('x', '/2/tweets', { method: 'POST', body, headers }));
    const second = await json(await call('x', '/2/tweets', { method: 'POST', body, headers }));
    expect((first.data as { id: string }).id).toBe((second.data as { id: string }).id);
    expect(registry.get('x').posts).toHaveLength(1);
  });

  it('accepts a create whose external id only arrives on a later poll', async () => {
    const accepted = await call('x', '/2/tweets', {
      method: 'POST',
      simulatorMode: 'deferred_external_id',
      body: JSON.stringify({ text: 'Accepted now, identified later.' }),
      headers: { 'content-type': 'application/json' },
    });
    expect(accepted.status).toBe(202);
    const jobId = ((await json(accepted)).data as { pending_job_id: string }).pending_job_id;

    const pending = await json(await call('x', `/2/jobs/${jobId}`));
    expect((pending.data as { state: string }).state).toBe('pending');

    const done = await json(await call('x', `/2/jobs/${jobId}`));
    expect((done.data as { state: string }).state).toBe('completed');
    expect((done.data as { tweet_id: string }).tweet_id).toMatch(/^fake-x-/);
  });

  it('rejects a thread item while the root stands, in partial_success', async () => {
    const root = await call('x', '/2/tweets', {
      method: 'POST',
      simulatorMode: 'partial_success',
      body: JSON.stringify({ text: 'Root.' }),
      headers: { 'content-type': 'application/json' },
    });
    expect(root.status).toBe(201);
    const reply = await call('x', '/2/tweets', {
      method: 'POST',
      simulatorMode: 'partial_success',
      body: JSON.stringify({ text: 'Reply.', reply: { in_reply_to_tweet_id: 'x' } }),
      headers: { 'content-type': 'application/json' },
    });
    expect(reply.status).toBe(400);
  });

  it('omits a metric it does not return rather than reporting zero', async () => {
    const created = await json(
      await call('x', '/2/tweets', {
        method: 'POST',
        body: JSON.stringify({ text: 'Measured.' }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    const id = (created.data as { id: string }).id;
    const metrics = await json(await call('x', `/2/tweets/${id}?tweet.fields=public_metrics`));
    const publicMetrics = (metrics.data as { public_metrics: Record<string, number> })
      .public_metrics;
    expect(publicMetrics.impression_count).toBe(1_240);
    expect(publicMetrics.bookmark_count).toBeUndefined();
  });
});

describe('LinkedIn', () => {
  it('returns 201 with an empty body and the urn in x-restli-id', async () => {
    const response = await call('linkedin', '/rest/posts', {
      method: 'POST',
      body: JSON.stringify({ commentary: 'A fixture post.' }),
      headers: { 'content-type': 'application/json' },
    });
    expect(response.status).toBe(201);
    expect(await response.text()).toBe('');
    expect(response.headers.get('x-restli-id')).toMatch(/^urn:li:share:/);
  });

  it('reports a lost administrator role as a changed capability', async () => {
    const before = await json(await call('linkedin', '/rest/organizationAcls'));
    expect((before.elements as unknown[]).length).toBe(1);
    const after = await json(
      await call('linkedin', '/rest/organizationAcls', { simulatorMode: 'capability_changed' }),
    );
    expect((after.elements as unknown[]).length).toBe(0);
  });

  it('uses its own error envelope', async () => {
    const response = await call('linkedin', '/rest/posts', {
      method: 'POST',
      simulatorMode: 'expired_token',
    });
    expect(response.status).toBe(401);
    const body = await json(response);
    expect(body.code).toBe('EXPIRED_ACCESS_TOKEN');
    expect(body.serviceErrorCode).toBe(65601);
  });
});

describe('Instagram', () => {
  it('will not treat a container as a publication', async () => {
    const accountId = 'fake-instagram-0000000001';
    const container = await json(
      await call('instagram', `/v21.0/${accountId}/media`, {
        method: 'POST',
        body: JSON.stringify({
          caption: 'A fixture caption.',
          image_url: 'https://example.test/i.jpg',
        }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    const creationId = container.id as string;

    const status = await json(await call('instagram', `/v21.0/${creationId}?fields=status_code`));
    expect(status.status_code).toBe('FINISHED');

    const published = await json(
      await call('instagram', `/v21.0/${accountId}/media_publish`, {
        method: 'POST',
        body: JSON.stringify({ creation_id: creationId }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    expect(published.id).not.toBe(creationId);
  });

  it('leaves a stuck container in progress forever', async () => {
    const accountId = 'fake-instagram-0000000001';
    const container = await json(
      await call('instagram', `/v21.0/${accountId}/media`, {
        method: 'POST',
        simulatorMode: 'stuck_container',
        body: JSON.stringify({ caption: 'Never finishes.' }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    const creationId = container.id as string;
    for (let poll = 0; poll < 10; poll += 1) {
      const status = await json(
        await call('instagram', `/v21.0/${creationId}?fields=status_code`, {
          simulatorMode: 'stuck_container',
        }),
      );
      expect(status.status_code).toBe('IN_PROGRESS');
    }
  });

  it('finishes a slow container after several polls', async () => {
    const accountId = 'fake-instagram-0000000001';
    const container = await json(
      await call('instagram', `/v21.0/${accountId}/media`, {
        method: 'POST',
        simulatorMode: 'slow_media',
        body: JSON.stringify({ caption: 'Slow but finishes.' }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    const creationId = container.id as string;
    const states: string[] = [];
    for (let poll = 0; poll < 4; poll += 1) {
      const status = await json(await call('instagram', `/v21.0/${creationId}?fields=status_code`));
      states.push(status.status_code as string);
    }
    expect(states[0]).toBe('IN_PROGRESS');
    expect(states.at(-1)).toBe('FINISHED');
  });

  it('names a consumer account as the reason, not "authentication failed"', async () => {
    const account = await json(
      await call('instagram', '/v21.0/fake-instagram-0000000001', {
        simulatorMode: 'capability_changed',
      }),
    );
    expect(account.account_type).toBe('PERSONAL');
  });

  it('uses the Graph error envelope with a subcode', async () => {
    const response = await call('instagram', '/v21.0/fake-instagram-0000000001/media', {
      method: 'POST',
      simulatorMode: 'duplicate',
    });
    const error = (await json(response)).error as Record<string, unknown>;
    expect(error.type).toBe('OAuthException');
    expect(error.error_subcode).toBe(2_207_003);
  });
});

describe('YouTube and TikTok', () => {
  it('starts a resumable upload and reports uploaded before processed', async () => {
    const start = await call('youtube', '/upload/youtube/v3/videos?uploadType=resumable', {
      method: 'POST',
      body: JSON.stringify({ snippet: { title: 'Fixture video' } }),
      headers: { 'content-type': 'application/json' },
    });
    const location = start.headers.get('location');
    expect(location).not.toBeNull();

    const uploaded = await json(
      await fetchImpl(location ?? '', { method: 'PUT', headers: AUTH, body: 'bytes' }),
    );
    expect((uploaded.status as { uploadStatus: string }).uploadStatus).toBe('uploaded');

    const listed = await json(
      await call('youtube', `/youtube/v3/videos?id=${uploaded.id as string}&part=status`),
    );
    const item = (listed.items as Array<{ status: { uploadStatus: string } }>)[0];
    expect(item?.status.uploadStatus).toBe('processed');
  });

  it('refuses a TikTok publish that did not choose a privacy level', async () => {
    const response = await call('tiktok', '/v2/post/publish/video/init/', {
      method: 'POST',
      body: JSON.stringify({ post_info: { title: 'Fixture' } }),
      headers: { 'content-type': 'application/json' },
    });
    expect(response.status).toBe(400);
    expect(((await json(response)).error as { code: string }).code).toBe('invalid_param');
  });

  it('polls a TikTok publish to a terminal state', async () => {
    const init = await json(
      await call('tiktok', '/v2/post/publish/video/init/', {
        method: 'POST',
        body: JSON.stringify({
          post_info: { title: 'Fixture', privacy_level: 'PUBLIC_TO_EVERYONE' },
        }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    const publishId = (init.data as { publish_id: string }).publish_id;
    const status = await json(
      await call('tiktok', '/v2/post/publish/status/fetch/', {
        method: 'POST',
        body: JSON.stringify({ publish_id: publishId }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    const data = status.data as { status: string; publicaly_available_post_id: string[] };
    expect(data.status).toBe('PUBLISH_COMPLETE');
    expect(data.publicaly_available_post_id).toHaveLength(1);
  });

  it('offers only the privacy options the account actually has', async () => {
    const changed = await json(
      await call('tiktok', '/v2/post/publish/creator_info/query/', {
        method: 'POST',
        simulatorMode: 'capability_changed',
      }),
    );
    expect((changed.data as { privacy_level_options: string[] }).privacy_level_options).toEqual([
      'SELF_ONLY',
    ]);
  });
});

describe('Bluesky and the fake provider', () => {
  it('allows an unauthenticated session create and nothing else', async () => {
    const session = await fetchImpl(url('bluesky', '/xrpc/com.atproto.server.createSession'), {
      method: 'POST',
      body: JSON.stringify({ identifier: 'fixture.bsky.example.test' }),
      headers: { 'content-type': 'application/json' },
    });
    expect(session.status).toBe(200);

    const unauthenticated = await fetchImpl(url('bluesky', '/xrpc/com.atproto.repo.createRecord'), {
      method: 'POST',
    });
    expect(unauthenticated.status).toBe(401);
  });

  it('returns an at:// uri and a cid', async () => {
    const created = await json(
      await call('bluesky', '/xrpc/com.atproto.repo.createRecord', {
        method: 'POST',
        body: JSON.stringify({ repo: 'did:plc:fakebluesky0000000001', record: { text: 'Hello.' } }),
        headers: { 'content-type': 'application/json' },
      }),
    );
    expect(created.uri).toMatch(/^at:\/\/did:plc:/);
    expect(created.cid).toMatch(/^bafyfake/);
  });

  it('reports rate limits with a reset timestamp rather than retry-after', async () => {
    const response = await call('bluesky', '/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      simulatorMode: 'rate_limited',
    });
    expect(response.status).toBe(429);
    expect(response.headers.get('ratelimit-reset')).not.toBeNull();
    expect((await json(response)).error).toBe('RateLimitExceeded');
  });

  it('lets the fake provider run the whole loop locally', async () => {
    const created = await json(
      await call('fake', '/posts', {
        method: 'POST',
        body: JSON.stringify({ text: 'Local development post.' }),
        headers: { 'content-type': 'application/json', 'idempotency-key': 'fixture-local-1' },
      }),
    );
    const read = await json(await call('fake', `/posts/${created.id as string}`));
    expect(read.text).toBe('Local development post.');
    const deleted = await json(
      await call('fake', `/posts/${created.id as string}`, { method: 'DELETE' }),
    );
    expect(deleted.deleted).toBe(true);
  });
});

describe('every provider supports the shared failure modes', () => {
  const providers: readonly ProviderId[] = [
    'x',
    'linkedin',
    'instagram',
    'facebook',
    'youtube',
    'tiktok',
    'threads',
    'bluesky',
    'fake',
  ];

  const writePaths: Readonly<Record<ProviderId, string>> = {
    x: '/2/tweets',
    linkedin: '/rest/posts',
    instagram: '/v21.0/fake-instagram-0000000001/media',
    facebook: '/v21.0/fake-facebook-0000000001/feed',
    youtube: '/upload/youtube/v3/videos?uploadType=resumable',
    tiktok: '/v2/post/publish/video/init/',
    threads: '/v1.0/fake-threads-0000000001/threads',
    bluesky: '/xrpc/com.atproto.repo.createRecord',
    fake: '/posts',
  };

  const expectations: ReadonlyArray<[SimulatorMode, number]> = [
    ['rate_limited', 429],
    ['server_error', 500],
    ['expired_token', 401],
    ['revoked', 401],
    ['forbidden', 403],
  ];

  /**
   * Documented provider deviations from the common status.
   *
   * AT Protocol XRPC signals a bad or expired token with 400 plus a named error
   * ("ExpiredToken", "InvalidToken") rather than 401, so the simulator stays
   * faithful to the real service. The connector's error classifier is what
   * normalizes these into user_action_required, and it is tested separately.
   */
  const statusOverrides: Partial<Record<ProviderId, Partial<Record<SimulatorMode, number>>>> = {
    bluesky: { expired_token: 400, revoked: 400 },
  };

  for (const provider of providers) {
    for (const [mode, status] of expectations) {
      it(`${provider} reports ${mode} as ${status}`, async () => {
        const expected = statusOverrides[provider]?.[mode] ?? status;
        const response = await call(provider, writePaths[provider], {
          method: 'POST',
          simulatorMode: mode,
        });
        expect(response.status).toBe(expected);
      });
    }

    it(`${provider} rejects a request with no authorization header`, async () => {
      const response = await fetchImpl(url(provider, writePaths[provider]), { method: 'POST' });
      expect([401, 403]).toContain(response.status);
    });

    it(`${provider} returns a body that fails a schema in malformed mode`, async () => {
      const body = await json(
        await call(provider, writePaths[provider], { method: 'POST', simulatorMode: 'malformed' }),
      );
      expect(body.unexpected).toBe('shape');
    });

    it(`${provider} echoes a token-shaped string only in token_echo mode`, async () => {
      const echoed = await (
        await call(provider, writePaths[provider], { method: 'POST', simulatorMode: 'token_echo' })
      ).text();
      expect(echoed).toContain('FAKE-TOKEN-FOR-TESTS-DO-NOT-USE');

      const normal = await (
        await call(provider, writePaths[provider], { method: 'POST', simulatorMode: 'happy' })
      ).text();
      expect(normal).not.toContain('FAKE-TOKEN-FOR-TESTS-DO-NOT-USE');
    });
  }

  it('declares every mode the test plan requires', () => {
    for (const mode of [
      'rate_limited',
      'server_error',
      'flaky',
      'slow_accept',
      'lost_response',
      'expired_token',
      'revoked',
      'forbidden',
      'content_invalid',
      'duplicate',
      'stuck_container',
      'slow_media',
      'deferred_external_id',
      'capability_changed',
      'malformed',
      'token_echo',
      'partial_success',
    ] as const) {
      expect(SIMULATOR_MODES).toContain(mode);
    }
  });

  it('marks a slow accept without making the test wait for it', async () => {
    const response = await call('x', '/2/tweets', {
      method: 'POST',
      simulatorMode: 'slow_accept',
      body: JSON.stringify({ text: 'Slow to acknowledge.' }),
      headers: { 'content-type': 'application/json' },
    });
    expect(response.status).toBe(201);
    expect(registry.get('x').posts).toHaveLength(1);
  });

  it('resets cleanly between tests', () => {
    registry.reset();
    for (const simulator of registry.all) {
      expect(simulator.posts).toHaveLength(0);
      expect(simulator.requests).toHaveLength(0);
      expect(simulator.currentMode).toBe('happy');
    }
  });
});
