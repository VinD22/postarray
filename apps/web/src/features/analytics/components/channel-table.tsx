'use client';

import { useMemo, useState, type ReactElement } from 'react';
import type { NormalizedMetricName } from '@relay/contracts';
import { FreshnessLabel } from '@relay/design-system/patterns';
import {
  StatusDot,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  type TableSortDirection,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import {
  sortChannelRollups,
  type ChannelRollup,
  type ChannelSortKey,
} from '../channels';
import { providerLabelKey } from '../labels';
import { metricLabelKey } from '../metrics';
import type { ChannelRollup as Rollup } from '../channels';
import { useValueFormat } from '../use-value-format';

/**
 * The per-channel rollup, as a table.
 *
 * A table rather than a row of cards, and that is a rule rather than a
 * preference: this is the same four facts repeated per account, read down a
 * column and compared against each other. Cards would put each account in its
 * own box, destroy the column alignment that makes the comparison possible,
 * and cost four times the vertical space to say the same thing.
 *
 * Sorting is a real button in the header with `aria-sort` on the cell, so the
 * state is announced rather than implied by an arrow. Sorting happens here
 * rather than in a query, because every row is already loaded and a round trip
 * to reorder six rows would be slower than the reader's eye.
 *
 * Every cell that could be a number and is not renders the word with the
 * reason beside it. There is no dash anywhere in this table.
 */

export interface ChannelTableProps {
  readonly rollups: readonly ChannelRollup[];
  readonly rankMetric: NormalizedMetricName;
  /** The same rollups over the previous period, when the reader asked to compare. */
  readonly previous?: readonly ChannelRollup[] | undefined;
  readonly comparing: boolean;
}

export function ChannelTable({
  rollups,
  rankMetric,
  previous,
  comparing,
}: ChannelTableProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();
  const [sortKey, setSortKey] = useState<ChannelSortKey>('total');
  const [direction, setDirection] = useState<TableSortDirection>('descending');

  const sorted = useMemo(
    () =>
      sortChannelRollups(
        rollups,
        sortKey,
        direction === 'ascending' ? 'ascending' : 'descending',
      ),
    [rollups, sortKey, direction],
  );

  const previousByConnection = useMemo(
    () => new Map((previous ?? []).map((row) => [row.account.connectionId, row])),
    [previous],
  );

  const metricName = t(metricLabelKey(rankMetric));

  const sortProps = (key: ChannelSortKey, columnLabel: string) => ({
    sortDirection: sortKey === key ? direction : ('none' as TableSortDirection),
    sortLabel: t('analytics.channels.sortBy', { column: columnLabel }),
    onSort: () => {
      if (sortKey === key) {
        setDirection(direction === 'ascending' ? 'descending' : 'ascending');
        return;
      }
      setSortKey(key);
      setDirection('descending');
    },
  });

  const postsLabel = t('analytics.channels.postsMeasured');
  const totalLabel = t('analytics.channels.total', { metric: metricName });
  const unavailableLabel = t('analytics.channels.unavailableCount');
  const accountLabel = t('analytics.table.account');

  return (
    <TableContainer>
      <Table>
        <TableCaption>{t('analytics.channels.title')}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead {...sortProps('account', accountLabel)}>{accountLabel}</TableHead>
            <TableHead numeric {...sortProps('posts', postsLabel)}>
              {postsLabel}
            </TableHead>
            <TableHead numeric {...sortProps('total', totalLabel)}>
              {totalLabel}
            </TableHead>
            <TableHead numeric {...sortProps('unavailable', unavailableLabel)}>
              {unavailableLabel}
            </TableHead>
            <TableHead>{t('analytics.channels.freshness')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <ChannelRow
              key={row.account.connectionId}
              row={row}
              metricName={metricName}
              comparing={comparing}
              previous={previousByConnection.get(row.account.connectionId) ?? null}
              formatCount={format.count}
              formatRelative={format.relative}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ChannelRow({
  row,
  metricName,
  comparing,
  previous,
  formatCount,
  formatRelative,
}: {
  readonly row: Rollup;
  readonly metricName: string;
  readonly comparing: boolean;
  readonly previous: Rollup | null;
  readonly formatCount: (value: number) => string;
  readonly formatRelative: (iso: string) => string;
}): ReactElement {
  const t = useTranslations();

  return (
    <TableRow>
      <TableRowHeader>
        <span className="flex min-w-0 items-center gap-2">
          <StatusDot provider={row.account.provider} />
          <span className="truncate">{row.account.displayName}</span>
          <span className="text-text-tertiary">{t(providerLabelKey(row.account.provider))}</span>
        </span>
      </TableRowHeader>

      <TableCell numeric>{formatCount(row.postsMeasured)}</TableCell>

      <TableCell numeric>
        {row.total === null ? (
          <span className="flex flex-col items-end gap-0.5">
            <span className="text-text-secondary">{t('analytics.value.unavailable')}</span>
            {row.addable ? null : (
              <span className="text-body-sm text-text-tertiary text-end">
                {t('analytics.channels.notAddable', { metric: metricName })}
              </span>
            )}
          </span>
        ) : (
          <span className="flex flex-col items-end gap-0.5">
            <span>{formatCount(row.total)}</span>
            {/*
              The comparison, in words, with both numbers present. A bare
              percentage would hide the sample it rests on, and "up 300%" from
              one post to four is not the sentence a reader should take away.
            */}
            {comparing ? (
              <span className="text-body-sm text-text-tertiary text-end">
                {previous === null || previous.total === null
                  ? t('analytics.compare.noPrevious')
                  : t('analytics.compare.delta', {
                      current: formatCount(row.total),
                      previous: formatCount(previous.total),
                    })}
              </span>
            ) : null}
          </span>
        )}
      </TableCell>

      <TableCell numeric>{formatCount(row.unavailableCount)}</TableCell>

      <TableCell>
        {row.freshness === null || row.freshness.lastSuccessAt === null ? (
          <FreshnessLabel level="never" text={t('analytics.freshness.never')} />
        ) : (
          <FreshnessLabel
            level={row.freshness.state}
            isoTimestamp={row.freshness.lastSuccessAt}
            text={t('analytics.freshness.synced', {
              relativeTime: formatRelative(row.freshness.lastSuccessAt),
            })}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
