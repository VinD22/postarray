import { describe, expect, it } from 'vitest';

import { base64ChecksumToHex } from './neon-storage';

describe('Neon Object Storage checksums', () => {
  it('converts the S3 base64 checksum without changing its bytes', () => {
    const hex = 'ab'.repeat(32);
    expect(base64ChecksumToHex(Buffer.from(hex, 'hex').toString('base64'))).toBe(hex);
  });

  it('refuses malformed or non-SHA-256 values', () => {
    expect(base64ChecksumToHex('not-base64')).toBeNull();
    expect(base64ChecksumToHex(Buffer.alloc(16).toString('base64'))).toBeNull();
  });
});
