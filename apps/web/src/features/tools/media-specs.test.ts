import { describe, expect, it } from 'vitest';

import { PUBLISHING_LIMITS } from '@/features/marketing/data/publishing-limits';

import { MEDIA_SPEC_PLATFORMS } from './media-specs';

/**
 * The cheat sheet may only print what the dataset holds.
 *
 * The failure this guards against is the ordinary one for a page like this: a
 * table shaped for the platform with the most recorded fields, filled in for
 * every other platform with zeros. A zero byte ceiling is not a small limit, it
 * is a missing one, and a reader cannot tell the difference from a cell.
 */

function rowIds(slug: string): readonly string[] {
  return (
    MEDIA_SPEC_PLATFORMS.find((platform) => platform.slug === slug)?.rows.map((row) => row.id) ?? []
  );
}

describe('media spec tables', () => {
  it('states no value the dataset does not carry', () => {
    for (const platform of MEDIA_SPEC_PLATFORMS) {
      const media = PUBLISHING_LIMITS[platform.provider].media;
      expect(media, platform.slug).not.toBeNull();

      for (const row of platform.rows) {
        expect(row.value.kind, `${platform.slug}:${row.id}`).not.toBe('unavailable');
      }

      const byteFields = {
        imageBytes: media?.maxImageBytes ?? null,
        gifBytes: media?.maxGifBytes ?? null,
        videoBytes: media?.maxVideoBytes ?? null,
        documentBytes: media?.maxDocumentBytes ?? null,
      } as const;

      for (const [id, value] of Object.entries(byteFields)) {
        const row = platform.rows.find((candidate) => candidate.id === id);
        if (value === null) {
          expect(row, `${platform.slug}:${id}`).toBeUndefined();
        } else {
          expect(row?.value, `${platform.slug}:${id}`).toEqual({ kind: 'bytes', bytes: value });
        }
      }

      const duration = platform.rows.find((candidate) => candidate.id === 'videoDuration');
      if (media?.maxDurationSeconds === null) {
        expect(duration, platform.slug).toBeUndefined();
      } else {
        expect(duration?.value, platform.slug).toEqual({
          kind: 'seconds',
          max: media?.maxDurationSeconds,
          min: media?.minDurationSeconds,
        });
      }

      const altText = platform.rows.find((candidate) => candidate.id === 'altText');
      if (media?.maxAltTextLength === null) {
        expect(altText, platform.slug).toBeUndefined();
      } else {
        expect(altText?.value, platform.slug).toEqual({
          kind: 'characters',
          count: media?.maxAltTextLength,
        });
      }
    }
  });

  it('omits a platform this build ships no adapter for, rather than tabling zeros', () => {
    expect(PUBLISHING_LIMITS.google_business_profile.media).toBeNull();
    expect(MEDIA_SPEC_PLATFORMS.map((platform) => platform.provider)).not.toContain(
      'google_business_profile',
    );
  });

  it('keeps a recorded count of none, which is a fact rather than a gap', () => {
    expect(PUBLISHING_LIMITS.youtube.media?.maxImages).toBe(0);

    const images = MEDIA_SPEC_PLATFORMS.find((platform) => platform.slug === 'youtube')?.rows.find(
      (row) => row.id === 'images',
    );

    expect(images?.value).toEqual({ kind: 'files', count: 0 });
  });

  it('drops the video rows on a platform that takes no video', () => {
    expect(PUBLISHING_LIMITS.pinterest.media?.maxVideoBytes).toBeNull();
    expect(PUBLISHING_LIMITS.pinterest.media?.maxDurationSeconds).toBeNull();

    expect(rowIds('pinterest')).not.toContain('videoBytes');
    expect(rowIds('pinterest')).not.toContain('videoDuration');
    expect(rowIds('pinterest')).toContain('imageBytes');
  });

  it('shows a document ceiling only where one is recorded', () => {
    expect(rowIds('linkedin')).toContain('documentBytes');
    expect(rowIds('x')).not.toContain('documentBytes');
  });

  it('cites the same source the dataset carries for every table', () => {
    for (const platform of MEDIA_SPEC_PLATFORMS) {
      expect(platform.source, platform.slug).toBe(PUBLISHING_LIMITS[platform.provider].source);
      expect(platform.rows.length, platform.slug).toBeGreaterThan(0);
    }
  });
});
