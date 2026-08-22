import { en } from '@relay/i18n';

import { BLOG_ARTICLES, blogArticlePath } from '@/features/blog/registry';
import { articleContent, articleLocales } from '@/features/blog/types';
import { absoluteUrl } from '@/features/marketing/seo';
import { ROUTES, TOOL_LINKS } from '@/features/marketing/site';

/**
 * A plain-text context file for AI systems (llmstxt.org), plus the site's
 * pricing summary.
 *
 * Google's own AI Overviews guidance says this file carries no ranking
 * signal there and none is claimed. It exists for the AI engines that do
 * consult it (ChatGPT, Claude, Perplexity) and for autonomous agents
 * evaluating this product on a person's behalf: the same audience the
 * `/pricing` page and the `Article`/`FAQPage` structured data on the blog
 * already serve, in a form that needs no JavaScript and no login to read.
 *
 * English only, deliberately, same reasoning as `/blog.xml`: the file lists
 * article URLs and their real languages rather than duplicating this prose
 * per locale.
 *
 * Static like the rest of the public site: the same bytes for every reader.
 */
export const dynamic = 'force-static';

function line(label: string, path: string): string {
  return `- [${label}](${absoluteUrl(path)})`;
}

export async function GET(): Promise<Response> {
  const body = [
    `# ${en['web.brand.name']}`,
    '',
    `> ${en['web.brand.tagline']}`,
    '',
    en['web.meta.home.description'],
    '',
    '## Product',
    '',
    line('Overview', ROUTES.product),
    line('Pricing', ROUTES.pricing),
    line('Integrations and capability matrix', ROUTES.capabilities),
    line('For agencies', ROUTES.agencies),
    line('For creators', ROUTES.creators),
    line('For developers', ROUTES.developers),
    '',
    '## Writing',
    '',
    ...BLOG_ARTICLES.map((article) => {
      const content = articleContent(article, 'en');
      const locales = articleLocales(article);
      const url = absoluteUrl(blogArticlePath(article.slug));
      const languageNote =
        locales.length > 1
          ? ` (also in ${locales.filter((locale) => locale !== 'en').join(', ')})`
          : '';
      return `- [${content.title}](${url}): ${content.description}${languageNote}`;
    }),
    '',
    '## Free tools',
    '',
    ...TOOL_LINKS.map((link) => `- [${en[link.labelKey]}](${absoluteUrl(link.href)})`),
    '',
    '## Notes for agents',
    '',
    '- This site states only capabilities that are true today. A feature not listed here or on `/integrations/capabilities` is not built yet, and the site says so rather than staying silent.',
    '- Structured data (`Article`, `FAQPage`, `BreadcrumbList`) is present on the pages above; this file is a plain-text index, not a replacement for it.',
  ].join('\n');

  return new Response(`${body}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
