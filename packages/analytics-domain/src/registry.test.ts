import { describe, expect, it } from 'vitest';

import { PROVIDER_IDS, metricDefinitionSchema } from '@relay/contracts';

import {
  METRIC_MAPPINGS,
  definitionsDiffer,
  mappingForMetric,
  mappingsFor,
  supportedMetrics,
} from './registry';

describe('metric registry', () => {
  it('validates every definition against the shared contract', () => {
    for (const mapping of METRIC_MAPPINGS) {
      expect(metricDefinitionSchema.safeParse(mapping.definition).success).toBe(true);
    }
  });

  it('keeps the provider field name and the provider wording on every entry', () => {
    for (const mapping of METRIC_MAPPINGS) {
      expect(mapping.definition.providerField.length).toBeGreaterThan(0);
      expect(mapping.definition.definition.length).toBeGreaterThan(10);
    }
  });

  it('marks every mapping as needing re-verification until an engineer checks it', () => {
    for (const mapping of METRIC_MAPPINGS) {
      expect(mapping.needsReverification).toBe(true);
    }
  });

  it('only uses providers the shared contract knows about', () => {
    for (const mapping of METRIC_MAPPINGS) {
      expect(PROVIDER_IDS).toContain(mapping.definition.provider);
    }
  });

  it('does not map the same provider field twice for one scope', () => {
    const seen = new Set<string>();
    for (const mapping of METRIC_MAPPINGS) {
      const key = `${mapping.definition.provider}:${mapping.definition.scope}:${mapping.definition.providerField}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('records a metric a provider does not offer as unavailable rather than omitting it', () => {
    const mapping = mappingForMetric('bluesky', 'post', 'impressions');
    expect(mapping?.definition.availability).toBe('unavailable_provider');
    expect(supportedMetrics('bluesky', 'post')).not.toContain('impressions');
  });

  it('returns nothing for a provider and scope we do not map', () => {
    expect(mappingsFor('bluesky', 'account')).toEqual([]);
    expect(mappingForMetric('bluesky', 'account', 'likes')).toBeNull();
  });

  it('keeps the denominator with the metric so a rate is never assumed', () => {
    expect(mappingForMetric('linkedin', 'post', 'link_clicks')?.definition.denominator).toBe(
      'impressions',
    );
    expect(mappingForMetric('x', 'post', 'link_clicks')?.definition.denominator).toBe('none');
  });

  it('detects when two providers define the same metric differently', () => {
    const linkedin = mappingForMetric('linkedin', 'post', 'link_clicks');
    const x = mappingForMetric('x', 'post', 'link_clicks');
    expect(linkedin).not.toBeNull();
    expect(x).not.toBeNull();
    if (linkedin !== null && x !== null) {
      expect(definitionsDiffer(linkedin.definition, x.definition)).toBe(true);
      expect(definitionsDiffer(linkedin.definition, linkedin.definition)).toBe(false);
    }
  });

  it('converts a minutes based metric into seconds and says so', () => {
    const watchTime = mappingForMetric('youtube', 'post', 'watch_time');
    expect(watchTime?.definition.unit).toBe('seconds');
    expect(watchTime?.definition.providerField).toBe('estimatedMinutesWatched');
  });
});
