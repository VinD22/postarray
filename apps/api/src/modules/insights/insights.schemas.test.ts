import { newIdFor } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { generateDigestSchema, listInsightsQuerySchema } from './insights.schemas';

describe('weekly digest transport schemas', () => {
  it('defaults a rebuild request to leaving an existing week alone', () => {
    const result = generateDigestSchema.safeParse({});

    expect(result.success).toBe(true);
    expect(result.success && result.data.replaceExisting).toBe(false);
  });

  it('accepts one specific week', () => {
    const result = generateDigestSchema.safeParse({
      windowStart: '2026-08-03',
      replaceExisting: true,
    });

    expect(result.success).toBe(true);
  });

  it('refuses a window that is not a calendar date', () => {
    expect(generateDigestSchema.safeParse({ windowStart: 'last week' }).success).toBe(false);
    expect(generateDigestSchema.safeParse({ windowStart: '2026-08-03T00:00:00Z' }).success).toBe(
      false,
    );
  });

  it('refuses an unknown field rather than ignoring it', () => {
    expect(generateDigestSchema.safeParse({ windowStart: '2026-08-03', force: true }).success).toBe(
      false,
    );
  });

  it('parses a content item filter with its prefix', () => {
    expect(
      listInsightsQuerySchema.safeParse({ contentItemId: newIdFor('contentItem') }).success,
    ).toBe(true);
    expect(listInsightsQuerySchema.safeParse({ contentItemId: newIdFor('receipt') }).success).toBe(
      false,
    );
  });
});
