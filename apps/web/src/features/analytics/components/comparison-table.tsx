'use client';

import { Fragment, useState, type ReactElement } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useBreakpoint } from '@relay/design-system/hooks';
import {
  Button,
  StatusDot,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { formatLabelKey, providerLabelKey } from '../labels';
import type { PostComparisonRow } from '../types';
import { useValueFormat } from '../use-value-format';
import { BaselineDelta } from './baseline-delta';
import { EvidencePanel } from './evidence-panel';
import { MetricCell } from './metric-cell';

/**
 * The answer to "which posts moved away from my own baseline".
 *
 * The table is the whole screen's argument, so the row is designed around what
 * makes a comparison believable rather than around what fits: the post, the
 * account it went to, the value, the movement, the sample it was measured
 * against, and a disclosure holding the posts that formed the baseline.
 *
 * Below the `md` breakpoint the same rows render as a list with the same
 * disclosure. That is not a squeezed table: the column headings become inline
 * labels and the row keeps its full meaning, because a reviewer reading this on
 * a phone needs the sample size as much as a reviewer at a desk.
 *
 * There is no horizontal page scroll at any width. The table scrolls inside its
 * own container, and below `md` there is no table to scroll.
 */

export interface ComparisonTableProps {
  readonly rows: readonly PostComparisonRow[];
  /** Already translated name of the metric the table is ranked by. */
  readonly metricName: string;
  readonly onOpenPost?: (contentItemId: string) => void;
}

export function ComparisonTable({
  rows,
  metricName,
  onOpenPost,
}: ComparisonTableProps): ReactElement {
  const t = useTranslations();
  const valueFormat = useValueFormat();
  const isWide = useBreakpoint('md');
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string): void =>
    setExpanded((current) => (current === id ? null : id));

  if (!isWide) {
    return (
      <ul className="flex flex-col border-t border-border-subtle">
        {rows.map((row) => (
          <li key={row.contentItemId} className="border-b border-border-subtle py-3">
            <MobileRow
              row={row}
              expanded={expanded === row.contentItemId}
              onToggle={() => toggle(row.contentItemId)}
              onOpenPost={onOpenPost}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <TableContainer>
      <Table density="compact">
        <TableCaption>{t('analytics.table.caption')}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">{t('analytics.table.post')}</TableHead>
            <TableHead scope="col">{t('analytics.table.account')}</TableHead>
            <TableHead scope="col">{t('analytics.table.format')}</TableHead>
            <TableHead scope="col" numeric>
              {metricName}
            </TableHead>
            <TableHead scope="col">{t('analytics.table.delta')}</TableHead>
            <TableHead scope="col">
              <span className="sr-only">{t('analytics.table.evidence')}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const isExpanded = expanded === row.contentItemId;
            const panelId = `evidence-${row.contentItemId}`;
            return (
              <Fragment key={row.contentItemId}>
                <TableRow>
                  <TableCell>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      {onOpenPost ? (
                        <button
                          type="button"
                          className="text-start text-body-md text-text-primary underline-offset-2 hover:underline"
                          onClick={() => onOpenPost(row.contentItemId)}
                        >
                          {row.title}
                        </button>
                      ) : (
                        <span className="text-body-md text-text-primary">{row.title}</span>
                      )}
                      <time
                        dateTime={row.publishedAt}
                        className="text-body-sm text-text-tertiary tabular-nums"
                      >
                        {valueFormat.date(row.publishedAt)}
                      </time>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <StatusDot provider={row.account.provider} />
                      <span className="min-w-0">
                        <span className="block text-body-md text-text-primary">
                          {row.account.displayName}
                        </span>
                        <span className="block text-body-sm text-text-tertiary">
                          {t(providerLabelKey(row.account.provider))}
                        </span>
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>{t(formatLabelKey(row.format))}</TableCell>
                  <TableCell numeric>
                    <MetricCell reading={row.reading} />
                  </TableCell>
                  <TableCell>
                    <BaselineDelta baseline={row.baseline} />
                  </TableCell>
                  <TableCell>
                    {row.baseline ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        iconStart={
                          isExpanded ? (
                            <ChevronDown aria-hidden="true" className="size-4" />
                          ) : (
                            <ChevronRight aria-hidden="true" className="size-4" />
                          )
                        }
                        onClick={() => toggle(row.contentItemId)}
                      >
                        {t('analytics.table.evidence')}
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
                {isExpanded && row.baseline ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <div id={panelId}>
                        <EvidencePanel row={row} baseline={row.baseline} />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

interface MobileRowProps {
  readonly row: PostComparisonRow;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly onOpenPost?: ((contentItemId: string) => void) | undefined;
}

function MobileRow({
  row,
  expanded,
  onToggle,
  onOpenPost,
}: MobileRowProps): ReactElement {
  const t = useTranslations();
  const valueFormat = useValueFormat();
  const panelId = `evidence-mobile-${row.contentItemId}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        {onOpenPost ? (
          <button
            type="button"
            className="min-h-11 text-start text-body-lg text-text-primary underline-offset-2 hover:underline"
            onClick={() => onOpenPost(row.contentItemId)}
          >
            {row.title}
          </button>
        ) : (
          <p className="text-body-lg text-text-primary">{row.title}</p>
        )}
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-body-sm text-text-tertiary">
          <StatusDot provider={row.account.provider} />
          <span>{row.account.displayName}</span>
          <span>{t(formatLabelKey(row.format))}</span>
          <time dateTime={row.publishedAt} className="tabular-nums">
            {valueFormat.date(row.publishedAt)}
          </time>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <MetricCell reading={row.reading} showLabel />
        <BaselineDelta baseline={row.baseline} />
      </div>

      {row.baseline ? (
        <>
          <Button
            size="sm"
            variant="secondary"
            className="self-start"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={onToggle}
          >
            {t('analytics.table.evidence')}
          </Button>
          {expanded ? (
            <div id={panelId} className="-mx-4">
              <EvidencePanel row={row} baseline={row.baseline} />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
