import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';
import { toolsCatalog } from '@/features/tools/i18n';
import { InvisibleCharacterPanel } from '@/features/tools/invisible-character-panel';
import { ToolPageShell, type ToolFaqEntry } from '@/features/tools/tool-page';
import { ToolsProvider } from '@/features/tools/tools-provider';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.toolDirectory.invisibleCharacter.title',
    'web.meta.toolDirectory.invisibleCharacter.description',
    ROUTES.toolInvisibleCharacter,
    locale,
  );
}

const FAQ: readonly ToolFaqEntry[] = [
  {
    id: 'why',
    q: 'web.toolDirectory.invisibleCharacter.faq.why.q',
    a: 'web.toolDirectory.invisibleCharacter.faq.why.a',
  },
  {
    id: 'reliability',
    q: 'web.toolDirectory.invisibleCharacter.faq.reliability.q',
    a: 'web.toolDirectory.invisibleCharacter.faq.reliability.a',
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

export default async function InvisibleCharacterPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={ROUTES.toolInvisibleCharacter}
      titleKey="web.toolDirectory.invisibleCharacter.title"
      ledeKey="web.toolDirectory.invisibleCharacter.lede"
      explainerTitleKey="web.toolDirectory.invisibleCharacter.explainer.title"
      explainerBodyKey="web.toolDirectory.invisibleCharacter.explainer.body"
      faq={FAQ}
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <InvisibleCharacterPanel />
      </ToolsProvider>
    </ToolPageShell>
  );
}
