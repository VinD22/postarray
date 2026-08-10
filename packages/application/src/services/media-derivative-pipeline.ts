import {
  mediaDerivativePresetKey,
  planMediaDerivative,
  type MediaDerivativeOperation,
} from '@relay/contracts';

import type { MediaDerivativeView, MediaTransformFn } from '../types';

import { invalid } from '../internal/errors';

/**
 * The derivative pipeline, with no database and no object store in it.
 *
 * Everything that decides *what happens* lives here; everything that talks to
 * Postgres or to storage is behind the two small ports below. That is what
 * makes the two properties this feature exists to guarantee testable without a
 * live stack:
 *
 * 1. **Asking twice reprocesses nothing.** The preset key is a checksum over
 *    the canonical operations, so the second request finds the first result and
 *    returns it. `reprocessed` says so out loud.
 * 2. **No generative provider is ever invoked.** The pipeline makes exactly one
 *    outbound call, `transform`, and its input is bytes, a MIME type and
 *    geometry. `docs/planning/media-v1-policy.md` requires that to be asserted,
 *    and the assertion is only meaningful because this function is the whole
 *    story.
 *
 * The original is never written to. The only `write` here is a new object under
 * the workspace prefix, keyed by the checksum of its own bytes.
 */

export interface DerivativeSource {
  readonly id: string;
  readonly storageKey: string;
  readonly mimeType: string;
  readonly width: number | null;
  readonly height: number | null;
}

export interface DerivativeInsert {
  readonly mediaAssetId: string;
  readonly presetKey: string;
  readonly kind: 'crop' | 'resize' | 'format_conversion' | 'compressed';
  readonly storageKey: string;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly checksumSha256: string;
  readonly width: number;
  readonly height: number;
  readonly operations: readonly MediaDerivativeOperation[];
}

export interface DerivativeStore {
  findByPreset(mediaAssetId: string, presetKey: string): Promise<MediaDerivativeView | null>;
  /** Throws `NotFoundError` when the asset is gone or its bytes were purged. */
  loadSource(mediaAssetId: string): Promise<DerivativeSource>;
  /** Must be safe under a race: return the row that won rather than a second. */
  insert(input: DerivativeInsert): Promise<MediaDerivativeView>;
}

export interface DerivativeBytesPort {
  read(key: string): Promise<Uint8Array>;
  write(key: string, bytes: Uint8Array, contentType: string): Promise<unknown>;
}

export interface DerivativePipelineDeps {
  readonly store: DerivativeStore;
  readonly storage: DerivativeBytesPort;
  readonly workspaceId: string;
}

export interface DerivativeOutcome {
  readonly derivative: MediaDerivativeView;
  /** False when the derivative already existed and no bytes were touched. */
  readonly reprocessed: boolean;
}

/** SHA-256 of the produced bytes, so a derivative is content addressed too. */
export async function checksumOfBytes(bytes: Uint8Array): Promise<string> {
  const view = new Uint8Array(bytes);
  const buffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function derivativeStorageKey(workspaceId: string, checksumSha256: string): string {
  return `${workspaceId}/derivatives/${checksumSha256}`;
}

export async function produceDerivative(
  deps: DerivativePipelineDeps,
  input: {
    readonly mediaAssetId: string;
    readonly presetKey: string;
    readonly operations: readonly MediaDerivativeOperation[];
  },
  transform: MediaTransformFn,
): Promise<DerivativeOutcome> {
  const settled = await deps.store.findByPreset(input.mediaAssetId, input.presetKey);
  if (settled !== null) {
    return { derivative: settled, reprocessed: false };
  }

  const source = await deps.store.loadSource(input.mediaAssetId);
  const plan = planMediaDerivative(
    { mimeType: source.mimeType, width: source.width, height: source.height },
    input.operations,
  );

  // A workflow input is not a trust boundary. Recomputing the key from the
  // operations refuses a renamed or hand-edited request outright, which is what
  // stops a caller from parking someone else's bytes under a key they chose.
  const recomputed = await mediaDerivativePresetKey(plan.operations);
  if (recomputed !== input.presetKey) {
    throw invalid('errors.media_derivative_preset_mismatch', {
      mediaAssetId: input.mediaAssetId,
    });
  }

  const bytes = await deps.storage.read(source.storageKey);
  const produced = await transform({
    bytes,
    sourceMimeType: source.mimeType,
    targetMimeType: plan.targetMimeType,
    operations: plan.operations,
  });
  if (produced.byteSize <= 0 || produced.width < 1 || produced.height < 1) {
    throw invalid('errors.media_derivative_empty_result', { mediaAssetId: input.mediaAssetId });
  }

  const checksumSha256 = await checksumOfBytes(produced.bytes);
  const storageKey = derivativeStorageKey(deps.workspaceId, checksumSha256);
  // The object goes down before the row. A row that outlived its bytes would
  // claim a file exists when it does not, which is exactly what "missing is
  // unavailable, never a placeholder" forbids.
  await deps.storage.write(storageKey, produced.bytes, produced.mimeType);

  const derivative = await deps.store.insert({
    mediaAssetId: input.mediaAssetId,
    presetKey: input.presetKey,
    kind: plan.kind,
    storageKey,
    mimeType: produced.mimeType,
    byteSize: produced.byteSize,
    checksumSha256,
    width: produced.width,
    height: produced.height,
    operations: plan.operations,
  });

  return { derivative, reprocessed: true };
}
