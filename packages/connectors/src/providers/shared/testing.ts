import type { CapabilitySnapshot, ProviderId } from '@relay/contracts';

import type {
  ConnectorDeps,
  HttpRequest,
  HttpResponse,
  ProviderConnection,
  ProviderDraft,
  ProviderMedia,
  ProviderThreadItem,
} from './contract-shape.js';

/**
 * Test harness for the provider adapters.
 *
 * There is no network here and there never will be: every route is answered from a
 * scripted table backed by the recorded fixtures. This is the "provider simulator" the
 * test strategy asks for, in its smallest useful form.
 */

export interface ScriptedRoute {
  readonly method: HttpRequest['method'];
  /** Matched against the request URL with `includes`, so a path fragment is enough. */
  readonly match: string;
  readonly status?: number;
  readonly body?: unknown;
  readonly text?: string;
  readonly bytes?: Uint8Array;
  readonly headers?: Readonly<Record<string, string>>;
  /** Answer this route only once, then fall through to the next matching route. */
  readonly once?: boolean;
  /** Throw a transport style failure instead of answering. */
  readonly transportError?: string;
}

export interface RecordedCall {
  readonly method: HttpRequest['method'];
  readonly url: string;
  readonly operation: string;
  readonly json: unknown;
  readonly query: Readonly<Record<string, unknown>> | undefined;
}

export interface SimulatorHandle {
  readonly calls: RecordedCall[];
  push(route: ScriptedRoute): void;
  reset(routes: readonly ScriptedRoute[]): void;
  callsTo(fragment: string): RecordedCall[];
}

export interface TestDeps {
  readonly deps: ConnectorDeps;
  readonly simulator: SimulatorHandle;
  readonly logs: { level: string; message: string }[];
}

const NO_BYTES = new Uint8Array(0);

/**
 * A scripted HTTP client. Non-2xx statuses resolve rather than throw, which is the
 * contract the adapters rely on so they can read an error body.
 */
export function createSimulator(initial: readonly ScriptedRoute[] = []): {
  client: { request(input: HttpRequest): Promise<HttpResponse> };
  handle: SimulatorHandle;
} {
  let routes: ScriptedRoute[] = [...initial];
  const used = new WeakSet<ScriptedRoute>();
  const calls: RecordedCall[] = [];

  const handle: SimulatorHandle = {
    calls,
    push(route) {
      routes.push(route);
    },
    reset(next) {
      routes = [...next];
      calls.length = 0;
    },
    callsTo(fragment) {
      return calls.filter((call) => call.url.includes(fragment));
    },
  };

  const client = {
    async request(input: HttpRequest): Promise<HttpResponse> {
      calls.push({
        method: input.method,
        url: input.url,
        operation: input.operation,
        json: input.json ?? null,
        query: input.query,
      });
      const route = routes.find(
        (candidate) =>
          candidate.method === input.method &&
          input.url.includes(candidate.match) &&
          !(candidate.once === true && used.has(candidate)),
      );
      if (route === undefined) {
        throw new Error(`No scripted route for ${input.method} ${input.url}`);
      }
      if (route.once === true) {
        used.add(route);
      }
      if (route.transportError !== undefined) {
        const error = new Error(route.transportError);
        Object.assign(error, { code: route.transportError });
        throw error;
      }
      const status = route.status ?? 200;
      return {
        status,
        ok: status >= 200 && status < 300,
        headers: route.headers ?? {},
        body: route.body ?? null,
        text: route.text ?? (route.body === undefined ? '' : JSON.stringify(route.body)),
        bytes: route.bytes ?? NO_BYTES,
      };
    },
  };

  return { client, handle };
}

export interface TestDepsOptions {
  readonly routes?: readonly ScriptedRoute[];
  readonly now?: Date;
  readonly accessToken?: string;
  readonly providers?: Partial<ConnectorDeps['config']['providers']>;
}

const DEFAULT_PROVIDERS: ConnectorDeps['config']['providers'] = {
  x: { clientId: 'test-x-client', clientSecret: 'test-x-secret' },
  linkedin: { clientId: 'test-linkedin-client', clientSecret: 'test-linkedin-secret' },
  meta: { appId: 'test-meta-app', appSecret: 'test-meta-secret' },
  google: { clientId: 'test-google-client', clientSecret: 'test-google-secret' },
  tiktok: { clientKey: 'test-tiktok-key', clientSecret: 'test-tiktok-secret' },
  bluesky: { serviceUrl: 'https://bsky.invalid' },
};

/** Deps wired to the simulator. The vault returns an obviously fake test token. */
export function createTestDeps(options: TestDepsOptions = {}): TestDeps {
  const { client, handle } = createSimulator(options.routes ?? []);
  const logs: { level: string; message: string }[] = [];
  const record =
    (level: string) =>
    (_bindings: Record<string, unknown>, message: string): void => {
      logs.push({ level, message });
    };
  const fixedNow = options.now ?? new Date('2026-08-04T12:00:00.000Z');

  const deps: ConnectorDeps = {
    http: client,
    vault: {
      async getAccessToken() {
        return options.accessToken ?? 'fake-test-access-token-not-a-real-credential';
      },
      async getSecret() {
        return 'fake-test-secret-not-a-real-credential';
      },
    },
    logger: {
      debug: record('debug'),
      info: record('info'),
      warn: record('warn'),
      error: record('error'),
    },
    clock: { now: () => fixedNow },
    config: { providers: { ...DEFAULT_PROVIDERS, ...(options.providers ?? {}) } },
    redirectBaseUrl: 'https://app.relay.invalid',
  };

  return { deps, simulator: handle, logs };
}

export interface TestConnectionOptions {
  readonly provider: ProviderId;
  readonly accountType?: ProviderConnection['accountType'];
  readonly externalAccountId?: string;
  readonly parentExternalId?: string | null;
  readonly scopes?: readonly string[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export function testConnection(options: TestConnectionOptions): ProviderConnection {
  return {
    connectionId: `conn_test_${options.provider}`,
    workspaceId: 'ws_test_0000',
    provider: options.provider,
    accountType: options.accountType ?? 'personal_profile',
    externalAccountId: options.externalAccountId ?? 'external-account-0001',
    parentExternalId: options.parentExternalId ?? null,
    displayName: 'Sample Studio',
    scopes: options.scopes ?? [],
    credentialRef: `cred_test_${options.provider}`,
    metadata: options.metadata ?? {},
  };
}

export interface TestMediaOptions {
  readonly kind?: ProviderMedia['kind'];
  readonly mimeType?: string;
  readonly byteSize?: number;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly durationSeconds?: number | null;
  readonly altText?: string | null;
  readonly altTextWaived?: boolean;
}

export function testMedia(options: TestMediaOptions = {}): ProviderMedia {
  const kind = options.kind ?? 'image';
  return {
    mediaId: `media_test_${kind}`,
    kind,
    mimeType: options.mimeType ?? (kind === 'video' ? 'video/mp4' : 'image/jpeg'),
    byteSize: options.byteSize ?? 120_000,
    width: options.width === undefined ? 1200 : options.width,
    height: options.height === undefined ? 900 : options.height,
    durationSeconds:
      options.durationSeconds === undefined ? (kind === 'video' ? 20 : null) : options.durationSeconds,
    altText: options.altText === undefined ? 'A sample photograph.' : options.altText,
    altTextWaived: options.altTextWaived ?? false,
    sha256: 'a'.repeat(64),
    downloadUrl: 'https://storage.invalid/media/sample',
  };
}

export function testThreadItem(
  order: number,
  body: string,
  kind: ProviderThreadItem['kind'] = 'thread',
  delaySeconds = 0,
): ProviderThreadItem {
  return { id: `cmt_test_${order}`, kind, order, body, media: [], delaySeconds };
}

export interface TestDraftOptions {
  readonly connection: ProviderConnection;
  readonly capabilities: CapabilitySnapshot;
  readonly body?: string;
  readonly title?: string | null;
  readonly contentKind?: ProviderDraft['contentKind'];
  readonly media?: readonly ProviderMedia[];
  readonly threadItems?: readonly ProviderThreadItem[];
  readonly privacyValue?: string | null;
  readonly destination?: ProviderDraft['destination'];
  readonly mentions?: ProviderDraft['mentions'];
  readonly providerOptions?: Readonly<Record<string, unknown>>;
  readonly disclosure?: ProviderDraft['disclosure'];
}

export function testDraft(options: TestDraftOptions): ProviderDraft {
  return {
    connection: options.connection,
    capabilities: options.capabilities,
    contentKind: options.contentKind ?? 'text',
    title: options.title ?? null,
    body: options.body ?? 'A calm, specific sentence about the product.',
    locale: 'en',
    media: options.media ?? [],
    links: [],
    threadItems: options.threadItems ?? [],
    destination: options.destination ?? null,
    mentions: options.mentions ?? [],
    privacyValue: options.privacyValue ?? null,
    disclosure: options.disclosure ?? {
      aiAssisted: false,
      commercialContent: false,
      brandedContent: false,
    },
    providerOptions: options.providerOptions ?? {},
  };
}
