import { describe, expect, it } from 'vitest';

import { isPathActive, stripLocalePrefix } from './active-path';

describe('stripLocalePrefix', () => {
  it('leaves an unprefixed path alone', () => {
    expect(stripLocalePrefix('/analytics')).toBe('/analytics');
    expect(stripLocalePrefix('/')).toBe('/');
  });

  it('removes an active locale prefix', () => {
    expect(stripLocalePrefix('/de/analytics/experiments')).toBe('/analytics/experiments');
  });

  it('turns a bare locale root into the root', () => {
    // Not the empty string: a caller comparing against '/' would otherwise
    // have to special-case the home page of every locale but English.
    expect(stripLocalePrefix('/de')).toBe('/');
  });

  it('does not mistake a route segment for a locale', () => {
    // 'des' is not a locale, and neither is a path that merely starts with
    // the same two letters.
    expect(stripLocalePrefix('/design')).toBe('/design');
  });
});

describe('isPathActive', () => {
  it('matches a section and everything inside it', () => {
    expect(isPathActive('/analytics/links', '/analytics')).toBe(true);
    expect(isPathActive('/analytics', '/analytics')).toBe(true);
  });

  it('matches outside the default locale, which is the bug it exists for', () => {
    expect(isPathActive('/de/analytics/links', '/analytics')).toBe(true);
    expect(isPathActive('/de/analytics/experiments', '/analytics/experiments')).toBe(true);
  });

  it('keeps a section index from staying lit inside its own children', () => {
    expect(isPathActive('/de/analytics/links', '/analytics', true)).toBe(false);
    expect(isPathActive('/de/analytics', '/analytics', true)).toBe(true);
  });

  it('does not match a sibling whose name starts the same way', () => {
    expect(isPathActive('/analytics-archive', '/analytics')).toBe(false);
  });
});
