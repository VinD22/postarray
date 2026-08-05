import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Button } from './button.js';

// Test fixtures only. Product copy lives in @relay/i18n.
const LABEL = 'Schedule';

describe('Button', () => {
  it('renders a button element with an accessible name', () => {
    render(<Button>{LABEL}</Button>);
    expect(screen.getByRole('button', { name: LABEL })).toBeInTheDocument();
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>{LABEL}</Button>);
    expect(screen.getByRole('button', { name: LABEL })).toHaveAttribute('type', 'button');
  });

  it('forwards its ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>{LABEL}</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('activates with Enter and with Space', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>{LABEL}</Button>);

    await user.tab();
    expect(screen.getByRole('button', { name: LABEL })).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('keeps the label in the layout while loading so the width does not change', () => {
    const { rerender } = render(<Button>{LABEL}</Button>);
    const idleText = screen.getByText(LABEL);
    expect(idleText).not.toHaveClass('invisible');

    rerender(<Button loading>{LABEL}</Button>);
    const loadingText = screen.getByText(LABEL);
    expect(loadingText).toHaveClass('invisible');
    expect(loadingText).toBeInTheDocument();
  });

  it('marks itself busy and disabled while loading', () => {
    render(<Button loading>{LABEL}</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('does not fire while loading', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button loading onClick={onClick}>
        {LABEL}
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes the loading label to assistive technology when supplied', () => {
    render(
      <Button loading loadingLabel="Scheduling">
        {LABEL}
      </Button>,
    );
    expect(screen.getByRole('status', { name: 'Scheduling' })).toBeInTheDocument();
  });

  it('hides decorative icons from assistive technology', () => {
    render(<Button iconStart={<svg data-testid="icon" />}>{LABEL}</Button>);
    const wrapper = screen.getByTestId('icon').parentElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the destructive variant without changing the accessible name', () => {
    render(<Button variant="destructive">{LABEL}</Button>);
    const button = screen.getByRole('button', { name: LABEL });
    expect(button.className).toContain('bg-destructive-solid');
  });

  it('renders as a child element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/queue">{LABEL}</a>
      </Button>,
    );
    expect(screen.getByRole('link', { name: LABEL })).toHaveAttribute('href', '/queue');
  });
});
