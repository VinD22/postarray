/**
 * The chart kit.
 *
 * Four rules are baked into every component here, and none of them is a prop
 * a caller can turn off:
 *
 * 1. A missing reading is a gap. Never an interpolation, never a zero.
 * 2. Nothing animates. No draw-in, no transition on a path, no counted-up
 *    number. A reader waiting on a figure never waits on an effect.
 * 3. Series are told apart by dash pattern plus a text legend. Never by hue.
 *    The palette is four monochrome tokens; marigold and ultramarine are
 *    marketing vocabulary and may not appear.
 * 4. Every chart carries a caption and a "View as table" fallback, and every
 *    point is reachable from the keyboard.
 *
 * Every string is a required prop, as everywhere else in this package.
 */

export { XAxis, YAxis, BandAxis, type XAxisProps, type YAxisProps, type BandAxisProps } from './axis';
export {
  ChartFrame,
  DEFAULT_CHART_MARGIN,
  type ChartFrameProps,
  type ChartLayout,
  type ChartMargin,
} from './chart-frame';
export {
  ChartTable,
  type ChartTableCell,
  type ChartTableProps,
  type ChartTableRow,
} from './chart-table';
export { ChartPoints, type ChartHitPoint, type ChartPointsProps } from './chart-tooltip';
export {
  LineChart,
  type LineChartMessages,
  type LineChartProps,
  type Series,
  type SeriesPoint,
} from './line-chart';
export { BarChart, type BarChartMessages, type BarChartProps, type BarDatum } from './bar-chart';
export {
  areaPath,
  drawableRuns,
  hasGap,
  linePath,
  type DrawnPoint,
  type PathPoint,
} from './path';
export {
  bandScale,
  linearScale,
  niceDomain,
  niceTicks,
  timeScale,
  valueExtent,
  type BandScale,
  type Extent,
  type NumericScale,
} from './scale';
