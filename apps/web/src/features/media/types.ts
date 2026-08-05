/**
 * The media library's view models.
 *
 * A stored file is never mutated. An edit produces a new version and the
 * original stays addressable, which is what makes "restore the original" a real
 * button rather than an apology.
 */

import type { MediaKind } from '@relay/contracts';

export type RightsOwner = 'workspace' | 'licensed' | 'ugc';

export interface RightsDeclaration {
  readonly owner: RightsOwner;
  readonly licenseReference: string | null;
  readonly peopleAppear: boolean;
  readonly peopleConsented: boolean;
  readonly containsMusic: boolean;
  readonly declaredByName: string;
  readonly declaredAt: string;
}

export interface MediaProvenance {
  readonly origin: 'upload' | 'import' | 'api';
  readonly sourceUrl: string | null;
  readonly fetchedAt: string | null;
  readonly declaredAuthor: string | null;
  readonly declaredLicense: string | null;
  /** Embedded C2PA style credentials, when the file carries any. */
  readonly contentCredentials: string | null;
  readonly addedByName: string;
}

export interface MediaVersion {
  readonly version: number;
  readonly width: number | null;
  readonly height: number | null;
  readonly bytes: number;
  readonly mimeType: string;
  readonly createdAt: string;
  /** Null on version 1, which is the untouched original. */
  readonly edit: MediaEditPlan | null;
}

export interface MediaAsset {
  readonly id: string;
  readonly name: string;
  readonly kind: MediaKind;
  readonly mimeType: string;
  readonly bytes: number;
  readonly width: number | null;
  readonly height: number | null;
  readonly durationSeconds: number | null;
  readonly checksum: string;
  readonly createdAt: string;
  readonly altText: string | null;
  readonly altTextWaived: boolean;
  readonly altTextWaivedReason: string | null;
  readonly altTextWaivedByName: string | null;
  readonly rights: RightsDeclaration | null;
  readonly rightsDeclared: boolean;
  readonly provenance: MediaProvenance;
  readonly versions: readonly MediaVersion[];
  readonly currentVersion: number;
  readonly usedInPostCount: number;
  readonly thumbnailMediaId: string | null;
}

/* -------------------------------------------------------------------------
   The non-generative picture editor
   ------------------------------------------------------------------------- */

export interface CropRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export type CanvasFit = 'cover' | 'contain';
export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

/**
 * Everything this editor can do. Each entry changes pixels that are already in
 * the file. Nothing here invents imagery, and there is no entry point that
 * could: the plan has no prompt, no model and no seed.
 */
export interface MediaEditPlan {
  readonly crop: CropRect | null;
  readonly resize: { readonly width: number; readonly height: number } | null;
  readonly rotateDegrees: 0 | 90 | 180 | 270;
  readonly flipHorizontal: boolean;
  readonly flipVertical: boolean;
  readonly canvas: {
    readonly backgroundColor: string;
    readonly fit: CanvasFit;
  } | null;
  readonly format: OutputFormat;
  /** 1 to 100. Ignored for PNG, which is lossless. */
  readonly quality: number;
  /** The frame or file used as a video thumbnail, where the platform takes one. */
  readonly thumbnailMediaId: string | null;
}

export const IDENTITY_EDIT_PLAN: MediaEditPlan = {
  crop: null,
  resize: null,
  rotateDegrees: 0,
  flipHorizontal: false,
  flipVertical: false,
  canvas: null,
  format: 'image/jpeg',
  quality: 82,
  thumbnailMediaId: null,
};

export interface AspectPreset {
  readonly id: string;
  readonly ratio: number;
  readonly label: string;
  /** Accounts that recommend this ratio, named so the choice is informed. */
  readonly accountLabels: readonly string[];
}

/* -------------------------------------------------------------------------
   Uploads
   ------------------------------------------------------------------------- */

export type UploadStatus =
  'queued' | 'uploading' | 'paused' | 'finalizing' | 'done' | 'rejected' | 'failed';

export interface UploadItem {
  readonly id: string;
  readonly name: string;
  readonly mimeType: string;
  readonly bytes: number;
  readonly sentBytes: number;
  readonly status: UploadStatus;
  /** The resumable session, so a dropped connection continues rather than restarts. */
  readonly uploadUrl: string | null;
  /** Catalog key plus values, so the reason is a real sentence in any locale. */
  readonly reason: {
    readonly key: string;
    readonly values: Record<string, string | number>;
  } | null;
  readonly mediaId: string | null;
}
