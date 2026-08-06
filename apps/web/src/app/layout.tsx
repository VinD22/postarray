import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import type { ReactNode } from 'react';

import { themeBootstrapScript } from '@relay/design-system/hooks';

import { Providers } from '@/components/providers';
import { getStaticIntl } from '@/lib/i18n/server';

import './globals.css';

/**
 * A precise grotesk for the product. Everything a person reads while composing,
 * reviewing or scheduling is set in this.
 */
const uiFont = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-relay-ui',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

/**
 * The editorial serif. Reserved for selected marketing headlines and pull
 * quotes. It never appears in the product shell.
 */
const editorialFont = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-relay-editorial',
  display: 'swap',
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'Relay',
    template: '%s · Relay',
  },
  description: 'A publishing desk for people and agents.',
  applicationName: 'Relay',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Never block zoom. WCAG 2.2 requires 200 percent without loss of content.
  maximumScale: 5,
  colorScheme: 'light dark',
};

export default async function RootLayout({ children }: { readonly children: ReactNode }) {
  // Static on purpose. The signed-in tree re-resolves per request; see (app)/layout.
  const intl = await getStaticIntl();

  return (
    <html
      lang={intl.locale}
      dir={intl.direction}
      suppressHydrationWarning
      className={`${uiFont.variable} ${editorialFont.variable}`}
    >
      <head>
        {/*
          First script in the document, before any stylesheet. It reads the
          stored preference and sets data-theme on <html> before first paint, so
          nobody sees a light flash on the way to a dark desk. The body is a
          compile-time constant exported by the design system: it interpolates
          nothing and reads no request input.
        */}
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
