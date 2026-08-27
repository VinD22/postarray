import type {
  MediaTransformFn,
  MediaTransformInput,
  MediaTransformResult,
} from '@relay/application';
import { MediaInvalidError, type MediaDerivativeOperation } from '@relay/contracts';
import sharp from 'sharp';
import type { OutputInfo, Sharp } from 'sharp';

/**
 * The pixel step, and the only place in Post Array that decodes an image.
 *
 * `sharp` is a dependency of this app and of nothing else. It must never reach
 * `apps/web` or `apps/api`: both run in processes where a native codec on a
 * user-supplied file is an attack surface with no upside, and the web app has
 * no business decoding anything at all.
 *
 * Every operation below rearranges, discards or re-encodes bytes the uploader
 * supplied. There is no model here, no network call, no provider and no way to
 * add one without changing the operation union in `@relay/contracts`, which is
 * a closed discriminated union with no free-form fields. That is the whole
 * mechanism behind the claim in `docs/planning/media-v1-policy.md`: editing is
 * non-generative by construction, not by policy.
 *
 * Two settings are deliberate rather than incidental:
 *
 * - `failOn: 'truncated'` refuses a half-written or malformed file instead of
 *   quietly filling the rest of the canvas, which would be inventing pixels.
 * - Re-encoding drops the metadata block, so an EXIF GPS tag on a holiday photo
 *   cannot ride along into a published post.
 */

const SHARP_LIMITS = {
  // A decoded surface bound, so a small file that claims enormous dimensions
  // cannot exhaust the worker.
  limitInputPixels: 268_435_456,
  failOn: 'truncated',
  sequentialRead: true,
} as const;

function invalidMedia(reason: string, cause?: unknown): MediaInvalidError {
  return new MediaInvalidError({
    messageKey: 'errors.media_derivative_transform_failed',
    details: { reason },
    ...(cause === undefined ? {} : { cause }),
  });
}

function applyOperations(image: Sharp, operations: readonly MediaDerivativeOperation[]): Sharp {
  let pipeline = image;
  // The operations arrive already canonicalized into pipeline order by
  // `planMediaDerivative`, so this loop applies them in the order the preset
  // key was computed over. That is what makes the key an honest identity for
  // the bytes rather than for the request.
  for (const operation of operations) {
    switch (operation.op) {
      case 'crop':
        pipeline = pipeline.extract({
          left: operation.x,
          top: operation.y,
          width: operation.width,
          height: operation.height,
        });
        break;
      case 'rotate':
        pipeline = pipeline.rotate(operation.degrees);
        break;
      case 'resize':
        pipeline = pipeline.resize({
          width: operation.width,
          height: operation.height,
          fit: 'fill',
          // Belt and braces with the application boundary, which already
          // refuses an enlarging resize. Nothing here invents detail.
          withoutEnlargement: true,
        });
        break;
      case 'convert':
      case 'compress':
        // Encoder settings, applied once below so the two cannot disagree.
        break;
    }
  }
  return pipeline;
}

function encode(
  pipeline: Sharp,
  targetMimeType: MediaTransformInput['targetMimeType'],
  quality: number | null,
): Sharp {
  switch (targetMimeType) {
    case 'image/jpeg':
      return pipeline.jpeg({ quality: quality ?? 82, mozjpeg: true });
    case 'image/webp':
      return pipeline.webp({ quality: quality ?? 82 });
    case 'image/png':
      // Lossless. The application boundary already refuses a quality setting
      // here rather than accepting one and ignoring it.
      return pipeline.png({ compressionLevel: 9 });
  }
}

/**
 * Build the transform the worker hands to the application service.
 *
 * The seam is a function, not an object, and it takes bytes and geometry. There
 * is no client to configure, no credential to hold and no endpoint to call.
 */
export function createSharpMediaTransform(): MediaTransformFn {
  return async (input: MediaTransformInput): Promise<MediaTransformResult> => {
    const quality =
      input.operations.find((operation) => operation.op === 'compress')?.quality ?? null;

    let output: { data: Buffer; info: OutputInfo };
    try {
      const pipeline = encode(
        applyOperations(sharp(Buffer.from(input.bytes), SHARP_LIMITS), input.operations),
        input.targetMimeType,
        quality,
      );
      output = await pipeline.toBuffer({ resolveWithObject: true });
    } catch (cause: unknown) {
      throw invalidMedia('decode_or_encode_failed', cause);
    }

    if (output.info.size <= 0 || output.info.width < 1 || output.info.height < 1) {
      throw invalidMedia('empty_output');
    }

    return {
      bytes: new Uint8Array(output.data),
      byteSize: output.info.size,
      width: output.info.width,
      height: output.info.height,
      mimeType: input.targetMimeType,
    };
  };
}
