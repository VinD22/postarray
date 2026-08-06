'use client';

import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import type { ComponentProps, ReactElement } from 'react';

import { useI18n } from '@/lib/i18n';
import { localizedHref } from '@/lib/i18n/routing';

export type LocalizedLinkProps = ComponentProps<typeof NextLink>;

/**
 * Link to an internal Relay route in the current interface locale.
 *
 * External URLs, protocol-relative URLs, fragments and query-only references
 * are passed to Next unchanged. All app links should use this component rather
 * than importing `next/link` directly.
 */
export function Link({ href, ...props }: LocalizedLinkProps): ReactElement {
  const { locale } = useI18n();

  return <NextLink href={localizeInternalHref(href, locale)} {...props} />;
}

function localizeInternalHref(href: NextLinkProps['href'], locale: string): NextLinkProps['href'] {
  if (typeof href === 'string') {
    return isInternalPath(href) ? localizedHref(href, locale) : href;
  }

  if (
    typeof href.pathname === 'string' &&
    isInternalPath(href.pathname) &&
    href.protocol === undefined &&
    href.host === undefined
  ) {
    return { ...href, pathname: localizedHref(href.pathname, locale) };
  }

  return href;
}

function isInternalPath(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}
