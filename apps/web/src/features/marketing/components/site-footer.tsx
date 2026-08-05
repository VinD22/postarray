import type { ReactNode } from 'react';
import Link from 'next/link';
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
export function SiteFooter(): ReactNode {
  const t = marketingTranslator();
  const year = new Date().getUTCFullYear();

  return (
    <footer className="border-t border-border-default bg-surface-sunken">
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
                          'flex min-h-9 items-center text-body-md text-text-secondary',
                          'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                          'hover:text-text-primary',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
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

          <div className="mt-12 space-y-3 border-t border-border-default pt-8">
            <p className="max-w-[76ch] text-body-md leading-[1.6] text-text-secondary">
              {t.t('web.footer.statement')}
            </p>
            <p className="max-w-[76ch] text-body-sm leading-[1.6] text-text-tertiary">
              {t.t('web.footer.noAffiliation')}
            </p>
            <p className="font-mono text-body-sm tabular-nums text-text-tertiary">
              {t.t('web.footer.copyright', { year })}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
