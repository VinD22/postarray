import { DEFAULT_LOCALE } from '@relay/i18n/locales';
import { loadCatalog, type PartialCatalog } from '@relay/i18n/messages';

/**
 * The catalog slice the interactive tools ship to the browser.
 *
 * The tools are the only marketing components that format a message on the
 * client, because their numbers do not exist until the reader types. Rather
 * than shipping the whole catalog for that, each page sends the `web.tools.`
 * keys and nothing else.
 *
 * `web.tools.` is a reviewed-English fallback namespace today, so a locale that
 * has not been translated yet carries none of these keys. English is merged
 * underneath for exactly that reason: a missing key must render the reviewed
 * sentence, never a raw key.
 */

/**
 * Platform display names travel too, because a result row names a platform.
 *
 * `web.toolDirectory.` is the namespace the generated tool pages use. It is
 * separate from `web.tools.` for a translation reason rather than a product
 * one, which `messages/en/web-tool-directory.ts` explains, but the browser
 * needs both for the same reason: a character counter formats its sentence
 * after the reader types, not before.
 */
export const TOOLS_KEY_PREFIXES = ['web.tools.', 'web.toolDirectory.', 'web.provider.'] as const;

function slice(catalog: PartialCatalog): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(catalog)) {
    if (typeof value === 'string' && TOOLS_KEY_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      out[key] = value;
    }
  }
  return out;
}

export async function toolsCatalog(locale: string): Promise<PartialCatalog> {
  const [english, localized] = await Promise.all([
    loadCatalog(DEFAULT_LOCALE),
    locale === DEFAULT_LOCALE ? Promise.resolve<PartialCatalog>({}) : loadCatalog(locale),
  ]);
  return { ...slice(english), ...slice(localized) } as PartialCatalog;
}
