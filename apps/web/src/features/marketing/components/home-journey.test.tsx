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

    expect(screen.getByText('Start from a brief.')).toBeVisible();
    expect(screen.queryByText('Write one master draft.')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /Compose/u }));

    expect(screen.getByText('Write one master draft.')).toBeVisible();
    expect(screen.queryByText('Start from a brief.')).not.toBeInTheDocument();
  });
});
