import { API_HEADERS } from '@relay/contracts';
import { request as httpRequest, type IncomingHttpHeaders } from 'node:http';
import type { AddressInfo } from 'node:net';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  TEST_ACCEPT_LANGUAGE,
  TEST_USER_AGENT,
  createHarness,
  seedSession,
  type Harness,
} from '../../testing/harness';
import { RETRY_HINT_MS } from './sse-stream';

/**
 * The stream through the real pipeline.
 *
 * These assertions are about the edge, not about Redis: who may open a stream,
 * what a browser and a proxy are told about the response, and that the shape
 * is a stream rather than a JSON body. The test config has no `REDIS_URL`, so
 * the module wires its disconnected transport, which is the same thing a
 * developer running the product with only a database gets. That is deliberate:
 * a deployment without Redis must still serve this route, and the fan-out
 * itself is proven in `realtime-hub.test.ts` without a socket.
 */

let harness: Harness;

beforeEach(async () => {
  harness = await createHarness();
});

afterEach(async () => {
  await harness.close();
});

/**
 * Open the stream, read its first frame, then hang up.
 *
 * supertest waits for a response to end, and this response is designed never
 * to. So the assertions are made against the headers and the first chunk, and
 * the client disconnects the way a closed tab does, which is also what proves
 * the server's cleanup path runs.
 */
async function openStream(
  session: Awaited<ReturnType<typeof seedSession>>,
  path: string,
): Promise<{ status: number; headers: IncomingHttpHeaders; firstChunk: string }> {
  if (!harness.server.listening) {
    await new Promise<void>((resolve) => harness.server.listen(0, resolve));
  }
  const { port } = harness.server.address() as AddressInfo;

  return new Promise((resolve, reject) => {
    const client = httpRequest(
      {
        port,
        path,
        method: 'GET',
        headers: {
          cookie: session.cookie,
          [API_HEADERS.workspaceId]: session.workspaceId,
          'user-agent': TEST_USER_AGENT,
          'accept-language': TEST_ACCEPT_LANGUAGE,
        },
      },
      (response) => {
        response.setEncoding('utf8');
        response.once('data', (chunk: string) => {
          const result = {
            status: response.statusCode ?? 0,
            headers: response.headers,
            firstChunk: chunk,
          };
          client.destroy();
          resolve(result);
        });
      },
    );
    client.on('error', reject);
    client.end();
  });
}

function authed(session: Awaited<ReturnType<typeof seedSession>>, path: string) {
  return request(harness.server)
    .get(path)
    .set('cookie', session.cookie)
    .set(API_HEADERS.workspaceId, session.workspaceId)
    .set('user-agent', TEST_USER_AGENT)
    .set('accept-language', TEST_ACCEPT_LANGUAGE);
}

describe('GET /v1/events', () => {
  it('refuses an unauthenticated caller', async () => {
    const response = await request(harness.server).get('/v1/events');
    expect(response.status).toBe(401);
  });

  it('refuses a session that does not hold a read scope', async () => {
    const session = await seedSession(harness, { scopes: [] });
    const response = await authed(session, '/v1/events');
    expect(response.status).toBe(403);
  });

  it('streams, and tells every proxy on the way not to buffer it', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:read'] });
    const response = await openStream(session, '/v1/events');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/event-stream');
    expect(response.headers['cache-control']).toContain('no-cache');
    // `compression()` is mounted globally and honours `no-transform`. Without
    // it the stream buffers in the compressor and nothing arrives until the
    // window fills, which for a few hundred bytes of JSON means never.
    expect(response.headers['cache-control']).toContain('no-transform');
    expect(response.headers['x-accel-buffering']).toBe('no');
  });

  it('opens with the reconnect hint, so a dropped tab comes back on its own', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:read'] });
    const response = await openStream(session, '/v1/events');
    expect(response.firstChunk).toContain(`retry: ${RETRY_HINT_MS}`);
  });

  it('rejects a type filter that is not an event this stream carries', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:read'] });
    const response = await authed(session, '/v1/events?type=post.everything');
    expect(response.status).toBe(422);
  });

  it('rejects a resume point that is not a stream entry id', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:read'] });
    const response = await authed(session, '/v1/events?since=yesterday');
    expect(response.status).toBe(422);
  });
});

describe('GET /v1/events/recent', () => {
  it('refuses an unauthenticated caller', async () => {
    const response = await request(harness.server).get('/v1/events/recent');
    expect(response.status).toBe(401);
  });

  it('answers with a page and the id to resume from', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:read'] });
    const response = await authed(session, '/v1/events/recent');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ events: [], lastEventId: null });
  });

  it('refuses a page larger than a replay is allowed to be', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:read'] });
    const response = await authed(session, '/v1/events/recent?limit=5000');
    expect(response.status).toBe(422);
  });
});
