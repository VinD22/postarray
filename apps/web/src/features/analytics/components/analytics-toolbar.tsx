'use client';

import { useId, type ReactElement } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Button,
  Checkbox,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import type { ContentKind, NormalizedMetricName } from '@relay/contracts';

import { formatLabelKey, providerLabelKey } from '../labels';
import { RANKABLE_METRICS, metricLabelKey } from '../metrics';
import type { AccountRef, AnalyticsRange } from '../types';

/**
 * The filters above the analytics table.
 *
 * The rank metric control is the important one. There is no combined score in
 * this product, so the reader has to pick the one metric the table is ordered
 * by, and the help text under the control says exactly that. The chosen metric
 * then names itself in the table header, so a screenshot of the table is never
 * ambiguous about what it ranked.
 *
 * Everything here is a real form control with a real label. The account filter
 * is a popover of checkboxes rather than a multi select, because a multi select
 * is the control people most often cannot operate with a keyboard.
 */

export interface AnalyticsFilters {
  readonly brandId: string | null;
  readonly connectionIds: readonly string[];
  readonly range: AnalyticsRange;
  readonly rankMetric: NormalizedMetricName;
  readonly format: ContentKind | null;
  readonly comparePrevious: boolean;
}

export interface AnalyticsToolbarProps {
  readonly filters: AnalyticsFilters;
  readonly brands: readonly { readonly id: string; readonly name: string }[];
  readonly accounts: readonly AccountRef[];
  readonly formats: readonly ContentKind[];
  readonly onChange: (filters: AnalyticsFilters) => void;
}

const RANGE_PRESETS: readonly AnalyticsRange['preset'][] = ['7d', '30d', '90d'];

function rangeLabelKey(preset: AnalyticsRange['preset']): string {
  return preset === 'custom' ? 'analytics.range.custom' : `analytics.range.${preset}`;
}

function presetToRange(preset: AnalyticsRange['preset'], now: Date): AnalyticsRange {
  const days = preset === '7d' ? 7 : preset === '90d' ? 90 : 30;
  const end = now.toISOString();
  const start = new Date(now.getTime() - days * 86_400_000).toISOString();
  return { preset, start, end };
}

export function AnalyticsToolbar({
  filters,
  brands,
  accounts,
  formats,
  onChange,
}: AnalyticsToolbarProps): ReactElement {
  const t = useTranslations();
  const brandId = useId();
  const rangeId = useId();
  const metricId = useId();
  const formatId = useId();
  const compareId = useId();

  const selectedAccounts = accounts.filter((account) =>
    filters.connectionIds.includes(account.connectionId),
  );

  const toggleAccount = (connectionId: string): void => {
    const next = filters.connectionIds.includes(connectionId)
      ? filters.connectionIds.filter((id) => id !== connectionId)
      : [...filters.connectionIds, connectionId];
    onChange({ ...filters, connectionIds: next });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor={brandId}>{t('analytics.filter.brand')}</Label>
          <Select
            value={filters.brandId ?? 'all'}
            onValueChange={(value) =>
              onChange({ ...filters, brandId: value === 'all' ? null : value })
            }
          >
            <SelectTrigger id={brandId} size="sm" className="min-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('shell.brand.all')}</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-label text-text-tertiary">
            {t('analytics.filter.accounts')}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="min-w-40 justify-between"
                iconEnd={<ChevronDown aria-hidden="true" className="size-4" />}
              >
                {selectedAccounts.length === 0
                  ? t('analytics.filter.allAccounts')
                  : t('common.selected', { count: selectedAccounts.length })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[min(20rem,calc(100vw-2rem))]">
              <fieldset className="flex flex-col gap-2">
                <legend className="pb-1 text-label text-text-tertiary">
                  {t('analytics.filter.accounts')}
                </legend>
                {accounts.map((account) => {
                  const id = `account-${account.connectionId}`;
                  return (
                    <div key={account.connectionId} className="flex items-center gap-2">
                      <Checkbox
                        id={id}
                        checked={filters.connectionIds.includes(account.connectionId)}
                        onCheckedChange={() => toggleAccount(account.connectionId)}
                      />
                      <Label htmlFor={id} className="text-body-md">
                        {account.displayName}
                        <span className="ps-1.5 text-text-tertiary">
                          {t(providerLabelKey(account.provider))}
                        </span>
                      </Label>
                    </div>
                  );
                })}
              </fieldset>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor={rangeId}>{t('analytics.filter.range')}</Label>
          <Select
            value={filters.range.preset}
            onValueChange={(value) =>
              onChange({
                ...filters,
                range: presetToRange(value as AnalyticsRange['preset'], new Date()),
              })
            }
          >
            <SelectTrigger id={rangeId} size="sm" className="min-w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGE_PRESETS.map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {t(rangeLabelKey(preset))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor={formatId}>{t('analytics.filter.format')}</Label>
          <Select
            value={filters.format ?? 'all'}
            onValueChange={(value) =>
              onChange({
                ...filters,
                format: value === 'all' ? null : (value as ContentKind),
              })
            }
          >
            <SelectTrigger id={formatId} size="sm" className="min-w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('analytics.filter.allFormats')}</SelectItem>
              {formats.map((kind) => (
                <SelectItem key={kind} value={kind}>
                  {t(formatLabelKey(kind))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 pb-1">
          <Checkbox
            id={compareId}
            checked={filters.comparePrevious}
            onCheckedChange={(checked) =>
              onChange({ ...filters, comparePrevious: checked === true })
            }
          />
          <Label htmlFor={compareId}>{t('analytics.filter.comparePrevious')}</Label>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={metricId}>{t('analytics.rankMetric.label')}</Label>
        <Select
          value={filters.rankMetric}
          onValueChange={(value) =>
            onChange({ ...filters, rankMetric: value as NormalizedMetricName })
          }
        >
          <SelectTrigger id={metricId} size="sm" className="min-w-56 sm:max-w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANKABLE_METRICS.map((metric) => (
              <SelectItem key={metric} value={metric}>
                {t(metricLabelKey(metric))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="max-w-[70ch] text-body-sm text-text-tertiary">
          {t('analytics.rankMetric.help')}
        </p>
      </div>
    </div>
  );
}
