import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../patterns/page-header';
import { MetricValue } from '../patterns/metric-value';
import { Timeline } from '../patterns/timeline';
import { Table, TableBody, TableCell, TableRow } from '../primitives/table';

/**
 * Three typographic behaviours the size scale cannot express.
 *
 * A `--text-*` step carries a size, a line height, a tracking and a weight.
 * None of those is an optical size, a figure width or a family swap, so each
 * of the three lives as a utility instead. They exist as utilities rather than
 * as inline declarations for the ordinary reason: a rule written once is a
 * rule, and the same three properties copied into nine components is a
 * convention nobody can enforce.
 *
 * This test holds both halves: that `theme.css` still declares the utility,
 * and that the components meant to carry it still do.
 */

const THEME_CSS = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'theme.css'), 'utf8');

/** The body of a single-class rule, comments stripped. */
const ruleBody = (selector: string): string => {
  const source = THEME_CSS.replace(/\/\*[\s\S]*?\*\//g, '');
  const match = new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`).exec(source);
  return match?.[1]?.trim() ?? '';
};

describe('.type-title', () => {
  it('asks for the display serif at its display optical size', () => {
    const body = ruleBody('.type-title');
    expect(body).toContain('font-family: var(--font-display)');
    expect(body).toContain('font-optical-sizing: auto');
    expect(body).toMatch(/font-variation-settings:\s*'opsz'\s*28/);
  });

  it('does not set a size or a weight, so it composes with the type scale', () => {
    const body = ruleBody('.type-title');
    expect(body).not.toMatch(/(^|[\s;])font-size:/);
    expect(body).not.toMatch(/(^|[\s;])font-weight:/);
  });

  it('dresses the page h1', () => {
    render(<PageHeader title="Queue" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('type-title');
  });
});

describe('.num', () => {
  it('is tabular figures and nothing else', () => {
    expect(ruleBody('.num')).toBe('font-variant-numeric: tabular-nums;');
  });

  it('holds a metric still while its number changes', () => {
    const { rerender, container } = render(
      <MetricValue label="Reach" availability="available" value="9,999" />,
    );
    const first = container.querySelector('[data-numeric]');
    expect(first).toHaveClass('num');

    rerender(<MetricValue label="Reach" availability="available" value="11,111" />);
    expect(container.querySelector('[data-numeric]')).toHaveClass('num');
  });

  it('is not applied to the word shown when a metric is unavailable', () => {
    const { container } = render(
      <MetricValue
        label="Reach"
        availability="unsupported"
        unavailableText="Not supported"
        reason="This provider does not report reach."
      />,
    );
    expect(container.querySelector('[data-numeric]')).toBeNull();
  });

  it('lines up a numeric column so two rows can be compared down the page', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell numeric>1,204</TableCell>
            <TableCell>Instagram</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveClass('num');
    expect(cells[0]).toHaveClass('text-end');
    expect(cells[1]).not.toHaveClass('num');
  });
});

describe('.mono-id', () => {
  it('is the mono family at a size that does not shout over its sentence', () => {
    const body = ruleBody('.mono-id');
    expect(body).toContain('font-family: var(--font-mono)');
    expect(body).toContain('font-size: 0.9375em');
    expect(body).toContain('letter-spacing: normal');
  });

  it('dresses a timeline timestamp, which keeps the column aligned', () => {
    const { container } = render(
      <Timeline
        label="Publication events"
        events={[
          {
            id: 'evt_1',
            title: 'Accepted by provider',
            timestamp: '14:02:11',
            isoTimestamp: '2026-09-03T14:02:11Z',
            outcome: 'completed',
          },
        ]}
      />,
    );
    const time = container.querySelector('time');
    expect(time).toHaveClass('mono-id');
    expect(time).toHaveAttribute('datetime', '2026-09-03T14:02:11Z');
  });
});
