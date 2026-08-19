import { describe, expect, it } from 'vitest';

import type { MediaAssetView } from '@/lib/api';

import { mediaAssetFromApi } from './from-api';

const VIEW: MediaAssetView = {
  id: 'media_1',
  workspaceId: 'workspace_1',
  projectId: null,
  kind: 'image',
  fileName: null,
  mimeType: 'image/png',
  byteSize: 1024,
  width: 100,
  height: 100,
  durationMs: null,
  checksumSha256: '0'.repeat(64),
  altText: null,
  altTextWaived: false,
  altTextWaivedReason: null,
  altTextWaivedByName: null,
  rights: 'unverified',
  rightsDeclaration: null,
  scanState: 'pending',
  originKind: 'upload',
  originUrl: null,
  retentionExpiresAt: '2026-09-05T00:00:00.000Z',
  storageAvailable: true,
  createdAt: '2026-08-06T00:00:00.000Z',
};

describe('mediaAssetFromApi', () => {
  it('keeps unavailable facts null instead of inventing zeroes or people', () => {
    const asset = mediaAssetFromApi(VIEW);

    expect(asset.name).toBeNull();
    expect(asset.usedInPostCount).toBeNull();
    expect(asset.provenance.addedByName).toBeNull();
    expect(asset.rightsDeclared).toBe(false);
    expect(asset.versions).toHaveLength(1);
  });

  it('converts milliseconds to seconds without losing retention state', () => {
    const asset = mediaAssetFromApi({
      ...VIEW,
      kind: 'video',
      durationMs: 12_500,
      storageAvailable: false,
    });

    expect(asset.durationSeconds).toBe(12.5);
    expect(asset.storageAvailable).toBe(false);
    expect(asset.retentionExpiresAt).toBe(VIEW.retentionExpiresAt);
  });
});
