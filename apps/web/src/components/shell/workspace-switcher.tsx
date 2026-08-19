'use client';

import { Check, ChevronsUpDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { useInvalidateWorkspace } from '@/lib/api/hooks';
import { useSession } from '@/lib/auth/session-context';
import { useLocalizedRouter, useTranslations } from '@/lib/i18n';
import { ACTIVE_PROJECT_COOKIE } from '@/lib/auth/project-selection';

/**
 * The workspace switcher.
 *
 * Switching clears every cached row that belongs to the workspace being left,
 * so another tenant's queue can never appear for a frame. The current
 * workspace's time zone is stated under the name, because every time on the
 * screen is rendered in it.
 */
export function WorkspaceSwitcher({ className }: { readonly className?: string }) {
  const t = useTranslations();
  const router = useLocalizedRouter();
  const { session, workspace, project } = useSession();
  const invalidateWorkspace = useInvalidateWorkspace();

  const switchTo = (workspaceId: string) => {
    if (workspaceId === workspace.id) {
      return;
    }
    invalidateWorkspace(workspace.id);
    document.cookie = `relay_ws=${workspaceId}; path=/; SameSite=Lax`;
    document.cookie = `${ACTIVE_PROJECT_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
    router.refresh();
  };

  const switchProject = (projectId: string) => {
    if (projectId === project?.id) {
      return;
    }
    invalidateWorkspace(workspace.id);
    document.cookie = `${ACTIVE_PROJECT_COOKIE}=${encodeURIComponent(projectId)}; path=/; SameSite=Lax`;
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('nav.projectSwitcher')}
        className={cn(
          'border-border-default flex min-h-11 max-w-56 items-center gap-2 rounded-md border',
          'bg-surface-raised text-body-md text-text-primary px-2.5 py-1.5 md:min-h-9',
          'hover:bg-surface-hover transition-colors duration-(--duration-fast)',
          className,
        )}
      >
        <span className="flex min-w-0 flex-col items-start">
          <span className="truncate font-medium">{project?.name ?? t('shell.project.none')}</span>
          <span className="text-label text-text-tertiary truncate">{workspace.name}</span>
        </span>
        <ChevronsUpDown aria-hidden="true" className="text-text-tertiary size-4 shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>{t('shell.project.label')}</DropdownMenuLabel>
        {session.projects.map((candidate) => {
          const current = candidate.id === project?.id;
          return (
            <DropdownMenuItem key={candidate.id} onSelect={() => switchProject(candidate.id)}>
              <span className="min-w-0 flex-1 truncate">{candidate.name}</span>
              {current ? (
                <>
                  <Check aria-hidden="true" className="text-accent size-4" />
                  <span className="sr-only">
                    {t('shell.project.current', { name: candidate.name })}
                  </span>
                </>
              ) : null}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem onSelect={() => router.push('/settings/projects')}>
          <Plus aria-hidden="true" className="size-4" />
          {t('shell.project.manage')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('shell.workspace.label')}</DropdownMenuLabel>
        {session.workspaces.map((candidate) => {
          const current = candidate.id === workspace.id;
          return (
            <DropdownMenuItem
              key={candidate.id}
              onSelect={() => {
                switchTo(candidate.id);
              }}
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate">{candidate.name}</span>
                <span className="text-label text-text-tertiary truncate">
                  {t('shell.workspace.role', { role: candidate.role })}
                </span>
              </span>
              {current ? (
                <>
                  <Check aria-hidden="true" className="text-accent size-4" />
                  <span className="sr-only">
                    {t('shell.workspace.current', { name: candidate.name })}
                  </span>
                </>
              ) : null}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            router.push('/settings/projects');
          }}
        >
          {t('shell.workspace.manage')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            router.push('/onboarding/workspace');
          }}
        >
          <Plus aria-hidden="true" className="size-4" />
          {t('shell.workspace.create')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
