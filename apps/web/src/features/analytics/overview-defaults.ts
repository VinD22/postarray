import type { AnalyticsRange } from './types';

/**
 * What the overview opens on, shared by the client container and the server
 * render so both ask for the same cache keys.
 */

const HOUR_MS = 3_600_000;

/**
 * The last 30 days, ending at the top of the next hour, so the overview key is
 * stable for the hour and a revisit hits the cache instead of refetching. The
 * server and the browser agree on it unless the hour turns between them, in
 * which case the browser simply fetches its own.
 */
export function defaultOverviewRange(now: number = Date.now()): AnalyticsRange {
  const end = new Date(Math.ceil(now / HOUR_MS) * HOUR_MS);
  const start = new Date(end.getTime() - 30 * 86_400_000);
  return { preset: '30d', start: start.toISOString(), end: end.toISOString() };
}

/** The connections list the analytics filters read, scoped to the workspace. */
export function analyticsConnectionsKey(workspaceId: string, projectId: string | null) {
  return ['ws', workspaceId, 'connections', 'analytics', projectId ?? 'none'] as const;
}
