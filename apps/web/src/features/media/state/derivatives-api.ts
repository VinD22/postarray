/**
 * The derivative endpoints.
 *
 * An edit is a request for a version, not a mutation of the file. The browser
 * sends the operations and the server decides everything else: it validates
 * them against the real picture, computes the preset key, and either hands back
 * the version that already existed or asks the worker to make one. No pixel
 * work happens here, and no decision does either.
 */

import { call } from '@/lib/api/call';

export type DerivativeOperation =
  | {
      readonly op: 'crop';
      readonly x: number;
      readonly y: number;
      readonly width: number;
      readonly height: number;
    }
  | { readonly op: 'rotate'; readonly degrees: 90 | 180 | 270 }
  | { readonly op: 'resize'; readonly width: number; readonly height: number }
  | { readonly op: 'convert'; readonly format: DerivativeFormat }
  | { readonly op: 'compress'; readonly quality: number };

export type DerivativeFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface DerivativeView {
  readonly id: string;
  readonly mediaAssetId: string;
  readonly kind: 'transcode' | 'crop' | 'resize' | 'thumbnail' | 'format_conversion' | 'compressed';
  readonly presetKey: string;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly checksumSha256: string;
  readonly width: number | null;
  readonly height: number | null;
  readonly operations: readonly DerivativeOperation[];
  readonly createdAt: string;
}

export interface DerivativeRequestView {
  readonly mediaId: string;
  readonly presetKey: string;
  /** `ready` means this exact edit already existed and nothing was reprocessed. */
  readonly status: 'ready' | 'processing';
  /** Null while it is being made. Never a placeholder standing in for a file. */
  readonly derivative: DerivativeView | null;
  readonly projectedWidth: number;
  readonly projectedHeight: number;
  readonly targetMimeType: DerivativeFormat;
}

export const derivativesApi = {
  list: (mediaId: string): Promise<readonly DerivativeView[]> =>
    call<{ data: readonly DerivativeView[] }, readonly DerivativeView[]>(
      `/media/${mediaId}/derivatives`,
      {},
      () => [],
      (wire) => wire.data,
    ),

  create: (
    mediaId: string,
    operations: readonly DerivativeOperation[],
    idempotencyKey: string,
  ): Promise<DerivativeRequestView | null> =>
    call(
      `/media/${mediaId}/edits`,
      { method: 'POST', body: { ops: operations }, idempotencyKey },
      () => null,
    ),
};
