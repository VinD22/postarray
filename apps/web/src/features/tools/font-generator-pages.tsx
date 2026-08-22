import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import type { MessageKey } from '@relay/i18n/translate';

import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

import { FontGeneratorPanel } from './font-generator-panel';
import { toolsCatalog } from './i18n';
import { ToolPageShell, type ToolFaqEntry } from './tool-page';
import { ToolsProvider } from './tools-provider';
import type { UnicodeStyleId } from './unicode-styles';

/**
 * The text-style cluster: one hub and four pages named after the place people
 * paste the result.
 *
 * The pages differ in three things and nothing else: which styles they offer,
 * what they can honestly say about that destination, and their own copy. The
 * mapping lives in `unicode-styles.ts`, the interface in
 * `font-generator-panel.tsx`, and the page furniture in `tool-page.tsx`, so a
 * sixth page here is a route, an entry in this list and a block of catalog
 * copy.
 *
 * What none of them do: produce, host or link a font file. This cluster styles
 * text by substituting Unicode code points, which is a different thing from a
 * typeface, and the copy is required to keep that distinction visible rather
 * than trade on the ambiguity.
 */

export interface FontGeneratorPageDefinition {
  readonly id: string;
  readonly path: string;
  readonly styles: readonly UnicodeStyleId[];
  readonly metaTitleKey: MessageKey;
  readonly metaDescriptionKey: MessageKey;
  readonly titleKey: MessageKey;
  readonly ledeKey: MessageKey;
  readonly explainerTitleKey: MessageKey;
  readonly explainerBodyKey: MessageKey;
  readonly explainerExtraKey: MessageKey;
  readonly platformNoteKey: MessageKey;
  /** The one question this page answers that the others do not. */
  readonly ownFaq: ToolFaqEntry;
}

/** Asked and answered the same way on every page in the cluster. */
const SHARED_FAQ: readonly ToolFaqEntry[] = [
  {
    id: 'notAFont',
    q: 'web.toolDirectory.fontGenerator.faq.notAFont.q',
    a: 'web.toolDirectory.fontGenerator.faq.notAFont.a',
  },
  {
    id: 'accessibility',
    q: 'web.toolDirectory.fontGenerator.faq.accessibility.q',
    a: 'web.toolDirectory.fontGenerator.faq.accessibility.a',
  },
  {
    id: 'support',
    q: 'web.toolDirectory.fontGenerator.faq.support.q',
    a: 'web.toolDirectory.fontGenerator.faq.support.a',
  },
  {
    id: 'privacy',
    q: 'web.tools.preflight.faq.privacy.q',
    a: 'web.tools.preflight.faq.privacy.a',
  },
];

/** Every style the engine has, which is what the hub offers. */
const ALL_STYLES: readonly UnicodeStyleId[] = [
  'boldSerif',
  'italicSerif',
  'boldItalicSerif',
  'script',
  'scriptBold',
  'fraktur',
  'doubleStruck',
  'sans',
  'sansBold',
  'sansItalic',
  'monospace',
  'smallCaps',
  'circled',
  'squared',
  'fullwidth',
  'strikethrough',
  'underline',
];

export const FONT_GENERATOR_PAGES: readonly FontGeneratorPageDefinition[] = [
  {
    id: 'fontGenerator',
    path: ROUTES.toolFontGenerator,
    styles: ALL_STYLES,
    metaTitleKey: 'web.meta.toolDirectory.fontGenerator.title',
    metaDescriptionKey: 'web.meta.toolDirectory.fontGenerator.description',
    titleKey: 'web.toolDirectory.fontGenerator.title',
    ledeKey: 'web.toolDirectory.fontGenerator.lede',
    explainerTitleKey: 'web.toolDirectory.fontGenerator.explainer.title',
    explainerBodyKey: 'web.toolDirectory.fontGenerator.explainer.body',
    explainerExtraKey: 'web.toolDirectory.fontGenerator.explainer.extra',
    platformNoteKey: 'web.toolDirectory.fontGenerator.platformNote',
    ownFaq: {
      id: 'download',
      q: 'web.toolDirectory.fontGenerator.faq.download.q',
      a: 'web.toolDirectory.fontGenerator.faq.download.a',
    },
  },
  {
    id: 'instagramFonts',
    path: ROUTES.toolInstagramFonts,
    // Every style the engine has except plain sans, which on Instagram would
    // look like text nobody styled at all.
    styles: [
      'boldSerif',
      'italicSerif',
      'boldItalicSerif',
      'script',
      'scriptBold',
      'fraktur',
      'doubleStruck',
      'sansBold',
      'sansItalic',
      'monospace',
      'smallCaps',
      'circled',
      'squared',
      'fullwidth',
      'strikethrough',
      'underline',
    ],
    metaTitleKey: 'web.meta.toolDirectory.instagramFonts.title',
    metaDescriptionKey: 'web.meta.toolDirectory.instagramFonts.description',
    titleKey: 'web.toolDirectory.instagramFonts.title',
    ledeKey: 'web.toolDirectory.instagramFonts.lede',
    explainerTitleKey: 'web.toolDirectory.instagramFonts.explainer.title',
    explainerBodyKey: 'web.toolDirectory.instagramFonts.explainer.body',
    explainerExtraKey: 'web.toolDirectory.instagramFonts.explainer.extra',
    platformNoteKey: 'web.toolDirectory.instagramFonts.platformNote',
    ownFaq: {
      id: 'bio',
      q: 'web.toolDirectory.instagramFonts.faq.bio.q',
      a: 'web.toolDirectory.instagramFonts.faq.bio.a',
    },
  },
  {
    id: 'discordFonts',
    path: ROUTES.toolDiscordFonts,
    // No combining strikethrough or underline here: Discord has its own markup
    // for both, and a combining mark is the worse way to get the same look.
    styles: [
      'boldSerif',
      'italicSerif',
      'script',
      'scriptBold',
      'fraktur',
      'doubleStruck',
      'sansBold',
      'monospace',
      'smallCaps',
      'circled',
      'squared',
      'fullwidth',
    ],
    metaTitleKey: 'web.meta.toolDirectory.discordFonts.title',
    metaDescriptionKey: 'web.meta.toolDirectory.discordFonts.description',
    titleKey: 'web.toolDirectory.discordFonts.title',
    ledeKey: 'web.toolDirectory.discordFonts.lede',
    explainerTitleKey: 'web.toolDirectory.discordFonts.explainer.title',
    explainerBodyKey: 'web.toolDirectory.discordFonts.explainer.body',
    explainerExtraKey: 'web.toolDirectory.discordFonts.explainer.extra',
    platformNoteKey: 'web.toolDirectory.discordFonts.platformNote',
    ownFaq: {
      id: 'markdown',
      q: 'web.toolDirectory.discordFonts.faq.markdown.q',
      a: 'web.toolDirectory.discordFonts.faq.markdown.a',
    },
  },
  {
    id: 'facebookFonts',
    path: ROUTES.toolFacebookFonts,
    styles: [
      'boldSerif',
      'italicSerif',
      'boldItalicSerif',
      'script',
      'scriptBold',
      'fraktur',
      'doubleStruck',
      'monospace',
      'smallCaps',
      'circled',
      'fullwidth',
      'strikethrough',
      'underline',
    ],
    metaTitleKey: 'web.meta.toolDirectory.facebookFonts.title',
    metaDescriptionKey: 'web.meta.toolDirectory.facebookFonts.description',
    titleKey: 'web.toolDirectory.facebookFonts.title',
    ledeKey: 'web.toolDirectory.facebookFonts.lede',
    explainerTitleKey: 'web.toolDirectory.facebookFonts.explainer.title',
    explainerBodyKey: 'web.toolDirectory.facebookFonts.explainer.body',
    explainerExtraKey: 'web.toolDirectory.facebookFonts.explainer.extra',
    platformNoteKey: 'web.toolDirectory.facebookFonts.platformNote',
    ownFaq: {
      id: 'search',
      q: 'web.toolDirectory.facebookFonts.faq.search.q',
      a: 'web.toolDirectory.facebookFonts.faq.search.a',
    },
  },
  {
    id: 'cursiveFonts',
    path: ROUTES.toolCursiveFontGenerator,
    // The joined and sloped styles only. Anything blocky would be a different
    // page pretending to be this one.
    styles: ['italicSerif', 'boldItalicSerif', 'script', 'scriptBold', 'sansItalic'],
    metaTitleKey: 'web.meta.toolDirectory.cursiveFonts.title',
    metaDescriptionKey: 'web.meta.toolDirectory.cursiveFonts.description',
    titleKey: 'web.toolDirectory.cursiveFonts.title',
    ledeKey: 'web.toolDirectory.cursiveFonts.lede',
    explainerTitleKey: 'web.toolDirectory.cursiveFonts.explainer.title',
    explainerBodyKey: 'web.toolDirectory.cursiveFonts.explainer.body',
    explainerExtraKey: 'web.toolDirectory.cursiveFonts.explainer.extra',
    platformNoteKey: 'web.toolDirectory.cursiveFonts.platformNote',
    ownFaq: {
      id: 'joined',
      q: 'web.toolDirectory.cursiveFonts.faq.joined.q',
      a: 'web.toolDirectory.cursiveFonts.faq.joined.a',
    },
  },
];

export function fontGeneratorPage(id: string): FontGeneratorPageDefinition {
  const page = FONT_GENERATOR_PAGES.find((candidate) => candidate.id === id);
  if (page === undefined) {
    throw new Error(`no font generator page definition for ${id}`);
  }
  return page;
}

export function fontGeneratorMetadata(
  page: FontGeneratorPageDefinition,
  locale: string,
): Promise<Metadata> {
  return pageMetadata(page.metaTitleKey, page.metaDescriptionKey, page.path, locale);
}

export async function renderFontGeneratorPage(
  page: FontGeneratorPageDefinition,
  locale: string,
): Promise<ReactNode> {
  const catalog = await toolsCatalog(locale);

  return (
    <ToolPageShell
      locale={locale}
      path={page.path}
      titleKey={page.titleKey}
      ledeKey={page.ledeKey}
      explainerTitleKey={page.explainerTitleKey}
      explainerBodyKey={page.explainerBodyKey}
      explainerExtraKey={page.explainerExtraKey}
      faq={[page.ownFaq, ...SHARED_FAQ]}
    >
      <ToolsProvider locale={locale} catalog={catalog}>
        <FontGeneratorPanel styles={page.styles} platformNoteKey={page.platformNoteKey} />
      </ToolsProvider>
    </ToolPageShell>
  );
}
