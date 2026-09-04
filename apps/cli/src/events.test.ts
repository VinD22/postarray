import { API_HEADERS } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { createMemoryConfigStore } from './config/store';
import { createMemoryCredentialStore } from './config/credentials';
import type { StoredCredential } from './config/credentials';
import { createMemoryWriter } from './output';
import type { JsonEnvelope } from './output';
import { EXIT_CODES, EXIT_OK } from './exit-codes';
import { runCli } from './program';
import type { CliDeps } from './context';
import type { FetchLike } from './api/client';
import type { StreamFetch } from './api/event-stream';

const API_URL = 'https://api.relay.example/';
const WORKSPACE = 'ws_01j0000000000000000000000a';
const JOB = 'job_01j0000000000000000000000a';

const CREDENTIAL: StoredCredential = {
  accessToken: 'super-secret-access-token',
  refreshToken: null,
  expiresAt: null,
  tokenType: 'Bearer',
  scopes: ['accounts:read'],
  subject: 'user_01',
  workspaceId: WORKSPACE,
  apiUrl: API_URL,
  issuer: 'https://api.relay.example',
  obtainedAt: '2026-08-04T12:00:00.000Z',
};

interface TestDeps extends CliDeps {
  readonly writer: ReturnType<typeof createMemoryWriter>;
}

function deps(overrides: Omit<Partial<CliDeps>, 'writer'> = {}): TestDeps {
  const writer = createMemoryWriter();
  return {
    configStore: createMemoryConfigStore({
      version: 1,
      defaultProfile: 'default',
      profiles: { default: { apiUrl: API_URL, workspaceId: WORKSPACE } },
    }),
    credentialStore: createMemoryCredentialStore({
      version: 1,
      profiles: { default: CREDENTIAL },
    }),
    env: {},
    clock: { now: () => Date.parse('2026-08-04T12:00:00.000Z') },
    ...overrides,
    writer,
  };
}

function event(id: string) {
  return {
    id,
    type: 'post.status',
    workspaceId: WORKSPACE,
    occurredAt: '2026-09-03T10:00:00.000Z',
    data: { type: 'post.status', publishJobId: JOB, contentItemId: null, state: 'published' },
  };
}

function sseBody(chunks: readonly string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

function fakeStream(
  chunks: readonly string[],
  status = 200,
): { streamFetch: StreamFetch; calls: { url: string; headers: Record<string, string> }[] } {
  const calls: { url: string; headers: Record<string, string> }[] = [];
  const streamFetch: StreamFetch = (url, init) => {
    calls.push({ url, headers: init.headers });
    return Promise.resolve({
      status,
      body: status === 200 ? sseBody(chunks) : null,
      text: () => Promise.resolve(''),
    });
  };
  return { streamFetch, calls };
}

function jsonFetch(body: unknown): { fetch: FetchLike; calls: { url: string }[] } {
  const calls: { url: string }[] = [];
  const fetchImpl: FetchLike = (url) => {
    calls.push({ url });
    return Promise.resolve({
      status: 200,
      headers: { get: () => null },
      text: () => Promise.resolve(JSON.stringify(body)),
    });
  };
  return { fetch: fetchImpl, calls };
}

describe('postarray events --follow', () => {
  it('prints one JSON object per line, so a shell pipeline can read it', async () => {
    const { streamFetch } = fakeStream([
      `id: 1725357600000-1\nevent: post.status\ndata: ${JSON.stringify(event('1725357600000-1'))}\n\n`,
      `: ping\n\n`,
      `id: 1725357600000-2\nevent: post.status\ndata: ${JSON.stringify(event('1725357600000-2'))}\n\n`,
    ]);
    const dependencies = deps({ streamFetch });

    const result = await runCli(['events', '--follow', '--no-reconnect'], dependencies);

    expect(result.exitCode).toBe(EXIT_OK);
    expect(dependencies.writer.stdout).toHaveLength(2);
    const lines = dependencies.writer.stdout.map((line) => JSON.parse(line) as { id: string });
    expect(lines.map((line) => line.id)).toEqual(['1725357600000-1', '1725357600000-2']);
  });

  it('sends the bearer token and pins the workspace', async () => {
    const { streamFetch, calls } = fakeStream([]);
    await runCli(['events', '--follow', '--no-reconnect'], deps({ streamFetch }));

    expect(calls[0]?.headers['authorization']).toBe(`Bearer ${CREDENTIAL.accessToken}`);
    expect(calls[0]?.headers[API_HEADERS.workspaceId]).toBe(WORKSPACE);
    expect(calls[0]?.headers['accept']).toBe('text/event-stream');
  });

  it('resumes from the id it was given, both ways the server accepts', async () => {
    const { streamFetch, calls } = fakeStream([]);
    await runCli(
      ['events', '--follow', '--no-reconnect', '--since', '1725357600000-9'],
      deps({ streamFetch }),
    );

    expect(calls[0]?.url).toContain('since=1725357600000-9');
    expect(calls[0]?.headers['last-event-id']).toBe('1725357600000-9');
  });

  it('passes a type filter through rather than filtering after the fact', async () => {
    const { streamFetch, calls } = fakeStream([]);
    await runCli(
      ['events', '--follow', '--no-reconnect', '--type', 'post.status', 'receipt.updated'],
      deps({ streamFetch }),
    );

    expect(calls[0]?.url).toContain('type=post.status%2Creceipt.updated');
  });

  it('refuses a type this stream does not carry, before opening anything', async () => {
    const { streamFetch, calls } = fakeStream([]);
    const dependencies = deps({ streamFetch });

    const result = await runCli(
      ['events', '--follow', '--no-reconnect', '--type', 'post.everything'],
      dependencies,
    );

    expect(result.exitCode).toBe(EXIT_CODES.VALIDATION_FAILED);
    expect(calls).toHaveLength(0);
  });

  it('refuses a resume point that is not a stream event id', async () => {
    const { streamFetch, calls } = fakeStream([]);
    const result = await runCli(
      ['events', '--follow', '--no-reconnect', '--since', 'yesterday'],
      deps({ streamFetch }),
    );

    expect(result.exitCode).toBe(EXIT_CODES.VALIDATION_FAILED);
    expect(calls).toHaveLength(0);
  });

  it('prints nothing for a frame it cannot parse', async () => {
    const { streamFetch } = fakeStream(['data: not json\n\n', 'data: {"type":"post.status"}\n\n']);
    const dependencies = deps({ streamFetch });

    await runCli(['events', '--follow', '--no-reconnect'], dependencies);
    expect(dependencies.writer.stdout).toEqual([]);
  });

  it('reports the API refusal as the CLI exit code, not as output', async () => {
    const { streamFetch } = fakeStream([], 403);
    const dependencies = deps({ streamFetch });

    const result = await runCli(['events', '--follow', '--no-reconnect'], dependencies);

    expect(result.exitCode).toBe(EXIT_CODES.FORBIDDEN);
    expect(dependencies.writer.stdout).toEqual([]);
  });
});

describe('postarray events', () => {
  it('reads a page without opening a stream', async () => {
    const { fetch, calls } = jsonFetch({
      events: [event('1725357600000-1')],
      lastEventId: '1725357600000-1',
    });
    const dependencies = deps({ fetch });

    const result = await runCli(['events', '--json'], dependencies);

    expect(result.exitCode).toBe(EXIT_OK);
    expect(calls[0]?.url).toContain('/v1/events/recent');
    const envelope = JSON.parse(
      dependencies.writer.stdout[dependencies.writer.stdout.length - 1] ?? '{}',
    ) as JsonEnvelope;
    expect(envelope.ok).toBe(true);
  });
});
