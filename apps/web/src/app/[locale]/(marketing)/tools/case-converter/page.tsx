import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';
import { CaseConverterPanel } from '@/features/tools/case-converter-panel';
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
    'web.meta.toolDirectory.caseConverter.title',
    'web.meta.toolDirectory.caseConverter.description',
    ROUTES.toolCaseConverter,
    locale,
  );
}

const FAQ: readonly ToolFaqEntry[] = [
  {
    id: 'protected',
    q: 'web.toolDirectory.caseConverter.faq.protected.q',
    a: 'web.toolDirectory.caseConverter.faq.protected.a',
  },
  {
    id: 'titleRule',
    q: 'web.toolDirectory.caseConverter.faq.titleRule.q',
    a: 'web.toolDirectory.caseConverter.faq.titleRule.a',
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

export default async function CaseConverterPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={ROUTES.toolCaseConverter}
      titleKey="web.toolDirectory.caseConverter.title"
      ledeKey="web.toolDirectory.caseConverter.lede"
      explainerTitleKey="web.toolDirectory.caseConverter.explainer.title"
      explainerBodyKey="web.toolDirectory.caseConverter.explainer.body"
      faq={FAQ}
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <CaseConverterPanel />
      </ToolsProvider>
    </ToolPageShell>
  );
}
