'use client';

import Link from 'next/link';
import { useState } from 'react';

import { PageHeader } from '@relay/design-system/patterns';
import {
  Button,
  Switch,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';

import { ApiError, type ActionItemCategory } from '@/lib/api';
import { useActionCenter } from '@/lib/api/hooks';
import { useTranslations } from '@/lib/i18n';

import { ActionCenterList } from './action-center-list';

const FILTERS: readonly { id: 'all' | ActionItemCategory; labelKey: string }[] = [
  { id: 'all', labelKey: 'actionCenter.filter.all' },
  { id: 'connections', labelKey: 'actionCenter.filter.connections' },
  { id: 'publishing', labelKey: 'actionCenter.filter.publishing' },
  { id: 'automation', labelKey: 'actionCenter.filter.automation' },
  { id: 'billing', labelKey: 'actionCenter.filter.billing' },
];

/**
 * The full Action center.
 *
 * The same queue the shell panel shows, with room for the snoozed items and
 * the category filter. One list, grouped by urgency, every row ending in one
 * named verb.
 */
export function ActionCenterScreen() {
  const t = useTranslations();
  const [filter, setFilter] = useState<'all' | ActionItemCategory>('all');
  const [includeSnoozed, setIncludeSnoozed] = useState(false);

  const query = useActionCenter({
    ...(filter === 'all' ? {} : { category: filter }),
    includeSnoozed,
  });
  const items = query.data?.data ?? [];

  return (
    <>
      <PageHeader
        title={t('actionCenter.title')}
        description={t('actionCenter.description')}
        toolbar={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              value={filter}
              onValueChange={(next) => {
                setFilter(next as 'all' | ActionItemCategory);
              }}
            >
              <TabsList aria-label={t('action.filter')}>
                {FILTERS.map((entry) => (
                  <TabsTrigger key={entry.id} value={entry.id}>
                    {t(entry.labelKey)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Switch
                id="include-snoozed"
                checked={includeSnoozed}
                onCheckedChange={setIncludeSnoozed}
              />
              <Label htmlFor="include-snoozed" className="text-body-sm text-text-secondary">
                {t('actionCenter.snoozed')}
              </Label>
            </div>
          </div>
        }
      />

      <div className="px-4 py-5 md:px-6 2xl:mx-auto 2xl:max-w-[85rem] 3xl:max-w-[90rem]">
        <ActionCenterList
          items={items}
          loading={query.isPending}
          error={ApiError.is(query.error) ? query.error : null}
          onRetry={() => {
            void query.refetch();
          }}
          emptyAction={
            <Button variant="secondary" asChild>
              <Link href="/">{t('nav.home')}</Link>
            </Button>
          }
        />
      </div>
    </>
  );
}
