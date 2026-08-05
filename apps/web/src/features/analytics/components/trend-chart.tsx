'use client';

import { useId, useMemo, useState, type PointerEvent, type ReactElement } from 'react';
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
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import type { MetricSeriesView, SeriesPoint } from '../types';
import { useValueFormat } from '../use-value-format';

/**
 * A small time series, drawn once and read immediately.
 *
 * What this chart deliberately does not do:
 *
 * - It does not animate in. A drawn-in line delays reading and implies the data
 *   arrived while you watched, which is false for a metric a provider
 *   aggregated hours ago.
 * - It does not carry a second y axis. Two measures on different scales are two
 *   charts, because a dual axis lets the author choose the crossing point and
 *   therefore choose the conclusion.
 * - It does not interpolate across a gap. A period with no observation is a
 *   break in the line and a note under the chart, never a zero, never a
 *   straight line implying a value we did not collect.
 * - It does not distinguish series by colour alone. The second series is dashed
 *   and both are named in the legend and in the table alternative.
 *
 * Accessibility: the SVG is `role="img"` with a sentence summary, and the same
 * numbers are one button press away as a real table. Hover is an enhancement on
 * top of that, never the only route to a value.
 */

const VIEW_WIDTH = 720;
const VIEW_HEIGHT = 200;
const PADDING_TOP = 12;
const PADDING_BOTTOM = 24;
const PADDING_INLINE = 8;

interface Scale {
  readonly x: (index: number) => number;
  readonly y: (value: number) => number;
  readonly max: number;
}

function buildScale(seriesList: readonly MetricSeriesView[], pointCount: number): Scale {
  const values = seriesList.flatMap((series) =>
    series.points.map((point) => point.value).filter((value): value is number => value !== null),
  );
  const rawMax = values.length > 0 ? Math.max(...values) : 0;
  // A flat zero series still needs a scale that does not divide by zero.
  const max = rawMax > 0 ? rawMax : 1;
  const usableWidth = VIEW_WIDTH - PADDING_INLINE * 2;
  const usableHeight = VIEW_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const step = pointCount > 1 ? usableWidth / (pointCount - 1) : 0;

  return {
    max,
    x: (index) => PADDING_INLINE + step * index,
    y: (value) => PADDING_TOP + usableHeight - (value / max) * usableHeight,
  };
}

/** Split a series into the runs of consecutive observed points. */
function segments(points: readonly SeriesPoint[]): readonly (readonly {
  readonly index: number;
  readonly value: number;
}[])[] {
  const runs: { index: number; value: number }[][] = [];
  let current: { index: number; value: number }[] = [];
  points.forEach((point, index) => {
    if (point.value === null) {
      if (current.length > 0) {
        runs.push(current);
        current = [];
      }
      return;
    }
    current.push({ index, value: point.value });
  });
  if (current.length > 0) {
    runs.push(current);
  }
  return runs;
}

export interface TrendChartProps {
  /** One or two series. A third measure belongs in a second chart. */
  readonly series: readonly MetricSeriesView[];
  /** Already translated heading for the chart. */
  readonly title: string;
  /** Already translated one sentence summary, read by assistive technology. */
  readonly summary: string;
  readonly unit: MetricSeriesView['unit'];
}

export function TrendChart({ series, title, summary, unit }: TrendChartProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();
  const titleId = useId();
  const tableId = useId();
  const [tableVisible, setTableVisible] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const primary = series[0];
  const pointCount = primary?.points.length ?? 0;
  const scale = useMemo(() => buildScale(series, pointCount), [series, pointCount]);

  const hasGap = series.some((entry) => entry.points.some((point) => point.value === null));

  if (!primary || pointCount === 0) {
    return (
      <section aria-labelledby={titleId} className="flex flex-col gap-2">
        <h3 id={titleId} className="text-title-sm text-text-primary">
          {title}
        </h3>
        <p className="text-body-md text-text-secondary">{t('analytics.chart.empty')}</p>
      </section>
    );
  }

  const hovered = hoverIndex === null ? null : (primary.points[hoverIndex] ?? null);

  const handlePointer = (event: PointerEvent<SVGSVGElement>): void => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0) {
      return;
    }
    const ratio = (event.clientX - bounds.left) / bounds.width;
    const viewX = ratio * VIEW_WIDTH;
    const usableWidth = VIEW_WIDTH - PADDING_INLINE * 2;
    const step = pointCount > 1 ? usableWidth / (pointCount - 1) : usableWidth;
    const index = Math.round((viewX - PADDING_INLINE) / (step || 1));
    setHoverIndex(Math.min(pointCount - 1, Math.max(0, index)));
  };

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id={titleId} className="text-title-sm text-text-primary">
          {title}
        </h3>
        <Button
          size="sm"
          variant="ghost"
          aria-expanded={tableVisible}
          aria-controls={tableId}
          onClick={() => setTableVisible((visible) => !visible)}
        >
          {tableVisible ? t('analytics.chart.hideTable') : t('analytics.chart.showTable')}
        </Button>
      </div>

      {series.length > 1 ? (
        <ul
          aria-label={t('analytics.chart.legend')}
          className="flex flex-wrap items-center gap-x-4 gap-y-1"
        >
          {series.map((entry, entryIndex) => (
            <li
              key={entry.id}
              className="text-body-sm text-text-secondary flex items-center gap-1.5"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 8"
                className="h-2 w-6 shrink-0 overflow-visible"
              >
                <line
                  x1="0"
                  y1="4"
                  x2="24"
                  y2="4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  stroke={entryIndex === 0 ? 'var(--accent-default)' : 'var(--text-tertiary)'}
                  strokeDasharray={entryIndex === 0 ? undefined : '5 4'}
                />
              </svg>
              {entry.label}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative">
        <svg
          role="img"
          aria-label={summary}
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-auto w-full touch-none"
          onPointerMove={handlePointer}
          onPointerLeave={() => setHoverIndex(null)}
        >
          {[0, 0.5, 1].map((fraction) => {
            const y = scale.y(scale.max * fraction);
            return (
              <line
                key={fraction}
                x1={PADDING_INLINE}
                x2={VIEW_WIDTH - PADDING_INLINE}
                y1={y}
                y2={y}
                stroke="var(--border-subtle)"
                strokeWidth="1"
              />
            );
          })}

          {hoverIndex !== null ? (
            <line
              x1={scale.x(hoverIndex)}
              x2={scale.x(hoverIndex)}
              y1={PADDING_TOP}
              y2={VIEW_HEIGHT - PADDING_BOTTOM}
              stroke="var(--border-strong)"
              strokeWidth="1"
            />
          ) : null}

          {series.map((entry, entryIndex) => (
            <g key={entry.id}>
              {segments(entry.points).map((run) => (
                <polyline
                  key={`${entry.id}-${String(run[0]?.index ?? 'empty')}`}
                  fill="none"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke={entryIndex === 0 ? 'var(--accent-default)' : 'var(--text-tertiary)'}
                  strokeDasharray={entryIndex === 0 ? undefined : '6 5'}
                  points={run
                    .map((point) => `${scale.x(point.index)},${scale.y(point.value)}`)
                    .join(' ')}
                />
              ))}
              {entry.points.map((point, index) =>
                point.value === null || index !== hoverIndex ? null : (
                  <circle
                    key={`${entry.id}-${point.bucketStart}`}
                    cx={scale.x(index)}
                    cy={scale.y(point.value)}
                    r="4"
                    fill={entryIndex === 0 ? 'var(--accent-default)' : 'var(--text-tertiary)'}
                    stroke="var(--surface-canvas)"
                    strokeWidth="2"
                  />
                ),
              )}
            </g>
          ))}

          {(primary.annotations ?? []).map((annotation) => {
            const index = primary.points.findIndex((point) => point.bucketStart >= annotation.at);
            if (index < 0) {
              return null;
            }
            return (
              <line
                key={annotation.at}
                x1={scale.x(index)}
                x2={scale.x(index)}
                y1={PADDING_TOP}
                y2={VIEW_HEIGHT - PADDING_BOTTOM}
                stroke="var(--status-warning-border)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            );
          })}
        </svg>

        {hovered && hoverIndex !== null ? (
          <p
            className="border-border-default bg-surface-overlay text-body-sm text-text-primary shadow-overlay pointer-events-none absolute z-(--z-index-raised) max-w-[16rem] -translate-x-1/2 rounded-md border px-2 py-1 tabular-nums rtl:translate-x-1/2"
            style={{
              insetBlockStart: 0,
              insetInlineStart: `${(scale.x(hoverIndex) / VIEW_WIDTH) * 100}%`,
            }}
            aria-hidden="true"
          >
            {t('analytics.chart.pointLabel', {
              period: format.dateTime(hovered.bucketStart),
              value:
                hovered.value === null
                  ? t('analytics.chart.gapLabel')
                  : format.valueOf(hovered.value, unit),
            })}
          </p>
        ) : null}
      </div>

      {(primary.annotations ?? []).length > 0 ? (
        <ul className="flex flex-col gap-1">
          {(primary.annotations ?? []).map((annotation) => (
            <li key={annotation.at} className="text-body-sm text-text-secondary">
              <span className="text-text-tertiary">{t('analytics.chart.annotation')}</span>
              <span className="ps-1.5">
                <time dateTime={annotation.at}>{format.date(annotation.at)}</time>
              </span>
              <span className="ps-1.5">{annotation.label}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {hasGap ? (
        <p className="text-body-sm text-text-secondary max-w-[70ch]">
          {t('analytics.chart.gapExplained')}
        </p>
      ) : null}

      <div id={tableId} hidden={!tableVisible}>
        <TableContainer>
          <Table density="compact">
            <TableCaption>{t('analytics.chart.tableCaption')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">{t('analytics.chart.columnPeriod')}</TableHead>
                {series.map((entry) => (
                  <TableHead key={entry.id} scope="col" numeric>
                    {entry.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {primary.points.map((point, index) => (
                <TableRow key={point.bucketStart}>
                  <TableCell>
                    <time dateTime={point.bucketStart}>{format.dateTime(point.bucketStart)}</time>
                  </TableCell>
                  {series.map((entry) => {
                    const value = entry.points[index]?.value ?? null;
                    return (
                      <TableCell key={entry.id} numeric>
                        {value === null
                          ? t('analytics.chart.gapLabel')
                          : format.valueOf(value, unit)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
}
