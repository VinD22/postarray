'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Whether the browser currently believes it has a connection.
 *
 * `OfflineBanner` needs a signal and shipped without one, so every screen that
 * wanted the banner brought its own. This is that signal, in the package the
 * banner lives in.
 *
 * `useSyncExternalStore` rather than an effect plus state, for two reasons.
 * The value cannot tear: two components reading it in the same render see the
 * same answer, which matters when one of them draws the banner and another
 * disables the publish button. And there is a real server snapshot instead of
 * a first paint that claims to know something the server cannot.
 *
 * That server snapshot is `true`. Rendering an offline banner for one frame on
 * every page load would be wrong far more often than right, and the first
 * client snapshot corrects it immediately when it is not.
 *
 * What this is not: `navigator.onLine` reports only that a network interface
 * exists. A captive portal, a dead uplink and a server that is down all read as
 * online. Use it to explain stale figures and to disable actions that need the
 * server. Never use it to claim data is current.
 */
export function useOnline(): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => undefined;
    window.addEventListener('online', onStoreChange);
    window.addEventListener('offline', onStoreChange);
    return () => {
      window.removeEventListener('online', onStoreChange);
      window.removeEventListener('offline', onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
  }, []);

  const getServerSnapshot = useCallback(() => true, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
