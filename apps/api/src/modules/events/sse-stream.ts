import type { RealtimeEvent } from '@relay/contracts';
import type { Response } from 'express';

/**
 * The server-sent events wire format, in one place.
 *
 * SSE is four line prefixes and a blank line, and getting one of them wrong
 * fails in ways that look like a network problem rather than a bug. Writing
 * them here once means the controller is about policy and lifetime, and the
 * frame shape is a thing with tests.
 */

/** How long a client waits before reconnecting, in milliseconds. */
export const RETRY_HINT_MS = 5_000;

/**
 * A comment frame every 25 seconds.
 *
 * Under a minute, because most proxies and load balancers idle a connection
 * out at 60 and a stream that stays silent between two posts looks exactly
 * like a stream that died.
 */
export const HEARTBEAT_INTERVAL_MS = 25_000;

/**
 * The stream closes itself just under an hour.
 *
 * A session is refreshed on an ordinary request, and a connection held open
 * for days is a connection whose credential stopped being checked days ago.
 * Closing means the client reconnects, which re-runs every guard.
 */
export const MAX_STREAM_LIFETIME_MS = 55 * 60 * 1000;

/**
 * Prepare a response to stream.
 *
 * `no-transform` is not decoration: `compression()` is mounted globally in
 * `bootstrap.ts` and honours that directive, and a compressed event stream
 * buffers until the compressor's window fills, which for a few hundred bytes
 * of JSON means never. `x-accel-buffering` says the same thing to nginx.
 */
export function openEventStream(response: Response): void {
  response.statusCode = 200;
  response.setHeader('content-type', 'text/event-stream; charset=utf-8');
  response.setHeader('cache-control', 'no-cache, no-transform');
  response.setHeader('connection', 'keep-alive');
  response.setHeader('x-accel-buffering', 'no');
  response.flushHeaders();
  response.write(`retry: ${RETRY_HINT_MS}\n\n`);
}

/**
 * Write one event.
 *
 * The `id:` is the Redis stream entry id, which is what a client sends back as
 * `Last-Event-ID` to resume. The payload is serialized on one line because a
 * raw newline inside a `data:` field would end the frame early; `JSON.stringify`
 * escapes them, so this holds for every payload we can produce.
 */
export function writeEvent(response: Response, event: RealtimeEvent): void {
  response.write(`id: ${event.id}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
}

/** A comment frame. Carries nothing; exists so the socket is written to. */
export function writeHeartbeat(response: Response): void {
  response.write(': ping\n\n');
}
