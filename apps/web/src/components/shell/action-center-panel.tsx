'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useState } from 'react';

import {
  Button,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

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
 * The Action center, opened from the shell.
 *
 * The count on the trigger is the number of unsnoozed items, and it is stated
 * in words for a screen reader rather than being left as a bare number floating
 * next to a bell.
 */
export function ActionCenterPanel() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | ActionItemCategory>('all');

  const query = useActionCenter(filter === 'all' ? {} : { category: filter });
  const items = query.data?.data ?? [];
  const count = items.length;
  const hasNow = items.some((item) => item.urgency === 'now');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={t('shell.actionCenter.count', { count })}
        className={cn(
          'relative flex size-11 items-center justify-center rounded-md md:size-9',
          'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
          'transition-colors duration-(--duration-fast)',
        )}
      >
        <Bell aria-hidden="true" className="size-4" />
        {count > 0 ? (
          <span
            aria-hidden="true"
            data-numeric
            className={cn(
              'absolute top-1 end-1 min-w-4 rounded-full px-1',
              'text-label leading-4 font-semibold',
              hasNow
                ? 'bg-destructive-solid text-destructive-on'
                : 'bg-surface-inverted text-text-inverted',
            )}
          >
            {count > 9 ? '9+' : count}
          </span>
        ) : null}
      </SheetTrigger>

      <SheetContent side="inline-end" closeLabel={t('a11y.label.closeDialog')}>
        <SheetHeader>
          <SheetTitle>{t('actionCenter.title')}</SheetTitle>
          <SheetDescription>{t('actionCenter.description')}</SheetDescription>
        </SheetHeader>

        <SheetBody>
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

          <div className="pt-4">
            <ActionCenterList
              items={items}
              loading={query.isPending}
              error={ApiError.is(query.error) ? query.error : null}
              onRetry={() => {
                void query.refetch();
              }}
            />
          </div>
        </SheetBody>

        <SheetFooter>
          <Button
            variant="secondary"
            asChild
            onClick={() => {
              setOpen(false);
            }}
          >
            <Link href="/action-center">{t('action.viewAll')}</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
