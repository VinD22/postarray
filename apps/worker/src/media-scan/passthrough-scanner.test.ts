import { describe, expect, it, vi } from 'vitest';

import { createPassthroughScanner } from './passthrough-scanner';

import type { StoragePort } from '@relay/application';

/** A one-pixel PNG. Real bytes, so `sharp` has something to decode. */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

function storageReturning(bytes: Uint8Array | Error): StoragePort {
  return {
    read: bytes instanceof Error ? vi.fn().mockRejectedValue(bytes) : vi.fn().mockResolvedValue(bytes),
  } as unknown as StoragePort;
}

describe('passthrough scanner', () => {
  it('passes a PNG that is what it says it is, and reports its real dimensions', async () => {
    const scanner = createPassthroughScanner({ storage: storageReturning(PNG) });
    const result = await scanner.scan({
      workspaceId: 'ws_1',
      storageKey: 'ws_1/abc',
      claimedMimeType: 'image/png',
      byteSize: PNG.byteLength,
    });

    expect(result.verdict).toBe('clean');
    expect(result.detectedMimeType).toBe('image/png');
    expect(result.width).toBe(1);
    expect(result.height).toBe(1);
    expect(result.scanner).toBe('passthrough');
  });

  it('refuses a PNG uploaded as a JPEG', async () => {
    // The oldest trick there is: the claim and the magic bytes disagree.
    const scanner = createPassthroughScanner({ storage: storageReturning(PNG) });
    const result = await scanner.scan({
      workspaceId: 'ws_1',
      storageKey: 'ws_1/abc',
      claimedMimeType: 'image/jpeg',
      byteSize: PNG.byteLength,
    });

    expect(result.verdict).toBe('failed');
    expect(result.noteKey).toBe('media.scan.mime_mismatch');
    expect(result.detectedMimeType).toBe('image/png');
  });

  it('accepts jpg and jpeg as the same thing', async () => {
    const scanner = createPassthroughScanner({
      storage: storageReturning(PNG),
      detectType: () => Promise.resolve({ mime: 'image/jpeg' }),
    });
    const result = await scanner.scan({
      workspaceId: 'ws_1',
      storageKey: 'ws_1/abc',
      claimedMimeType: 'image/jpg',
      byteSize: 10,
    });

    // The claim and the sniff disagree only about spelling, so the file is not
    // refused; it fails later on decode because these bytes are not a JPEG.
    expect(result.noteKey).not.toBe('media.scan.mime_mismatch');
  });

  it('refuses bytes it cannot identify', async () => {
    const scanner = createPassthroughScanner({
      storage: storageReturning(new Uint8Array([1, 2, 3, 4])),
    });
    const result = await scanner.scan({
      workspaceId: 'ws_1',
      storageKey: 'ws_1/abc',
      claimedMimeType: 'image/png',
      byteSize: 4,
    });

    expect(result.verdict).toBe('failed');
    expect(result.noteKey).toBe('media.scan.unrecognized_format');
  });

  it('lets plain text through, because text has no magic bytes', async () => {
    const scanner = createPassthroughScanner({
      storage: storageReturning(new TextEncoder().encode('a,b,c\n1,2,3\n')),
    });
    const result = await scanner.scan({
      workspaceId: 'ws_1',
      storageKey: 'ws_1/abc',
      claimedMimeType: 'text/csv',
      byteSize: 12,
    });

    expect(result.verdict).toBe('clean');
  });

  it('refuses a truncated image rather than filling in the rest', async () => {
    const scanner = createPassthroughScanner({
      storage: storageReturning(PNG.subarray(0, 20)),
      detectType: () => Promise.resolve({ mime: 'image/png' }),
    });
    const result = await scanner.scan({
      workspaceId: 'ws_1',
      storageKey: 'ws_1/abc',
      claimedMimeType: 'image/png',
      byteSize: 20,
    });

    expect(result.verdict).toBe('failed');
    expect(result.noteKey).toBe('media.scan.decode_failed');
  });

  it('fails, never passes, when the object cannot be read', async () => {
    // A storage outage is not a verdict about the file.
    const scanner = createPassthroughScanner({ storage: storageReturning(new Error('gone')) });
    const result = await scanner.scan({
      workspaceId: 'ws_1',
      storageKey: 'ws_1/abc',
      claimedMimeType: 'image/png',
      byteSize: 10,
    });

    expect(result.verdict).toBe('failed');
    expect(result.noteKey).toBe('media.scan.unreadable');
  });
});
