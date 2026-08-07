import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { ApprovalReviewScreen } from '@/features/approvals/approval-review-screen';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return {
    title: intl.t.format('approval.requestTitle'),
    description: intl.t.format('approval.reviewDescription'),
  };
}

export default async function ApprovalPage({
  params,
}: {
  readonly params: Promise<{ readonly approvalId: string }>;
}): Promise<ReactElement> {
  const { approvalId } = await params;
  return <ApprovalReviewScreen approvalId={approvalId} actionCenterHref="/action-center" />;
}
