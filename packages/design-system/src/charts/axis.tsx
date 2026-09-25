import type { ReactElement } from 'react';

import type { BandScale, NumericScale } from './scale';

/**
 * Axes with real ticks and real tick labels.
 *
 * The chart this kit replaces had two gridlines, no axis and no labels, which
 * means it had no scale: a reader could see that a line went up and could not
 * see what it went up to. An axis is not decoration on a chart, it is the half
 * of the chart that makes the other half mean something.
 *
 * Formatting is entirely the caller's. `Intl` lives in the app, next to the
 * locale and the workspace time zone, and this package holds no copy and no
 * locale data. A `format` prop is required for the same reason a caption is:
 * an optional formatter defaults to `String(1699920000000)`.
 *
 * These render inside an `svg role="img"`, so their text is presentational to
 * a screen reader by design. The route to the numbers is the table fallback,
 * never a tick a reader would have to trace with a cursor.
 */

const TICK_LENGTH = 4;
const TICK_LABEL_GAP = 6;

export interface XAxisProps {
  readonly scale: NumericScale;
  /** Defaults to the scale's own rounded ticks. */
  readonly ticks?: readonly number[];
  readonly format: (value: number) => string;
  /** Distance from the axis up to the top of the plot, for the gridlines. */
  readonly plotHeight: number;
  /** Where the axis sits, in chart coordinates. */
  readonly x: number;
  readonly y: number;
  /** Vertical gridlines are noise on a dense time series, so they are opt-in. */
  readonly gridlines?: boolean;
  readonly maxTicks?: number;
}

export function XAxis({
  scale,
  ticks,
  format,
  plotHeight,
  x,
  y,
  gridlines = false,
  maxTicks = 6,
}: XAxisProps): ReactElement {
  const values = thin(ticks ?? scale.ticks(maxTicks), maxTicks);

  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <line
        x1={0}
        y1={0}
        x2={scale.range[1] - scale.range[0]}
        y2={0}
        className="stroke-chart-grid"
        strokeWidth={1}
      />
      {values.map((value) => {
        const offset = scale.map(value) - scale.range[0];
        return (
          <g key={value} transform={`translate(${offset} 0)`}>
            {gridlines ? (
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={-plotHeight}
                className="stroke-chart-grid"
                strokeWidth={1}
              />
            ) : null}
            <line x1={0} y1={0} x2={0} y2={TICK_LENGTH} className="stroke-chart-grid" />
            <text
              x={0}
              y={TICK_LENGTH + TICK_LABEL_GAP}
              textAnchor="middle"
              dominantBaseline="hanging"
              className="fill-text-tertiary text-[0.6875rem] tabular-nums"
            >
              {format(value)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export interface BandAxisProps {
  readonly scale: BandScale;
  readonly format: (key: string) => string;
  readonly x: number;
  readonly y: number;
  readonly maxTicks?: number;
}

/** The categorical x axis a bar chart uses. One label per band, thinned. */
export function BandAxis({ scale, format, x, y, maxTicks = 12 }: BandAxisProps): ReactElement {
  const keys = thin(scale.domain, maxTicks);

  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <line
        x1={0}
        y1={0}
        x2={scale.range[1] - scale.range[0]}
        y2={0}
        className="stroke-chart-grid"
        strokeWidth={1}
      />
      {keys.map((key) => {
        const start = scale.map(key);
        if (start === undefined) return null;
        return (
          <text
            key={key}
            x={start - scale.range[0] + scale.bandwidth / 2}
            y={TICK_LENGTH + TICK_LABEL_GAP}
            textAnchor="middle"
            dominantBaseline="hanging"
            className="fill-text-tertiary text-[0.6875rem] tabular-nums"
          >
            {format(key)}
          </text>
        );
      })}
    </g>
  );
}

export interface YAxisProps {
  readonly scale: NumericScale;
  readonly ticks?: readonly number[];
  readonly format: (value: number) => string;
  /** Distance from the axis across to the right edge, for the gridlines. */
  readonly plotWidth: number;
  readonly x: number;
  readonly y: number;
  readonly maxTicks?: number;
}

export function YAxis({
  scale,
  ticks,
  format,
  plotWidth,
  x,
  y,
  maxTicks = 5,
}: YAxisProps): ReactElement {
  const values = ticks ?? scale.ticks(maxTicks);

  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {values.map((value) => {
        const offset = scale.map(value) - scale.range[0];
        return (
          <g key={value} transform={`translate(0 ${offset})`}>
            {/* Horizontal gridlines, always on: a value chart is read by
                laying a number against a line, and this is that line. */}
            <line
              x1={0}
              y1={0}
              x2={plotWidth}
              y2={0}
              className="stroke-chart-grid"
              strokeWidth={1}
            />
            <text
              x={-TICK_LABEL_GAP}
              y={0}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-text-tertiary text-[0.6875rem] tabular-nums"
            >
              {format(value)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/**
 * Keep at most `max` entries, evenly spread, first and last always included.
 *
 * Ninety daily labels in six hundred pixels is a grey smear. Dropping every
 * nth label keeps the axis readable and keeps the geometry honest, which
 * relabelling to a coarser bucket would not: the points stay where the data
 * put them.
 */
function thin<T>(values: readonly T[], max: number): readonly T[] {
  if (values.length <= max || max < 2) return values;
  const stride = Math.ceil(values.length / max);
  const kept = values.filter((_, index) => index % stride === 0);
  const last = values[values.length - 1] as T;
  return kept[kept.length - 1] === last ? kept : [...kept, last];
}
