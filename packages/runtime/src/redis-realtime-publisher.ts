import {
  realtimeEventSchema,
  toRealtimeEvents,
  type DomainEventEnvelope,
  type RealtimeEvent,
  type RealtimeEventInput,
} from '@relay/contracts';
import type { RealtimePublisherPort } from '@relay/application';
import type { Logger } from '@relay/observability';

/**
 * The realtime transport: one Redis stream per workspace, plus a pub/sub
 * channel that says an entry was appended.
 *
 * The stream is what makes a reconnect resume instead of restart. A browser
 * tab that loses its connection for eight seconds comes back with the id of
 * the last event it saw and reads the gap out of the stream, which a bare
 * pub/sub channel could never give it because nothing there is retained. The
 * channel exists only as the wake-up: it carries an id, and the subscriber
 * reads the payload from the stream, so exactly one representation of an event
 * exists and a subscriber can never be handed one the stream does not have.
 *
 * Everything here is best effort by construction. Losing a live update costs a
 * refresh; the durable record of what happened is in PostgreSQL and reached
 * the outbox long before this file ran.
 */

/** Entries kept per workspace. Roughly a day of a busy workspace's traffic. */
export const REALTIME_STREAM_MAX_LEN = 1000;

/** Refreshed on every write, so a quiet workspace's stream is reclaimed. */
export const REALTIME_STREAM_TTL_SECONDS = 24 * 60 * 60;

/** The most a single replay is allowed to return, however far behind a client is. */
export const REALTIME_REPLAY_LIMIT = 500;

/**
 * The workspace's stream key.
 *
 * The braces are a Redis Cluster hash tag, so a workspace's stream and its
 * channel always land on the same slot. They are also the reason this function
 * exists rather than being inlined at four call sites: the workspace id is the
 * whole tenancy boundary of this transport, and one place to build it is one
 * place to test that an id can never widen it.
 */
export function realtimeStreamKey(workspaceId: string): string {
  return `events:{${workspaceId}}`;
}

/** The wake-up channel for the same workspace. Same key, by construction. */
export function realtimeChannel(workspaceId: string): string {
  return realtimeStreamKey(workspaceId);
}

/**
 * Recover the workspace from a channel name.
 *
 * The subscriber gets a channel string back from ioredis and has to know whose
 * event it is. Returning null for anything that does not match, rather than
 * guessing, is what stops a stray channel from being attributed to a tenant.
 */
export function workspaceFromRealtimeChannel(channel: string): string | null {
  const match = /^events:\{(.+)\}$/.exec(channel);
  return match?.[1] ?? null;
}

/**
 * The Redis operations this file uses.
 *
 * Declared structurally so `ioredis` stays out of the dependency graph here,
 * exactly as `RedisLikeClient` does for the key value store. The process that
 * owns the connection passes its client in.
 */
export interface RealtimeRedisClient {
  xadd(
    key: string,
    ...args: readonly (string | number)[]
  ): Promise<string | null>;
  xrange(
    key: string,
    start: string,
    end: string,
    ...args: readonly (string | number)[]
  ): Promise<[string, string[]][]>;
  publish(channel: string, message: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
}

export interface RedisRealtimePublisherOptions {
  readonly client: RealtimeRedisClient;
  readonly logger: Logger;
  readonly maxLen?: number;
  readonly ttlSeconds?: number;
}

/** The field name the payload is stored under inside a stream entry. */
const PAYLOAD_FIELD = 'event';

/**
 * Append one event and announce it.
 *
 * `XADD` first, `PUBLISH` second, always. A subscriber woken by the channel
 * immediately reads the entry back, so publishing first would race with a
 * reader that finds nothing there yet and drops the event.
 */
async function append(
  options: RedisRealtimePublisherOptions,
  event: RealtimeEventInput,
): Promise<void> {
  const key = realtimeStreamKey(event.workspaceId);
  const id = await options.client.xadd(
    key,
    'MAXLEN',
    '~',
    options.maxLen ?? REALTIME_STREAM_MAX_LEN,
    '*',
    PAYLOAD_FIELD,
    JSON.stringify(event),
  );
  if (id === null) {
    return;
  }
  await options.client.expire(key, options.ttlSeconds ?? REALTIME_STREAM_TTL_SECONDS);
  await options.client.publish(realtimeChannel(event.workspaceId), id);
}

export function createRedisRealtimePublisher(
  options: RedisRealtimePublisherOptions,
): RealtimePublisherPort {
  async function publishAll(events: readonly RealtimeEventInput[]): Promise<void> {
    for (const event of events) {
      await append(options, event);
    }
  }

  function swallow(context: Readonly<Record<string, unknown>>) {
    return (error: unknown): void => {
      // A dropped live update costs a refresh. Rethrowing would fail an outbox
      // row that has already reached the customer's webhook endpoint, and
      // redelivering that to fix a Redis hiccup is the worse trade.
      options.logger.warn({ ...context, error: String(error) }, 'realtime.publish_failed');
    };
  }

  return {
    async publish(envelope: DomainEventEnvelope): Promise<void> {
      await publishAll(toRealtimeEvents(envelope)).catch(
        swallow({ outboxEventId: envelope.id, type: envelope.type }),
      );
    },

    async publishStatus(event: RealtimeEventInput): Promise<void> {
      await publishAll([event]).catch(swallow({ type: event.type }));
    },
  };
}

export interface RealtimeReplayInput {
  /** Exclusive. The last id the client already has, or null for the tail. */
  readonly since: string | null;
  readonly limit?: number;
}

export interface RealtimeEventReader {
  /**
   * Events after `since`, oldest first, for this workspace only.
   *
   * Every entry is parsed and then checked against the workspace that was
   * asked for. The key already scopes the read, so the second check is
   * redundant against a correct Redis; it is there because "redundant against
   * a correct store" is exactly the assumption a tenancy bug is made of.
   */
  readRecent(workspaceId: string, input: RealtimeReplayInput): Promise<readonly RealtimeEvent[]>;
}

export function createRedisRealtimeEventReader(client: RealtimeRedisClient): RealtimeEventReader {
  return {
    async readRecent(workspaceId, input) {
      const limit = Math.min(Math.max(1, input.limit ?? REALTIME_REPLAY_LIMIT), REALTIME_REPLAY_LIMIT);
      // `(` is the exclusive range prefix, so a client is never re-sent the
      // event it told us it already has.
      const start = input.since === null ? '-' : `(${input.since}`;
      const entries = await client.xrange(
        realtimeStreamKey(workspaceId),
        start,
        '+',
        'COUNT',
        limit,
      );
      return entries.flatMap((entry) => {
        const parsed = parseEntry(entry);
        return parsed !== null && parsed.workspaceId === workspaceId ? [parsed] : [];
      });
    },
  };
}

/**
 * Turn one raw stream entry into an event, or nothing.
 *
 * A field list we did not write, a body that is not JSON and a payload that
 * fails the schema all mean the same thing to a client: there is nothing here
 * it can act on. Dropping is the only safe answer, because the alternative is
 * forwarding an unvalidated blob to a browser.
 */
export function parseEntry(entry: readonly [string, readonly string[]]): RealtimeEvent | null {
  const [id, fields] = entry;
  const index = fields.indexOf(PAYLOAD_FIELD);
  const raw = index === -1 ? undefined : fields[index + 1];
  if (raw === undefined) {
    return null;
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof body !== 'object' || body === null) {
    return null;
  }
  const parsed = realtimeEventSchema.safeParse({ ...body, id });
  return parsed.success ? parsed.data : null;
}
