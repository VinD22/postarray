import { describe, expect, it } from 'vitest';

import { PROVIDER_IDS } from './enums';
import { CORE_PROVIDER_IDS, isCoreProvider } from './launch-policy';

describe('launch provider policy', () => {
  it('offers the ten intentional launch providers in product order', () => {
    expect(CORE_PROVIDER_IDS).toEqual([
      'x',
      'instagram',
      'facebook',
      'linkedin',
      'tiktok',
      'youtube',
      'pinterest',
      'bluesky',
      'threads',
      'google_business_profile',
    ]);
  });

  it('keeps every cohort member inside the known provider enum', () => {
    for (const provider of CORE_PROVIDER_IDS) {
      expect(PROVIDER_IDS).toContain(provider);
    }
  });

  it('never offers the in-repo simulator as a customer provider', () => {
    expect(isCoreProvider('fake')).toBe(false);
  });

  it('keeps Reddit and Medium outside the launch cohort while their adapters remain', () => {
    expect(isCoreProvider('reddit')).toBe(false);
    expect(isCoreProvider('medium')).toBe(false);
    expect(PROVIDER_IDS).toContain('reddit');
    expect(PROVIDER_IDS).toContain('medium');
  });

  it('keeps the remaining long-tail adapters outside the cohort', () => {
    expect(isCoreProvider('mastodon')).toBe(false);
    expect(isCoreProvider('telegram')).toBe(false);
    expect(isCoreProvider('wordpress')).toBe(false);
    expect(isCoreProvider('devto')).toBe(false);
    expect(isCoreProvider('discord')).toBe(false);
    expect(isCoreProvider('slack')).toBe(false);
  });

  it('includes Google Business Profile', () => {
    expect(isCoreProvider('google_business_profile')).toBe(true);
  });
});
