import { z } from 'zod';

import { MediaInvalidError } from './errors';
import { canonicalJson, computeChecksum } from './primitives';

/**
 * Media derivatives.
 *
 * A derivative is a new stored object produced from bytes that already exist.
 * Every operation in this module rearranges, discards or re-encodes pixels that
 * the uploader supplied. Nothing here invents a pixel: there is no upscaler, no
 * background fill, no object removal and no model of any kind, and the shape of
 * this contract is what makes that checkable. An operation carries no prompt,
 * no seed, no model name and no provider, so there is nowhere for a generative
 * step to hide.
 *
 * The original asset row is never touched. A derivative is addressed by
 * `(mediaAssetId, presetKey)`, where the preset key is a checksum over the
 * canonical form of the requested operations. That makes the database unique
 * constraint the idempotency mechanism: asking for the same edit twice finds
 * the row that already exists and reprocesses nothing.
 */

export const MEDIA_DERIVATIVE_TARGET_FORMATS = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type MediaDerivativeFormat = (typeof MEDIA_DERIVATIVE_TARGET_FORMATS)[number];

/** Source types the non-generative pipeline can decode. Video stays out of V1. */
export const MEDIA_DERIVATIVE_SOURCE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

/** Guard rail on decoded surface, well under any provider limit. */
export const MEDIA_DERIVATIVE_MAX_EDGE_PX = 16_384;

export const mediaCropOperationSchema = z
  .object({
    op: z.literal('crop'),
    x: z.number().int().nonnegative(),
    y: z.number().int().nonnegative(),
    width: z.number().int().positive().max(MEDIA_DERIVATIVE_MAX_EDGE_PX),
    height: z.number().int().positive().max(MEDIA_DERIVATIVE_MAX_EDGE_PX),
  })
  .strict();

export const mediaRotateOperationSchema = z
  .object({
    op: z.literal('rotate'),
    degrees: z.union([z.literal(90), z.literal(180), z.literal(270)]),
  })
  .strict();

export const mediaResizeOperationSchema = z
  .object({
    op: z.literal('resize'),
    width: z.number().int().positive().max(MEDIA_DERIVATIVE_MAX_EDGE_PX),
    height: z.number().int().positive().max(MEDIA_DERIVATIVE_MAX_EDGE_PX),
  })
  .strict();

export const mediaConvertOperationSchema = z
  .object({ op: z.literal('convert'), format: z.enum(MEDIA_DERIVATIVE_TARGET_FORMATS) })
  .strict();

export const mediaCompressOperationSchema = z
  .object({ op: z.literal('compress'), quality: z.number().int().min(1).max(100) })
  .strict();

export const mediaDerivativeOperationSchema = z.discriminatedUnion('op', [
  mediaCropOperationSchema,
  mediaRotateOperationSchema,
  mediaResizeOperationSchema,
  mediaConvertOperationSchema,
  mediaCompressOperationSchema,
]);

export type MediaDerivativeOperation = z.infer<typeof mediaDerivativeOperationSchema>;
export type MediaDerivativeOperationKind = MediaDerivativeOperation['op'];

export const mediaDerivativeOperationsSchema = z
  .array(mediaDerivativeOperationSchema)
  .min(1)
  .max(5);

/**
 * The pipeline is fixed, not scripted.
 *
 * A request is a plan, not a program: crop is always applied before rotate,
 * rotate before resize, and the encoder settings last. Two requests that name
 * the same operations therefore always produce the same bytes, whatever order
 * the caller listed them in, which is exactly what makes one checksum a
 * faithful identity for the result.
 */
export const MEDIA_DERIVATIVE_PIPELINE_ORDER = [
  'crop',
  'rotate',
  'resize',
  'convert',
  'compress',
] as const;

function pipelineIndex(kind: MediaDerivativeOperationKind): number {
  return MEDIA_DERIVATIVE_PIPELINE_ORDER.indexOf(kind);
}

function derivativeInvalid(
  messageKey: string,
  details: Readonly<Record<string, unknown>>,
): MediaInvalidError {
  return new MediaInvalidError({ messageKey, details });
}

/**
 * One stable form for a set of operations.
 *
 * Duplicated kinds are refused rather than merged: "resize twice" has no single
 * honest meaning, and silently keeping the last one would give two different
 * requests the same preset key while promising different results.
 */
export function canonicalizeMediaDerivativeOperations(
  operations: readonly MediaDerivativeOperation[],
): readonly MediaDerivativeOperation[] {
  if (operations.length === 0) {
    throw derivativeInvalid('errors.media_derivative_no_operations', {});
  }
  const seen = new Set<MediaDerivativeOperationKind>();
  for (const operation of operations) {
    if (seen.has(operation.op)) {
      throw derivativeInvalid('errors.media_derivative_duplicate_operation', {
        operation: operation.op,
      });
    }
    seen.add(operation.op);
  }
  return [...operations].sort((left, right) => pipelineIndex(left.op) - pipelineIndex(right.op));
}

function presetSubject(operations: readonly MediaDerivativeOperation[]): {
  readonly version: 1;
  readonly operations: readonly MediaDerivativeOperation[];
} {
  return { version: 1, operations: canonicalizeMediaDerivativeOperations(operations) };
}

/** The exact string the preset key is a checksum of. Stable across runtimes. */
export function mediaDerivativePresetPayload(
  operations: readonly MediaDerivativeOperation[],
): string {
  return canonicalJson(presetSubject(operations));
}

/**
 * The preset key: a SHA-256 over the canonical operation list.
 *
 * Same operations, same key, forever. That is what lets the unique constraint
 * on `(media_asset_id, preset_key)` carry idempotency without a lock, a queue
 * or a second table.
 */
export async function mediaDerivativePresetKey(
  operations: readonly MediaDerivativeOperation[],
): Promise<string> {
  return computeChecksum(presetSubject(operations));
}

/**
 * Which of the schema's derivative kinds this plan is recorded as. A row holds
 * one kind, so the most structural change wins: a crop that also compresses is
 * still a crop.
 */
export function mediaDerivativeKindFor(
  operations: readonly MediaDerivativeOperation[],
): 'crop' | 'resize' | 'format_conversion' | 'compressed' {
  const kinds = new Set(operations.map((operation) => operation.op));
  if (kinds.has('crop')) {
    return 'crop';
  }
  if (kinds.has('resize') || kinds.has('rotate')) {
    return 'resize';
  }
  if (kinds.has('convert')) {
    return 'format_conversion';
  }
  return 'compressed';
}

export interface MediaDerivativeSource {
  readonly mimeType: string;
  readonly width: number | null;
  readonly height: number | null;
}

export interface MediaDerivativePlan {
  readonly operations: readonly MediaDerivativeOperation[];
  readonly kind: 'crop' | 'resize' | 'format_conversion' | 'compressed';
  readonly targetMimeType: MediaDerivativeFormat;
  /** What the pipeline will produce, so a caller can show it before it runs. */
  readonly width: number;
  readonly height: number;
}

function targetFormatFor(
  source: MediaDerivativeSource,
  operations: readonly MediaDerivativeOperation[],
): MediaDerivativeFormat {
  const convert = operations.find((operation) => operation.op === 'convert');
  if (convert !== undefined) {
    return convert.format;
  }
  const found = MEDIA_DERIVATIVE_TARGET_FORMATS.find((format) => format === source.mimeType);
  if (found !== undefined) {
    return found;
  }
  // A GIF source has no lossless in-family target here, so an explicit
  // conversion is required rather than guessed at.
  throw derivativeInvalid('errors.media_derivative_format_required', {
    sourceMimeType: source.mimeType,
  });
}

/**
 * Check a plan against the file it will actually run on, before anything is
 * enqueued.
 *
 * A crop outside the image, a resize that would enlarge, an undecodable source
 * and a quality setting on a lossless target are all refused here, at the
 * application boundary, where the person who asked is still waiting for an
 * answer. Failing later, inside a worker, would turn a typo into an incident.
 */
export function planMediaDerivative(
  source: MediaDerivativeSource,
  requested: readonly MediaDerivativeOperation[],
): MediaDerivativePlan {
  const operations = canonicalizeMediaDerivativeOperations(requested);

  const decodable = MEDIA_DERIVATIVE_SOURCE_MIME_TYPES.some((type) => type === source.mimeType);
  if (!decodable) {
    throw derivativeInvalid('errors.media_derivative_source_unsupported', {
      mimeType: source.mimeType,
    });
  }
  if (source.width === null || source.height === null || source.width < 1 || source.height < 1) {
    throw derivativeInvalid('errors.media_derivative_dimensions_unknown', {});
  }

  let width = source.width;
  let height = source.height;

  const crop = operations.find((operation) => operation.op === 'crop');
  if (crop !== undefined) {
    if (crop.x + crop.width > width || crop.y + crop.height > height) {
      throw derivativeInvalid('errors.media_derivative_crop_out_of_bounds', {
        sourceWidth: width,
        sourceHeight: height,
      });
    }
    width = crop.width;
    height = crop.height;
  }

  const rotate = operations.find((operation) => operation.op === 'rotate');
  if (rotate !== undefined && rotate.degrees !== 180) {
    const swapped = width;
    width = height;
    height = swapped;
  }

  const resize = operations.find((operation) => operation.op === 'resize');
  if (resize !== undefined) {
    if (resize.width > width || resize.height > height) {
      // Enlarging is not generation, but it is the doorway to an upscaler and
      // it always ships blur as if it were detail. Refuse it outright.
      throw derivativeInvalid('errors.media_derivative_upscale_rejected', {
        availableWidth: width,
        availableHeight: height,
      });
    }
    width = resize.width;
    height = resize.height;
  }

  const targetMimeType = targetFormatFor(source, operations);
  const compress = operations.find((operation) => operation.op === 'compress');
  if (compress !== undefined && targetMimeType === 'image/png') {
    throw derivativeInvalid('errors.media_derivative_quality_unsupported', {
      targetMimeType,
    });
  }

  if (
    operations.length === 1 &&
    operations[0]?.op === 'convert' &&
    operations[0].format === source.mimeType
  ) {
    throw derivativeInvalid('errors.media_derivative_no_change', {});
  }

  return {
    operations,
    kind: mediaDerivativeKindFor(operations),
    targetMimeType,
    width,
    height,
  };
}
