'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ERROR_CODES, type CommitKind } from '@relay/contracts';

import { ApiError, api } from '@/lib/api';
import type { PreviewState } from '../state/commit-preview';

/**
 * Ask the server what scheduling and publishing now would take, whenever the
 * confirm step opens or the chosen time changes.
 *
 * The draft is saved first, because the preview reads the stored version and
 * a preview of stale text would warn about the wrong thing. Both kinds are
 * previewed side by side: the sheet offers both buttons, and each has its own
 * escalations (publishing now always adds `immediate_publish`).
 */
export function useCommitPreview(input: {
  readonly open: boolean;
  readonly online: boolean;
  readonly instant: string | null;
  readonly timeZone: string;
  readonly saveNow: () => Promise<string>;
}): {
  readonly schedule: PreviewState;
  readonly publishNow: PreviewState;
  readonly refresh: () => void;
} {
  const [schedule, setSchedule] = useState<PreviewState>({ status: 'idle' });
  const [publishNow, setPublishNow] = useState<PreviewState>({ status: 'idle' });
  const [generation, setGeneration] = useState(0);
  const saveNow = useRef(input.saveNow);
  saveNow.current = input.saveNow;

  const refresh = useCallback(() => setGeneration((value) => value + 1), []);

  const scheduleable = input.instant !== null && Date.parse(input.instant) > Date.now();

  useEffect(() => {
    if (!input.open || !input.online) {
      setSchedule({ status: 'idle' });
      setPublishNow({ status: 'idle' });
      return;
    }
    let cancelled = false;
    setPublishNow({ status: 'loading' });
    setSchedule(scheduleable ? { status: 'loading' } : { status: 'idle' });

    const load = async (contentItemId: string, kind: CommitKind): Promise<PreviewState> => {
      try {
        const preview = await api.publishing.previewCommit(contentItemId, {
          kind,
          ...(kind === 'schedule' && input.instant !== null
            ? { scheduledAt: input.instant, ianaTimeZone: input.timeZone }
            : {}),
        });
        return preview === null ? { status: 'unavailable' } : { status: 'ready', preview };
      } catch (error) {
        if (
          error instanceof ApiError &&
          (error.code === ERROR_CODES.FORBIDDEN || error.code === ERROR_CODES.SCOPE_INSUFFICIENT)
        ) {
          return { status: 'forbidden' };
        }
        return { status: 'unavailable' };
      }
    };

    void (async () => {
      let contentItemId: string;
      try {
        contentItemId = await saveNow.current();
      } catch {
        if (!cancelled) {
          setPublishNow({ status: 'unavailable' });
          setSchedule(scheduleable ? { status: 'unavailable' } : { status: 'idle' });
        }
        return;
      }
      const [nowState, laterState] = await Promise.all([
        load(contentItemId, 'publish_now'),
        scheduleable
          ? load(contentItemId, 'schedule')
          : Promise.resolve<PreviewState>({ status: 'idle' }),
      ]);
      if (!cancelled) {
        setPublishNow(nowState);
        setSchedule(laterState);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [input.open, input.online, input.instant, input.timeZone, scheduleable, generation]);

  return { schedule, publishNow, refresh };
}
