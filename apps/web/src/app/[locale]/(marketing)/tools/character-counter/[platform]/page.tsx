import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Body, Heading, Meta, Split } from '@/features/marketing/components/layout';
import { RowLink } from '@/features/marketing/components/links';
import { marketingTranslator } from '@/features/marketing/i18n';
import { characterCounterPath } from '@/features/marketing/site';
import { templatedPageMetadata } from '@/features/platforms/metadata';
import {
  CHARACTER_COUNTER_PAGES,
  CHARACTER_COUNTER_SLUGS,
  findCharacterCounterPage,
  linkRule,
  type CharacterCounterPage,
} from '@/features/tools/character-counter';
import { CharacterCounterPanel } from '@/features/tools/character-counter-panel';
import { toolsCatalog } from '@/features/tools/i18n';
import { ToolPageShell, type ToolFaqEntry } from '@/features/tools/tool-page';
import { ToolsProvider } from '@/features/tools/tools-provider';

/**
 * One character counter per platform, generated from the limits dataset.
 *
 * A page exists here only because the dataset carries a body text ceiling for
 * that platform, so nothing on the page has to handle a missing number. The
 * ceiling, the counting unit and the link rule all arrive as ICU arguments to
 * one shared set of sentences, which is what keeps nine pages from becoming
 * nine pieces of copy that drift apart.
 *
 * The counting itself is a client island and nothing else on the page is. What
 * a person pastes into it is an unpublished draft: it stays in the tab, and
 * there is no code path here that could send it anywhere.
 */

export function generateStaticParams(): readonly { readonly platform: string }[] {
  return CHARACTER_COUNTER_SLUGS.map((platform) => ({ platform }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly platform: string }>;
}): Promise<Metadata> {
  const { locale, platform } = await params;
  const page = findCharacterCounterPage(platform);
  if (!page) {
    return {};
  }
  const t = await marketingTranslator(locale);
  return templatedPageMetadata({
    titleKey: 'web.meta.toolDirectory.counter.title',
    descriptionKey: 'web.meta.toolDirectory.counter.description',
    values: { platform: t.format(page.nameKey) },
    path: characterCounterPath(page.slug),
    locale,
  });
}

/**
 * The first two questions are about this platform and take its values. The
 * last two are the same promise every tool on this site makes, so they reuse
 * the wording the preflight checker already answers them with.
 */
const FAQ: readonly ToolFaqEntry[] = [
  {
    id: 'counting',
    q: 'web.toolDirectory.counter.faq.counting.q',
    a: 'web.toolDirectory.counter.faq.counting.a',
  },
  {
    id: 'links',
    q: 'web.toolDirectory.counter.faq.links.q',
    a: 'web.toolDirectory.counter.faq.links.a',
  },
  {
    id: 'privacy',
    q: 'web.tools.preflight.faq.privacy.q',
    a: 'web.tools.preflight.faq.privacy.a',
  },
  {
    id: 'publish',
    q: 'web.tools.preflight.faq.publish.q',
    a: 'web.tools.preflight.faq.publish.a',
  },
];

async function RelatedCounters({
  page,
  locale,
}: {
  readonly page: CharacterCounterPage;
  readonly locale: string;
}): Promise<ReactNode> {
  const t = await marketingTranslator(locale);
  const others = CHARACTER_COUNTER_PAGES.filter((other) => other.slug !== page.slug);

  return (
    <Split aside={<Heading>{t.t('web.toolDirectory.counter.related.title')}</Heading>}>
      <Body>{t.t('web.toolDirectory.counter.related.body')}</Body>
      <ul className="border-border-default mt-8 border-t">
        {others.map((other) => (
          <RowLink
            key={other.slug}
            href={characterCounterPath(other.slug)}
            title={t.t('web.toolDirectory.counterLink.title', {
              platform: t.format(other.nameKey),
            })}
            meta={<Meta>{t.t('web.schedule.value.characters', { count: other.maxLength })}</Meta>}
          />
        ))}
      </ul>
    </Split>
  );
}

export default async function CharacterCounterPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly platform: string }>;
}): Promise<ReactNode> {
  const { locale, platform } = await params;
  const page = findCharacterCounterPage(platform);
  if (!page) {
    notFound();
  }

  const t = await marketingTranslator(locale);
  const catalog = await toolsCatalog(locale);
  const values = {
    platform: t.format(page.nameKey),
    limit: page.maxLength,
    unit: page.countingUnit,
    mode: linkRule(page),
    cost: page.charactersPerLink,
  };

  return (
    <ToolPageShell
      locale={locale}
      path={characterCounterPath(page.slug)}
      titleKey="web.toolDirectory.counter.title"
      ledeKey="web.toolDirectory.counter.lede"
      explainerTitleKey="web.toolDirectory.counter.explainer.title"
      explainerBodyKey="web.toolDirectory.counter.explainer.body"
      explainerExtraKey="web.toolDirectory.counter.explainer.links"
      faq={FAQ}
      values={values}
      showsBaselineNote
      related={<RelatedCounters page={page} locale={locale} />}
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <CharacterCounterPanel page={page} />
      </ToolsProvider>
    </ToolPageShell>
  );
}
