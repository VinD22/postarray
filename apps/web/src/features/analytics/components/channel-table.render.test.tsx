import type { ReactElement, ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';

import type { ChannelRollup } from '../channels';
import { ChannelTable } from './channel-table';

/**
 * What this file holds is the rollup's honesty rather than its markup.
 *
 * A channel whose readings could not be added reports that it could not, in
 * words. A channel with nothing available reports nothing rather than zero.
 * And the whole thing is one table, because six accounts compared against each
 * other need aligned columns, not six boxes.
 */

function mount(node: ReactNode): ReactElement {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Madrid">
      {node}
    </I18nProvider>
  );
}

const rollup = (overrides: Partial<ChannelRollup> = {}): ChannelRollup => ({
  account: { connectionId: 'a', provider: 'x', handle: 'anna', displayName: 'Anna' },
  postsMeasured: 3,
  total: 300,
  addable: true,
  unavailableCount: 0,
  freshness: null,
  ...overrides,
});

describe('ChannelTable', () => {
  it('is one table with a caption, not a row of cards', () => {
    render(mount(<ChannelTable rollups={[rollup()]} rankMetric="impressions" comparing={false} />));
    expect(screen.getByRole('table', { name: /channels in this period/i })).toBeInTheDocument();
  });

  it('says why a total is missing rather than showing a dash', () => {
    render(
      mount(
        <ChannelTable
          rollups={[rollup({ total: null, addable: false })]}
          rankMetric="impressions"
          comparing={false}
        />,
      ),
    );
    const row = screen.getByRole('row', { name: /Anna/ });
    expect(within(row).getByText(/Unavailable/)).toBeInTheDocument();
    expect(within(row).getByText(/not a metric this provider allows to be added up/i))
      .toBeInTheDocument();
    expect(within(row).queryByText('—')).not.toBeInTheDocument();
  });

  it('never renders a missing total as zero', () => {
    render(
      mount(
        <ChannelTable
          rollups={[rollup({ total: null, postsMeasured: 0, unavailableCount: 0 })]}
          rankMetric="impressions"
          comparing={false}
        />,
      ),
    );
    // The account is a row header, so the first cell is the post count. Count
    // columns legitimately hold zeros; the metric total must not.
    const cells = screen.getAllByRole('cell').map((cell) => cell.textContent);
    expect(cells[0]).toBe('0');
    expect(cells[1]).toContain('Unavailable');
    expect(cells[1]).not.toBe('0');
  });

  it('shows both numbers when comparing, never a bare percentage', () => {
    render(
      mount(
        <ChannelTable
          rollups={[rollup({ total: 300 })]}
          previous={[rollup({ total: 200 })]}
          rankMetric="impressions"
          comparing
        />,
      ),
    );
    expect(screen.getByText(/300 this period against 200 in the previous one/)).toBeInTheDocument();
  });

  it('says so when the account had nothing in the previous period', () => {
    render(
      mount(
        <ChannelTable
          rollups={[rollup({ total: 300 })]}
          previous={[]}
          rankMetric="impressions"
          comparing
        />,
      ),
    );
    expect(screen.getByText(/Nothing was measured for this account/)).toBeInTheDocument();
  });

  it('announces the sort state on the header cell rather than implying it', async () => {
    const user = userEvent.setup();
    render(
      mount(
        <ChannelTable
          rollups={[rollup({ account: { connectionId: 'a', provider: 'x', handle: 'a', displayName: 'Anna' } }), rollup({ account: { connectionId: 'b', provider: 'x', handle: 'b', displayName: 'Bo' }, total: 900 })]}
          rankMetric="impressions"
          comparing={false}
        />,
      ),
    );

    const header = screen.getByRole('columnheader', { name: /posts measured/i });
    expect(header).toHaveAttribute('aria-sort', 'none');
    await user.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'descending');
    await user.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'ascending');
  });
});
