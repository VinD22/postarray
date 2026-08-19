import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';
import { HashtagCounterPanel } from '@/features/tools/hashtag-counter-panel';
import { toolsCatalog } from '@/features/tools/i18n';
import { ToolPageShell, type ToolFaqEntry } from '@/features/tools/tool-page';
import { ToolsProvider } from '@/features/tools/tools-provider';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.toolDirectory.hashtagCounter.title',
    'web.meta.toolDirectory.hashtagCounter.description',
    ROUTES.toolHashtagCounter,
    locale,
  );
}

const FAQ: readonly ToolFaqEntry[] = [
  {
    id: 'limit',
    q: 'web.toolDirectory.hashtagCounter.faq.limit.q',
    a: 'web.toolDirectory.hashtagCounter.faq.limit.a',
  },
  {
    id: 'duplicate',
    q: 'web.toolDirectory.hashtagCounter.faq.duplicate.q',
    a: 'web.toolDirectory.hashtagCounter.faq.duplicate.a',
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

export default async function HashtagCounterPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={ROUTES.toolHashtagCounter}
      titleKey="web.toolDirectory.hashtagCounter.title"
      ledeKey="web.toolDirectory.hashtagCounter.lede"
      explainerTitleKey="web.toolDirectory.hashtagCounter.explainer.title"
      explainerBodyKey="web.toolDirectory.hashtagCounter.explainer.body"
      faq={FAQ}
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <HashtagCounterPanel />
      </ToolsProvider>
    </ToolPageShell>
  );
}
