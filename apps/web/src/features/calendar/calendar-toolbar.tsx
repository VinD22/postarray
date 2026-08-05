'use client';

/**
 * The always-visible calendar controls.
 *
 * Two rows on a wide screen and one collapsible sheet below the medium
 * breakpoint. The time zone is never hidden behind a menu: a schedule read in
 * the wrong zone is the single most expensive mistake this screen can cause,
 * so the zone sits next to the range at every width.
 */

import { useId, type ReactNode } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Globe, SlidersHorizontal } from 'lucide-react';
import {
  Badge,
  Button,
  IconButton,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  cn,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { useProviderName } from '@/features/connections/provider';
import { useCalendarFormat } from './format';
import { countActiveFilters } from './filters';
import type {
  CalendarFilterOptions,
  CalendarFilters,
  CalendarView,
  QueueBucket,
} from './types';

const VIEWS: readonly CalendarView[] = ['day', 'week', 'month', 'list'];
const BUCKETS: readonly QueueBucket[] = ['scheduled', 'draft', 'published', 'failed'];

/** Sentinel for "no filter". An empty string is not a valid Select value. */
const ANY = '__any__';

export interface CalendarToolbarProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  rangeLabel: string;
  onStep: (direction: 1 | -1) => void;
  onToday: () => void;
  anchorIso: string;
  onAnchorChange: (isoDate: string) => void;
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  options: CalendarFilterOptions;
  resultCount: number;
  filterSheetOpen: boolean;
  onFilterSheetOpenChange: (open: boolean) => void;
}

export function CalendarToolbar(props: CalendarToolbarProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const dateInputId = useId();
  const activeCount = countActiveFilters(props.filters);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Tabs
          value={props.view}
          onValueChange={(value) => props.onViewChange(value as CalendarView)}
        >
          <TabsList aria-label={t('web.calendar.view.switchLabel')} className="border-b-0">
            {VIEWS.map((view) => (
              <TabsTrigger key={view} value={view}>
                {view === 'list'
                  ? t('web.calendar.view.table')
                  : t(`calendar.view.${view}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1">
          <IconButton
            variant="secondary"
            size="sm"
            label={t('calendar.previousPeriod')}
            icon={<ChevronLeft aria-hidden="true" className="rtl:rotate-180" />}
            onClick={() => props.onStep(-1)}
          />
          <Button variant="secondary" size="sm" onClick={props.onToday}>
            {t('calendar.today')}
          </Button>
          <IconButton
            variant="secondary"
            size="sm"
            label={t('calendar.nextPeriod')}
            icon={<ChevronRight aria-hidden="true" className="rtl:rotate-180" />}
            onClick={() => props.onStep(1)}
          />
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-text-tertiary" />
          <Label htmlFor={dateInputId} className="sr-only">
            {t('calendar.goToDate')}
          </Label>
          <input
            id={dateInputId}
            type="date"
            value={props.anchorIso}
            onChange={(event) => props.onAnchorChange(event.target.value)}
            className={cn(
              'h-8 rounded-md border border-border-strong bg-surface-raised px-2',
              'text-body-md text-text-primary tabular-nums',
              'outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
              'focus-visible:outline-[color:var(--border-focus)]',
            )}
          />
        </div>

        <p className="min-w-0 text-body-md text-text-secondary">
          {t('web.calendar.range.label', {
            range: props.rangeLabel,
            timeZone: format.zoneLabel(),
          })}
        </p>

        <Button
          variant="secondary"
          size="sm"
          className="ms-auto md:hidden"
          iconStart={<SlidersHorizontal aria-hidden="true" className="size-4" />}
          onClick={() => props.onFilterSheetOpenChange(true)}
        >
          {t('action.filter')}
          {activeCount > 0 ? (
            <Badge tone="accent" className="ms-1.5">
              {activeCount}
            </Badge>
          ) : null}
        </Button>
      </div>

      {/* Wide screens keep every filter on the page. */}
      <div
        role="group"
        aria-label={t('web.calendar.filter.regionLabel')}
        className="hidden flex-wrap items-end gap-2 md:flex"
      >
        <FilterFields {...props} />
        <FilterSummary
          activeCount={activeCount}
          resultCount={props.resultCount}
          onClear={() =>
            props.onFiltersChange({
              brandId: null,
              connectionId: null,
              provider: null,
              bucket: null,
              contentLocale: null,
              campaignName: null,
              customerGroupId: null,
              attentionOnly: false,
            })
          }
        />
      </div>

      <p className="flex items-center gap-1.5 text-body-sm text-text-tertiary md:hidden">
        <Globe aria-hidden="true" className="size-3.5" />
        {t('web.calendar.timeZone.workspace', { timeZone: format.zoneLabel() })}
      </p>

      <Sheet open={props.filterSheetOpen} onOpenChange={props.onFilterSheetOpenChange}>
        <SheetContent side="block-end" closeLabel={t('action.close')}>
          <SheetHeader>
            <SheetTitle>{t('web.calendar.filter.regionLabel')}</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <div className="flex flex-col gap-3">
              <FilterFields {...props} stacked />
              <FilterSummary
                activeCount={activeCount}
                resultCount={props.resultCount}
                onClear={() =>
                  props.onFiltersChange({
                    brandId: null,
                    connectionId: null,
                    provider: null,
                    bucket: null,
                    contentLocale: null,
                    campaignName: null,
                    customerGroupId: null,
                    attentionOnly: false,
                  })
                }
              />
            </div>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FilterFields({
  filters,
  onFiltersChange,
  options,
  stacked = false,
}: CalendarToolbarProps & { stacked?: boolean }): ReactNode {
  const t = useTranslations();
  const providerName = useProviderName();

  const width = stacked ? 'w-full' : 'w-[10.5rem]';

  return (
    <>
      {options.brands.length > 0 ? (
        <FilterSelect
          className={width}
          label={t('calendar.filter.brand')}
          anyLabel={t('web.calendar.filter.anyBrand')}
          value={filters.brandId}
          onChange={(value) => onFiltersChange({ ...filters, brandId: value })}
          items={options.brands.map((brand) => ({ value: brand.id, label: brand.name }))}
        />
      ) : null}

      {options.customerGroups.length > 0 ? (
        <FilterSelect
          className={width}
          label={t('web.calendar.filter.group')}
          anyLabel={t('web.calendar.filter.anyGroup')}
          value={filters.customerGroupId}
          onChange={(value) => onFiltersChange({ ...filters, customerGroupId: value })}
          items={options.customerGroups.map((group) => ({
            value: group.id,
            label: group.name,
          }))}
        />
      ) : null}

      <FilterSelect
        className={width}
        label={t('calendar.filter.account')}
        anyLabel={t('web.calendar.filter.anyAccount')}
        value={filters.connectionId}
        onChange={(value) => onFiltersChange({ ...filters, connectionId: value })}
        items={options.connections.map((connection) => ({
          value: connection.id,
          label: connection.label,
          description: providerName(connection.provider),
        }))}
      />

      <FilterSelect
        className={width}
        label={t('calendar.filter.platform')}
        anyLabel={t('web.calendar.filter.anyPlatform')}
        value={filters.provider}
        onChange={(value) =>
          onFiltersChange({
            ...filters,
            provider: value as CalendarFilters['provider'],
          })
        }
        items={options.providers.map((provider) => ({
          value: provider,
          label: providerName(provider),
        }))}
      />

      <FilterSelect
        className={width}
        label={t('calendar.filter.status')}
        anyLabel={t('web.calendar.filter.anyStatus')}
        value={filters.bucket}
        onChange={(value) =>
          onFiltersChange({ ...filters, bucket: value as CalendarFilters['bucket'] })
        }
        items={BUCKETS.map((bucket) => ({
          value: bucket,
          label: t(`web.calendar.bucket.${bucket}`),
        }))}
      />

      <FilterSelect
        className={width}
        label={t('calendar.filter.locale')}
        anyLabel={t('web.calendar.filter.anyLocale')}
        value={filters.contentLocale}
        onChange={(value) => onFiltersChange({ ...filters, contentLocale: value })}
        items={options.locales.map((locale) => ({ value: locale, label: locale }))}
      />

      {options.campaigns.length > 0 ? (
        <FilterSelect
          className={width}
          label={t('calendar.filter.campaign')}
          anyLabel={t('web.calendar.filter.anyCampaign')}
          value={filters.campaignName}
          onChange={(value) => onFiltersChange({ ...filters, campaignName: value })}
          items={options.campaigns.map((campaign) => ({ value: campaign, label: campaign }))}
        />
      ) : null}
    </>
  );
}

interface FilterSelectProps {
  label: string;
  anyLabel: string;
  value: string | null;
  onChange: (value: string | null) => void;
  items: readonly { value: string; label: string; description?: string }[];
  className?: string;
}

function FilterSelect({
  label,
  anyLabel,
  value,
  onChange,
  items,
  className,
}: FilterSelectProps): ReactNode {
  const id = useId();
  return (
    <div className={cn('flex min-w-0 flex-col gap-1', className)}>
      <Label htmlFor={id} className="text-label text-text-tertiary">
        {label}
      </Label>
      <Select
        value={value ?? ANY}
        onValueChange={(next) => onChange(next === ANY ? null : next)}
      >
        <SelectTrigger id={id} size="sm" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{anyLabel}</SelectItem>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              {...(item.description ? { description: item.description } : {})}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FilterSummary({
  activeCount,
  resultCount,
  onClear,
}: {
  activeCount: number;
  resultCount: number;
  onClear: () => void;
}): ReactNode {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-2 pb-0.5">
      <p aria-live="polite" className="text-body-sm text-text-tertiary">
        {t('web.calendar.filter.summary', { count: activeCount, results: resultCount })}
      </p>
      {activeCount > 0 ? (
        <Button variant="ghost" size="sm" onClick={onClear}>
          {t('action.clearFilters')}
        </Button>
      ) : null}
    </div>
  );
}
