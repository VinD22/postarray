import { describe, expect, it } from 'vitest';

import { BLOG_ARTICLES, blogArticlePath } from '@/features/blog/registry';
import { absoluteUrl } from '@/features/marketing/seo';
import { SPEC_PLATFORMS } from '@/features/specs/registry';

import { GET } from './route';

describe('GET /llms-full.txt', () => {
  it('carries every article URL and every sourced spec with its verified date', async () => {
    const response = await GET();
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    const body = await response.text();
    for (const article of BLOG_ARTICLES) {
      expect(body).toContain(absoluteUrl(blogArticlePath(article.slug)));
    }
    for (const platform of SPEC_PLATFORMS) {
      if (platform.source !== null) {
        expect(body).toContain(`${platform.source.url} (verified ${platform.source.readOn})`);
      }
    }
    expect(body.toLowerCase()).not.toMatch(/\bpublishes to\b/);
  });
});
