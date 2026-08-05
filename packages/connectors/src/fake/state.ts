import type { AccountType } from '@relay/contracts';

import { type Clock, instantOf, systemClock } from '../ports';

/**
 * The fake provider's world.
 *
 * Everything is in memory and deterministic: the same seed and the same calls
 * always produce the same identifiers, the same latencies and the same metric
 * values. That is what lets a duplicate publication test assert an exact
 * outcome rather than "probably fine".
 */

export const FAKE_FAILURE_MODES = [
  'none',
  'rate_limit',
  'expired_token',
  'permission_revoked',
  'content_rejected',
  'transient_5xx',
  'slow_media',
  'container_stuck',
  'duplicate_detected',
  'partial_thread_failure',
  'malformed_response',
  'capability_downgrade',
  'timeout_after_accept',
] as const;
export type FakeFailureMode = (typeof FAKE_FAILURE_MODES)[number];

export interface FakeAccount {
  readonly externalAccountId: string;
  readonly accountType: AccountType;
  readonly displayName: string;
  readonly handle: string;
  readonly avatarUrl: string;
  readonly profileUrl: string;
  readonly parentExternalId: string | null;
  readonly eligible: boolean;
  readonly ineligibleReasonKey: string | null;
  readonly followers: number;
}

export interface FakeDestination {
  readonly externalId: string;
  readonly kind: 'community' | 'none';
  readonly displayLabel: string;
  readonly canPost: boolean;
}

export interface FakeMention {
  readonly externalId: string;
  readonly displayLabel: string;
  readonly handle: string;
  readonly kind: 'person' | 'organization' | 'page' | 'community';
}

export interface FakePost {
  readonly externalPostId: string;
  readonly connectionId: string;
  readonly fingerprint: string;
  readonly body: string;
  readonly permalink: string;
  readonly createdAt: string;
  readonly kind: 'root' | 'comment' | 'thread';
  readonly order: number;
  readonly threadItemId: string | null;
  readonly parentPostId: string | null;
  deleted: boolean;
}

export interface FakeContainer {
  readonly providerJobId: string;
  readonly connectionId: string;
  readonly fingerprint: string;
  readonly outcome: 'published' | 'failed' | 'stuck';
  remainingPolls: number;
  readonly publishedPostIds: readonly string[];
  readonly createdAt: string;
}

export interface FakeUpload {
  readonly key: string;
  readonly providerMediaId: string;
  readonly checksum: string;
  readonly byteSize: number;
  remainingProcessingPolls: number;
}

/** Deterministic 32 bit PRNG. Same seed, same sequence, every run. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface FakeProviderStateOptions {
  readonly seed?: number;
  readonly clock?: Clock;
  readonly accounts?: readonly FakeAccount[];
  readonly destinations?: readonly FakeDestination[];
  readonly mentions?: readonly FakeMention[];
  /** How many `getStatus` calls a container needs before it resolves. */
  readonly containerPolls?: number;
  /** Base latency per operation, before deterministic jitter. */
  readonly baseLatencyMs?: number;
}

export const DEFAULT_FAKE_ACCOUNTS: readonly FakeAccount[] = Object.freeze([
  {
    externalAccountId: 'fake-acct-profile-1',
    accountType: 'personal_profile',
    displayName: 'Relay Demo Profile',
    handle: 'relaydemo',
    avatarUrl: 'https://example.invalid/avatar/profile.png',
    profileUrl: 'https://example.invalid/relaydemo',
    parentExternalId: null,
    eligible: true,
    ineligibleReasonKey: null,
    followers: 4821,
  },
  {
    externalAccountId: 'fake-acct-page-1',
    accountType: 'page',
    displayName: 'Relay Demo Page',
    handle: 'relaydemopage',
    avatarUrl: 'https://example.invalid/avatar/page.png',
    profileUrl: 'https://example.invalid/relaydemopage',
    parentExternalId: null,
    eligible: true,
    ineligibleReasonKey: null,
    followers: 19204,
  },
  {
    externalAccountId: 'fake-acct-consumer-1',
    accountType: 'personal_profile',
    displayName: 'Relay Demo Consumer Account',
    handle: 'relaydemoconsumer',
    avatarUrl: 'https://example.invalid/avatar/consumer.png',
    profileUrl: 'https://example.invalid/relaydemoconsumer',
    parentExternalId: null,
    // Exercises the "we found it but you cannot publish to it" path.
    eligible: false,
    ineligibleReasonKey: 'error.connection_account_type_invalid.message',
    followers: 12,
  },
]);

export const DEFAULT_FAKE_DESTINATIONS: readonly FakeDestination[] = Object.freeze([
  {
    externalId: 'fake-comm-builders',
    kind: 'community',
    displayLabel: 'Builders Community',
    canPost: true,
  },
  {
    externalId: 'fake-comm-readonly',
    kind: 'community',
    displayLabel: 'Announcements Community',
    canPost: false,
  },
]);

export const DEFAULT_FAKE_MENTIONS: readonly FakeMention[] = Object.freeze([
  {
    externalId: 'fake-mention-ada',
    displayLabel: 'Ada Lovelace',
    handle: 'ada',
    kind: 'person',
  },
  {
    externalId: 'fake-mention-relay',
    displayLabel: 'Relay',
    handle: 'relay',
    kind: 'organization',
  },
  {
    externalId: 'fake-mention-builders',
    displayLabel: 'Builders Community',
    handle: 'builders',
    kind: 'community',
  },
]);

export class FakeProviderState {
  readonly accounts: readonly FakeAccount[];
  readonly destinations: readonly FakeDestination[];
  readonly mentions: readonly FakeMention[];
  readonly containerPolls: number;
  readonly baseLatencyMs: number;

  failureMode: FakeFailureMode = 'none';
  /** Applies the failure mode to the next N calls, then clears it. */
  failureRemaining = Number.POSITIVE_INFINITY;

  readonly posts = new Map<string, FakePost>();
  readonly containers = new Map<string, FakeContainer>();
  readonly uploads = new Map<string, FakeUpload>();
  readonly revokedConnections = new Set<string>();

  #clock: Clock;
  #random: () => number;
  #counter = 0;
  readonly #seed: number;

  constructor(options: FakeProviderStateOptions = {}) {
    this.#seed = options.seed ?? 20260804;
    this.#clock = options.clock ?? systemClock;
    this.#random = mulberry32(this.#seed);
    this.accounts = options.accounts ?? DEFAULT_FAKE_ACCOUNTS;
    this.destinations = options.destinations ?? DEFAULT_FAKE_DESTINATIONS;
    this.mentions = options.mentions ?? DEFAULT_FAKE_MENTIONS;
    this.containerPolls = options.containerPolls ?? 2;
    this.baseLatencyMs = options.baseLatencyMs ?? 40;
  }

  get clock(): Clock {
    return this.#clock;
  }

  setClock(clock: Clock): void {
    this.#clock = clock;
  }

  random(): number {
    return this.#random();
  }

  /** Monotonic, seed-derived identifier. Stable across runs. */
  nextId(prefix: string): string {
    this.#counter += 1;
    const suffix = (this.#seed + this.#counter * 2654435761) >>> 0;
    return `${prefix}_${suffix.toString(36).padStart(7, '0')}${this.#counter.toString(36)}`;
  }

  /** Deterministic latency, so a slow path is slow every time. */
  latencyMs(multiplier = 1): number {
    return Math.round(this.baseLatencyMs * multiplier * (0.75 + this.random() * 0.5));
  }

  now(): string {
    return instantOf(this.#clock.now().getTime());
  }

  setFailureMode(mode: FakeFailureMode, forCalls = Number.POSITIVE_INFINITY): void {
    this.failureMode = mode;
    this.failureRemaining = forCalls;
  }

  /** Read the active failure mode and consume one use of a bounded mode. */
  takeFailureMode(): FakeFailureMode {
    if (this.failureMode === 'none') {
      return 'none';
    }
    if (this.failureRemaining <= 0) {
      this.failureMode = 'none';
      this.failureRemaining = Number.POSITIVE_INFINITY;
      return 'none';
    }
    if (Number.isFinite(this.failureRemaining)) {
      this.failureRemaining -= 1;
    }
    return this.failureMode;
  }

  /** Peek without consuming. Used where the mode changes shape, not outcome. */
  peekFailureMode(): FakeFailureMode {
    return this.failureRemaining <= 0 ? 'none' : this.failureMode;
  }

  accountFor(externalAccountId: string): FakeAccount | undefined {
    return this.accounts.find((account) => account.externalAccountId === externalAccountId);
  }

  addPost(post: Omit<FakePost, 'deleted'>): FakePost {
    const stored: FakePost = { ...post, deleted: false };
    this.posts.set(stored.externalPostId, stored);
    return stored;
  }

  getPost(externalPostId: string): FakePost | undefined {
    return this.posts.get(externalPostId);
  }

  postsFor(connectionId: string): readonly FakePost[] {
    return [...this.posts.values()].filter((post) => post.connectionId === connectionId);
  }

  /**
   * The duplicate lookup: find a root post this connection already created for
   * this exact content, inside the dispatch window. This is what makes a retry
   * after a timeout safe.
   */
  findRootByFingerprint(input: {
    connectionId: string;
    fingerprint: string;
    windowFrom: string;
    windowTo: string;
  }): FakePost | undefined {
    return [...this.posts.values()].find(
      (post) =>
        post.connectionId === input.connectionId &&
        post.fingerprint === input.fingerprint &&
        post.kind === 'root' &&
        !post.deleted &&
        post.createdAt >= input.windowFrom &&
        post.createdAt <= input.windowTo,
    );
  }

  uploadKey(input: { mediaId: string; connectionId: string; postVariantId: string }): string {
    return `${input.connectionId}:${input.postVariantId}:${input.mediaId}`;
  }

  reset(): void {
    this.posts.clear();
    this.containers.clear();
    this.uploads.clear();
    this.revokedConnections.clear();
    this.failureMode = 'none';
    this.failureRemaining = Number.POSITIVE_INFINITY;
    this.#counter = 0;
    this.#random = mulberry32(this.#seed);
  }
}
