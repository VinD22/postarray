import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { HomeJourney, type HomeJourneyStep } from './home-journey';

const STEPS: readonly HomeJourneyStep[] = [
  { id: 'source', title: 'Source', body: 'Start from a brief.' },
  { id: 'compose', title: 'Compose', body: 'Write one master draft.' },
];

describe('HomeJourney', () => {
  it('shows one step at a time and lets the reader choose another', async () => {
    const user = userEvent.setup();
    render(<HomeJourney label="Publishing workflow" steps={STEPS} />);

    // Every step stays in the DOM (forceMount) so crawlers read the whole
    // story; only the active panel is shown.
    const panelOf = (text: string) => screen.getByText(text).closest('[role="tabpanel"]');
    expect(panelOf('Start from a brief.')).toHaveAttribute('data-state', 'active');
    expect(panelOf('Write one master draft.')).toHaveAttribute('data-state', 'inactive');
    expect(panelOf('Write one master draft.')).toHaveClass('data-[state=inactive]:hidden');

    await user.click(screen.getByRole('tab', { name: /Compose/u }));

    expect(panelOf('Write one master draft.')).toHaveAttribute('data-state', 'active');
    expect(panelOf('Start from a brief.')).toHaveAttribute('data-state', 'inactive');
  });
});
