import type { ReactElement } from 'react';

import { LinkDetailScreen } from '@/features/links/link-detail-screen';

export default async function TrackedLinkPage({
  params,
}: {
  readonly params: Promise<{ readonly linkId: string }>;
}): Promise<ReactElement> {
  const { linkId } = await params;
  return <LinkDetailScreen linkId={linkId} abuseReportHref="/support/abuse" />;
}
