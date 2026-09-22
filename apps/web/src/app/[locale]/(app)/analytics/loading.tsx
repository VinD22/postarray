import { LoadingState, SkeletonTable } from '@relay/design-system/patterns';
import { Skeleton } from '@relay/design-system/primitives';

import { getRequestIntl } from '@/lib/i18n/server';

/**
 * The overview's loading shape inside the analytics header: the filter row,
 * the chart band and the ranked table.
 */
export default async function AnalyticsLoading() {
  const intl = await getRequestIntl();

  return (
    <div className="px-4 py-6 md:px-6">
      <LoadingState label={intl.t.format('analytics.state.loading')}>
        <div aria-hidden="true" className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            <Skeleton variant="block" width="10rem" className="h-10" />
            <Skeleton variant="block" width="10rem" className="h-10" />
            <Skeleton variant="block" width="8rem" className="h-10" />
          </div>
          <Skeleton variant="block" className="h-56" />
          <SkeletonTable rows={6} columns={5} />
        </div>
      </LoadingState>
    </div>
  );
}
