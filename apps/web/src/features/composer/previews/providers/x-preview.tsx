'use client';

/**
 * X.
 *
 * A body, attachments, then a card built from the destination's card markup.
 * The counter is the one that matters most here: X charges a fixed cost per
 * link whatever its length, and the snapshot's `linkCounting` is what the
 * counter reads, so a post with three long URLs counts the way X counts it.
 */

import type { ReactNode } from 'react';
import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';

import { FeedPost } from '../parts/feed-post';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

export function XPreview({ model, device }: PreviewProps): ReactNode {
  return (
    <FeedPost
      model={model}
      device={device}
      providerName={PROVIDER_LABEL.x}
      actionIcons={[MessageCircle, Repeat2, Heart, Bookmark]}
    />
  );
}
