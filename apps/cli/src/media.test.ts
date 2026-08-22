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

/**
 * `relay media`.
 *
 * What is held here is the part a script depends on: which requests an upload
 * makes and in what order, that the bytes go exactly where the ticket said,
 * that a consequential command refuses to run without an idempotency key, and
 * that the `--json` envelope carries the same shape every other command's does.
 */

const API_URL = 'https://api.relay.example/';

const CREDENTIAL: StoredCredential = {
  accessToken: 'super-secret-access-token',
  refreshToken: null,
  expiresAt: '2026-09-05T12:00:00.000Z',
  tokenType: 'Bearer',
  scopes: ['media:read', 'media:write'],
  subject: 'user_01',
  workspaceId: 'ws_01',
  apiUrl: API_URL,
  issuer: 'https://api.relay.example',
  obtainedAt: '2026-08-04T12:00:00.000Z',
};

interface Recorded {
  readonly url: string;
  readonly method: string;
  readonly headers: Record<string, string>;
  readonly body: string | Uint8Array | undefined;
}

const ASSET = {
  id: 'media_01',
  workspaceId: 'ws_01',
  projectId: null,
  kind: 'image',
  fileName: 'launch.png',
  mimeType: 'image/png',
  byteSize: 5,
  width: null,
  height: null,
  durationMs: null,
  checksumSha256: 'a'.repeat(64),
  altText: null,
  altTextWaived: false,
  scanState: 'pending',
  originKind: 'upload',
  originUrl: null,
  retentionExpiresAt: '2026-09-04T12:00:00.000Z',
  storageAvailable: false,
  createdAt: '2026-08-04T12:00:00.000Z',
};

function fakeFetch(responder: (recorded: Recorded) => { status: number; body: unknown }): {
  fetch: FetchLike;
  calls: Recorded[];
} {
  const calls: Recorded[] = [];
  const fetchImpl: FetchLike = async (url, init) => {
    const recorded: Recorded = { url, method: init.method, headers: init.headers, body: init.body };
    calls.push(recorded);
    const response = responder(recorded);
    return {
      status: response.status,
      headers: { get: () => null },
      text: async () => JSON.stringify(response.body),
    };
  };
  return { fetch: fetchImpl, calls };
}

interface TestDeps extends CliDeps {
  readonly writer: ReturnType<typeof createMemoryWriter>;
}

function deps(overrides: Omit<Partial<CliDeps>, 'writer'> = {}): TestDeps {
  const writer = createMemoryWriter();
  return {
    configStore: createMemoryConfigStore({
      version: 1,
      defaultProfile: 'default',
      profiles: { default: { apiUrl: API_URL, workspaceId: 'ws_01' } },
    }),
    credentialStore: createMemoryCredentialStore({ version: 1, profiles: { default: CREDENTIAL } }),
    env: {},
    clock: { now: () => Date.parse('2026-08-04T12:00:00.000Z') },
    readFile: async () => new Uint8Array([1, 2, 3, 4, 5]),
    ...overrides,
    writer,
  };
}

function envelopeOf(lines: readonly string[]): JsonEnvelope {
  const last = lines[lines.length - 1];
  expect(last).toBeDefined();
  return JSON.parse(last ?? '{}') as JsonEnvelope;
}

function uploadResponder(recorded: Recorded): { status: number; body: unknown } {
  if (recorded.url.endsWith('/v1/media/uploads')) {
    return {
      status: 201,
      body: {
        mediaId: 'media_01',
        uploadUrl: 'https://api.relay.example/v1/media/uploads/ws_01/' + 'a'.repeat(64),
        method: 'PUT',
        headers: { 'x-relay-content-sha256': 'a'.repeat(64) },
        expiresAt: '2026-08-04T12:15:00.000Z',
        retentionExpiresAt: '2026-09-04T12:00:00.000Z',
      },
    };
  }
  if (recorded.url.includes('/finalize')) {
    return { status: 202, body: ASSET };
  }
  return { status: 200, body: { byteSize: 5 } };
}

describe('relay media, argument parsing', () => {
  it('refuses an upload without an idempotency key', async () => {
    const dependencies = deps();
    const result = await runCli(['media', 'upload', './launch.png'], dependencies);
    expect(result.exitCode).toBe(EXIT_CODES.VALIDATION_FAILED);
    expect(dependencies.writer.stderr.join('\n')).toContain('IDEMPOTENCY_KEY_REQUIRED');
  });

  it('refuses a file type the library does not accept, before reading anything', async () => {
    const dependencies = deps({
      readFile: async () => {
        throw new Error('the file must not be read');
      },
    });
    const result = await runCli(
      ['media', 'upload', './notes.txt', '--idempotency-key', 'k1'],
      dependencies,
    );
    expect(result.exitCode).toBe(EXIT_CODES.VALIDATION_FAILED);
    expect(dependencies.writer.stderr.join('\n')).toContain('MEDIA_TYPE_NOT_UPLOADABLE');
  });

  it('refuses an import of something that is not a URL, and one without a key', async () => {
    const bad = deps();
    expect(
      (await runCli(['media', 'import', 'not-a-url', '--idempotency-key', 'k1'], bad)).exitCode,
    ).toBe(EXIT_CODES.VALIDATION_FAILED);
    expect(bad.writer.stderr.join('\n')).toContain('MEDIA_IMPORT_URL_MALFORMED');

    const keyless = deps();
    expect(
      (await runCli(['media', 'import', 'https://acme.example/a.png'], keyless)).exitCode,
    ).toBe(EXIT_CODES.VALIDATION_FAILED);
    expect(keyless.writer.stderr.join('\n')).toContain('IDEMPOTENCY_KEY_REQUIRED');
  });

  it('rejects a media kind that is not one of the five', async () => {
    const dependencies = deps();
    const result = await runCli(['media', 'list', '--kind', 'hologram'], dependencies);
    expect(result.exitCode).toBe(EXIT_CODES.VALIDATION_FAILED);
    expect(dependencies.writer.stderr.join('\n')).toContain('MEDIA_KIND_UNKNOWN');
  });

  it('has no flag that would ask for generated media', async () => {
    const dependencies = deps();
    await runCli(['media', '--help'], dependencies);
    const help = dependencies.writer.stdout.join('\n');
    expect(help).not.toMatch(/--prompt|--model/);
    expect(help).not.toMatch(/^\s+generate\b/m);
    expect(help).toContain('upload');
    expect(help).toContain('import');
  });
});

describe('relay media upload', () => {
  it('asks for a ticket, sends the bytes where it says, then finalizes', async () => {
    const { fetch, calls } = fakeFetch(uploadResponder);
    const dependencies = deps({ fetch });
    const result = await runCli(
      ['media', 'upload', './launch.png', '--idempotency-key', 'launch-1'],
      dependencies,
    );

    expect(result.exitCode).toBe(EXIT_OK);
    expect(calls.map((call) => `${call.method} ${new URL(call.url).pathname}`)).toEqual([
      'POST /v1/media/uploads',
      `PUT /v1/media/uploads/ws_01/${'a'.repeat(64)}`,
      'POST /v1/media/media_01/finalize',
    ]);

    const ticketRequest = JSON.parse(String(calls[0]?.body)) as Record<string, unknown>;
    expect(ticketRequest).toMatchObject({
      filename: 'launch.png',
      mimeType: 'image/png',
      byteSize: 5,
    });
    // The checksum is computed from the bytes, not taken from the caller.
    expect(ticketRequest.sha256).toMatch(/^[0-9a-f]{64}$/);

    const put = calls[1];
    expect(put?.body).toBeInstanceOf(Uint8Array);
    expect(put?.headers['x-relay-content-sha256']).toBe('a'.repeat(64));
    expect(put?.headers['content-type']).toBe('image/png');

    // Two distinct keys: the ticket and the finalize are different writes.
    expect(calls[0]?.headers['idempotency-key']).toBe('launch-1');
    expect(calls[2]?.headers['idempotency-key']).toBe('launch-1:finalize');
  });

  it('never sends the bearer token to an upload host that is not ours', async () => {
    const { fetch, calls } = fakeFetch((recorded) => {
      if (recorded.url.endsWith('/v1/media/uploads')) {
        return {
          status: 201,
          body: {
            mediaId: 'media_01',
            uploadUrl: 'https://objects.example.net/bucket/key?signature=abc',
            method: 'PUT',
            headers: {},
            expiresAt: '2026-08-04T12:15:00.000Z',
            retentionExpiresAt: '2026-09-04T12:00:00.000Z',
          },
        };
      }
      return recorded.url.includes('/finalize')
        ? { status: 202, body: ASSET }
        : { status: 200, body: {} };
    });
    const dependencies = deps({ fetch });
    await runCli(['media', 'upload', './clip.mp4', '--idempotency-key', 'clip-1'], dependencies);

    const put = calls[1];
    expect(put?.url).toContain('objects.example.net');
    expect(Object.keys(put?.headers ?? {})).not.toContain('authorization');
    expect(JSON.stringify(put?.headers)).not.toContain('super-secret-access-token');
  });

  it('produces the standard envelope and reports unknown dimensions as unavailable', async () => {
    const { fetch } = fakeFetch(uploadResponder);
    const dependencies = deps({ fetch });
    const result = await runCli(
      ['media', 'upload', './launch.png', '--idempotency-key', 'launch-1', '--json'],
      dependencies,
    );

    expect(result.exitCode).toBe(EXIT_OK);
    const envelope = envelopeOf(dependencies.writer.stdout);
    expect(envelope.ok).toBe(true);
    expect(envelope.command).toBe('media upload');
    expect(envelope.error).toBeNull();
    expect(envelope.plannedExternalActions).toEqual([]);
    expect(envelope.data).toMatchObject({
      id: 'media_01',
      kind: 'image',
      width: null,
      height: null,
      scanState: 'pending',
      storageAvailable: false,
    });
  });

  it('reports a rejected storage write instead of claiming the file landed', async () => {
    const { fetch } = fakeFetch((recorded) =>
      recorded.url.endsWith('/v1/media/uploads')
        ? uploadResponder(recorded)
        : { status: 507, body: {} },
    );
    const dependencies = deps({ fetch });
    const result = await runCli(
      ['media', 'upload', './launch.png', '--idempotency-key', 'launch-1', '--json'],
      dependencies,
    );

    expect(result.exitCode).not.toBe(EXIT_OK);
    const envelope = envelopeOf(dependencies.writer.stdout);
    expect(envelope.ok).toBe(false);
    expect(envelope.data).toBeNull();
    expect(envelope.error?.code).toBe('INTERNAL');
    expect(envelope.error?.detail).toMatchObject({ reason: 'MEDIA_UPLOAD_REJECTED' });
  });
});

describe('relay media import and list', () => {
  it('returns the operation handle, with the media id absent until it exists', async () => {
    const { fetch, calls } = fakeFetch(() => ({
      status: 200,
      body: {
        operationId: 'op_01m0n4fsa5gksegrpajd3290ah',
        status: 'queued',
        resourceType: 'media_asset',
        resourceId: null,
        createdAt: '2026-08-04T12:00:00.000Z',
        completedAt: null,
        error: null,
      },
    }));
    const dependencies = deps({ fetch });
    const result = await runCli(
      [
        'media',
        'import',
        'https://acme.example/launch.png',
        '--idempotency-key',
        'import-1',
        '--json',
      ],
      dependencies,
    );

    expect(result.exitCode).toBe(EXIT_OK);
    expect(calls[0]?.headers['idempotency-key']).toBe('import-1');
    expect(JSON.parse(String(calls[0]?.body))).toEqual({
      url: 'https://acme.example/launch.png',
    });
    const envelope = envelopeOf(dependencies.writer.stdout);
    expect(envelope.command).toBe('media import');
    expect(envelope.data).toMatchObject({
      operationId: 'op_01m0n4fsa5gksegrpajd3290ah',
      status: 'queued',
      resourceId: null,
    });
  });

  it('pages the library like every other list command', async () => {
    const { fetch, calls } = fakeFetch(() => ({
      status: 200,
      body: { data: [ASSET], pageInfo: { nextCursor: null, hasMore: false, limit: 25 } },
    }));
    const dependencies = deps({ fetch });
    const result = await runCli(
      ['media', 'list', '--kind', 'image', '--limit', '25', '--json'],
      dependencies,
    );

    expect(result.exitCode).toBe(EXIT_OK);
    expect(calls[0]?.url).toContain('kind=image');
    expect(calls[0]?.url).toContain('limit=25');
    const envelope = envelopeOf(dependencies.writer.stdout);
    expect(envelope.command).toBe('media list');
    expect(envelope.data).toMatchObject({ pageInfo: { hasMore: false } });
  });
});
