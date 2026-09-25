import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
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
    <footer className="border-border-strong bg-surface-inverted text-text-inverted border-t">
      <Container>
        <div className="py-16 md:py-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="font-display text-display-lg max-w-[12ch] text-balance">
                {t.t('web.brand.name')}
              </p>
              <p className="text-body-lg mt-6 max-w-[40ch] leading-[1.7] text-pretty opacity-80">
                {t.t('web.brand.tagline')}
              </p>
              <p className="text-body-sm mt-8 max-w-[58ch] leading-[1.65] opacity-60">
                {t.t('web.footer.statement')}
              </p>
            </div>

            <nav aria-label={t.t('web.nav.footerLabel')} className="lg:col-span-7">
              {FOOTER_COLUMNS.map((column) => (
                <details key={column.titleKey} className="group border-text-inverted/20 border-b">
                  <summary
                    className={cn(
                      'flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3',
                      'text-body-md font-semibold marker:content-none [&::-webkit-details-marker]:hidden',
                      'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                    )}
                  >
                    {t.format(column.titleKey)}
                    <ChevronDown
                      aria-hidden="true"
                      className="size-4 shrink-0 transition-transform duration-(--duration-base) group-open:rotate-180"
                    />
                  </summary>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2 pb-5">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'text-body-sm flex min-h-9 items-center underline decoration-transparent underline-offset-4 opacity-65',
                            'transition-[color,opacity,text-decoration-color] duration-(--duration-fast)',
                            'hover:decoration-accent-warm hover:opacity-100',
                            'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                          )}
                        >
                          {t.format(link.labelKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </nav>
          </div>

          <div className="border-text-inverted/20 mt-14 flex flex-wrap items-end justify-between gap-6 border-t pt-7">
            <p className="text-body-sm max-w-[76ch] leading-[1.6] opacity-75">
              {t.t('web.footer.noAffiliation')}
            </p>
            <p className="text-body-sm shrink-0 font-mono tabular-nums opacity-75">
              {t.t('web.footer.copyright', { year })}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
