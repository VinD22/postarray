import type { ReactElement } from 'react';

import { PostingSetsRouteFallback } from '@/features/posting-sets/posting-sets-fallback';

export default function PostingSetsLoading(): ReactElement {
  return <PostingSetsRouteFallback />;
}
