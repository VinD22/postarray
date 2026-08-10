import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { ComparisonCellView } from '@/features/comparisons/components/comparison-cell';
import { comparisonDisclosures } from '@/features/comparisons/disclosures';
import {
  COMPARISON_SLUGS,
  comparisonPath,
  findComparisonPage,
} from '@/features/comparisons/registry';
import { comparisonSources, isInternalSource } from '@/features/comparisons/types';
import type { ComparisonCell, ComparisonVerdict } from '@/features/comparisons/types';
import {
  EditorialDisplay,
  EditorialSection,
  EditorialVsTable,
  Eyebrow,
  type EditorialVsTableRow,
} from '@/features/marketing/components/editorial';
import {
  Body,
  Container,
  Heading,
  Lede,
  Meta,
  Split,
} from '@/features/marketing/components/layout';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { ExternalLink, TextLink } from '@/features/marketing/components/links';
import { CorrectionNotice } from '@/features/marketing/components/page-parts';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import type { MessageKey } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, contentPageMetadata, faqJsonLd } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

/**
 * One comparison.
 *
 * The rules this page exists to satisfy, all of them stricter than ordinary
 * marketing:
 *
 *  - Every row states the source behind each answer and the date it was read.
 *    Cells with nothing sourced say not verified, and the page explains what
 *    that means rather than leaving a reader to assume the worst or the best.
 *  - The section listing what this product does not do is not an afterthought
 *    at the bottom. It sits directly under the table, and its numbers are read
 *    from the code that decides them.
 *  - The only structured data is `FAQPage`, built from the questions this page
 *    actually renders, plus the breadcrumb. There is deliberately no review,
 *    rating or aggregate rating markup: we have no reviews, and marking up
 *    ratings we do not have is both dishonest and a policy breach.
 */

const VERDICT_KEY: Readonly<Record<ComparisonVerdict, MessageKey>> = {
  yes: 'web.comparison.state.yes',
  no: 'web.comparison.state.no',
  partial: 'web.comparison.state.partial',
  notVerified: 'web.comparison.state.notVerified',
};

export function generateStaticParams(): readonly { readonly slug: string }[] {
  return COMPARISON_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = findComparisonPage(slug);
  if (!page) {
    return {};
  }

  return contentPageMetadata(page.title, page.description, comparisonPath(page.slug), locale);
}

export default async function ComparisonPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly slug: string }>;
}): Promise<ReactNode> {
  const { locale, slug } = await params;
  const page = findComparisonPage(slug);
  if (!page) {
    notFound();
  }

  const t = await marketingTranslator(locale);
  const disclosures = comparisonDisclosures();
  const sources = comparisonSources(page);

  const cellView = (cell: ComparisonCell): ReactNode => (
    <ComparisonCellView
      cell={cell}
      verdictLabel={t.format(VERDICT_KEY[cell.verdict])}
      {...(cell.source === undefined
        ? {}
        : {
            readLabel: t.t('web.comparison.label.sourceRead', {
              date: formatDate(cell.source.readOn, locale),
            }),
          })}
    />
  );

  const rows: readonly EditorialVsTableRow[] = page.rows.map((row) => ({
    id: row.id,
    label: row.claim,
    cells: { ours: cellView(row.ours), theirs: cellView(row.theirs) },
  }));

  return (
    <>
      <EditorialSection reveal={false} containerClassName="py-20 md:py-28">
        <div className="max-w-[52rem]">
          <p className="mb-6">
            <TextLink href={ROUTES.compare}>{t.t('web.comparison.label.backToIndex')}</TextLink>
          </p>
          <Eyebrow className="mb-6">{t.t('web.comparison.eyebrow')}</Eyebrow>
          <EditorialDisplay as="h1" size="md" reveal>
            {page.title}
          </EditorialDisplay>
          <Lede className="mt-8">{page.lede}</Lede>
          <div className="border-border-subtle mt-8 flex flex-wrap gap-x-8 gap-y-1 border-t pt-4">
            <Meta>
              {t.t('web.comparison.label.checked', { date: formatDate(page.checked, locale) })}
            </Meta>
            <Meta>
              {t.t('web.comparison.label.nextReview', {
                date: formatDate(page.nextReview, locale),
              })}
            </Meta>
          </div>
        </div>
      </EditorialSection>

      <EditorialSection rule id="fit" reveal={false}>
        <Split aside={<Heading>{t.t('web.comparison.bestFor.title')}</Heading>}>
          <dl className="space-y-6">
            <div>
              <dt className="text-label text-text-tertiary">
                {t.t('web.comparison.bestFor.ours')}
              </dt>
              <dd className="text-body-lg text-text-secondary mt-2 max-w-[62ch] leading-[1.65]">
                {page.bestForOurs}
              </dd>
            </div>
            <div>
              <dt className="text-label text-text-tertiary">
                {t.t('web.comparison.bestFor.alternative', { name: page.alternative })}
              </dt>
              <dd className="text-body-lg text-text-secondary mt-2 max-w-[62ch] leading-[1.65]">
                {page.bestForAlternative}
              </dd>
            </div>
          </dl>
        </Split>
      </EditorialSection>

      <EditorialSection rule id="table" reveal={false}>
        <Heading className="max-w-[32ch]">{t.t('web.comparison.table.title')}</Heading>
        <div className="mt-10">
          <EditorialVsTable
            caption={t.t('web.comparison.table.caption')}
            rowHeaderLabel={t.t('web.comparison.label.claim')}
            columns={[
              { id: 'ours', label: t.t('web.brand.name'), tone: 'own' },
              { id: 'theirs', label: page.alternative },
            ]}
            rows={rows}
            trueLabel={t.t('web.comparison.state.yes')}
            falseLabel={t.t('web.comparison.state.no')}
          />
        </div>
        <div className="mt-10 space-y-4">
          {page.notes.map((note) => (
            <Body key={note}>{note}</Body>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection rule id="not-done" reveal={false}>
        <Split aside={<Heading>{t.t('web.comparison.notDo.title')}</Heading>}>
          <ul className="border-border-default space-y-4 border-t pt-6">
            {disclosures.map((disclosure) => (
              <li
                key={disclosure.id}
                className="text-body-lg text-text-primary max-w-[62ch] leading-[1.65]"
              >
                {t.format(disclosure.messageKey, { count: disclosure.count })}
              </li>
            ))}
          </ul>
          <p className="text-body-md text-text-secondary mt-6 max-w-[62ch] leading-[1.6]">
            {t.t('web.comparison.notDo.body')}
          </p>
        </Split>
      </EditorialSection>

      <EditorialSection rule id="method" reveal={false}>
        <Split aside={<Heading>{t.t('web.comparison.method.title')}</Heading>}>
          <Body>{t.t('web.comparison.method.body')}</Body>
          <div className="mt-6 space-y-2">
            <h3 className="text-title-sm text-text-primary">
              {t.t('web.comparison.notVerified.title')}
            </h3>
            <Body>{t.t('web.comparison.notVerified.body')}</Body>
          </div>
          <p className="text-body-md text-text-secondary mt-6 max-w-[62ch] leading-[1.6]">
            {t.t('web.comparison.method.cadence')}
          </p>
          <p className="mt-6">
            <TextLink href={ROUTES.methodology}>{t.t('nav.public.methodology')}</TextLink>
          </p>
        </Split>
      </EditorialSection>

      <EditorialSection rule id="questions" reveal={false}>
        <Heading className="max-w-[28ch]">{t.t('web.comparison.questions.title')}</Heading>
        <dl className="border-border-default mt-8 border-t">
          {page.questions.map((entry) => (
            <div key={entry.question} className="border-border-subtle border-b py-6">
              <dt className="text-title-sm text-text-primary max-w-[62ch]">{entry.question}</dt>
              <dd className="text-body-lg text-text-secondary mt-2 max-w-[62ch] leading-[1.65]">
                {entry.answer}
              </dd>
            </div>
          ))}
        </dl>
      </EditorialSection>

      <EditorialSection rule id="sources" reveal={false}>
        <Split aside={<Heading>{t.t('web.comparison.sources.title')}</Heading>}>
          <ul className="space-y-3">
            {sources.map((source) => (
              <li key={source.url} className="text-body-md leading-[1.6]">
                {isInternalSource(source) ? (
                  <TextLink href={source.url}>{source.title}</TextLink>
                ) : (
                  <ExternalLink href={source.url}>{source.title}</ExternalLink>
                )}{' '}
                <Meta>
                  {t.t('web.comparison.label.sourceRead', {
                    date: formatDate(source.readOn, locale),
                  })}
                </Meta>
              </li>
            ))}
          </ul>
        </Split>
      </EditorialSection>

      <Container>
        <div className="py-16 md:py-20">
          <CorrectionNotice locale={locale} />
        </div>
      </Container>

      <JsonLd node={faqJsonLd([...page.questions], locale)} />
      <JsonLd
        node={breadcrumbJsonLd(
          [
            { name: t.t('web.brand.name'), path: ROUTES.home },
            { name: t.t('web.compare.title'), path: ROUTES.compare },
            { name: page.title, path: comparisonPath(page.slug) },
          ],
          locale,
        )}
      />
    </>
  );
}
