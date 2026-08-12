import type { ReactNode } from 'react';

import { toolsCatalog } from '@/features/tools/i18n';
import { ToolsProvider } from '@/features/tools/tools-provider';
import { EngagementRatePanel } from '@/features/tools/engagement-rate-panel';
import { PreflightChecker } from '@/features/tools/preflight-checker';
import { ZonePlannerPanel } from '@/features/tools/zone-planner-panel';

import type { BlogToolId } from '../types';

/**
 * Mounts one of the free tools inside an article, in the reader's language.
 *
 * A Server Component so `toolsCatalog(locale)` resolves before any client
 * JavaScript runs: the panel's own labels are correct on first paint, the same
 * way the standalone tool pages work. This is the only place a `BlogBlock` may
 * cause a client component to mount, and the mapping below is exhaustive, so
 * an article can select a tool but never supply one of its own.
 */

const SOURCE_ZONE = 'UTC';

function ToolPanel({ tool }: { readonly tool: BlogToolId }): ReactNode {
  switch (tool) {
    case 'zone-planner':
      return <ZonePlannerPanel sourceZone={SOURCE_ZONE} />;
    case 'engagement-rate':
      return <EngagementRatePanel />;
    case 'preflight':
      return <PreflightChecker />;
  }
}

export async function ArticleTool({
  tool,
  caption,
  locale,
}: {
  readonly tool: BlogToolId;
  readonly caption: string;
  readonly locale: string;
}): Promise<ReactNode> {
  const catalog = await toolsCatalog(locale);

  return (
    <figure className="border-border-bold space-y-4 border-y-2 py-6">
      <ToolsProvider locale={locale} catalog={catalog}>
        <ToolPanel tool={tool} />
      </ToolsProvider>
      <figcaption className="text-body-sm text-text-tertiary max-w-[64ch] leading-[1.6]">
        {caption}
      </figcaption>
    </figure>
  );
}
