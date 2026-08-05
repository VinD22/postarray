'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Whether the browser currently believes it has a connection.
 *
 * `useSyncExternalStore` rather than an effect plus state, so the value cannot
 * tear during hydration and a server render never claims to know. The server
 * snapshot is `true`: assuming online on the server keeps the markup identical
 * to the common case, and the first client snapshot corrects it immediately if
 * it is wrong.
 *
 * `navigator.onLine` only reports whether a network interface exists, so this
 * is used to explain stale figures and to disable actions that need the server.
 * It is never used to claim data is current.
 */
export function useOnlineStatus(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }
    window.addEventListener('online', onChange);
    window.addEventListener('offline', onChange);
    return () => {
      window.removeEventListener('online', onChange);
      window.removeEventListener('offline', onChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    if (typeof navigator === 'undefined') {
      return true;
    }
    return navigator.onLine;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
