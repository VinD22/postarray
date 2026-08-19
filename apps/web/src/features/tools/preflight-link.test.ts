import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/features/marketing/site';

import { PREFLIGHT_PROVIDERS } from './preflight';
import { parsePreflightPlatforms, preflightPlatformHref } from './preflight-link';

/**
 * The deep link from a specs page into the checker.
 *
 * The parser is the half that can go wrong quietly, so it is tested for what
 * it refuses as much as for what it accepts: an unknown slug must be dropped
 * rather than turned into a provider, and a query that names nothing usable
 * must return an empty selection so the checker keeps its own defaults instead
 * of silently unticking every platform.
 */
describe('preflightPlatformHref', () => {
  it('points at the tool with the platform named', () => {
    expect(preflightPlatformHref('instagram')).toBe(
      `${ROUTES.toolPostPreflight}?platform=instagram`,
    );
  });

  it('round trips every provider the checker offers', () => {
    for (const provider of PREFLIGHT_PROVIDERS) {
      const slug = provider.replace(/_/g, '-');
      const href = preflightPlatformHref(slug);
      const query = href.slice(href.indexOf('?'));
      expect(parsePreflightPlatforms(query), provider).toEqual([provider]);
    }
  });
});

describe('parsePreflightPlatforms', () => {
  it('reads a repeated parameter', () => {
    expect(parsePreflightPlatforms('?platform=x&platform=bluesky')).toEqual(['x', 'bluesky']);
  });

  it('reads a comma separated list and tolerates spacing and case', () => {
    expect(parsePreflightPlatforms('?platform=X,%20bluesky')).toEqual(['x', 'bluesky']);
  });

  it('returns providers in the order the dataset declares them', () => {
    expect(parsePreflightPlatforms('?platform=bluesky&platform=x')).toEqual(['x', 'bluesky']);
  });

  it('deduplicates', () => {
    expect(parsePreflightPlatforms('?platform=x&platform=x')).toEqual(['x']);
  });

  it('drops a slug it does not recognize instead of guessing', () => {
    expect(parsePreflightPlatforms('?platform=myspace')).toEqual([]);
    expect(parsePreflightPlatforms('?platform=myspace&platform=x')).toEqual(['x']);
  });

  it('returns nothing for a query that asks for nothing', () => {
    expect(parsePreflightPlatforms('')).toEqual([]);
    expect(parsePreflightPlatforms('?platform=')).toEqual([]);
    expect(parsePreflightPlatforms('?draft=hello')).toEqual([]);
  });

  it('maps an underscored provider id through its hyphenated slug', () => {
    expect(parsePreflightPlatforms('?platform=google-business-profile')).toEqual([
      'google_business_profile',
    ]);
    expect(parsePreflightPlatforms('?platform=google_business_profile')).toEqual([]);
  });
});
