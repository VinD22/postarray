/**
 * The strip's thumbnail.
 *
 * Three states, and the difference between them is the point: a file whose
 * rendition exists shows the picture, a file whose rendition has not been
 * generated keeps the neutral tile, and neither is presented as an error.
 */

import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';

import { api } from '@/lib/api/client';
import { demoSession } from '@/lib/api/fixtures';
import { SessionProvider } from '@/lib/auth/session-context';

import { MediaStrip } from './media-strip';
import type { MediaAsset } from '../../media/types';

function asset(overrides: Partial<MediaAsset> = {}): MediaAsset {
  return {
    id: 'media_01j000000000000000000001',
    name: 'launch.png',
    kind: 'image',
    mimeType: 'image/png',
    bytes: 120_000,
    width: 1200,
    height: 800,
    durationSeconds: null,
    checksum: 'abc',
    createdAt: '2026-08-04T07:00:00.000Z',
    scanState: 'clean',
    retentionExpiresAt: '2026-09-04T07:00:00.000Z',
    storageAvailable: true,
    altText: 'A launch banner',
    altTextWaived: false,
    altTextWaivedReason: null,
    altTextWaivedByName: null,
    rights: null,
    rightsDeclared: true,
    provenance: {
      origin: 'upload',
      sourceUrl: null,
      fetchedAt: null,
      declaredAuthor: null,
      declaredLicense: null,
      contentCredentials: null,
      addedByName: null,
    },
    versions: [],
    currentVersion: 1,
    usedInPostCount: null,
    thumbnailMediaId: null,
    ...overrides,
  };
}

function rendition(url: string) {
  return { url, width: 200, height: 200, expiresAt: '2026-09-04T07:00:00.000Z' };
}

function renderStrip(
  urls: { thumbnail?: string; original?: string } = {},
  overrides: Partial<MediaAsset> = {},
) {
  vi.spyOn(api.media, 'getReadUrls').mockResolvedValue({
    mediaId: 'media_01j000000000000000000001',
    thumbnail: urls.thumbnail === undefined ? null : rendition(urls.thumbnail),
    poster: null,
    original: urls.original === undefined ? null : rendition(urls.original),
  });
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <SessionProvider session={demoSession}>
        <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
          <MediaStrip
            assets={[asset(overrides)]}
            mediaIds={['media_01j000000000000000000001']}
            inherited={false}
            limit={4}
            onPick={() => undefined}
            onRemove={() => undefined}
            onEdit={() => undefined}
          />
        </I18nProvider>
      </SessionProvider>
    </QueryClientProvider>,
  );
}

describe('the composer media strip', () => {
  it('prefers a thumbnail derivative when one has been produced', async () => {
    renderStrip({ thumbnail: 'https://cdn.example.com/thumb.png' });
    const image = await screen.findByRole('img', { name: 'A launch banner' });
    expect(image).toHaveAttribute('src', 'https://cdn.example.com/thumb.png');
  });

  it('shows the original for a picture, which is what usually comes back', async () => {
    renderStrip({ original: 'https://cdn.example.com/original.png' });
    const image = await screen.findByRole('img', { name: 'A launch banner' });
    expect(image).toHaveAttribute('src', 'https://cdn.example.com/original.png');
  });

  it('never points an image element at a video file', async () => {
    const { container } = renderStrip(
      { original: 'https://cdn.example.com/clip.mp4' },
      { kind: 'video', name: 'clip.mp4', mimeType: 'video/mp4', altText: null },
    );
    await screen.findByText('clip.mp4');
    expect(container.querySelector('img')).toBeNull();
  });

  it('keeps the neutral tile when there is no picture to show', async () => {
    const { container } = renderStrip();
    await screen.findByText('launch.png');
    expect(container.querySelector('img')).toBeNull();
  });
});
