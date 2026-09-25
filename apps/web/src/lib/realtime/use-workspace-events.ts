'use client';

import { API_HEADERS, realtimeEventSchema } from '@relay/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { apiConfig } from '@/lib/api/config';
import { useWorkspaceId } from '@/lib/auth/session-context';

import { invalidateForEvent, invalidateLiveQueries } from './invalidate';
import { readSseStream, reconnectDelayMs } from './sse-client';

/**
 * Live status for the whole app, mounted once.
 *
 * Someone who presses Publish watches a receipt screen while the post moves
 * through preparing_media, dispatching, provider_processing and published in a
 * few seconds. Before this the page showed none of it: the action centre polled
 * once a minute and the post detail polled nothing, so the honest reading of
 * the screen was that publishing had hung.
 *
 * Nothing here writes into the cache. An event says an id changed state and
 * this marks the matching queries stale; React Query refetches them through
 * the normal authorized client. That is the whole design: the stream is a
 * notification channel, never a second way to read data.
 */

/**
 * Consecutive failures before the fallback takes over.
 *
 * One failure is a deploy, a laptop lid or a wifi handover, and reconnecting is
 * the right answer. Two in a row usually means something between the browser
 * and the API is buffering the response, which some corporate proxies do
 * regardless of what the headers ask for, and no amount of reconnecting fixes
 * it. So the fallback is not optional: without it those people get a page that
 * silently stops updating, which is worse than the polling they had.
 */
export const FAILURES_BEFORE_FALLBACK = 2;

/** The interval the fallback refreshes on. The action centre's existing cadence. */
export const FALLBACK_POLL_INTERVAL_MS = 60_000;

export interface WorkspaceEventsState {
  /** True while a stream is open and delivering. */
  readonly connected: boolean;
  /** True once the client gave up on the stream and went back to polling. */
  readonly polling: boolean;
}

export function useWorkspaceEvents(): WorkspaceEventsState {
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const [polling, setPolling] = useState(false);

  // Survives a reconnect so the server can replay the gap. Held in a ref
  // rather than state because changing it must not re-render anything.
  const lastEventId = useRef<string | null>(null);

  useEffect(() => {
    const baseUrl = apiConfig.baseUrl;
    if (baseUrl === null || workspaceId.length === 0) {
      return;
    }

    const controller = new AbortController();
    let failures = 0;
    let stopped = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const handleFrame = (frame: { id: string | null; data: string }): void => {
      if (frame.id !== null) {
        lastEventId.current = frame.id;
      }
      let body: unknown;
      try {
        body = JSON.parse(frame.data);
      } catch {
        return;
      }
      // Parsed, never cast. Anything the schema does not recognise is dropped:
      // a frame we cannot understand is not a reason to invalidate a cache.
      const parsed = realtimeEventSchema.safeParse(body);
      if (!parsed.success || parsed.data.workspaceId !== workspaceId) {
        return;
      }
      invalidateForEvent(queryClient, workspaceId, parsed.data);
    };

    const run = async (): Promise<void> => {
      while (!stopped) {
        try {
          await readSseStream({
            url: `${baseUrl}/${apiConfig.apiVersion}/events`,
            headers: { [API_HEADERS.workspaceId]: workspaceId },
            lastEventId: lastEventId.current,
            signal: controller.signal,
            onFrame: handleFrame,
            onOpen: () => {
              failures = 0;
              setConnected(true);
              setPolling(false);
            },
          });
          // A clean end is the server's hourly close, so reconnect at once and
          // do not count it as a failure.
          setConnected(false);
        } catch {
          if (stopped) {
            return;
          }
          failures += 1;
          setConnected(false);
          if (failures >= FAILURES_BEFORE_FALLBACK) {
            setPolling(true);
          }
        }
        if (stopped) {
          return;
        }
        await new Promise<void>((resolve) => {
          retryTimer = setTimeout(resolve, failures === 0 ? 0 : reconnectDelayMs(failures));
        });
      }
    };

    void run();

    return () => {
      stopped = true;
      clearTimeout(retryTimer);
      controller.abort();
      setConnected(false);
    };
  }, [workspaceId, queryClient]);

  // The fallback. Deliberately the same refresh the stream would have caused,
  // on the cadence the action centre already used, so a person behind a
  // buffering proxy gets the product they had rather than a frozen page.
  useEffect(() => {
    if (!polling || workspaceId.length === 0) {
      return;
    }
    const timer = setInterval(() => {
      invalidateLiveQueries(queryClient, workspaceId);
    }, FALLBACK_POLL_INTERVAL_MS);
    return () => {
      clearInterval(timer);
    };
  }, [polling, workspaceId, queryClient]);

  return { connected, polling };
}
