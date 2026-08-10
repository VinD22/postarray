import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { toolsCatalog } from '@/features/tools/i18n';
import { ToolPageShell, type ToolFaqEntry } from '@/features/tools/tool-page';
import { ToolsProvider } from '@/features/tools/tools-provider';
import { ZonePlannerPanel } from '@/features/tools/zone-planner-panel';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.tools.timeZone.title',
    'web.meta.tools.timeZone.description',
    ROUTES.toolTimeZonePlanner,
    locale,
  );
}

const FAQ: readonly ToolFaqEntry[] = [
  { id: 'dst', q: 'web.tools.timeZone.faq.dst.q', a: 'web.tools.timeZone.faq.dst.a' },
  { id: 'storage', q: 'web.tools.timeZone.faq.storage.q', a: 'web.tools.timeZone.faq.storage.a' },
];

/**
 * The page is prerendered, so the starting zone cannot be the reader's zone.
 * UTC is the honest default: it is stated, it is selectable, and nothing here
 * silently assumes where the reader is.
 */
const DEFAULT_SOURCE_ZONE = 'UTC';

export default async function TimeZonePlannerPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={ROUTES.toolTimeZonePlanner}
      titleKey="web.tools.timeZone.title"
      ledeKey="web.tools.timeZone.lede"
      explainerTitleKey="web.tools.timeZone.explainer.title"
      explainerBodyKey="web.tools.timeZone.explainer.body"
      faq={FAQ}
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <ZonePlannerPanel sourceZone={DEFAULT_SOURCE_ZONE} />
      </ToolsProvider>
    </ToolPageShell>
  );
}
