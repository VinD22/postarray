import type { RealtimeEvent } from '@relay/contracts';
import type { Logger } from '@relay/observability';
import { realtimeChannel, workspaceFromRealtimeChannel } from '@relay/runtime';

/**
 * The fan-out.
 *
 * One Redis subscription per workspace that currently has at least one open
 * client, however many tabs that is, and none for a workspace with none. The
 * refcount is the whole point: a product where every replica subscribes to
 * every workspace forever is a product whose Redis traffic grows with the
 * customer list rather than with the people actually looking at a screen.
 *
 * The subscriber connection is separate from the key value store's on purpose.
 * ioredis puts a connection into subscriber mode and refuses ordinary commands
 * on it afterwards, so sharing one would break rate limiting and idempotency
 * the first time somebody opened a tab.
 *
 * Tenancy is enforced twice here, and both times deliberately. Sinks are held
 * in a map keyed by workspace, so a sink can only ever be reached through its
 * own workspace's bucket; and every event read back is checked against that
 * workspace before it is written. The second check is redundant against a
 * correct Redis, which is exactly why it is there.
 */

/** Where one connected client's events go. */
export interface RealtimeSink {
  send(event: RealtimeEvent): void;
}

/**
 * The subscriber operations this hub uses.
 *
 * Structural, so `ioredis` is a composition-root concern and every test here
 * runs against a fake rather than a socket.
 */
export interface RealtimeSubscriberClient {
  subscribe(channel: string): Promise<unknown>;
  unsubscribe(channel: string): Promise<unknown>;
  on(event: 'message', listener: (channel: string, message: string) => void): unknown;
}

export interface RealtimeHubOptions {
  readonly subscriber: RealtimeSubscriberClient;
  /** Only the single-entry read. The hub never replays; the controller does. */
  readonly reader: { readAt(workspaceId: string, id: string): Promise<RealtimeEvent | null> };
  readonly logger: Logger;
}

interface WorkspaceRoom {
  readonly sinks: Set<RealtimeSink>;
  /** Resolves once `SUBSCRIBE` has been acknowledged for this workspace. */
  readonly subscribed: Promise<void>;
}

export class RealtimeHub {
  readonly #options: RealtimeHubOptions;
  readonly #rooms = new Map<string, WorkspaceRoom>();

  constructor(options: RealtimeHubOptions) {
    this.#options = options;
    options.subscriber.on('message', (channel, message) => {
      void this.#deliver(channel, message);
    });
  }

  /**
   * Attach a client, and hand back the one way to detach it.
   *
   * Returning the release function rather than exposing a `remove` keeps the
   * caller from having to hold both the workspace and the sink to clean up,
   * which is how a leaked subscription happens.
   */
  async add(workspaceId: string, sink: RealtimeSink): Promise<() => void> {
    const existing = this.#rooms.get(workspaceId);
    if (existing !== undefined) {
      existing.sinks.add(sink);
      await existing.subscribed;
      return () => {
        this.#release(workspaceId, sink);
      };
    }

    const room: WorkspaceRoom = {
      sinks: new Set([sink]),
      subscribed: this.#options.subscriber.subscribe(realtimeChannel(workspaceId)).then(
        () => undefined,
        (error: unknown) => {
          // The connection stays open and still heartbeats. It simply carries
          // no live updates, and the client's polling fallback covers it.
          this.#options.logger.warn(
            { workspaceId, error: String(error) },
            'realtime.subscribe_failed',
          );
        },
      ),
    };
    this.#rooms.set(workspaceId, room);
    await room.subscribed;
    return () => {
      this.#release(workspaceId, sink);
    };
  }

  /** Open client count for a workspace on this replica. */
  size(workspaceId: string): number {
    return this.#rooms.get(workspaceId)?.sinks.size ?? 0;
  }

  #release(workspaceId: string, sink: RealtimeSink): void {
    const room = this.#rooms.get(workspaceId);
    if (room === undefined) {
      return;
    }
    room.sinks.delete(sink);
    if (room.sinks.size > 0) {
      return;
    }
    this.#rooms.delete(workspaceId);
    void this.#options.subscriber.unsubscribe(realtimeChannel(workspaceId)).catch(
      (error: unknown) => {
        this.#options.logger.warn(
          { workspaceId, error: String(error) },
          'realtime.unsubscribe_failed',
        );
      },
    );
  }

  async #deliver(channel: string, eventId: string): Promise<void> {
    const workspaceId = workspaceFromRealtimeChannel(channel);
    if (workspaceId === null) {
      return;
    }
    const room = this.#rooms.get(workspaceId);
    if (room === undefined || room.sinks.size === 0) {
      return;
    }

    let event: RealtimeEvent | null;
    try {
      event = await this.#options.reader.readAt(workspaceId, eventId);
    } catch (error: unknown) {
      this.#options.logger.warn(
        { workspaceId, eventId, error: String(error) },
        'realtime.read_failed',
      );
      return;
    }
    // The reader already scoped the read to this workspace's key. Checking the
    // payload as well is what makes a mis-keyed write a dropped event rather
    // than a cross-tenant one.
    if (event === null || event.workspaceId !== workspaceId) {
      return;
    }

    for (const sink of room.sinks) {
      try {
        sink.send(event);
      } catch (error: unknown) {
        // One client whose socket is already gone must not stop the others.
        this.#options.logger.warn(
          { workspaceId, eventId, error: String(error) },
          'realtime.sink_failed',
        );
      }
    }
  }
}
