import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import {
  fontGeneratorMetadata,
  fontGeneratorPage,
  renderFontGeneratorPage,
} from '@/features/tools/font-generator-pages';

/**
 * Defined by its entry in `FONT_GENERATOR_PAGES`: the styles it offers, what
 * it can honestly say about where the text is going, and its own copy. The
 * mapping and the interface are shared with the rest of the cluster.
 */
const PAGE = fontGeneratorPage('fontGenerator');

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return fontGeneratorMetadata(PAGE, locale);
}

export default async function FontGeneratorPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  return renderFontGeneratorPage(PAGE, locale);
}
