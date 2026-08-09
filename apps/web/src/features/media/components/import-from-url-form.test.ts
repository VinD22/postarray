import { describe, expect, it } from 'vitest';

import { inspectImportUrl } from './import-from-url-form';

describe('inspectImportUrl', () => {
  it('accepts ordinary HTTPS and HTTP media URLs', () => {
    expect(inspectImportUrl('https://cdn.example.com/launch.png')).toBeNull();
    expect(inspectImportUrl('http://cdn.example.com/launch.png')).toBeNull();
  });

  it('rejects malformed, credentialed and non-web URLs before submission', () => {
    expect(inspectImportUrl('not a url')).toBe('invalid');
    expect(inspectImportUrl('ftp://example.com/launch.png')).toBe('scheme');
    expect(inspectImportUrl('https://user:secret@example.com/launch.png')).toBe('credentials');
  });
});
