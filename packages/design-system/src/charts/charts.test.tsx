import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { BarChart } from './bar-chart';
import { LineChart, type Series } from './line-chart';
import { drawableRuns, hasGap, linePath } from './path';
import { bandScale, linearScale, niceDomain, niceTicks, timeScale, valueExtent } from './scale';

const HERE = dirname(fileURLToPath(import.meta.url));

const formatX = (iso: string): string => iso.slice(0, 10);
const formatY = (value: number): string => String(value);

const lineMessages = {
  caption: 'Impressions per day.',
  ariaLabel: 'Impressions per day for the last four days.',
  viewAsTable: 'View as table',
  tableCaption: 'Impressions per day',
  xHeader: 'Day',
  unavailable: 'Unavailable',
  gapLegend: 'Gaps mean the provider reported nothing.',
  pointsLabel: 'Impressions by day',
  empty: 'No readings in this period.',
};

const withGap: Series = {
  id: 'impressions',
  label: 'Impressions',
  points: [
    { t: '2026-03-01T00:00:00.000Z', v: 10 },
    { t: '2026-03-02T00:00:00.000Z', v: null },
    { t: '2026-03-03T00:00:00.000Z', v: 30 },
    { t: '2026-03-04T00:00:00.000Z', v: 40 },
  ],
};

describe('scale', () => {
  it('maps a domain onto a range linearly', () => {
    const scale = linearScale([0, 100], [0, 200]);
    expect(scale.map(0)).toBe(0);
    expect(scale.map(50)).toBe(100);
    expect(scale.map(100)).toBe(200);
  });

  it('does not divide by zero on a flat series', () => {
    const scale = linearScale([7, 7], [0, 100]);
    expect(Number.isFinite(scale.map(7))).toBe(true);
    expect(scale.map(7)).toBe(50);
  });

  it('treats a time domain as UTC so no point moves with the reader', () => {
    const start = Date.parse('2026-03-01T00:00:00.000Z');
    const end = Date.parse('2026-03-03T00:00:00.000Z');
    const scale = timeScale([start, end], [0, 100]);
    expect(scale.map(start)).toBe(0);
    expect(scale.map(Date.parse('2026-03-02T00:00:00.000Z'))).toBe(50);
    expect(scale.map(end)).toBe(100);
  });

  it('gives a band per key and nothing for a key it does not know', () => {
    const scale = bandScale(['a', 'b'], [0, 100], 0);
    expect(scale.map('a')).toBe(0);
    expect(scale.map('b')).toBe(50);
    // Not zero: a bar at the origin for an unknown category is a false bar.
    expect(scale.map('missing')).toBeUndefined();
  });

  it('rounds ticks and the domain to the same numbers', () => {
    expect(niceTicks(3, 97, 5)).toEqual([0, 20, 40, 60, 80, 100]);
    expect(niceDomain(3, 97, 5)).toEqual([0, 100]);
  });

  it('measures only the readings that exist', () => {
    expect(valueExtent([null, 4, null, 9])).toEqual([4, 9]);
    // Nothing measurable is null, never [0, 0]: an axis over no data would
    // draw a zero line for readings we never took.
    expect(valueExtent([null, null])).toBeNull();
  });
});

describe('path', () => {
  it('splits the line at a null rather than joining across it', () => {
    const d = linePath([
      { x: 0, y: 10 },
      { x: 10, y: null },
      { x: 20, y: 30 },
      { x: 30, y: 40 },
    ]);
    // Two subpaths, so two move commands: the gap is a real break.
    expect(d.match(/M/g)).toHaveLength(2);
    expect(d).not.toContain('10,'.replace(',', ' '));
    expect(drawableRuns([{ x: 0, y: 1 }, { x: 1, y: null }, { x: 2, y: 3 }])).toHaveLength(2);
  });

  it('never substitutes zero for a missing reading', () => {
    const d = linePath([
      { x: 0, y: 100 },
      { x: 10, y: null },
    ]);
    // One point, one move, and no segment down to a baseline.
    expect(d.match(/M/g)).toHaveLength(1);
    expect(d).not.toMatch(/L/);
  });

  it('reports whether a gap exists at all', () => {
    expect(hasGap([{ x: 0, y: 1 }])).toBe(false);
    expect(hasGap([{ x: 0, y: null }])).toBe(true);
  });

  it('returns an empty path rather than null for no drawable points', () => {
    expect(linePath([])).toBe('');
    expect(linePath([{ x: 0, y: null }])).toBe('');
  });
});

describe('LineChart', () => {
  it('renders a figure with a caption and an image-labelled svg', () => {
    render(
      <LineChart series={[withGap]} formatX={formatX} formatY={formatY} messages={lineMessages} />,
    );
    expect(screen.getByRole('figure')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: lineMessages.ariaLabel })).toBeInTheDocument();
    expect(screen.getByText(lineMessages.caption)).toBeInTheDocument();
  });

  it('says that gaps mean the provider reported nothing, but only when one does', () => {
    const { unmount } = render(
      <LineChart series={[withGap]} formatX={formatX} formatY={formatY} messages={lineMessages} />,
    );
    expect(screen.getByText(lineMessages.gapLegend)).toBeInTheDocument();
    unmount();

    const complete: Series = {
      ...withGap,
      points: withGap.points.map((point) => ({ ...point, v: point.v ?? 20 })),
    };
    render(
      <LineChart series={[complete]} formatX={formatX} formatY={formatY} messages={lineMessages} />,
    );
    expect(screen.queryByText(lineMessages.gapLegend)).not.toBeInTheDocument();
  });

  it('offers the numbers as a table where a missing reading is the word', () => {
    render(
      <LineChart series={[withGap]} formatX={formatX} formatY={formatY} messages={lineMessages} />,
    );
    const table = screen.getByRole('table', { name: lineMessages.tableCaption });
    const gapRow = within(table).getByRole('row', { name: /2026-03-02/ });
    expect(within(gapRow).getByText(lineMessages.unavailable)).toBeInTheDocument();
    // The one thing that must never appear in that cell.
    expect(within(gapRow).queryByText('0')).not.toBeInTheDocument();
    expect(within(gapRow).queryByText('—')).not.toBeInTheDocument();
  });

  it('reaches every point from the keyboard with one tab stop and the arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <LineChart series={[withGap]} formatX={formatX} formatY={formatY} messages={lineMessages} />,
    );
    const group = screen.getByRole('group', { name: lineMessages.pointsLabel });
    const buttons = within(group).getAllByRole('button');
    expect(buttons).toHaveLength(4);

    // Roving tabindex: exactly one point is in the tab order.
    expect(buttons.filter((button) => button.tabIndex === 0)).toHaveLength(1);

    buttons[0]?.focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(buttons[1]);
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(buttons[3]);
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('names a missing point with the word rather than leaving it silent', () => {
    render(
      <LineChart series={[withGap]} formatX={formatX} formatY={formatY} messages={lineMessages} />,
    );
    expect(
      screen.getByRole('button', { name: `2026-03-02, Impressions: ${lineMessages.unavailable}` }),
    ).toBeInTheDocument();
  });

  it('draws no axis over an empty series and still offers the table', () => {
    render(
      <LineChart
        series={[{ id: 'a', label: 'Impressions', points: [] }]}
        formatX={formatX}
        formatY={formatY}
        messages={lineMessages}
      />,
    );
    expect(screen.getByText(lineMessages.empty)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText(lineMessages.viewAsTable)).toBeInTheDocument();
  });

  it('draws real tick labels on both axes', () => {
    const { container } = render(
      <LineChart series={[withGap]} formatX={formatX} formatY={formatY} messages={lineMessages} />,
    );
    const texts = [...container.querySelectorAll('svg text')].map((node) => node.textContent);
    expect(texts).toContain('2026-03-01');
    expect(texts.some((text) => text !== null && /^\d+$/.test(text))).toBe(true);
  });
});

describe('BarChart', () => {
  const barMessages = {
    caption: 'Posts published per channel.',
    ariaLabel: 'Posts published per channel.',
    viewAsTable: 'View as table',
    tableCaption: 'Posts per channel',
    xHeader: 'Channel',
    unavailable: 'Unavailable',
    gapLegend: 'Gaps mean the provider reported nothing.',
    empty: 'No readings in this period.',
    seriesLabel: 'This period',
    compareLabel: 'Previous period',
  };

  it('draws no bar for a missing reading', () => {
    const { container } = render(
      <BarChart
        data={[
          { id: 'a', label: 'A', value: 5 },
          { id: 'b', label: 'B', value: null },
        ]}
        formatY={formatY}
        messages={barMessages}
      />,
    );
    // The plotting band plus one bar. A zero-height placeholder for B would
    // be indistinguishable from a measured zero.
    expect(container.querySelectorAll('svg rect')).toHaveLength(2);
    expect(screen.getByText(barMessages.gapLegend)).toBeInTheDocument();
  });

  it('outlines the comparison series rather than tinting it', () => {
    const { container } = render(
      <BarChart
        data={[{ id: 'a', label: 'A', value: 5, compareValue: 3 }]}
        formatY={formatY}
        messages={barMessages}
      />,
    );
    const outlined = [...container.querySelectorAll('svg rect')].filter(
      (rect) => rect.getAttribute('fill') === 'none',
    );
    expect(outlined).toHaveLength(1);
    expect(outlined[0]?.getAttribute('class')).toContain('stroke-chart-line-compare');
  });
});

/**
 * The merge gate for the two rules a future edit is most likely to break.
 *
 * Both are read off the source rather than off a render, because both are
 * about what the code is allowed to contain at all. A draw-in added to one
 * chart and a marigold stroke added to another would each pass every
 * behavioural test above.
 */
describe('house rules', () => {
  const sources = readdirSync(HERE)
    .filter((name) => /\.tsx?$/.test(name) && !name.endsWith('.test.tsx'))
    .map((name) => [name, readFileSync(join(HERE, name), 'utf8')] as const);

  it('has sources to check', () => {
    expect(sources.length).toBeGreaterThan(6);
  });

  /** Comments name the banned things in order to ban them. Check the code. */
  const code = (source: string): string =>
    source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

  it.each(sources)('%s animates nothing', (_name, source) => {
    // No SMIL, no CSS transition, no keyframe class. A chart that grows into
    // place delays a number the reader is already waiting for, which the
    // design system README bans outright.
    const stripped = code(source);
    expect(stripped).not.toMatch(/<animate/);
    expect(stripped).not.toMatch(/\btransition-/);
    expect(stripped).not.toMatch(/\banimate-/);
    expect(stripped).not.toMatch(/\brelay-anim-/);
    expect(stripped).not.toMatch(/\bgsap\b/);
  });

  it.each(sources)('%s uses no hue of its own', (_name, source) => {
    // The four chart tokens, plus the neutral text and surface tokens, are the
    // whole palette. Marigold and ultramarine are marketing scene vocabulary
    // and the README says nothing else may join them.
    expect(code(source)).not.toMatch(/accent-warm|accent-cool|marigold|ultramarine/);
    expect(code(source)).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });
});
