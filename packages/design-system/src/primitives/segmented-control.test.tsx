import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl, type SegmentedControlItem } from './segmented-control';

// Fixtures only. Product copy lives in @relay/i18n.
const views: readonly SegmentedControlItem[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'list', label: 'List' },
];

function Controlled({
  initial = 'week',
  items = views,
  onChange,
}: {
  initial?: string;
  items?: readonly SegmentedControlItem[];
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <SegmentedControl
      aria-label="Calendar view"
      items={items}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe('SegmentedControl', () => {
  it('is a named radio group, not a toolbar or a tablist', () => {
    render(<Controlled />);
    const group = screen.getByRole('radiogroup', { name: 'Calendar view' });
    expect(group).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('renders one radio per item, with the selected one checked', () => {
    render(<Controlled />);
    const choices = screen.getAllByRole('radio');
    expect(choices).toHaveLength(4);
    expect(choices.map((el) => el.textContent)).toEqual(['Day', 'Week', 'Month', 'List']);
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Day' })).not.toBeChecked();
  });

  it('selects on click and reports the new value once', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Controlled onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'Month' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('month');
    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
  });

  it('moves and selects with an arrow key in one step', async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    screen.getByRole('radio', { name: 'Week' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Week' })).not.toBeChecked();
  });

  it('walks backwards too, and wraps at the ends', async () => {
    const user = userEvent.setup();
    render(<Controlled initial="day" />);

    screen.getByRole('radio', { name: 'Day' }).focus();
    await user.keyboard('{ArrowLeft}');

    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
  });

  it('is a single tab stop: only the selected segment is tabbable', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">before</button>
        <Controlled />
        <button type="button">after</button>
      </>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
  });

  it('cannot be cleared by pressing the segment that is already selected', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Controlled onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'Week' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });

  it('skips a disabled segment rather than selecting it', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Controlled
        initial="day"
        onChange={onChange}
        items={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week', disabled: true },
          { value: 'month', label: 'Month' },
        ]}
      />,
    );

    expect(screen.getByRole('radio', { name: 'Week' })).toBeDisabled();

    screen.getByRole('radio', { name: 'Day' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenLastCalledWith('month');
    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
  });

  it('hides the icon from assistive technology, so the label is the whole name', () => {
    render(
      <Controlled
        items={[
          { value: 'grid', label: 'Grid', icon: <svg data-testid="grid-icon" /> },
          { value: 'list', label: 'List' },
        ]}
        initial="grid"
      />,
    );

    const radio = screen.getByRole('radio', { name: 'Grid' });
    expect(radio).toBeInTheDocument();
    expect(screen.getByTestId('grid-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('carries a thumb that is decorative and never focusable', () => {
    const { container } = render(<Controlled />);
    const thumb = container.querySelector('.relay-segmented-thumb');
    expect(thumb).not.toBeNull();
    expect(thumb).toHaveAttribute('aria-hidden', 'true');
    expect(thumb?.tagName).toBe('SPAN');
  });

  it('marks each segment with its value so the thumb can find it', () => {
    render(<Controlled />);
    expect(
      screen.getAllByRole('radio').map((el) => el.getAttribute('data-segment-value')),
    ).toEqual(['day', 'week', 'month', 'list']);
  });
});
