import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EditorialPricePair } from './price-pair';

/**
 * Both intervals, with nothing to click.
 *
 * The commercial reason this component exists is that a landing page showing
 * only `$29/month` leaves a visitor unaware the annual price exists at all. So
 * the contract under test is not "it renders": it is that both figures and
 * both labels are present in the markup with no interaction, which is what a
 * crawler, a screen reader and a JavaScript-disabled client each see.
 */
describe('EditorialPricePair', () => {
  function renderPair(): void {
    render(
      <EditorialPricePair
        locale="en"
        monthlyPriceDollars={29}
        annualPriceDollars={300}
        monthlyLabel="Billed monthly"
        annualLabel="Billed annually"
        monthlyDetail="$29 charged every month."
        annualDetail="$300 charged once a year."
        annualFraming="$25/month billed annually. Save $48/year."
      />,
    );
  }

  it('states both intervals without any control being operated', () => {
    renderPair();

    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('$300')).toBeInTheDocument();
    expect(screen.getByText('Billed monthly')).toBeInTheDocument();
    expect(screen.getByText('Billed annually')).toBeInTheDocument();
  });

  it('offers no toggle, radio or button, so neither price can be hidden', () => {
    renderPair();

    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.queryAllByRole('switch')).toHaveLength(0);
  });

  it('carries the annual framing sentence the caller passed, in money', () => {
    renderPair();

    const framing = screen.getByText(/billed annually/);
    expect(framing).toHaveTextContent('Save $48/year');
    expect(framing.textContent).not.toMatch(/\d+\s*%/);
  });
});
