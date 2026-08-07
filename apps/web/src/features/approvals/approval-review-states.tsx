'use client';

import type { ReactNode } from 'react';

import {
  LoadingState,
  PageHeader,
  SkeletonList,
  SkeletonText,
} from '@relay/design-system/patterns';

import { useTranslations } from '@/lib/i18n';

export function ApprovalFrame({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}): ReactNode {
  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={title} />
      <div className="px-4 py-6 md:px-6">{children}</div>
    </div>
  );
}

export function ApprovalLoading(): ReactNode {
  const t = useTranslations();
  return (
    <ApprovalFrame title={t('approval.requestTitle')}>
      <LoadingState label={t('loading.default')}>
        <div className="flex max-w-4xl flex-col gap-6">
          <SkeletonText lines={2} />
          <SkeletonList rows={3} avatar={false} />
        </div>
      </LoadingState>
    </ApprovalFrame>
  );
}
