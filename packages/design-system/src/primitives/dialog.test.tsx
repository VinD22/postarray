import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog.js';
import { Button } from './button.js';

// Test fixtures only. Product copy lives in @relay/i18n.
const TRIGGER = 'Disconnect account';
const TITLE = 'Disconnect the LinkedIn page';
const DESCRIPTION = 'Scheduled posts for this page will stop.';
const CLOSE = 'Close';
const CONFIRM = 'Disconnect';

function Example(): ReactNode {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{TRIGGER}</Button>
      </DialogTrigger>
      <DialogContent closeLabel={CLOSE}>
        <DialogHeader>
          <DialogTitle>{TITLE}</DialogTitle>
          <DialogDescription>{DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <input aria-label="Reason" />
        </DialogBody>
        <DialogFooter>
          <Button>{CONFIRM}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('is closed until the trigger is activated', () => {
    render(<Example />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens from the keyboard and exposes its name and description', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    await user.keyboard('{Enter}');

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAccessibleName(TITLE);
    expect(dialog).toHaveAccessibleDescription(DESCRIPTION);
  });

  it('moves focus into the dialog when it opens', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: TRIGGER }));

    const dialog = await screen.findByRole('dialog');
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: TRIGGER });
    await user.click(trigger);
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('renders a labelled close control', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: TRIGGER }));
    expect(await screen.findByRole('button', { name: CLOSE })).toBeInTheDocument();
  });

  it('closes when the close control is used', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: TRIGGER }));
    await user.click(await screen.findByRole('button', { name: CLOSE }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('keeps Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: TRIGGER }));
    const dialog = await screen.findByRole('dialog');

    for (let index = 0; index < 6; index += 1) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });
});
