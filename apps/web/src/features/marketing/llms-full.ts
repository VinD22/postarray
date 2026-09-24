import { en } from '@relay/i18n';

import { BLOG_ARTICLES, blogArticlePath } from '@/features/blog/registry';
import { type BlogBlock, articleContent } from '@/features/blog/types';
import { formatLimitValue } from '@/features/platforms/format-limit';
import { DIMENSION_PLATFORMS } from '@/features/specs/dimensions';
import { SPEC_PLATFORMS } from '@/features/specs/registry';

import { formatPixels, variantLabelKey } from './data/media-dimensions';
import { marketingTranslator } from './i18n';
import { absoluteUrl } from './seo';
import { specsConstraintPath } from './site';

/**
 * `/llms-full.txt`: the article bodies and the specs dataset as plain text.
 *
 * English only, like `/llms.txt`. Values come from the same registries the
 * pages render, formatted by the same helper, so this file cannot state a
 * number a page does not. A platform value without a recorded source says so
 * rather than printing a date nobody read it on.
 */

function blockText(block: BlogBlock): readonly string[] {
  switch (block.kind) {
    case 'heading':
      return ['', `### ${block.text}`, ''];
    case 'paragraph':
      return [block.text, ''];
    case 'list':
      return [...block.items.map((item) => `- ${item}`), ''];
    case 'callout':
      return [`${block.title}: ${block.body}`, ''];
    case 'code':
      return [block.caption, ...block.lines.map((codeLine) => `    ${codeLine}`), ''];
    case 'table':
      return [
        block.caption,
        `| ${block.columns.join(' | ')} |`,
        ...block.rows.map((row) => `| ${row.join(' | ')} |`),
        '',
      ];
    case 'takeaways':
      return [block.title, ...block.items.map((item) => `- ${item}`), ''];
    case 'faq':
      return [...block.items.flatMap((item) => [`Q: ${item.q}`, `A: ${item.a}`, '']), ''];
    case 'stat':
      return [`${block.value}: ${block.label} (${block.source})`, ''];
    case 'cta':
    case 'tool':
      return [];
  }
}

export async function llmsFullText(): Promise<string> {
  const t = await marketingTranslator('en');
  const lines: string[] = [
    `# ${en['web.brand.name']}: full reference`,
    '',
    `> ${en['web.brand.tagline']}`,
    '',
    `The index is ${absoluteUrl('/llms.txt')}. This file carries the article bodies and every recorded platform value with its source.`,
    '',
    '## Platform limits (generated from the connector code)',
    '',
  ];

  for (const platform of SPEC_PLATFORMS) {
    const name = t.format(platform.nameKey);
    lines.push(`### ${name}`);
    lines.push(
      platform.source === null
        ? 'Source: not recorded.'
        : `Source: ${platform.source.url} (verified ${platform.source.readOn})`,
    );
    for (const entry of platform.entries) {
      lines.push(
        `- ${t.format(entry.constraint.nameKey)}: ${formatLimitValue(entry.value, t, 'en')} (${absoluteUrl(specsConstraintPath(platform.slug, entry.constraint.slug))})`,
      );
    }
    lines.push('');
  }

  lines.push('## Image sizes (hand maintained, each row sourced)', '');
  for (const platform of DIMENSION_PLATFORMS) {
    lines.push(`### ${t.format(platform.nameKey)}`);
    for (const row of platform.rows) {
      const label = t.format(variantLabelKey(row.variant));
      lines.push(
        `- ${label}: ${formatPixels(row)} pixels, ${row.basis}${row.aspectRatio === null ? '' : `, ${row.aspectRatio}`}. Source: ${row.source.url} (verified ${row.source.readOn})`,
      );
    }
    lines.push('');
  }

  lines.push('## Articles', '');
  for (const article of BLOG_ARTICLES) {
    const content = articleContent(article, 'en');
    lines.push(
      `## ${content.title}`,
      '',
      `URL: ${absoluteUrl(blogArticlePath(article.slug))}`,
      `Published ${article.published}, updated ${article.updated}.`,
      '',
      content.lede ?? content.description,
      '',
      ...content.blocks.flatMap(blockText),
    );
    if (article.sources.length > 0) {
      lines.push('Sources:');
      for (const source of article.sources) {
        lines.push(`- ${source.title}: ${source.url} (read ${source.readOn})`);
      }
      lines.push('');
    }
  }

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`;
}
