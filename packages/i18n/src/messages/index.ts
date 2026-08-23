import { en } from './en/index';
import type { EnglishCatalog, MessageKey } from './en/index';
import { createPseudoCatalog, isPseudoLocale } from '../pseudo';

export { en };
export type { EnglishCatalog, MessageKey };

/** A complete catalog. Launch review promotes a locale only after parity. */
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
  es: async () => (await import('./es/index')).es,
  'es-419': async () => (await import('./es-419/index')).es419,
  'pt-BR': async () => (await import('./pt-BR/index')).ptBR,
  fr: async () => (await import('./fr/index')).fr,
  de: async () => (await import('./de/index')).de,
  it: async () => (await import('./it/index')).it,
  nl: async () => (await import('./nl/index')).nl,
  pl: async () => (await import('./pl/index')).pl,
  cs: async () => (await import('./cs/index')).cs,
  sv: async () => (await import('./sv/index')).sv,
  tr: async () => (await import('./tr/index')).tr,
  ru: async () => (await import('./ru/index')).ru,
  uk: async () => (await import('./uk/index')).uk,
  ar: async () => (await import('./ar/index')).ar,
  he: async () => (await import('./he/index')).he,
  hi: async () => (await import('./hi/index')).hi,
  id: async () => (await import('./id/index')).id,
  vi: async () => (await import('./vi/index')).vi,
  th: async () => (await import('./th/index')).th,
  fil: async () => (await import('./fil/index')).fil,
  'zh-Hans': async () => (await import('./zh-Hans/index')).zhHans,
  'zh-Hant': async () => (await import('./zh-Hant/index')).zhHant,
  ja: async () => (await import('./ja/index')).ja,
  ko: async () => (await import('./ko/index')).ko,
};

/** Load a catalog by tag. Unknown or untranslated tags resolve to English. */
export async function loadCatalog(locale: string): Promise<PartialCatalog> {
  if (isPseudoLocale(locale)) {
    return createPseudoCatalog(locale.toLowerCase() === 'en-xb' ? 'bidi' : 'accented');
  }

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

export {
  BETA_FALLBACK_CATALOG_MODULES,
  BETA_FALLBACK_CATALOG_MODULE_PREFIXES,
  checkCatalogModuleParity,
  findUnallowedMissingCatalogModules,
  isCatalogModuleParityClean,
} from './module-parity';
export type { CatalogModuleName, CatalogModuleParity } from './module-parity';

export {
  inspectCatalogFamilies,
  isCatalogFamilyComplete,
  REQUIRED_CATALOG_FAMILY_PREFIXES,
} from './catalog-coverage';
export type { CatalogFamilyCoverage } from './catalog-coverage';

export { auditCatalog, isCatalogAuditLaunchReady } from './catalog-audit';
export type { CatalogAudit } from './catalog-audit';
