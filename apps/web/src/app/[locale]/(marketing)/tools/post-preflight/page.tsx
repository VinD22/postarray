import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { toolsCatalog } from '@/features/tools/i18n';
import { PreflightChecker } from '@/features/tools/preflight-checker';
import { ToolPageShell, type ToolFaqEntry } from '@/features/tools/tool-page';
import { ToolsProvider } from '@/features/tools/tools-provider';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.tools.preflight.title',
    'web.meta.tools.preflight.description',
    ROUTES.toolPostPreflight,
    locale,
  );
}

/** Every entry is rendered visibly by the shell, which is what makes the FAQ markup honest. */
const FAQ: readonly ToolFaqEntry[] = [
  {
    id: 'counting',
    q: 'web.tools.preflight.faq.counting.q',
    a: 'web.tools.preflight.faq.counting.a',
  },
  {
    id: 'accuracy',
    q: 'web.tools.preflight.faq.accuracy.q',
    a: 'web.tools.preflight.faq.accuracy.a',
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

export default async function PostPreflightPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={ROUTES.toolPostPreflight}
      titleKey="web.tools.preflight.title"
      ledeKey="web.tools.preflight.lede"
      explainerTitleKey="web.tools.preflight.explainer.title"
      explainerBodyKey="web.tools.preflight.explainer.body"
      explainerExtraKey="web.tools.preflight.explainer.counting"
      faq={FAQ}
      showsBaselineNote
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <PreflightChecker />
      </ToolsProvider>
    </ToolPageShell>
  );
}
