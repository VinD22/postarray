'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useI18n } from '@relay/i18n/react';

import { isWebLocale } from './development-pseudo-locales';
import { localizedHref } from './routing';

/** Keep imperative navigation in the interface locale, just like `<Link>`. */
export function useLocalizedRouter() {
  const router = useRouter();
  const { locale } = useI18n();

  return useMemo(
    () => ({
      back: router.back,
      forward: router.forward,
      refresh: router.refresh,
      push: (href: string, options?: { readonly scroll?: boolean }) =>
        router.push(localizeNavigationHref(href, locale), options),
      replace: (href: string, options?: { readonly scroll?: boolean }) =>
        router.replace(localizeNavigationHref(href, locale), options),
      prefetch: (href: string) => router.prefetch(localizeNavigationHref(href, locale)),
    }),
    [locale, router],
  );
}

export function localizeNavigationHref(href: string, locale: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;

  const firstSegment = href.split(/[/?#]/u)[1];
  if (firstSegment !== undefined && isWebLocale(firstSegment)) return href;

  return localizedHref(href, locale);
}
