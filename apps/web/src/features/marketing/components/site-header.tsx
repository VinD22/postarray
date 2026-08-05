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
    <header className="border-border-default bg-surface-canvas relative sticky top-0 z-(--z-index-sticky) border-b">
      <Container>
        <div className="flex h-16 items-stretch justify-between gap-4">
          <div className="flex items-center">
            <Link
              href="/"
              className={cn(
                'text-text-primary font-serif text-[1.4rem] leading-none tracking-[-0.02em]',
                'flex min-h-11 items-center pe-4',
                'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
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
                        'text-body-md relative flex items-center px-3',
                        'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                        current
                          ? 'text-text-primary'
                          : 'text-text-secondary hover:text-text-primary',
                      )}
                    >
                      {item.label}
                      {current ? (
                        <span
                          aria-hidden="true"
                          className="bg-accent absolute start-3 end-3 bottom-[-1px] h-[2px]"
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
                'text-body-md text-text-secondary flex min-h-11 items-center px-3',
                'hover:text-text-primary transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
              )}
            >
              {signIn.label}
            </Link>
            <Link
              href={startTrial.href}
              className={cn(
                'bg-accent flex min-h-11 items-center rounded-md border border-transparent px-4',
                'text-body-md text-accent-on font-medium',
                'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                'hover:bg-accent-hover active:bg-accent-active',
                'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
              )}
            >
              {startTrial.label}
            </Link>
          </div>

          <details key={pathname} className="group flex items-center lg:hidden">
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
              <span className="hidden group-open:inline">{closeMenu}</span>
            </summary>

            <div className="border-border-default bg-surface-canvas absolute start-0 end-0 top-16 border-b">
              <Container>
                <nav aria-label={navLabel} className="py-2">
                  <ul className="border-border-subtle border-t">
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
                    <Link
                      href={startTrial.href}
                      className={cn(
                        'bg-accent text-body-lg text-accent-on flex min-h-11 items-center rounded-md px-4 font-medium',
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
