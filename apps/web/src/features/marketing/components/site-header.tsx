'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@relay/design-system/utils';

import { Container } from './layout';

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

  const isCurrent = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="relative sticky top-0 z-(--z-index-sticky) border-b border-border-default bg-surface-canvas">
      <Container>
        <div className="flex h-16 items-stretch justify-between gap-4">
          <div className="flex items-center">
            <Link
              href="/"
              className={cn(
                'font-serif text-[1.4rem] leading-none tracking-[-0.02em] text-text-primary',
                'flex min-h-11 items-center pe-4',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
              )}
            >
              {brand}
            </Link>
          </div>

          <nav aria-label={navLabel} className="hidden min-w-0 lg:flex">
            <ul className="flex items-stretch">
              {items.map((item) => {
                const current = isCurrent(item.href);
                return (
                  <li key={item.href} className="flex">
                    <Link
                      href={item.href}
                      aria-current={current ? 'page' : undefined}
                      className={cn(
                        'relative flex items-center px-3 text-body-md',
                        'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                        'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-border-focus',
                        current ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
                      )}
                    >
                      {item.label}
                      {current ? (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-[-1px] start-3 end-3 h-[2px] bg-accent"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-1 lg:flex">
            <Link
              href={signIn.href}
              className={cn(
                'flex min-h-11 items-center px-3 text-body-md text-text-secondary',
                'transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:text-text-primary',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
              )}
            >
              {signIn.label}
            </Link>
            <Link
              href={startTrial.href}
              className={cn(
                'flex min-h-11 items-center rounded-md border border-transparent bg-accent px-4',
                'text-body-md font-medium text-accent-on',
                'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                'hover:bg-accent-hover active:bg-accent-active',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
              )}
            >
              {startTrial.label}
            </Link>
          </div>

          <details key={pathname} className="group flex items-center lg:hidden">
            <summary
              className={cn(
                'flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center gap-2',
                'rounded-md px-2 text-body-md text-text-secondary',
                'marker:content-none [&::-webkit-details-marker]:hidden',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
              )}
            >
              <Menu aria-hidden="true" className="size-5 group-open:hidden" />
              <X aria-hidden="true" className="hidden size-5 group-open:block" />
              <span className="group-open:hidden">{openMenu}</span>
              <span className="hidden group-open:inline">{closeMenu}</span>
            </summary>

            <div className="absolute start-0 end-0 top-16 border-b border-border-default bg-surface-canvas">
              <Container>
                <nav aria-label={navLabel} className="py-2">
                  <ul className="border-t border-border-subtle">
                    {items.map((item) => {
                      const current = isCurrent(item.href);
                      return (
                        <li key={item.href} className="border-b border-border-subtle">
                          <Link
                            href={item.href}
                            aria-current={current ? 'page' : undefined}
                            className={cn(
                              'flex min-h-12 items-center text-body-lg',
                              'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-border-focus',
                              current
                                ? 'text-text-primary underline decoration-accent decoration-2 underline-offset-[0.3em]'
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
                    <Link
                      href={startTrial.href}
                      className={cn(
                        'flex min-h-11 items-center rounded-md bg-accent px-4 text-body-lg font-medium text-accent-on',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
                      )}
                    >
                      {startTrial.label}
                    </Link>
                    <Link
                      href={signIn.href}
                      className={cn(
                        'flex min-h-11 items-center rounded-md border border-border-default px-4 text-body-lg text-text-primary',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
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
