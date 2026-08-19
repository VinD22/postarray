import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';
import { toolsCatalog } from '@/features/tools/i18n';
import { ThreadSplitterPanel } from '@/features/tools/thread-splitter-panel';
import { ToolPageShell, type ToolFaqEntry } from '@/features/tools/tool-page';
import { ToolsProvider } from '@/features/tools/tools-provider';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.toolDirectory.threadSplitter.title',
    'web.meta.toolDirectory.threadSplitter.description',
    ROUTES.toolThreadSplitter,
    locale,
  );
}

const FAQ: readonly ToolFaqEntry[] = [
  {
    id: 'boundaries',
    q: 'web.toolDirectory.threadSplitter.faq.boundaries.q',
    a: 'web.toolDirectory.threadSplitter.faq.boundaries.a',
  },
  {
    id: 'limit',
    q: 'web.toolDirectory.threadSplitter.faq.limit.q',
    a: 'web.toolDirectory.threadSplitter.faq.limit.a',
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

export default async function ThreadSplitterPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={ROUTES.toolThreadSplitter}
      titleKey="web.toolDirectory.threadSplitter.title"
      ledeKey="web.toolDirectory.threadSplitter.lede"
      explainerTitleKey="web.toolDirectory.threadSplitter.explainer.title"
      explainerBodyKey="web.toolDirectory.threadSplitter.explainer.body"
      explainerExtraKey="web.toolDirectory.threadSplitter.explainer.links"
      faq={FAQ}
      showsBaselineNote
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <ThreadSplitterPanel />
      </ToolsProvider>
    </ToolPageShell>
  );
}
