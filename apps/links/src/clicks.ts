import type { Logger } from '@relay/observability';

import type { ClickEvent, ClickSink, ClickWriter } from './types.js';

/**
 * The click buffer.
 *
 * The redirect must never wait on a write. Events are appended to a bounded
 * in-memory buffer and flushed in batches by a timer or when the batch fills.
 * If the buffer is full we drop the *oldest* events and count the loss, because
 * measurement is the least important thing this service does: dropping a click
 * is acceptable, delaying a redirect is not.
 */

export interface BufferedClickSinkOptions {
  readonly write: ClickWriter;
  readonly logger: Logger;
  readonly maxBatchSize?: number;
  readonly flushIntervalMs?: number;
  readonly maxBufferedEvents?: number;
}

export const DEFAULT_MAX_BATCH_SIZE = 200;
export const DEFAULT_FLUSH_INTERVAL_MS = 1000;
export const DEFAULT_MAX_BUFFERED_EVENTS = 10_000;

export interface BufferedClickSink extends ClickSink {
  readonly bufferedCount: number;
  readonly droppedCount: number;
}

export function createBufferedClickSink(options: BufferedClickSinkOptions): BufferedClickSink {
  const maxBatchSize = options.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE;
  const flushIntervalMs = options.flushIntervalMs ?? DEFAULT_FLUSH_INTERVAL_MS;
  const maxBuffered = options.maxBufferedEvents ?? DEFAULT_MAX_BUFFERED_EVENTS;

  let buffer: ClickEvent[] = [];
  let dropped = 0;
  let closed = false;
  let timer: NodeJS.Timeout | undefined;
  let inFlight: Promise<void> = Promise.resolve();

  const drain = async (): Promise<void> => {
    while (buffer.length > 0) {
      const batch = buffer.slice(0, maxBatchSize);
      buffer = buffer.slice(batch.length);
      try {
        await options.write(batch);
      } catch (error) {
        options.logger.warn(
          { event: 'shortlink.click_flush_failed', batchSize: batch.length, error },
          'shortlink.click_flush_failed',
        );
        // The events are already removed. Retrying them here would risk an
        // unbounded loop on a persistent failure, and a lost click is not worth
        // that. The loss is visible in the log and in `droppedCount`.
        dropped += batch.length;
      }
    }
  };

  const scheduleFlush = (): void => {
    if (timer !== undefined || closed) {
      return;
    }
    timer = setTimeout(() => {
      timer = undefined;
      inFlight = inFlight.then(drain);
    }, flushIntervalMs);
    timer.unref();
  };

  return {
    record(event: ClickEvent): void {
      if (closed) {
        dropped += 1;
        return;
      }
      if (buffer.length >= maxBuffered) {
        buffer.shift();
        dropped += 1;
      }
      buffer.push(event);
      if (buffer.length >= maxBatchSize) {
        inFlight = inFlight.then(drain);
        return;
      }
      scheduleFlush();
    },
    async flush(): Promise<void> {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      inFlight = inFlight.then(drain);
      await inFlight;
    },
    async close(): Promise<void> {
      closed = true;
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      inFlight = inFlight.then(drain);
      await inFlight;
    },
    get bufferedCount(): number {
      return buffer.length;
    },
    get droppedCount(): number {
      return dropped;
    },
  };
}

/** Keeps every event in memory. Used by tests and by the sandbox deployment. */
export function createMemoryClickSink(): BufferedClickSink & { readonly events: readonly ClickEvent[] } {
  const events: ClickEvent[] = [];
  return {
    record(event: ClickEvent): void {
      events.push(event);
    },
    flush: async () => undefined,
    close: async () => undefined,
    get bufferedCount(): number {
      return 0;
    },
    get droppedCount(): number {
      return 0;
    },
    get events(): readonly ClickEvent[] {
      return events;
    },
  };
}
