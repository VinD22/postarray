import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EditorialVsTable } from './vs-table';

/**
 * The comparison table's truthfulness contract, which the editorial restyle
 * had to carry over intact from the loud version.
 *
 * The table exists so a comparison cannot overstate what this product does:
 * it owns no copy, so every claim on it is one the caller passed in, and a
 * yes/no is never communicated by colour or icon shape alone.
 */
describe('EditorialVsTable', () => {
  const columns = [
    { id: 'relay', label: 'This product', tone: 'own' as const },
    { id: 'other', label: 'Another tool' },
  ];

  it('renders text beside every boolean cell, never an icon alone', () => {
    render(
      <EditorialVsTable
        caption="Comparison"
        rowHeaderLabel="Axis"
        columns={columns}
        rows={[
          { id: 'receipts', label: 'Publication receipts', cells: { relay: true, other: false } },
        ]}
        trueLabel="Yes"
        falseLabel="No"
      />,
    );

    const row = screen.getByRole('row', { name: /Publication receipts/ });
    expect(within(row).getByText('Yes')).toBeInTheDocument();
    expect(within(row).getByText('No')).toBeInTheDocument();
  });

  it('renders only the cells the caller supplied, inventing nothing', () => {
    render(
      <EditorialVsTable
        caption="Comparison"
        rowHeaderLabel="Axis"
        columns={columns}
        // The competitor column is deliberately absent from `cells`: the fact
        // check has not happened, so there is nothing true to render.
        rows={[{ id: 'receipts', label: 'Publication receipts', cells: { relay: true } }]}
        trueLabel="Yes"
        falseLabel="No"
      />,
    );

    const row = screen.getByRole('row', { name: /Publication receipts/ });
    const cells = within(row).getAllByRole('cell');
    expect(cells).toHaveLength(2);
    expect(cells[0]).toHaveTextContent('Yes');
    expect(cells[1]).toHaveTextContent('');
  });

  it('keeps the caption available to assistive technology', () => {
    render(
      <EditorialVsTable
        caption="How this product compares"
        rowHeaderLabel="Axis"
        columns={columns}
        rows={[{ id: 'receipts', label: 'Publication receipts', cells: { relay: true } }]}
        trueLabel="Yes"
        falseLabel="No"
      />,
    );

    expect(screen.getByRole('table', { name: 'How this product compares' })).toBeInTheDocument();
  });
});
