import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';
import { toolsCatalog } from '@/features/tools/i18n';
import { ToolPageShell, type ToolFaqEntry } from '@/features/tools/tool-page';
import { ToolsProvider } from '@/features/tools/tools-provider';
import { VideoScriptTimerPanel } from '@/features/tools/video-script-timer-panel';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.toolDirectory.videoScriptTimer.title',
    'web.meta.toolDirectory.videoScriptTimer.description',
    ROUTES.toolVideoScriptTimer,
    locale,
  );
}

const FAQ: readonly ToolFaqEntry[] = [
  {
    id: 'pace',
    q: 'web.toolDirectory.videoScriptTimer.faq.pace.q',
    a: 'web.toolDirectory.videoScriptTimer.faq.pace.a',
  },
  {
    id: 'budget',
    q: 'web.toolDirectory.videoScriptTimer.faq.budget.q',
    a: 'web.toolDirectory.videoScriptTimer.faq.budget.a',
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

export default async function VideoScriptTimerPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={ROUTES.toolVideoScriptTimer}
      titleKey="web.toolDirectory.videoScriptTimer.title"
      ledeKey="web.toolDirectory.videoScriptTimer.lede"
      explainerTitleKey="web.toolDirectory.videoScriptTimer.explainer.title"
      explainerBodyKey="web.toolDirectory.videoScriptTimer.explainer.body"
      faq={FAQ}
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <VideoScriptTimerPanel />
      </ToolsProvider>
    </ToolPageShell>
  );
}
