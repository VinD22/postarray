/**
 * Scales: the arithmetic that turns a measurement into a coordinate.
 *
 * Thin wrappers over `d3-scale` rather than re-exports. Two reasons, and both
 * are about the callers rather than about d3:
 *
 * - A d3 scale is a callable function carrying twenty methods, several of
 *   which (`clamp`, `interpolate`, `unknown`) would let a chart quietly change
 *   what a number means. The three shapes below expose exactly what a chart
 *   needs and nothing that can rewrite the data.
 * - Nothing outside this file imports a d3 type, so the dependency stays
 *   swappable and the rest of the kit stays readable by someone who has never
 *   used d3.
 *
 * Every scale here is pure and synchronous, so every one of them is testable
 * without a DOM.
 */

import { scaleBand, scaleLinear, scaleUtc } from 'd3-scale';

/** A closed interval. `[min, max]` for a domain, `[start, end]` for a range. */
export type Extent = readonly [number, number];

/**
 * A continuous scale. `map` is the only way in, which is what keeps a caller
 * from reaching for `invert` and inventing a value between two observations.
 */
export interface NumericScale {
  readonly domain: Extent;
  readonly range: Extent;
  /** Position for a value. Values outside the domain extrapolate, not clamp. */
  map(value: number): number;
  /** Round tick values inside the domain, at most `count` of them. */
  ticks(count?: number): readonly number[];
}

/**
 * A categorical scale over discrete keys, for bars.
 *
 * `map` returns `undefined` for a key the scale was not built with rather than
 * a zero, because a bar drawn at the origin for an unknown category is a bar
 * that says something false.
 */
export interface BandScale {
  readonly domain: readonly string[];
  readonly range: Extent;
  /** The leading edge of the band, or `undefined` if the key is not in it. */
  map(key: string): number | undefined;
  /** The drawn width of one band, inner padding already removed. */
  readonly bandwidth: number;
  /** Band width plus the gap after it. */
  readonly step: number;
}

const DEFAULT_TICK_COUNT = 5;

/**
 * A linear scale.
 *
 * A zero-width domain is the flat-series case: every reading is the same
 * number. Widening it by one keeps the line in the middle of the frame instead
 * of dividing by zero, and it never moves a value that a reader can see,
 * because there is only one value to move.
 */
export function linearScale(domain: Extent, range: Extent): NumericScale {
  const safeDomain: Extent =
    domain[0] === domain[1] ? [domain[0] - 0.5, domain[1] + 0.5] : domain;
  const scale = scaleLinear().domain([safeDomain[0], safeDomain[1]]).range([range[0], range[1]]);

  return {
    domain: safeDomain,
    range,
    map: (value) => scale(value),
    ticks: (count = DEFAULT_TICK_COUNT) => scale.ticks(count),
  };
}

/**
 * A UTC time scale over epoch milliseconds.
 *
 * UTC, never local. A chart bucketed by the provider's day must not shift a
 * point across a boundary because the reader opened it in a different zone,
 * and it must not gain or lose an hour at a daylight-saving transition. The
 * caller formats the tick into whatever zone the reader should see; the
 * geometry stays in UTC.
 */
export function timeScale(domain: Extent, range: Extent): NumericScale {
  const safeDomain: Extent =
    domain[0] === domain[1] ? [domain[0] - 43_200_000, domain[1] + 43_200_000] : domain;
  const scale = scaleUtc()
    .domain([new Date(safeDomain[0]), new Date(safeDomain[1])])
    .range([range[0], range[1]]);

  return {
    domain: safeDomain,
    range,
    map: (value) => scale(new Date(value)),
    ticks: (count = DEFAULT_TICK_COUNT) => scale.ticks(count).map((date) => date.getTime()),
  };
}

/** A band scale. `padding` is the share of each step left as a gap, 0 to 1. */
export function bandScale(
  domain: readonly string[],
  range: Extent,
  padding = 0.2,
): BandScale {
  const scale = scaleBand<string>()
    .domain([...domain])
    .range([range[0], range[1]])
    .padding(padding);

  return {
    domain,
    range,
    map: (key) => scale(key),
    bandwidth: scale.bandwidth(),
    step: scale.step(),
  };
}

/**
 * Round tick values spanning `min` to `max`.
 *
 * The returned ticks may sit outside the input, which is the point: an axis
 * that runs 0, 25, 50, 75, 100 reads instantly and one that runs 3, 26, 49,
 * 72, 95 does not. Pair it with `niceDomain` so the axis and the plot agree.
 */
export function niceTicks(min: number, max: number, count = DEFAULT_TICK_COUNT): readonly number[] {
  if (min === max) return [min];
  return scaleLinear().domain([min, max]).nice(count).ticks(count);
}

/** The rounded domain `niceTicks` spans, for a scale that has to match it. */
export function niceDomain(min: number, max: number, count = DEFAULT_TICK_COUNT): Extent {
  if (min === max) return [min - 0.5, max + 0.5];
  const domain = scaleLinear().domain([min, max]).nice(count).domain();
  return [domain[0] ?? min, domain[1] ?? max];
}

/**
 * The extent of the numbers in a series, ignoring the gaps.
 *
 * Returns `null` when there is nothing to measure. A caller that substituted
 * `[0, 0]` here would draw an axis for data it does not have, so it has to
 * handle the empty case itself.
 */
export function valueExtent(values: readonly (number | null)[]): Extent | null {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  let seen = false;

  for (const value of values) {
    if (value === null || !Number.isFinite(value)) continue;
    seen = true;
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return seen ? [min, max] : null;
}
