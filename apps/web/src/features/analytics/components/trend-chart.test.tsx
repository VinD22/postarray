import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';
import { describe, expect, it } from 'vitest';

import type { MetricSeriesView } from '../types';
import { TrendChart } from './trend-chart';

function renderChart(series: readonly MetricSeriesView[]) {
  return render(
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
      <TrendChart
        series={series}
        unit="count"
        title="Impressions over time"
        summary="Impressions on X, 4 points from 1 August to 4 August."
      />
    </I18nProvider>,
  );
}

const withGap: MetricSeriesView = {
  id: 'impressions',
  normalizedName: 'impressions',
  unit: 'count',
  label: 'Impressions',
  points: [
    { bucketStart: '2026-08-01T00:00:00Z', bucketSeconds: 86_400, value: 1200 },
    { bucketStart: '2026-08-02T00:00:00Z', bucketSeconds: 86_400, value: null },
    { bucketStart: '2026-08-03T00:00:00Z', bucketSeconds: 86_400, value: 1800 },
    { bucketStart: '2026-08-04T00:00:00Z', bucketSeconds: 86_400, value: 900 },
  ],
};

describe('TrendChart', () => {
  it('exposes the series as an image with a sentence summary', () => {
    renderChart([withGap]);
    expect(
      screen.getByRole('img', {
        name: 'Impressions on X, 4 points from 1 August to 4 August.',
      }),
    ).toBeTruthy();
  });

  it('never renders a missing observation as zero', async () => {
    const user = userEvent.setup();
    renderChart([withGap]);
    await user.click(screen.getByRole('button', { name: 'Show as a table' }));

    const table = screen.getByRole('table');
    const cells = within(table).getAllByRole('cell');
    const values = cells.map((cell) => cell.textContent);
    expect(values).toContain('No data collected');
    expect(values).not.toContain('0');
  });

  it('explains the break in the line rather than interpolating over it', () => {
    renderChart([withGap]);
    expect(
      screen.getByText(
        'A break in the line means no observation was collected for that period. It does not mean zero.',
      ),
    ).toBeTruthy();
  });

  it('breaks the path at a gap instead of drawing through it', () => {
    const { container } = renderChart([withGap]);
    // Two observed runs either side of the missing day means two polylines.
    expect(container.querySelectorAll('polyline').length).toBe(2);
  });

  it('names both series in a legend when there is more than one', () => {
    renderChart([
      withGap,
      {
        ...withGap,
        id: 'clicks',
        normalizedName: 'link_clicks',
        label: 'Deduplicated clicks',
      },
    ]);
    // Each series name also appears in the chart's sentence summary for screen
    // readers, so the assertion is scoped to the legend itself.
    const legend = screen.getByRole('list', { name: /series shown/i });
    expect(within(legend).getByText('Deduplicated clicks')).toBeTruthy();
    expect(within(legend).getByText('Impressions')).toBeTruthy();
  });

  it('says so plainly when nothing was collected at all', () => {
    renderChart([{ ...withGap, points: [] }]);
    expect(screen.getByText('No observations were collected in this range.')).toBeTruthy();
  });
});
