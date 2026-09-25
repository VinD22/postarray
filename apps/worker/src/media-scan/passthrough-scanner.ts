import sharp from 'sharp';

import {
  uploadLimitForMimeType,
  type MediaScanResult,
  type MediaScannerPort,
  type StoragePort,
} from '@relay/application';

/**
 * Format validation, and nothing more.
 *
 * Read this before trusting it: **this is not malware scanning.** It answers
 * three questions and no others. Are the bytes the type the client claimed?
 * Do they decode? Are they within the size the type is allowed?
 *
 * That is worth having on its own. A file whose extension and magic bytes
 * disagree is the oldest trick there is, and a truncated image that decodes to
 * garbage fails at the provider rather than here, where nobody can explain it.
 * But a well-formed PNG carrying a payload passes this scanner, because a
 * well-formed PNG is exactly what it is looking for. Deployments that need
 * more set `MEDIA_SCANNER=clamav`, and `/v1/capabilities` reports
 * `degraded:passthrough` until they do, so the product never claims a
 * protection it does not have.
 */
export interface PassthroughScannerOptions {
  readonly storage: StoragePort;
  /**
   * Magic-byte sniffing. Injected so a test can supply bytes without pulling
   * the real module, and so the import stays dynamic: `file-type` is ESM-only
   * and the worker bundle should not pay for it until an upload arrives.
   */
  readonly detectType?: (bytes: Uint8Array) => Promise<{ mime: string } | undefined>;
}

const SHARP_LIMITS = {
  limitInputPixels: 268_435_456,
  failOn: 'truncated',
  sequentialRead: true,
} as const;

/**
 * Types whose magic bytes legitimately differ from the claim, because the
 * container is shared. An `image/jpeg` sniffed from a JFIF header is the same
 * file either way, and an MP4 audio track sniffs as `video/mp4`.
 */
const EQUIVALENT_TYPES: ReadonlyMap<string, ReadonlySet<string>> = new Map([
  ['image/jpg', new Set(['image/jpeg'])],
  ['image/jpeg', new Set(['image/jpg'])],
  ['video/quicktime', new Set(['video/mp4'])],
  ['video/mp4', new Set(['video/quicktime', 'video/x-m4v'])],
  ['audio/mp4', new Set(['video/mp4'])],
]);

function typesAgree(claimed: string, detected: string): boolean {
  if (claimed === detected) {
    return true;
  }
  return EQUIVALENT_TYPES.get(claimed)?.has(detected) ?? false;
}

async function defaultDetectType(bytes: Uint8Array): Promise<{ mime: string } | undefined> {
  const { fileTypeFromBuffer } = await import('file-type');
  const found = await fileTypeFromBuffer(bytes);
  return found === undefined ? undefined : { mime: found.mime };
}

export function createPassthroughScanner(options: PassthroughScannerOptions): MediaScannerPort {
  const detectType = options.detectType ?? defaultDetectType;

  return {
    async scan(input): Promise<MediaScanResult> {
      let bytes: Uint8Array;
      try {
        bytes = await options.storage.read(input.storageKey);
      } catch {
        // The object is not readable. That is a storage problem, not a verdict
        // about the file, so it fails rather than passing.
        return failure('media.scan.unreadable');
      }

      const detected = await detectType(bytes);
      if (detected === undefined) {
        // Plain text and CSV have no magic bytes. Anything else that cannot be
        // identified is refused.
        if (input.claimedMimeType.startsWith('text/')) {
          return {
            verdict: 'clean',
            detectedMimeType: input.claimedMimeType,
            width: null,
            height: null,
            durationMs: null,
            noteKey: null,
            scanner: 'passthrough',
          };
        }
        return failure('media.scan.unrecognized_format');
      }

      if (!typesAgree(input.claimedMimeType, detected.mime)) {
        return { ...failure('media.scan.mime_mismatch'), detectedMimeType: detected.mime };
      }

      if (bytes.byteLength > uploadLimitForMimeType(detected.mime)) {
        return { ...failure('media.scan.too_large'), detectedMimeType: detected.mime };
      }

      if (!detected.mime.startsWith('image/')) {
        // Video and document dimensions are the derivative pipeline's job.
        // Type and size are all this scanner claims to know about them.
        return {
          verdict: 'clean',
          detectedMimeType: detected.mime,
          width: null,
          height: null,
          durationMs: null,
          noteKey: null,
          scanner: 'passthrough',
        };
      }

      try {
        const metadata = await sharp(Buffer.from(bytes), SHARP_LIMITS).metadata();
        return {
          verdict: 'clean',
          detectedMimeType: detected.mime,
          width: metadata.width ?? null,
          height: metadata.height ?? null,
          durationMs: null,
          noteKey: null,
          scanner: 'passthrough',
        };
      } catch {
        return { ...failure('media.scan.decode_failed'), detectedMimeType: detected.mime };
      }
    },
  };
}

function failure(noteKey: string): MediaScanResult {
  return {
    verdict: 'failed',
    detectedMimeType: null,
    width: null,
    height: null,
    durationMs: null,
    noteKey,
    scanner: 'passthrough',
  };
}
