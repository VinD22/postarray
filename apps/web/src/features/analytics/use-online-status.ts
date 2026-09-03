'use client';

/**
 * Whether the browser currently believes it has a connection.
 *
 * This file was the better of the two copies the app carried, and the design
 * system's `useOnline` is that implementation moved next to `OfflineBanner`.
 * Analytics uses it for exactly what it is good for: explaining stale figures
 * and disabling actions that need the server. `navigator.onLine` reports that
 * a network interface exists and nothing more, so it never justifies a claim
 * that a number is current.
 */
export { useOnline as useOnlineStatus } from '@relay/design-system/hooks';
