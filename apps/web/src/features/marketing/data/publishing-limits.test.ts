import { CORE_PROVIDER_IDS } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { CONNECTOR_SOURCE } from './connectors';
import { PUBLISHING_LIMITS, PUBLISHING_LIMIT_PROVIDERS } from './publishing-limits';

describe('generated publishing limits', () => {
  it('covers the launch cohort, in cohort order', () => {
    expect(PUBLISHING_LIMIT_PROVIDERS).toEqual(CORE_PROVIDER_IDS);
    for (const provider of CORE_PROVIDER_IDS) {
      expect(PUBLISHING_LIMITS[provider]?.provider, provider).toBe(provider);
    }
  });

  it('cites the same source the reviewed connector record cites', () => {
    for (const record of CONNECTOR_SOURCE) {
      const row = PUBLISHING_LIMITS[record.id as keyof typeof PUBLISHING_LIMITS];
      if (row === undefined) {
        continue;
      }
      expect(row.source, record.id).toEqual({
        url: record.primarySource.url,
        readOn: record.primarySource.readOn,
      });
    }
  });

  it('carries a source and a read date wherever it carries a number', () => {
    for (const provider of PUBLISHING_LIMIT_PROVIDERS) {
      const row = PUBLISHING_LIMITS[provider];
      if (row.text === null) {
        continue;
      }
      expect(row.source, provider).not.toBeNull();
      expect(row.source?.url, provider).toMatch(/^https:\/\//u);
      expect(row.source?.readOn, provider).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
    }
  });

  it('renders a platform we cannot describe as unavailable, never as zero', () => {
    for (const provider of PUBLISHING_LIMIT_PROVIDERS) {
      const row = PUBLISHING_LIMITS[provider];
      if (row.adapterPresent) {
        expect(row.text, provider).not.toBeNull();
        expect(row.countingUnit, provider).not.toBeNull();
        continue;
      }
      expect(row.text, provider).toBeNull();
      expect(row.media, provider).toBeNull();
      expect(row.countingUnit, provider).toBeNull();
      expect(row.maxTitleLength, provider).toBeNull();
      expect(row.source, provider).toBeNull();
    }
  });

  it('never states a text ceiling of zero', () => {
    for (const provider of PUBLISHING_LIMIT_PROVIDERS) {
      const text = PUBLISHING_LIMITS[provider].text;
      if (text !== null) {
        expect(text.maxLength, provider).toBeGreaterThan(0);
      }
    }
  });

  it('only claims a fixed per link cost where it also knows the cost', () => {
    for (const provider of PUBLISHING_LIMIT_PROVIDERS) {
      const text = PUBLISHING_LIMITS[provider].text;
      if (text?.linkCountingMode === 'fixed') {
        expect(text.charactersPerLink, provider).toBeGreaterThan(0);
      }
    }
  });
});
