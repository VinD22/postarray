import type { SessionProjectView } from '@/lib/api/types';

export const ACTIVE_PROJECT_COOKIE = 'relay_project';

/**
 * Resolve an active project only from projects already authorized into the
 * session. A stale or cross-workspace cookie therefore falls back safely.
 */
export function resolveActiveProject(
  projects: readonly SessionProjectView[],
  requestedId: string | null | undefined,
): SessionProjectView | null {
  if (requestedId) {
    const requested = projects.find((project) => project.id === requestedId);
    if (requested !== undefined) {
      return requested;
    }
  }
  return projects[0] ?? null;
}
