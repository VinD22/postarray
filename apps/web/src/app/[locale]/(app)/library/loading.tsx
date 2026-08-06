'use client';

import type { ReactNode } from 'react';
import { LoadingState, SkeletonTable } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

export default function LibraryLoading(): ReactNode {
  const t = useTranslations();
  return (
    <div className="px-4 pt-4 lg:px-6">
      <LoadingState label={t.full('mediaLib.loading')}>
        <SkeletonTable rows={8} columns={6} />
      </LoadingState>
    </div>
  );
}
