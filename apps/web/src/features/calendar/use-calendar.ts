'use client';

/**
 * Calendar data access.
 *
 * Reads reuse `useCalendar` from `@/lib/api/hooks` so the cache key, the
 * workspace scoping and the demo seam are the shell's, not a second copy.
 * This module adds the calendar's own concerns on top: the window query, and
 * the two different writes a move can be.
 *
 * Neither write is optimistic. A reschedule changes when something reaches the
 * outside world, and showing the post at its new time before the server agrees
 * would leave a person believing a post moved when it did not. Optimism is
 * only safe where a rollback is invisible, and this is not that.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { ERROR_CODES } from '@relay/contracts';
import { ApiError, api, newIdempotencyKey } from '@/lib/api';
import { useCalendar } from '@/lib/api/hooks';
import { useWorkspaceId } from '@/lib/auth/session-context';
import type { CalendarEntryView, Paginated } from '@/lib/api/types';
import type { CalendarEntry, PublishedMoveMode } from './types';

export interface CalendarQueryInput {
  readonly from: Date;
  readonly to: Date;
  readonly projectId: string | null;
}

export type CalendarEntriesResult = UseQueryResult<Paginated<CalendarEntryView>, ApiError>;

/**
 * The entries in the visible window.
 *
 * Filtering happens on the client because every filter the toolbar offers is a
 * property already present on the loaded window, and a round trip per select
 * change would make the toolbar feel broken. The window itself is a server
 * query, so the volume stays bounded.
 */
export function useCalendarEntries(input: CalendarQueryInput): CalendarEntriesResult {
  return useCalendar({
    from: input.from.toISOString(),
    to: input.to.toISOString(),
    ...(input.projectId ? { projectId: input.projectId } : {}),
  });
}

/** The page envelope unwrapped, widened to the calendar's own entry shape. */
export function entriesOf(result: CalendarEntriesResult): readonly CalendarEntry[] {
  return (result.data?.data ?? []) as readonly CalendarEntry[];
}

export interface RescheduleInput {
  readonly entry: CalendarEntry;
  readonly toInstant: string;
  readonly timeZone: string;
  /** Only set when the post already exists on the platform. */
  readonly publishedMode: PublishedMoveMode | null;
}

/**
 * Move a post.
 *
 * `schedule_new_post` calls `schedule`, not `reschedule`, because it creates a
 * second external action rather than moving the first. Routing both through
 * one call is exactly the confusion the confirmation dialog exists to prevent.
 *
 * The idempotency key is derived from the content item, the target instant and
 * the mode, so a double submit or a retry after a dropped response replays the
 * same key and the server recognises it instead of moving the post twice.
 */
export function useRescheduleEntry(): UseMutationResult<unknown, ApiError, RescheduleInput> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: (input: RescheduleInput) => {
      const key = rescheduleIdempotencyKey(
        input.entry.contentItemId,
        input.toInstant,
        input.publishedMode,
      );
      if (input.publishedMode === 'schedule_new_post') {
        return api.scheduling.schedule(
          {
            contentItemId: input.entry.contentItemId,
            scheduledAt: input.toInstant,
            timeZone: input.timeZone,
          },
          key,
        );
      }
      return api.scheduling.reschedule(
        requirePublishJobId(input.entry),
        { scheduledAt: input.toInstant, timeZone: input.timeZone },
        key,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'calendar'] });
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'content'] });
    },
  });
}

/**
 * A stable key for one confirmed move.
 *
 * Deterministic rather than random on purpose: `newIdempotencyKey` is right for
 * a fresh user intent, but a retry of the same confirmed move must carry the
 * key the first attempt used.
 */
export function rescheduleIdempotencyKey(
  contentItemId: string,
  toInstant: string,
  mode: PublishedMoveMode | null,
): string {
  const suffix = mode === 'schedule_new_post' ? 'new' : 'move';
  return `resched.${contentItemId}.${toInstant.replace(/[:.]/g, '-')}.${suffix}`;
}

/** Cancel a scheduled post. The draft survives, so this is safe to offer. */
export function useCancelScheduled(): UseMutationResult<unknown, ApiError, string> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: (publishJobId: string) =>
      api.scheduling.cancel(publishJobId, 'calendar.user_cancelled', newIdempotencyKey('cancel')),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'calendar'] });
    },
  });
}

export interface PauseInput {
  readonly entry: CalendarEntry;
  readonly note: string | null;
}

/**
 * Hold a scheduled post.
 *
 * Not optimistic, for the same reason a reschedule is not: this changes whether
 * something reaches the outside world. Showing "Paused" before the server has
 * agreed would leave a person believing a post was stopped when it was not,
 * which is the worst possible thing this control could get wrong.
 *
 * The idempotency key is derived from the job, so a double click or a retry
 * after a dropped response replays one request rather than racing two.
 */
export function usePauseScheduled(): UseMutationResult<unknown, ApiError, PauseInput> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: (input: PauseInput) =>
      api.scheduling.pause(
        requirePublishJobId(input.entry),
        input.note,
        holdIdempotencyKey('pause', input.entry),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'calendar'] });
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'content'] });
    },
  });
}

export interface ResumeInput {
  readonly entry: CalendarEntry;
  /** Omitted while the original instant is still ahead. */
  readonly toInstant?: string;
  readonly timeZone?: string;
  readonly confirmDst?: boolean;
}

/** Release a held post, optionally at a new time. */
export function useResumeScheduled(): UseMutationResult<unknown, ApiError, ResumeInput> {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  return useMutation({
    mutationFn: (input: ResumeInput) =>
      api.scheduling.resume(
        requirePublishJobId(input.entry),
        {
          ...(input.toInstant === undefined ? {} : { scheduledAt: input.toInstant }),
          ...(input.timeZone === undefined ? {} : { timeZone: input.timeZone }),
          ...(input.confirmDst === undefined ? {} : { confirmDst: input.confirmDst }),
        },
        holdIdempotencyKey(
          input.toInstant === undefined ? 'resume' : `resume.${input.toInstant}`,
          input.entry,
        ),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'calendar'] });
      void queryClient.invalidateQueries({ queryKey: ['ws', workspaceId, 'content'] });
    },
  });
}

/** Deterministic, so a retry of one intent replays instead of racing. */
export function holdIdempotencyKey(action: string, entry: CalendarEntry): string {
  return `hold.${action}.${entry.publishJobId ?? entry.contentItemId}`.replace(/[:.]/g, (match) =>
    match === ':' ? '-' : '.',
  );
}

function requirePublishJobId(entry: CalendarEntry): string {
  if (entry.publishJobId !== null) {
    return entry.publishJobId;
  }
  throw new ApiError({
    code: ERROR_CODES.VALIDATION_FAILED,
    status: 422,
    messageCode: 'validation_failed',
    retryable: false,
    details: { resource: 'publish_job' },
    correlationId: null,
    retryAfterSeconds: null,
  });
}
