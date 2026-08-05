import type { CapabilitySnapshot, ProviderId } from '@relay/contracts';

import { leaseSecret } from '../../vault.js';
import type {
  ConnectorDeps,
  DestinationRequest,
  HttpRequest,
  HttpResponse,
  MentionSearchRequest,
  MetricsRequest,
  OAuthGrant,
  PreparedMedia,
  ProviderConnection,
  ProviderDraft,
  ProviderMedia,
  ProviderThreadItem,
  PublishRequest,
  PublishResult,
  RefreshRequest,
  RevokeRequest,
  StatusRequest,
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
        requestId: null,
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

/** The obviously fake token every scripted connection reveals. */
export const TEST_ACCESS_TOKEN = 'fake-test-access-token-not-a-real-credential';

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
        return options.accessToken ?? TEST_ACCESS_TOKEN;
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
  readonly accessToken?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export function testConnection(options: TestConnectionOptions): ProviderConnection {
  const parentExternalId = options.parentExternalId ?? null;
  return {
    connectionId: `conn_test_${options.provider}`,
    workspaceId: 'ws_test_0000',
    provider: options.provider,
    accountType: options.accountType ?? 'personal_profile',
    externalAccountId: options.externalAccountId ?? 'external-account-0001',
    displayName: 'Sample Studio',
    grantedScopes: [...(options.scopes ?? [])],
    accessToken: leaseSecret({
      secret: options.accessToken ?? TEST_ACCESS_TOKEN,
      credentialKind: 'access_token',
      purpose: 'provider_adapter_test',
    }),
    locale: 'en',
    metadata: {
      // The Page an Instagram professional account hangs off travels in metadata on a
      // live connection, so the harness puts it exactly where the adapters read it.
      ...(parentExternalId === null ? {} : { parentExternalId }),
      ...(options.metadata ?? {}),
    },
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
    derivativeId: null,
    kind,
    mimeType: options.mimeType ?? (kind === 'video' ? 'video/mp4' : 'image/jpeg'),
    byteSize: options.byteSize ?? 120_000,
    width: options.width === undefined ? 1200 : options.width,
    height: options.height === undefined ? 900 : options.height,
    durationSeconds:
      options.durationSeconds === undefined ? (kind === 'video' ? 20 : null) : options.durationSeconds,
    altText: options.altText === undefined ? 'A sample photograph.' : options.altText,
    altTextWaived: options.altTextWaived ?? false,
    checksum: 'a'.repeat(64),
    sourceUrl: 'https://storage.invalid/media/sample',
    sourceUrlExpiresAt: '2026-08-04T13:00:00.000Z',
  };
}

export function testThreadItem(
  order: number,
  body: string,
  kind: ProviderThreadItem['kind'] = 'thread',
  delaySeconds = 0,
): ProviderThreadItem {
  return {
    threadItemId: `cmt_test_${order}`,
    kind,
    order,
    body,
    media: [],
    delaySeconds,
    links: [],
  };
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
  readonly disclosure?: ProviderDraft['disclosure'];
}

export function testDraft(options: TestDraftOptions): ProviderDraft {
  return {
    connection: options.connection,
    contentItemId: 'cnt_test_0001',
    postVariantId: 'pv_test_0001',
    capabilities: options.capabilities,
    contentKind: options.contentKind ?? 'text',
    title: options.title ?? null,
    body: options.body ?? 'A calm, specific sentence about the product.',
    locale: 'en',
    media: [...(options.media ?? [])],
    links: [],
    threadItems: [...(options.threadItems ?? [])],
    destination: options.destination ?? null,
    mentions: [...(options.mentions ?? [])],
    privacyValue: options.privacyValue ?? null,
    disclosure: options.disclosure ?? {
      aiAssisted: false,
      commercialContent: false,
      brandedContent: false,
    },
    scheduledInstant: null,
    createdVia: 'web',
  };
}

const TEST_CHECKSUM = 'b'.repeat(64);
const TEST_INSTANT = '2026-08-04T12:00:00.000Z';

export interface TestPublishRequestOptions {
  readonly draft: ProviderDraft;
  readonly preparedMedia?: readonly PreparedMedia[];
  readonly idempotencyKey?: string;
  readonly contentFingerprint?: string;
  readonly dispatchedAt?: string;
}

/** A `PublishRequest` with the draft nested exactly where the contract puts it. */
export function testPublishRequest(options: TestPublishRequestOptions): PublishRequest {
  return {
    draft: options.draft,
    preparedMedia: [...(options.preparedMedia ?? [])],
    contentVersionId: 'cv_test_0001',
    contentVersionChecksum: TEST_CHECKSUM,
    capabilityVersion: options.draft.capabilities.capabilityVersion,
    idempotencyKey: options.idempotencyKey ?? 'idem-test-00000001',
    contentFingerprint: options.contentFingerprint ?? 'c'.repeat(64),
    dispatchedAt: options.dispatchedAt ?? TEST_INSTANT,
  };
}

export interface TestStatusRequestOptions {
  readonly connection: ProviderConnection;
  readonly providerJobId?: string | null;
  readonly externalPostId?: string | null;
  readonly contentFingerprint?: string;
  readonly dispatchWindowFrom?: string;
  readonly dispatchWindowTo?: string;
}

export function testStatusRequest(options: TestStatusRequestOptions): StatusRequest {
  return {
    connection: options.connection,
    providerJobId: options.providerJobId ?? null,
    externalPostId: options.externalPostId ?? null,
    idempotencyKey: 'idem-test-00000001',
    contentFingerprint: options.contentFingerprint ?? 'c'.repeat(64),
    dispatchWindowFrom: options.dispatchWindowFrom ?? '2026-08-04T11:00:00.000Z',
    dispatchWindowTo: options.dispatchWindowTo ?? TEST_INSTANT,
  };
}

export interface TestMetricsRequestOptions {
  readonly connection: ProviderConnection;
  readonly scope: MetricsRequest['scope'];
  readonly externalPostId?: string | null;
  readonly rangeFrom?: string | null;
  readonly rangeTo?: string | null;
  readonly metrics?: MetricsRequest['metrics'];
}

export function testMetricsRequest(options: TestMetricsRequestOptions): MetricsRequest {
  return {
    connection: options.connection,
    scope: options.scope,
    externalPostId: options.externalPostId ?? null,
    rangeFrom: options.rangeFrom ?? null,
    rangeTo: options.rangeTo ?? null,
    metrics: [...(options.metrics ?? [])],
  };
}

export function testDestinationRequest(
  connection: ProviderConnection,
  kind: DestinationRequest['kind'],
  overrides: { query?: string | null; cursor?: string | null; limit?: number } = {},
): DestinationRequest {
  return {
    connection,
    kind,
    query: overrides.query ?? null,
    cursor: overrides.cursor ?? null,
    limit: overrides.limit ?? 25,
  };
}

export function testMentionSearchRequest(
  connection: ProviderConnection,
  query: string,
  limit = 10,
): MentionSearchRequest {
  return { connection, query, limit };
}

export interface TestGrantOptions {
  readonly provider: OAuthGrant['provider'];
  readonly scopes?: readonly string[];
  readonly accessToken?: string;
  readonly grantMetadata?: Readonly<Record<string, unknown>>;
}

export function testGrant(options: TestGrantOptions): OAuthGrant {
  return {
    provider: options.provider,
    workspaceId: 'ws_test_0000',
    accessToken: leaseSecret({
      secret: options.accessToken ?? TEST_ACCESS_TOKEN,
      credentialKind: 'access_token',
      purpose: 'provider_adapter_test',
    }),
    refreshToken: null,
    grantedScopes: [...(options.scopes ?? [])],
    obtainedAt: TEST_INSTANT,
    accessTokenExpiresAt: null,
    grantMetadata: { ...(options.grantMetadata ?? {}) },
  };
}

export function testRefreshRequest(
  connection: ProviderConnection,
  clientId = 'test-client',
): RefreshRequest {
  return {
    connectionId: connection.connectionId,
    workspaceId: connection.workspaceId,
    provider: connection.provider,
    refreshToken: leaseSecret({
      secret: 'fake-test-refresh-token-not-a-real-credential',
      credentialKind: 'refresh_token',
      purpose: 'provider_adapter_test',
    }),
    grantedScopes: [...connection.grantedScopes],
    client: { clientId, clientSecret: null, redirectUri: 'https://app.relay.invalid/oauth/callback' },
  };
}

export function testRevokeRequest(
  connection: ProviderConnection,
  clientId = 'test-client',
): RevokeRequest {
  return {
    connectionId: connection.connectionId,
    workspaceId: connection.workspaceId,
    provider: connection.provider,
    accessToken: connection.accessToken,
    refreshToken: null,
    client: { clientId, clientSecret: null, redirectUri: 'https://app.relay.invalid/oauth/callback' },
  };
}

/**
 * Narrow a `PublishResult` in a test.
 *
 * The result is a discriminated union on purpose, so a test that wants the
 * published fields has to say so. These helpers fail loudly with the status
 * that actually came back, which is more useful than a type assertion.
 */
export function expectPublished(
  result: PublishResult,
): Extract<PublishResult, { status: 'published' }> {
  if (result.status !== 'published') {
    throw new Error(`expected a published result, received "${result.status}"`);
  }
  return result;
}

export function expectPartial(result: PublishResult): Extract<PublishResult, { status: 'partial' }> {
  if (result.status !== 'partial') {
    throw new Error(`expected a partial result, received "${result.status}"`);
  }
  return result;
}

export function expectPending(result: PublishResult): Extract<PublishResult, { status: 'pending' }> {
  if (result.status !== 'pending') {
    throw new Error(`expected a pending result, received "${result.status}"`);
  }
  return result;
}
