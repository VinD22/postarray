'use client';

/**
 * Mastodon.
 *
 * A status carries a preview card for the first link it contains. Instance
 * limits differ, so nothing about the length is stated here: the snapshot for
 * this connection is what the counter reads.
 */

import type { ReactNode } from 'react';
import { Repeat2, Reply, Star } from 'lucide-react';

import { FeedPost } from '../parts/feed-post';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

export function MastodonPreview({ model, device }: PreviewProps): ReactNode {
  return (
    <FeedPost
      model={model}
      device={device}
      providerName={PROVIDER_LABEL.mastodon}
      actionIcons={[Reply, Repeat2, Star]}
    />
  );
}
