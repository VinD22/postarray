'use client';

import { Suspense, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@relay/design-system/utils';
import { useI18n } from '@relay/i18n/react';

import { Link } from '@/components/link';
import { ProductMark } from '@/components/brand/product-mark';
import { ThemePicker } from '@/components/theme-picker';
import { localizedHref } from '@/lib/i18n/routing';

import { Container } from './layout';
import { LanguagePicker, LanguagePickerFallback } from './language-picker';

export interface HeaderLink {
  readonly href: string;
  readonly label: string;
}

export interface SiteHeaderProps {
  readonly brand: string;
  readonly navLabel: string;
  readonly items: readonly HeaderLink[];
  readonly signIn: HeaderLink;
  readonly startTrial: HeaderLink;
  readonly openMenu: string;
  readonly closeMenu: string;
}

/**
 * The public header.
 *
 * This is the only client component on the marketing site, and it is one for a
 * single reason: `aria-current="page"` has to be correct, and the current path
 * is not available to a Server Component. Every string arrives as a prop, so
 * the catalog lookup still happens on the server.
 *
 * The compact menu is a native `details` disclosure rather than a state hook,
 * so it works before hydration, is announced as an expandable control without
 * any ARIA of ours, and closes on `Escape` for free. Keying it on the pathname
 * closes it after a client side navigation.
 */
export function SiteHeader(props: SiteHeaderProps): ReactNode {
  const { brand, navLabel, items, signIn, startTrial, openMenu, closeMenu } = props;
  const pathname = usePathname();
  const { locale } = useI18n();

  const isCurrent = (href: string): boolean => {
    const localizedPath = localizedHref(href, locale);
    return localizedPath === '/'
      ? pathname === '/'
      : pathname === localizedPath || pathname.startsWith(`${localizedPath}/`);
  };

  return (
    <header className="bg-surface-canvas relative sticky top-0 z-(--z-index-sticky) py-3">
      <Container>
        <div
          className={cn(
            'border-border-default bg-surface-raised flex h-16 items-stretch justify-between gap-3',
            'rounded-poster shadow-raised border px-3 sm:px-4',
          )}
        >
          <div className="flex items-center">
            <Link
              href="/"
              className={cn(
                'text-text-primary text-title-sm leading-none tracking-[-0.025em]',
                'flex min-h-11 items-center gap-3 pe-3 font-semibold',
                'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
              )}
            >
              <ProductMark />
              <span>{brand}</span>
            </Link>
          </div>

          <nav aria-label={navLabel} className="hidden min-w-0 flex-1 justify-center xl:flex">
            <ul className="flex min-w-0 items-center gap-0.5">
              {items.map((item) => {
                const current = isCurrent(item.href);
                return (
                  <li key={item.href} className="flex">
                    <Link
                      href={item.href}
                      aria-current={current ? 'page' : undefined}
                      className={cn(
                        'text-body-sm relative flex min-h-10 items-center rounded-md px-2.5 whitespace-nowrap',
                        'transition-[background-color,color] duration-(--duration-fast) ease-(--ease-standard)',
                        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                        current
                          ? 'bg-surface-sunken text-text-primary font-semibold'
                          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-1 xl:flex">
            <ThemePicker />
            <Suspense fallback={<LanguagePickerFallback />}>
              <LanguagePicker />
            </Suspense>
            <Link
              href={signIn.href}
              className={cn(
                'text-body-md text-text-secondary flex min-h-11 items-center px-3 whitespace-nowrap',
                'hover:text-text-primary transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
              )}
            >
              {signIn.label}
            </Link>
            <Link
              href={startTrial.href}
              className={cn(
                'bg-accent-action flex min-h-10 items-center rounded-md border border-transparent px-4 whitespace-nowrap',
                'text-body-md text-accent-action-on shadow-raised font-semibold',
                'transition-[background-color,transform,box-shadow] duration-(--duration-fast) ease-(--ease-standard)',
                'hover:bg-accent-action-hover hover:shadow-hard active:bg-accent-action-active active:translate-y-px',
                'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
              )}
            >
              {startTrial.label}
            </Link>
          </div>

          <details key={pathname} className="group flex items-center xl:hidden">
            <summary
              className={cn(
                'flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center gap-2',
                'text-body-md text-text-secondary rounded-md px-2',
                'marker:content-none [&::-webkit-details-marker]:hidden',
                'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
              )}
            >
              <Menu aria-hidden="true" className="size-5 group-open:hidden" />
              <X aria-hidden="true" className="hidden size-5 group-open:block" />
              <span className="group-open:hidden">{openMenu}</span>
              <span className="sr-only">{closeMenu}</span>
            </summary>

            <div className="border-border-default bg-surface-raised shadow-overlay absolute start-0 end-0 top-full mt-2 border-y">
              <Container>
                <nav aria-label={navLabel} className="py-2">
                  <ul className="border-border-subtle grid grid-cols-2 gap-x-4 border-t">
                    {items.map((item) => {
                      const current = isCurrent(item.href);
                      return (
                        <li key={item.href} className="border-border-subtle border-b">
                          <Link
                            href={item.href}
                            aria-current={current ? 'page' : undefined}
                            className={cn(
                              'text-body-lg flex min-h-12 items-center',
                              'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                              current
                                ? 'text-text-primary decoration-accent underline decoration-2 underline-offset-[0.3em]'
                                : 'text-text-secondary',
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="flex flex-wrap items-center gap-3 py-4">
                    <ThemePicker />
                    <Suspense fallback={<LanguagePickerFallback />}>
                      <LanguagePicker />
                    </Suspense>
                    <Link
                      href={startTrial.href}
                      className={cn(
                        'bg-accent-action text-body-lg text-accent-action-on flex min-h-11 items-center rounded-md px-4 font-semibold',
                        'hover:bg-accent-action-hover active:bg-accent-action-active',
                        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                      )}
                    >
                      {startTrial.label}
                    </Link>
                    <Link
                      href={signIn.href}
                      className={cn(
                        'border-border-default text-body-lg text-text-primary flex min-h-11 items-center rounded-md border px-4',
                        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                      )}
                    >
                      {signIn.label}
                    </Link>
                  </div>
                </nav>
              </Container>
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
