'use client';

import { useMemo, type ReactElement } from 'react';

import { cn } from '../utils/cn';
import { XAxis, YAxis } from './axis';
import { ChartFrame, type ChartMargin } from './chart-frame';
import { ChartPoints, type ChartHitPoint } from './chart-tooltip';
import { ChartTable, type ChartTableRow } from './chart-table';
import { hasGap, linePath, type PathPoint } from './path';
import { linearScale, niceDomain, timeScale, valueExtent } from './scale';

/**
 * A time series, read immediately.
 *
 * What it deliberately does not do:
 *
 * - **No draw-in and no transition on `d`.** The README bans any animation
 *   that delays a number a reader is waiting for, and a stroke that grows over
 *   half a second is precisely that. The line is complete in the first frame,
 *   in server HTML, before hydration. `charts.test.tsx` fails if `animate` or
 *   `transition` ever appears on a path in this package.
 * - **No second y axis.** Two measures on different scales are two charts. A
 *   dual axis lets whoever drew it choose where the lines cross, and therefore
 *   choose the conclusion.
 * - **No interpolation across a gap.** See `path.ts`. When any point is
 *   missing, the caption carries the sentence saying so.
 * - **No colour-coded series.** Both strokes are chart ink; the comparison
 *   series is dashed and both are named in the legend and in the table.
 *
 * Every string is a required prop. This package holds no copy.
 */

/** One reading. `v` is null where the provider returned nothing. */
export interface SeriesPoint {
  /** ISO instant. */
  readonly t: string;
  readonly v: number | null;
}

export interface Series {
  readonly id: string;
  readonly label: string;
  readonly points: readonly SeriesPoint[];
  /** Solid is the subject; dashed is the comparison. Never hue. */
  readonly dash?: 'solid' | 'dashed';
}

export interface LineChartMessages {
  /** The sentence under the chart saying what it shows. */
  readonly caption: string;
  /** What a reader who cannot see the chart is told, as one sentence. */
  readonly ariaLabel: string;
  readonly viewAsTable: string;
  readonly tableCaption: string;
  readonly xHeader: string;
  /** The word for a reading the provider did not return. Never a dash. */
  readonly unavailable: string;
  /** "Gaps mean the provider reported nothing." Shown only when one exists. */
  readonly gapLegend: string;
  /** Names the keyboard-reachable point group. */
  readonly pointsLabel: string;
  /** Shown instead of the chart when no series has a single reading. */
  readonly empty: string;
}

export interface LineChartProps {
  /** Two is the readable maximum. Four is the hard cap, enforced here. */
  readonly series: readonly Series[];
  readonly formatX: (iso: string) => string;
  readonly formatY: (value: number) => string;
  readonly messages: LineChartMessages;
  readonly height?: number;
  readonly margin?: Partial<ChartMargin>;
  readonly className?: string;
}

/** Four series in one frame is already too many; more is unreadable. */
const MAX_SERIES = 4;

const DASH_ARRAY: Readonly<Record<number, string | undefined>> = {
  0: undefined,
  1: '6 4',
  2: '2 3',
  3: '8 3 2 3',
};

export function LineChart({
  series,
  formatX,
  formatY,
  messages,
  height = 240,
  margin,
  className,
}: LineChartProps): ReactElement {
  const drawn = series.slice(0, MAX_SERIES);

  /** Every timestamp any series mentions, ascending, deduplicated. */
  const times = useMemo(() => {
    const set = new Set<number>();
    for (const one of drawn) {
      for (const point of one.points) {
        const value = Date.parse(point.t);
        if (Number.isFinite(value)) set.add(value);
      }
    }
    return [...set].sort((a, b) => a - b);
  }, [drawn]);

  const allValues = drawn.flatMap((one) => one.points.map((point) => point.v));
  const extent = valueExtent(allValues);
  const anyGap = drawn.some((one) =>
    hasGap(one.points.map((point) => ({ x: 0, y: point.v }))),
  );

  const tableRows: readonly ChartTableRow[] = times.map((time) => {
    const iso = new Date(time).toISOString();
    return {
      id: iso,
      x: formatX(iso),
      values: drawn.map((one) => {
        const found = one.points.find((point) => Date.parse(point.t) === time);
        return found === undefined || found.v === null ? null : formatY(found.v);
      }),
    };
  });

  const table = (
    <ChartTable
      summaryLabel={messages.viewAsTable}
      caption={messages.tableCaption}
      xHeader={messages.xHeader}
      seriesLabels={drawn.map((one) => one.label)}
      rows={tableRows}
      unavailableLabel={messages.unavailable}
    />
  );

  // Nothing to plot. The table still renders: "we asked and got nothing back"
  // is itself a fact, and an axis drawn over no data would imply a zero line.
  if (extent === null || times.length === 0) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <p className="text-body-sm text-text-secondary">{messages.empty}</p>
        {table}
      </div>
    );
  }

  // The y axis always includes zero. A chart cropped to the top of its own
  // range turns a two percent move into a cliff, which is the oldest way to
  // mislead with a true number.
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
          <Legend series={drawn} />
          {anyGap ? <span className="text-text-tertiary">{messages.gapLegend}</span> : null}
        </>
      }
      footer={table}
      overlay={(layout) => {
        const x = timeScale(
          [times[0] as number, times[times.length - 1] as number],
          [layout.margin.left, layout.margin.left + layout.innerWidth],
        );
        const y = linearScale(yDomain, [
          layout.margin.top + layout.innerHeight,
          layout.margin.top,
        ]);
        // The overlay tracks the first series, which is the subject. Points
        // from a comparison series are in the table, where they belong: two
        // overlapping hit-target columns would fight for the same keystroke.
        const subject = drawn[0];
        if (subject === undefined) return null;

        const points: ChartHitPoint[] = subject.points.map((point) => {
          const time = Date.parse(point.t);
          return {
            id: point.t,
            xPercent: (x.map(time) / layout.width) * 100,
            yPercent: point.v === null ? null : (y.map(point.v) / layout.height) * 100,
            label: `${formatX(point.t)}, ${subject.label}: ${
              point.v === null ? messages.unavailable : formatY(point.v)
            }`,
          };
        });

        return <ChartPoints points={points} groupLabel={messages.pointsLabel} />;
      }}
    >
      {(layout) => {
        const x = timeScale(
          [times[0] as number, times[times.length - 1] as number],
          [layout.margin.left, layout.margin.left + layout.innerWidth],
        );
        const y = linearScale(yDomain, [
          layout.margin.top + layout.innerHeight,
          layout.margin.top,
        ]);

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
            <XAxis
              scale={x}
              format={(value) => formatX(new Date(value).toISOString())}
              plotHeight={layout.innerHeight}
              x={layout.margin.left}
              y={layout.margin.top + layout.innerHeight}
            />
            {drawn.map((one, index) => {
              const path: PathPoint[] = one.points.map((point) => ({
                x: x.map(Date.parse(point.t)),
                y: point.v === null ? null : y.map(point.v),
              }));
              const dash =
                one.dash === 'dashed' ? (DASH_ARRAY[1] as string) : DASH_ARRAY[index];
              return (
                <path
                  key={one.id}
                  d={linePath(path)}
                  fill="none"
                  strokeWidth={index === 0 ? 2 : 1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...(dash === undefined ? {} : { strokeDasharray: dash })}
                  className={index === 0 ? 'stroke-chart-line' : 'stroke-chart-line-compare'}
                />
              );
            })}
          </>
        );
      }}
    </ChartFrame>
  );
}

/**
 * The legend, as text.
 *
 * A swatch alone would put the series identity back into colour. Each entry
 * shows the dash pattern the line is actually drawn with, next to its name, so
 * the mapping survives greyscale and colour blindness.
 */
function Legend({ series }: { readonly series: readonly Series[] }): ReactElement {
  return (
    <ul className="text-body-sm text-text-secondary flex flex-wrap gap-x-4 gap-y-1">
      {series.map((one, index) => (
        <li key={one.id} className="flex items-center gap-2">
          <svg aria-hidden="true" width={20} height={8} viewBox="0 0 20 8" className="shrink-0">
            <line
              x1={0}
              y1={4}
              x2={20}
              y2={4}
              strokeWidth={2}
              {...(one.dash === 'dashed'
                ? { strokeDasharray: DASH_ARRAY[1] }
                : DASH_ARRAY[index] === undefined
                  ? {}
                  : { strokeDasharray: DASH_ARRAY[index] })}
              className={index === 0 ? 'stroke-chart-line' : 'stroke-chart-line-compare'}
            />
          </svg>
          {one.label}
        </li>
      ))}
    </ul>
  );
}
