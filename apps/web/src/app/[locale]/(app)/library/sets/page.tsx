import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { Suspense } from 'react';

import { PostingSetsContainer } from '@/features/posting-sets/posting-sets-container';
import { PostingSetsRouteFallback } from '@/features/posting-sets/posting-sets-fallback';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return {
    title: intl.t.format('set.title'),
    description: intl.t.format('set.lede'),
  };
}

/**
 * Posting Sets, under Library.
 *
 * A Set is saved, reusable material a post starts from, which is what the
 * Library holds, so the information architecture puts it here rather than in
 * Settings. The container reads the session and the connection list, both
 * client concerns, so it sits behind a Suspense boundary.
 */
export default function PostingSetsPage(): ReactElement {
  return (
    <Suspense fallback={<PostingSetsRouteFallback />}>
      <PostingSetsContainer />
    </Suspense>
  );
}
