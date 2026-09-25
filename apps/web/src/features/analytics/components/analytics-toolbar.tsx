'use client';

import { useId, type ReactElement } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Button,
  Checkbox,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SegmentedControl,
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
  readonly projectId: string | null;
  readonly connectionIds: readonly string[];
  readonly range: AnalyticsRange;
  readonly rankMetric: NormalizedMetricName;
  readonly format: ContentKind | null;
  readonly comparePrevious: boolean;
}

export interface AnalyticsToolbarProps {
  readonly filters: AnalyticsFilters;
  readonly projects: readonly { readonly id: string; readonly name: string }[];
  readonly accounts: readonly AccountRef[];
  readonly formats: readonly ContentKind[];
  readonly onChange: (filters: AnalyticsFilters) => void;
}

const RANGE_PRESETS: readonly AnalyticsRange['preset'][] = ['7d', '30d', '90d', 'custom'];

function rangeLabelKey(preset: AnalyticsRange['preset']): string {
  return preset === 'custom' ? 'analytics.range.custom' : `analytics.range.${preset}`;
}

export function presetToRange(preset: AnalyticsRange['preset'], now: Date): AnalyticsRange {
  const days = preset === '7d' ? 7 : preset === '90d' ? 90 : 30;
  const end = now.toISOString();
  const start = new Date(now.getTime() - days * 86_400_000).toISOString();
  return { preset, start, end };
}

/** The `YYYY-MM-DD` a date input wants, taken in UTC. */
function toDateInput(iso: string): string {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? '' : (parsed.toISOString().slice(0, 10) as string);
}

/**
 * A date input's value as an instant.
 *
 * `edge` decides which end of the day it lands on, so a custom range that
 * reads "1 March to 7 March" includes all of the seventh rather than stopping
 * at its first second. UTC throughout: the window is the provider's, and
 * recomputing it in the browser's zone is how a day goes missing from a report
 * for a reader in Auckland.
 */
function fromDateInput(value: string, edge: 'start' | 'end'): string | null {
  if (value === '') return null;
  const parsed = new Date(`${value}T${edge === 'start' ? '00:00:00.000' : '23:59:59.999'}Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function AnalyticsToolbar({
  filters,
  projects,
  accounts,
  formats,
  onChange,
}: AnalyticsToolbarProps): ReactElement {
  const t = useTranslations();
  const projectId = useId();
  const rangeId = useId();
  const metricId = useId();
  const formatId = useId();
  const compareId = useId();
  const customFromId = useId();
  const customToId = useId();

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
          <Label htmlFor={projectId}>{t('analytics.filter.project')}</Label>
          <Select
            value={filters.projectId ?? 'all'}
            onValueChange={(value) =>
              onChange({ ...filters, projectId: value === 'all' ? null : value })
            }
          >
            <SelectTrigger id={projectId} size="sm" className="min-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('shell.project.all')}</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-label text-text-tertiary">{t('analytics.filter.accounts')}</span>
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
                <legend className="text-label text-text-tertiary pb-1">
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
                        <span className="text-text-tertiary ps-1.5">
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
          <span id={rangeId} className="text-label text-text-tertiary">
            {t('analytics.filter.range')}
          </span>
          {/*
            A segmented control rather than a select: four choices, all short,
            all worth seeing at once, and the one a reader wants is one press
            rather than open-scan-press. Custom keeps the last computed range
            as its starting point so switching to it never blanks the screen.
          */}
          <SegmentedControl
            aria-label={t('analytics.filter.range')}
            size="sm"
            value={filters.range.preset}
            items={RANGE_PRESETS.map((preset) => ({
              value: preset,
              label: t(rangeLabelKey(preset)),
            }))}
            onValueChange={(value) => {
              const preset = value as AnalyticsRange['preset'];
              onChange({
                ...filters,
                range:
                  preset === 'custom'
                    ? { ...filters.range, preset: 'custom' }
                    : presetToRange(preset, new Date()),
              });
            }}
          />
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

        {filters.range.preset === 'custom' ? (
          // TODO(web): depends on design-system DateTimeField (FE B9). Two
          // native date inputs until it lands: they are keyboard operable,
          // localized by the platform and already understood by every
          // assistive technology, which is more than a hand-rolled picker
          // would be on the day it shipped.
          <>
            <div className="flex flex-col gap-1">
              <Label htmlFor={customFromId}>{t('analytics.filter.customFrom')}</Label>
              <Input
                id={customFromId}
                type="date"
                size="sm"
                className="w-40"
                value={toDateInput(filters.range.start)}
                max={toDateInput(filters.range.end)}
                onChange={(event) => {
                  const start = fromDateInput(event.target.value, 'start');
                  if (start === null) return;
                  onChange({ ...filters, range: { ...filters.range, preset: 'custom', start } });
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor={customToId}>{t('analytics.filter.customTo')}</Label>
              <Input
                id={customToId}
                type="date"
                size="sm"
                className="w-40"
                value={toDateInput(filters.range.end)}
                min={toDateInput(filters.range.start)}
                onChange={(event) => {
                  const end = fromDateInput(event.target.value, 'end');
                  if (end === null) return;
                  onChange({ ...filters, range: { ...filters.range, preset: 'custom', end } });
                }}
              />
            </div>
          </>
        ) : null}

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
        <p className="text-body-sm text-text-tertiary max-w-[70ch]">
          {t('analytics.rankMetric.help')}
        </p>
      </div>
    </div>
  );
}
