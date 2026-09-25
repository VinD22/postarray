import { Inject, Injectable } from '@nestjs/common';
import { RateLimitedError, type RealtimeEvent, type RealtimeEventType } from '@relay/contracts';

import type { ActorContext, KeyValueStore } from '../../application/port';
import { KEY_VALUE_STORE } from '../../application/tokens';
import { REALTIME_EVENT_READER, REALTIME_HUB } from './events.tokens';
import type { RealtimeHub, RealtimeSink } from './realtime-hub';
import type { RealtimeEventReaderLike } from './events.tokens';

/**
 * Admission and replay.
 *
 * Two questions the controller should not answer inline: may this connection
 * open at all, and what did this client miss. Both are policy, both need the
 * key value store, and neither has anything to do with writing bytes.
 */

/**
 * Concurrent streams per workspace and per person.
 *
 * A stream costs a socket and a slot in the fan-out for as long as it is open,
 * so an unbounded count is one runaway client away from taking the API down
 * for everybody in the workspace. Ten is more browser tabs than anyone has
 * open on one product; fifty is a large team all watching at once.
 */
export const MAX_STREAMS_PER_WORKSPACE = 50;
export const MAX_STREAMS_PER_USER = 10;

/**
 * Counters expire a little after the longest a stream can live.
 *
 * The TTL is set when a counter is created and never extended, so a replica
 * that died holding connections leaks its counts for at most this long instead
 * of locking a workspace out of live updates permanently. Undercounting for a
 * few minutes after an hour of continuous use is the right way to be wrong
 * here.
 */
const COUNTER_TTL_SECONDS = 70 * 60;

export interface StreamLease {
  /** Detaches the client and returns both counters. Safe to call twice. */
  release(): Promise<void>;
}

@Injectable()
export class EventsService {
  constructor(
    @Inject(KEY_VALUE_STORE) private readonly kv: KeyValueStore,
    @Inject(REALTIME_HUB) private readonly hub: RealtimeHub,
    @Inject(REALTIME_EVENT_READER) private readonly reader: RealtimeEventReaderLike,
  ) {}

  /**
   * Take a slot for one connection, or refuse it.
   *
   * Both counters are incremented before either is checked so the accounting
   * is symmetric with the release path. A refusal gives the slot straight back
   * rather than leaving the caller a slot it never got to use.
   */
  async openStream(actor: ActorContext, sink: RealtimeSink): Promise<StreamLease> {
    const workspaceKey = `relay:sse:ws:${actor.workspaceId}`;
    const userKey = `relay:sse:actor:${actor.workspaceId}:${actor.actorId}`;

    const inWorkspace = await this.kv.increment(workspaceKey, { ttlSeconds: COUNTER_TTL_SECONDS });
    const forActor = await this.kv.increment(userKey, { ttlSeconds: COUNTER_TTL_SECONDS });

    if (inWorkspace > MAX_STREAMS_PER_WORKSPACE || forActor > MAX_STREAMS_PER_USER) {
      await this.#decrement(workspaceKey, userKey);
      throw new RateLimitedError({
        details: {
          scope: inWorkspace > MAX_STREAMS_PER_WORKSPACE ? 'workspace_streams' : 'actor_streams',
        },
      });
    }

    const detach = await this.hub.add(actor.workspaceId, sink);
    let released = false;
    return {
      release: async () => {
        if (released) {
          return;
        }
        released = true;
        detach();
        await this.#decrement(workspaceKey, userKey);
      },
    };
  }

  /**
   * What this client missed, for its workspace only.
   *
   * `since` is exclusive, so a client that reconnects with the last id it saw
   * gets the gap and not a duplicate of the event it already rendered.
   */
  async replay(
    actor: ActorContext,
    input: { readonly since: string | null; readonly limit?: number },
  ): Promise<readonly RealtimeEvent[]> {
    return this.reader.readRecent(actor.workspaceId, {
      since: input.since,
      ...(input.limit === undefined ? {} : { limit: input.limit }),
    });
  }

  async #decrement(workspaceKey: string, userKey: string): Promise<void> {
    await this.kv.incrementBy(workspaceKey, -1);
    await this.kv.incrementBy(userKey, -1);
  }
}

/** Keep only the types a client asked for, or everything when it asked for none. */
export function matchesFilter(
  event: RealtimeEvent,
  types: readonly RealtimeEventType[] | undefined,
): boolean {
  return types === undefined || types.includes(event.type);
}
