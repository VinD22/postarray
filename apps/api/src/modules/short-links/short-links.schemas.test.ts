import { describe, expect, it } from 'vitest';

import {
  createShortLinkSchema,
  setShortLinkEnabledSchema,
  updateShortLinkDestinationSchema,
} from './short-links.schemas';

describe('short link schemas', () => {
  it('accepts a safe vanity slug and explicit expiry', () => {
    const parsed = createShortLinkSchema.parse({
      destinationUrl: 'https://example.test/launch',
      slug: 'launch_2026',
      expiresAt: '2026-09-01T00:00:00.000Z',
      utm: { source: 'relay', medium: 'social' },
    });
    expect(parsed.slug).toBe('launch_2026');
    expect(parsed.utm).toEqual({ source: 'relay', medium: 'social' });
  });

  it('requires a reason for destination changes', () => {
    expect(
      updateShortLinkDestinationSchema.safeParse({
        destinationUrl: 'https://example.test/new',
        reason: '',
      }).success,
    ).toBe(false);
  });

  it('keeps enablement explicit', () => {
    expect(setShortLinkEnabledSchema.parse({ enabled: false })).toEqual({
      enabled: false,
      reason: '',
    });
  });
});
