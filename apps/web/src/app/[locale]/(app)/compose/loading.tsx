/**
 * The route-level loading state. Layout preserving, and it says what is being
 * fetched rather than spinning without a subject.
 */

'use client';

import type { ReactNode } from 'react';
import { LoadingState, SkeletonList, SkeletonText } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

export default function ComposeLoading(): ReactNode {
  const t = useTranslations();
  return (
    <div className="px-4 pt-4 lg:px-6">
      <LoadingState label={t.full('composerWeb.page.loading')}>
        <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_22rem]">
          <SkeletonList rows={5} avatar />
          <SkeletonText lines={10} />
          <SkeletonText lines={6} />
        </div>
      </LoadingState>
    </div>
  );
}
