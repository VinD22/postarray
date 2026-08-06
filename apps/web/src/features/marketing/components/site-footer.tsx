import type { ReactNode } from 'react';
import { Link } from '@/components/link';
import { cn } from '@relay/design-system/utils';

import { marketingTranslator } from '../i18n';
import { FOOTER_COLUMNS } from '../site';
import { Container } from './layout';

/**
 * The footer.
 *
 * It carries two sentences that belong on every page of a product that
 * publishes on someone behalf: what we actually do, and that a platform name
 * appearing here identifies a connector rather than claiming a partnership.
 */
export async function SiteFooter({ locale }: { locale?: string }): Promise<ReactNode> {
  const t = await marketingTranslator(locale);
  const year = new Date().getUTCFullYear();

  return (
    <footer className="border-border-default bg-surface-sunken border-t">
      <Container>
        <div className="py-12 md:py-16">
          <nav
            aria-label={t.t('web.nav.footerLabel')}
            className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5"
          >
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.titleKey}>
                <h2 className="text-label text-text-tertiary">{t.format(column.titleKey)}</h2>
                <ul className="mt-3 space-y-0.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'text-body-md text-text-secondary flex min-h-9 items-center',
                          'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                          'hover:text-text-primary',
                          'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                        )}
                      >
                        {t.format(link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-border-default mt-12 space-y-3 border-t pt-8">
            <p className="text-body-md text-text-secondary max-w-[76ch] leading-[1.6]">
              {t.t('web.footer.statement')}
            </p>
            <p className="text-body-sm text-text-tertiary max-w-[76ch] leading-[1.6]">
              {t.t('web.footer.noAffiliation')}
            </p>
            <p className="text-body-sm text-text-tertiary font-mono tabular-nums">
              {t.t('web.footer.copyright', { year })}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
