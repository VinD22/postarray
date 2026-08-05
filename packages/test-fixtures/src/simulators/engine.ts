import type { ProviderId } from '@relay/contracts';

import { FAKE_BEARER_TOKEN, fakeExternalId } from '../ids';
import {
  DEFERRED_ID_POLLS,
  SLOW_ACCEPT_DELAY_MS,
  SLOW_MEDIA_POLLS,
  SimulatedNetworkError,
} from './types';
import type {
  FailureKind,
  ProviderSimulator,
  SimulatedContainer,
  SimulatedPost,
  SimulatedRequest,
  SimulatedResponse,
  SimulatorMode,
} from './types';

/**
 * The shared simulator engine.
 *
 * It owns the parts that are the same on every provider: request recording,
 * mode dispatch, rate-limit and flaky-retry counters, the post store and the
 * container store. Each provider subclass supplies its own routing and its own
 * error envelope, because those are exactly the parts a connector parses and
 * therefore exactly the parts a fixture must get right.
 */

export interface BaseSimulatorOptions {
  /** Applied when a request does not carry `x-sim-mode`. */
  readonly defaultMode?: SimulatorMode;
  /** How many times `flaky` fails a given path before succeeding. */
  readonly flakyFailures?: number;
  /** Instant the simulator stamps on created objects. */
  readonly now?: string;
}

/** Modes the engine resolves before the provider routes the request. */
const SHORT_CIRCUIT_MODES: Readonly<Partial<Record<SimulatorMode, FailureKind>>> = {
  rate_limited: 'rate_limited',
  server_error: 'server_error',
  expired_token: 'expired_token',
  revoked: 'revoked',
  forbidden: 'forbidden',
  token_echo: 'token_echo',
};

export abstract class BaseProviderSimulator implements ProviderSimulator {
  abstract readonly provider: ProviderId;
  abstract readonly host: string;

  protected defaultMode: SimulatorMode;
  protected readonly flakyFailures: number;
  protected readonly now: string;

  private readonly requestLog: SimulatedRequest[] = [];
  private readonly postStore = new Map<string, SimulatedPost>();
  private readonly containerStore = new Map<string, SimulatedContainer>();
  private readonly flakyCounters = new Map<string, number>();
  private readonly idempotencyIndex = new Map<string, string>();
  private sequence = 0;

  constructor(options: BaseSimulatorOptions = {}) {
    this.defaultMode = options.defaultMode ?? 'happy';
    this.flakyFailures = options.flakyFailures ?? 1;
    this.now = options.now ?? '2026-08-04T12:00:00.000Z';
  }

  get baseUrl(): string {
    return `https://${this.host}`;
  }

  get requests(): readonly SimulatedRequest[] {
    return this.requestLog;
  }

  get posts(): readonly SimulatedPost[] {
    return [...this.postStore.values()];
  }

  get containers(): readonly SimulatedContainer[] {
    return [...this.containerStore.values()];
  }

  get currentMode(): SimulatorMode {
    return this.defaultMode;
  }

  setDefaultMode(mode: SimulatorMode): void {
    this.defaultMode = mode;
  }

  reset(): void {
    this.requestLog.length = 0;
    this.postStore.clear();
    this.containerStore.clear();
    this.flakyCounters.clear();
    this.idempotencyIndex.clear();
    this.sequence = 0;
    this.defaultMode = 'happy';
  }

  // ------------------------------------------------------------- subclass API

  /** The provider's own error envelope for a failure kind. */
  protected abstract errorFor(kind: FailureKind, request: SimulatedRequest): SimulatedResponse;

  /** The happy path, plus any provider specific mode handling. */
  protected abstract route(request: SimulatedRequest): Promise<SimulatedResponse>;

  /** Endpoints that do not require an authorization header. */
  protected isPublicPath(_path: string): boolean {
    return false;
  }

  /** Write endpoints, which is where content and duplicate errors apply. */
  protected abstract isWritePath(path: string, method: string): boolean;

  // ------------------------------------------------------------------ helpers

  protected nextId(kind: string): string {
    this.sequence += 1;
    return fakeExternalId(this.provider, `${kind}-${this.sequence}`);
  }

  protected recordPost(input: {
    accountId: string;
    text: string;
    mediaIds?: readonly string[];
    parentId?: string | null;
    idempotencyKey?: string | null;
    id?: string;
  }): SimulatedPost {
    const key = input.idempotencyKey ?? null;
    if (key !== null) {
      const existingId = this.idempotencyIndex.get(key);
      const existing = existingId === undefined ? undefined : this.postStore.get(existingId);
      if (existing !== undefined) {
        return existing;
      }
    }
    const post: SimulatedPost = {
      id: input.id ?? this.nextId('post'),
      provider: this.provider,
      accountId: input.accountId,
      text: input.text,
      mediaIds: [...(input.mediaIds ?? [])],
      parentId: input.parentId ?? null,
      createdAt: this.now,
      idempotencyKey: key,
    };
    this.postStore.set(post.id, post);
    if (key !== null) {
      this.idempotencyIndex.set(key, post.id);
    }
    return post;
  }

  protected getPost(id: string): SimulatedPost | undefined {
    return this.postStore.get(id);
  }

  protected createContainer(input: {
    accountId: string;
    mode: SimulatorMode;
    id?: string;
  }): SimulatedContainer {
    const container: SimulatedContainer = {
      id: input.id ?? this.nextId('container'),
      provider: this.provider,
      accountId: input.accountId,
      state:
        input.mode === 'stuck_container' || input.mode === 'slow_media'
          ? 'in_progress'
          : 'finished',
      pollsRemaining:
        input.mode === 'stuck_container'
          ? Number.POSITIVE_INFINITY
          : input.mode === 'slow_media'
            ? SLOW_MEDIA_POLLS
            : 0,
      errorReason: null,
      createdAt: this.now,
      externalPostId: null,
    };
    this.containerStore.set(container.id, container);
    return container;
  }

  protected getContainer(id: string): SimulatedContainer | undefined {
    return this.containerStore.get(id);
  }

  /**
   * Advance a container by one poll. A stuck container never finishes, which is
   * what the give-up path needs in order to be tested at all.
   */
  protected pollContainer(id: string): SimulatedContainer | undefined {
    const container = this.containerStore.get(id);
    if (container === undefined) {
      return undefined;
    }
    if (container.state !== 'in_progress') {
      return container;
    }
    if (container.pollsRemaining === Number.POSITIVE_INFINITY) {
      return container;
    }
    container.pollsRemaining -= 1;
    if (container.pollsRemaining <= 0) {
      container.state = 'finished';
    }
    return container;
  }

  /** Deferred external ids: the create is accepted, the id arrives later. */
  protected deferExternalId(container: SimulatedContainer): void {
    container.state = 'in_progress';
    container.pollsRemaining = DEFERRED_ID_POLLS;
  }

  protected bearerToken(request: SimulatedRequest): string | null {
    const header = request.headers.authorization ?? request.headers.Authorization;
    if (header === undefined || !header.toLowerCase().startsWith('bearer ')) {
      return null;
    }
    return header.slice('bearer '.length);
  }

  /** The token-shaped string a `token_echo` error body carries. */
  protected get echoedToken(): string {
    return FAKE_BEARER_TOKEN;
  }

  protected json(
    status: number,
    body: unknown,
    headers: Record<string, string> = {},
  ): SimulatedResponse {
    return { status, headers: { 'content-type': 'application/json', ...headers }, body };
  }

  // ----------------------------------------------------------------- dispatch

  async handle(request: SimulatedRequest): Promise<SimulatedResponse> {
    this.requestLog.push(request);
    const mode = request.mode;

    if (!this.isPublicPath(request.path) && this.bearerToken(request) === null) {
      return this.errorFor('unauthorized', request);
    }

    const shortCircuit = SHORT_CIRCUIT_MODES[mode];
    if (shortCircuit !== undefined) {
      return this.errorFor(shortCircuit, request);
    }

    const isWrite = this.isWritePath(request.path, request.method);

    if (mode === 'content_invalid' && isWrite) {
      return this.errorFor('content_invalid', request);
    }
    if (mode === 'duplicate' && isWrite) {
      return this.errorFor('duplicate', request);
    }
    if (mode === 'malformed') {
      return this.json(200, { unexpected: 'shape', note: 'not the documented body' });
    }

    if (mode === 'flaky') {
      const key = `${request.method} ${request.path}`;
      const failures = this.flakyCounters.get(key) ?? 0;
      if (failures < this.flakyFailures) {
        this.flakyCounters.set(key, failures + 1);
        return this.errorFor('server_error', request);
      }
    }

    const response = await this.route(request);

    if (mode === 'lost_response' && isWrite) {
      // The provider recorded the write. The client will never hear about it.
      throw new SimulatedNetworkError(this.provider);
    }
    if (mode === 'slow_accept' && isWrite) {
      return { ...response, delayMs: SLOW_ACCEPT_DELAY_MS };
    }
    return response;
  }
}
