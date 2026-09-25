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

describe('the facts an agent needs without fetching another page', () => {
  /**
   * The docstring on the route has always promised a pricing summary and the
   * file never carried one, so an agent evaluating this product on a person's
   * behalf had to fetch and parse `/pricing` to learn what it costs. The
   * negative facts are here for the same reason: they are the most citable
   * thing on the site and almost nobody publishes them.
   */
  it('states the price, the plan shape and the free plan', async () => {
    const body = await (await GET()).text();

    expect(body).toContain('## Pricing');
    expect(body).toContain('$25 per month');
    expect(body).toContain('$250 per year');
    expect(body).toContain('3 active projects');
    expect(body).toContain('25 active projects');
    expect(body).toContain('no time limited trial');
  });

  it('says what the product deliberately does not do', async () => {
    const body = await (await GET()).text();

    expect(body).toContain('## What this is not');
    expect(body).toContain('does not generate images or video');
    expect(body).toContain('official platform APIs');
    expect(body).toContain('never as zero');
  });

  it('tells an agent how to connect, which is the whole differentiator', async () => {
    const body = await (await GET()).text();

    expect(body).toContain('## For agents connecting programmatically');
    expect(body).toContain('Streamable HTTP');
    expect(body).toContain('idempotency key');
    expect(body).toContain('## Definitions');
  });
});
