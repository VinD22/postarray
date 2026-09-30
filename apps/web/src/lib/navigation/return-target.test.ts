import { describe, expect, it } from 'vitest';

import { resolveReturnTarget, returnTargetParam } from './return-target';

const API = 'https://api.postarray.com';
const AUTHORIZE =
  'https://api.postarray.com/oauth/authorize?response_type=code&client_id=rly_dc_x&state=abc';

describe('resolveReturnTarget', () => {
  it('returns to an OAuth authorization request on our own API', () => {
    expect(resolveReturnTarget(AUTHORIZE, API)).toEqual({ kind: 'authorize', url: AUTHORIZE });
  });

  it.each([
    'https://evil.example/oauth/authorize?client_id=x',
    'https://api.postarray.com.evil.example/oauth/authorize',
    'http://api.postarray.com/oauth/authorize',
    'https://api.postarray.com/v1/content',
    'https://api.postarray.com/oauth/authorize/../../v1',
    'https://user:pass@api.postarray.com/oauth/authorize',
    'https://api.postarray.com/oauth/authorize#frag',
    '//api.postarray.com/oauth/authorize',
    'javascript:alert(1)',
  ])('never leaves this app for anything else: %s', (value) => {
    expect(resolveReturnTarget(value, API)).toEqual({ kind: 'path', path: '/home' });
  });

  it('keeps same-origin paths, and refuses an authorize URL when no API is configured', () => {
    expect(resolveReturnTarget('/calendar', API)).toEqual({ kind: 'path', path: '/calendar' });
    expect(resolveReturnTarget(AUTHORIZE, null)).toEqual({ kind: 'path', path: '/home' });
  });

  it('carries the destination forward unchanged', () => {
    expect(returnTargetParam(resolveReturnTarget(AUTHORIZE, API))).toBe(AUTHORIZE);
    expect(returnTargetParam(resolveReturnTarget('/queue', API))).toBe('/queue');
  });
});
