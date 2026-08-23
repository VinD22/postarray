import { findEnglishPassThroughKeys, findMissingKeys } from '../review-gate';

/**
 * A machine-readable snapshot of one locale's translation debt. Missing keys
 * are split into explicit beta fallbacks and undeclared omissions so a release
 * check cannot mistake a permitted temporary fallback for complete coverage.
 */
export interface CatalogAudit {
  readonly locale: string;
  readonly totalKeys: number;
  readonly presentKeys: number;
  readonly missingKeys: readonly string[];
  readonly allowedFallbackKeys: readonly string[];
  readonly undeclaredMissingKeys: readonly string[];
  readonly englishPassThroughKeys: readonly string[];
}

export function auditCatalog(
  locale: string,
  catalog: Readonly<Record<string, string>>,
  reference: Readonly<Record<string, string>>,
  isEnglishFallbackKey: (key: string) => boolean,
): CatalogAudit {
  const referenceKeys = Object.keys(reference);
  const missingKeys = findMissingKeys(catalog, reference, () => false);
  const allowedFallbackKeys = missingKeys.filter(isEnglishFallbackKey);
  const undeclaredMissingKeys = missingKeys.filter((key) => !isEnglishFallbackKey(key));
  return {
    locale,
    totalKeys: referenceKeys.length,
    presentKeys: referenceKeys.length - missingKeys.length,
    missingKeys,
    allowedFallbackKeys,
    undeclaredMissingKeys,
    englishPassThroughKeys: findEnglishPassThroughKeys(
      catalog,
      reference,
      isEnglishFallbackKey,
    ),
  };
}

/** A catalog is launch-ready only when it has no fallback or pass-through debt. */
export function isCatalogAuditLaunchReady(audit: CatalogAudit): boolean {
  return (
    audit.missingKeys.length === 0 &&
    (audit.locale === 'en' || audit.englishPassThroughKeys.length === 0)
  );
}
