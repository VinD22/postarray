import { afterEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useOnline } from './use-online';

function Probe() {
  return <output>{useOnline() ? 'online' : 'offline'}</output>;
}

/** jsdom's `navigator.onLine` is a getter, so it is replaced rather than set. */
const setNavigatorOnline = (value: boolean): void => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    get: () => value,
  });
};

const fireConnectivity = (event: 'online' | 'offline', value: boolean): void => {
  setNavigatorOnline(value);
  act(() => {
    window.dispatchEvent(new Event(event));
  });
};

afterEach(() => {
  setNavigatorOnline(true);
});

describe('useOnline', () => {
  it('reads the browser state on the first client render', () => {
    setNavigatorOnline(false);
    render(<Probe />);
    expect(screen.getByRole('status')).toHaveTextContent('offline');
  });

  it('reports online when the browser says so', () => {
    setNavigatorOnline(true);
    render(<Probe />);
    expect(screen.getByRole('status')).toHaveTextContent('online');
  });

  it('follows the offline event', () => {
    render(<Probe />);
    fireConnectivity('offline', false);
    expect(screen.getByRole('status')).toHaveTextContent('offline');
  });

  it('follows the connection coming back', () => {
    setNavigatorOnline(false);
    render(<Probe />);
    expect(screen.getByRole('status')).toHaveTextContent('offline');

    fireConnectivity('online', true);
    expect(screen.getByRole('status')).toHaveTextContent('online');
  });

  it('gives every reader the same answer in the same render', () => {
    setNavigatorOnline(false);
    render(
      <>
        <Probe />
        <Probe />
      </>,
    );
    const [first, second] = screen.getAllByRole('status');
    expect(first?.textContent).toBe(second?.textContent);
    expect(first).toHaveTextContent('offline');
  });

  it('stops listening when the last reader unmounts', () => {
    const { unmount } = render(<Probe />);
    unmount();

    // Nothing left to update. If the listener survived the unmount this would
    // warn about setting state on an unmounted tree.
    setNavigatorOnline(false);
    window.dispatchEvent(new Event('offline'));
    expect(screen.queryByRole('status')).toBeNull();
  });
});
