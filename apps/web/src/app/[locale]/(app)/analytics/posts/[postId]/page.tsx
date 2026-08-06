import type { ReactElement } from 'react';

import { PostMetricsScreen } from '@/features/analytics/post-metrics-screen';

export default async function PostMetricsPage({
  params,
}: {
  readonly params: Promise<{ readonly postId: string }>;
}): Promise<ReactElement> {
  const { postId } = await params;
  return <PostMetricsScreen contentItemId={postId} />;
}
