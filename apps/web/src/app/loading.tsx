import { LoadingState, SkeletonList } from '@relay/design-system/patterns';

import { getRequestIntl } from '@/lib/i18n/server';

/**
 * The route-level loading state.
 *
 * It preserves the page shape rather than showing a spinner, so the layout does
 * not jump when the real content arrives, and it announces what is loading once
 * instead of once per placeholder row.
 */
export default async function Loading() {
  const intl = await getRequestIntl();

  return (
    <div className="p-4 md:p-6">
      <LoadingState label={intl.t.format('loading.default')}>
        <div className="flex flex-col gap-4">
          <div className="bg-surface-sunken h-7 w-48 animate-pulse rounded-md" />
          <SkeletonList rows={6} />
        </div>
      </LoadingState>
    </div>
  );
}
