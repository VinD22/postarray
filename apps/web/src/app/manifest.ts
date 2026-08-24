import type { MetadataRoute } from 'next';
import { en } from '@relay/i18n';

/**
 * The web app manifest.
 *
 * English only, and deliberately so: a manifest is installed once, from
 * whatever locale the reader happened to be on, and Next serves one file for
 * the whole origin. A per locale manifest would need a route group and a
 * `manifest` link rewritten per page for a string almost nobody reads on a home
 * screen. The name comes from the catalog so a rename reaches it for free.
 *
 * The icons are the generated ones: `icon.tsx` and `apple-icon.tsx` render the
 * same array mark, so there is no committed binary to fall out of date.
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: en['web.brand.name'],
    short_name: en['web.brand.name'],
    description: en['web.brand.tagline'],
    start_url: '/',
    display: 'standalone',
    background_color: '#fffcf8',
    theme_color: '#141413',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
