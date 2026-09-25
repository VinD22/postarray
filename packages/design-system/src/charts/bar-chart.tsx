'use client';

import type { ReactElement } from 'react';

import { cn } from '../utils/cn';
import { BandAxis, YAxis } from './axis';
import { ChartFrame, type ChartMargin } from './chart-frame';
import { ChartTable, type ChartTableRow } from './chart-table';
import { bandScale, linearScale, niceDomain, valueExtent } from './scale';

/**
 * A categorical comparison: one band per category, an optional second series
 * for the period being compared against.
 *
 * The comparison series is an **outlined** bar, not a second fill and not a
 * lighter tint. Two fills at different opacities read as three values wherever
 * they overlap, and a tint puts the series identity back into colour. An
 * outline reads as "the same measurement, earlier" at a glance and survives a
 * greyscale print.
 *
 * A missing reading draws no bar at all. Not a zero-height bar, which is
 * indistinguishable from a real zero, and not a placeholder, which invites the
 * eye to compare it. The word appears in the table instead.
 *
 * No animation. Bars are in their final position in the first frame, in the
 * server HTML, for the same reason the line is.
 */

export interface BarDatum {
  /** Stable key and the categorical x value. */
  readonly id: string;
  /** The category label, already formatted and translated. */
  readonly label: string;
  /** `null` where the provider returned nothing. Never substituted with zero. */
  readonly value: number | null;
  /** The same measurement over the previous period, when comparing. */
  readonly compareValue?: number | null;
}

export interface BarChartMessages {
  readonly caption: string;
  readonly ariaLabel: string;
  readonly viewAsTable: string;
  readonly tableCaption: string;
  readonly xHeader: string;
  readonly unavailable: string;
  readonly gapLegend: string;
  readonly empty: string;
  /** Names the subject series in the legend and the table. */
  readonly seriesLabel: string;
  /** Names the comparison series. Required whenever any `compareValue` is set. */
  readonly compareLabel?: string;
}

export interface BarChartProps {
  readonly data: readonly BarDatum[];
  readonly formatY: (value: number) => string;
  readonly messages: BarChartMessages;
  readonly height?: number;
  readonly margin?: Partial<ChartMargin>;
  readonly className?: string;
}

export function BarChart({
  data,
  formatY,
  messages,
  height = 240,
  margin,
  className,
}: BarChartProps): ReactElement {
  const comparing = data.some((datum) => datum.compareValue !== undefined);
  const compareLabel = messages.compareLabel ?? messages.seriesLabel;

  const extent = valueExtent([
    ...data.map((datum) => datum.value),
    ...data.map((datum) => datum.compareValue ?? null),
  ]);
  const anyGap = data.some(
    (datum) => datum.value === null || (comparing && (datum.compareValue ?? null) === null),
  );

  const seriesLabels = comparing
    ? [messages.seriesLabel, compareLabel]
    : [messages.seriesLabel];

  const tableRows: readonly ChartTableRow[] = data.map((datum) => ({
    id: datum.id,
    x: datum.label,
    values: comparing
      ? [
          datum.value === null ? null : formatY(datum.value),
          (datum.compareValue ?? null) === null
            ? null
            : formatY(datum.compareValue as number),
        ]
      : [datum.value === null ? null : formatY(datum.value)],
  }));

  const table = (
    <ChartTable
      summaryLabel={messages.viewAsTable}
      caption={messages.tableCaption}
      xHeader={messages.xHeader}
      seriesLabels={seriesLabels}
      rows={tableRows}
      unavailableLabel={messages.unavailable}
    />
  );

  if (extent === null || data.length === 0) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <p className="text-body-sm text-text-secondary">{messages.empty}</p>
        {table}
      </div>
    );
  }

  const yDomain = niceDomain(Math.min(0, extent[0]), Math.max(0, extent[1]));

  return (
    <ChartFrame
      className={className}
      height={height}
      {...(margin === undefined ? {} : { margin })}
      ariaLabel={messages.ariaLabel}
      caption={
        <>
          <span>{messages.caption}</span>
          <ul className="text-body-sm text-text-secondary flex flex-wrap gap-x-4 gap-y-1">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="bg-chart-line size-3 shrink-0 rounded-xs" />
              {messages.seriesLabel}
            </li>
            {comparing ? (
              <li className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="border-chart-line-compare size-3 shrink-0 rounded-xs border"
                />
                {compareLabel}
              </li>
            ) : null}
          </ul>
          {anyGap ? <span className="text-text-tertiary">{messages.gapLegend}</span> : null}
        </>
      }
      footer={table}
    >
      {(layout) => {
        const x = bandScale(
          data.map((datum) => datum.id),
          [layout.margin.left, layout.margin.left + layout.innerWidth],
        );
        const y = linearScale(yDomain, [
          layout.margin.top + layout.innerHeight,
          layout.margin.top,
        ]);
        const baseline = y.map(0);
        const subjectWidth = comparing ? x.bandwidth / 2 : x.bandwidth;

        return (
          <>
            <rect
              x={layout.margin.left}
              y={layout.margin.top}
              width={layout.innerWidth}
              height={layout.innerHeight}
              className="fill-chart-area"
            />
            <YAxis
              scale={y}
              format={formatY}
              plotWidth={layout.innerWidth}
              x={layout.margin.left}
              y={0}
            />
            <BandAxis
              scale={x}
              format={(key) => data.find((datum) => datum.id === key)?.label ?? key}
              x={layout.margin.left}
              y={layout.margin.top + layout.innerHeight}
            />
            {data.map((datum) => {
              const start = x.map(datum.id);
              if (start === undefined) return null;
              return (
                <g key={datum.id}>
                  {/* A missing reading draws nothing. See the header comment. */}
                  {datum.value === null ? null : (
                    <rect
                      x={start}
                      y={Math.min(baseline, y.map(datum.value))}
                      width={subjectWidth}
                      height={Math.abs(baseline - y.map(datum.value))}
                      className="fill-chart-line"
                    />
                  )}
                  {comparing && (datum.compareValue ?? null) !== null ? (
                    <rect
                      x={start + subjectWidth}
                      y={Math.min(baseline, y.map(datum.compareValue as number))}
                      width={subjectWidth}
                      height={Math.abs(baseline - y.map(datum.compareValue as number))}
                      fill="none"
                      strokeWidth={1.5}
                      className="stroke-chart-line-compare"
                    />
                  ) : null}
                </g>
              );
            })}
          </>
        );
      }}
    </ChartFrame>
  );
}
