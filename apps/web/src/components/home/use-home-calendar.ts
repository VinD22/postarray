'use client';

import { useEffect, useMemo, useState } from 'react';

import { useCalendar } from '@/lib/api/hooks';
import { useSession } from '@/lib/auth/session-context';

import { DAY_MS, WEEK_MS, entriesWithin, homeWindowRange } from './home-window';

const CLOCK_TICK_MS = 5 * 60_000;

/** A clock that ticks every few minutes and when the tab comes back. */
function useHomeClock(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const timer = window.setInterval(refresh, CLOCK_TICK_MS);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);
  return now;
}

/**
 * Home's calendar read: one query for the hour-aligned week, with the week and
 * the next 24 hours derived from it. Every Home section calls this and React
 * Query deduplicates them into a single request.
 */
export function useHomeCalendar() {
  const { project } = useSession();
  const now = useHomeClock();
  const range = homeWindowRange(now);
  const query = useCalendar({
    ...range,
    ...(project === null ? {} : { projectId: project.id }),
  });
  const data = query.data?.data;
  const week = useMemo(() => (data ? entriesWithin(data, now, WEEK_MS) : []), [data, now]);
  const day = useMemo(() => (data ? entriesWithin(data, now, DAY_MS) : []), [data, now]);
  return { query, week, day };
}
