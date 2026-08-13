import { describe, expect, it } from 'vitest';

import { BLOG_ARTICLES, blogArticlePath } from '@/features/blog/registry';
import { absoluteUrl } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

import { GET } from './route';

describe('GET /llms.txt', () => {
  it('serves plain text with the right content type', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
  });

  it('links to pricing and every blog article with an absolute URL', async () => {
    const body = await (await GET()).text();

    expect(body).toContain(absoluteUrl(ROUTES.pricing));
    for (const article of BLOG_ARTICLES) {
      expect(body, article.slug).toContain(absoluteUrl(blogArticlePath(article.slug)));
    }
  });

  it('never claims an unbuilt capability', async () => {
    const body = await (await GET()).text();

    expect(body.toLowerCase()).not.toMatch(/\bpublishes to\b/);
  });
});
