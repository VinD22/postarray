import { describe, expect, it } from 'vitest';

import { createMemoryConfigStore } from './config/store';
import { createMemoryCredentialStore } from './config/credentials';
import type { StoredCredential } from './config/credentials';
import { createContext } from './context';
import { createMemoryWriter } from './output';
import type { JsonEnvelope } from './output';
import { EXIT_CODES, EXIT_OK, EXIT_USAGE } from './exit-codes';
import { runCli } from './program';
import type { CliDeps } from './context';
import type { FetchLike } from './api/client';

const API_URL = 'https://api.relay.example/';

const CREDENTIAL: StoredCredential = {
  accessToken: 'super-secret-access-token',
  refreshToken: 'super-secret-refresh-token',
  expiresAt: '2026-08-05T12:00:00.000Z',
  tokenType: 'Bearer',
  scopes: ['accounts:read', 'drafts:read', 'posts:schedule'],
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

function fakeFetch(responder: (recorded: Recorded) => { status: number; body: unknown }): {
  fetch: FetchLike;
  calls: Recorded[];
} {
  const calls: Recorded[] = [];
  const fetchImpl: FetchLike = async (url, init) => {
    const recorded: Recorded = {
      url,
      method: init.method,
      headers: init.headers,
      body: init.body,
    };
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

function envelopeOf(lines: readonly string[]): JsonEnvelope {
  const last = lines[lines.length - 1];
  expect(last).toBeDefined();
  return JSON.parse(last ?? '{}') as JsonEnvelope;
}

describe('argv hygiene', () => {
  it('refuses to run when a secret is passed on the command line', async () => {
    const dependencies = deps();
    const result = await runCli(['accounts', 'list', '--token', 'abc'], dependencies);
    expect(result.exitCode).toBe(EXIT_CODES.FORBIDDEN);
    expect(dependencies.writer.stderr.join('\n')).toContain('FORBIDDEN');
    expect(dependencies.writer.stderr.join('\n')).not.toContain('abc');
  });

  it('refuses every known secret-shaped flag, including the = form', async () => {
    for (const argument of ['--api-key=x', '--client-secret=x', '--password=x', '--bearer=x']) {
      const dependencies = deps();
      const result = await runCli(['accounts', 'list', argument], dependencies);
      expect(result.exitCode, argument).toBe(EXIT_CODES.FORBIDDEN);
    }
  });

  it('has no token flag at all', async () => {
    const dependencies = deps();
    await runCli(['posts', 'schedule', '--help'], dependencies);
    expect(dependencies.writer.stdout.join('\n')).not.toContain('--token');
  });
});

describe('--json envelope', () => {
  it('has a stable success shape', async () => {
    const { fetch } = fakeFetch(() => ({
      status: 200,
      body: {
        data: [
          {
            id: 'conn_1',
            workspaceId: 'ws_01',
            projectId: null,
            provider: 'linkedin',
            accountType: 'organization',
            displayName: 'Acme',
            handle: 'acme',
            health: 'connected',
            statusMessageKey: null,
            capabilityVersion: 'linkedin@2026-08-01',
            connectedAt: '2026-07-01T09:00:00.000Z',
            lastSuccessfulActionAt: '2026-08-04T09:00:00.000Z',
          },
        ],
        pageInfo: { nextCursor: null, hasMore: false, limit: 25 },
      },
    }));
    const dependencies = deps({ fetch });
    const result = await runCli(['accounts', 'list', '--json'], dependencies);

    expect(result.exitCode).toBe(EXIT_OK);
    const envelope = envelopeOf(dependencies.writer.stdout);
    expect(envelope.ok).toBe(true);
    expect(envelope.apiVersion).toBe('v1');
    expect(envelope.command).toBe('accounts list');
    expect(envelope.error).toBeNull();
    expect(envelope.plannedExternalActions).toEqual([]);
    expect(typeof envelope.correlationId).toBe('string');
  });

  it('has a stable failure shape carrying the problem document', async () => {
    const { fetch } = fakeFetch(() => ({
      status: 403,
      body: {
        type: 'urn:relay:error:scope_insufficient',
        title: 'SCOPE_INSUFFICIENT',
        status: 403,
        code: 'SCOPE_INSUFFICIENT',
        messageKey: 'error.insufficient_scope.message',
        retryable: false,
        detail: { scope: 'accounts:read' },
      },
    }));
    const dependencies = deps({ fetch });
    const result = await runCli(['accounts', 'list', '--json'], dependencies);

    expect(result.exitCode).toBe(EXIT_CODES.SCOPE_INSUFFICIENT);
    const envelope = envelopeOf(dependencies.writer.stdout);
    expect(envelope.ok).toBe(false);
    expect(envelope.error?.code).toBe('SCOPE_INSUFFICIENT');
    expect(envelope.data).toBeNull();
  });
});

describe('exit codes', () => {
  it('maps each error code to its documented exit code', async () => {
    const cases: readonly [number, string][] = [
      [401, 'AUTH_REQUIRED'],
      [404, 'NOT_FOUND'],
      [409, 'CONFLICT'],
      [429, 'RATE_LIMITED'],
    ];
    for (const [status, code] of cases) {
      const { fetch } = fakeFetch(() => ({
        status,
        body: {
          type: `urn:relay:error:${code.toLowerCase()}`,
          title: code,
          status,
          code,
          messageKey: 'error.internal.message',
          retryable: false,
        },
      }));
      const dependencies = deps({ fetch });
      const result = await runCli(['accounts', 'list', '--json'], dependencies);
      expect(result.exitCode, code).toBe(EXIT_CODES[code as keyof typeof EXIT_CODES]);
    }
  });

  it('exits with the usage code for an unknown command', async () => {
    const dependencies = deps();
    const result = await runCli(['nonsense'], dependencies);
    expect(result.exitCode).toBe(EXIT_USAGE);
  });

  it('exits ok for --help', async () => {
    const dependencies = deps();
    const result = await runCli(['--help'], dependencies);
    expect(result.exitCode).toBe(EXIT_OK);
  });
});

describe('human locale selection', () => {
  it('uses an explicit locale for help while keeping command vocabulary stable', async () => {
    const dependencies = deps();
    const result = await runCli(['--locale', 'es', '--help'], dependencies);

    expect(result.exitCode).toBe(EXIT_OK);
    const help = dependencies.writer.stdout.join('\n');
    // This is an existing reviewed catalog message, not a CLI-specific copy
    // fixture. It proves Commander receives the locale-bound translator.
    expect(help).toContain('Agentes y API');
    expect(help).toContain('accounts');
  });

  it('localizes nested command help without translating command or option names', async () => {
    const dependencies = deps();
    const result = await runCli(['--locale', 'es', 'accounts', 'list', '--help'], dependencies);

    expect(result.exitCode).toBe(EXIT_OK);
    const help = dependencies.writer.stdout.join('\n');
    expect(help).toContain('Conexiones');
    expect(help).toContain('accounts list');
    expect(help).toContain('--limit');
  });

  it('resolves locale precedence as flag, profile, Relay env, then OS env', async () => {
    const explicit = deps({
      env: { RELAY_LOCALE: 'fr', LANG: 'de' },
    });
    const explicitContext = await createContext(
      { json: false, profile: undefined, apiUrl: undefined, workspaceId: undefined, dryRun: false, yes: false, locale: 'ja' },
      explicit,
    );
    expect(explicitContext.locale).toBe('ja');

    const profile = deps({
      configStore: createMemoryConfigStore({
        version: 1,
        defaultProfile: 'default',
        profiles: { default: { apiUrl: API_URL, locale: 'fr' } },
      }),
      env: { RELAY_LOCALE: 'de', LANG: 'ja' },
    });
    const profileContext = await createContext(
      { json: false, profile: undefined, apiUrl: undefined, workspaceId: undefined, dryRun: false, yes: false },
      profile,
    );
    expect(profileContext.locale).toBe('fr');

    const posix = deps({ env: { LANG: 'de_DE.UTF-8' } });
    const posixContext = await createContext(
      { json: false, profile: undefined, apiUrl: undefined, workspaceId: undefined, dryRun: false, yes: false },
      posix,
    );
    expect(posixContext.locale).toBe('de');
  });

  it('localizes human API errors without changing the machine error envelope', async () => {
    const { fetch } = fakeFetch(() => ({
      status: 403,
      body: {
        type: 'urn:relay:error:scope_insufficient',
        title: 'SCOPE_INSUFFICIENT',
        status: 403,
        code: 'SCOPE_INSUFFICIENT',
        messageKey: 'error.insufficient_scope.message',
        retryable: false,
        detail: { scope: 'accounts:read' },
      },
    }));
    const dependencies = deps({ fetch });
    const result = await runCli(['accounts', 'list', '--locale', 'es'], dependencies);

    expect(result.exitCode).toBe(EXIT_CODES.SCOPE_INSUFFICIENT);
    const human = dependencies.writer.stderr.join('\n');
    expect(human).toContain('error=SCOPE_INSUFFICIENT messageKey=error.insufficient_scope.message');
    // This particular catalog entry is currently an approved English
    // fallback. The important contract is that the translator is used and no
    // raw ICU key leaks into human output while the JSON shape stays stable.
    expect(human.split('\n')).not.toContain('error.insufficient_scope.message');
  });
});

describe('token handling', () => {
  it('sends the credential as a bearer header and never prints it', async () => {
    const { fetch, calls } = fakeFetch(() => ({
      status: 200,
      body: { data: [], pageInfo: { nextCursor: null, hasMore: false, limit: 25 } },
    }));
    const dependencies = deps({ fetch });
    await runCli(['accounts', 'list', '--json'], dependencies);

    expect(calls[0]?.headers['authorization']).toBe('Bearer super-secret-access-token');
    const printed = [...dependencies.writer.stdout, ...dependencies.writer.stderr].join('\n');
    expect(printed).not.toContain('super-secret-access-token');
    expect(printed).not.toContain('super-secret-refresh-token');
  });

  it('whoami reports the grant without the token', async () => {
    const { fetch } = fakeFetch(() => ({
      status: 200,
      body: {
        actorType: 'user',
        userId: 'user_01',
        workspaceIds: ['ws_01'],
        scopes: ['accounts:read'],
        approvalLevel: 'level_2_scheduled',
        emailVerified: true,
        locale: 'en',
      },
    }));
    const dependencies = deps({ fetch });
    const result = await runCli(['auth', 'whoami'], dependencies);

    expect(result.exitCode).toBe(EXIT_OK);
    const printed = dependencies.writer.stdout.join('\n');
    expect(printed).toContain('user_01');
    expect(printed).toContain('level_2_scheduled');
    expect(printed).not.toContain('super-secret-access-token');
  });

  it('fails cleanly with no credential rather than sending an anonymous request', async () => {
    const dependencies = deps({
      credentialStore: createMemoryCredentialStore(),
    });
    const result = await runCli(['accounts', 'list', '--json'], dependencies);
    expect(result.exitCode).toBe(EXIT_CODES.AUTH_REQUIRED);
    const envelope = envelopeOf(dependencies.writer.stdout);
    expect(envelope.error?.code).toBe('AUTH_REQUIRED');
  });
});

describe('consequential command guards', () => {
  it('refuses publish without --confirm and sends nothing', async () => {
    const { fetch, calls } = fakeFetch(() => ({ status: 200, body: {} }));
    const dependencies = deps({ fetch });
    const result = await runCli(
      [
        'posts',
        'publish',
        '--content-item',
        'content_1',
        '--idempotency-key',
        'abcdefgh',
        '--json',
      ],
      dependencies,
    );
    expect(result.exitCode).toBe(EXIT_CODES.APPROVAL_REQUIRED);
    expect(calls).toHaveLength(0);
  });

  it('refuses publish without an idempotency key', async () => {
    const { fetch, calls } = fakeFetch(() => ({ status: 200, body: {} }));
    const dependencies = deps({ fetch });
    const result = await runCli(
      ['posts', 'publish', '--content-item', 'content_1', '--confirm', '--json'],
      dependencies,
    );
    expect(result.exitCode).toBe(EXIT_CODES.VALIDATION_FAILED);
    expect(calls).toHaveLength(0);
  });

  it('refuses cancel without an idempotency key', async () => {
    const { fetch, calls } = fakeFetch(() => ({ status: 200, body: {} }));
    const dependencies = deps({ fetch });
    const result = await runCli(['posts', 'cancel', 'job_1', '--json'], dependencies);
    expect(result.exitCode).toBe(EXIT_CODES.VALIDATION_FAILED);
    expect(calls).toHaveLength(0);
  });
});

describe('config', () => {
  it('reads and writes non-sensitive settings only', async () => {
    const dependencies = deps();
    const set = await runCli(['config', 'set', 'workspaceId', 'ws_02', '--json'], dependencies);
    expect(set.exitCode).toBe(EXIT_OK);

    const get = await runCli(['config', 'get', 'workspaceId', '--json'], dependencies);
    expect(get.exitCode).toBe(EXIT_OK);
    const envelope = envelopeOf(dependencies.writer.stdout);
    expect(envelope.data).toEqual({ key: 'workspaceId', value: 'ws_02' });
  });

  it('rejects an unknown key rather than storing it', async () => {
    const dependencies = deps();
    const result = await runCli(['config', 'set', 'accessToken', 'x', '--json'], dependencies);
    expect(result.exitCode).toBe(EXIT_CODES.VALIDATION_FAILED);
  });
});
