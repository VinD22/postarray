import type { ReactNode } from 'react';
import { Camera } from 'lucide-react';
import { Notice } from '@relay/design-system/patterns';
import { cn } from '@relay/design-system/utils';

import { formatDate, marketingTranslator } from '../i18n';
import type { Citation } from '../data/connectors';
import { Container, Display, Lede, Meta } from './layout';
import { ExternalLink } from './links';

/**
 * The opening band of every marketing page.
 *
 * One h1, one standfirst, an optional action row and an optional dated meta
 * line. It is not a hero: there is no background treatment, no floating
 * screenshot and no eyebrow above the heading. The heading carries the page.
 */
export function PageIntro({
  title,
  lede,
  actions,
  meta,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}): ReactNode {
  return (
    <div className="bg-surface-canvas">
      <Container>
        <div className="max-w-[46rem] py-14 md:py-20 lg:py-24">
          <Display>{title}</Display>
          {lede ? <Lede className="mt-6">{lede}</Lede> : null}
          {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}
          {meta ? <div className="mt-6">{meta}</div> : null}
          {children}
        </div>
      </Container>
    </div>
  );
}

/** A dated citation to the official documentation a claim came from. */
export async function SourceNote({
  citation,
  label,
  className,
  locale,
}: {
  citation: Citation;
  /** Human readable destination, for example the platform doc title. */
  label: string;
  className?: string;
  locale?: string;
}): Promise<ReactNode> {
  const t = await marketingTranslator(locale);
  return (
    <p className={cn('text-body-sm text-text-tertiary leading-[1.6]', className)}>
      <ExternalLink href={citation.url}>{label}</ExternalLink>{' '}
      <Meta>{t.t('web.label.researchDate', { date: formatDate(citation.readOn, locale) })}</Meta>
    </p>
  );
}

/** The review stamp shown under a page that makes dated claims. */
export async function ReviewStamp({
  reviewedOn,
  nextReviewOn,
  className,
  locale,
}: {
  reviewedOn: string;
  nextReviewOn?: string;
  className?: string;
  locale?: string;
}): Promise<ReactNode> {
  const t = await marketingTranslator(locale);
  return (
    <p className={cn('flex flex-wrap gap-x-5 gap-y-1', className)}>
      <Meta>{t.t('web.label.lastReviewed', { date: formatDate(reviewedOn, locale) })}</Meta>
      {nextReviewOn ? (
        <Meta>{t.t('web.label.nextReview', { date: formatDate(nextReviewOn, locale) })}</Meta>
      ) : null}
    </p>
  );
}

/** Every page that makes a dated claim ends with a way to challenge it. */
export async function CorrectionNotice({ locale }: { locale?: string }): Promise<ReactNode> {
  const t = await marketingTranslator(locale);
  return (
    <div className="border-border-default border-t pt-6">
      <h2 className="text-title-sm text-text-primary">{t.t('web.correction.title')}</h2>
      <p className="text-body-md text-text-secondary mt-2 max-w-[64ch] leading-[1.6]">
        {t.t('web.correction.body')}
      </p>
      <p className="mt-2">
        <a
          href={`mailto:${t.t('web.correction.email')}`}
          className={cn(
            'text-body-sm text-text-primary decoration-border-strong font-mono underline',
            'hover:text-text-accent hover:decoration-accent underline-offset-[0.22em]',
            'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
          )}
        >
          {t.t('web.correction.email')}
        </a>
      </p>
    </div>
  );
}

/**
 * A product screenshot.
 *
 * There is exactly one honest way to render this before the surface exists:
 * say that the capture is pending and describe what will be in it. A drawn
 * interface, an invented dashboard or a stock device frame would be a
 * fabricated screenshot, which this project treats as fraud rather than as
 * marketing licence.
 */
export async function ProductShot({
  src,
  alt,
  caption,
  capturedOn,
  locale,
}: {
  src?: string;
  alt: string;
  caption: ReactNode;
  capturedOn?: string;
  locale?: string;
}): Promise<ReactNode> {
  const t = await marketingTranslator(locale);

  return (
    <figure className="space-y-3">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- static asset, sized in CSS
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="border-border-default w-full rounded-[var(--radius-editorial)] border"
        />
      ) : (
        <div
          className={cn(
            'flex items-start gap-3 rounded-[var(--radius-editorial)] border border-dashed',
            'border-border-default bg-surface-sunken p-6',
          )}
        >
          <Camera aria-hidden="true" className="text-text-tertiary mt-0.5 size-5 shrink-0" />
          <div className="min-w-0 space-y-1">
            <p className="text-title-sm text-text-primary">{t.t('web.product.shot.pending')}</p>
            <p className="text-body-md text-text-secondary max-w-[60ch] leading-[1.6]">
              {t.t('web.product.shot.pendingReason')}
            </p>
            <p className="text-body-sm text-text-tertiary max-w-[60ch] leading-[1.6]">{alt}</p>
          </div>
        </div>
      )}
      <figcaption className="text-body-sm text-text-tertiary max-w-[64ch] leading-[1.6]">
        {caption}
        {capturedOn ? (
          <>
            {' '}
            <Meta>{formatDate(capturedOn, locale)}</Meta>
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** The banner on a legal page whose binding wording is still with counsel. */
export async function CounselPendingBanner({ locale }: { locale?: string }): Promise<ReactNode> {
  const t = await marketingTranslator(locale);
  return (
    <Notice
      tone="warning"
      title={t.t('web.legal.counselPending.title')}
      description={t.t('web.legal.counselPending.body')}
      className="[&_p]:text-warning-fg [&_div]:text-warning-fg"
    />
  );
}
