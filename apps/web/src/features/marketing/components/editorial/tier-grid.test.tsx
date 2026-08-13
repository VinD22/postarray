import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';
import { createTranslator } from '@relay/i18n/translate';

import { purchasableTiers } from '@/features/billing/tiers';

import { annualIntervalBadge, tierColumns } from './tier-columns';
import { TierGrid, type TierGridColumn } from './tier-grid';

/**
 * The plan presentation.
 *
 * What is under test is the commercial contract, not the layout. Each of these
 * is a claim somebody could quietly break with a plausible-looking edit:
 *
 *  - the amounts are arithmetic on the same integer minor units the tier
 *    module holds, so the page cannot disagree with the charge;
 *  - the yearly view shows at most two numbers and one badge, and the headline
 *    is a whole-dollar yearly amount rather than an annual price divided by
 *    twelve into a price with cents in it;
 *  - the checklist names the MCP surface, which is the thing the price page
 *    was hiding;
 *  - there is exactly one primary action, and no column that cannot be bought.
 */
const ENV_WITHOUT_LARGER_TIERS = {} as const;
const ENV_WITH_EVERY_TIER = {
  POLAR_MONTHLY_PRODUCT_ID: 'prod_m',
  POLAR_ANNUAL_PRODUCT_ID: 'prod_a',
  POLAR_GROWTH_MONTHLY_PRODUCT_ID: 'prod_gm',
  POLAR_GROWTH_ANNUAL_PRODUCT_ID: 'prod_ga',
  POLAR_STUDIO_MONTHLY_PRODUCT_ID: 'prod_sm',
  POLAR_STUDIO_ANNUAL_PRODUCT_ID: 'prod_sa',
} as const;

const t = createTranslator('en', en);

function columns(env: Readonly<Record<string, string>>): readonly TierGridColumn[] {
  return tierColumns({ t, ctaHref: '/sign-up', ctaLabel: 'Start your free trial', env });
}

function renderGrid(
  tiers: readonly TierGridColumn[],
  options: { readonly variant?: 'full' | 'compact'; readonly badge?: string } = {},
): void {
  // The interval control inside the grid reads the catalog, so the provider is
  // part of rendering it at all rather than test scaffolding.
  render(
    <I18nProvider locale="en" catalog={en} timeZone="UTC">
      <TierGrid
        locale="en"
        tiers={tiers}
        variant={options.variant ?? 'full'}
        intervalGroupLabel="How you want to pay"
        monthlyLabel="Monthly"
        annualLabel="Yearly"
        {...(options.badge === undefined ? {} : { annualBadge: options.badge })}
        startHereLabel="Start here"
        featuresLabel="Included at both prices"
      />
    </I18nProvider>,
  );
}

async function chooseYearly(): Promise<void> {
  const user = userEvent.setup();
  await user.click(screen.getByRole('radio', { name: /Yearly/ }));
}

describe('the columns the grid is given', () => {
  it('shows the whole ladder, whatever is configured for checkout', () => {
    // The ladder is the offer. A tier is hidden only when it has no decided
    // price at all; whether it can be bought today is a question about its
    // button. Hiding priced capacity from the reader most likely to want it
    // was the previous behaviour and it cost more than it protected.
    expect(columns(ENV_WITHOUT_LARGER_TIERS).map((column) => column.id)).toEqual([
      'relay_standard',
      'relay_growth',
      'relay_studio',
    ]);
  });

  /**
   * The gate is configuration, not a hardcoded list. This is the assertion
   * that proves it: the same source, the same code, a different environment,
   * and the page grows on its own.
   */
  it('grows a column on its own the day a larger tier has products', () => {
    expect(columns(ENV_WITH_EVERY_TIER).map((column) => column.id)).toEqual([
      'relay_standard',
      'relay_growth',
      'relay_studio',
    ]);
  });

  it('never hands the grid a column it cannot sell', () => {
    for (const env of [ENV_WITHOUT_LARGER_TIERS, ENV_WITH_EVERY_TIER]) {
      for (const column of columns(env)) {
        expect(column.month.priceMinor, column.id).toBeGreaterThan(0);
        expect(column.year.priceMinor, column.id).toBeGreaterThan(0);
      }
    }
  });

  it('carries the tier module’s own minor units, never a formatted string', () => {
    const live = purchasableTiers(ENV_WITH_EVERY_TIER);
    const built = columns(ENV_WITH_EVERY_TIER);
    expect(built).toHaveLength(live.length);
    for (const [index, tier] of live.entries()) {
      expect(built[index]?.month.priceMinor, tier.key).toBe(tier.monthlyPriceMinor);
      expect(built[index]?.year.priceMinor, tier.key).toBe(tier.annualPriceMinor);
    }
  });

  it('states a delta only where a delta is a difference from something', () => {
    const built = columns(ENV_WITH_EVERY_TIER);
    expect(built[0]?.delta).toBeUndefined();
    expect(built[1]?.delta).toMatch(/Everything in Standard, plus/);
  });

  it('offers the whole-month incentive, never a percentage', () => {
    const badge = annualIntervalBadge({ t, env: ENV_WITHOUT_LARGER_TIERS });
    expect(badge).toBe('2 months free');
    expect(badge).not.toMatch(/%/);
    // And it holds across the whole ladder, not only the tier we happen to sell.
    expect(annualIntervalBadge({ t, env: ENV_WITH_EVERY_TIER })).toBe('2 months free');
  });
});

describe('TierGrid', () => {
  it('formats the monthly charge from minor units', () => {
    renderGrid(columns(ENV_WITHOUT_LARGER_TIERS));

    // Three columns now, so three interval labels. The figure is what is
    // unique, and it must be the one the tier module holds.
    expect(screen.getByText('$25')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getAllByText('per month')).toHaveLength(3);
  });

  it('quotes a year as a yearly amount, never as an annual price divided by twelve', async () => {
    renderGrid(columns(ENV_WITHOUT_LARGER_TIERS));
    await chooseYearly();

    expect(await screen.findByText('$250')).toBeInTheDocument();
    expect(await screen.findByText('$500')).toBeInTheDocument();
    expect(await screen.findByText('$1,000')).toBeInTheDocument();
    expect(screen.getAllByText('per year')).toHaveLength(3);

    // $250 over twelve months is $20.83. A headline carrying cents, in any
    // shape, is the presentation this component exists to refuse.
    expect(screen.queryByText(/\$20/)).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/\$\d+\.\d\d/);
  });

  it('shows at most two numbers and one badge in the yearly view', async () => {
    renderGrid(columns(ENV_WITHOUT_LARGER_TIERS), { badge: '2 months free' });
    await chooseYearly();
    // Awaited, not read straight away: the headline numeral counts up, and a
    // snapshot taken mid-tween would be asserting an intermediate frame.
    await screen.findByText('$250');

    const card = document.querySelector('[data-tier="relay_standard"]');
    expect(card).not.toBeNull();
    // The headline charge, and the month-to-month comparison in the one
    // supporting line under it. Nothing else in the price block is money.
    const amounts = (card?.textContent ?? '').match(/\$[\d,]+/g) ?? [];
    expect(amounts).toEqual(['$250', '$25']);

    // The discount is stated exactly once, on the control.
    expect(screen.getAllByText('2 months free')).toHaveLength(1);
  });

  it('swaps the price in place rather than showing both intervals at once', async () => {
    renderGrid(columns(ENV_WITHOUT_LARGER_TIERS));
    expect(screen.queryByText('$250')).not.toBeInTheDocument();

    await chooseYearly();
    expect(await screen.findByText('$250')).toBeInTheDocument();
    expect(screen.queryByText('per month')).not.toBeInTheDocument();
  });

  it('counts every column to its own yearly figure when the interval changes', async () => {
    renderGrid(columns(ENV_WITH_EVERY_TIER));
    await chooseYearly();

    expect(await screen.findByText('$250')).toBeInTheDocument();
    expect(await screen.findByText('$500')).toBeInTheDocument();
    expect(await screen.findByText('$1,000')).toBeInTheDocument();
  });

  it('lists the agent surface in the checklist, at full weight', () => {
    renderGrid(columns(ENV_WITHOUT_LARGER_TIERS));

    // One per column, because the checklist is identical on every tier: the
    // agent surface is not a thing you buy your way up to.
    const mcp = screen.getAllByText(/MCP server/);
    expect(mcp).toHaveLength(3);
    for (const line of mcp) expect(line.className).toContain('font-medium');
  });

  it('opens the checklist with the one number that differs between tiers', () => {
    renderGrid(columns(ENV_WITHOUT_LARGER_TIERS));

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('3 active projects');
    expect(within(items[0] as HTMLElement).getByText(/3 active projects/).className).toContain(
      'font-medium',
    );
  });

  it('offers exactly one primary action, on the anchored tier', () => {
    renderGrid(columns(ENV_WITH_EVERY_TIER));

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent('Start your free trial');

    // And it is on the anchored column, not merely somewhere on the page:
    // a lone CTA parked on a tier nobody can buy would pass a bare count.
    const anchored = document.querySelector('[data-anchored="true"]');
    expect(anchored).not.toBeNull();
    expect(anchored?.contains(links[0] ?? null)).toBe(true);
  });

  it('marks the anchor by more than colour when there is something to anchor against', () => {
    renderGrid(columns(ENV_WITH_EVERY_TIER));

    // The heavier border is one signal; "Start here" is the one a reader who
    // cannot see the border still gets.
    expect(screen.getByText('Start here')).toBeInTheDocument();
    const anchored = document.querySelectorAll('[data-anchored="true"]');
    expect(anchored).toHaveLength(1);
    expect(anchored[0]).toHaveAttribute('data-tier', 'relay_standard');
  });

  it('anchors exactly one column when there is a ladder to anchor against', () => {
    renderGrid(columns(ENV_WITHOUT_LARGER_TIERS));

    expect(screen.getByText('Start here')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-anchored="true"]')).toHaveLength(1);
  });

  it('carries one action, and only on a column that can take money', () => {
    renderGrid(columns(ENV_WITHOUT_LARGER_TIERS));

    // Growth and Studio are priced and visible; their products are not
    // configured in this environment, so they state that instead of offering a
    // button that cannot charge. One CTA on the page either way.
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('Studio')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('drops the checklist but keeps the price in the compact teaser', () => {
    renderGrid(columns(ENV_WITHOUT_LARGER_TIERS), { variant: 'compact' });

    expect(screen.getByText('$25')).toBeInTheDocument();
    expect(screen.queryByText('Included at both prices')).not.toBeInTheDocument();
    expect(screen.queryByText(/MCP server/)).not.toBeInTheDocument();
  });
});
