'use client';

/**
 * Whether the browser currently has a connection.
 *
 * The implementation now lives in the design system as `useOnline`, next to
 * `OfflineBanner`, which is the component that needed it. Two copies existed
 * here: this one and `features/analytics/use-online-status.ts`, and they did
 * not agree about hydration.
 *
 * The name is kept because a dozen call sites use it and renaming them is a
 * separate change from removing the duplicate.
 */
export { useOnline as useOnlineStatus } from '@relay/design-system/hooks';
