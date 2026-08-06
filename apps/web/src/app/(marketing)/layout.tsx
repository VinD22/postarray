import type { ReactNode } from 'react';

import { JsonLd } from '@/features/marketing/components/json-ld';
import { SiteFooter } from '@/features/marketing/components/site-footer';
import { SiteHeader } from '@/features/marketing/components/site-header';
import { marketingTranslator } from '@/features/marketing/i18n';
import { organizationJsonLd } from '@/features/marketing/seo';
import { PRIMARY_NAV, ROUTES } from '@/features/marketing/site';

/**
 * The public site shell.
 *
 * Everything below is a Server Component apart from the header, which needs
 * the current path for `aria-current`. The page therefore ships almost no
 * JavaScript: no data fetching, no query client, no theme flash, and a first
 * paint that is the finished page.
 */
/**
 * The public site is prerendered.
 *
 * Next 16 renders on demand unless a segment opts in, and every page in this
 * group is the same bytes for every visitor: no session, no request input, no
 * per-reader data. Serving them from cache is the difference between a CDN hit
 * and a server render per visit. A page here that genuinely needs freshness
 * overrides this with its own `dynamic` export, as `/status` does.
 */
export const dynamic = 'force-static';

export default function MarketingLayout({ children }: { children: ReactNode }): ReactNode {
  const t = marketingTranslator();

  const items = PRIMARY_NAV.map((item) => ({
    href: item.href,
    label: t.format(item.labelKey),
  }));

  return (
    <div className="bg-surface-canvas flex min-h-screen flex-col">
      <a
        href="#main"
        className="focus:border-border-default focus:bg-surface-raised focus:text-body-md focus:text-text-primary focus:outline-border-focus sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-(--z-index-toast) focus:rounded-md focus:border focus:px-4 focus:py-3 focus:outline-2 focus:outline-offset-2"
      >
        {t.t('web.skipToContent')}
      </a>

      <SiteHeader
        brand={t.t('web.brand.name')}
        navLabel={t.t('web.nav.label')}
        items={items}
        signIn={{ href: ROUTES.signIn, label: t.t('nav.public.signIn') }}
        startTrial={{ href: ROUTES.signUp, label: t.t('nav.public.startTrial') }}
        openMenu={t.t('web.nav.openMenu')}
        closeMenu={t.t('web.nav.closeMenu')}
      />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter />

      <JsonLd node={organizationJsonLd()} />
    </div>
  );
}
