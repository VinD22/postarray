import { LoadingState, SkeletonList } from '@relay/design-system/patterns';
import { Skeleton } from '@relay/design-system/primitives';

import { getRequestIntl } from '@/lib/i18n/server';

/**
 * Home's own loading shape: the header, the two shortcut rows, the three
 * count tiles and the queue, so nothing jumps when the real page arrives.
 */
export default async function HomeLoading() {
  const intl = await getRequestIntl();

  return (
    <LoadingState label={intl.t.format('loading.default')}>
      <div aria-hidden="true" className="flex flex-col gap-2 px-[var(--layout-gutter)] pt-8">
        <Skeleton variant="block" width="16rem" className="h-9" />
        <Skeleton variant="text" width="28rem" />
      </div>
      <div aria-hidden="true" className="relay-page flex flex-col gap-10 py-8 md:py-10">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton variant="block" className="h-24 rounded-xl" />
          <Skeleton variant="block" className="h-24 rounded-xl" />
        </div>
        <div className="border-border-default grid grid-cols-2 gap-4 border-y py-4 md:grid-cols-3">
          <Skeleton variant="block" className="h-16" />
          <Skeleton variant="block" className="h-16" />
          <Skeleton variant="block" className="col-span-2 h-16 md:col-span-1" />
        </div>
        <SkeletonList rows={4} avatar={false} />
      </div>
    </LoadingState>
  );
}
