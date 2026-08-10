import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { toolsCatalog } from '@/features/tools/i18n';
import { ToolPageShell, type ToolFaqEntry } from '@/features/tools/tool-page';
import { ToolsProvider } from '@/features/tools/tools-provider';
import { UtmBuilder } from '@/features/tools/utm-builder';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.tools.utm.title',
    'web.meta.tools.utm.description',
    ROUTES.toolUtmBuilder,
    locale,
  );
}

const FAQ: readonly ToolFaqEntry[] = [
  { id: 'encoding', q: 'web.tools.utm.faq.encoding.q', a: 'web.tools.utm.faq.encoding.a' },
  { id: 'existing', q: 'web.tools.utm.faq.existing.q', a: 'web.tools.utm.faq.existing.a' },
  { id: 'privacy', q: 'web.tools.utm.faq.privacy.q', a: 'web.tools.utm.faq.privacy.a' },
];

export default async function UtmBuilderPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={ROUTES.toolUtmBuilder}
      titleKey="web.tools.utm.title"
      ledeKey="web.tools.utm.lede"
      explainerTitleKey="web.tools.utm.explainer.title"
      explainerBodyKey="web.tools.utm.explainer.body"
      faq={FAQ}
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <UtmBuilder />
      </ToolsProvider>
    </ToolPageShell>
  );
}
