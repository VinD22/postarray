/**
 * Catalog module parity helpers.
 *
 * Catalogs are assembled with object spreads in each locale's `index.ts`.
 * That makes an otherwise valid new namespace easy to forget: the file can
 * exist on disk while no catalog imports it. Keeping this check as a small,
 * dependency-free helper lets CI and translation tooling use the same rules.
 */

export interface CatalogModuleParity {
  readonly reference: readonly string[];
  readonly locale: readonly string[];
  readonly missing: readonly string[];
  readonly unexpected: readonly string[];
}

/**
 * Modules that may be absent from a beta catalog while their entire namespace
 * is explicitly controlled by the English fallback policy. This is temporary
 * rollout metadata, not a launch exemption. The final review gate must pass
 * with an empty list of missing modules.
 */
export const BETA_FALLBACK_CATALOG_MODULES = [
  'assistant',
  'assistant-web',
  'developer-connect',
  'digest',
  'web-tool-directory',
] as const;

export const BETA_FALLBACK_CATALOG_MODULE_PREFIXES: Readonly<
  Record<(typeof BETA_FALLBACK_CATALOG_MODULES)[number], readonly string[]>
> = {
  assistant: ['assistant.'],
  'assistant-web': ['assistantWeb.'],
  'developer-connect': ['developer.connect.'],
  digest: ['digest.', 'email.digest.'],
  'web-tool-directory': ['web.toolDirectory.', 'web.meta.toolDirectory.'],
};

export type CatalogModuleName = string;

/**
 * Compare a locale's assembled module names with the English source modules.
 * Names are normalised and sorted so reports are deterministic in CI.
 */
export function checkCatalogModuleParity(
  referenceModules: readonly string[],
  localeModules: readonly string[],
): CatalogModuleParity {
  const reference = [...new Set(referenceModules)].sort();
  const locale = [...new Set(localeModules)].sort();
  const referenceSet = new Set(reference);
  const localeSet = new Set(locale);
  return {
    reference,
    locale,
    missing: reference.filter((module) => !localeSet.has(module)),
    unexpected: locale.filter((module) => !referenceSet.has(module)),
  };
}

/** A parity result is clean when both catalogs assemble the same namespaces. */
export function isCatalogModuleParityClean(result: CatalogModuleParity): boolean {
  return result.missing.length === 0 && result.unexpected.length === 0;
}

export function findUnallowedMissingCatalogModules(
  missingModules: readonly CatalogModuleName[],
  allowedBetaFallbackModules: readonly CatalogModuleName[] = BETA_FALLBACK_CATALOG_MODULES,
): readonly CatalogModuleName[] {
  const allowed = new Set(allowedBetaFallbackModules);
  return missingModules.filter((module) => !allowed.has(module));
}
