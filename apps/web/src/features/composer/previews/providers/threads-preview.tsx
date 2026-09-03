'use client';

/**
 * Threads.
 *
 * A text post takes one link attachment, which the platform renders as a
 * compact preview of the destination rather than a full width card.
 */

import type { ReactNode } from 'react';
import { Heart, MessageCircle, Repeat2, Send } from 'lucide-react';

import { FeedPost } from '../parts/feed-post';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

export function ThreadsPreview({ model, device }: PreviewProps): ReactNode {
  return (
    <FeedPost
      model={model}
      device={device}
      providerName={PROVIDER_LABEL.threads}
      actionIcons={[Heart, MessageCircle, Repeat2, Send]}
    />
  );
}
