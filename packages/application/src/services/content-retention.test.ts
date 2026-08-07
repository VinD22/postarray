import { describe, expect, it } from 'vitest';

import { mediaRetentionExpiryFromPostCreatedAt } from './content';

describe('post media retention', () => {
  it('anchors the cleanup deadline thirty days after post creation', () => {
    const createdAt = new Date('2026-08-07T10:15:00.000Z');

    expect(mediaRetentionExpiryFromPostCreatedAt(createdAt).toISOString()).toBe(
      '2026-09-06T10:15:00.000Z',
    );
  });
});
