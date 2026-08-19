import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BentoCell, BentoGrid } from './bento';
import { HeroHeadline } from './hero-headline';

/**
 * The shared hero and bento vocabulary, and the two design rules they exist
 * to hold. Built for the home page, moved into `editorial/` the day pricing,
 * product and integrations wanted the same shapes (see `bento.tsx`'s own doc
 * comment), and still tested against the home page's source below: the
 * per-page invariants (one vermilion phrase, no row of identical bento cells)
 * are a property of what a page renders, not of the component alone, and the
 * home page is the one this suite has always read.
 *
 * Neither component is about rendering. `HeroHeadline` renders; what a future
 * edit can quietly break is that a page has exactly ONE vermilion phrase and
 * that the two lines stay two whole sentences rather than a concatenation.
 * `BentoCell` renders; what an edit can quietly break is the ban on a row of
 * identical cards, which is a property of the page source rather than of the
 * component.
 */

// Built with `join`, not `new URL`: the route segments contain `[` and `(`,
// which a URL would percent-encode into a path that does not exist on disk.
const HOME_PAGE = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../../app/[locale]/(marketing)/page.tsx',
);

describe('HeroHeadline', () => {
  it('sets exactly one phrase in the action accent', () => {
    // The design system allows one vermilion moment. A second accent span here
    // would cost the first one its meaning, and nothing else would fail.
    const { container } = render(
      <HeroHeadline
        lead="Post everywhere from your AI agent."
        accent="One draft, every network."
      />,
    );

    const accented = container.querySelectorAll('[data-accent-phrase="true"]');
    expect(accented).toHaveLength(1);
    expect(accented[0]?.className).toContain('text-accent-action');
    expect(accented[0]?.textContent).toBe('One draft, every network.');
  });

  it('keeps both lines inside one heading', () => {
    // Two <h1>s would be two headings in the outline, and a heading plus a
    // paragraph would drop the accent line out of the accessible name of the
    // page's title. One heading, two lines.
    render(
      <HeroHeadline
        lead="Post everywhere from your AI agent."
        accent="One draft, every network."
      />,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe(
      'Post everywhere from your AI agent.One draft, every network.',
    );
  });
});

describe('BentoCell', () => {
  it('gives each role a different span, so a uniform row cannot be drawn', () => {
    const { container } = render(
      <BentoGrid>
        <BentoCell span="lead" surface="bare">
          <p>Evidence</p>
        </BentoCell>
        <BentoCell span="side">
          <p>Reach</p>
        </BentoCell>
        <BentoCell span="side">
          <p>Surfaces</p>
        </BentoCell>
      </BentoGrid>,
    );

    const cells = [...container.querySelectorAll('[data-bento-span]')];
    expect(cells.map((cell) => cell.getAttribute('data-bento-span'))).toEqual([
      'lead',
      'side',
      'side',
    ]);
    expect(cells[0]?.className).toContain('lg:col-span-7');
    expect(cells[1]?.className).toContain('lg:col-span-5');
  });

  it('draws no panel around content that is already panels', () => {
    // Cards inside a card is the failure mode a bento invites. `bare` is the
    // opt out, and it has to actually draw nothing.
    const { container } = render(
      <BentoCell span="lead" surface="bare">
        <p>Nine cards live here</p>
      </BentoCell>,
    );

    const cell = container.querySelector('[data-bento-span]');
    expect(cell?.className).not.toContain('rounded-poster');
    expect(cell?.className).not.toContain('bg-surface-raised');
  });
});

describe('the home page', () => {
  it('never draws three identically sized bento cells in a row', async () => {
    // The banned pattern, checked where it can actually happen: the page
    // source. The component makes a uniform row awkward; this makes it fail.
    const source = await readFile(HOME_PAGE, 'utf8');
    const spans = [...source.matchAll(/<BentoCell[^>]*span="(lead|side|full)"/gu)].map(
      (match) => match[1],
    );

    expect(spans.length).toBeGreaterThan(2);
    expect(new Set(spans).size).toBeGreaterThan(1);
  });

  it('states its reach from the cohort rather than from a typed number', async () => {
    // A literal count here is a claim that goes stale on the commit that adds
    // a connector, in a file nobody re-reads. It has to be derived.
    const source = await readFile(HOME_PAGE, 'utf8');
    expect(source).toContain('CONNECTOR_PROVIDERS.length');
  });
});
