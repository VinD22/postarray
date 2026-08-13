import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';

import { publishableTiers } from '@/features/billing/tiers';

import { TierGrid, type TierGridColumn } from './tier-grid';

/**
 * The three-tier presentation.
 *
 * What is under test is the commercial contract, not the layout: the amounts
 * are arithmetic on the same integer minor units the tier module holds, the
 * saving is money rather than a percentage, there is exactly one primary
 * action while the other two tiers are not purchasable, and a tier's column
 * carries a delta rather than a feature list. Each of those is a claim
 * somebody could quietly break with a plausible-looking edit.
 */
const TIERS: readonly TierGridColumn[] = [
  {
    id: 'relay_standard',
    name: 'Standard',
    tagline: 'For one team running a handful of projects.',
    monthlyPriceMinor: 2_900,
    annualPriceMinor: 30_000,
    currency: 'USD',
    allowance: '3 active projects',
    delta: 'Every feature Relay has, on 3 active projects.',
    annualFraming: '$25 a month billed annually. Save $48 a year.',
    anchored: true,
    cta: { href: '/sign-up', label: 'Start free trial' },
  },
  {
    id: 'relay_growth',
    name: 'Growth',
    tagline: 'More active projects in one workspace.',
    monthlyPriceMinor: 5_900,
    annualPriceMinor: 61_200,
    currency: 'USD',
    allowance: '10 active projects',
    delta: 'Everything in Standard, plus 7 more active projects.',
    annualFraming: '$51 a month billed annually. Save $96 a year.',
    unavailableNote: 'Not on sale yet.',
  },
  {
    id: 'relay_studio',
    name: 'Studio',
    tagline: 'The largest project capacity we offer.',
    monthlyPriceMinor: 11_900,
    annualPriceMinor: 123_600,
    currency: 'USD',
    allowance: '20 active projects',
    delta: 'Everything in Growth, plus 10 more active projects.',
    annualFraming: '$103 a month billed annually. Save $192 a year.',
    unavailableNote: 'Not on sale yet.',
  },
];

function renderGrid(variant: 'full' | 'compact' = 'full'): void {
  // The interval control inside the grid reads the catalog, so the provider is
  // part of rendering it at all rather than test scaffolding.
  render(
    <I18nProvider locale="en" catalog={en} timeZone="UTC">
      <TierGrid
        locale="en"
        tiers={TIERS}
        variant={variant}
        intervalGroupLabel="Billing interval for every tier"
        monthlyLabel="Billed monthly"
        annualLabel="Billed annually"
        startHereLabel="Start here"
      />
    </I18nProvider>,
  );
}

describe('TierGrid', () => {
  it('formats every amount from the tier module’s own minor units', () => {
    // The fixture above is not a second opinion about the prices: it must
    // agree with `features/billing/tiers.ts`, or the page and the charge can
    // drift. Checked here rather than in a comment.
    const live = publishableTiers();
    expect(live).toHaveLength(TIERS.length);
    for (const [index, tier] of live.entries()) {
      expect(TIERS[index]?.monthlyPriceMinor).toBe(tier.monthlyPriceMinor);
      expect(TIERS[index]?.annualPriceMinor).toBe(tier.annualPriceMinor);
    }

    renderGrid();

    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('$59')).toBeInTheDocument();
    expect(screen.getByText('$119')).toBeInTheDocument();
  });

  it('counts every column to its annual amount when the interval changes', async () => {
    renderGrid();
    const user = userEvent.setup();

    await user.click(screen.getByRole('radio', { name: 'Billed annually' }));

    // Every column counts to its own figure, and the three counters settle
    // independently, so each one is awaited rather than only the first.
    expect(await screen.findByText('$300')).toBeInTheDocument();
    expect(await screen.findByText('$612')).toBeInTheDocument();
    expect(await screen.findByText('$1,236')).toBeInTheDocument();
  });

  it('states the annual saving in money, never as a percentage', () => {
    // `packages/billing/src/copy-compliance.test.ts` rejects a percentage or
    // an "off" framing outright, and the real discounts are not round.
    renderGrid();

    for (const tier of TIERS) {
      const framing = screen.getByText(tier.annualFraming);
      expect(framing.textContent).not.toMatch(/\d+\s*%/);
      expect(framing.textContent).toMatch(/Save \$\d/);
    }
  });

  it('offers exactly one primary action, on the anchored tier', () => {
    renderGrid();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent('Start free trial');

    // And it is on the anchored column, not merely somewhere on the page:
    // a lone CTA parked on a tier nobody can buy would pass a bare count.
    const anchored = document.querySelector('[data-anchored="true"]');
    expect(anchored).not.toBeNull();
    expect(anchored?.contains(links[0] ?? null)).toBe(true);
  });

  it('marks the anchor by more than colour', () => {
    renderGrid();

    // The accent border is one signal; "Start here" is the one a reader who
    // cannot see the border still gets.
    expect(screen.getByText('Start here')).toBeInTheDocument();
    const anchored = document.querySelectorAll('[data-anchored="true"]');
    expect(anchored).toHaveLength(1);
    expect(anchored[0]).toHaveAttribute('data-tier', 'relay_standard');
  });

  it('describes the larger tiers as a delta, never as a feature list', () => {
    renderGrid();

    const growth = document.querySelector('[data-tier="relay_growth"]');
    expect(growth).not.toBeNull();
    expect(
      within(growth as HTMLElement).getByText(/Everything in Standard, plus/),
    ).toBeInTheDocument();
  });

  it('says the larger tiers are not purchasable rather than offering a dead button', () => {
    renderGrid();

    expect(screen.getAllByText('Not on sale yet.')).toHaveLength(2);
  });

  it('drops the prose but keeps the prices in the compact teaser', () => {
    renderGrid('compact');

    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('10 active projects')).toBeInTheDocument();
    expect(screen.queryByText(/Everything in Standard, plus/)).not.toBeInTheDocument();
  });
});
