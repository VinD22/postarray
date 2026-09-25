'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '@relay/design-system/primitives';
import { EmptyState, Notice, PageHeader } from '@relay/design-system/patterns';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';
import { useSession } from '@/lib/auth/session-context';
import { useLocalizedRouter } from '@/lib/i18n';

import { AsyncBoundary } from '../lib/async-boundary';
import { projectsGateway } from '../lib/gateway';
import { useFormatters } from '../lib/formatters';
import { settingsKey, useWorkspaceId } from '../lib/keys';

/** Referenced by the disabled create buttons so the refusal has a reason. */
const AT_LIMIT_NOTICE_ID = 'projects-at-limit';
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
  const [query, setQuery] = useState('');

  const rows = projects.data ?? [];
  const firstProjectId = rows[0]?.id ?? null;
  const filteredRows = rows.filter((project) =>
    project.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  useEffect(() => {
    if (selectedId === null && firstProjectId !== null) {
      setSelectedId(firstProjectId);
    }
  }, [firstProjectId, selectedId]);

  const visibleSelectedId = filteredRows.some((project) => project.id === selectedId)
    ? selectedId
    : (filteredRows[0]?.id ?? null);
  const selected = filteredRows.find((project) => project.id === visibleSelectedId) ?? null;
  const atLimit = rows.length >= workspace.projectLimit;

  const save = useSettingsMutation({
    section,
    mutationFn: (input: {
      projectId: string;
      patch: Parameters<typeof projectsGateway.update>[1];
    }) => projectsGateway.update(input.projectId, input.patch),
    invalidate: [PROJECTS_KEY],
    onSuccess: () => router.refresh(),
  });

  const create = useSettingsMutation({
    section,
    mutationFn: projectsGateway.create,
    invalidate: [PROJECTS_KEY],
    onSuccess: (project) => {
      setSelectedId(project.id);
      setCreating(false);
      setQuery('');
      router.refresh();
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
          <Button
            variant="primary"
            disabled={atLimit || projects.isPending || projects.isError}
            aria-describedby={atLimit ? AT_LIMIT_NOTICE_ID : undefined}
            onClick={() => setCreating(true)}
          >
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
            {projects.isPending
              ? t('common.loading')
              : projects.isError
                ? t('common.unavailable')
                : t('settings.ui.projects.capacitySummary', {
                    used: rows.length,
                    limit: workspace.projectLimit,
                  })}
          </p>
        </section>

        {atLimit ? (
          <Notice
            id={AT_LIMIT_NOTICE_ID}
            tone="warning"
            title={t('settings.ui.projects.atLimitTitle')}
            description={t('settings.ui.projects.atLimitBody', { limit: workspace.projectLimit })}
            actions={
              <Button variant="secondary" onClick={() => router.push('/settings/billing')}>
                {t('settings.ui.projects.atLimitAction')}
              </Button>
            }
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
                <Button
                  variant="primary"
                  disabled={atLimit || projects.isPending || projects.isError}
                  aria-describedby={atLimit ? AT_LIMIT_NOTICE_ID : undefined}
                  onClick={() => setCreating(true)}
                >
                  {t('settings.projects.add')}
                </Button>
              }
            />
          ) : (
            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)]">
              <nav
                aria-label={t('settings.ui.projects.listLabel')}
                className="border-border-default bg-surface-raised h-fit min-w-0 overflow-hidden rounded-lg border"
              >
                <div className="border-border-subtle border-b p-3">
                  <Input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label={t('settings.ui.projects.search')}
                    placeholder={t('settings.ui.projects.search')}
                  />
                  <p role="status" className="text-label text-text-tertiary mt-2">
                    {t('settings.ui.projects.searchCount', {
                      count: filteredRows.length,
                      total: rows.length,
                    })}
                  </p>
                </div>
                {filteredRows.length === 0 ? (
                  <p className="text-body-sm text-text-secondary p-4">
                    {t('settings.ui.projects.noMatches')}
                  </p>
                ) : null}
                <ul className="relay-scrollbar flex max-h-64 flex-col overflow-y-auto lg:max-h-[36rem]">
                  {filteredRows.map((project) => {
                    const active = project.id === visibleSelectedId;
                    return (
                      <li key={project.id} className="min-w-0">
                        <button
                          type="button"
                          className={cn(
                            'border-border-subtle flex min-h-20 w-full flex-col items-start justify-center gap-1 border-b px-4 py-3 text-start',
                            'transition-colors duration-(--duration-fast) last:border-0',
                            active
                              ? 'bg-accent-subtle text-text-accent'
                              : 'text-text-primary hover:bg-surface-hover',
                          )}
                          aria-current={active ? 'true' : undefined}
                          onClick={() => setSelectedId(project.id)}
                        >
                          <span
                            className="text-body-md w-full truncate font-semibold"
                            title={project.name}
                          >
                            {project.name}
                          </span>
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
        disabled={atLimit || projects.isPending || projects.isError}
        onSubmit={(input) => void create.run(input)}
      />
    </>
  );
}
