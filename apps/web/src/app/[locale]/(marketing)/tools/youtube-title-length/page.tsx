import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { toolsCatalog } from '@/features/tools/i18n';
import { ToolPageShell, type ToolFaqEntry } from '@/features/tools/tool-page';
import { ToolsProvider } from '@/features/tools/tools-provider';
import { YouTubeTitleChecker } from '@/features/tools/youtube-title-checker';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.tools.youtubeTitle.title',
    'web.meta.tools.youtubeTitle.description',
    ROUTES.toolYouTubeTitle,
    locale,
  );
}

const FAQ: readonly ToolFaqEntry[] = [
  {
    id: 'limit',
    q: 'web.tools.youtubeTitle.faq.limit.q',
    a: 'web.tools.youtubeTitle.faq.limit.a',
  },
  {
    id: 'truncation',
    q: 'web.tools.youtubeTitle.faq.truncation.q',
    a: 'web.tools.youtubeTitle.faq.truncation.a',
  },
  {
    id: 'emoji',
    q: 'web.tools.youtubeTitle.faq.emoji.q',
    a: 'web.tools.youtubeTitle.faq.emoji.a',
  },
];

export default async function YouTubeTitleLengthPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={ROUTES.toolYouTubeTitle}
      titleKey="web.tools.youtubeTitle.title"
      ledeKey="web.tools.youtubeTitle.lede"
      explainerTitleKey="web.tools.youtubeTitle.explainer.title"
      explainerBodyKey="web.tools.youtubeTitle.explainer.body"
      faq={FAQ}
      showsBaselineNote
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <YouTubeTitleChecker />
      </ToolsProvider>
    </ToolPageShell>
  );
}
