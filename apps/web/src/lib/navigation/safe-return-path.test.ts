import { describe, expect, it } from 'vitest';

import { safeReturnPath } from './safe-return-path';

describe('safeReturnPath', () => {
  it('keeps same-origin paths with a query and fragment', () => {
    expect(safeReturnPath('/calendar?view=week#today')).toBe('/calendar?view=week#today');
  });

  it.each([
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
    'javascript:alert(1)',
    '/calendar\nSet-Cookie:test',
  ])('rejects an unsafe return destination: %s', (value) => {
    expect(safeReturnPath(value)).toBe('/home');
  });

  it('uses the caller fallback when no destination is present', () => {
    expect(safeReturnPath(null, '/onboarding')).toBe('/onboarding');
  });
});
