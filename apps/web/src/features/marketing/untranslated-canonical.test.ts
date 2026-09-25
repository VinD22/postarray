import { describe, expect, it } from 'vitest';

import { formattedPageMetadata } from '@/features/platforms/metadata';

import { ROUTES } from './site';
import { absoluteUrl, localeAlternates, pageMetadata } from './seo';

/**
 * A page whose copy stays on the reviewed English source in a beta locale must
 * not publish itself as a German page: its localized URL renders, and its
 * canonical and hreflang point at the English one.
 */
describe('untranslated locale pages canonicalize to English', () => {
  it('/de/specs/x/character-limit', () => {
    const path = `${ROUTES.specs}/x/character-limit`;
    const alternates = localeAlternates(path, 'de');
    expect(alternates.canonical).toBe(absoluteUrl(path, 'en'));
    expect(Object.keys(alternates.languages)).not.toContain('de');
  });

  it('/de/specs/dimensions/youtube/video-thumbnail through the page metadata builder', () => {
    const path = `${ROUTES.specs}/dimensions/youtube/video-thumbnail`;
    const metadata = formattedPageMetadata({
      title: 'title',
      description: 'description',
      path,
      locale: 'de',
      siteName: 'Post Array',
    });
    expect(metadata.alternates?.canonical).toBe(absoluteUrl(path, 'en'));
  });

  it('/de/pricing', async () => {
    const metadata = await pageMetadata(
      'web.meta.pricing.title',
      'web.meta.pricing.description',
      ROUTES.pricing,
      'de',
    );
    expect(metadata.alternates?.canonical).toBe(absoluteUrl(ROUTES.pricing, 'en'));
    expect(Object.keys(metadata.alternates?.languages ?? {})).not.toContain('de');
  });

  it('a translated family keeps its own canonical', () => {
    expect(localeAlternates(ROUTES.useCases, 'de').canonical).toBe(
      absoluteUrl(ROUTES.useCases, 'de'),
    );
  });
});
