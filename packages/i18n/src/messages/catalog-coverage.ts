/**
 * Coverage reports for high-risk catalog families.
 *
 * The general catalog test checks every key, but a family-level report makes
 * it possible to see an accidental omission in accessibility, state, email or
 * digest copy immediately. Fallbacks remain visible in the report rather than
 * being confused with translated keys.
 */

export const REQUIRED_CATALOG_FAMILY_PREFIXES = [
  'a11y.',
  'email.',
  'digest.',
  'state.',
] as const;

export interface CatalogFamilyCoverage {
  readonly prefix: string;
  readonly referenceKeys: readonly string[];
  readonly presentKeys: readonly string[];
  readonly missingKeys: readonly string[];
  readonly allowedFallbackKeys: readonly string[];
  readonly untranslatedKeys: readonly string[];
}

export function inspectCatalogFamilies(
  reference: Readonly<Record<string, string>>,
  catalog: Readonly<Record<string, string>>,
  isEnglishFallbackKey: (key: string) => boolean,
  prefixes: readonly string[] = REQUIRED_CATALOG_FAMILY_PREFIXES,
): readonly CatalogFamilyCoverage[] {
  return prefixes.map((prefix) => {
    const referenceKeys = Object.keys(reference)
      .filter((key) => key.startsWith(prefix))
      .sort();
    const presentKeys = referenceKeys.filter((key) => catalog[key] !== undefined);
    const missingKeys = referenceKeys.filter((key) => catalog[key] === undefined);
    const allowedFallbackKeys = missingKeys.filter(isEnglishFallbackKey);
    const untranslatedKeys = presentKeys.filter(
      (key) => !isEnglishFallbackKey(key) && catalog[key] === reference[key],
    );
    return {
      prefix,
      referenceKeys,
      presentKeys,
      missingKeys,
      allowedFallbackKeys,
      untranslatedKeys,
    };
  });
}

/** A family is complete when every missing key is explicitly fallback policy. */
export function isCatalogFamilyComplete(coverage: CatalogFamilyCoverage): boolean {
  return coverage.missingKeys.length === coverage.allowedFallbackKeys.length;
}

