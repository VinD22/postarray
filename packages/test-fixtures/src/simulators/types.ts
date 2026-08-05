import type { ProviderId } from '@relay/contracts';

/**
 * The provider simulator contract.
 *
 * Every V1 provider has an in-process simulator that mimics the real HTTP
 * request and response shapes, the container and polling lifecycles and the
 * error bodies, so connector contract tests never touch a network. The
 * difference this buys is the difference between "we hope retries work" and
 * "we know retries work".
 *
 * Behaviour is selected per request with the `x-sim-mode` header, or set as a
 * default on the simulator. Every mode is deterministic: the same request in
 * the same mode against the same state always produces the same response.
 */

export const SIMULATOR_MODE_HEADER = 'x-sim-mode';

export const SIMULATOR_MODES = [
  /** Baseline. */
  'happy',
  /** 429 with `Retry-After` and the provider's own reset headers. */
  'rate_limited',
  /** 500 with a provider shaped body. */
  'server_error',
  /** 500 on the first attempt for a path, then success. Retry safety. */
  'flaky',
  /** The provider accepted the create, then the response is slow to arrive. */
  'slow_accept',
  /** The provider accepted the create and the client never sees the response. */
  'lost_response',
  /** The access token expired mid-flow. */
  'expired_token',
  /** The user revoked the app's access at the provider. */
  'revoked',
  /** A scope or a page role is missing. */
  'forbidden',
  /** The provider rejected the content itself. */
  'content_invalid',
  /** The provider says this is a duplicate of something already posted. */
  'duplicate',
  /** A media container that never leaves processing. */
  'stuck_container',
  /** A media container that finishes, but only after several polls. */
  'slow_media',
  /** Accepted with no external id; the id appears on a later status poll. */
  'deferred_external_id',
  /** Capabilities changed between approval and dispatch. */
  'capability_changed',
  /** A body that does not match the documented shape at all. */
  'malformed',
  /** An error body that echoes an authorization header. Sanitizer coverage. */
  'token_echo',
  /** The root published and a thread item or comment was rejected. */
  'partial_success',
] as const;
export type SimulatorMode = (typeof SIMULATOR_MODES)[number];

export function isSimulatorMode(value: string): value is SimulatorMode {
  return (SIMULATOR_MODES as readonly string[]).includes(value);
}

export const FAILURE_KINDS = [
  'unauthorized',
  'expired_token',
  'revoked',
  'forbidden',
  'rate_limited',
  'server_error',
  'content_invalid',
  'duplicate',
  'not_found',
  'token_echo',
] as const;
export type FailureKind = (typeof FAILURE_KINDS)[number];

export interface SimulatedRequest {
  readonly method: string;
  readonly url: string;
  readonly path: string;
  readonly query: URLSearchParams;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: unknown;
  readonly mode: SimulatorMode;
  readonly receivedAt: string;
}

export interface SimulatedResponse {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: unknown;
  /** Milliseconds the transport should wait before delivering the response. */
  readonly delayMs?: number;
}

/**
 * Thrown when the provider accepted a write and the client never receives the
 * response. This is the duplicate-publication trap, reproduced on demand.
 */
export class SimulatedNetworkError extends Error {
  readonly provider: ProviderId;

  constructor(provider: ProviderId, message = 'SIMULATED_NETWORK_FAILURE') {
    super(message);
    this.name = 'SimulatedNetworkError';
    this.provider = provider;
  }
}

/** A write the provider recorded, whether or not the client heard about it. */
export interface SimulatedPost {
  readonly id: string;
  readonly provider: ProviderId;
  readonly accountId: string;
  readonly text: string;
  readonly mediaIds: readonly string[];
  readonly parentId: string | null;
  readonly createdAt: string;
  readonly idempotencyKey: string | null;
}

export const CONTAINER_STATES = ['in_progress', 'finished', 'error', 'published'] as const;
export type ContainerState = (typeof CONTAINER_STATES)[number];

/** A media container or upload job, for the providers that use one. */
export interface SimulatedContainer {
  readonly id: string;
  readonly provider: ProviderId;
  readonly accountId: string;
  state: ContainerState;
  /** How many polls remain before the container finishes. */
  pollsRemaining: number;
  readonly errorReason: string | null;
  readonly createdAt: string;
  externalPostId: string | null;
}

export interface ProviderSimulator {
  readonly provider: ProviderId;
  /** Always on `example.test`, which can never resolve. */
  readonly host: string;
  readonly baseUrl: string;
  /** Every request the simulator saw, in order. */
  readonly requests: readonly SimulatedRequest[];
  /** Every write the provider recorded, including ones the client never saw. */
  readonly posts: readonly SimulatedPost[];
  /** The mode applied when a request does not carry `x-sim-mode`. */
  readonly currentMode: SimulatorMode;
  handle(request: SimulatedRequest): Promise<SimulatedResponse>;
  setDefaultMode(mode: SimulatorMode): void;
  reset(): void;
}

/** Polls a `slow_media` container needs before it finishes. */
export const SLOW_MEDIA_POLLS = 3;

/** Polls before a `deferred_external_id` create reveals its external id. */
export const DEFERRED_ID_POLLS = 2;

/** Seconds a `rate_limited` response asks the client to wait. */
export const RETRY_AFTER_SECONDS = 900;

/** How long a `slow_accept` response takes to arrive. */
export const SLOW_ACCEPT_DELAY_MS = 30_000;
