import type { ReactElement } from 'react';

import { LinkDetailScreen } from '@/features/links/link-detail-screen';
import { requireSession } from '@/lib/auth/require-session';

export default async function TrackedLinkPage({
  params,
}: {
  readonly params: Promise<{ readonly linkId: string }>;
}): Promise<ReactElement> {
  const { linkId } = await params;
  const session = await requireSession(`/analytics/links/${linkId}`);
  return (
    <LinkDetailScreen
      linkId={linkId}
      ianaTimeZone={session.workspace.timeZone}
      abuseReportHref="/support/abuse"
    />
  );
}
