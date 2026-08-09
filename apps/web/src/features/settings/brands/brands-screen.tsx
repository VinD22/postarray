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
import { brandsGateway } from '../lib/gateway';
import { useFormatters } from '../lib/formatters';
import { settingsKey, useWorkspaceId } from '../lib/keys';
import { useSettingsMutation } from '../lib/use-settings-mutation';
import { SettingsStack } from '../components/section';
import { BrandEditor } from './brand-editor';
import { NewBrandDialog } from './new-brand-dialog';

export function BrandsScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.brands');
  const formatters = useFormatters();
  const { workspace } = useSession();
  const router = useLocalizedRouter();
  const workspaceId = useWorkspaceId();
  const BRANDS_KEY = settingsKey(workspaceId, 'brands');

  const brands = useQuery({ queryKey: BRANDS_KEY, queryFn: () => brandsGateway.list() });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const rows = brands.data ?? [];
  const firstBrandId = rows[0]?.id ?? null;

  useEffect(() => {
    if (selectedId === null && firstBrandId !== null) {
      setSelectedId(firstBrandId);
    }
  }, [firstBrandId, selectedId]);

  const selected = rows.find((brand) => brand.id === selectedId) ?? null;
  const atLimit = rows.length >= workspace.projectLimit;

  const save = useSettingsMutation({
    section,
    mutationFn: (input: { brandId: string; patch: Parameters<typeof brandsGateway.update>[1] }) =>
      brandsGateway.update(input.brandId, input.patch),
    invalidate: [BRANDS_KEY],
  });

  const create = useSettingsMutation({
    section,
    mutationFn: brandsGateway.create,
    invalidate: [BRANDS_KEY],
    onSuccess: (brand) => {
      setSelectedId(brand.id);
      setCreating(false);
    },
  });

  const archive = useSettingsMutation({
    section,
    mutationFn: (brandId: string) => brandsGateway.archive(brandId),
    invalidate: [BRANDS_KEY],
    onSuccess: () => {
      setSelectedId(null);
      router.refresh();
    },
  });

  return (
    <>
      <PageHeader
        title={section}
        description={t('settings.ui.brands.description')}
        actions={
          <Button variant="primary" disabled={atLimit} onClick={() => setCreating(true)}>
            {t('settings.brands.add')}
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
          isPending={brands.isPending}
          error={brands.error}
          onRetry={() => void brands.refetch()}
        >
          {rows.length === 0 ? (
            <EmptyState
              title={t('settings.ui.brands.emptyTitle')}
              description={t('settings.ui.brands.emptyBody')}
              example={t('settings.ui.brands.emptyExample')}
              action={
                <Button variant="primary" disabled={atLimit} onClick={() => setCreating(true)}>
                  {t('settings.brands.add')}
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
                  {rows.map((brand) => {
                    const active = brand.id === selectedId;
                    return (
                      <li key={brand.id} className="min-w-56 flex-1 lg:min-w-0">
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
                          onClick={() => setSelectedId(brand.id)}
                        >
                          <span className="text-body-md font-semibold">{brand.name}</span>
                          <span className="text-label text-text-tertiary">
                            {t('settings.ui.projects.projectMeta', {
                              accounts: brand.connectionCount,
                              updated: formatters.relative(brand.updatedAt),
                            })}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {selected === null ? null : (
                <BrandEditor
                  key={selected.id}
                  brand={selected}
                  saving={save.isSaving}
                  archiving={archive.isSaving}
                  disabled={false}
                  onSave={(patch) => void save.run({ brandId: selected.id, patch })}
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

      <NewBrandDialog
        open={creating}
        onOpenChange={setCreating}
        saving={create.isSaving}
        disabled={atLimit}
        onSubmit={(input) => void create.run(input)}
      />
    </>
  );
}
