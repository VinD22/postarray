import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox, type ComboboxItem, type ComboboxMessages } from './combobox';

// Test fixtures only. Product copy lives in @relay/i18n.
const messages: ComboboxMessages = {
  label: 'Mention an account',
  placeholder: 'Search accounts',
  loading: 'Searching',
  empty: 'No accounts matched. Try the exact handle.',
  error: 'The account lookup failed.',
  toggle: 'Show results',
  resultCount: (count) => `${count} results`,
};

const ITEMS: ComboboxItem[] = [
  { id: 'ext_1', label: 'Relay HQ', description: '@relayhq' },
  { id: 'ext_2', label: 'Relay Support', description: '@relaysupport' },
  { id: 'ext_3', label: 'Relay Status', description: '@relaystatus', disabled: true },
];

function Example({
  items = ITEMS,
  status,
  onValueChange,
}: {
  items?: ComboboxItem[];
  status?: 'idle' | 'loading' | 'error' | 'ready';
  onValueChange?: (item: ComboboxItem | null) => void;
}): ReactNode {
  const [value, setValue] = useState<ComboboxItem | null>(null);
  const [query, setQuery] = useState('');
  return (
    <Combobox
      items={items}
      status={status ?? 'ready'}
      value={value}
      onValueChange={(item) => {
        setValue(item);
        onValueChange?.(item);
      }}
      inputValue={query}
      onInputValueChange={setQuery}
      messages={messages}
    />
  );
}

describe('Combobox', () => {
  it('exposes the ARIA combobox contract', () => {
    render(<Example />);
    const input = screen.getByRole('combobox', { name: messages.label });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-controls');
  });

  it('opens on ArrowDown and lists the options', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const input = screen.getByRole('combobox');
    input.focus();
    await user.keyboard('{ArrowDown}');

    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('keeps focus in the input and tracks the active option', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}');

    expect(input).toHaveFocus();
    const activeId = input.getAttribute('aria-activedescendant');
    expect(activeId).toBeTruthy();
    expect(document.getElementById(activeId ?? '')).toHaveTextContent('Relay Support');
  });

  it('skips a disabled option when moving', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    // From the first selectable option: down twice wraps past the disabled one.
    await user.keyboard('{ArrowDown}{ArrowDown}');
    const activeId = input.getAttribute('aria-activedescendant');
    expect(document.getElementById(activeId ?? '')).toHaveTextContent('Relay HQ');
  });

  it('commits the active option on Enter', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ id: 'ext_1' }));
    expect(input).toHaveValue('Relay HQ');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not resolve a selection from typed text alone', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await user.type(input, 'relayhq');
    await user.tab();

    expect(onValueChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ id: expect.any(String) }),
    );
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on Escape without selecting', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shows the empty explanation rather than an empty box', async () => {
    const user = userEvent.setup();
    render(<Example items={[]} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText(messages.empty)).toBeInTheDocument();
  });

  it('reports the lookup failure and marks itself busy while loading', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Example status="loading" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-busy', 'true');

    rerender(<Example status="error" />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getAllByText(messages.error).length).toBeGreaterThan(0);
  });

  it('clears a previous selection when the query is edited', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{Enter}');
    onValueChange.mockClear();

    await user.type(input, 'x');
    expect(onValueChange).toHaveBeenCalledWith(null);
  });
});
