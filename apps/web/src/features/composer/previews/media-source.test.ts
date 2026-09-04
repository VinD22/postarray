import { describe, expect, it } from 'vitest';
import type { MediaReadUrls } from '@relay/contracts';

import { displayableMediaUrl } from './media-source';

function urls(overrides: Partial<MediaReadUrls> = {}): MediaReadUrls {
  const at = '2026-09-04T07:00:00.000Z';
  return {
    mediaId: 'media_01j000000000000000000001',
    thumbnail: null,
    poster: null,
    original: { url: 'https://cdn.example.com/original', width: null, height: null, expiresAt: at },
    ...overrides,
  };
}

const THUMB = {
  url: 'https://cdn.example.com/thumb',
  width: 200,
  height: 200,
  expiresAt: '2026-09-04T07:00:00.000Z',
};

describe('displayableMediaUrl', () => {
  it('prefers a real thumbnail for a picture', () => {
    expect(displayableMediaUrl('image', urls({ thumbnail: THUMB }))).toBe(THUMB.url);
  });

  it('falls back to the original for a picture, which is what usually comes back', () => {
    expect(displayableMediaUrl('image', urls())).toBe('https://cdn.example.com/original');
    expect(displayableMediaUrl('gif', urls())).toBe('https://cdn.example.com/original');
  });

  it('never points an image element at a video file', () => {
    expect(displayableMediaUrl('video', urls())).toBeNull();
  });

  it('uses a poster for a video once the pipeline produces one', () => {
    expect(displayableMediaUrl('video', urls({ poster: THUMB }))).toBe(THUMB.url);
  });

  it('never points an image element at a document or an audio file', () => {
    expect(displayableMediaUrl('document', urls())).toBeNull();
    expect(displayableMediaUrl('audio', urls())).toBeNull();
  });

  it('shows a rendered picture for a document when one exists', () => {
    expect(displayableMediaUrl('document', urls({ thumbnail: THUMB }))).toBe(THUMB.url);
  });

  it('has nothing to show before the query answers', () => {
    expect(displayableMediaUrl('image', null)).toBeNull();
    expect(displayableMediaUrl('image', undefined)).toBeNull();
  });
});
