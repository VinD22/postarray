/**
 * What a keystroke is allowed to match.
 *
 * The case that brought this file into existence: a binding registered as `?`
 * could never fire, because pressing that key sets `shiftKey` and reports
 * `key: '?'` at the same time, and the hook was building `shift+?` and
 * comparing it against `?`. The composer had registered `?` for its help panel
 * and it had never once fired. Both spellings now match, and the tests below
 * fail in both directions: a shifted symbol matches either way, and a shifted
 * letter still does not.
 */

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useHotkeys, type HotkeyMap, type HotkeyOptions } from './use-hotkeys';

function Harness({
  map,
  options,
}: {
  readonly map: HotkeyMap;
  readonly options?: HotkeyOptions;
}): null {
  useHotkeys(map, options);
  return null;
}

/** Dispatches one synthetic keystroke at the document, as the browser would. */
function press(init: KeyboardEventInit): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ...init }));
}

describe('useHotkeys', () => {
  it('fires a binding written as a bare shifted symbol', () => {
    const handler = vi.fn();
    render(<Harness map={{ '?': handler }} />);

    press({ key: '?', shiftKey: true });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('fires a binding written with the shift spelled out', () => {
    const handler = vi.fn();
    render(<Harness map={{ 'shift+?': handler }} />);

    press({ key: '?', shiftKey: true });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('keeps shift meaningful on a letter', () => {
    // `mod+shift+c` and `mod+c` are two different shortcuts. Dropping shift
    // from a letter the way it is dropped from a symbol would merge them.
    const handler = vi.fn();
    render(<Harness map={{ 'ctrl+c': handler }} />);

    press({ key: 'c', ctrlKey: true, shiftKey: true });

    expect(handler).not.toHaveBeenCalled();
  });

  it('matches a modifier combination on a letter', () => {
    const handler = vi.fn();
    render(<Harness map={{ 'ctrl+shift+c': handler }} />);

    press({ key: 'C', ctrlKey: true, shiftKey: true });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('stays out of a text field unless the binding asks to be there', () => {
    const inField = vi.fn();
    const everywhere = vi.fn();
    const { container } = render(
      <>
        <Harness map={{ '?': inField }} />
        <Harness map={{ '?': everywhere }} options={{ enableInFormFields: true }} />
        <input />
      </>,
    );

    const input = container.querySelector('input');
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: '?', shiftKey: true, bubbles: true }));

    expect(inField).not.toHaveBeenCalled();
    expect(everywhere).toHaveBeenCalledTimes(1);
  });
});
