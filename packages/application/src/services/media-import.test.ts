import { IMAGE_UPLOAD_LIMIT_BYTES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { MemoryStorage } from '../ports/storage';
import {
  fetchAndStoreRemoteMedia,
  fileNameFromRemoteUrl,
  provenanceUrlFor,
  signatureMatchesMimeType,
  type RemoteMediaFetch,
} from './media-import';

function pngBytes(): Uint8Array {
  return new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
}

function fetcher(overrides: Partial<Awaited<ReturnType<RemoteMediaFetch>>> = {}): RemoteMediaFetch {
  return async () => ({
    finalUrl: 'https://cdn.example.com/launch%20card.png',
    status: 200,
    body: pngBytes(),
    contentType: 'image/png; charset=binary',
    redirectChain: ['https://cdn.example.com/launch%20card.png'],
    resolvedAddresses: ['203.0.114.8'],
    ...overrides,
  });
}

describe('remote media import', () => {
  it('stores validated bytes under a workspace-scoped content address', async () => {
    const storage = new MemoryStorage();
    const result = await fetchAndStoreRemoteMedia({
      workspaceId: 'ws_test',
      url: 'https://example.com/start',
      fetchRemote: fetcher(),
      storage,
    });

    expect(result.storageKey).toBe(`ws_test/${result.checksumSha256}`);
    expect(result.fileName).toBe('launch card.png');
    expect(result.mimeType).toBe('image/png');
    expect(result.redirectCount).toBe(1);
    await expect(storage.read(result.storageKey)).resolves.toEqual(pngBytes());
  });

  it('rejects bytes that do not match the declared allowed media type', async () => {
    await expect(
      fetchAndStoreRemoteMedia({
        workspaceId: 'ws_test',
        url: 'https://example.com/not-an-image.png',
        fetchRemote: fetcher({ body: new TextEncoder().encode('<html>sign in</html>') }),
        storage: new MemoryStorage(),
      }),
    ).rejects.toMatchObject({
      code: 'MEDIA_INVALID',
      details: { reason: 'remote_media_signature_mismatch' },
    });
  });

  it('rejects unsupported response types and non-success responses', async () => {
    await expect(
      fetchAndStoreRemoteMedia({
        workspaceId: 'ws_test',
        url: 'https://example.com/page',
        fetchRemote: fetcher({ contentType: 'text/html' }),
        storage: new MemoryStorage(),
      }),
    ).rejects.toMatchObject({ code: 'MEDIA_INVALID' });

    await expect(
      fetchAndStoreRemoteMedia({
        workspaceId: 'ws_test',
        url: 'https://example.com/missing.png',
        fetchRemote: fetcher({ status: 404 }),
        storage: new MemoryStorage(),
      }),
    ).rejects.toMatchObject({
      code: 'MEDIA_INVALID',
      details: { reason: 'remote_media_http_status' },
    });
  });

  it('uses the non-video size boundary after the response type is known', async () => {
    const tooLarge = new Uint8Array(IMAGE_UPLOAD_LIMIT_BYTES + 1);
    tooLarge.set(pngBytes());
    await expect(
      fetchAndStoreRemoteMedia({
        workspaceId: 'ws_test',
        url: 'https://example.com/large.png',
        fetchRemote: fetcher({ body: tooLarge }),
        storage: new MemoryStorage(),
      }),
    ).rejects.toMatchObject({ code: 'MEDIA_TOO_LARGE' });
  });
});

describe('remote media metadata', () => {
  it('recognises the supported file signatures used at the import boundary', () => {
    expect(signatureMatchesMimeType(pngBytes(), 'image/png')).toBe(true);
    expect(signatureMatchesMimeType(new TextEncoder().encode('%PDF-1.7'), 'application/pdf')).toBe(
      true,
    );
    expect(signatureMatchesMimeType(new TextEncoder().encode('not png'), 'image/png')).toBe(false);
  });

  it('derives a bounded safe display name without trusting it as a type', () => {
    expect(fileNameFromRemoteUrl('https://example.com/a%20b.jpg?token=secret', 'image/jpeg')).toBe(
      'a b.jpg',
    );
    expect(fileNameFromRemoteUrl('not a url', 'video/mp4')).toBe('imported-media.mp4');
  });

  it('records useful provenance without keeping signed URL credentials', () => {
    expect(
      provenanceUrlFor('https://user:secret@cdn.example.com/launch.png?token=signed#private'),
    ).toBe('https://cdn.example.com/launch.png');
    expect(provenanceUrlFor('not a url')).toBe('unavailable');
  });
});
