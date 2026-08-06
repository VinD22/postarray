import { LoadingState, SkeletonList } from '@relay/design-system/patterns';
import { Skeleton } from '@relay/design-system/primitives';

import { getRequestIntl } from '@/lib/i18n/server';

/**
 * The `(app)` group's fallback loading shell (WP-11 — global boundaries).
 *
 * Every screen that has its own route-level `loading.tsx` (calendar,
 * connections, compose, library, receipts) keeps its own page-shaped one —
 * this is the fallback for everything else under the shell (home, settings,
 * automation, growth, analytics, the action center) that does not. `AppShell`
 * itself never unmounts for this boundary: only the `<main>` region it wraps
 * is replaced, so the header, the nav rail and the mobile bar stay in place
 * and the layout does not jump once the real page arrives.
 *
 * The two placeholder blocks below borrow the settings screen's own "2px
 * outlined card" shape (WP-11's `SettingsPanel`) rather than a generic gray
 * box, so what's on screen while data loads is recognizably this product's
 * shell, not a stock spinner.
 */
export default async function AppLoading() {
  const intl = await getRequestIntl();

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <LoadingState label={intl.t.format('loading.default')}>
        <div className="flex flex-col gap-6">
          <div aria-hidden="true" className="flex flex-col gap-2">
            <Skeleton variant="block" width="14rem" className="h-7" />
            <Skeleton variant="text" width="26rem" />
          </div>

          <div
            aria-hidden="true"
            className="border-border-bold bg-surface-raised rounded-lg border-2 p-4 md:p-6"
          >
            <SkeletonList rows={4} />
          </div>

          <div
            aria-hidden="true"
            className="border-border-bold bg-surface-raised rounded-lg border-2 p-4 md:p-6"
          >
            <SkeletonList rows={3} avatar={false} />
          </div>
        </div>
      </LoadingState>
    </div>
  );
}
