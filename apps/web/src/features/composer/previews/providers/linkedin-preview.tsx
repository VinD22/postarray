'use client';

/**
 * LinkedIn.
 *
 * The post body is `commentary` and a shared article carries the destination's
 * own title, description and thumbnail. The composer's title field belongs to
 * the master draft rather than to a LinkedIn share, so it is not shown here.
 */

import type { ReactNode } from 'react';
import { MessageSquare, Repeat, Send, ThumbsUp } from 'lucide-react';

import { FeedPost } from '../parts/feed-post';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

export function LinkedInPreview({ model, device }: PreviewProps): ReactNode {
  return (
    <FeedPost
      model={model}
      device={device}
      providerName={PROVIDER_LABEL.linkedin}
      actionIcons={[ThumbsUp, MessageSquare, Repeat, Send]}
    />
  );
}
