/**
 * Path geometry.
 *
 * One rule governs this file, and it is the reason the file exists rather than
 * a `points.map(…).join(' ')` inside a component:
 *
 *   **A null reading is a hole in the line. It is never interpolated across
 *   and it is never drawn as zero.**
 *
 * A provider that returned nothing for Tuesday did not report zero impressions
 * on Tuesday. Joining Monday to Wednesday with a straight segment draws a
 * Tuesday value nobody measured, and drawing it at the baseline draws a
 * collapse that never happened. Both are inventions, and inventing a
 * measurement is the one thing this product must never do. So the line stops
 * and starts again, and the chart says in words that the gaps mean the
 * provider reported nothing.
 *
 * `d3-shape`'s `defined` accessor gives exactly that: an undefined point ends
 * the current subpath and the next defined point opens a new `M`.
 */

import { area as d3Area, line as d3Line } from 'd3-shape';

/** A point already in chart coordinates. `y` is null where nothing was read. */
export interface PathPoint {
  readonly x: number;
  readonly y: number | null;
}

const isDrawable = (point: PathPoint): boolean =>
  point.y !== null && Number.isFinite(point.y) && Number.isFinite(point.x);

/**
 * The runs of consecutive readings, gaps removed.
 *
 * Exported because it is what the tests assert against and what the tooltip
 * layer uses to decide which points have a dot: a run of one is a single
 * observation between two gaps, and a stroke of zero length would render it
 * invisible unless something drew a marker for it.
 */
export interface DrawnPoint {
  readonly x: number;
  readonly y: number;
}

export function drawableRuns(points: readonly PathPoint[]): readonly (readonly DrawnPoint[])[] {
  const runs: { x: number; y: number }[][] = [];
  let current: { x: number; y: number }[] | null = null;

  for (const point of points) {
    if (!isDrawable(point)) {
      current = null;
      continue;
    }
    if (current === null) {
      current = [];
      runs.push(current);
    }
    current.push({ x: point.x, y: point.y as number });
  }

  return runs;
}

/**
 * A polyline through the readings, broken at every gap.
 *
 * Returns an empty string when nothing is drawable, so a caller can render the
 * element unconditionally and get an empty path rather than `d="null"`.
 */
export function linePath(points: readonly PathPoint[]): string {
  const generator = d3Line<PathPoint>()
    .defined(isDrawable)
    .x((point) => point.x)
    .y((point) => point.y as number);

  return generator([...points]) ?? '';
}

/**
 * The band between the readings and a baseline, broken at the same gaps.
 *
 * Only ever used behind a single series. A stack of translucent areas is how a
 * chart stops being readable: overlaps read as a fourth colour and the reader
 * cannot tell an occlusion from a value.
 */
export function areaPath(points: readonly PathPoint[], baselineY: number): string {
  const generator = d3Area<PathPoint>()
    .defined(isDrawable)
    .x((point) => point.x)
    .y0(baselineY)
    .y1((point) => point.y as number);

  return generator([...points]) ?? '';
}

/** True when any reading is missing, which is what turns on the gap sentence. */
export function hasGap(points: readonly PathPoint[]): boolean {
  return points.some((point) => !isDrawable(point));
}
