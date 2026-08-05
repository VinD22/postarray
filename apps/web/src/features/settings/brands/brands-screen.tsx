'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system/primitives';
import { EmptyState, PageHeader } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { AsyncBoundary } from '../lib/async-boundary.js';
import { brandsGateway } from '../lib/gateway.js';
import { useFormatters } from '../lib/formatters.js';
import { settingsKey, useWorkspaceId } from '../lib/keys.js';
import { useSettingsMutation } from '../lib/use-settings-mutation.js';
import { SettingsStack } from '../components/section.js';
import { BrandEditor } from './brand-editor.js';
import { NewBrandDialog } from './new-brand-dialog.js';

export function BrandsScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.brands');
  const formatters = useFormatters();
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

  return (
    <>
      <PageHeader
        title={section}
        description={t('settings.ui.brands.description')}
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            {t('settings.brands.add')}
          </Button>
        }
      />

      <SettingsStack>
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
                <Button variant="primary" onClick={() => setCreating(true)}>
                  {t('settings.brands.add')}
                </Button>
              }
            />
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableCaption className="sr-only">
                    {t('settings.ui.brands.listCaption')}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">{t('settings.ui.brands.column.brand')}</TableHead>
                      <TableHead scope="col">{t('settings.ui.brands.column.locales')}</TableHead>
                      <TableHead scope="col">{t('settings.ui.brands.column.accounts')}</TableHead>
                      <TableHead scope="col">{t('settings.ui.brands.column.updated')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((brand) => (
                      <TableRow key={brand.id} selected={brand.id === selectedId}>
                        <TableRowHeader>
                          <button
                            type="button"
                            className="text-text-accent text-start font-medium underline-offset-2 hover:underline"
                            aria-current={brand.id === selectedId ? 'true' : undefined}
                            onClick={() => setSelectedId(brand.id)}
                          >
                            {brand.name}
                          </button>
                        </TableRowHeader>
                        <TableCell>
                          {brand.contentLocales.length === 0
                            ? t('common.notSet')
                            : formatters.list([...brand.contentLocales])}
                        </TableCell>
                        <TableCell numeric>
                          {t('settings.ui.brands.accountCount', {
                            count: brand.connectionCount,
                          })}
                        </TableCell>
                        <TableCell>{formatters.relative(brand.updatedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {selected === null ? null : (
                <BrandEditor
                  key={selected.id}
                  brand={selected}
                  saving={save.isSaving}
                  disabled={false}
                  onSave={(patch) => void save.run({ brandId: selected.id, patch })}
                />
              )}
            </>
          )}
        </AsyncBoundary>
      </SettingsStack>

      <NewBrandDialog
        open={creating}
        onOpenChange={setCreating}
        saving={create.isSaving}
        onSubmit={(input) => void create.run(input)}
      />
    </>
  );
}
