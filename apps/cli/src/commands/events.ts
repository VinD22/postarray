import { REALTIME_EVENT_TYPES, RelayError, realtimeEventIdSchema } from '@relay/contracts';
import type { RealtimeEvent, RealtimeEventType } from '@relay/contracts';
import { z } from 'zod';

import { ROUTES } from '../api/routes';
import { followEvents } from '../api/event-stream';
import { realtimeEventPageSchema } from '../api/schemas';
import { requireCredential, type CliContext } from '../context';
import { renderSuccess, renderTable } from '../output';
import type { RenderInput } from '../output';

/**
 * Watching a workspace from the terminal.
 *
 * `--follow` prints one JSON object per line and never stops, which is the
 * shape a shell pipeline wants: `postarray events --follow | jq` works, and so
 * does piping it into a file. That is why the follow output is NDJSON rather
 * than the usual envelope, which describes one finished command and cannot
 * describe an open stream.
 *
 * Without `--follow` it is an ordinary read of what has happened recently, with
 * the ordinary envelope, so a script that wants a snapshot does not have to
 * open a stream and close it again.
 */

export interface EventsOptions {
  readonly follow: boolean;
  /**
   * Reopen the stream when the server closes it. On by default.
   *
   * The server ends a stream itself just under the hour so the session is
   * re-checked, and a watcher that stopped there would look to a script
   * exactly like a watcher that saw nothing happen. `--no-reconnect` is for
   * the other case: read one stream to its end and exit.
   */
  readonly reconnect: boolean;
  readonly since?: string | undefined;
  readonly type?: readonly string[] | undefined;
  readonly limit?: number | undefined;
}

const typeListSchema = z.array(z.enum(REALTIME_EVENT_TYPES)).min(1);

function parseTypes(
  values: readonly string[] | undefined,
): readonly RealtimeEventType[] | undefined {
  if (values === undefined || values.length === 0) {
    return undefined;
  }
  const parsed = typeListSchema.safeParse(values.flatMap((value) => value.split(',')));
  if (!parsed.success) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { field: 'type', allowed: [...REALTIME_EVENT_TYPES] },
    });
  }
  return parsed.data;
}

function parseSince(value: string | undefined): string | null {
  if (value === undefined) {
    return null;
  }
  const parsed = realtimeEventIdSchema.safeParse(value);
  if (!parsed.success) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { field: 'since', reason: 'NOT_A_STREAM_EVENT_ID' },
    });
  }
  return parsed.data;
}

export async function eventsWatch(
  context: CliContext,
  render: RenderInput,
  options: EventsOptions,
): Promise<void> {
  const types = parseTypes(options.type);
  const since = parseSince(options.since);

  if (!options.follow) {
    await listRecent(context, render, { since, types, limit: options.limit });
    return;
  }

  const credential = requireCredential(context);
  let resumeFrom = since;

  do {
    // The resume point survives each pass, so reopening prints the events that
    // happened while the connection was down rather than starting over.
    resumeFrom = await followEvents({
      baseUrl: context.apiUrl,
      accessToken: credential.accessToken,
      workspaceId: context.workspaceId,
      locale: context.locale,
      since: resumeFrom,
      types,
      fetch: context.deps.streamFetch,
      onEvent: (event: RealtimeEvent) => {
        context.writer.out(JSON.stringify(event));
      },
    });
  } while (options.reconnect);
}

async function listRecent(
  context: CliContext,
  render: RenderInput,
  input: {
    readonly since: string | null;
    readonly types: readonly RealtimeEventType[] | undefined;
    readonly limit: number | undefined;
  },
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.recentEvents(),
    schema: realtimeEventPageSchema,
    query: {
      since: input.since ?? undefined,
      type: input.types === undefined ? undefined : input.types.join(','),
      limit: input.limit,
    },
  });

  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    ...renderTable(
      ['id', 'type', 'occurredAt'],
      response.data.events.map((event) => [event.id, event.type, event.occurredAt]),
    ),
    `lastEventId=${response.data.lastEventId ?? ''}`,
  ]);
}
