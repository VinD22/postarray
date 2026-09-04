/**
 * A server-sent events reader built on `fetch`.
 *
 * `EventSource` would be the obvious choice and it is the wrong one here. It
 * cannot set a request header, and this API pins the tenant with
 * `x-relay-workspace-id` on every route. A person who belongs to two
 * workspaces would open a stream and be told the workspace could not be found,
 * because there is no header for the guard to read and no single workspace on
 * the credential to fall back to. Reading the body ourselves costs a parser and
 * a reconnect loop and buys the header, plus an explicit `Last-Event-ID` on
 * every reconnect rather than only the ones the browser decides to send.
 */

/** One decoded frame. `id` is absent on a comment or an event without one. */
export interface SseFrame {
  readonly id: string | null;
  readonly event: string;
  readonly data: string;
}

/**
 * Split a buffer into whole frames, keeping the remainder.
 *
 * A chunk boundary can land anywhere, including inside a field name, so the
 * unterminated tail is always carried forward rather than parsed. A frame ends
 * at a blank line, and both line endings are accepted because a proxy is free
 * to rewrite them.
 */
export function parseFrames(buffer: string): { frames: SseFrame[]; rest: string } {
  const normalized = buffer.replace(/\r\n/g, '\n');
  const parts = normalized.split('\n\n');
  const rest = parts.pop() ?? '';
  const frames: SseFrame[] = [];

  for (const block of parts) {
    let id: string | null = null;
    let event = 'message';
    const data: string[] = [];

    for (const line of block.split('\n')) {
      // A line starting with a colon is a comment. The heartbeat is one, and
      // its only job is to have been written at all.
      if (line.length === 0 || line.startsWith(':')) {
        continue;
      }
      const separator = line.indexOf(':');
      const field = separator === -1 ? line : line.slice(0, separator);
      const rawValue = separator === -1 ? '' : line.slice(separator + 1);
      const value = rawValue.startsWith(' ') ? rawValue.slice(1) : rawValue;

      if (field === 'id') {
        id = value;
      } else if (field === 'event') {
        event = value;
      } else if (field === 'data') {
        data.push(value);
      }
    }

    if (data.length > 0) {
      frames.push({ id, event, data: data.join('\n') });
    }
  }

  return { frames, rest };
}

export interface SseStreamOptions {
  readonly url: string;
  readonly headers: Readonly<Record<string, string>>;
  /** The last id seen, sent as `Last-Event-ID` so a reconnect resumes. */
  readonly lastEventId: string | null;
  readonly signal: AbortSignal;
  onFrame(frame: SseFrame): void;
  /** Called once the response headers arrive with a 2xx. */
  onOpen?(): void;
}

/**
 * Read one connection to completion.
 *
 * Resolves when the server closes the stream, which it does on purpose just
 * under the hour so the session is re-checked. Throws on anything else, and
 * the caller decides whether to retry.
 */
export async function readSseStream(options: SseStreamOptions): Promise<void> {
  const response = await fetch(options.url, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      ...options.headers,
      accept: 'text/event-stream',
      ...(options.lastEventId === null ? {} : { 'last-event-id': options.lastEventId }),
    },
    signal: options.signal,
  });

  if (!response.ok || response.body === null) {
    throw new Error(`SSE_STATUS_${response.status}`);
  }
  options.onOpen?.();

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const { frames, rest } = parseFrames(buffer);
      buffer = rest;
      for (const frame of frames) {
        options.onFrame(frame);
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Wait longer after each consecutive failure, and never forever.
 *
 * Jittered, because a deploy disconnects every tab at once and an unjittered
 * backoff brings all of them back in the same second.
 */
export function reconnectDelayMs(consecutiveFailures: number, random = Math.random): number {
  const base = Math.min(1000 * 2 ** Math.max(0, consecutiveFailures - 1), 30_000);
  return Math.round(base * (0.5 + random() * 0.5));
}
