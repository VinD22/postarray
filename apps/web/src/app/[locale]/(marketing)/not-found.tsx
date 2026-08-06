import type { ReactNode } from 'react';

import { Link } from '@/components/link';
import { MagneticButton } from '@/components/motion';
import { Container, Lede } from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { getRequestIntl } from '@/lib/i18n/server';
import { RESOURCE_LINKS, ROUTES } from '@/features/marketing/site';

/**
 * The public 404.
 *
 * It says what happened, why it might have happened here specifically, and
 * offers the pages a lost reader most often wanted. No illustration and no
 * apology theatre — the one decoration is a purely `aria-hidden` dashed
 * circle standing in for the zero, not a replacement for the real, readable
 * "404" text next to it.
 *
 * Server component, matching `apps/web/src/app/[locale]/not-found.tsx`:
 * Next.js does not pass the `[locale]` segment's params to a `not-found.tsx`
 * boundary, so the locale comes from `getRequestIntl()` (the
 * `x-relay-locale` header the middleware already sets) rather than from
 * `marketingTranslator(locale)`. The only client-side piece is the
 * `MagneticButton` leaf.
 */
export default async function MarketingNotFound(): Promise<ReactNode> {
  const { t } = await getRequestIntl();

  return (
    <Container>
      <div className="max-w-[46rem] py-16 md:py-24">
        <h1 className="sr-only">{t.t('web.notFound.title')}</h1>
        <div className="flex items-center gap-4">
          {/* The HTTP status code itself, not translated copy — every locale
              on this site keeps "404" as Western digits, the same way the
              rest of the web does. The real heading is the `sr-only` `<h1>`
              above; this is a decorative restatement of it. */}
          <p
            aria-hidden="true"
            className="font-display text-display-2xl text-text-primary leading-none"
          >
            404
          </p>
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="relay-slow-spin text-border-bold hidden size-16 shrink-0 md:block lg:size-24"
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="6 8"
            />
          </svg>
        </div>
        <Lede className="mt-6">{t.t('web.notFound.body')}</Lede>
        <p className="text-body-md text-text-tertiary mt-3 max-w-[60ch] leading-[1.6]">
          {t.t('web.notFound.v2.line')}
        </p>
        <div className="mt-8">
          <MagneticButton asChild variant="primary" className="text-body-lg h-11 px-5">
            <Link href={ROUTES.home}>{t.t('web.notFound.action')}</Link>
          </MagneticButton>
        </div>
        <ul className="border-border-default mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t pt-6">
          {RESOURCE_LINKS.slice(0, 5).map((link) => (
            <li key={link.href}>
              <TextLink href={link.href} className="text-body-md">
                {t.t(link.labelKey)}
              </TextLink>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
