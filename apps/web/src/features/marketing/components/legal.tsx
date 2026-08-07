import type { ReactNode } from 'react';
import type { MessageKey } from '@relay/i18n/translate';

import { Reveal } from '@/components/motion';

import { formatDate, marketingTranslator } from '../i18n';
import { LEGAL_DOCUMENTS, ROUTES } from '../site';
import { Container, Heading, Lede, List, Meta, Subheading } from './layout';
import { CounselPendingBanner } from './page-parts';
import { TextLink } from './links';

/**
 * The shell every legal document uses.
 *
 * A legal page is a Read surface, so it gets a single reading column, real
 * headings, an on this page index built from those headings, and no marketing
 * furniture at all. Where the binding wording is still with counsel the page
 * says that at the top, in a warning that names what is already accurate and
 * what is not.
 *
 * WP-3 brand-only pass: the page title picks up the display font and the
 * major rules thicken to the loud system's 2px ink outline, but the body
 * itself stays exactly the quiet, `font-serif` reading grammar it always
 * was — `layout.tsx`'s `Heading`/`Body` are deliberately untouched (see that
 * file's own doc comment) because a legal document is read, not performed.
 * The one animation is the intro's single `Reveal`; nothing below it moves.
 */

export interface LegalSectionSpec {
  readonly id: string;
  readonly titleKey: MessageKey;
  /** Paragraphs, in order. */
  readonly bodyKeys?: readonly MessageKey[];
  /** Rendered as a bulleted list under the paragraphs. */
  readonly bulletKeys?: readonly MessageKey[];
  /** Arbitrary content, for a table or a definition list. */
  readonly content?: ReactNode;
}

export interface LegalPageProps {
  readonly locale?: string;
  readonly titleKey: MessageKey;
  readonly summaryKey: MessageKey;
  readonly counselPending: boolean;
  readonly reviewed: string;
  readonly sections: readonly LegalSectionSpec[];
  /** Catalog keys for the contact addresses this document points at. */
  readonly contactKeys?: readonly MessageKey[];
}

export async function LegalPage(props: LegalPageProps): Promise<ReactNode> {
  const { titleKey, summaryKey, counselPending, reviewed, sections, contactKeys, locale } = props;
  const t = await marketingTranslator(locale);

  return (
    <Container>
      <div className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <nav aria-label={t.t('web.label.onThisPage')}>
                <h2 className="text-label text-text-tertiary">{t.t('web.label.onThisPage')}</h2>
                <ul className="mt-3 space-y-0.5">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-body-md text-text-secondary hover:text-text-primary focus-visible:outline-border-focus flex min-h-9 items-center transition-colors duration-(--duration-fast) focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        {t.format(section.titleKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <p className="border-border-subtle mt-6 border-t pt-4">
                <Meta>{t.t('web.label.lastReviewed', { date: formatDate(reviewed, locale) })}</Meta>
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-8 lg:col-start-5">
            <article className="space-y-10">
              <Reveal as="header" className="space-y-5">
                <h1 className="text-text-primary font-display text-[clamp(1.9rem,1.3rem+2.2vw,2.9rem)] leading-[1.1] tracking-[-0.02em] text-pretty">
                  {t.format(titleKey)}
                </h1>
                <Lede>{t.format(summaryKey)}</Lede>
                {counselPending ? <CounselPendingBanner locale={locale} /> : null}
              </Reveal>

              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
                  <Heading as="h2" className="text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)]">
                    {t.format(section.titleKey)}
                  </Heading>
                  {section.bodyKeys?.map((key) => (
                    <p
                      key={key}
                      className="text-body-lg text-text-secondary max-w-[70ch] leading-[1.68]"
                    >
                      {t.format(key)}
                    </p>
                  ))}
                  {section.bulletKeys ? (
                    <List items={section.bulletKeys.map((key) => t.format(key))} />
                  ) : null}
                  {section.content}
                </section>
              ))}

              {contactKeys && contactKeys.length > 0 ? (
                <section
                  id="contact"
                  className="border-border-bold scroll-mt-24 space-y-3 border-t-2 pt-8"
                >
                  <Subheading as="h3">{t.t('web.legal.contact.title')}</Subheading>
                  <p className="text-body-md text-text-secondary max-w-[70ch] leading-[1.6]">
                    {t.t('web.legal.contact.prelaunch')}
                  </p>
                  <p className="text-body-md text-text-tertiary max-w-[70ch] leading-[1.6]">
                    {t.t('web.legal.entity.pending')}
                  </p>
                </section>
              ) : null}

              <nav
                aria-label={t.t('web.legal.title')}
                className="border-border-bold border-t-2 pt-8"
              >
                <p className="text-body-md text-text-secondary">
                  <TextLink href={ROUTES.legal}>{t.t('web.legal.title')}</TextLink>
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  {LEGAL_DOCUMENTS.filter((doc) => doc.labelKey !== titleKey).map((doc) => (
                    <li key={doc.href}>
                      <TextLink href={doc.href} className="text-body-sm text-text-secondary">
                        {t.format(doc.labelKey)}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </article>
          </div>
        </div>
      </div>
    </Container>
  );
}
