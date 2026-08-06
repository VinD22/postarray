import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';

import { CapabilityMatrix } from './capability-matrix';
import { CAPABILITY_COLUMNS, CONNECTORS } from '../data/connectors';

describe('CapabilityMatrix', () => {
  it('renders a real table with a caption, column headers and row headers', async () => {
    render(await CapabilityMatrix({ locale: 'en' }));

    const table = screen.getByRole('table');
    expect(within(table).getByText(/Each cell names its state in words/i)).toBeInTheDocument();

    /* One header for the capability column, then one for each platform. */
    expect(within(table).getAllByRole('columnheader')).toHaveLength(CONNECTORS.length + 1);
    expect(within(table).getAllByRole('rowheader')).toHaveLength(CAPABILITY_COLUMNS.length);
  });

  it('states every cell in words rather than by colour alone', async () => {
    render(await CapabilityMatrix({ locale: 'en' }));

    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(CONNECTORS.length * CAPABILITY_COLUMNS.length);
    for (const cell of cells) {
      expect(cell.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });

  it('separates what a platform does not offer from what is not built yet', async () => {
    render(await CapabilityMatrix({ locale: 'en' }));

    expect(screen.getAllByText('Not built yet').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Platform does not offer it').length).toBeGreaterThan(0);
  });

  it('links every qualified cell to a numbered note that exists on the page', async () => {
    const { container } = render(await CapabilityMatrix({ locale: 'en' }));

    const references = Array.from(container.querySelectorAll('a[href^="#capability-note-"]'));
    expect(references.length).toBeGreaterThan(0);

    for (const reference of references) {
      const id = reference.getAttribute('href')?.slice(1) ?? '';
      expect(container.querySelector(`#${CSS.escape(id)}`), id).not.toBeNull();
    }
  });
});
