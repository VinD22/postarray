import { en } from '@relay/i18n';

import { WEB_PLAN_TIERS, priceUnits } from '@/features/billing/tiers';
import { BLOG_ARTICLES, blogArticlePath } from '@/features/blog/registry';
import { articleContent, articleLocales } from '@/features/blog/types';
import { absoluteUrl } from '@/features/marketing/seo';
import { ROUTES, TOOL_LINKS } from '@/features/marketing/site';

/**
 * A plain-text context file for AI systems (llmstxt.org): what this product is,
 * what it costs, what it deliberately does not do, and how an agent connects to
 * it.
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
    '## Pricing',
    '',
    // Derived from the tier table, not retyped. The docstring above has always
    // promised a pricing summary and the file has never carried one, so an
    // agent evaluating this product had to fetch and parse `/pricing` to learn
    // the single most decision-relevant fact about it.
    ...WEB_PLAN_TIERS.map(
      (tier) =>
        `- ${en[tier.nameKey]}: $${priceUnits(tier.monthlyPriceMinor)} per month, or $${priceUnits(
          tier.annualPriceMinor,
        )} per year. ${tier.projectAllowance} active projects.`,
    ),
    `- A year costs ten months, so the saving is two months on every tier.`,
    `- ${en['billing.tier.everyFeature']}. A tier buys active project capacity and nothing else.`,
    `- ${en['web.home.v2.sticker.trial']} There is no time limited trial: a credit is spent when a post is actually published, and running out refuses the next publish and nothing else.`,
    '',
    '## What this is not',
    '',
    // Negative facts are disproportionately citable and almost nobody publishes
    // them. Every line here is a rule the codebase enforces, not a positioning
    // statement.
    '- It does not generate images or video. There is no AI media generation of any kind, and no endpoint, button or meter for one.',
    '- It publishes only through official platform APIs. There is no browser automation, no cookie replay and no unofficial endpoint.',
    '- It does not automate engagement: no auto-likes, auto-follows, engagement pods, unsolicited replies or DMs.',
    '- It does not claim a best time to post. That would require inventing confidence we do not have; the queue states its windows plainly instead.',
    '- A capability that is not built is reported as `not_implemented`, and one the platform does not offer as `unsupported`. These are different states and the interface shows them differently.',
    '- A metric we could not fetch is reported as unavailable, never as zero.',
    '',
    '## For agents connecting programmatically',
    '',
    `- Remote MCP server over Streamable HTTP, at the endpoint published on ${absoluteUrl(
      ROUTES.developers,
    )}. Tools are grouped by risk: read, reversible, and consequential.`,
    '- Authentication is OAuth with per-tool scopes. There are no unauthenticated tools.',
    '- Consequential tools require an idempotency key, which is rejected rather than defaulted when missing.',
    '- Publishing requires a human confirmation minted by the server. An agent host displaying its own dialog is not an authorization fact and is not accepted as one.',
    '- The same application services back the web app, the REST API, the MCP server, the CLI and signed webhooks, so no surface can bypass approval, tenancy or idempotency.',
    '- Every publication produces an immutable receipt.',
    '',
    '## Definitions',
    '',
    '- Project: one business inside a workspace, with its own connected accounts, calendar, approvals and receipts. One account runs many projects.',
    '- Master version: the single draft an author writes once, from which a platform-native variant is derived per account.',
    '- Receipt: the immutable record that one post reached one account, carrying the external id, the permalink and the content checksum.',
    '- Publishing credit: one published post on the free plan. Spent on publication, never on scheduling.',
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
