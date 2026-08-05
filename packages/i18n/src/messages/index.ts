import { en } from './en/index';
import type { EnglishCatalog, MessageKey } from './en/index';

export { en };
export type { EnglishCatalog, MessageKey };

/** A complete catalog. Only English is complete in V1. */
export type Catalog = Readonly<Record<MessageKey, string>>;

/**
 * A catalog under translation. Missing keys fall back to English at runtime and
 * are reported once, so a half translated locale never shows a raw key.
 */
export type PartialCatalog = Readonly<Partial<Record<MessageKey, string>>>;

/** A catalog loader, so a locale can be code split by the host app. */
export type CatalogLoader = () => Promise<PartialCatalog>;

/**
 * Catalog registry.
 *
 * Adding a language: create `./<code>/index.ts` exporting the same keys with
 * translated values, add it here, then flip `status` to `active` in
 * `../locales.ts`. No component changes.
 */
export const CATALOGS: Readonly<Record<string, CatalogLoader>> = {
  en: async () => en,
};

/** Load a catalog by tag. Unknown or untranslated tags resolve to English. */
export async function loadCatalog(locale: string): Promise<PartialCatalog> {
  const loader = CATALOGS[locale] ?? CATALOGS[locale.split('-')[0] ?? ''];
  if (!loader) {
    return en;
  }
  return loader();
}

/** Every key in the English catalog, sorted. Used by lint and tooling. */
export function messageKeys(): readonly MessageKey[] {
  return (Object.keys(en) as MessageKey[]).sort();
}
