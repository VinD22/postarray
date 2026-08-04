import { useCallback, useSyncExternalStore } from 'react';
import { breakpoints, type BreakpointKey } from '../tokens/tokens.js';

/**
 * Subscribes to a media query without tearing during hydration.
 *
 * `serverValue` is what the server assumes. Default it to the value that keeps
 * content visible: on the server we assume the small screen, because a layout
 * that starts stacked and widens never hides anything, while one that starts
 * wide and collapses can flash a broken frame.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return () => undefined;
      }
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return serverValue;
    return window.matchMedia(query).matches;
  }, [query, serverValue]);

  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True when the viewport is at least the named breakpoint wide. */
export function useBreakpoint(name: BreakpointKey, serverValue = false): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[name]}px)`, serverValue);
}

/** True on a device whose primary pointer is coarse, so targets need 44px. */
export function useCoarsePointer(serverValue = false): boolean {
  return useMediaQuery('(pointer: coarse)', serverValue);
}
