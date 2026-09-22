'use client';

import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@/lib/i18n';
import { confirmLeavingUnsaved, hasUnsavedChanges } from '@/lib/navigation/unsaved-changes';
import { localizedHref } from '@/lib/i18n/routing';
import { ACTIVE_PROJECT_COOKIE } from './project-selection';
import { useSession } from './session-context';

export type ContextTarget = { readonly kind: 'project' | 'workspace'; readonly id: string };

/** Both shell entry points use the same authorized selection and cache boundary. */
export function useContextSwitch() {
  const { session, workspace, project } = useSession();
  const client = useQueryClient();
  const { locale } = useI18n();
  const switching = useRef(false);

  return useCallback(
    async (target: ContextTarget) => {
      const candidates = target.kind === 'workspace' ? session.workspaces : session.projects;
      if (!candidates.some((candidate) => candidate.id === target.id)) return;
      if (target.id === (target.kind === 'workspace' ? workspace.id : project?.id)) return;

      if (switching.current) return;
      switching.current = true;
      if (hasUnsavedChanges() && !(await confirmLeavingUnsaved())) {
        switching.current = false;
        return;
      }

      // Invalidation refetches under the old query keys. Cancel and discard before
      // changing the cookie used by requests. A fresh document also discards local
      // form state and routes away from tenant-specific detail URLs.
      await client.cancelQueries();
      client.clear();
      if (target.kind === 'workspace') {
        document.cookie = `relay_ws=${encodeURIComponent(target.id)}; path=/; SameSite=Lax`;
        document.cookie = `${ACTIVE_PROJECT_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
      } else {
        document.cookie = `${ACTIVE_PROJECT_COOKIE}=${encodeURIComponent(target.id)}; path=/; SameSite=Lax`;
      }
      window.location.assign(localizedHref('/home', locale));
    },
    [client, locale, project?.id, session.projects, session.workspaces, workspace.id],
  );
}
