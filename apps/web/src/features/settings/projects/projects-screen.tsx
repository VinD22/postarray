'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@relay/design-system/primitives';
import { EmptyState, Notice, PageHeader } from '@relay/design-system/patterns';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';
import { useSession } from '@/lib/auth/session-context';
import { useLocalizedRouter } from '@/lib/i18n';

import { AsyncBoundary } from '../lib/async-boundary';
import { projectsGateway } from '../lib/gateway';
import { useFormatters } from '../lib/formatters';
import { settingsKey, useWorkspaceId } from '../lib/keys';
import { useSettingsMutation } from '../lib/use-settings-mutation';
import { SettingsStack } from '../components/section';
import { ProjectEditor } from './project-editor';
import { NewProjectDialog } from './new-project-dialog';

export function ProjectsScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.projects');
  const formatters = useFormatters();
  const { workspace } = useSession();
  const router = useLocalizedRouter();
  const workspaceId = useWorkspaceId();
  const PROJECTS_KEY = settingsKey(workspaceId, 'projects');

  const projects = useQuery({ queryKey: PROJECTS_KEY, queryFn: () => projectsGateway.list() });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const rows = projects.data ?? [];
  const firstProjectId = rows[0]?.id ?? null;

  useEffect(() => {
    if (selectedId === null && firstProjectId !== null) {
      setSelectedId(firstProjectId);
    }
  }, [firstProjectId, selectedId]);

  const selected = rows.find((project) => project.id === selectedId) ?? null;
  const atLimit = rows.length >= workspace.projectLimit;

  const save = useSettingsMutation({
    section,
    mutationFn: (input: { projectId: string; patch: Parameters<typeof projectsGateway.update>[1] }) =>
      projectsGateway.update(input.projectId, input.patch),
    invalidate: [PROJECTS_KEY],
  });

  const create = useSettingsMutation({
    section,
    mutationFn: projectsGateway.create,
    invalidate: [PROJECTS_KEY],
    onSuccess: (project) => {
      setSelectedId(project.id);
      setCreating(false);
    },
  });

  const archive = useSettingsMutation({
    section,
    mutationFn: (projectId: string) => projectsGateway.archive(projectId),
    invalidate: [PROJECTS_KEY],
    onSuccess: () => {
      setSelectedId(null);
      router.refresh();
    },
  });

  return (
    <>
      <PageHeader
        title={section}
        description={t('settings.ui.projects.description')}
        actions={
          <Button variant="primary" disabled={atLimit} onClick={() => setCreating(true)}>
            {t('settings.projects.add')}
          </Button>
        }
      />

      <SettingsStack>
        <section
          aria-label={t('settings.ui.projects.capacityTitle')}
          className="border-border-bold bg-surface-raised shadow-hard-sm flex flex-col gap-1 rounded-lg border-2 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 className="text-title-sm text-text-primary">
              {t('settings.ui.projects.capacityTitle')}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {t('settings.ui.projects.capacityHelp')}
            </p>
          </div>
          <p className="text-title-md text-text-primary shrink-0 whitespace-nowrap tabular-nums">
            {t('settings.ui.projects.capacitySummary', {
              used: rows.length,
              limit: workspace.projectLimit,
            })}
          </p>
        </section>

        {atLimit ? (
          <Notice
            tone="warning"
            title={t('settings.ui.projects.atLimitTitle')}
            description={t('settings.ui.projects.atLimitBody', { limit: workspace.projectLimit })}
          />
        ) : null}

        <AsyncBoundary
          section={section}
          isPending={projects.isPending}
          error={projects.error}
          onRetry={() => void projects.refetch()}
        >
          {rows.length === 0 ? (
            <EmptyState
              title={t('settings.ui.projects.emptyTitle')}
              description={t('settings.ui.projects.emptyBody')}
              example={t('settings.ui.projects.emptyExample')}
              action={
                <Button variant="primary" disabled={atLimit} onClick={() => setCreating(true)}>
                  {t('settings.projects.add')}
                </Button>
              }
            />
          ) : (
            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)]">
              <nav
                aria-label={t('settings.ui.projects.listLabel')}
                className="border-border-default bg-surface-raised h-fit overflow-hidden rounded-lg border"
              >
                <ul className="flex overflow-x-auto lg:flex-col lg:overflow-visible">
                  {rows.map((project) => {
                    const active = project.id === selectedId;
                    return (
                      <li key={project.id} className="min-w-56 flex-1 lg:min-w-0">
                        <button
                          type="button"
                          className={cn(
                            'border-border-subtle flex min-h-20 w-full flex-col items-start justify-center gap-1 border-e px-4 py-3 text-start lg:border-e-0 lg:border-b',
                            'transition-colors duration-(--duration-fast) last:border-0',
                            active
                              ? 'bg-accent-subtle text-text-accent'
                              : 'text-text-primary hover:bg-surface-hover',
                          )}
                          aria-current={active ? 'true' : undefined}
                          onClick={() => setSelectedId(project.id)}
                        >
                          <span className="text-body-md font-semibold">{project.name}</span>
                          <span className="text-label text-text-tertiary">
                            {t('settings.ui.projects.projectMeta', {
                              accounts: project.connectionCount,
                              updated: formatters.relative(project.updatedAt),
                            })}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {selected === null ? null : (
                <ProjectEditor
                  key={selected.id}
                  project={selected}
                  saving={save.isSaving}
                  archiving={archive.isSaving}
                  disabled={false}
                  onSave={(patch) => void save.run({ projectId: selected.id, patch })}
                  onArchive={() => void archive.run(selected.id)}
                  archiveDisabled={rows.length === 1 || selected.connectionCount > 0}
                  archiveDisabledReason={
                    rows.length === 1
                      ? t('settings.ui.projects.archiveLastDisabled')
                      : selected.connectionCount > 0
                        ? t('settings.ui.projects.archiveConnectedDisabled')
                        : null
                  }
                />
              )}
            </div>
          )}
        </AsyncBoundary>
      </SettingsStack>

      <NewProjectDialog
        open={creating}
        onOpenChange={setCreating}
        saving={create.isSaving}
        disabled={atLimit}
        onSubmit={(input) => void create.run(input)}
      />
    </>
  );
}
