import { MediaInvalidError } from '@relay/contracts';
import type { Request } from 'express';

/**
 * Read an upload body straight off the request stream.
 *
 * The JSON and urlencoded parsers in `bootstrap.ts` only claim their own
 * content types, so an `image/png` or `video/mp4` PUT arrives here unread. That
 * is deliberate: buffering a video through a JSON parser would be both wrong
 * and expensive.
 *
 * The cap is enforced while reading rather than after it, so an oversized body
 * is refused at the byte that crosses the limit instead of after the whole
 * thing has been held in memory. The stream is destroyed on refusal so the
 * sender stops rather than continuing to push bytes at a closed handler.
 */
export async function readDirectUploadBody(
  request: Request,
  maxBytes: number,
): Promise<Uint8Array> {
  const chunks: Buffer[] = [];
  let total = 0;

  return await new Promise<Uint8Array>((resolve, reject) => {
    const fail = (reason: string): void => {
      request.destroy();
      reject(new MediaInvalidError({ details: { reason } }));
    };

    request.on('data', (chunk: Buffer) => {
      total += chunk.byteLength;
      if (total > maxBytes) {
        fail('media_upload_body_too_large');
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      if (total === 0) {
        fail('media_upload_body_empty');
        return;
      }
      resolve(new Uint8Array(Buffer.concat(chunks)));
    });
    request.on('error', () => {
      fail('media_upload_body_unreadable');
    });
  });
}
