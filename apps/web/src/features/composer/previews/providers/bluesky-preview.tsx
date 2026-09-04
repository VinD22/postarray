'use client';

/**
 * Bluesky.
 *
 * Bluesky counts what is written, with no fixed cost per link, which is why
 * the same body can be under the limit here and over it on X. The counter
 * reads the snapshot rather than the provider name, so that difference shows
 * up without this file knowing about it.
 */

import type { ReactNode } from 'react';
import { Heart, MessageCircle, Repeat2 } from 'lucide-react';

import { FeedPost } from '../parts/feed-post';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

export function BlueskyPreview({ model, device }: PreviewProps): ReactNode {
  return (
    <FeedPost
      model={model}
      device={device}
      providerName={PROVIDER_LABEL.bluesky}
      actionIcons={[MessageCircle, Repeat2, Heart]}
    />
  );
}
