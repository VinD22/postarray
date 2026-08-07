import { newIdFor } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { createFeedSchema } from './rss.schemas';

const BASE_FEED = {
  brandId: newIdFor('brand'),
  title: 'Example feed',
  feedUrl: 'https://example.test/feed.xml',
} as const;

describe('RSS schemas', () => {
  it('allows only the draft-producing policies the service implements', () => {
    expect(createFeedSchema.safeParse({ ...BASE_FEED, publishPolicy: 'draft' }).success).toBe(true);
    expect(createFeedSchema.safeParse({ ...BASE_FEED, publishPolicy: 'approval' }).success).toBe(
      true,
    );
    expect(createFeedSchema.safeParse({ ...BASE_FEED, publishPolicy: 'immediate' }).success).toBe(
      false,
    );
  });
});
