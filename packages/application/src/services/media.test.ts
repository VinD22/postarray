import { IMAGE_UPLOAD_LIMIT_BYTES, VIDEO_UPLOAD_LIMIT_BYTES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { uploadLimitForMimeType } from './media';

describe('media upload limits', () => {
  it('allows video up to the explicit 500 MiB boundary', () => {
    expect(uploadLimitForMimeType('video/mp4')).toBe(VIDEO_UPLOAD_LIMIT_BYTES);
  });

  it('uses the conservative 20 MiB boundary for images and other uploaded media', () => {
    expect(uploadLimitForMimeType('image/png')).toBe(IMAGE_UPLOAD_LIMIT_BYTES);
    expect(uploadLimitForMimeType('application/pdf')).toBe(IMAGE_UPLOAD_LIMIT_BYTES);
  });
});
