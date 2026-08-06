import type { MediaAssetView } from '@/lib/api';

import type { MediaAsset } from '../types';

/**
 * The only translation from the shared API view into the library's UI model.
 * Unknown facts stay null; a missing value is never invented as zero or as a
 * fake person, version, preview, or provenance claim.
 */
export function mediaAssetFromApi(view: MediaAssetView): MediaAsset {
  const origin =
    view.originKind === 'import' ? 'import' : view.originKind === 'upload' ? 'upload' : 'api';
  return {
    id: view.id,
    name: view.fileName,
    kind: view.kind,
    mimeType: view.mimeType,
    bytes: view.byteSize,
    width: view.width,
    height: view.height,
    durationSeconds: view.durationMs === null ? null : view.durationMs / 1000,
    checksum: view.checksumSha256,
    createdAt: view.createdAt,
    scanState: view.scanState,
    retentionExpiresAt: view.retentionExpiresAt,
    storageAvailable: view.storageAvailable,
    altText: view.altText,
    altTextWaived: view.altTextWaived,
    altTextWaivedReason: view.altTextWaivedReason,
    altTextWaivedByName: view.altTextWaivedByName,
    rights: view.rightsDeclaration,
    rightsDeclared: view.rightsDeclaration !== null,
    provenance: {
      origin,
      sourceUrl: view.originUrl,
      fetchedAt: origin === 'import' ? view.createdAt : null,
      declaredAuthor: null,
      declaredLicense: view.rightsDeclaration?.licenseReference ?? null,
      contentCredentials: null,
      addedByName: null,
    },
    versions: [
      {
        version: 1,
        width: view.width,
        height: view.height,
        bytes: view.byteSize,
        mimeType: view.mimeType,
        createdAt: view.createdAt,
        edit: null,
      },
    ],
    currentVersion: 1,
    usedInPostCount: null,
    thumbnailMediaId: null,
  };
}
