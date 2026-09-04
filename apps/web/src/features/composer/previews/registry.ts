/**
 * Which component draws which platform.
 *
 * A lookup rather than a switch, so adding a platform is one line here and one
 * file beside it, and so a provider with no entry falls back rather than
 * throwing. There are nineteen providers and eleven components: the other
 * eight get the generic frame, which shows only what the model knows.
 */

import type { ProviderId } from '@relay/contracts';

import { BlueskyPreview } from './providers/bluesky-preview';
import { FacebookPreview } from './providers/facebook-preview';
import { GenericPreview } from './providers/generic-preview';
import { InstagramPreview } from './providers/instagram-preview';
import { LinkedInPreview } from './providers/linkedin-preview';
import { MastodonPreview } from './providers/mastodon-preview';
import { PinterestPreview } from './providers/pinterest-preview';
import { ThreadsPreview } from './providers/threads-preview';
import { TikTokPreview } from './providers/tiktok-preview';
import { XPreview } from './providers/x-preview';
import { YouTubePreview } from './providers/youtube-preview';
import type { PreviewComponent } from './types';

export const PREVIEW_REGISTRY: Partial<Record<ProviderId, PreviewComponent>> = {
  x: XPreview,
  instagram: InstagramPreview,
  linkedin: LinkedInPreview,
  facebook: FacebookPreview,
  threads: ThreadsPreview,
  bluesky: BlueskyPreview,
  tiktok: TikTokPreview,
  youtube: YouTubePreview,
  pinterest: PinterestPreview,
  mastodon: MastodonPreview,
};

export function getPreviewComponent(provider: ProviderId): PreviewComponent {
  return PREVIEW_REGISTRY[provider] ?? GenericPreview;
}
