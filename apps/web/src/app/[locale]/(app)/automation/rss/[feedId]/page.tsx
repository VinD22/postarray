import type { ReactElement } from 'react';

import { FeedDetailScreen } from '@/features/automation/feed-detail-screen';

export default async function FeedPage({
  params,
}: {
  readonly params: Promise<{ readonly feedId: string }>;
}): Promise<ReactElement> {
  const { feedId } = await params;
  return <FeedDetailScreen feedId={feedId} />;
}
