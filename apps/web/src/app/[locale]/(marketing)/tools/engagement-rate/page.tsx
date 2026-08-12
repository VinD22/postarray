import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { toolsCatalog } from '@/features/tools/i18n';
import { ToolPageShell, type ToolFaqEntry } from '@/features/tools/tool-page';
import { ToolsProvider } from '@/features/tools/tools-provider';
import { EngagementRatePanel } from '@/features/tools/engagement-rate-panel';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.tools.engagementRate.title',
    'web.meta.tools.engagementRate.description',
    ROUTES.toolEngagementRate,
    locale,
  );
}

const FAQ: readonly ToolFaqEntry[] = [
  {
    id: 'formula',
    q: 'web.tools.engagementRate.faq.formula.q',
    a: 'web.tools.engagementRate.faq.formula.a',
  },
  {
    id: 'basis',
    q: 'web.tools.engagementRate.faq.basis.q',
    a: 'web.tools.engagementRate.faq.basis.a',
  },
];

export default async function EngagementRatePage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={ROUTES.toolEngagementRate}
      titleKey="web.tools.engagementRate.title"
      ledeKey="web.tools.engagementRate.lede"
      explainerTitleKey="web.tools.engagementRate.explainer.title"
      explainerBodyKey="web.tools.engagementRate.explainer.body"
      faq={FAQ}
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <EngagementRatePanel />
      </ToolsProvider>
    </ToolPageShell>
  );
}
