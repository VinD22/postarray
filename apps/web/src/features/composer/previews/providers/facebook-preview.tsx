'use client';

/**
 * Facebook.
 *
 * A shared link renders from the destination's Open Graph markup, so the card
 * appears here with the address alone until something in Post Array actually
 * reads that markup.
 */

import type { ReactNode } from 'react';
import { MessageCircle, Share2, ThumbsUp } from 'lucide-react';

import { FeedPost } from '../parts/feed-post';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

export function FacebookPreview({ model, device }: PreviewProps): ReactNode {
  return (
    <FeedPost
      model={model}
      device={device}
      providerName={PROVIDER_LABEL.facebook}
      actionIcons={[ThumbsUp, MessageCircle, Share2]}
    />
  );
}
