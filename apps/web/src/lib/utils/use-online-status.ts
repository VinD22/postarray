'use client';

import { useEffect, useState } from 'react';

/**
 * Whether the browser currently has a connection.
 *
 * Starts optimistic on the server and during hydration, because rendering an
 * offline banner for one frame on every page load would be a lie more often
 * than it would be true.
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => {
      setOnline(navigator.onLine);
    };
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return online;
}
