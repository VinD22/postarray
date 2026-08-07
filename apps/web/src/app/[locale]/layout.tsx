import { notFound } from 'next/navigation';
import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { themeBootstrapScript } from '@relay/design-system/theme-bootstrap';

import { Providers } from '@/components/providers';
import { STATIC_WEB_LOCALE_CODES, isWebLocale } from '@/lib/i18n/development-pseudo-locales';
import { getStaticIntl } from '@/lib/i18n/server';

import '../globals.css';

/** A precise grotesk for compose, review, and schedule work. */
const uiFont = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-relay-ui',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

/** The editorial serif display face. Carries hierarchy across marketing and
 * product surfaces with a warm, high-contrast, book-like voice. */
const displayFont = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-relay-display',
  display: 'swap',
  axes: ['opsz'],
});

/** The monospace face is reserved for timestamps, tokens, and fixed-width reads. */
const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-relay-mono',
  display: 'swap',
  weight: ['400', '600'],
});

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const intl = await getStaticIntl(locale);
  const appName = intl.t.format('shell.appName');
  return {
    title: {
      default: appName,
      template: `%s · ${appName}`,
    },
    description: intl.t.format('web.meta.home.description'),
    applicationName: appName,
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light dark',
};

/** Generate every active locale from the registry. Never duplicate this list. */
export function generateStaticParams(): readonly { readonly locale: string }[] {
  return STATIC_WEB_LOCALE_CODES.map((locale) => ({ locale }));
}

/**
 * This is the application root layout, intentionally nested at `[locale]`.
 * It lets each statically generated locale render truthful document-level
 * `lang` and `dir` attributes without reading a request header or making the
 * marketing tree dynamic.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  readonly children: ReactNode;
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  if (!isWebLocale(locale)) {
    notFound();
  }

  const intl = await getStaticIntl(locale);

  return (
    <html
      lang={intl.locale}
      dir={intl.direction}
      suppressHydrationWarning
      className={`${uiFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <head>
        <script id="relay-theme-bootstrap" suppressHydrationWarning>
          {themeBootstrapScript}
        </script>
      </head>
      <body className="bg-surface-canvas text-text-primary antialiased">
        <Providers
          locale={intl.locale}
          timeZone={intl.timeZone}
          catalog={intl.catalog}
          toastRegionLabel={intl.t.format('a11y.region.notifications')}
          toastCloseLabel={intl.t.format('action.close')}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
