import { API_HEADERS, API_VERSION, RelayError, realtimeEventSchema } from '@relay/contracts';
import type { RealtimeEvent, RealtimeEventType } from '@relay/contracts';

import { toRelayError } from './client';

/**
 * Reading `GET /v1/events` from the terminal.
 *
 * The JSON client one file over reads a whole body and parses it, which is
 * exactly the wrong shape for a response that is designed never to end. This
 * is the same headers, the same bearer token, the same workspace pin and the
 * same error translation, over a body that is consumed as it arrives.
 */

/**
 * The fetch shape this needs: a streaming body.
 *
 * Declared separately from `FetchLike` because that one promises `text()`,
 * which is precisely the method a caller must not reach for here.
 */
export type StreamFetch = (
  input: string,
  init: { method: string; headers: Record<string, string>; signal?: AbortSignal },
) => Promise<{
  status: number;
  body: ReadableStream<Uint8Array> | null;
  text(): Promise<string>;
}>;

export interface FollowEventsOptions {
  readonly baseUrl: string;
  readonly accessToken: string;
  readonly workspaceId: string | null;
  readonly locale?: string | undefined;
  /** Resume point. The last id printed, so a reconnect prints no duplicate. */
  readonly since: string | null;
  readonly types?: readonly RealtimeEventType[] | undefined;
  readonly signal?: AbortSignal | undefined;
  readonly fetch?: StreamFetch | undefined;
  onEvent(event: RealtimeEvent): void;
}

const defaultStreamFetch: StreamFetch = async (input, init) => {
  const response = await globalThis.fetch(input, {
    method: init.method,
    headers: init.headers,
    ...(init.signal === undefined ? {} : { signal: init.signal }),
  });
  return {
    status: response.status,
    body: response.body,
    text: () => response.text(),
  };
};

function streamUrl(options: FollowEventsOptions): string {
  const base = options.baseUrl.endsWith('/') ? options.baseUrl : `${options.baseUrl}/`;
  const url = new URL('v1/events', base);
  if (options.since !== null) {
    url.searchParams.set('since', options.since);
  }
  if (options.types !== undefined && options.types.length > 0) {
    url.searchParams.set('type', options.types.join(','));
  }
  return url.toString();
}

/**
 * Follow the stream until the server ends it or the caller aborts.
 *
 * Returns the last id it saw, so a caller that reconnects resumes exactly
 * where this call stopped rather than replaying what it already printed.
 */
export async function followEvents(options: FollowEventsOptions): Promise<string | null> {
  const headers: Record<string, string> = {
    accept: 'text/event-stream',
    authorization: `Bearer ${options.accessToken}`,
    [API_HEADERS.apiVersion]: API_VERSION,
    'user-agent': 'relay-cli',
  };
  if (options.workspaceId !== null) {
    headers[API_HEADERS.workspaceId] = options.workspaceId;
  }
  if (options.locale !== undefined) {
    headers['accept-language'] = options.locale;
  }
  if (options.since !== null) {
    headers['last-event-id'] = options.since;
  }

  const doFetch = options.fetch ?? defaultStreamFetch;
  const response = await doFetch(streamUrl(options), {
    method: 'GET',
    headers,
    ...(options.signal === undefined ? {} : { signal: options.signal }),
  });

  if (response.status < 200 || response.status >= 300) {
    throw toRelayError(response.status, await response.text(), 'events-follow');
  }
  if (response.body === null) {
    throw new RelayError('INTERNAL', {
      messageKey: 'error.internal.message',
      details: { reason: 'RESPONSE_NOT_A_STREAM' },
    });
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let lastEventId = options.since;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      return lastEventId;
    }
    buffer += decoder.decode(value, { stream: true });
    // Frames are terminated by a blank line, so an unterminated tail is always
    // carried forward: a chunk boundary can land in the middle of a field.
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';
    for (const block of blocks) {
      const event = parseBlock(block);
      if (event !== null) {
        lastEventId = event.id;
        options.onEvent(event);
      }
    }
  }
}

/**
 * One frame, or nothing.
 *
 * The heartbeat is a comment and produces nothing, and so does a payload the
 * schema does not recognise. Parsing rather than casting is what keeps a
 * response from an unexpected proxy off a script's stdout.
 */
function parseBlock(block: string): RealtimeEvent | null {
  const data: string[] = [];
  let id: string | null = null;

  for (const line of block.replace(/\r/g, '').split('\n')) {
    if (line.length === 0 || line.startsWith(':')) {
      continue;
    }
    const separator = line.indexOf(':');
    const field = separator === -1 ? line : line.slice(0, separator);
    const raw = separator === -1 ? '' : line.slice(separator + 1);
    const value = raw.startsWith(' ') ? raw.slice(1) : raw;
    if (field === 'data') {
      data.push(value);
    } else if (field === 'id') {
      id = value;
    }
  }

  if (data.length === 0) {
    return null;
  }
  let body: unknown;
  try {
    body = JSON.parse(data.join('\n'));
  } catch {
    return null;
  }
  const parsed = realtimeEventSchema.safeParse(
    typeof body === 'object' && body !== null && id !== null ? { ...body, id } : body,
  );
  return parsed.success ? parsed.data : null;
}
