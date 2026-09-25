import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { realtimeEventIdSchema, type RealtimeEvent } from '@relay/contracts';
import type { Request, Response } from 'express';

import type { ActorContext } from '../../application/port';
import { Actor, RateLimit, RequireScope } from '../../common/decorators';
import { parseQuery } from '../../common/zod';
import { EventsService, matchesFilter } from './events.service';
import { eventStreamQuerySchema, recentEventsQuerySchema } from './events.schemas';
import {
  HEARTBEAT_INTERVAL_MS,
  MAX_STREAM_LIFETIME_MS,
  openEventStream,
  writeEvent,
  writeHeartbeat,
} from './sse-stream';

/**
 * Live status, over one long-lived GET.
 *
 * Server-sent events rather than a WebSocket because the traffic is entirely
 * one way. The browser already holds a session cookie, a GET carries no CSRF
 * question, no new port has to be opened on the box, and Express streams it
 * without a Nest platform adapter. A socket would buy bidirectional traffic
 * this product has no use for, and cost a second authentication path.
 *
 * The stream is not a read API. It says an id changed state; it never says
 * what the post says, who wrote it or what the provider replied. A client
 * refetches through the ordinary authorized endpoint, which is what keeps
 * every read audited and scoped in exactly one place.
 */
@Controller('v1/events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  /**
   * Open the stream.
   *
   * `accounts:read` is the scope every session already holds, and the same
   * `x-relay-workspace-id` header pins the tenant here as everywhere else, so
   * a stream can never be opened against a workspace an ordinary read could
   * not reach.
   *
   * A modest per-route rate limit, because the expensive thing about this
   * endpoint is a client that reconnects in a tight loop, not a client that
   * stays connected.
   */
  @Get()
  @RequireScope('accounts:read')
  @RateLimit({ limit: 60, windowSeconds: 60 })
  async stream(
    @Actor() actor: ActorContext,
    @Req() request: Request,
    @Res() response: Response,
    @Query() query: unknown,
  ): Promise<void> {
    const { since, type } = parseQuery(eventStreamQuerySchema, query);

    // Buffer until the client is attached. Between the replay read and the
    // subscription there is a window where a live event would otherwise be
    // written before the events it comes after, and an out-of-order id breaks
    // the resume contract for every later reconnect.
    let pending: RealtimeEvent[] | null = [];
    const emit = (event: RealtimeEvent): void => {
      if (!matchesFilter(event, type)) {
        return;
      }
      if (pending !== null) {
        pending.push(event);
        return;
      }
      writeEvent(response, event);
    };

    // Admission first. Once a byte is written the response is committed and a
    // refusal could no longer be rendered as problem+json.
    const lease = await this.events.openStream(actor, { send: emit });

    let closed = false;
    const heartbeat = setInterval(() => {
      writeHeartbeat(response);
    }, HEARTBEAT_INTERVAL_MS);
    const lifetime = setTimeout(() => {
      close();
    }, MAX_STREAM_LIFETIME_MS);

    function close(): void {
      if (closed) {
        return;
      }
      closed = true;
      clearInterval(heartbeat);
      clearTimeout(lifetime);
      void lease.release().finally(() => {
        response.end();
      });
    }

    request.on('close', close);
    response.on('error', close);

    try {
      openEventStream(response);
      for (const event of await this.events.replay(actor, {
        since: readLastEventId(request) ?? since ?? null,
      })) {
        if (matchesFilter(event, type)) {
          writeEvent(response, event);
        }
      }
      for (const event of pending) {
        writeEvent(response, event);
      }
      pending = null;
    } catch (error: unknown) {
      close();
      throw error;
    }
  }

  /**
   * The same events as a plain JSON page.
   *
   * An MCP tool cannot hold a stream open for the length of a conversation, and
   * a CLI script that wants "what happened since" should not have to speak SSE
   * to find out. Same stream, same tenancy, same scope, different shape.
   */
  @Get('recent')
  @RequireScope('accounts:read')
  async recent(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<{ readonly events: readonly RealtimeEvent[]; readonly lastEventId: string | null }> {
    const { since, type, limit } = parseQuery(recentEventsQuerySchema, query);
    const page = await this.events.replay(actor, { since: since ?? null, limit });
    const events = page.filter((event) => matchesFilter(event, type));
    return { events, lastEventId: page[page.length - 1]?.id ?? null };
  }
}

/**
 * The id a browser resumes from.
 *
 * `EventSource` sets `Last-Event-ID` by itself on a reconnect, so honouring it
 * is what makes a dropped connection lose nothing without the page having to
 * remember anything. It is a header a client fully controls, so it is parsed
 * with the same schema as the query parameter and a value that is not a stream
 * entry id is ignored rather than passed to the reader.
 */
function readLastEventId(request: Request): string | undefined {
  const header = request.headers['last-event-id'];
  if (typeof header !== 'string') {
    return undefined;
  }
  const parsed = realtimeEventIdSchema.safeParse(header.trim());
  return parsed.success ? parsed.data : undefined;
}
