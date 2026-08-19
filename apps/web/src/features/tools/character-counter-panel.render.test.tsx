import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { en } from '@relay/i18n/messages';
import type { PartialCatalog } from '@relay/i18n/messages';

import { CharacterCounterPanel } from './character-counter-panel';
import { findCharacterCounterPage, type CharacterCounterPage } from './character-counter';
import { ToolsProvider } from './tools-provider';

/**
 * Markup contract for the counter island.
 *
 * The end to end suite runs axe over the finished page. What is held here is
 * what axe cannot judge: that the control has a programmatic name, that the
 * count is announced politely rather than on every keystroke at full volume,
 * and that going over the limit is said in words and not only in a colour.
 */

const CATALOG: PartialCatalog = en;

function counter(slug: string): CharacterCounterPage {
  const page = findCharacterCounterPage(slug);
  if (!page) {
    throw new Error(`no character counter page for ${slug}`);
  }
  return page;
}

function mount(node: ReactNode): ReactElement {
  return (
    <ToolsProvider locale="en" catalog={CATALOG}>
      {node}
    </ToolsProvider>
  );
}

describe('character counter markup', () => {
  it('names the control and the progress bar', () => {
    render(mount(<CharacterCounterPanel page={counter('x')} />));

    expect(screen.getByLabelText('Your post')).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Share of the ceiling used' }),
    ).toBeInTheDocument();
  });

  it('announces the count politely and states the state in words', async () => {
    const user = userEvent.setup();
    const { container } = render(mount(<CharacterCounterPanel page={counter('bluesky')} />));

    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull();
    expect(screen.getByText('Fits')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Your post'), 'hello');

    expect(screen.getByText('5 of 300 characters')).toBeInTheDocument();
    expect(screen.getByText('295 characters left')).toBeInTheDocument();
  });

  it('says how far over the limit a post is, not only that it is over', async () => {
    const user = userEvent.setup();
    render(mount(<CharacterCounterPanel page={counter('bluesky')} />));

    await user.click(screen.getByLabelText('Your post'));
    await user.paste('a'.repeat(305));

    expect(screen.getByText('Would fail')).toBeInTheDocument();
    expect(screen.getByText('Over the limit by 5 characters.')).toBeInTheDocument();
  });

  it('explains the flat link cost on a platform that rewrites links', async () => {
    const user = userEvent.setup();
    render(mount(<CharacterCounterPanel page={counter('x')} />));

    await user.click(screen.getByLabelText('Your post'));
    await user.paste('https://example.test/a-long-path-nobody-would-type-by-hand');

    expect(screen.getByText(/1 link in this post/u)).toBeInTheDocument();
    expect(screen.getByText(/each one costs 23 characters/u)).toBeInTheDocument();
    expect(screen.getByText('23 of 280 weighted characters')).toBeInTheDocument();
  });

  it('cites the platform document the ceiling came from', () => {
    render(mount(<CharacterCounterPanel page={counter('x')} />));

    expect(screen.getByRole('link', { name: 'Platform documentation' })).toBeInTheDocument();
    expect(screen.getByText(/Read on 2026-08-04/u)).toBeInTheDocument();
  });
});
