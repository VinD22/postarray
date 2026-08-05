import type { ReactNode } from 'react';

import { Container, Display, Lede } from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { marketingTranslator } from '@/features/marketing/i18n';
import { RESOURCE_LINKS, ROUTES } from '@/features/marketing/site';

/**
 * The public 404.
 *
 * It says what happened, why it might have happened here specifically, and
 * offers the pages a lost reader most often wanted. No illustration and no
 * apology theatre.
 */
export default function MarketingNotFound(): ReactNode {
  const t = marketingTranslator();

  return (
    <Container>
      <div className="max-w-[46rem] py-16 md:py-24">
        <Display>{t.t('web.notFound.title')}</Display>
        <Lede className="mt-6">{t.t('web.notFound.body')}</Lede>
        <div className="mt-8">
          <Cta href={ROUTES.home}>{t.t('web.notFound.action')}</Cta>
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-border-default pt-6">
          {RESOURCE_LINKS.slice(0, 5).map((link) => (
            <li key={link.href}>
              <TextLink href={link.href} className="text-body-md">
                {t.format(link.labelKey)}
              </TextLink>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
