import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';

import { Link } from './link';
import { registerUnsavedChanges } from '@/lib/navigation/unsaved-changes';

/**
 * The guard lives here because this is the component every in-app navigation
 * goes through. What is held: a clean app navigates normally, a dirty one asks
 * first, and answering no keeps the person exactly where they were.
 */

function mount(): React.ReactElement {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
      <Link href="/calendar">Calendar</Link>
    </I18nProvider>
  );
}

/** Counts the clicks that were allowed to reach the document. */
function countAllowedClicks(): { readonly total: () => number; readonly stop: () => void } {
  let total = 0;
  const listener = (event: Event): void => {
    if (!event.defaultPrevented) {
      total += 1;
    }
    event.preventDefault();
  };
  document.addEventListener('click', listener);
  return {
    total: () => total,
    stop: () => document.removeEventListener('click', listener),
  };
}

describe('Link', () => {
  it('navigates without a question when nothing is unsaved', async () => {
    const clicks = countAllowedClicks();
    render(mount());

    await userEvent.click(screen.getByRole('link', { name: 'Calendar' }));

    expect(clicks.total()).toBe(1);
    clicks.stop();
  });

  it('asks before leaving unsaved work, and stays put when the answer is no', async () => {
    const clicks = countAllowedClicks();
    const confirmLeave = vi.fn(() => Promise.resolve(false));
    const unregister = registerUnsavedChanges({ isDirty: () => true, confirmLeave });
    render(mount());

    await userEvent.click(screen.getByRole('link', { name: 'Calendar' }));

    expect(confirmLeave).toHaveBeenCalledTimes(1);
    // The click was taken, so nothing navigated.
    expect(clicks.total()).toBe(0);
    unregister();
    clicks.stop();
  });

  it('goes where the person asked once they confirm', async () => {
    const clicks = countAllowedClicks();
    const unregister = registerUnsavedChanges({
      isDirty: () => true,
      confirmLeave: () => Promise.resolve(true),
    });
    render(mount());

    await userEvent.click(screen.getByRole('link', { name: 'Calendar' }));
    // The confirmation resolves on a microtask, and the replayed click follows.
    await Promise.resolve();

    expect(clicks.total()).toBe(1);
    unregister();
    clicks.stop();
  });
});
